<div align="center">
  <img src="./web/public/yunsuguan-logo.png" alt="云速管" width="180" height="53" />
  <h1>云枢 AI · Yunshu AI Relay</h1>
  <p>云速管旗下 AI 平台，集中管理模型接入、团队权限与使用成本。</p>
  <p><a href="https://www.yunsuguan.com/">云速管官网</a> · <a href="./deploy/1panel/README.md">1Panel 部署指南</a> · <a href="https://github.com/yebingran/yunshu-ai-relay/actions/workflows/publish-yunshu.yml">镜像构建</a></p>
</div>

**项目演示：[ai.yunsuguan.com](https://ai.yunsuguan.com/)**

云枢，寓意云端模型的连接枢纽。统一接入，一处管理。

## 平台介绍

云枢 AI 是云速管旗下的 AI 中转与模型管理平台，面向开发者与协作团队，将已获授权的模型服务接入同一工作空间，提供统一接口、访问管理、使用记录和成本查看能力。

- **模型接入**：对接 OpenAI、Anthropic、Google Gemini、DeepSeek、Qwen 等受支持的上游服务；实际模型和能力以配置及上游授权为准。
- **团队协作**：管理用户、分组、API 密钥与访问权限。
- **运营管理**：集中查看请求日志、用量、额度与成本。
- **云速管前端**：使用云速管品牌与中文首页，提供模型分类展示，支持移动设备和多语言。
- **自主部署**：支持 Docker 镜像部署，可通过 1Panel 管理应用、数据库和反向代理。

本仓库提供平台软件，不附带可直接调用的模型额度或上游密钥。首次部署后，需创建管理员、配置上游渠道及可用模型，并创建用于客户端调用的 API 密钥。

## 赞助与生态伙伴

### 翼龙云 · 国际云服务

由 [翼龙云 · www.yilongcloud.com](https://www.yilongcloud.com/) 提供赞助。提供阿里云国际、腾讯云国际、AWS、Microsoft Azure、Google Cloud 等国际云厂商账号及配套服务，支持代充值与云资源采购咨询，协助团队管理多云资源。具体服务范围与条件以翼龙云官网为准。

### 云速管 · 自研云账号管理平台

[云速管 · www.yunsuguan.com](https://www.yunsuguan.com/) 是自研云账号管理平台，围绕多云账号、客户协作、资源与费用管理，帮助团队集中处理日常云业务。

### 翼镜 AI · 无限画布

[翼镜 AI · wuxian.yunsuguan.com](https://wuxian.yunsuguan.com/) 提供可自部署的 AI 无限画布，接入 MiniMax H3 视频生成能力，主打低成本视频创作与可视化工作流。模型可用性、部署方式及实际价格以站内说明为准。

## 安装到 1Panel

单机可使用 [SQLite 简易编排](./deploy/1panel/docker-compose.sqlite.yml)，只运行一个容器；已有站点升级请保留原来的挂载目录与 SESSION_SECRET。

需要 PostgreSQL 和 Redis 时，可使用完整编排：

- [docker-compose.yml](./deploy/1panel/docker-compose.yml)
- [.env.example](./deploy/1panel/.env.example)
- [完整部署、端口、更新与备份说明](./deploy/1panel/README.md)

镜像发布位置：

```text
ghcr.io/yebingran/yunshu-ai-relay:latest
ghcr.io/yebingran/yunshu-ai-relay:sha-<完整 Git 提交 SHA>
```

本仓库及新镜像默认私有；1Panel 拉取镜像前需配置具有 read:packages 权限的 GitHub 认证。不要将令牌写进编排或提交到仓库。

镜像由 GitHub Actions 构建，支持 `linux/amd64` 和 `linux/arm64`。请先确认对应构建成功；公开镜像可直接拉取，私有镜像需配置仓库认证。生产环境建议使用版本标签，并记录当前部署版本。

SQLite 简易编排使用 `3300:3000` 端口映射；完整 PostgreSQL + Redis 编排通过容器网络让 OpenResty 访问应用，不发布宿主机端口。网站对外使用 HTTPS；具体配置见部署指南。

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

本项目基于 [QuantumNous/new-api](https://github.com/QuantumNous/new-api) 修改，保留其网关和管理能力，并加入云速管品牌、定制首页与镜像发布及 1Panel 部署配置。上游来源说明见 [README.upstream.md](./README.upstream.md)。

项目遵循 [GNU AGPLv3](./LICENSE) 及 [NOTICE](./NOTICE) 中的附加署名条款。部署、修改和分发时需保留许可证、作者及第三方声明，并遵守适用的源码提供义务。

Frontend design and development by New API contributors.

第三方组件声明见 [THIRD-PARTY-LICENSES.md](./THIRD-PARTY-LICENSES.md)。
