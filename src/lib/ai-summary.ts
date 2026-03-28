import { supabase } from './supabase';
import type { Dashboard, DashboardWidget, DataRow } from './types';

/**
 * Generate an AI executive summary from dashboard data.
 * This is the killer feature — auto-generates written insights that save agencies hours.
 *
 * V1: Calls a Supabase Edge Function that uses Claude API.
 * Fallback: Generates a template summary from data patterns.
 */
export async function generateAISummary(
  dashboardId: string,
  clientName: string,
  widgets: DashboardWidget[],
  dataRows: DataRow[]
): Promise<string> {
  try {
    // Prepare data context for the AI
    const dataContext = prepareDataContext(clientName, widgets, dataRows);

    // Call Edge Function
    const { data, error } = await supabase.functions.invoke('generate-report-summary', {
      body: { dashboard_id: dashboardId, context: dataContext },
    });

    if (!error && data?.summary) {
      // Save to database
      await supabase
        .from('cp_dashboards')
        .update({ ai_summary: data.summary, ai_summary_updated_at: new Date().toISOString() })
        .eq('id', dashboardId);

      return data.summary;
    }

    // Fallback to template summary
    return generateFallbackSummary(clientName, dataRows);
  } catch {
    return generateFallbackSummary(clientName, dataRows);
  }
}

/**
 * Prepare structured data context for the AI model.
 * Extracts key metrics, trends, and anomalies from the data.
 */
function prepareDataContext(
  clientName: string,
  widgets: DashboardWidget[],
  dataRows: DataRow[]
): string {
  const metrics: string[] = [];

  // Extract numeric columns and compute basic stats
  if (dataRows.length > 0) {
    const columns = Object.keys(dataRows[0].data);
    const numericColumns = columns.filter(col => {
      const vals = dataRows.map(r => r.data[col]).filter(v => typeof v === 'number' || !isNaN(Number(v)));
      return vals.length > dataRows.length * 0.5; // At least half are numeric
    });

    for (const col of numericColumns) {
      const values = dataRows.map(r => Number(r.data[col])).filter(v => !isNaN(v));
      if (values.length === 0) continue;

      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const latest = values[values.length - 1];
      const previous = values.length > 1 ? values[values.length - 2] : latest;
      const change = previous !== 0 ? ((latest - previous) / previous) * 100 : 0;

      metrics.push(`${col}: latest=${latest}, avg=${avg.toFixed(1)}, change=${change > 0 ? '+' : ''}${change.toFixed(1)}%`);
    }
  }

  const widgetSummary = widgets.map(w => `${w.type}: "${w.title}"`).join(', ');

  return `Client: ${clientName}
Report period: Last 30 days
Dashboard widgets: ${widgetSummary}
Data rows: ${dataRows.length}
Key metrics:
${metrics.join('\n')}`;
}

/**
 * Fallback summary when AI API is unavailable.
 * Generates insights from data patterns without AI.
 */
function generateFallbackSummary(clientName: string, dataRows: DataRow[]): string {
  if (dataRows.length === 0) {
    return `Report for ${clientName}: No data available for this period. Please upload data to generate insights.`;
  }

  const columns = Object.keys(dataRows[0].data);
  const numericColumns = columns.filter(col => {
    const vals = dataRows.map(r => r.data[col]).filter(v => !isNaN(Number(v)));
    return vals.length > dataRows.length * 0.5;
  });

  const insights: string[] = [];
  insights.push(`This report covers ${dataRows.length} data points across ${columns.length} metrics for ${clientName}.`);

  for (const col of numericColumns.slice(0, 3)) {
    const values = dataRows.map(r => Number(r.data[col])).filter(v => !isNaN(v));
    if (values.length < 2) continue;

    const latest = values[values.length - 1];
    const first = values[0];
    const change = first !== 0 ? ((latest - first) / first) * 100 : 0;
    const direction = change > 5 ? 'increased' : change < -5 ? 'decreased' : 'remained stable';
    const formattedCol = col.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    insights.push(`${formattedCol} ${direction} by ${Math.abs(change).toFixed(1)}% over the reporting period (${first.toLocaleString()} → ${latest.toLocaleString()}).`);
  }

  insights.push('For more detailed analysis, consider upgrading to Pro for AI-powered insights.');

  return insights.join(' ');
}

/**
 * Compute basic analytics from data rows for stat widgets.
 */
export function computeDataStats(dataRows: DataRow[], column: string): {
  total: number;
  average: number;
  min: number;
  max: number;
  latest: number;
  changePercent: number;
} {
  const values = dataRows.map(r => Number(r.data[column])).filter(v => !isNaN(v));

  if (values.length === 0) {
    return { total: 0, average: 0, min: 0, max: 0, latest: 0, changePercent: 0 };
  }

  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const latest = values[values.length - 1];
  const previous = values.length > 1 ? values[values.length - 2] : latest;
  const changePercent = previous !== 0 ? ((latest - previous) / previous) * 100 : 0;

  return { total, average: Math.round(average * 100) / 100, min, max, latest, changePercent: Math.round(changePercent * 10) / 10 };
}
