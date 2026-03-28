'use client';

import type { WidgetConfig } from '@/lib/types';

interface StatCardWidgetProps {
  title: string;
  config: WidgetConfig;
  data: Record<string, string | number>[];
}

function formatValue(value: number, format?: string): string {
  switch (format) {
    case 'currency': return `$${value.toLocaleString()}`;
    case 'percentage': return `${value.toFixed(1)}%`;
    default: return value.toLocaleString();
  }
}

export default function StatCardWidget({ title, config, data }: StatCardWidgetProps) {
  const metric = config.metric ?? '';
  const values = data.map((row) => Number(row[metric]) || 0);
  const current = values.length > 0 ? values[values.length - 1] : 0;

  // Calculate trend vs previous period
  let trend = 0;
  let trendLabel = '';
  if (config.comparison === 'previous_period' && values.length >= 2) {
    const mid = Math.floor(values.length / 2);
    const currentPeriod = values.slice(mid).reduce((a, b) => a + b, 0);
    const previousPeriod = values.slice(0, mid).reduce((a, b) => a + b, 0);
    if (previousPeriod > 0) {
      trend = ((currentPeriod - previousPeriod) / previousPeriod) * 100;
      trendLabel = `${trend >= 0 ? '+' : ''}${trend.toFixed(1)}%`;
    }
  }

  // Sum all values for total
  const total = values.reduce((a, b) => a + b, 0);

  return (
    <div className="glow-card p-5 h-full flex flex-col justify-center">
      <div className="text-xs text-muted uppercase tracking-wider font-medium mb-2">{title}</div>
      <div className="text-3xl font-bold text-foreground">
        {formatValue(total, config.format)}
      </div>
      {config.comparison === 'previous_period' && trendLabel && (
        <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${
          trend >= 0 ? 'text-success' : 'text-danger'
        }`}>
          <span>{trend >= 0 ? '↑' : '↓'}</span>
          <span>{trendLabel}</span>
          <span className="text-muted text-xs ml-1">vs prev</span>
        </div>
      )}
    </div>
  );
}
