'use client';

import { useState } from 'react';
import type { WidgetConfig } from '@/lib/types';

interface TableWidgetProps {
  title: string;
  config: WidgetConfig;
  data: Record<string, string | number>[];
}

export default function TableWidget({ title, config, data }: TableWidgetProps) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const sorted = sortCol
    ? [...data].sort((a, b) => {
        const av = a[sortCol] ?? '';
        const bv = b[sortCol] ?? '';
        const cmp = typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
        return sortAsc ? cmp : -cmp;
      })
    : data;

  function handleSort(col: string) {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  }

  return (
    <div className="glow-card p-5 h-full flex flex-col">
      <div className="text-xs text-muted uppercase tracking-wider font-medium mb-3">{title}</div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="text-left py-2 px-2 text-xs text-muted uppercase tracking-wider font-medium cursor-pointer hover:text-foreground transition-colors"
                >
                  {col}
                  {sortCol === col && (
                    <span className="ml-1">{sortAsc ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.slice(0, 20).map((row, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-surface-hover transition-colors">
                {columns.map((col) => (
                  <td key={col} className="py-2 px-2 text-foreground/80">
                    {typeof row[col] === 'number'
                      ? config.format === 'currency'
                        ? `$${Number(row[col]).toLocaleString()}`
                        : Number(row[col]).toLocaleString()
                      : String(row[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 20 && (
          <p className="text-xs text-muted text-center mt-2">Showing 20 of {data.length} rows</p>
        )}
      </div>
    </div>
  );
}
