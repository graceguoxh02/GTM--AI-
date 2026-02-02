# 🤖 Claude 对话上下文 - GTM 助手项目

> **新对话开始时，请 Claude 先读取此文件以快速了解项目背景**

## 📌 项目概述

**项目名称**: GTM 助手 - 国产大模型版
**项目类型**: AI 驱动的产品商业化分析工具
**目标用户**: To B AI 公司 VP
**技术栈**: React 18 + Vite 5 + Tailwind CSS + Vercel Serverless Functions

## 🎯 核心功能

1. **GTM 引导师对话** - AI 智能引导梳理产品矩阵
2. **产品全景图管理** - 管理多个产品的商业化进展
3. **AI 深度分析** - 5 个维度专业分析：
   - 产品定位（基于《定位》理论）
   - 市场选择（基于《跨越鸿沟》）
   - 目标用户（基于《商业模式新生代》）
   - 销售推广（基于《超级转化率》）
   - GTM 路径（基于《SaaS创业路线图》）
4. **商业模式画布** - 9 个维度系统梳理
5. **文档上传解析** - 支持 PDF、PPT、Word、图片

## 🏗️ 项目架构

### 技术架构
```
前端 (React + Vite)
    ↓
后端 API (/api/chat.js - Vercel Serverless Function)
    ↓
国产 AI 模型 (通义千问、DeepSeek、智谱 GLM、Kimi)
```

### 关键文件结构
```
├── src/
│   ├── App.jsx              # 主应用组件 (UI + 状态管理)
│   ├── aiService.js         # AI 服务层 (调用后端 API)
│   ├── modelConfig.js       # 模型配置和智能路由
│   └── prompts.js           # 提示词系统
├── api/
│   └── chat.js              # Vercel Serverless Function (安全处理 AI 调用)
├── .env                     # 环境变量 (API Keys，不提交到 Git)
├── .env.example             # 环境变量模板
├── vercel.json              # Vercel 配置
└── DEPLOY.md                # 部署文档
```

## 🔒 安全架构（重要！）

**已实现后端 API 保护**：
- ✅ API Keys 只在后端 (Vercel Serverless Functions)
- ✅ 前端通过 `/api/chat` 调用后端
- ✅ 环境变量使用无 `VITE_` 前缀（后端专用）
- ✅ 前端无法访问真实 API Keys

## 🤖 AI 模型配置

### 智能路由策略
系统根据场景自动选择最优模型：

| 场景 | 模型选择 | 理由 |
|------|----------|------|
| GTM 对话（纯文本） | 通义千问 qwen-turbo | 快速响应 |
| GTM 对话（含图片） | 通义千问 qwen-vl-plus | 多模态 |
| 深度分析（纯文本） | DeepSeek deepseek-chat | 推理强+便宜 |
| 深度分析（含图片） | 智谱 GLM-4V | 图文理解好 |
| 文档解析 | 通义千问 qwen-vl-max | 文档处理强 |
| 长文档总结 | Kimi moonshot-v1-128k | 200K 上下文 |

### 环境变量
```bash
QWEN_API_KEY=sk-ad2c26c2f9644c9d9646ea92490f3565
DEEPSEEK_API_KEY=sk-5d314aadc73946b9a902fb08e3030592
GLM_API_KEY=34bb162be27b4181a39b480958d2c78c.qvTAGsxt55vScU0U
MOONSHOT_API_KEY=sk-bvlzc3wOMwGe5OkXWtqQuxstsUrRPq6uEm7ncacXQYmjTAUB
```

## 📦 部署状态

### GitHub 仓库
- **个人仓库**: https://github.com/graceguoxh02/GTM-
- **团队仓库**: （待配置）
- **自动同步**: ✅ 已配置 GitHub Actions (`.github/workflows/sync-to-team-repo.yml`)

### Vercel 部署
- **状态**: ✅ 已部署成功
- **URL**: https://your-project.vercel.app（替换为实际 URL）
- **自动部署**: ✅ 推送到 GitHub 自动触发部署
- **环境变量**: ✅ 已在 Vercel 配置（4 个 API Keys）

### 本地开发
- **运行命令**: `npm run dev`
- **访问地址**: http://localhost:5174（端口 5173 被占用）
- **开发服务器**: ✅ 正在后台运行

