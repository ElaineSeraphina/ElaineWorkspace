'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpDown, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { AIModel, SortField, SortOrder, TimeRange } from '@/lib/types';
import { formatCurrency, formatPercent, formatNumber, getColorForValue } from '@/lib/utils';
import { aiModels as initialModels, simulateUpdate } from '@/lib/mockData';

interface LeaderboardProps {
  showTitle?: boolean;
  limit?: number;
  showTimeRange?: boolean;
}

export default function Leaderboard({ showTitle = true, limit, showTimeRange = true }: LeaderboardProps) {
  const [models, setModels] = useState<AIModel[]>(initialModels);
  const [sortField, setSortField] = useState<SortField>('accountValue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [timeRange, setTimeRange] = useState<TimeRange>('24H');
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setModels(prevModels => 
        prevModels.map(model => simulateUpdate(model))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sortModels = (modelsToSort: AIModel[]) => {
    return [...modelsToSort].sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (sortField) {
        case 'rank':
          aValue = a.totalPnL;
          bValue = b.totalPnL;
          break;
        case 'accountValue':
          aValue = a.accountValue;
          bValue = b.accountValue;
          break;
        case 'totalPnL':
          aValue = a.totalPnL;
          bValue = b.totalPnL;
          break;
        case 'dailyPnL':
          aValue = a.dailyPnL;
          bValue = b.dailyPnL;
          break;
        case 'winRate':
          aValue = a.winRate;
          bValue = b.winRate;
          break;
        case 'sharpeRatio':
          aValue = a.sharpeRatio;
          bValue = b.sharpeRatio;
          break;
        case 'change24h':
          aValue = a.change24h;
          bValue = b.change24h;
          break;
        case 'totalTrades':
          aValue = a.totalTrades;
          bValue = b.totalTrades;
          break;
        default:
          aValue = a.accountValue;
          bValue = b.accountValue;
      }
      
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedModels = sortModels(filteredModels);
  const displayModels = limit ? sortedModels.slice(0, limit) : sortedModels;

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-white transition-colors"
    >
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? 'text-primary-400' : ''}`} />
    </button>
  );

  const timeRanges: TimeRange[] = ['1H', '24H', '7D', '30D', 'ALL'];

  return (
    <div className="card">
      {showTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">AI Models Leaderboard</h2>
            <p className="text-gray-400 text-sm mt-1">Real-time performance tracking</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
            
            {/* Time Range Selector */}
            {showTimeRange && (
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
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-xs uppercase border-b border-dark-200">
              <th className="text-left py-4 px-2 font-medium">Rank</th>
              <th className="text-left py-4 px-2 font-medium">Model</th>
              <th className="text-right py-4 px-2 font-medium">
                <SortHeader field="accountValue" label="Account Value" />
              </th>
              <th className="text-right py-4 px-2 font-medium">
                <SortHeader field="totalPnL" label="Total PnL" />
              </th>
              <th className="text-right py-4 px-2 font-medium hidden md:table-cell">
                <SortHeader field="dailyPnL" label="24h PnL" />
              </th>
              <th className="text-right py-4 px-2 font-medium hidden lg:table-cell">
                <SortHeader field="winRate" label="Win Rate" />
              </th>
              <th className="text-right py-4 px-2 font-medium hidden lg:table-cell">
                <SortHeader field="sharpeRatio" label="Sharpe" />
              </th>
              <th className="text-right py-4 px-2 font-medium">
                <SortHeader field="change24h" label="24h Change" />
              </th>
              <th className="text-right py-4 px-2 font-medium hidden sm:table-cell">
                <SortHeader field="totalTrades" label="Trades" />
              </th>
              <th className="text-right py-4 px-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {displayModels.map((model) => {
              const rank = sortedModels.findIndex(m => m.id === model.id) + 1;
              return (
                <tr
                  key={model.id}
                  className="border-b border-dark-200 hover:bg-dark-100 transition-colors"
                >
                  <td className="py-4 px-2">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                      rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                      rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-dark-200 text-gray-400'
                    }`}>
                      {rank}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-dark-200 flex items-center justify-center text-xl">
                        {model.avatar}
                      </div>
                      <div>
                        <p className="text-white font-medium">{model.name}</p>
                        <p className="text-gray-500 text-xs">{model.model}</p>
                      </div>
                      {model.status === 'active' && (
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <span className="text-white font-medium">
                      {formatCurrency(model.accountValue)}
                    </span>
                  </td>
                  <td className={`py-4 px-2 text-right font-medium ${getColorForValue(model.totalPnL)}`}>
                    {model.totalPnL >= 0 ? '+' : ''}{formatCurrency(model.totalPnL)}
                  </td>
                  <td className={`py-4 px-2 text-right font-medium hidden md:table-cell ${getColorForValue(model.dailyPnL)}`}>
                    {model.dailyPnL >= 0 ? '+' : ''}{formatCurrency(model.dailyPnL)}
                  </td>
                  <td className="py-4 px-2 text-right hidden lg:table-cell">
                    <span className="text-white">{formatNumber(model.winRate, 1)}%</span>
                  </td>
                  <td className="py-4 px-2 text-right hidden lg:table-cell">
                    <span className="text-white">{formatNumber(model.sharpeRatio, 2)}</span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                      model.change24h >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {model.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {formatPercent(model.change24h)}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right hidden sm:table-cell">
                    <span className="text-gray-400">{formatNumber(model.totalTrades, 0)}</span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <Link
                      href={`/models/${model.id}`}
                      className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Auto-refresh indicator */}
      <div className="flex items-center justify-end mt-4 gap-2 text-xs text-gray-500">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        Auto-refreshing every 5s
      </div>
    </div>
  );
}
