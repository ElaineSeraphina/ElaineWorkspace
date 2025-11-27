'use client';

import { Trade } from '@/lib/types';
import { formatCurrency, formatDate, getColorForValue } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TradeHistoryProps {
  trades: Trade[];
  limit?: number;
}

export default function TradeHistory({ trades, limit }: TradeHistoryProps) {
  const displayTrades = limit ? trades.slice(0, limit) : trades;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-gray-400 text-xs uppercase border-b border-dark-200">
            <th className="text-left py-3 px-2 font-medium">Time</th>
            <th className="text-left py-3 px-2 font-medium">Asset</th>
            <th className="text-left py-3 px-2 font-medium">Action</th>
            <th className="text-right py-3 px-2 font-medium">Amount</th>
            <th className="text-right py-3 px-2 font-medium">Price</th>
            <th className="text-right py-3 px-2 font-medium">PnL</th>
          </tr>
        </thead>
        <tbody>
          {displayTrades.map((trade) => (
            <tr
              key={trade.id}
              className="border-b border-dark-200 hover:bg-dark-100 transition-colors"
            >
              <td className="py-3 px-2">
                <span className="text-gray-400 text-sm">
                  {formatDate(new Date(trade.timestamp))}
                </span>
              </td>
              <td className="py-3 px-2">
                <span className="text-white font-medium">{trade.asset}</span>
              </td>
              <td className="py-3 px-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                  trade.action === 'BUY'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {trade.action === 'BUY' ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {trade.action}
                </span>
              </td>
              <td className="py-3 px-2 text-right">
                <span className="text-white">{trade.amount.toFixed(4)}</span>
              </td>
              <td className="py-3 px-2 text-right">
                <span className="text-white">{formatCurrency(trade.price)}</span>
              </td>
              <td className={`py-3 px-2 text-right font-medium ${getColorForValue(trade.pnl)}`}>
                {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {displayTrades.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No trades found
        </div>
      )}
    </div>
  );
}
