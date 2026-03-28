'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { WidgetConfig } from '@/lib/types';

interface LineChartWidgetProps {
  title: string;
  config: WidgetConfig;
  data: Record<string, string | number>[];
}

export default function LineChartWidget({ title, config, data }: LineChartWidgetProps) {
  const metric = config.metric ?? '';
  const color = config.color ?? '#6366f1';

  // Assume first column is X-axis (date/label), metric column is Y-axis
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const xKey = columns[0] ?? 'date';

  return (
    <div className="glow-card p-5 h-full flex flex-col">
      <div className="text-xs text-muted uppercase tracking-wider font-medium mb-3">{title}</div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11, fill: 'var(--muted)' }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '0.75rem',
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
