'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUser } from '@/lib/auth';
import type { Dashboard, DashboardWidget, DataRow } from '@/lib/types';
import WidgetRenderer from '@/components/widgets/WidgetRenderer';

// Mock data for v1 — will be replaced by Supabase queries once data import is wired
const MOCK_DATA: Record<string, string | number>[] = [
  { date: '2026-03-01', users: 1234, revenue: 3200, source: 'google' },
  { date: '2026-03-02', users: 1456, revenue: 3800, source: 'direct' },
  { date: '2026-03-03', users: 1123, revenue: 2900, source: 'social' },
  { date: '2026-03-04', users: 1678, revenue: 4200, source: 'google' },
  { date: '2026-03-05', users: 1890, revenue: 4800, source: 'email' },
  { date: '2026-03-06', users: 1345, revenue: 3500, source: 'direct' },
  { date: '2026-03-07', users: 2012, revenue: 5200, source: 'google' },
];

const DEFAULT_LAYOUT: DashboardWidget[] = [
  { id: 'w1', type: 'stat', title: 'Total Users', x: 0, y: 0, w: 1, h: 1, config: { metric: 'users', format: 'number', comparison: 'previous_period' } },
  { id: 'w2', type: 'stat', title: 'Revenue', x: 1, y: 0, w: 1, h: 1, config: { metric: 'revenue', format: 'currency', comparison: 'previous_period' } },
  { id: 'w3', type: 'line_chart', title: 'Traffic Over Time', x: 0, y: 1, w: 2, h: 2, config: { metric: 'users', color: '#6366f1' } },
  { id: 'w4', type: 'bar_chart', title: 'Revenue by Day', x: 0, y: 3, w: 1, h: 2, config: { metric: 'revenue', color: '#10b981' } },
  { id: 'w5', type: 'table', title: 'Daily Breakdown', x: 1, y: 3, w: 1, h: 2, config: { format: 'number' } },
  { id: 'w6', type: 'text', title: 'AI Executive Summary', x: 0, y: 5, w: 2, h: 1, config: { text: '' } },
];

export default function DashboardPage() {
  const [layout, setLayout] = useState<DashboardWidget[]>(DEFAULT_LAYOUT);
  const [dashboardName, setDashboardName] = useState('Monthly Report');
  const [clientName, setClientName] = useState('Acme Corp');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  async function handleGenerateSummary() {
    setGeneratingSummary(true);
    // Simulate AI summary generation (would call Claude API in production)
    setTimeout(() => {
      setAiSummary(
        'Traffic increased 23% week-over-week, driven by strong organic search performance. ' +
        'Revenue hit $27,600 for the period, up 15% from the previous week. ' +
        'Google remains the top traffic source at 43% of total visits. ' +
        'Recommend increasing content production to capitalize on the organic growth trend.'
      );
      setGeneratingSummary(false);
    }, 1500);
  }

  // Determine grid sizing: widgets with w=2 get full width
  function getWidgetGridClass(widget: DashboardWidget): string {
    if (widget.w >= 2) return 'col-span-2';
    return 'col-span-1';
  }

  function getWidgetHeightClass(widget: DashboardWidget): string {
    if (widget.type === 'stat') return 'h-32';
    if (widget.type === 'text') return 'min-h-[120px]';
    return 'h-64';
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{dashboardName}</h1>
          <p className="text-sm text-muted mt-1">Prepared for {clientName}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGenerateSummary}
            disabled={generatingSummary}
            className="px-4 py-2 bg-accent hover:bg-accent-light disabled:opacity-50 rounded-xl text-sm font-semibold text-white shadow-sm shadow-accent/10 transition-all"
          >
            {generatingSummary ? 'Generating...' : '✨ AI Summary'}
          </button>
          <button className="px-4 py-2 bg-surface border border-border hover:border-border-light rounded-xl text-sm text-muted hover:text-foreground transition-colors">
            Export PDF
          </button>
          <button className="px-4 py-2 bg-surface border border-border hover:border-border-light rounded-xl text-sm text-muted hover:text-foreground transition-colors">
            Share
          </button>
        </div>
      </div>

      {/* AI Summary (if generated) */}
      {aiSummary && (
        <div className="glow-card p-5 border-l-4 !border-l-accent">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-accent">✨</span>
            <span className="text-xs text-muted uppercase tracking-wider font-medium">AI Executive Summary</span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{aiSummary}</p>
        </div>
      )}

      {/* Widget grid */}
      <div className="grid grid-cols-2 gap-4">
        {layout.map((widget) => (
          <div
            key={widget.id}
            className={`${getWidgetGridClass(widget)} ${getWidgetHeightClass(widget)}`}
          >
            <WidgetRenderer
              widget={widget}
              data={MOCK_DATA}
              aiSummary={widget.type === 'text' ? aiSummary : undefined}
            />
          </div>
        ))}
      </div>

      {/* Add widget button */}
      <button className="w-full py-3 border-2 border-dashed border-border hover:border-border-light rounded-xl text-sm text-muted hover:text-foreground transition-colors">
        + Add Widget
      </button>
    </div>
  );
}
