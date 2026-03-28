import { supabase } from './supabase';
import type { Agency, Client, Dashboard, DataImport, DataRow, DashboardWidget } from './types';

// Agencies
export async function getAgency(userId: string): Promise<Agency | null> {
  const { data, error } = await supabase
    .from('cp_agencies')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createAgency(userId: string, name: string, brandColor = '#6366f1'): Promise<Agency> {
  const { data, error } = await supabase
    .from('cp_agencies')
    .insert({ user_id: userId, name, brand_color: brandColor, plan: 'free' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAgency(agencyId: string, updates: Partial<Agency>): Promise<Agency> {
  const { data, error } = await supabase
    .from('cp_agencies')
    .update(updates)
    .eq('id', agencyId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Clients
export async function getClients(agencyId: string): Promise<Client[]> {
  const { data, error } = await supabase
    .from('cp_clients')
    .select('*')
    .eq('agency_id', agencyId)
    .order('name', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createClient(agencyId: string, name: string, email: string): Promise<Client> {
  const accessToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  const { data, error } = await supabase
    .from('cp_clients')
    .insert({ agency_id: agencyId, name, email, access_token: accessToken, is_active: true })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteClient(clientId: string): Promise<void> {
  const { error } = await supabase.from('cp_clients').delete().eq('id', clientId);
  if (error) throw error;
}

// Dashboards
export async function getDashboards(agencyId: string): Promise<Dashboard[]> {
  const { data, error } = await supabase
    .from('cp_dashboards')
    .select('*')
    .eq('agency_id', agencyId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getDashboard(dashboardId: string): Promise<Dashboard | null> {
  const { data, error } = await supabase
    .from('cp_dashboards')
    .select('*')
    .eq('id', dashboardId)
    .single();
  if (error) return null;
  return data;
}

export async function getDashboardByShareToken(token: string): Promise<Dashboard | null> {
  const { data, error } = await supabase
    .from('cp_dashboards')
    .select('*')
    .eq('share_token', token)
    .eq('is_public', true)
    .single();
  if (error) return null;
  return data;
}

export async function createDashboard(agencyId: string, clientId: string, name: string): Promise<Dashboard> {
  const shareToken = Math.random().toString(36).substring(2, 10);
  const { data, error } = await supabase
    .from('cp_dashboards')
    .insert({
      agency_id: agencyId,
      client_id: clientId,
      name,
      description: '',
      layout: [],
      is_public: false,
      share_token: shareToken,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDashboardLayout(dashboardId: string, layout: DashboardWidget[]): Promise<void> {
  const { error } = await supabase
    .from('cp_dashboards')
    .update({ layout, updated_at: new Date().toISOString() })
    .eq('id', dashboardId);
  if (error) throw error;
}

export async function updateDashboardSummary(dashboardId: string, summary: string): Promise<void> {
  const { error } = await supabase
    .from('cp_dashboards')
    .update({ ai_summary: summary, ai_summary_updated_at: new Date().toISOString() })
    .eq('id', dashboardId);
  if (error) throw error;
}

// Data Imports
export async function getDataImports(dashboardId: string): Promise<DataImport[]> {
  const { data, error } = await supabase
    .from('cp_data_imports')
    .select('*')
    .eq('dashboard_id', dashboardId)
    .order('imported_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createDataImport(
  dashboardId: string,
  agencyId: string,
  name: string,
  columns: string[],
  rows: Record<string, string | number>[]
): Promise<DataImport> {
  const { data: importRecord, error: importError } = await supabase
    .from('cp_data_imports')
    .insert({ dashboard_id: dashboardId, agency_id: agencyId, name, columns, row_count: rows.length })
    .select()
    .single();
  if (importError) throw importError;

  // Insert data rows
  const dataRows = rows.map(row => ({ import_id: importRecord.id, data: row }));
  const { error: rowsError } = await supabase.from('cp_data_rows').insert(dataRows);
  if (rowsError) throw rowsError;

  return importRecord;
}

export async function getDataRows(importId: string): Promise<DataRow[]> {
  const { data, error } = await supabase
    .from('cp_data_rows')
    .select('*')
    .eq('import_id', importId);
  if (error) throw error;
  return data ?? [];
}

export async function deleteDataImport(importId: string): Promise<void> {
  const { error } = await supabase.from('cp_data_imports').delete().eq('id', importId);
  if (error) throw error;
}
