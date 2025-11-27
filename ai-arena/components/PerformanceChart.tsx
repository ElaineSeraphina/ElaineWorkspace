'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { PerformancePoint } from '@/lib/types';
import { formatCurrency, formatCompactNumber } from '@/lib/utils';

interface PerformanceChartProps {
  data: PerformancePoint[];
  color?: string;
  height?: number;
  showGrid?: boolean;
  type?: 'line' | 'area';
}

export default function PerformanceChart({
  data,
  color = '#6366f1',
  height = 300,
  showGrid = true,
  type = 'area'
}: PerformanceChartProps) {
  // Create a safe ID from the color by removing special characters
  const safeColorId = color.replace(/[^a-zA-Z0-9]/g, '');
  
  const chartData = data.map((point, index) => ({
    ...point,
    time: index,
    formattedTime: new Date(point.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    formattedValue: formatCurrency(point.accountValue)
  }));

  const minValue = Math.min(...data.map(d => d.accountValue)) * 0.995;
  const maxValue = Math.max(...data.map(d => d.accountValue)) * 1.005;

  const CustomTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: {
        formattedTime: string;
        accountValue: number;
        pnl: number;
      };
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-dark-100 border border-dark-300 rounded-lg p-3 shadow-lg">
          <p className="text-gray-400 text-sm">{dataPoint.formattedTime}</p>
          <p className="text-white font-bold">{formatCurrency(dataPoint.accountValue)}</p>
          <p className={`text-sm ${dataPoint.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            PnL: {dataPoint.pnl >= 0 ? '+' : ''}{formatCurrency(dataPoint.pnl)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
          )}
          <XAxis
            dataKey="formattedTime"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minValue, maxValue]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => formatCompactNumber(value)}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id={`gradient-${safeColorId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="accountValue"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${safeColorId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
        )}
        <XAxis
          dataKey="formattedTime"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <YAxis
          domain={[minValue, maxValue]}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 12 }}
          tickFormatter={(value) => formatCompactNumber(value)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="accountValue"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
