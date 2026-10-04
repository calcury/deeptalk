# DeepTalk

> English, naturally.

一个面向英语学习的网页对话练习工具。你可以选择对话角色和场景，使用 OpenAI 兼容 API 与英语伙伴聊天，并在对话中查看纠错、管理生词和追踪 token 用量。

## 功能

- **英语对话**：支持同学、老师、朋友角色，以及日常聊天、找话题、小组作业和问题讨论场景。
- **OpenAI 兼容 API**：默认预填 DeepSeek API 地址和模型；也可以配置其他兼容 OpenAI Chat Completions 协议的服务商。
- **纠错工作区**：集中查看对话中发送内容的表达建议。
- **生词本**：在聊天中双击或右键单词即可加入，记录上下文、使用次数和 0–10 进度。
- **用量与价格**：记录 API 返回的输入/输出 token，并按内置估算费率显示价格。
- **本地优先**：设置、API key、生词和用量保存在浏览器 `localStorage` 中。
- **静态部署**：无需后端即可部署到 GitHub Pages；项目已包含 GitHub Actions 自动部署配置。

## 本地运行

需要 Node.js 18+（推荐 Node.js 20）。

```bash
npm install
npm run dev
```

打开终端输出的地址，通常是：

```text
http://localhost:5173/deeptalk/
```

不填写 API key 时，页面会使用内置模拟回复，便于先检查界面和交互。

## 配置 API

1. 打开页面右上角的设置按钮。
2. 填写 API endpoint、模型名和 API key。
3. 保存后发送消息。

默认配置为：

- Endpoint：`https://api.deepseek.com`
- Model：`deepseek-chat`

网页会直接从浏览器请求供应商 API，因此供应商需要允许跨域请求（CORS）。API key 仅保存在当前浏览器中，但使用公共设备时请注意安全。生产环境如果需要集中管理 key、登录、限流或跨设备同步，建议增加后端代理服务。

## 生产构建

```bash
npm run build
npm run preview
```

构建产物会生成在 `dist/`，该目录已加入 `.gitignore`。

## GitHub Pages 部署

项目的 `.github/workflows/deploy.yml` 会在推送到 `main` 分支时：

1. 安装依赖；
2. 执行 `npm run build`；
3. 将 `dist/` 上传并发布到 GitHub Pages。

Vite 的 base path 已设置为 `/deeptalk/`，适用于：

```text
https://calcury.github.io/deeptalk/
```

首次使用时，请在 GitHub 仓库的 **Settings → Pages** 中将部署来源设置为 **GitHub Actions**。

## 费用说明

页面显示的价格是根据 API 响应中的 token usage 和代码内置估算费率计算的，不代表所有供应商的实时价格。切换模型或供应商后，请在用量页面核对对应费率。

## License

[MIT](LICENSE)
