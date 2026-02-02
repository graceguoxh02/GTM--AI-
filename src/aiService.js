import {
  GTM_NAVIGATOR_SYSTEM_PROMPT,
  POSITIONING_ANALYSIS_PROMPT,
  MARKET_ANALYSIS_PROMPT,
  USER_ANALYSIS_PROMPT,
  SALES_ANALYSIS_PROMPT,
  GTM_ROADMAP_PROMPT,
  CANVAS_ANALYSIS_PROMPT,
  COMPETITOR_ANALYSIS_PROMPT,
  DOCUMENT_SUMMARY_PROMPT
} from './prompts';

import {
  MODEL_PROVIDERS,
  SCENARIO_TYPES,
  selectOptimalModel,
  getFallbackModel
} from './modelConfig';

// ============================================
// AI 服务层 - 支持多模型智能路由
// ============================================

/**
 * 通用的 AI API 调用（通过后端代理）
 * 支持：通义千问、DeepSeek、智谱 GLM、Kimi
 * ⚠️ 安全：API Keys 保存在后端，前端无法访问
 */
async function callOpenAICompatibleAPI(provider, model, messages, systemPrompt, maxTokens = 2000) {
  const providerConfig = MODEL_PROVIDERS[provider];
  const modelConfig = providerConfig.models[model];

  if (!providerConfig || !modelConfig) {
    throw new Error(`不支持的模型: ${provider}/${model}`);
  }

  // 构建请求（发送到后端 API）
  const requestBody = {
    provider,
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
    ],
    maxTokens,
    temperature: 0.7
  };

  // 调用后端 API（本地开发时使用相对路径，部署后自动使用正确的域名）
  const apiUrl = '/api/chat';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API 调用失败: ${response.status}`);
  }

  const data = await response.json();
  return {
    success: true,
    content: data.choices[0].message.content,
    model: `${providerConfig.name}/${modelConfig.name}`,
    usage: data.usage
  };
}

// 注意：callGLMAPI 函数已移除，现在所有模型统一通过后端 API 处理

/**
 * 流式调用（通过后端代理，支持 SSE）
 * ⚠️ 安全：API Keys 保存在后端，前端无法访问
 */
async function streamOpenAICompatibleAPI(provider, model, messages, systemPrompt, onToken, onComplete) {
  const providerConfig = MODEL_PROVIDERS[provider];
  const modelConfig = providerConfig.models[model];

  if (!providerConfig || !modelConfig) {
    throw new Error(`不支持的模型: ${provider}/${model}`);
  }

  const requestBody = {
    provider,
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
    ],
    maxTokens: 2000,
    temperature: 0.7
  };

  // 调用后端 API
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`流式调用失败: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const content = json.choices[0]?.delta?.content;
            if (content) {
              fullText += content;
              onToken(content, fullText);
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }

    onComplete(fullText);
    return { success: true, content: fullText };
  } catch (error) {
    console.error('流式处理错误:', error);
    throw error;
  }
}

/**
 * 智能 AI 调用 - 自动选择最佳模型
 * @param {string} scenario - 场景类型
 * @param {string} systemPrompt - 系统提示词
 * @param {Array} messages - 对话历史
 * @param {boolean} hasImage - 是否包含图片
 * @param {boolean} isLongText - 是否长文本
 * @param {number} maxTokens - 最大 token 数
 */
export async function smartChatWithAI(scenario, systemPrompt, messages, hasImage = false, isLongText = false, maxTokens = 2000) {
  try {
    // 智能选择模型
    const { provider, model } = selectOptimalModel(scenario, hasImage, isLongText);

    console.log(`🤖 场景: ${scenario}, 选择模型: ${provider}/${model}`);

    // 调用主模型
    try {
      return await callOpenAICompatibleAPI(provider, model, messages, systemPrompt, maxTokens);
    } catch (error) {
      console.warn(`主模型调用失败，尝试降级...`, error);

      // 降级到备用模型
      const fallback = getFallbackModel(provider, model);
      console.log(`⚠️ 降级到: ${fallback.provider}/${fallback.model}`);

      return await callOpenAICompatibleAPI(fallback.provider, fallback.model, messages, systemPrompt, maxTokens);
    }
  } catch (error) {
    console.error('AI 调用失败:', error);
    return {
      success: false,
      error: error.message || '调用失败，请检查 API 配置'
    };
  }
}

/**
 * 智能流式调用
 */
export async function smartStreamChatWithAI(scenario, systemPrompt, messages, onToken, onComplete, hasImage = false) {
  try {
    const { provider, model } = selectOptimalModel(scenario, hasImage);

    console.log(`🤖 流式场景: ${scenario}, 选择模型: ${provider}/${model}`);

    return await streamOpenAICompatibleAPI(provider, model, messages, systemPrompt, onToken, onComplete);
  } catch (error) {
    console.error('流式调用失败:', error);
    return {
      success: false,
      error: error.message || '流式调用失败'
    };
  }
}

