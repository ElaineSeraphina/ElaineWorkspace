import { AIModel, Trade, PerformancePoint } from './types';

const assets = ['BTC', 'ETH', 'SOL', 'DOGE', 'XRP', 'ADA', 'AVAX', 'LINK'];

function generateTrades(count: number, profitBias: number): Trade[] {
  const trades: Trade[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const action = Math.random() > 0.5 ? 'BUY' : 'SELL';
    const amount = Math.random() * 10 + 0.1;
    const price = asset === 'BTC' ? 95000 + Math.random() * 10000 :
                  asset === 'ETH' ? 3200 + Math.random() * 500 :
                  asset === 'SOL' ? 220 + Math.random() * 50 :
                  asset === 'DOGE' ? 0.35 + Math.random() * 0.1 :
                  asset === 'XRP' ? 2.2 + Math.random() * 0.5 :
                  asset === 'ADA' ? 0.9 + Math.random() * 0.2 :
                  asset === 'AVAX' ? 40 + Math.random() * 10 :
                  15 + Math.random() * 5;
    
    const pnl = (Math.random() - (0.5 - profitBias * 0.2)) * amount * price * 0.1;
    
    trades.push({
      id: `trade-${i}-${Date.now()}`,
      timestamp,
      asset,
      action,
      amount: Math.round(amount * 1000) / 1000,
      price: Math.round(price * 100) / 100,
      pnl: Math.round(pnl * 100) / 100
    });
  }
  
  return trades.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function generatePerformanceHistory(days: number, initialValue: number, volatility: number, trend: number): PerformancePoint[] {
  const history: PerformancePoint[] = [];
  const now = new Date();
  let currentValue = initialValue;
  
  const pointsPerDay = 24;
  const totalPoints = days * pointsPerDay;
  
  for (let i = totalPoints; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const change = (Math.random() - 0.48 + trend * 0.02) * volatility * currentValue * 0.01;
    currentValue = Math.max(currentValue * 0.5, currentValue + change);
    
    history.push({
      timestamp,
      accountValue: Math.round(currentValue * 100) / 100,
      pnl: Math.round((currentValue - initialValue) * 100) / 100
    });
  }
  
  return history;
}

export const aiModels: AIModel[] = [
  {
    id: 'gpt-5-ultra',
    name: 'GPT-5 Ultra',
    model: 'OpenAI GPT-5',
    avatar: '🤖',
    accountValue: 1287432.58,
    initialCapital: 1000000,
    totalPnL: 287432.58,
    dailyPnL: 15234.67,
    hourlyPnL: 1523.45,
    winRate: 68.5,
    sharpeRatio: 2.45,
    change24h: 4.8,
    totalTrades: 1847,
    status: 'active',
    trades: generateTrades(100, 0.6),
    performanceHistory: generatePerformanceHistory(30, 1000000, 1.2, 0.3),
    description: 'OpenAI\'s flagship model optimized for quantitative trading with advanced reasoning capabilities.',
    color: '#10a37f'
  },
  {
    id: 'claude-opus',
    name: 'Claude Opus',
    model: 'Anthropic Claude',
    avatar: '🧠',
    accountValue: 1198234.12,
    initialCapital: 1000000,
    totalPnL: 198234.12,
    dailyPnL: 8923.45,
    hourlyPnL: 892.34,
    winRate: 65.2,
    sharpeRatio: 2.12,
    change24h: 2.3,
    totalTrades: 1532,
    status: 'active',
    trades: generateTrades(100, 0.45),
    performanceHistory: generatePerformanceHistory(30, 1000000, 1.0, 0.2),
    description: 'Anthropic\'s most capable model with careful risk management and consistent performance.',
    color: '#cc785c'
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    model: 'DeepSeek AI',
    avatar: '🔮',
    accountValue: 1345678.90,
    initialCapital: 1000000,
    totalPnL: 345678.90,
    dailyPnL: 22345.67,
    hourlyPnL: 2234.56,
    winRate: 71.3,
    sharpeRatio: 2.78,
    change24h: 6.2,
    totalTrades: 2134,
    status: 'active',
    trades: generateTrades(100, 0.7),
    performanceHistory: generatePerformanceHistory(30, 1000000, 1.5, 0.35),
    description: 'Chinese AI powerhouse with aggressive trading strategies and high win rate.',
    color: '#6366f1'
  },
  {
    id: 'gemini-ultra',
    name: 'Gemini Ultra',
    model: 'Google Gemini',
    avatar: '💎',
    accountValue: 1123456.78,
    initialCapital: 1000000,
    totalPnL: 123456.78,
    dailyPnL: -5234.56,
    hourlyPnL: -523.45,
    winRate: 58.7,
    sharpeRatio: 1.67,
    change24h: -1.8,
    totalTrades: 1289,
    status: 'active',
    trades: generateTrades(100, 0.3),
    performanceHistory: generatePerformanceHistory(30, 1000000, 1.3, 0.1),
    description: 'Google\'s multimodal model with diverse market analysis capabilities.',
    color: '#4285f4'
  },
  {
    id: 'grok-3',
    name: 'Grok 3',
    model: 'xAI Grok',
    avatar: '⚡',
    accountValue: 876543.21,
    initialCapital: 1000000,
    totalPnL: -123456.79,
    dailyPnL: -12345.67,
    hourlyPnL: -1234.56,
    winRate: 42.1,
    sharpeRatio: 0.89,
    change24h: -8.5,
    totalTrades: 987,
    status: 'active',
    trades: generateTrades(100, -0.2),
    performanceHistory: generatePerformanceHistory(30, 1000000, 2.0, -0.15),
    description: 'xAI\'s controversial model with high-risk strategies and volatile performance.',
    color: '#000000'
  },
  {
    id: 'qwen-max',
    name: 'Qwen Max',
    model: 'Alibaba Qwen',
    avatar: '🌟',
    accountValue: 1089234.56,
    initialCapital: 1000000,
    totalPnL: 89234.56,
    dailyPnL: 3456.78,
    hourlyPnL: 345.67,
    winRate: 61.4,
    sharpeRatio: 1.89,
    change24h: 1.2,
    totalTrades: 1456,
    status: 'active',
    trades: generateTrades(100, 0.35),
    performanceHistory: generatePerformanceHistory(30, 1000000, 0.9, 0.15),
    description: 'Alibaba\'s flagship model with balanced risk-reward approach.',
    color: '#ff6a00'
  }
];

export function getModelById(id: string): AIModel | undefined {
  return aiModels.find(model => model.id === id);
}

export function getTopPerformers(count: number = 3): AIModel[] {
  return [...aiModels]
    .sort((a, b) => b.totalPnL - a.totalPnL)
    .slice(0, count);
}

export function getTotalStats() {
  const totalTrades = aiModels.reduce((sum, model) => sum + model.totalTrades, 0);
  const totalValue = aiModels.reduce((sum, model) => sum + model.accountValue, 0);
  const averageWinRate = aiModels.reduce((sum, model) => sum + model.winRate, 0) / aiModels.length;
  const bestPerformer = [...aiModels].sort((a, b) => b.change24h - a.change24h)[0];
  const worstPerformer = [...aiModels].sort((a, b) => a.change24h - b.change24h)[0];
  
  return {
    totalTrades,
    totalValue,
    averageWinRate: Math.round(averageWinRate * 10) / 10,
    bestPerformer,
    worstPerformer,
    activeModels: aiModels.filter(m => m.status === 'active').length
  };
}

// Simulate real-time updates
export function simulateUpdate(model: AIModel): AIModel {
  const pnlChange = (Math.random() - 0.48) * model.accountValue * 0.001;
  const newAccountValue = model.accountValue + pnlChange;
  const newHourlyPnL = model.hourlyPnL + pnlChange;
  
  return {
    ...model,
    accountValue: Math.round(newAccountValue * 100) / 100,
    hourlyPnL: Math.round(newHourlyPnL * 100) / 100,
    totalPnL: Math.round((model.totalPnL + pnlChange) * 100) / 100,
    change24h: Math.round((model.change24h + (Math.random() - 0.5) * 0.1) * 100) / 100
  };
}
