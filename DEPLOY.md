# 🚀 部署指南 - Vercel

## 安全说明

本项目已添加后端保护，API Keys 只在后端使用，前端无法访问。✅ 安全可靠！

## 📝 部署步骤

### 1. 推送代码到 GitHub

确保代码已推送到 GitHub 仓库。

### 2. 在 Vercel 导入项目

1. 访问 [Vercel](https://vercel.com/)
2. 点击 **"Add New..."** → **"Project"**
3. 选择 **"Import Git Repository"**
4. 授权并选择你的 GitHub 仓库：`graceguoxh02/GTM-`
5. 点击 **"Import"**

### 3. 配置环境变量（重要！）

在 Vercel 项目设置中配置 API Keys：

1. 进入项目页面
2. 点击 **"Settings"** 标签
3. 点击左侧 **"Environment Variables"**
4. 添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|------|------|
| `QWEN_API_KEY` | sk-ad2c26c2f9644c9d9646ea92490f3565 | 通义千问 API Key |
| `DEEPSEEK_API_KEY` | sk-5d314aadc73946b9a902fb08e3030592 | DeepSeek API Key |
| `GLM_API_KEY` | 34bb162be27b4181a39b480958d2c78c.qvTAGsxt55vScU0U | 智谱 GLM API Key |
| `MOONSHOT_API_KEY` | sk-bvlzc3wOMwGe5OkXWtqQuxstsUrRPq6uEm7ncacXQYmjTAUB | Kimi API Key |

**注意**：至少配置一个 API Key，推荐配置 QWEN + DEEPSEEK。

5. 每个环境变量选择作用环境：
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### 4. 部署

1. 配置完环境变量后，点击 **"Deployments"** 标签
2. 点击最新的部署项右侧的 **"..."** → **"Redeploy"**
3. 或者推送新的代码到 GitHub，Vercel 会自动部署

### 5. 访问你的应用

部署成功后，Vercel 会提供一个 URL，例如：
```
https://your-project-name.vercel.app
```

点击访问，开始使用 GTM 助手！🎉

## 🔒 安全检查清单

- [x] API Keys 不在前端代码中（已通过后端代理）
- [x] .env 文件在 .gitignore 中（不会上传到 GitHub）
- [x] 环境变量在 Vercel 后台配置（安全存储）
- [x] 前端无法直接访问 API Keys

## 🐛 常见问题

### Q: 部署后提示 API Key not configured

**A:** 检查 Vercel 环境变量是否正确配置：
1. 确认变量名没有 `VITE_` 前缀
2. 确认环境变量的作用环境包含 Production
3. 重新部署项目

### Q: API 调用失败

**A:** 检查：
1. Vercel Serverless Function 是否正常运行
2. 环境变量是否配置正确
3. API Key 是否有效（未过期、有额度）

### Q: 本地开发如何测试？

**A:** 使用 Vercel CLI：
```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 本地开发（会自动加载 .env）
vercel dev
```

然后访问 http://localhost:3000

## 📊 成本预估

使用 Vercel 免费版 + 国产模型：

| 项目 | 费用 |
|------|------|
| **Vercel 托管** | 免费（个人项目） |
| **Serverless Functions** | 免费（每月 100GB 调用时长） |
| **AI API 调用** | ¥20-50/月（根据使用量） |
| **总计** | ≈ ¥20-50/月 |

**对比传统方案**：成本降低 95%+

## 🔄 更新部署

推送新代码到 GitHub，Vercel 会自动重新部署：

```bash
git add .
git commit -m "更新功能"
git push
```

## 📚 参考文档

- [Vercel 环境变量文档](https://vercel.com/docs/environment-variables)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel CLI 文档](https://vercel.com/docs/cli)

---

**祝部署顺利！** 🚀
