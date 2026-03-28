-- ClientPulse Database Schema

create table if not exists cp_agencies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique not null,
  name text not null,
  logo_url text default '',
  brand_color text default '#6366f1',
  plan text check (plan in ('free', 'pro', 'agency')) default 'free',
  created_at timestamptz default now()
);

create table if not exists cp_clients (
  id uuid default gen_random_uuid() primary key,
  agency_id uuid references cp_agencies(id) on delete cascade not null,
  name text not null,
  email text not null,
  access_token text unique not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists cp_dashboards (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references cp_clients(id) on delete cascade not null,
  agency_id uuid references cp_agencies(id) on delete cascade not null,
  name text not null,
  description text default '',
  layout jsonb default '[]',
  ai_summary text,
  ai_summary_updated_at timestamptz,
  is_public boolean default false,
  share_token text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists cp_data_imports (
  id uuid default gen_random_uuid() primary key,
  dashboard_id uuid references cp_dashboards(id) on delete cascade not null,
  agency_id uuid references cp_agencies(id) on delete cascade not null,
  name text not null,
  columns jsonb default '[]',
  row_count integer default 0,
  imported_at timestamptz default now()
);

create table if not exists cp_data_rows (
  id uuid default gen_random_uuid() primary key,
  import_id uuid references cp_data_imports(id) on delete cascade not null,
  data jsonb not null
);

-- RLS
alter table cp_agencies enable row level security;
alter table cp_clients enable row level security;
alter table cp_dashboards enable row level security;
alter table cp_data_imports enable row level security;
alter table cp_data_rows enable row level security;

create policy "Users manage their agency" on cp_agencies
  for all using (auth.uid() = user_id);

create policy "Agency owners manage clients" on cp_clients
  for all using (agency_id in (select id from cp_agencies where user_id = auth.uid()));

create policy "Agency owners manage dashboards" on cp_dashboards
  for all using (agency_id in (select id from cp_agencies where user_id = auth.uid()));

create policy "Public dashboards viewable by token" on cp_dashboards
  for select using (is_public = true);

create policy "Agency owners manage imports" on cp_data_imports
  for all using (agency_id in (select id from cp_agencies where user_id = auth.uid()));

create policy "Import data accessible by agency" on cp_data_rows
  for all using (import_id in (
    select di.id from cp_data_imports di
    join cp_agencies a on di.agency_id = a.id
    where a.user_id = auth.uid()
  ));

-- Indexes
create index if not exists idx_cp_agencies_user_id on cp_agencies(user_id);
create index if not exists idx_cp_clients_agency_id on cp_clients(agency_id);
create index if not exists idx_cp_clients_access_token on cp_clients(access_token);
create index if not exists idx_cp_dashboards_agency_id on cp_dashboards(agency_id);
create index if not exists idx_cp_dashboards_client_id on cp_dashboards(client_id);
create index if not exists idx_cp_dashboards_share_token on cp_dashboards(share_token);
create index if not exists idx_cp_data_imports_dashboard_id on cp_data_imports(dashboard_id);
create index if not exists idx_cp_data_rows_import_id on cp_data_rows(import_id);
