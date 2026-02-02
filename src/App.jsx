import React, { useState, useEffect, useRef } from 'react';
import {
  Upload, FileText, MessageSquare, ChevronRight, Plus, Sparkles, Target, Users,
  DollarSign, Megaphone, TrendingUp, CheckCircle, Lightbulb,
  ArrowRight, X, Send, BookOpen, Layers, Compass, FolderOpen, File,
  Image, FileSpreadsheet, Presentation, MoreVertical, Swords,
  Play, Zap, BarChart3, Globe, ArrowUpRight, ChevronDown, ChevronUp,
  Building2, Rocket, Map, UserCheck, ShoppingBag, Radio, Edit3, Eye,
  Clock, Star, AlertCircle, RefreshCw, Menu, Home, Bot, Settings, Loader
} from 'lucide-react';

import {
  chatWithNavigator,
  streamChatWithNavigator,
  analyzePositioning,
  analyzeMarket,
  analyzeUsers,
  analyzeSales,
  analyzeGTMRoadmap,
  analyzeCanvasDimension,
  checkAPIConfig
} from './aiService';

// ============================================
// 配置和常量
// ============================================

// 深挖分析维度
const ANALYSIS_DIMENSIONS = [
  {
    id: 'positioning',
    name: '产品定位与能力',
    icon: Target,
    color: 'violet',
    description: '明确产品在用户心智中的位置',
    aiAnalyzer: analyzePositioning,
    references: '《定位》特劳特 & 里斯'
  },
  {
    id: 'market',
    name: '市场选择',
    icon: Globe,
    color: 'blue',
    description: '判断该先打哪个细分市场',
    aiAnalyzer: analyzeMarket,
    references: '《跨越鸿沟》杰弗里·摩尔'
  },
  {
    id: 'users',
    name: '目标用户',
    icon: Users,
    color: 'emerald',
    description: '深入理解目标客户画像',
    aiAnalyzer: analyzeUsers,
    references: '《商业模式新生代》奥斯特瓦德'
  },
  {
    id: 'sales',
    name: '销售与推广',
    icon: Megaphone,
    color: 'amber',
    description: '设计获客和转化策略',
    aiAnalyzer: analyzeSales,
    references: '《超级转化率》陈勇'
  },
  {
    id: 'gtm',
    name: 'GTM路径',
    icon: Rocket,
    color: 'rose',
    description: '规划完整的市场进入路径',
    aiAnalyzer: analyzeGTMRoadmap,
    references: '《SaaS创业路线图》吴昊'
  }
];

// 商业画布维度
const CANVAS_DIMENSIONS = [
  { key: 'customerSegments', name: '客户细分', icon: Users },
  { key: 'valueProposition', name: '价值主张', icon: Star },
  { key: 'channels', name: '渠道通路', icon: Radio },
  { key: 'customerRelations', name: '客户关系', icon: UserCheck },
  { key: 'revenueStreams', name: '收入来源', icon: DollarSign },
  { key: 'keyResources', name: '核心资源', icon: Zap },
  { key: 'keyActivities', name: '关键业务', icon: RefreshCw },
  { key: 'keyPartners', name: '重要伙伴', icon: Building2 },
  { key: 'costStructure', name: '成本结构', icon: BarChart3 }
];