// ============================================
// 各场景专用的 AI 调用函数
// ============================================

/**
 * GTM 引导师对话
 */
export const chatWithNavigator = async (messages, hasImage = false) => {
  return smartChatWithAI(
    SCENARIO_TYPES.CHAT,
    GTM_NAVIGATOR_SYSTEM_PROMPT,
    messages,
    hasImage
  );
};

/**
 * GTM 引导师对话 - 流式版本
 */
export const streamChatWithNavigator = async (messages, onToken, onComplete, hasImage = false) => {
  return smartStreamChatWithAI(
    SCENARIO_TYPES.CHAT,
    GTM_NAVIGATOR_SYSTEM_PROMPT,
    messages,
    onToken,
    onComplete,
    hasImage
  );
};

/**
 * 产品定位分析
 */
export const analyzePositioning = async (productInfo, hasImage = false) => {
  const prompt = POSITIONING_ANALYSIS_PROMPT(productInfo);
  return smartChatWithAI(
    SCENARIO_TYPES.ANALYSIS,
    '你是一位产品定位专家。',
    [{ role: 'user', content: prompt }],
    hasImage,
    false,
    3000
  );
};

/**
 * 市场选择分析
 */
export const analyzeMarket = async (productInfo, hasImage = false) => {
  const prompt = MARKET_ANALYSIS_PROMPT(productInfo);
  return smartChatWithAI(
    SCENARIO_TYPES.ANALYSIS,
    '你是一位市场策略专家。',
    [{ role: 'user', content: prompt }],
    hasImage,
    false,
    3000
  );
};

/**
 * 目标用户分析
 */
export const analyzeUsers = async (productInfo, hasImage = false) => {
  const prompt = USER_ANALYSIS_PROMPT(productInfo);
  return smartChatWithAI(
    SCENARIO_TYPES.ANALYSIS,
    '你是一位用户研究专家。',
    [{ role: 'user', content: prompt }],
    hasImage,
    false,
    3000
  );
};

/**
 * 销售与推广分析
 */
export const analyzeSales = async (productInfo, hasImage = false) => {
  const prompt = SALES_ANALYSIS_PROMPT(productInfo);
  return smartChatWithAI(
    SCENARIO_TYPES.ANALYSIS,
    '你是一位增长专家。',
    [{ role: 'user', content: prompt }],
    hasImage,
    false,
    3000
  );
};

/**
 * GTM 路径分析
 */
export const analyzeGTMRoadmap = async (productInfo, hasImage = false) => {
  const prompt = GTM_ROADMAP_PROMPT(productInfo);
  return smartChatWithAI(
    SCENARIO_TYPES.ANALYSIS,
    '你是一位 SaaS 创业导师。',
    [{ role: 'user', content: prompt }],
    hasImage,
    false,
    3000
  );
};

/**
 * 商业模式画布某个维度的分析
 */
export const analyzeCanvasDimension = async (productInfo, dimension, hasImage = false) => {
  const prompt = CANVAS_ANALYSIS_PROMPT(productInfo, dimension);
  return smartChatWithAI(
    SCENARIO_TYPES.ANALYSIS,
    '你是商业模式专家。',
    [{ role: 'user', content: prompt }],
    hasImage,
    false,
    2000
  );
};

/**
 * 竞品分析
 */
export const analyzeCompetitor = async (productInfo, competitorName, hasImage = false) => {
  const prompt = COMPETITOR_ANALYSIS_PROMPT(productInfo, competitorName);
  return smartChatWithAI(
    SCENARIO_TYPES.COMPETITOR,
    '你是竞品分析专家。',
    [{ role: 'user', content: prompt }],
    hasImage,
    false,
    2000
  );
};

/**
 * 文档解析和总结
 */
export const summarizeDocument = async (documentContent, productName) => {
  const prompt = DOCUMENT_SUMMARY_PROMPT(documentContent, productName);
  const isLongText = documentContent.length > 10000;

  return smartChatWithAI(
    SCENARIO_TYPES.DOCUMENT_PARSE,
    '你是商业分析师。',
    [{ role: 'user', content: prompt }],
    false,
    isLongText,
    2000
  );
};

/**
 * 检查 API 配置是否正确
 * ⚠️ 注意：API Keys 现在保存在后端，前端无法直接检查
 * 配置检查将在实际调用时进行
 */
export const checkAPIConfig = () => {
  return {
    isConfigured: true,
    message: '✓ API Keys 由后端安全管理'
  };
};
