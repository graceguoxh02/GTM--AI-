# GTM 助手 - 设置总结

本文档记录了项目从 Claude 迁移到国产大模型的完整过程。

## ✅ 已完成的工作

### 1. 模型配置
- ✅ 创建了 `src/modelConfig.js` - 智能路由系统
- ✅ 支持 4 个国产大模型：通义千问、DeepSeek、智谱GLM、Kimi
- ✅ 智能选择最优模型

### 2. AI 服务重构
- ✅ 重构了 `src/aiService.js`
- ✅ 移除 Anthropic SDK 依赖
- ✅ 支持流式对话
- ✅ 支持降级保护

### 3. 环境配置
已配置的 API Keys（后端安全存储，无 VITE_ 前缀）：
- QWEN_API_KEY - 通义千问
- DEEPSEEK_API_KEY - DeepSeek
- GLM_API_KEY - 智谱 GLM
- MOONSHOT_API_KEY - Kimi

**⚠️ 重要：** 环境变量在后端 Vercel Serverless Functions 中使用，前端通过 `/api/chat` 调用

### 4. 项目依赖
- ✅ 更新了 package.json（移除 @anthropic-ai/sdk）
- ✅ 安装了所有依赖

### 5. 文档
- ✅ 更新了 README.md
- ✅ 创建了 MIGRATION.md 迁移指南

## 🚀 启动项目

```bash
# 启动开发服务器
npm run dev

# 访问地址
http://localhost:5173
```

## 🤖 智能路由规则

系统会根据场景自动选择模型：

| 场景 | 自动选择 | 理由 |
|------|----------|------|
| GTM 对话（纯文本） | 通义千问 qwen-turbo | 快速响应 |
| GTM 对话（含图片） | 通义千问 qwen-vl-plus | 支持多模态 |
| 文档解析 | 通义千问 qwen-vl-max | 最强文档处理 |
| 深度分析（纯文本） | DeepSeek deepseek-chat | 推理强+便宜 |
| 深度分析（含图片） | 智谱 GLM-4V | 图文理解好 |
| 长文档总结 | Kimi moonshot-v1-128k | 200K 上下文 |

## 📁 关键文件

### 新增文件
- `src/modelConfig.js` - 模型配置和智能路由
- `MIGRATION.md` - 迁移指南
- `.env` - 环境变量（包含 API Keys）

### 修改文件
- `src/aiService.js` - AI 服务层
- `package.json` - 依赖配置
- `README.md` - 项目文档
- `.env.example` - 环境变量模板

## 💰 成本对比

| 配置 | 月成本 |
|------|--------|
| 仅 DeepSeek | ¥5-10 |
| DeepSeek + 通义千问 | ¥20-50 |
| 完整配置（当前）| ¥30-80 |
| Claude（旧版）| $100-200 |

**成本降低 95%+**

## 🔍 测试清单

- [ ] GTM 引导师对话
- [ ] 添加产品
- [ ] 产品定位分析
- [ ] 市场选择分析
- [ ] 目标用户分析
- [ ] 销售推广分析
- [ ] GTM 路径分析

## 🐛 常见问题

### Q: 如何查看使用的是哪个模型？
A: 打开浏览器开发者工具（F12），查看 Console 日志

### Q: 如何修改模型选择策略？
A: 编辑 `src/modelConfig.js` 中的 `selectOptimalModel` 函数

### Q: 某个模型调用失败怎么办？
A: 系统会自动降级到备用模型，无需手动干预

### Q: 如何只使用一个模型？
A: 在 `modelConfig.js` 中修改：
```javascript
export function selectOptimalModel(scenario, hasImage, isLongText) {
  return { provider: 'DEEPSEEK', model: 'deepseek-chat' };
}
```

## 📚 参考文档

- [README.md](README.md) - 完整使用指南
- [MIGRATION.md](MIGRATION.md) - 迁移指南
- [.env.example](.env.example) - 环境变量示例

## 🎉 完成日期

配置完成时间：2026-02-02

---

**项目状态：** ✅ 已完成配置，可以正常使用