// 初始产品数据
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: '智能文档解析API',
    maturity: 'mature',
    description: '基于AI的文档结构化解析服务,支持PDF、Word、图片等格式',
    customers: ['金融机构', '政务部门', '大型企业'],
    stage: '营销验证期',
    positioning: '企业级文档智能处理专家',
    documents: [],
    canvas: {
      customerSegments: { value: '金融、政务、大型企业IT部门', status: 'verified' },
      valueProposition: { value: '高精度、多格式、私有化部署', status: 'verified' },
      channels: { value: '直销+渠道代理', status: 'exploring' },
      customerRelations: { value: '专属客户成功经理', status: 'verified' },
      revenueStreams: { value: 'API调用量计费 + 私有化部署license', status: 'verified' },
      keyResources: { value: 'AI模型、技术团队', status: 'verified' },
      keyActivities: { value: '模型迭代、客户交付', status: 'exploring' },
      keyPartners: { value: '云厂商、SI集成商', status: 'exploring' },
      costStructure: { value: '人力成本、算力成本', status: 'verified' }
    },
    competitors: [],
    analysis: {
      positioning: { status: 'not_started', summary: '' },
      market: { status: 'not_started', summary: '' },
      users: { status: 'not_started', summary: '' },
      sales: { status: 'not_started', summary: '' },
      gtm: { status: 'not_started', summary: '' }
    }
  }
];

// ============================================
// 主组件
// ============================================

