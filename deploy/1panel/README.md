# 云枢 AI · 1Panel 部署

已有 SQLite 站点升级：停容器备份完整数据目录，保留原有挂载路径、端口、SESSION_SECRET 与代理配置，只替换镜像地址。不要用空 data 目录覆盖业务数据，也不要把 PostgreSQL 编排直接套用到 SQLite 站点。

简易编排见 [docker-compose.sqlite.yml](./docker-compose.sqlite.yml)，端口映射为 `3300:3000`。新镜像默认私有，先在 1Panel 添加 `ghcr.io` 镜像仓库认证（GitHub 用户名与具有 `read:packages` 权限的令牌），再拉取镜像。

下面保留完整 PostgreSQL + Redis 的部署参考。

# 云速管 AI 平台：1Panel 部署与更新

此方案将应用、PostgreSQL 和 Redis 作为一个独立编排管理；使用 1Panel 已有的 OpenResty 提供域名、HTTPS 与反向代理。编排默认不向宿主机发布应用和数据库端口。

## 1. 镜像与准备工作

镜像：`ghcr.io/yebingran/yunshu-ai-relay:latest`，以及 `sha-<完整 Git 提交 SHA>` 版本标签。支持 AMD64 与 ARM64；先在仓库 Actions 中确认相应构建成功。镜像保持私有，在 1Panel 的容器镜像仓库中配置有 `read:packages` 权限的 GitHub 认证。不要把仓库令牌写进 Compose 或提交到 Git。

先准备：

1. 一个已解析到服务器的域名，例如 `ai.example.com`；示例域名不代表已经配置。
2. 1Panel 中已安装并运行的 OpenResty。
3. 服务器能通过出站 HTTPS 拉取 GHCR、PostgreSQL 和 Redis 镜像，并能连接要调用的上游模型服务。
4. 足够的磁盘和内存。建议起步按 2 核、4 GB 内存规划（这是容量建议，并非软件最低要求）；实际以用户数、并发、日志量和监控为准。

## 2. 检查 OpenResty 网络

在 1Panel 的容器网络页面，或终端查看：

```bash
docker network ls
docker network inspect 1panel-network
```

从输出中核对：

- 网络确实存在，且 OpenResty 容器已经连接到该网络。
- `IPAM.Config` 中实际的 IPv4 `Subnet`，例如 `172.18.0.0/16`。这只是示例，必须使用本机实际值。

如果 OpenResty 使用的是其他网络，下面的 `ONEPANEL_NETWORK` 填实际名称。应用加入这一网络后，代理可直接访问 `http://yunsuguanai-app:3000`。数据库和 Redis 只加入单独的内部网络。

## 3. 创建编排与环境文件

把本目录的 `docker-compose.yml` 和 `.env.example` 上传到服务器同一目录，例如 `/opt/yunsuguanai/deploy/`。复制 `.env.example` 为 `.env`，然后填写真实值：

```bash
cd /opt/yunsuguanai/deploy
cp .env.example .env
chmod 600 .env
openssl rand -hex 32
openssl rand -hex 32
openssl rand -hex 32
```

将三次独立生成的值分别填入：

- `POSTGRES_PASSWORD`
- `REDIS_PASSWORD`
- `SESSION_SECRET`

使用十六进制值，可避免连接 URL 中特殊字符需要转义的问题。不要把以上值填为相同内容，也不要上传真实 `.env` 到 GitHub。

其余变量：

| 变量 | 填写方式 |
| --- | --- |
| `PUBLIC_ORIGIN` | 完整 HTTPS 来源，例如 `https://ai.example.com`，不带路径或末尾斜杠；若有非默认端口，需要包含端口 |
| `ONEPANEL_NETWORK` | OpenResty 实际所在的网络，常见为 `1panel-network` |
| `TRUSTED_PROXIES` | 上一步网络的实际 CIDR；限制在受控代理网络内，不要填 `0.0.0.0/0` |
| `DATA_ROOT` | 固定绝对数据目录，默认 `/opt/yunsuguanai` |
| `IMAGE_TAG` | 初次可用 `latest`；生产建议填构建成功的 `sha-<完整提交 SHA>` |

