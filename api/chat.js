// Vercel Serverless Function - 安全处理 AI API 调用
export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { provider, model, messages, maxTokens = 4000, temperature = 0.7 } = req.body;

    // 从环境变量获取 API Keys（安全，不暴露给前端）
    const apiKeys = {
      QWEN: process.env.QWEN_API_KEY,
      DEEPSEEK: process.env.DEEPSEEK_API_KEY,
      GLM: process.env.GLM_API_KEY,
      MOONSHOT: process.env.MOONSHOT_API_KEY,
    };

    const apiKey = apiKeys[provider];
    if (!apiKey) {
      return res.status(400).json({ error: `API key for ${provider} not configured` });
    }

    // 根据不同的 provider 调用对应的 API
    let apiUrl, headers, body;

    switch (provider) {
      case 'QWEN':
        apiUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
        headers = {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        };
        body = JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
          stream: true,
        });
        break;

      case 'DEEPSEEK':
        apiUrl = 'https://api.deepseek.com/chat/completions';
        headers = {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        };
        body = JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
          stream: true,
        });
        break;

      case 'GLM':
        apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
        headers = {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        };
        body = JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
          stream: true,
        });
        break;

      case 'MOONSHOT':
        apiUrl = 'https://api.moonshot.cn/v1/chat/completions';
        headers = {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        };
        body = JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
          stream: true,
        });
        break;

      default:
        return res.status(400).json({ error: 'Invalid provider' });
    }

    // 调用 AI API（流式响应）
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `AI API error: ${response.status}`,
        details: errorText
      });
    }

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 转发流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }

    res.end();

  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