export default function GTMAssistant() {
  const [activeModule, setActiveModule] = useState('navigator');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  // Navigator 状态
  const [navigatorHistory, setNavigatorHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const chatEndRef = useRef(null);

  // Modal 状态
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCanvasDetail, setShowCanvasDetail] = useState(null);

  // AI 分析状态
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  // API 配置检查
  const [apiConfig, setApiConfig] = useState(checkAPIConfig());

  // 新产品表单
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', maturity: 'exploring', customers: '', positioning: ''
  });

  // 初始化 Navigator
  useEffect(() => {
    if (navigatorHistory.length === 0) {
      setNavigatorHistory([{
        role: 'assistant',
        content: '你好!我是你的 GTM 引导师 🚀\n\n我会帮你从零开始梳理公司的产品矩阵和商业化路径。\n\n在开始之前,我想先了解一下你们公司的基本情况。请问:\n\n1. 你们公司主要做什么业务?\n2. 核心技术能力是什么?',
        timestamp: new Date()
      }]);
    }
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [navigatorHistory]);

  // ============================================
  // AI 对话处理
  // ============================================

  // 处理 Navigator 对话 - 使用流式 AI
  const handleNavigatorSend = async () => {
    if (!inputValue.trim() || isAIThinking) return;

    // 检查 API 配置
    if (!apiConfig.isConfigured) {
      alert('请先配置 API Key。复制 .env.example 为 .env,然后填入你的 Anthropic API Key。');
      return;
    }

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    // 添加用户消息
    const updatedHistory = [...navigatorHistory, userMessage];
    setNavigatorHistory(updatedHistory);
    setInputValue('');
    setIsAIThinking(true);

    // 添加一个空的 AI 消息,用于流式更新
    const aiMessageIndex = updatedHistory.length;
    setNavigatorHistory([...updatedHistory, {
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }]);

    // 调用流式 AI
    try {
      await streamChatWithNavigator(
        updatedHistory,
        (newText, fullText) => {
          // 每次收到新 token,更新消息
          setNavigatorHistory(prev => {
            const newHistory = [...prev];
            newHistory[aiMessageIndex] = {
              role: 'assistant',
              content: fullText,
              timestamp: new Date()
            };
            return newHistory;
          });
        },
        (fullText) => {
          // 完成
          setIsAIThinking(false);
        }
      );
    } catch (error) {
      console.error('AI 对话失败:', error);
      setNavigatorHistory(prev => {
        const newHistory = [...prev];
        newHistory[aiMessageIndex] = {
          role: 'assistant',
          content: '抱歉,我遇到了一些问题。请稍后再试,或检查你的 API 配置。\n\n错误信息: ' + error.message,
          timestamp: new Date(),
          isError: true
        };
        return newHistory;
      });
      setIsAIThinking(false);
    }
  };

  // ============================================
  // 深度分析处理
  // ============================================

  const handleRunAnalysis = async (dimension) => {
    if (!selectedProduct || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysisResult('');

    try {
      const productInfo = {
        name: selectedProduct.name,
        description: selectedProduct.description,
        positioning: selectedProduct.positioning,
        customers: selectedProduct.customers,
        stage: selectedProduct.stage,
        canvas: selectedProduct.canvas
      };

      const result = await dimension.aiAnalyzer(productInfo);

      if (result.success) {
        setAnalysisResult(result.content);

        // 更新产品分析状态
        setProducts(prevProducts =>
          prevProducts.map(p =>
            p.id === selectedProduct.id
              ? {
                  ...p,
                  analysis: {
                    ...p.analysis,
                    [dimension.id]: {
                      status: 'completed',
                      summary: result.content.slice(0, 100) + '...',
                      fullContent: result.content,
                      updatedAt: new Date()
                    }
                  }
                }
              : p
          )
        );

        // 同步更新 selectedProduct
        setSelectedProduct(prev => ({
          ...prev,
          analysis: {
            ...prev.analysis,
            [dimension.id]: {
              status: 'completed',
              summary: result.content.slice(0, 100) + '...',
              fullContent: result.content,
              updatedAt: new Date()
            }
          }
        }));
      } else {
        setAnalysisResult('分析失败: ' + result.error);
      }
    } catch (error) {
      console.error('分析失败:', error);
      setAnalysisResult('分析失败,请稍后重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ============================================
  // 产品管理
  // ============================================

  const handleAddProduct = () => {
    if (!newProduct.name.trim()) return;

    const product = {
      id: Date.now(),
      name: newProduct.name,
      description: newProduct.description || '待完善',
      maturity: newProduct.maturity,
      customers: newProduct.customers ? newProduct.customers.split('、') : [],
      stage: { mature: '营销验证期', growing: '产品验证期', exploring: '想法阶段' }[newProduct.maturity],
      positioning: newProduct.positioning || '待定',
      documents: [],
      canvas: Object.fromEntries(
        CANVAS_DIMENSIONS.map(d => [d.key, { value: '待完善', status: 'unknown' }])
      ),
      competitors: [],
      analysis: Object.fromEntries(
        ANALYSIS_DIMENSIONS.map(d => [d.id, { status: 'not_started', summary: '' }])
      )
    };

    setProducts([...products, product]);
    setShowAddProduct(false);
    setNewProduct({ name: '', description: '', maturity: 'exploring', customers: '', positioning: '' });
  };

  // ============================================
  // 样式工具函数
  // ============================================

  const getStatusStyle = (status) => {
    const styles = {
      verified: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: '已验证' },
      completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: '已完成' },
      exploring: { bg: 'bg-blue-50', text: 'text-blue-700', label: '探索中' },
      in_progress: { bg: 'bg-amber-50', text: 'text-amber-700', label: '进行中' },
      unknown: { bg: 'bg-slate-50', text: 'text-slate-500', label: '待完善' },
      not_started: { bg: 'bg-slate-50', text: 'text-slate-500', label: '未开始' }
    };
    return styles[status] || styles.unknown;
  };

  const getMaturityStyle = (maturity) => {
    const styles = {
      mature: { bg: 'bg-emerald-500', text: '成熟' },
      growing: { bg: 'bg-blue-500', text: '成长' },
      exploring: { bg: 'bg-amber-500', text: '探索' }
    };
    return styles[maturity] || styles.exploring;
  };

  // ============================================
  // 渲染：侧边栏
  // ============================================
  const renderSidebar = () => (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900">GTM 助手</h1>
            <p className="text-xs text-slate-500">AI 智能版</p>
          </div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 p-4 space-y-1">
        {[
          { id: 'navigator', icon: Bot, label: 'GTM 引导师', desc: 'AI 对话引导' },
          { id: 'panorama', icon: Layers, label: '产品全景图', desc: '查看所有产品' },
          { id: 'deepdive', icon: Target, label: '深度分析', desc: 'AI 深度分析' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeModule === item.id
                ? 'bg-violet-50 text-violet-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeModule === item.id ? 'text-violet-500' : 'text-slate-400'}`} />
            <div className="text-left">
              <div className="font-medium text-sm">{item.label}</div>
              <div className="text-xs text-slate-400">{item.desc}</div>
            </div>
          </button>
        ))}
      </nav>

      {/* API 状态 */}
      <div className="p-4 border-t border-slate-100">
        <div className={`text-xs px-3 py-2 rounded-lg ${
          apiConfig.isConfigured
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-amber-50 text-amber-700'
        }`}>
          {apiConfig.message}
        </div>
        <div className="text-xs text-slate-400 mt-3 px-2">
          <div className="font-medium mb-1">AI 能力来源</div>
          <div className="space-y-0.5">
            <div>• Claude 3.5 Sonnet</div>
            <div>• 商业方法论知识</div>
          </div>
        </div>
      </div>
    </aside>
  );

  // ============================================
  // 渲染：GTM 引导师
  // ============================================
  const renderNavigator = () => (
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* 头部 */}
      <header className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">GTM 引导师</h2>
            <p className="text-sm text-slate-500 mt-0.5">AI 驱动的商业化分析对话</p>
          </div>
          <button
            onClick={() => {
              setNavigatorHistory([{
                role: 'assistant',
                content: '你好!我是你的 GTM 引导师 🚀\n\n我会帮你从零开始梳理公司的产品矩阵和商业化路径。\n\n在开始之前,我想先了解一下你们公司的基本情况。请问:\n\n1. 你们公司主要做什么业务?\n2. 核心技术能力是什么?',
                timestamp: new Date()
              }]);
            }}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            重新开始
          </button>
        </div>
      </header>

      {/* 对话区域 */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {navigatorHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mr-3 flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-lg rounded-2xl px-5 py-4 ${
                msg.role === 'user'
                  ? 'bg-violet-600 text-white'
                  : msg.isError
                  ? 'bg-rose-50 border border-rose-200 text-rose-700'
                  : 'bg-white border border-slate-200 text-slate-700 shadow-sm'
              }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* AI 思考中提示 */}
          {isAIThinking && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mr-3 flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI 正在思考...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="px-8 py-3 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto pb-2">
          {[
            '我们是一家 AI 文档处理公司',
            '目前有 2-3 个产品方向',
            '想了解如何做市场定位'
          ].map((text, i) => (
            <button
              key={i}
              onClick={() => setInputValue(text)}
              disabled={isAIThinking}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400 text-slate-600 text-sm rounded-full whitespace-nowrap transition-colors"
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      {/* 输入框 */}
      <div className="px-8 py-4 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleNavigatorSend();
                }
              }}
              disabled={isAIThinking}
              placeholder={isAIThinking ? 'AI 正在思考...' : '描述你的情况...'}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm disabled:bg-slate-100 disabled:text-slate-400"
              rows={1}
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleNavigatorSend}
            disabled={!inputValue.trim() || isAIThinking}
            className="w-12 h-12 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-violet-500/25 disabled:shadow-none"
          >
            {isAIThinking ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================
  // 渲染：产品全景图
  // ============================================
  const renderPanorama = () => (
    <div className="flex-1 bg-slate-50 overflow-y-auto">
      {/* 头部 */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">产品全景图</h2>
            <p className="text-sm text-slate-500 mt-0.5">管理和追踪所有产品的商业化进展</p>
          </div>
          <button
            onClick={() => setShowAddProduct(true)}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-violet-500/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            添加产品
          </button>
        </div>
      </header>

      <div className="p-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: '全部产品', value: products.length, color: 'slate' },
            { label: '成熟产品', value: products.filter(p => p.maturity === 'mature').length, color: 'emerald' },
            { label: '成长中', value: products.filter(p => p.maturity === 'growing').length, color: 'blue' },
            { label: '探索中', value: products.filter(p => p.maturity === 'exploring').length, color: 'amber' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200">
              <div className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 产品卡片网格 */}
        <div className="grid grid-cols-3 gap-5">
          {products.map(product => {
            const maturity = getMaturityStyle(product.maturity);
            const completedAnalysis = Object.values(product.analysis).filter(a => a.status === 'completed').length;

            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group"
              >
                {/* 头部 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${maturity.bg}`} />
                      <span className="text-xs text-slate-400">{maturity.text}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 text-lg group-hover:text-violet-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500 transition-colors" />
                </div>

                {/* 描述 */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{product.description}</p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.customers.slice(0, 2).map((c, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                      {c}
                    </span>
                  ))}
                </div>

                {/* 进度 */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>AI 分析完成度</span>
                    <span>{completedAnalysis}/5</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full transition-all"
                      style={{ width: `${(completedAnalysis / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* 添加产品卡片 */}
          <button
            onClick={() => setShowAddProduct(true)}
            className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:border-violet-300 hover:bg-violet-50 transition-all flex flex-col items-center justify-center min-h-[240px] group"
          >
            <div className="w-12 h-12 bg-slate-100 group-hover:bg-violet-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-violet-500" />
            </div>
            <span className="text-slate-500 group-hover:text-violet-600 font-medium">添加新产品</span>
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================
  // 渲染：产品详情页
  // ============================================
  const renderProductDetail = () => {
    if (!selectedProduct) return null;

    return (
      <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl">
          {/* 头部 */}
          <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${getMaturityStyle(selectedProduct.maturity).bg}`} />
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{selectedProduct.name}</h2>
                <p className="text-sm text-slate-500">{selectedProduct.positioning}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedProduct(null);
                setSelectedAnalysis(null);
                setAnalysisResult('');
              }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* 内容 */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* 深度分析模块 */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                AI 深度分析
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {ANALYSIS_DIMENSIONS.map(dim => {
                  const analysis = selectedProduct.analysis[dim.id];
                  const status = getStatusStyle(analysis?.status);

                  return (
                    <button
                      key={dim.id}
                      onClick={() => setSelectedAnalysis(dim)}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl p-4 text-left transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-${dim.color}-100 flex items-center justify-center mb-3`}>
                        <dim.icon className={`w-5 h-5 text-${dim.color}-600`} />
                      </div>
                      <div className="font-medium text-slate-900 text-sm mb-1">{dim.name}</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${status.bg} ${status.text}`}>
                        {status.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 商业模式画布 */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                商业模式画布
                <span className="text-xs font-normal text-slate-400">《商业模式新生代》</span>
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {CANVAS_DIMENSIONS.map(dim => {
                  const data = selectedProduct.canvas[dim.key];
                  const status = getStatusStyle(data?.status);

                  return (
                    <div
                      key={dim.key}
                      className="bg-white border border-slate-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <dim.icon className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">{dim.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">{data?.value || '待完善'}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // 渲染：深度分析弹窗
  // ============================================
  const renderAnalysisModal = () => {
    if (!selectedAnalysis || !selectedProduct) return null;

    const analysis = selectedProduct.analysis[selectedAnalysis.id];

    return (
      <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl">
          {/* 头部 */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-${selectedAnalysis.color}-100 flex items-center justify-center`}>
                <selectedAnalysis.icon className={`w-5 h-5 text-${selectedAnalysis.color}-600`} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{selectedAnalysis.name}</h3>
                <p className="text-xs text-slate-500">参考: {selectedAnalysis.references}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedAnalysis(null);
                setAnalysisResult('');
              }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* 内容 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* 运行分析按钮 */}
            {!analysisResult && analysis.status !== 'completed' && (
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 text-center">
                <Sparkles className="w-12 h-12 text-violet-500 mx-auto mb-3" />
                <p className="text-slate-700 mb-4">
                  点击按钮,让 AI 基于【{selectedAnalysis.references}】的方法论深度分析这个产品
                </p>
                <button
                  onClick={() => handleRunAnalysis(selectedAnalysis)}
                  disabled={isAnalyzing || !apiConfig.isConfigured}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-medium rounded-xl transition-colors shadow-lg shadow-violet-500/25 disabled:shadow-none flex items-center gap-2 mx-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      AI 分析中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      开始 AI 分析
                    </>
                  )}
                </button>
              </div>
            )}

            {/* 分析中加载 */}
            {isAnalyzing && (
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 text-slate-600 mb-4">
                  <Loader className="w-5 h-5 animate-spin text-violet-500" />
                  <span className="font-medium">AI 正在深度分析中...</span>
                </div>
                <p className="text-sm text-slate-500">
                  分析过程可能需要 10-30 秒,请稍候。AI 正在基于{selectedAnalysis.references}的理论框架,结合你的产品信息进行专业分析。
                </p>
              </div>
            )}

            {/* 分析结果 */}
            {(analysisResult || analysis.fullContent) && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium text-slate-900">AI 分析结果</span>
                </div>
                <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                  {analysisResult || analysis.fullContent}
                </div>
              </div>
            )}

            {/* 已完成的分析 - 显示摘要和重新分析按钮 */}
            {!analysisResult && analysis.status === 'completed' && analysis.fullContent && (
              <>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-emerald-900 mb-1">已完成分析</div>
                    <div className="text-sm text-emerald-700 whitespace-pre-wrap">
                      {analysis.fullContent}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRunAnalysis(selectedAnalysis)}
                  disabled={isAnalyzing}
                  className="w-full px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  重新分析
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // 渲染:添加产品弹窗
  // ============================================
  const renderAddProductModal = () => {
    if (!showAddProduct) return null;

    return (
      <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">添加新产品</h3>
            <button
              onClick={() => setShowAddProduct(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">产品名称 *</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="例如:智能表格解析"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">产品描述</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                rows={3}
                placeholder="简单描述这个产品..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">成熟度</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'exploring', label: '探索中', desc: '想法阶段' },
                  { value: 'growing', label: '成长中', desc: '有初步产品' },
                  { value: 'mature', label: '成熟', desc: '已商业化' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setNewProduct({ ...newProduct, maturity: opt.value })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      newProduct.maturity === opt.value
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium text-sm text-slate-900">{opt.label}</div>
                    <div className="text-xs text-slate-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">目标客户</label>
              <input
                type="text"
                value={newProduct.customers}
                onChange={(e) => setNewProduct({ ...newProduct, customers: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="用顿号分隔,例如:金融机构、政务部门"
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 flex gap-3">
            <button
              onClick={() => setShowAddProduct(false)}
              className="flex-1 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleAddProduct}
              disabled={!newProduct.name.trim()}
              className="flex-1 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shadow-lg shadow-violet-500/25 disabled:shadow-none"
            >
              添加产品
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // 渲染:深挖助手(选择产品)
  // ============================================
  const renderDeepDive = () => (
    <div className="flex-1 bg-slate-50 overflow-y-auto">
      <header className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-slate-900">深度分析</h2>
        <p className="text-sm text-slate-500 mt-0.5">选择一个产品,进行 AI 驱动的系统性 GTM 分析</p>
      </header>

      <div className="p-8">
        <div className="max-w-3xl mx-auto grid grid-cols-2 gap-4">
          {products.map(product => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white border border-slate-200 hover:border-violet-300 hover:shadow-lg rounded-2xl p-6 text-left transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${getMaturityStyle(product.maturity).bg}`} />
                <span className="text-xs text-slate-400">{getMaturityStyle(product.maturity).text}</span>
              </div>
              <h3 className="font-semibold text-slate-900 text-lg group-hover:text-violet-600 transition-colors mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ============================================
  // 主渲染
  // ============================================
  return (
    <div className="h-screen flex bg-slate-50">
      {renderSidebar()}

      {activeModule === 'navigator' && renderNavigator()}
      {activeModule === 'panorama' && renderPanorama()}
      {activeModule === 'deepdive' && renderDeepDive()}

      {renderProductDetail()}
      {renderAnalysisModal()}
      {renderAddProductModal()}
    </div>
  );
}