## ✅ 已完成的工作

### Phase 1: 基础功能（已完成）
- [x] 项目初始化（React + Vite + Tailwind）
- [x] 国产 AI 模型集成（4 个模型）
- [x] 智能模型路由系统
- [x] GTM 引导师对话功能
- [x] 产品全景图管理
- [x] 5 个维度深度分析
- [x] 商业模式画布

### Phase 2: 安全加固（已完成）
- [x] 创建 Vercel Serverless Functions (`/api/chat.js`)
- [x] 修改前端调用后端 API
- [x] 更新环境变量（去掉 VITE_ 前缀）
- [x] API Keys 后端保护
- [x] 创建部署文档 (`DEPLOY.md`)

### Phase 3: Git & 部署（已完成）
- [x] 初始化 Git 仓库
- [x] 提交代码
- [x] 推送到 GitHub（个人仓库）
- [x] 部署到 Vercel
- [x] 配置 Vercel 环境变量
- [x] 创建 GitHub Actions 自动同步工作流

## 🚧 待办事项

### 高优先级
- [ ] 配置 GitHub Actions Token (TEAM_REPO_TOKEN)
- [ ] 更新工作流文件中的团队仓库地址
- [ ] 测试自动同步功能
- [ ] 添加数据持久化 (localStorage 或后端)
- [ ] UI 上传文档和图片功能

### 中优先级
- [ ] 优化提示词，提升 AI 分析质量
- [ ] 支持多产品对比分析
- [ ] 导出分析报告 (PDF/Markdown)
- [ ] 成本统计和额度提醒

### 低优先级
- [ ] 移动端适配
- [ ] 用户登录和团队协作
- [ ] 数据可视化图表
- [ ] 国际化支持

## 💡 重要决策记录

### 为什么选择国产模型？
- 成本降低 95%+（相比 Claude）
- 国内直接访问，无需科学上网
- 通义千问有 100万tokens/月 免费额度
- DeepSeek 几乎免费（¥1/百万tokens）

### 为什么使用 Vercel Serverless Functions？
- 免费额度充足
- 保护 API Keys 安全
- 自动部署，无需维护服务器
- 与前端项目集成简单

### 为什么使用智能路由？
- 不同场景使用最适合的模型
- 优化成本和性能
- 自动降级保护

## 🔍 常见问题

### Q: 如何启动项目？
```bash
npm run dev
```
访问 http://localhost:5174

### Q: 如何部署更新？
```bash
git add .
git commit -m "更新说明"
git push
```
Vercel 会自动部署（2-3 分钟）

### Q: 如何查看 AI 使用的模型？
打开浏览器开发者工具（F12），查看 Console 日志：
```
🤖 场景: analysis, 选择模型: DEEPSEEK/deepseek-chat
```

### Q: API 调用失败怎么办？
1. 检查 Vercel 环境变量是否配置正确
2. 检查 API Key 是否有效、有额度
3. 查看 Vercel Logs 获取详细错误信息

### Q: 如何修改模型选择策略？
编辑 `src/modelConfig.js` 中的 `selectOptimalModel` 函数

## 📞 协作信息

### 团队成员
- 你：项目开发者
- 合作者：（她的 GitHub 用户名）

### GitHub 协作流程
1. 你推送到个人仓库
2. GitHub Actions 自动同步到团队仓库
3. 或者使用 Pull Request 工作流

## 🎯 下一步行动

**当前优先级**：
1. ✅ 完成 GitHub Actions 配置（创建 Token，更新仓库地址）
2. 测试自动同步功能
3. 实现文档上传 UI
4. 添加数据持久化

---

## 💬 给新对话的 Claude 的指示

**新对话开始时**，用户可以说：
> "请先阅读 CLAUDE_CONTEXT.md 文件，了解项目背景"

**Claude 应该**：
1. 读取 `CLAUDE_CONTEXT.md`
2. 确认理解项目状态
3. 询问用户当前要处理的任务
4. 根据上下文提供针对性帮助

---

**最后更新**: 2026-02-02
**项目状态**: ✅ 开发中，已部署到 Vercel，功能完整可用
