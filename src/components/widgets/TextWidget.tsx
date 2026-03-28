'use client';

import type { WidgetConfig } from '@/lib/types';

interface TextWidgetProps {
  title: string;
  config: WidgetConfig;
  aiSummary?: string | null;
}

export default function TextWidget({ title, config, aiSummary }: TextWidgetProps) {
  const content = config.text || aiSummary || '';

  return (
    <div className="glow-card p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        {aiSummary && <span className="text-accent text-sm">✨</span>}
        <div className="text-xs text-muted uppercase tracking-wider font-medium">{title}</div>
      </div>
      {content ? (
        <div className="flex-1 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-muted">
          {aiSummary === undefined ? 'Add text content...' : 'Click "Generate AI Summary" to create insights from your data.'}
        </div>
      )}
    </div>
  );
}
