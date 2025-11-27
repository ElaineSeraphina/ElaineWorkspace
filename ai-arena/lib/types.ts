export interface Trade {
  id: string;
  timestamp: Date;
  asset: string;
  action: 'BUY' | 'SELL';
  amount: number;
  price: number;
  pnl: number;
}

export interface PerformancePoint {
  timestamp: Date;
  accountValue: number;
  pnl: number;
}

export interface AIModel {
  id: string;
  name: string;
  model: string;
  avatar: string;
  accountValue: number;
  initialCapital: number;
  totalPnL: number;
  dailyPnL: number;
  hourlyPnL: number;
  winRate: number;
  sharpeRatio: number;
  change24h: number;
  totalTrades: number;
  status: 'active' | 'inactive';
  trades: Trade[];
  performanceHistory: PerformancePoint[];
  description: string;
  color: string;
}

export type TimeRange = '1H' | '24H' | '7D' | '30D' | 'ALL';

export type SortField = 'rank' | 'accountValue' | 'totalPnL' | 'dailyPnL' | 'winRate' | 'sharpeRatio' | 'change24h' | 'totalTrades';

export type SortOrder = 'asc' | 'desc';
