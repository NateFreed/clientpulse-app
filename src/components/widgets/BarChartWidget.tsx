'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { WidgetConfig } from '@/lib/types';

interface BarChartWidgetProps {
  title: string;
  config: WidgetConfig;
  data: Record<string, string | number>[];
}

export default function BarChartWidget({ title, config, data }: BarChartWidgetProps) {
  const metric = config.metric ?? '';
  const color = config.color ?? '#6366f1';
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const xKey = columns[0] ?? 'label';

  return (
    <div className="glow-card p-5 h-full flex flex-col">
      <div className="text-xs text-muted uppercase tracking-wider font-medium mb-3">{title}</div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
            <Bar dataKey={metric} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
