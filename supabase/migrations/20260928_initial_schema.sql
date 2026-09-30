-- ====================================================================
-- ScrapWala Database Schema
-- SIH 26229: Kabadiwala Connect
-- ====================================================================

-- Enable PostGIS extension for geospatial queries if available
create extension if not exists postgis;

-- ============ IDENTITY & PROFILES ============
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('collector','sahayak','recycler','admin')),
  full_name text not null,
  phone text unique,
  email text unique,
  preferred_language text default 'hi' check (preferred_language in ('hi', 'en', 'mr')),
  created_at timestamptz default now()
);

create table if not exists collectors (
  id uuid primary key references profiles(id) on delete cascade,
  collector_display_id serial unique,
  operating_city text,
  gps_lat double precision,
  gps_lng double precision,
  created_at timestamptz default now()
);

create table if not exists recyclers (
  id uuid primary key references profiles(id) on delete cascade,
  facility_name text not null,
  physical_address text not null,
  gps_lat double precision not null,
  gps_lng double precision not null,
  service_area text,
  spcb_license_number text,
  authorization_status text default 'pending' check (authorization_status in ('pending','authorized','expired','rejected')),
  issue_date date,
  expiry_date date,
  pickup_availability text check (pickup_availability in ('on_request','by_appointment','scheduled')),
  created_at timestamptz default now()
);

create table if not exists recycler_material_acceptance (
  id uuid primary key default gen_random_uuid(),
  recycler_id uuid references recyclers(id) on delete cascade,
  material_category text not null,
  rate_min numeric,
  rate_max numeric,
  unit text default 'kg',
  updated_at timestamptz default now()
);

-- ============ REFERENCE DATA ============
create table if not exists materials_reference (
  category text primary key,
  hazard_class text,
  composition_json jsonb  -- e.g. {"copper": 0.20, "gold": 0.0003, "lithium": 0.0}
);

create table if not exists epr_rate_card (
  material_category text primary key references materials_reference(category),
  epr_value_per_kg numeric not null,
  passthrough_percentage numeric not null default 0.30,
  updated_by uuid references profiles(id),
  updated_at timestamptz default now()
);

-- ============ OPERATIONAL ============
create table if not exists lots (
  id uuid primary key default gen_random_uuid(),
  lot_display_id text unique not null,
  collector_id uuid references collectors(id) not null,
  created_by_sahayak_id uuid references profiles(id),
  material_category text references materials_reference(category),
  photos text[],
  approximate_weight numeric,
  unit text default 'kg',
  gps_lat double precision,
  gps_lng double precision,
  status text default 'draft' check (status in ('draft','pending_match','matched','handed_over','paid')),
  estimated_value numeric,
  idempotency_key text unique,
  created_at timestamptz default now()
);

create table if not exists price_observations (
  id uuid primary key default gen_random_uuid(),
  material_category text references materials_reference(category),
  locality text,
  price_per_kg numeric,
  unit text default 'kg',
  source_type text check (source_type in ('recycler_quote','completed_transaction','admin_estimate')),
  verification_status text default 'unverified',
  observed_at timestamptz default now()
);

create table if not exists handover_records (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid references lots(id) unique,
  recycler_id uuid references recyclers(id),
  final_weight numeric,
  final_price numeric,
  epr_premium numeric default 0,
  total_payout numeric,
  payment_mode text check (payment_mode in ('cash','upi','pending')),
  payment_status text default 'pending' check (payment_status in ('pending','confirmed','paid')),
  handover_timestamp timestamptz default now(),
  gps_lat double precision,
  gps_lng double precision,
  idempotency_key text unique
);

create table if not exists traceability_events (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid references lots(id),
  actor_role text,
  event_type text,
  event_timestamp timestamptz default now(),
  payload_hash text not null,
  previous_event_hash text
);

create table if not exists cartel_flags (
  id uuid primary key default gen_random_uuid(),
  material_category text,
  locality text,
  avg_price numeric,
  benchmark_price numeric,
  deviation_pct numeric,
  flagged_at timestamptz default now(),
  status text default 'open' check (status in ('open','reviewed','dismissed'))
);

-- ============ INDEXES ============
create index if not exists idx_lots_collector on lots(collector_id);
create index if not exists idx_lots_status on lots(status);
create index if not exists idx_price_obs_category_locality on price_observations(material_category, locality);
create index if not exists idx_handover_records_lot on handover_records(lot_id);
create index if not exists idx_traceability_events_lot on traceability_events(lot_id);

-- Optional spatial index if earthdistance / cube or postgis is used
-- create index if not exists idx_recyclers_gps on recyclers using gist (ll_to_earth(gps_lat, gps_lng));

-- ============ ROW LEVEL SECURITY (RLS) ============
alter table lots enable row level security;
alter table handover_records enable row level security;
alter table recyclers enable row level security;
alter table profiles enable row level security;
alter table collectors enable row level security;

-- Profiles: Users can view and update their own profile
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- Collectors: Users can view and manage their own collector profile
create policy "collectors_select_own" on collectors
  for select using (auth.uid() = id);
create policy "collectors_insert_own" on collectors
  for insert with check (auth.uid() = id);

-- Lots: Collector can only see and insert their own lots (or Sahayak proxy)
create policy "collector_own_lots" on lots
  for select using (collector_id = auth.uid() or created_by_sahayak_id = auth.uid());

create policy "collector_insert_own_lots" on lots
  for insert with check (collector_id = auth.uid() or created_by_sahayak_id = auth.uid());

create policy "collector_update_own_lots" on lots
  for update using (collector_id = auth.uid() or created_by_sahayak_id = auth.uid());

-- Recyclers: Read access for public matching, update for owner
create policy "recyclers_public_read" on recyclers
  for select using (true);

create policy "recyclers_update_own" on recyclers
  for update using (auth.uid() = id);

-- Handover Records: Recycler can see lots matched/handed to them
create policy "recycler_own_handovers" on handover_records
  for select using (recycler_id = auth.uid());

create policy "recycler_confirm_handover" on handover_records
  for insert with check (recycler_id = auth.uid());

create policy "recycler_update_handover" on handover_records
  for update using (recycler_id = auth.uid());
