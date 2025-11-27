'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Target, BarChart3, Wallet, Clock, AlertTriangle } from 'lucide-react';
import { getModelById } from '@/lib/mockData';
import { formatCurrency, formatNumber, formatPercent, getColorForValue } from '@/lib/utils';
import PerformanceChart from '@/components/PerformanceChart';
import TradeHistory from '@/components/TradeHistory';
import { useState } from 'react';
import { TimeRange } from '@/lib/types';

export default function ModelPage() {
  const params = useParams();
  const modelId = params.modelId as string;
  const model = getModelById(modelId);
  const [timeRange, setTimeRange] = useState<TimeRange>('7D');

  if (!model) {
    notFound();
  }

  const timeRanges: TimeRange[] = ['1H', '24H', '7D', '30D', 'ALL'];

  const getFilteredHistory = () => {
    const now = new Date();
    const hours = {
      '1H': 1,
      '24H': 24,
      '7D': 24 * 7,
      '30D': 24 * 30,
      'ALL': 24 * 365
    }[timeRange];

    return model.performanceHistory.filter(point => {
      const pointTime = new Date(point.timestamp).getTime();
      return pointTime > now.getTime() - hours * 60 * 60 * 1000;
    });
  };

  const filteredHistory = getFilteredHistory();
  const roi = ((model.accountValue - model.initialCapital) / model.initialCapital) * 100;

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <section className="bg-dark-50 border-b border-dark-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Leaderboard
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-dark-200 flex items-center justify-center text-4xl">
                {model.avatar}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">{model.name}</h1>
                  {model.status === 'active' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded-full">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400 font-medium">Active</span>
                    </span>
                  )}
                </div>
                <p className="text-gray-400">{model.model}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Account Value</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(model.accountValue)}</p>
              </div>
              <div className={`flex items-center gap-1 px-3 py-2 rounded-lg ${
                model.change24h >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}>
                {model.change24h >= 0 ? (
                  <TrendingUp className={`w-5 h-5 ${model.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                ) : (
                  <TrendingDown className={`w-5 h-5 ${model.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                )}
                <span className={`text-lg font-bold ${model.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercent(model.change24h)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-primary-400" />
              <p className="stat-label">Total PnL</p>
            </div>
            <p className={`stat-value ${getColorForValue(model.totalPnL)}`}>
              {model.totalPnL >= 0 ? '+' : ''}{formatCurrency(model.totalPnL)}
            </p>
            <p className={`text-sm mt-1 ${getColorForValue(roi)}`}>
              {roi >= 0 ? '+' : ''}{formatNumber(roi, 2)}% ROI
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <p className="stat-label">24h PnL</p>
            </div>
            <p className={`stat-value ${getColorForValue(model.dailyPnL)}`}>
              {model.dailyPnL >= 0 ? '+' : ''}{formatCurrency(model.dailyPnL)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Hourly: {model.hourlyPnL >= 0 ? '+' : ''}{formatCurrency(model.hourlyPnL)}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-400" />
              <p className="stat-label">Win Rate</p>
            </div>
            <p className="stat-value text-white">{formatNumber(model.winRate, 1)}%</p>
            <p className="text-sm text-gray-500 mt-1">{formatNumber(model.totalTrades, 0)} trades</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <p className="stat-label">Sharpe Ratio</p>
            </div>
            <p className="stat-value text-white">{formatNumber(model.sharpeRatio, 2)}</p>
            <p className="text-sm text-gray-500 mt-1">Risk-adjusted return</p>
          </div>
        </div>
      </section>

      {/* Performance Chart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Performance History</h2>
              <p className="text-gray-400 text-sm">Account value over time</p>
            </div>
            
            <div className="flex bg-dark-200 rounded-lg p-1">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    timeRange === range
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          <PerformanceChart
            data={filteredHistory}
            color={model.color}
            height={400}
          />
        </div>
      </section>

      {/* Risk Metrics and Description */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Description */}
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-semibold text-white mb-4">About This Model</h3>
            <p className="text-gray-400">{model.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-dark-200">
              <div>
                <p className="text-sm text-gray-500">Initial Capital</p>
                <p className="text-white font-medium">{formatCurrency(model.initialCapital)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Value</p>
                <p className="text-white font-medium">{formatCurrency(model.accountValue)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Trades</p>
                <p className="text-white font-medium">{formatNumber(model.totalTrades, 0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-green-400 font-medium capitalize">{model.status}</p>
              </div>
            </div>
          </div>

          {/* Risk Metrics */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Risk Metrics</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">Sharpe Ratio</span>
                  <span className="text-white font-medium">{formatNumber(model.sharpeRatio, 2)}</span>
                </div>
                <div className="h-2 bg-dark-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      model.sharpeRatio > 2 ? 'bg-green-500' :
                      model.sharpeRatio > 1 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, model.sharpeRatio * 33)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">Win Rate</span>
                  <span className="text-white font-medium">{formatNumber(model.winRate, 1)}%</span>
                </div>
                <div className="h-2 bg-dark-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      model.winRate > 60 ? 'bg-green-500' :
                      model.winRate > 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${model.winRate}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">ROI</span>
                  <span className={`font-medium ${getColorForValue(roi)}`}>
                    {roi >= 0 ? '+' : ''}{formatNumber(roi, 2)}%
                  </span>
                </div>
                <div className="h-2 bg-dark-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${roi > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, Math.abs(roi))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trading History */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Recent Trades</h2>
              <p className="text-gray-400 text-sm">Last {model.trades.length} transactions</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <TradeHistory trades={model.trades} limit={20} />
        </div>
      </section>
    </div>
  );
}
