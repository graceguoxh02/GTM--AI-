# ⚡ Claude 快速启动指南

> **复制下面的文字，粘贴到新的 Claude 对话中**

---

## 📋 新对话开始模板

```
你好！我正在开发一个 GTM 助手项目。

请先阅读以下文件快速了解项目：
1. CLAUDE_CONTEXT.md - 完整项目上下文
2. README.md - 项目说明

项目简介：
- 基于国产 AI 模型的产品商业化分析工具
- 技术栈：React + Vite + Vercel Serverless Functions
- 已部署到 Vercel，使用后端 API 保护 API Keys
- 支持 4 个国产模型：通义千问、DeepSeek、智谱GLM、Kimi

请告诉我你已经了解项目背景，我们可以开始工作。
```

---

## 🎯 针对不同任务的启动模板

### 如果要添加新功能：
```
我想给 GTM 助手添加新功能：[描述功能]

请先阅读 CLAUDE_CONTEXT.md 了解项目架构，然后帮我规划实现步骤。
```

### 如果要修复 Bug：
```
GTM 助手遇到问题：[描述问题]

请先阅读 CLAUDE_CONTEXT.md，然后帮我排查问题。

相关文件可能是：
- src/aiService.js
- api/chat.js
- src/App.jsx
```

### 如果要部署相关：
```
我需要处理部署相关的事情：[描述需求]

请先阅读：
1. CLAUDE_CONTEXT.md - 了解部署状态
2. DEPLOY.md - 部署文档

然后帮我处理。
```

### 如果要配置 GitHub 同步：
```
我需要配置 GitHub Actions 自动同步到团队仓库。

请先阅读 CLAUDE_CONTEXT.md 了解当前进展，
然后查看 .github/workflows/sync-to-team-repo.yml，
帮我完成配置。

团队仓库地址：[填写地址]
```

---

## 💡 专业提示

### 让 Claude 更高效的技巧：

1. **明确当前任务**
   ```
   当前任务：实现文档上传功能
   相关进度：查看 CLAUDE_CONTEXT.md 中的待办事项
   ```

2. **指定相关文件**
   ```
   请先读取以下文件：
   - CLAUDE_CONTEXT.md（项目背景）
   - src/App.jsx（主组件）
   - api/chat.js（后端 API）
   ```

3. **说明期望结果**
   ```
   我期望：
   1. 理解当前项目状态
   2. 规划实现步骤
   3. 编写代码
   4. 测试验证
   ```

---

## 🔖 常用文件路径速查

**项目文档**：
- `CLAUDE_CONTEXT.md` - 项目上下文（最重要！）
- `README.md` - 项目说明
- `DEPLOY.md` - 部署文档
- `MIGRATION.md` - 迁移指南

**核心代码**：
- `src/App.jsx` - 主应用
- `src/aiService.js` - AI 服务
- `src/modelConfig.js` - 模型配置
- `api/chat.js` - 后端 API

**配置文件**：
- `.env` - 环境变量（不提交）
- `vercel.json` - Vercel 配置
- `.github/workflows/sync-to-team-repo.yml` - 自动同步

---

**保存这个文件，每次新对话时直接复制模板即可！** 📋
