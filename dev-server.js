// 本地开发 API 服务器 - 模拟 Vercel Serverless Functions
import express from 'express';
import dotenv from 'dotenv';
import chatHandler from './api/chat.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量
dotenv.config();

const app = express();
const PORT = 3001;

// 中间件
app.use(express.json());

// CORS 支持（本地开发需要）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API 路由
app.post('/api/chat', async (req, res) => {
  try {
    await chatHandler(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '本地开发 API 服务器运行中' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 本地 API 服务器启动成功！`);
  console.log(`   地址: http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/chat`);
  console.log(`\n💡 请在另一个终端运行: npm run dev`);
  console.log(`   前端地址: http://localhost:5173 (或 5174)\n`);
});
