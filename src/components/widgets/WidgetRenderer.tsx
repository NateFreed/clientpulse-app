'use client';

import type { DashboardWidget } from '@/lib/types';
import StatCardWidget from './StatCardWidget';
import LineChartWidget from './LineChartWidget';
import BarChartWidget from './BarChartWidget';
import TableWidget from './TableWidget';
import TextWidget from './TextWidget';

interface WidgetRendererProps {
  widget: DashboardWidget;
  data: Record<string, string | number>[];
  aiSummary?: string | null;
}

export default function WidgetRenderer({ widget, data, aiSummary }: WidgetRendererProps) {
  switch (widget.type) {
    case 'stat':
      return <StatCardWidget title={widget.title} config={widget.config} data={data} />;
    case 'line_chart':
      return <LineChartWidget title={widget.title} config={widget.config} data={data} />;
    case 'bar_chart':
      return <BarChartWidget title={widget.title} config={widget.config} data={data} />;
    case 'table':
      return <TableWidget title={widget.title} config={widget.config} data={data} />;
    case 'text':
      return <TextWidget title={widget.title} config={widget.config} aiSummary={aiSummary} />;
    default:
      return (
        <div className="glow-card p-5 flex items-center justify-center text-muted text-sm">
          Unknown widget type: {widget.type}
        </div>
      );
  }
}
