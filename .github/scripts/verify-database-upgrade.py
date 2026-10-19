"""Exercise fresh startup and deployed-version upgrades on disposable CI databases."""
import json
import os
from pathlib import Path
import secrets
import sqlite3
import subprocess
import tempfile
import time
import urllib.request

NEW_IMAGE = os.environ['NEW_IMAGE']
OLD_IMAGE = 'ghcr.io/yebingran/yunsuguanai:sha-c4e820cd1a21a20f6b6d56065b2a4d324f1f306a'
PORT = 13991


def sql(dialect, database, statement):
    if dialect == 'sqlite':
        with sqlite3.connect(database) as connection:
            return connection.execute(statement).fetchall()
    if dialect == 'mysql':
        command = ['docker', 'exec', '-e', 'MYSQL_PWD=ci-only-password', os.environ['MYSQL_CONTAINER'],
                   'mysql', '-uroot', '-N', '-B', database, '-e', statement]
    else:
        command = ['docker', 'exec', os.environ['POSTGRES_CONTAINER'], 'psql', '-U', 'postgres',
                   '-d', database, '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-c', statement]
    return subprocess.check_output(command, text=True).strip()


def start_and_stop(environment, directory, label, old=False):
    log_path = directory / (label + '.log')
    with log_path.open('w') as log:
        name = 'yunshu-database-verification'
        command = ['docker', 'run', '--rm', '--name', name, '--network', 'host',
                   '-v', f'{directory}:/data']
        for key in ['SESSION_SECRET', 'SQL_DSN', 'LOG_SQL_DSN', 'CHANNEL_UPSTREAM_MODEL_UPDATE_TASK_ENABLED']:
            if key in environment:
                command += ['-e', f'{key}={environment[key]}']
        command += [OLD_IMAGE if old else NEW_IMAGE, '--port', str(PORT)]
        process = subprocess.Popen(command, stdout=log, stderr=subprocess.STDOUT)
        try:
            deadline = time.monotonic() + 120
            while time.monotonic() < deadline:
                if process.poll() is not None:
                    raise RuntimeError(f'{label} exited before readiness; see {log_path}')
                try:
                    with urllib.request.urlopen(f'http://127.0.0.1:{PORT}/api/status', timeout=2) as response:
                        if json.load(response).get('success') is True:
                            break
                except (OSError, ValueError):
                    pass
                time.sleep(0.5)
            else:
                raise RuntimeError(f'{label} readiness timed out; see {log_path}')
        except BaseException:
            print(log_path.read_text(), flush=True)
            raise
        finally:
            subprocess.run(['docker', 'stop', '--time', '20', name], check=False, stdout=subprocess.DEVNULL)
            try:
                process.wait(timeout=30)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()
            # Both images run as root; allow the CI fixture to read/write the
            # stopped container's disposable database and SQLite sidecar files.
            subprocess.run(['sudo', 'chown', '-R', f'{os.getuid()}:{os.getgid()}', str(directory)], check=True)


subprocess.run(['docker', 'pull', OLD_IMAGE], check=True)
for dialect in ['sqlite', 'mysql', 'postgres']:
    for mode in ['fresh', 'upgrade']:
        directory = Path(tempfile.mkdtemp(prefix=f'yunshu-{dialect}-{mode}-'))
        environment = os.environ.copy()
        environment.update(SESSION_SECRET=secrets.token_hex(32),
                           CHANNEL_UPSTREAM_MODEL_UPDATE_TASK_ENABLED='false')
        environment.pop('SQL_DSN', None)
        environment.pop('LOG_SQL_DSN', None)
        database = directory / 'one-api.db'
        log_database = database
        if dialect != 'sqlite':
            database = f'yunshu_{dialect}_{mode}'
            log_database = database + '_logs'
            for name in [database, log_database]:
                charset = ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci' if dialect == 'mysql' else ''
                sql(dialect, 'mysql' if dialect == 'mysql' else 'postgres', f'CREATE DATABASE {name}{charset}')
            if dialect == 'mysql':
                template = 'root:ci-only-password@tcp(127.0.0.1:3306)/{}?charset=utf8mb4&parseTime=True&loc=Local'
            else:
                template = 'postgres://postgres:ci-only-password@127.0.0.1:5432/{}?sslmode=disable'
            environment['SQL_DSN'] = template.format(database)
            environment['LOG_SQL_DSN'] = template.format(log_database)
        start_and_stop(environment, directory, f'{dialect}-{mode}-initial', old=mode == 'upgrade')
        key_column = '`key`' if dialect == 'mysql' else '"key"'
        sql(dialect, database, f"INSERT INTO options ({key_column}, value) VALUES ('YunshuMigrationFixture', 'preserve-this-value')")
        sql(dialect, log_database, "INSERT INTO audit_logs (event_id, created_at, category, action, content) VALUES ('yunshu-migration-fixture', 100, 'operation', 'fixture', 'preserve-this-audit-event')")
        before_option = sql(dialect, database, f"SELECT value FROM options WHERE {key_column} = 'YunshuMigrationFixture'")
        before_audit = sql(dialect, log_database, "SELECT content FROM audit_logs WHERE event_id = 'yunshu-migration-fixture'")
        for restart in range(2):
            start_and_stop(environment, directory, f'{dialect}-{mode}-restart-{restart}')
            assert sql(dialect, database, f"SELECT value FROM options WHERE {key_column} = 'YunshuMigrationFixture'") == before_option
            assert sql(dialect, log_database, "SELECT content FROM audit_logs WHERE event_id = 'yunshu-migration-fixture'") == before_audit
        if dialect == 'sqlite':
            assert sql(dialect, database, 'PRAGMA integrity_check') == [('ok',)]
            version = sqlite3.sqlite_version
        else:
            version = sql(dialect, database, 'SELECT version()')
        print(f'PASS: {dialect} {version}; {mode}; two restarts; primary and audit records preserved', flush=True)
