'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import { TrendingUp, Activity, PieChart as PieChartIcon, BarChart3, Zap } from 'lucide-react';
import { aiModels } from '@/lib/mockData';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { TimeRange } from '@/lib/types';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7D');
  const timeRanges: TimeRange[] = ['1H', '24H', '7D', '30D', 'ALL'];

  // Prepare data for charts
  const performanceData = aiModels.map(model => ({
    name: model.name.split(' ')[0],
    pnl: model.totalPnL,
    accountValue: model.accountValue,
    trades: model.totalTrades,
    winRate: model.winRate,
    color: model.color
  }));

  const pieData = aiModels.map(model => ({
    name: model.name,
    value: model.accountValue,
    color: model.color
  }));

  // Heatmap data for trading activity by hour
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['00', '04', '08', '12', '16', '20'];
  const heatmapData = daysOfWeek.flatMap((day, dayIndex) =>
    hours.map((hour, hourIndex) => ({
      day,
      hour,
      value: Math.floor(Math.random() * 100),
      dayIndex,
      hourIndex
    }))
  );

  // Comparative line chart data
  const comparisonData = Array.from({ length: 30 }, (_, i) => {
    const dataPoint: Record<string, string | number> = { day: `Day ${i + 1}` };
    aiModels.forEach(model => {
      const point = model.performanceHistory[Math.floor(i * (model.performanceHistory.length / 30))];
      if (point) {
        dataPoint[model.name] = point.accountValue;
      }
    });
    return dataPoint;
  });

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-100 border border-dark-300 rounded-lg p-3 shadow-lg">
          <p className="text-gray-400 text-sm mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <section className="bg-dark-50 border-b border-dark-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-gray-400 mt-1">Comprehensive performance analysis across all AI models</p>
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
        </div>
      </section>

      {/* Summary Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <p className="stat-label">Top Performer</p>
            </div>
            <p className="stat-value text-white">DeepSeek V3</p>
            <p className="text-sm text-green-400 mt-1">+34.57% ROI</p>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <p className="stat-label">Avg. Sharpe Ratio</p>
            </div>
            <p className="stat-value text-white">1.97</p>
            <p className="text-sm text-gray-500 mt-1">Across all models</p>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <p className="stat-label">Total Trades</p>
            </div>
            <p className="stat-value text-white">{formatNumber(aiModels.reduce((sum, m) => sum + m.totalTrades, 0), 0)}</p>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <p className="stat-label">Avg. Win Rate</p>
            </div>
            <p className="stat-value text-white">
              {formatNumber(aiModels.reduce((sum, m) => sum + m.winRate, 0) / aiModels.length, 1)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">All models combined</p>
          </div>
        </div>
      </section>

      {/* Comparative Performance Chart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            <h2 className="text-xl font-bold text-white">Comparative Performance</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={comparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                interval={4}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              {aiModels.map((model) => (
                <Line
                  key={model.id}
                  type="monotone"
                  dataKey={model.name}
                  stroke={model.color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {aiModels.map((model) => (
              <div key={model.id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: model.color }} />
                <span className="text-sm text-gray-400">{model.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PnL Comparison and Portfolio Distribution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PnL Bar Chart */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Total PnL by Model</h2>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={true} vertical={false} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  width={80}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'PnL']}
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Portfolio Distribution Pie Chart */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="w-5 h-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Portfolio Distribution</h2>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${(name || '').toString().split(' ')[0]} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Value']}
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Trading Patterns Heatmap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary-400" />
            <h2 className="text-xl font-bold text-white">Trading Activity Heatmap</h2>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {hours.map(hour => (
                  <div key={hour} className="text-center text-xs text-gray-500">
                    {hour}:00
                  </div>
                ))}
              </div>
              {daysOfWeek.map((day, dayIndex) => (
                <div key={day} className="grid grid-cols-7 gap-1 mb-1">
                  <div className="text-xs text-gray-400 flex items-center">{day}</div>
                  {hours.slice(0, 6).map((_, hourIndex) => {
                    const value = heatmapData.find(d => d.dayIndex === dayIndex && d.hourIndex === hourIndex)?.value || 0;
                    const intensity = value / 100;
                    return (
                      <div
                        key={`${day}-${hourIndex}`}
                        className="aspect-square rounded-sm cursor-pointer hover:ring-2 hover:ring-primary-400"
                        style={{
                          backgroundColor: `rgba(99, 102, 241, ${0.1 + intensity * 0.8})`
                        }}
                        title={`${day} ${hours[hourIndex]}:00 - ${value} trades`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="text-xs text-gray-500">Low Activity</span>
            <div className="flex gap-1">
              {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
                <div
                  key={opacity}
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: `rgba(99, 102, 241, ${opacity})` }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">High Activity</span>
          </div>
        </div>
      </section>

      {/* Model Comparison Radar Chart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-primary-400" />
            <h2 className="text-xl font-bold text-white">Win Rate Comparison</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Win Rate']}
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Bar dataKey="winRate" radius={[4, 4, 0, 0]}>
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.winRate >= 60 ? '#22c55e' : entry.winRate >= 50 ? '#eab308' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