在 1Panel **容器 → 编排 → 创建** 中使用路径选择，选取上传的编排文件。确保 `.env` 与该文件同目录；若当前版本采用编辑器方式，需一并配置对应环境变量，不能只粘贴 YAML 而遗漏变量。

可先在该目录检查配置，避免在共享日志中打印解析后的秘密：

```bash
docker compose --env-file .env -f docker-compose.yml config --quiet
```

启动后查看三个服务状态。PostgreSQL 和 Redis 健康后，应用才启动。首次初始化可能需要等待；在容器日志中检查具体原因，不要反复重装数据库。

## 4. 配置网站、HTTPS 和反向代理

在 1Panel 中为你的实际域名创建反向代理网站：

```text
代理目标：http://yunsuguanai-app:3000
```

此地址是容器网络地址：不要在 OpenResty 容器里使用 `127.0.0.1:3000` 指代应用。若应用无法解析，先检查双方是否处于同一网络。

申请或配置证书，并启用 HTTPS。确保代理保留正确的 Host 和转发来源，并支持流式输出和 WebSocket。若使用自定义代理配置，可在 OpenResty 的 `http` 级配置中定义下面的映射（不能放进 `server` 或 `location` 内）：

```nginx
map $http_upgrade $yunsuguan_connection_upgrade {
    default upgrade;
    '' close;
}
```

然后在 1Panel 生成的代理 `location` 中核对以下设置；不要直接覆盖整个网站配置。如果 1Panel 已生成对应映射，复用其变量，不要重复定义：

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection $yunsuguan_connection_upgrade;
proxy_buffering off;
proxy_read_timeout 600s;
proxy_send_timeout 600s;
```

`Connection` 头应根据实际升级请求设置，避免对全部普通 HTTP 请求固定发送 `upgrade`。在支持自定义 `http` 级配置时，可定义标准的 upgrade map；若不确定，应保留并核对 1Panel 自带 WebSocket 配置。

根据需要的图片、音频或文件上传大小调整网站请求体大小限制；如果前面还接了 CDN，也要检查 CDN 的超时、缓存与 WebSocket 设置，不要缓存 `/api/`、`/v1/` 等动态接口。

本编排默认 `SESSION_COOKIE_SECURE=true`。完成 HTTPS 后再进行登录和初始化；直接通过 HTTP 访问可能无法正常维持登录。实际浏览器来源必须与 `PUBLIC_ORIGIN` 一致，否则登录刷新等请求会被拒绝。

## 5. 需要开放的端口

| 端口 | 用途 | 是否对公网开放 |
| --- | --- | --- |
| TCP 443 | HTTPS 网站、客户端 API、WebSocket | 是 |
| TCP 80 | HTTP 跳转 HTTPS、HTTP-01 证书验证 | 建议；只用 DNS 验证且不提供 HTTP 时可按需关闭 |
| TCP 3000 | 应用容器内部 HTTP | 否；OpenResty 通过共享容器网络访问 |
| TCP 5432 | PostgreSQL 内部连接 | 否 |
| TCP 6379 | Redis 内部连接 | 否 |
| 1Panel 实际管理端口 | 访问面板 | 仅管理 IP/VPN，按面板实际配置 |
| 实际 SSH 端口 | 服务器运维 | 仅管理 IP/VPN，默认常见为 22，按服务器实际配置 |

安全组和服务器防火墙都要核对。当前 YAML 没有 `ports` 发布，不能直接访问 `服务器IP:3000`，这是本方案的预期行为。

服务器需有出站 DNS 与 HTTPS 访问能力，以拉取镜像和调用上游接口；不需要为本项目额外开放相应的入站端口。

## 6. 首次使用

1. 通过实际 HTTPS 域名打开网站，完成管理员初始化。
2. 在系统设置中确认站点名称、Logo 和外部访问地址。前端将上游默认名称映射为云速管；邮件等服务端文案应在系统设置中设置为云速管。
3. 配置你有权使用的上游模型服务、可用模型、分组及计费。
4. 创建客户端使用的 API 密钥；客户端 OpenAI 兼容基础地址为 `https://你的域名/v1`。
5. 发起小额测试请求，核对流式响应、日志与用量记录。仓库不包含可使用的上游密钥或免费额度。

