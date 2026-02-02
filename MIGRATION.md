# 迁移指南：从 Claude 到国产大模型

本文档帮助您从原 Claude 版本迁移到国产大模型版本。

## 🎯 迁移概览

### 主要变更

| 项目 | 旧版本 | 新版本 |
|------|--------|--------|
| **AI 模型** | Claude 3.5 Sonnet | 通义千问、DeepSeek、智谱GLM、Kimi |
| **SDK 依赖** | @anthropic-ai/sdk | 无需 SDK（直接调用 API） |
| **API Key** | VITE_ANTHROPIC_API_KEY | VITE_QWEN_API_KEY 等 |
| **多模态** | 不支持 | ✅ 支持图片、文档 |
| **成本** | $100-200/月 | ¥20-50/月 |
| **国内访问** | 需要科学上网 | ✅ 直接访问 |

## 📋 迁移步骤

### 1. 备份旧配置

```bash
# 备份旧的 .env 文件
cp .env .env.claude.backup
```

### 2. 卸载旧依赖

```bash
# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装依赖（已移除 @anthropic-ai/sdk）
npm install
```

### 3. 更新环境变量

编辑 `.env` 文件，替换为新的配置：

```env
# 删除旧配置
# VITE_ANTHROPIC_API_KEY=sk-ant-xxx

# 添加新配置（至少配置一个）
VITE_QWEN_API_KEY=your_api_key_here
VITE_DEEPSEEK_API_KEY=your_api_key_here
VITE_GLM_API_KEY=your_api_key_here
VITE_MOONSHOT_API_KEY=your_api_key_here
```

### 4. 获取新的 API Key

| 模型 | 注册地址 | 获取步骤 |
|------|----------|----------|
| **通义千问** | https://dashscope.console.aliyun.com/ | 1. 登录阿里云<br>2. 开通 DashScope<br>3. 创建 API Key |
| **DeepSeek** | https://platform.deepseek.com/ | 1. 注册账号<br>2. 进入 API Keys<br>3. 创建新 Key |
| **智谱GLM** | https://open.bigmodel.cn/ | 1. 注册账号<br>2. 进入 API Keys<br>3. 创建新 Key |
| **Kimi** | https://platform.moonshot.cn/ | 1. 注册账号<br>2. 进入控制台<br>3. 创建 API Key |

### 5. 启动测试

```bash
npm run dev
```

访问 http://localhost:5173，测试各项功能。

## 🔍 功能对比

### 保持不变的功能

✅ GTM 引导师对话
✅ 产品全景图管理
✅ 5 个维度深度分析
✅ 商业模式画布
✅ 流式对话
✅ 分析结果保存

### 新增功能

🆕 **多模型智能路由** - 自动选择最优模型
🆕 **多模态支持** - 支持图片、文档上传
🆕 **降级保护** - 主模型失败自动切换
🆕 **成本优化** - 成本降低 95%+
🆕 **模型选择提示** - 控制台显示使用的模型

## 💡 使用差异

### 1. API 调用方式

**旧版本（Claude）:**
```javascript
const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true
});

const response = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  messages: messages
});
```

**新版本（国产模型）:**
```javascript
// 智能路由自动选择最优模型
const response = await smartChatWithAI(
  scenario,      // 场景类型
  systemPrompt,
  messages,
  hasImage,      // 是否包含图片
  isLongText     // 是否长文本
);
```

### 2. 图片支持

**旧版本:** 不支持图片

**新版本:** 支持图片（需配置多模态模型）
```javascript
// 上传图片时，自动使用支持 Vision 的模型
await analyzePositioning(productInfo, hasImage = true);
```

### 3. 模型选择

**旧版本:** 固定使用 Claude 3.5 Sonnet

**新版本:** 智能路由，根据场景自动选择
```javascript
// 系统会根据场景自动选择：
// - 对话场景 → 通义千问 Qwen-VL-Plus
// - 深度分析 → DeepSeek V3
// - 文档解析 → 通义千问 Qwen-VL-Max
// - 长文本 → Kimi (Moonshot)
```

