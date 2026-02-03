# 🔄 项目交接说明

> **给新 Claude 对话的快速上手指南**

## 📌 项目当前状态（2026-02-03）

### ✅ 已完成
1. **本地开发环境配置完成**
   - 创建了 `dev-server.js`（本地 API 服务器）
   - 配置了 Vite 代理（将 `/api` 请求转发到 3001 端口）
   - 添加了必要的依赖（express, dotenv）

2. **代码已推送到 GitHub**
   - 仓库：https://github.com/graceguoxh02/GTM--AI-.git
   - 最新提交：`0c8ca2b` - Configure local development environment
   - 分支：`main`

3. **文档已创建**
   - `DEPLOY_CHECKLIST.md` - 部署检查清单
   - `CLAUDE.md` - 项目完整上下文
   - 本文件 `HANDOFF.md` - 交接说明

### ⚠️ 待完成（高优先级）

1. **在 Vercel 配置环境变量**（必须完成）
   - 登录 Vercel Dashboard
   - 进入项目 Settings → Environment Variables
   - 添加 4 个 API Keys（见下方）
   - 保存后触发重新部署

2. **测试 Vercel 部署**
   - 访问部署 URL
   - 测试 AI 对话功能是否正常

## 🔑 环境变量（需要在 Vercel 配置）

```
QWEN_API_KEY=sk-ad2c26c2f9644c9d9646ea92490f3565
DEEPSEEK_API_KEY=sk-5d314aadc73946b9a902fb08e3030592
GLM_API_KEY=34bb162be27b4181a39b480958d2c78c.qvTAGsxt55vScU0U
MOONSHOT_API_KEY=sk-bvlzc3wOMwGe5OkXWtqQuxstsUrRPq6uEm7ncacXQYmjTAUB
```

**⚠️ 重要**：不要加 `VITE_` 前缀！

## 🚀 快速启动

### 本地开发

**终端 1 - API 服务器**：
```bash
cd "e:\工作\vibe coding\Claude Code\gtm-assistant-ai-version"
npm run dev:api
```

**终端 2 - 前端**：
```bash
cd "e:\工作\vibe coding\Claude Code\gtm-assistant-ai-version"
npm run dev
```

访问：http://localhost:5173

### 推送更新到 GitHub

```bash
git add .
git commit -m "你的更新说明"
git push origin main
```

推送后 Vercel 会自动部署。

## 📚 关键文件说明

| 文件 | 用途 | 备注 |
|------|------|------|
| `dev-server.js` | 本地开发 API 服务器 | 仅本地使用，Vercel 不会用到 |
| `api/chat.js` | Vercel Serverless Function | 生产环境使用 |
| `vite.config.js` | Vite 配置 | 包含 API 代理配置 |
| `package.json` | 项目配置 | 已添加 `"type": "module"` |
| `.env` | 环境变量 | 本地开发使用，不提交到 Git |
| `CLAUDE.md` | 项目完整上下文 | **新对话必读** |
| `DEPLOY_CHECKLIST.md` | 部署检查清单 | 部署时参考 |

## 🏗️ 架构说明

### 本地开发
```
浏览器 → Vite (5173) → Vite 代理 → Express (3001) → AI API
```

### 生产环境（Vercel）
```
浏览器 → Vercel → Serverless Function (/api/chat.js) → AI API
```

## 🐛 常见问题

### Q: 本地 API 调用 404？
**A**: 确保两个服务器都在运行（API 服务器 + Vite）

### Q: Vercel 部署后 500 错误？
**A**: 检查 Vercel 环境变量是否配置正确

### Q: 提交时 Git 报错？
**A**: 可能是分支已分叉，先运行 `git pull origin main`

## 💬 给新 Claude 的建议

1. **先读取** `CLAUDE.md` 了解完整项目背景
2. **检查** Vercel 环境变量是否已配置
3. **测试** 本地开发环境是否能正常启动
4. **询问** 用户当前想做什么任务

## 📞 项目信息

- **GitHub**: https://github.com/graceguoxh02/GTM--AI-.git
- **本地路径**: `e:\工作\vibe coding\Claude Code\gtm-assistant-ai-version`
- **主分支**: `main`
- **Node 版本**: v24.12.0
- **包管理器**: npm

---

**交接时间**: 2026-02-03
**项目状态**: ✅ 开发环境就绪，待配置 Vercel 环境变量
