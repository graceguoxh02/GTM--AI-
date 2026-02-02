// ============================================
// 多模型配置中心
// ============================================

/**
 * 模型提供商配置
 */
export const MODEL_PROVIDERS = {
  // 通义千问（阿里云） - 多模态能力强
  QWEN: {
    name: '通义千问',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: {
      // 多模态模型
      'qwen-vl-plus': {
        name: 'Qwen-VL-Plus',
        supportsVision: true,
        maxTokens: 6000,
        description: '多模态模型，支持图片理解，性价比高'
      },
      'qwen-vl-max': {
        name: 'Qwen-VL-Max',
        supportsVision: true,
        maxTokens: 6000,
        description: '最强多模态模型，文档处理能力最佳'
      },
      // 纯文本模型
      'qwen-turbo': {
        name: 'Qwen-Turbo',
        supportsVision: false,
        maxTokens: 6000,
        description: '快速响应的文本模型'
      },
      'qwen-max': {
        name: 'Qwen-Max',
        supportsVision: false,
        maxTokens: 6000,
        description: '最强文本理解能力'
      }
    }
  },

  // DeepSeek - 推理能力强，性价比极高
  DEEPSEEK: {
    name: 'DeepSeek',
    baseURL: 'https://api.deepseek.com/v1',
    models: {
      'deepseek-chat': {
        name: 'DeepSeek-V3',
        supportsVision: false,
        maxTokens: 8000,
        description: '推理能力强，几乎免费'
      }
    }
  },

  // 智谱 AI - 多模态均衡
  GLM: {
    name: '智谱AI',
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    models: {
      'glm-4v': {
        name: 'GLM-4V',
        supportsVision: true,
        maxTokens: 4000,
        description: '多模态模型，图文理解均衡'
      },
      'glm-4': {
        name: 'GLM-4',
        supportsVision: false,
        maxTokens: 4000,
        description: '纯文本模型，对话能力强'
      }
    }
  },

  // Kimi (月之暗面) - 长文本专家
  MOONSHOT: {
    name: 'Kimi',
    baseURL: 'https://api.moonshot.cn/v1',
    models: {
      'moonshot-v1-128k': {
        name: 'Moonshot-v1-128k',
        supportsVision: false,
        maxTokens: 4000,
        description: '128K 上下文，长文本处理专家'
      }
    }
  }
};

/**
 * 场景类型定义
 */
export const SCENARIO_TYPES = {
  CHAT: 'chat',                    // GTM 引导师对话
  DOCUMENT_PARSE: 'document',      // 文档解析
  ANALYSIS: 'analysis',            // 深度分析
  LONG_TEXT: 'long_text',          // 长文档总结
  COMPETITOR: 'competitor'         // 竞品分析
};

/**
 * 智能路由规则：根据场景选择最佳模型
 *
 * @param {string} scenario - 场景类型
 * @param {boolean} hasImage - 是否包含图片
 * @param {boolean} isLongText - 是否长文本（>10000字）
 * @returns {object} { provider, model }
 */
export function selectOptimalModel(scenario, hasImage = false, isLongText = false) {
  // GTM 引导师对话
  if (scenario === SCENARIO_TYPES.CHAT) {
    if (hasImage) {
      return { provider: 'QWEN', model: 'qwen-vl-plus' };
    }
    return { provider: 'QWEN', model: 'qwen-turbo' };
  }

  // 文档解析（PDF、PPT、Word 等）
  if (scenario === SCENARIO_TYPES.DOCUMENT_PARSE) {
    return { provider: 'QWEN', model: 'qwen-vl-max' };
  }

  // 深度分析（5 个维度）
  if (scenario === SCENARIO_TYPES.ANALYSIS) {
    if (hasImage) {
      return { provider: 'GLM', model: 'glm-4v' };
    }
    return { provider: 'DEEPSEEK', model: 'deepseek-chat' };
  }

  // 长文档总结
  if (scenario === SCENARIO_TYPES.LONG_TEXT || isLongText) {
    if (hasImage) {
      return { provider: 'QWEN', model: 'qwen-vl-max' };
    }
    return { provider: 'MOONSHOT', model: 'moonshot-v1-128k' };
  }

  // 竞品分析
  if (scenario === SCENARIO_TYPES.COMPETITOR) {
    if (hasImage) {
      return { provider: 'GLM', model: 'glm-4v' };
    }
    return { provider: 'DEEPSEEK', model: 'deepseek-chat' };
  }

  // 默认：性价比之选
  return { provider: 'DEEPSEEK', model: 'deepseek-chat' };
}

/**
 * 获取降级方案（当主模型失败时）
 */
export function getFallbackModel(provider, model) {
  // 如果主模型是多模态，降级到通义千问
  if (model.includes('vl') || model.includes('v')) {
    return { provider: 'QWEN', model: 'qwen-vl-plus' };
  }

  // 纯文本降级到 DeepSeek
  return { provider: 'DEEPSEEK', model: 'deepseek-chat' };
}

/**
 * 获取 API Key 的环境变量名称
 */
export function getAPIKeyEnvName(provider) {
  const envMap = {
    QWEN: 'VITE_QWEN_API_KEY',
    DEEPSEEK: 'VITE_DEEPSEEK_API_KEY',
    GLM: 'VITE_GLM_API_KEY',
    MOONSHOT: 'VITE_MOONSHOT_API_KEY'
  };
  return envMap[provider];
}

/**
 * 检查模型是否配置
 */
export function isModelConfigured(provider) {
  const envName = getAPIKeyEnvName(provider);
  const apiKey = import.meta.env[envName];
  return !!apiKey && apiKey !== 'your_api_key_here';
}

/**
 * 获取所有已配置的模型
 */
export function getConfiguredProviders() {
  return Object.keys(MODEL_PROVIDERS).filter(provider => isModelConfigured(provider));
}