## 🔧 常见问题

### Q1: 为什么我的分析速度变慢了？

A: 可能原因：
- 使用了多模态模型（处理图片需要更多时间）
- 网络延迟（切换到其他模型试试）
- 模型服务器压力（高峰期可能变慢）

**解决方案：**
```javascript
// 在 modelConfig.js 中强制使用更快的模型
export function selectOptimalModel(scenario, hasImage, isLongText) {
  return { provider: 'DEEPSEEK', model: 'deepseek-chat' };
}
```

### Q2: 某个场景分析质量不如 Claude 怎么办？

A: 可以手动指定使用更强的模型

**方案 1: 修改智能路由规则**
```javascript
// 在 modelConfig.js 中调整
if (scenario === SCENARIO_TYPES.ANALYSIS) {
  // 改用通义千问 Max（更强但稍贵）
  return { provider: 'QWEN', model: 'qwen-max' };
}
```

**方案 2: 优化提示词**
```javascript
// 在 prompts.js 中增加更详细的提示
export const POSITIONING_ANALYSIS_PROMPT = (productInfo) => `
你是资深产品定位专家，拥有20年经验...
（添加更多上下文和要求）
`;
```

### Q3: 如何查看实际使用的模型？

A: 打开浏览器开发者工具（F12），查看 Console 日志：

```
🤖 场景: analysis, 选择模型: DEEPSEEK/deepseek-chat
```

### Q4: 可以只用一个模型吗？

A: 可以。至少配置一个即可：

- **只要纯文本分析**: 只配置 DeepSeek
- **需要多模态**: 至少配置通义千问或智谱GLM
- **最佳体验**: 配置所有模型

### Q5: 成本会超出预算吗？

A: 不会。国产模型成本极低：

```
DeepSeek: 输入¥1/百万tokens, 输出¥2/百万tokens
通义千问: 100万tokens/月 免费额度

典型使用（每月）:
- 100次对话 + 50次分析 ≈ ¥20-50
```

## 📊 性能对比

| 指标 | Claude 版本 | 国产版本 |
|------|------------|----------|
| **响应速度** | 2-5 秒 | 2-8 秒（视模型） |
| **分析质量** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ ~ ⭐⭐⭐⭐⭐ |
| **多模态** | ❌ | ✅ |
| **长文本** | 200K tokens | 200K tokens (Kimi) |
| **成本** | $100-200/月 | ¥20-50/月 |
| **国内访问** | ❌ 需科学上网 | ✅ 直接访问 |

## 🚀 优化建议

### 1. 成本优化

```javascript
// 在 modelConfig.js 中优先使用便宜的模型
export function selectOptimalModel(scenario, hasImage, isLongText) {
  // 除非必要，否则使用 DeepSeek
  if (!hasImage && !isLongText) {
    return { provider: 'DEEPSEEK', model: 'deepseek-chat' };
  }
  // ... 其他逻辑
}
```

### 2. 质量优化

```javascript
// 关键场景使用更强的模型
if (scenario === SCENARIO_TYPES.ANALYSIS && isImportant) {
  return { provider: 'QWEN', model: 'qwen-max' };
}
```

### 3. 速度优化

```javascript
// 调整 maxTokens 减少响应时间
export async function smartChatWithAI(...args, maxTokens = 1000) {
  // 较短的输出，更快的响应
}
```

## 📝 回滚方案

如果需要回滚到 Claude 版本：

```bash
# 1. 恢复备份
cp .env.claude.backup .env

# 2. 恢复旧代码（如果有 Git）
git checkout <commit-hash-before-migration>

# 3. 重新安装依赖
npm install
```

## 🆘 需要帮助？

遇到问题？
1. 查看 [README.md](README.md) 常见问题部分
2. 检查浏览器 Console 日志
3. 在 GitHub 提 Issue
4. 联系技术支持

---

**迁移完成后，建议先测试所有核心功能，确保正常运行！**
