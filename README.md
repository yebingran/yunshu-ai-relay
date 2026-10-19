<div align="center">
  <img src="./web/public/yunsuguan-logo.png" alt="云速管" width="180" height="53" />
  <h1>云速管 AI 平台</h1>
  <p>云速管旗下 AI 平台，集中管理模型接入、团队权限与使用成本。</p>
  <p><a href="https://www.yunsuguan.com/">云速管官网</a> · <a href="./deploy/1panel/README.md">1Panel 部署指南</a> · <a href="https://github.com/yebingran/yunsuguanai/actions/workflows/publish-yunsuguanai.yml">镜像构建</a></p>
</div>

## 平台介绍

云速管 AI 平台面向开发者与协作团队，将已获授权的模型服务接入同一工作空间，提供统一接口、访问管理、使用记录和成本查看能力。

- **模型接入**：对接 OpenAI、Anthropic、Google Gemini、DeepSeek、Qwen 等受支持的上游服务；实际模型和能力以配置及上游授权为准。
- **团队协作**：管理用户、分组、API 密钥与访问权限。
- **运营管理**：集中查看请求日志、用量、额度与成本。
- **云速管前端**：使用云速管品牌与中文首页，提供模型分类展示，支持移动设备和多语言。
- **自主部署**：支持 Docker 镜像部署，可通过 1Panel 管理应用、数据库和反向代理。

本仓库提供平台软件，不附带可直接调用的模型额度或上游密钥。首次部署后，需创建管理员、配置上游渠道及可用模型，并创建用于客户端调用的 API 密钥。

## 安装到 1Panel

推荐使用仓库提供的独立编排，包含应用、PostgreSQL 和 Redis：

- [docker-compose.yml](./deploy/1panel/docker-compose.yml)
- [.env.example](./deploy/1panel/.env.example)
- [完整部署、端口、更新与备份说明](./deploy/1panel/README.md)

镜像发布位置：

```text
ghcr.io/yebingran/yunsuguanai:latest
ghcr.io/yebingran/yunsuguanai:sha-<完整 Git 提交 SHA>
```

镜像由 GitHub Actions 构建，支持 `linux/amd64` 和 `linux/arm64`。请先确认对应构建成功；公开镜像可直接拉取，私有镜像需配置仓库认证。生产环境建议使用版本标签，并记录当前部署版本。

编排默认通过容器网络让 OpenResty 访问应用，不发布应用、数据库或 Redis 的宿主机端口。网站对外使用 HTTPS；具体配置见部署指南。

## 本地修改与发布

```text
本地修改并验证 → 推送 main → Actions 构建并验证镜像 → 1Panel 拉取镜像并重建应用容器
```

```bash
cd web
bun install --frozen-lockfile
bun run dev --port 5173
```

前端开发服务默认代理到本地后端 `http://localhost:3000`；未启动后端时，涉及接口的功能不能正常使用。构建完整应用可使用仓库根目录的 Dockerfile。

```bash
docker build -t yunsuguanai:local .
```

## 版本与数据

镜像更新会替换应用程序。数据库、应用数据和日志应保存在独立挂载目录中。升级前备份数据库及应用数据，并记录原镜像版本；涉及数据库迁移时，仅切换旧镜像不一定能恢复旧版本，需配合备份评估回滚。

## 开源来源与许可证

本项目基于 [QuantumNous/new-api](https://github.com/QuantumNous/new-api) 修改，保留其网关和管理能力，并加入云速管品牌、定制首页与镜像发布及 1Panel 部署配置。原项目说明保存在 [README.upstream.md](./README.upstream.md)。

项目遵循 [GNU AGPLv3](./LICENSE) 及 [NOTICE](./NOTICE) 中的附加署名条款。部署、修改和分发时需保留许可证、作者及第三方声明，并遵守适用的源码提供义务。

Frontend design and development by New API contributors.

第三方组件声明见 [THIRD-PARTY-LICENSES.md](./THIRD-PARTY-LICENSES.md)。
