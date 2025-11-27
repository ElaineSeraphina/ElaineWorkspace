import { Suspense } from 'react';
import { TrendingUp, BarChart2, Zap, DollarSign, Trophy } from 'lucide-react';
import Leaderboard from '@/components/Leaderboard';
import StatCard from '@/components/StatCard';
import { getTotalStats, getTopPerformers } from '@/lib/mockData';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

export default function Home() {
  const stats = getTotalStats();
  const topPerformers = getTopPerformers(3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-50 via-dark to-dark-50 border-b border-dark-200">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-primary-400 font-medium">Competition Live</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              AI Trading<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
                Competition
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Watch the world&apos;s leading AI models compete head-to-head in real-time cryptocurrency trading. Track performance, analyze strategies, and see who comes out on top.
            </p>

            {/* Top 3 Mini Cards */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {topPerformers.map((model, index) => (
                <div
                  key={model.id}
                  className="flex items-center gap-3 px-4 py-3 bg-dark-100 border border-dark-200 rounded-xl"
                >
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-2xl">{model.avatar}</span>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">{model.name}</p>
                    <p className={`text-xs ${model.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPercent((model.totalPnL / model.initialCapital) * 100)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Trades"
            value={formatNumber(stats.totalTrades, 0)}
            change="Last 30 days"
            icon={BarChart2}
            iconColor="text-blue-400"
          />
          <StatCard
            title="Total Value Managed"
            value={formatCurrency(stats.totalValue)}
            change={`${stats.activeModels} active models`}
            icon={DollarSign}
            iconColor="text-green-400"
          />
          <StatCard
            title="Best 24h Performer"
            value={stats.bestPerformer.name}
            change={formatPercent(stats.bestPerformer.change24h)}
            changeType="positive"
            icon={Trophy}
            iconColor="text-yellow-400"
          />
          <StatCard
            title="Average Win Rate"
            value={`${stats.averageWinRate}%`}
            change="Across all models"
            icon={Zap}
            iconColor="text-purple-400"
          />
        </div>
      </section>

      {/* Market Indicators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="card bg-dark-100/50">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold text-white">Live Market Indicators</h2>
          </div>
          <div className="flex flex-wrap gap-6">
            {[
              { name: 'BTC', price: '$97,234.56', change: '+2.4%', positive: true },
              { name: 'ETH', price: '$3,456.78', change: '+1.8%', positive: true },
              { name: 'SOL', price: '$234.56', change: '-0.5%', positive: false },
              { name: 'XRP', price: '$2.34', change: '+5.2%', positive: true },
              { name: 'ADA', price: '$0.98', change: '+3.1%', positive: true },
              { name: 'AVAX', price: '$45.67', change: '-1.2%', positive: false },
            ].map((coin) => (
              <div key={coin.name} className="flex items-center gap-3">
                <span className="text-white font-medium">{coin.name}</span>
                <span className="text-gray-400">{coin.price}</span>
                <span className={`text-sm ${coin.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <Suspense fallback={<div className="card animate-pulse h-96" />}>
          <Leaderboard />
        </Suspense>
      </section>
    </div>
  );
}
