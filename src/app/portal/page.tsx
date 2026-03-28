'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getDashboardByShareToken } from '@/lib/db';
import type { Dashboard, DashboardWidget } from '@/lib/types';
import WidgetRenderer from '@/components/widgets/WidgetRenderer';

function PortalContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) { setLoading(false); setError('No dashboard token provided.'); return; }
    async function load() {
      try {
        const data = await getDashboardByShareToken(token);
        if (!data) { setError('Dashboard not found or not shared.'); }
        else { setDashboard(data); }
      } catch {
        setError('Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 px-4">
        <h2 className="text-2xl font-bold mb-2">Dashboard Not Found</h2>
        <p className="text-muted">{error || 'This dashboard may not be shared or the link is incorrect.'}</p>
      </div>
    );
  }

  const widgets: DashboardWidget[] = Array.isArray(dashboard.layout) ? dashboard.layout : [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{dashboard.name}</h1>
        {dashboard.description && <p className="text-muted mt-1">{dashboard.description}</p>}
      </div>

      {dashboard.ai_summary && (
        <div className="glow-card p-6 mb-6 border-l-4 border-accent">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-accent">✨</span>
            <span className="text-sm font-semibold uppercase tracking-wider text-muted">AI Summary</span>
          </div>
          <p className="text-foreground leading-relaxed">{dashboard.ai_summary}</p>
          {dashboard.ai_summary_updated_at && (
            <p className="text-xs text-muted mt-3">
              Updated {new Date(dashboard.ai_summary_updated_at).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {widgets.length > 0 ? (
        <div className="grid grid-cols-4 gap-4" style={{ gridAutoRows: '200px' }}>
          {widgets.map((widget) => (
            <div
              key={widget.id}
              style={{ gridColumn: `span ${widget.w}`, gridRow: `span ${widget.h}` }}
            >
              <WidgetRenderer widget={widget} data={[]} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted">No widgets configured for this dashboard yet.</p>
        </div>
      )}

      <footer className="mt-12 text-center text-xs text-muted">
        Powered by <span className="text-accent font-medium">ClientPulse</span>
      </footer>
    </div>
  );
}

export default function PortalPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>}>
      <PortalContent />
    </Suspense>
  );
}
