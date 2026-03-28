// Agency (the paying customer)
export interface Agency {
  id: string;
  user_id: string;
  name: string;
  logo_url: string;
  brand_color: string;
  plan: 'free' | 'pro' | 'agency';
  created_at: string;
}

// Client (the agency's customer who views reports)
export interface Client {
  id: string;
  agency_id: string;
  name: string;
  email: string;
  access_token: string;    // unique token for client portal access
  is_active: boolean;
  created_at: string;
}

// Dashboard (a configured report for a client)
export interface Dashboard {
  id: string;
  client_id: string;
  agency_id: string;
  name: string;
  description: string;
  layout: DashboardWidget[];  // stored as JSONB
  ai_summary: string | null;
  ai_summary_updated_at: string | null;
  is_public: boolean;
  share_token: string;
  created_at: string;
  updated_at: string;
}

// Widget configuration (stored in Dashboard.layout JSONB)
export interface DashboardWidget {
  id: string;
  type: 'stat' | 'line_chart' | 'bar_chart' | 'pie_chart' | 'table' | 'text';
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  config: WidgetConfig;
}

export interface WidgetConfig {
  dataSource?: string;       // data_imports.id
  metric?: string;          // column name from imported data
  color?: string;
  format?: 'number' | 'currency' | 'percentage';
  text?: string;            // for text widgets
  comparison?: 'previous_period' | 'none';
}

// Data import (CSV uploads)
export interface DataImport {
  id: string;
  dashboard_id: string;
  agency_id: string;
  name: string;
  columns: string[];        // column headers
  row_count: number;
  imported_at: string;
}

// Data rows (the actual imported data)
export interface DataRow {
  id: string;
  import_id: string;
  data: Record<string, string | number>;  // JSONB — column name → value
}

// Report (generated PDF/summary for a specific period)
export interface Report {
  id: string;
  dashboard_id: string;
  period_start: string;
  period_end: string;
  ai_summary: string;
  generated_at: string;
}