## 7. 日常更新

本地修改验证后推送 `main`，新的 Actions 会构建并验证两个架构。只有两个架构都成功后，才发布多架构 `latest` 与提交版本标签。不要在构建尚未完成时更新服务器。

更新前记录当前镜像版本并完成备份。然后在 1Panel 中拉取镜像并重建应用服务；只重启现有容器不会自动替换镜像。终端等效操作如下：

```bash
cd /opt/yunsuguanai/deploy
# 若使用固定版本，先把 .env 的 IMAGE_TAG 改为新的 sha-<完整提交 SHA>。
docker compose --env-file .env -f docker-compose.yml pull app
docker compose --env-file .env -f docker-compose.yml up -d --no-deps app
docker compose --env-file .env -f docker-compose.yml ps
```

前后端已一同打包进镜像，无需另装 Node.js、Bun 或 Go，也不需要额外安装一个前端站点。

## 8. 数据、备份与回滚

固定挂载目录：

```text
/opt/yunsuguanai/app-data
/opt/yunsuguanai/logs
/opt/yunsuguanai/postgres
/opt/yunsuguanai/redis
```

若自定义 `DATA_ROOT`，以自定义值为准。更新时保留这些目录和原 `.env`。不要通过删除数据目录来解决升级问题。日志还可能由应用写入文件，除 Docker 日志限额外，也要监控 `logs` 目录占用。

数据库备份示例（先创建备份目录）：

```bash
cd /opt/yunsuguanai/deploy
mkdir -p /opt/yunsuguanai/backups
docker compose --env-file .env -f docker-compose.yml exec -T postgres \
  pg_dump -U yunsuguan -d yunsuguanai -Fc \
  > "/opt/yunsuguanai/backups/database-$(date +%Y%m%d-%H%M%S).dump"
```

同时备份应用数据、Redis 持久化数据、`.env`、编排文件及当前镜像版本，保存到独立位置。需要一致性快照时安排维护窗口暂停写入，或使用数据库/存储支持的一致性备份；不要把运行中的 PostgreSQL 数据目录直接复制当作可靠备份。定期验证恢复过程。

镜像回滚：修改 `IMAGE_TAG` 为原提交标签，再拉取并重建应用。若升级执行了数据库迁移，旧程序不一定能使用新结构，需先评估并按备份恢复流程处理。

首次初始化后，修改 `.env` 中的 `POSTGRES_PASSWORD` 不会自动更改 PostgreSQL 已有账号密码；改密码需要同时更新数据库实际账号和连接配置。不要随意轮换 `SESSION_SECRET`，它会影响既有登录；涉及加密数据时还应评估 `CRYPTO_SECRET` 与密钥保留要求。

## 9. 常见问题

- **镜像不存在 / manifest unknown**：确认云速管镜像工作流成功，标签拼写与完整提交 SHA 一致。
- **unauthorized / denied**：本项目镜像私有，给 1Panel 配置有 `read:packages` 权限的只读镜像凭证，并确认该 GitHub 账号可以访问本仓库。
- **502**：核对 `yunsuguanai-app` 健康状态、容器网络和 OpenResty 代理地址。
- **登录刷新被拒绝 / 登录状态丢失**：核对 HTTPS、代理来源头、`PUBLIC_ORIGIN` 与实际浏览器来源。
- **流式输出一段时间后中断**：核对 OpenResty 与 CDN 超时、缓冲和上游服务超时。
- **模型不可用**：核对上游授权、渠道连通性、模型名称、分组与额度。
- **资源不足**：查看容器内存、磁盘、数据库和日志占用；服务器无需承担镜像编译工作。

## 开源声明

此发行版基于 QuantumNous/new-api，加入云速管前端和部署配置。许可证、署名与第三方声明保留在仓库及镜像 `/licenses/` 中，部署者需继续保留适用声明。主 README 介绍云速管产品；上游说明保存在 `README.upstream.md`。
