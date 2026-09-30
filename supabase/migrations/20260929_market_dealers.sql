-- ====================================================================
-- SCRAPWALA — MARKET RATES, DEALERS & OFFERS SCHEMA
-- Run in Supabase SQL Editor
-- ====================================================================

-- 1. MATERIALS TABLE (extended, replaces simple materials_reference for market use)
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,               -- e.g. 'copper_wire', 'pcb_motherboard'
  name_en text not null,
  name_hi text not null,
  name_mr text not null,
  category text not null,                   -- 'metal', 'ewaste', 'paper', 'plastic', 'appliance'
  unit text not null default 'kg',          -- 'kg', 'piece', 'ton', 'item'
  icon_url text,                            -- optional icon/image path
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 2. MARKET_RATES TABLE (append-only for history tracking)
create table if not exists public.market_rates (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.materials(id) on delete cascade,
  city text not null default 'Indore',
  rate numeric not null,                    -- price per unit
  unit text not null default 'kg',
  source text default 'admin',             -- 'admin', 'market_survey', 'dealer_avg'
  effective_date date not null default current_date,
  created_at timestamptz default now()
);

-- Index for fast lookups: latest rate per material+city
create index if not exists idx_market_rates_material_city_date 
  on public.market_rates(material_id, city, effective_date desc);

-- 3. DEALERS TABLE
create table if not exists public.dealers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_name text,
  phone text,
  email text,
  address text not null,
  city text not null default 'Indore',
  gps_lat double precision,
  gps_lng double precision,
  logo_url text,
  rating numeric default 4.0,             -- 1.0 to 5.0
  total_reviews int default 0,
  is_verified boolean default false,
  is_active boolean default true,
  pickup_available boolean default true,
  min_order_kg numeric default 1,
  operating_hours text default '9 AM - 7 PM',
  created_at timestamptz default now()
);

-- 4. DEALER_OFFERS TABLE (each dealer's offer per material)
create table if not exists public.dealer_offers (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  material_id uuid not null references public.materials(id) on delete cascade,
  offer_price numeric not null,            -- price per unit the dealer is willing to pay
  unit text not null default 'kg',
  pickup_fee numeric default 0,            -- deducted from seller
  handling_fee numeric default 0,
  transportation_fee numeric default 0,
  platform_fee numeric default 0,
  min_quantity numeric default 1,
  max_quantity numeric,
  is_active boolean default true,
  valid_from date default current_date,
  valid_until date,                        -- null = no expiry
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast offer lookups
create index if not exists idx_dealer_offers_material 
  on public.dealer_offers(material_id, is_active) where is_active = true;

-- 5. TRANSACTIONS TABLE (when a collector sells to a dealer)
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  collector_id uuid references public.profiles(id) on delete set null,
  dealer_id uuid references public.dealers(id) on delete set null,
  material_id uuid references public.materials(id) on delete set null,
  offer_id uuid references public.dealer_offers(id) on delete set null,
  quantity numeric not null,
  unit text not null default 'kg',
  gross_amount numeric not null,           -- offer_price * quantity
  pickup_fee numeric default 0,
  handling_fee numeric default 0,
  transportation_fee numeric default 0,
  platform_fee numeric default 0,
  net_amount numeric not null,             -- gross - all fees
  status text default 'pending' check (status in ('pending','confirmed','picked_up','completed','cancelled')),
  pickup_date date,
  completed_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_transactions_collector on public.transactions(collector_id);
create index if not exists idx_transactions_dealer on public.transactions(dealer_id);
create index if not exists idx_transactions_status on public.transactions(status);

-- 6. RLS POLICIES
alter table public.materials enable row level security;
alter table public.market_rates enable row level security;
alter table public.dealers enable row level security;
alter table public.dealer_offers enable row level security;
alter table public.transactions enable row level security;

-- Public read for materials, rates, dealers, offers
drop policy if exists "allow_public_read_materials_v2" on public.materials;
create policy "allow_public_read_materials_v2" on public.materials for select using (true);

drop policy if exists "allow_public_read_market_rates" on public.market_rates;
create policy "allow_public_read_market_rates" on public.market_rates for select using (true);

drop policy if exists "allow_public_read_dealers" on public.dealers;
create policy "allow_public_read_dealers" on public.dealers for select using (true);

drop policy if exists "allow_public_read_dealer_offers" on public.dealer_offers;
create policy "allow_public_read_dealer_offers" on public.dealer_offers for select using (true);

drop policy if exists "allow_public_read_transactions" on public.transactions;
create policy "allow_public_read_transactions" on public.transactions for select using (true);

-- Insert policies (allow authenticated & anon for now, tighten later)
drop policy if exists "allow_insert_materials" on public.materials;
create policy "allow_insert_materials" on public.materials for insert with check (true);

drop policy if exists "allow_update_materials" on public.materials;
create policy "allow_update_materials" on public.materials for update using (true);

drop policy if exists "allow_insert_market_rates" on public.market_rates;
create policy "allow_insert_market_rates" on public.market_rates for insert with check (true);

drop policy if exists "allow_insert_dealers" on public.dealers;
create policy "allow_insert_dealers" on public.dealers for insert with check (true);

drop policy if exists "allow_update_dealers" on public.dealers;
create policy "allow_update_dealers" on public.dealers for update using (true);

drop policy if exists "allow_insert_dealer_offers" on public.dealer_offers;
create policy "allow_insert_dealer_offers" on public.dealer_offers for insert with check (true);

drop policy if exists "allow_update_dealer_offers" on public.dealer_offers;
create policy "allow_update_dealer_offers" on public.dealer_offers for update using (true);

drop policy if exists "allow_insert_transactions" on public.transactions;
create policy "allow_insert_transactions" on public.transactions for insert with check (true);

drop policy if exists "allow_update_transactions" on public.transactions;
create policy "allow_update_transactions" on public.transactions for update using (true);

-- ====================================================================
-- SEED DATA
-- ====================================================================

-- Materials (Indore scrap market reference)
insert into public.materials (slug, name_en, name_hi, name_mr, category, unit, sort_order) values
('copper_wire',      'Copper Wire & Cable',    'तांबे का तार',        'तांब्याची वायर',      'metal',     'kg', 1),
('brass',            'Brass (Pital)',          'पीतल (पितळ)',         'पितळ',               'metal',     'kg', 2),
('aluminium',        'Aluminium',              'एल्युमीनियम',          'अॅल्युमिनियम',        'metal',     'kg', 3),
('iron_scrap',       'Iron / MS Scrap',        'लोहा / एमएस स्क्रैप',  'लोखंड / एमएस',       'metal',     'kg', 4),
('stainless_steel',  'Stainless Steel',        'स्टेनलेस स्टील',       'स्टेनलेस स्टील',      'metal',     'kg', 5),
('pcb_motherboard',  'PCB / Motherboard',      'सर्किट बोर्ड / PCB',   'पीसीबी / मदरबोर्ड',   'ewaste',    'kg', 6),
('lithium_battery',  'Lithium Battery',        'लिथियम बैटरी',         'लिथियम बॅटरी',       'ewaste',    'kg', 7),
('lead_battery',     'Lead Battery',           'लेड बैटरी',           'लेड बॅटरी',          'ewaste',    'kg', 8),
('newspaper',        'Newspaper (Raddi)',      'अखबार (रद्दी)',        'वर्तमानपत्र',         'paper',     'kg', 9),
('cardboard',        'Cardboard / Carton',     'गत्ता / कार्टन',       'पुठ्ठा / बॉक्स',     'paper',     'kg', 10),
('books_copies',     'Books & Copies',         'किताबें व कॉपी',       'पुस्तकें व वह्या',    'paper',     'kg', 11),
('pet_bottle',       'PET Bottles',            'प्लास्टिक बोतलें',     'प्लास्टिक बाटल्या',   'plastic',   'kg', 12),
('hdpe_plastic',     'HDPE Plastic',           'एचडीपीई प्लास्टिक',    'एचडीपीई प्लास्टिक',  'plastic',   'kg', 13),
('crt_monitor',      'CRT Monitor / Old TV',   'सीआरटी मॉनिटर',       'सीआरटी मॉनिटर',     'appliance', 'piece', 14),
('lcd_panel',        'LCD Display Panel',      'एलसीडी स्क्रीन',       'एलसीडी स्क्रीन',     'appliance', 'piece', 15),
('electric_motor',   'Electric Motor',         'इलेक्ट्रिक मोटर',      'इलेक्ट्रिक मोटर',    'appliance', 'kg', 16),
('ac_unit',          'AC Unit (Split/Window)', 'एसी यूनिट',           'एसी यूनिट',         'appliance', 'piece', 17),
('washing_machine',  'Washing Machine',        'वॉशिंग मशीन',         'वॉशिंग मशीन',       'appliance', 'piece', 18),
('ms_drum',          'MS Drum (200L)',         'एमएस ड्रम',           'एमएस ड्रम',         'metal',     'piece', 19),
('tin_container',    'Tin Container / Dabba',  'टिन का डिब्बा',        'टिनचा डबा',         'metal',     'kg', 20)
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_hi = excluded.name_hi,
  name_mr = excluded.name_mr,
  category = excluded.category,
  unit = excluded.unit;

-- Market Rates (Indore today's rates - real market reference)
-- We INSERT new rows every day (append-only for history)
insert into public.market_rates (material_id, city, rate, unit, source, effective_date)
select m.id, 'Indore', r.rate, r.unit, 'admin', current_date
from (values
  ('copper_wire',      620, 'kg'),
  ('brass',            450, 'kg'),
  ('aluminium',        135, 'kg'),
  ('iron_scrap',       28, 'kg'),
  ('stainless_steel',  85, 'kg'),
  ('pcb_motherboard',  178, 'kg'),
  ('lithium_battery',  110, 'kg'),
  ('lead_battery',     72, 'kg'),
  ('newspaper',        13, 'kg'),
  ('cardboard',        8, 'kg'),
  ('books_copies',     10, 'kg'),
  ('pet_bottle',       14, 'kg'),
  ('hdpe_plastic',     18, 'kg'),
  ('crt_monitor',      250, 'piece'),
  ('lcd_panel',        450, 'piece'),
  ('electric_motor',   65, 'kg'),
  ('ac_unit',          3500, 'piece'),
  ('washing_machine',  1800, 'piece'),
  ('ms_drum',          350, 'piece'),
  ('tin_container',    22, 'kg')
) as r(slug, rate, unit)
join public.materials m on m.slug = r.slug;

-- Dealers (Indore-based scrap dealers)
insert into public.dealers (id, name, business_name, phone, address, city, gps_lat, gps_lng, rating, total_reviews, is_verified, pickup_available, min_order_kg, operating_hours) values
('d0000001-0000-0000-0000-000000000001', 'Rajesh Kabadiwala', 'Rajesh Scrap Trading Co.', '+91 98260 44321', 'Loha Mandi, Siyaganj, Indore', 'Indore', 22.7175, 75.8573, 4.5, 234, true, true, 5, '8 AM - 8 PM'),
('d0000001-0000-0000-0000-000000000002', 'Salim Bhai Metals', 'Salim Metal & E-Waste', '+91 88891 22345', 'Rajwada Road, Near GPO, Indore', 'Indore', 22.7196, 75.8577, 4.2, 167, true, true, 10, '9 AM - 7 PM'),
('d0000001-0000-0000-0000-000000000003', 'GreenCycle Indore', 'GreenCycle Recycling Pvt. Ltd.', '+91 77230 55667', 'Scheme No. 94, Pithampur Road, Indore', 'Indore', 22.6900, 75.8200, 4.8, 512, true, true, 1, '24/7 Online'),
('d0000001-0000-0000-0000-000000000004', 'Pappu Raddi Wala', 'Pappu Paper & Scrap House', '+91 99813 67890', 'Palasia Square, Near C21 Mall, Indore', 'Indore', 22.7236, 75.8820, 3.9, 89, true, false, 20, '10 AM - 6 PM'),
('d0000001-0000-0000-0000-000000000005', 'The Kabadiwala Indore', 'The Kabadiwala (Franchise)', '+91 80850 12345', 'Vijay Nagar, AB Road, Indore', 'Indore', 22.7533, 75.8937, 4.7, 1089, true, true, 1, '8 AM - 9 PM')
on conflict (id) do nothing;

-- Dealer Offers (each dealer's prices for materials)
-- Dealer 1: Rajesh Kabadiwala
insert into public.dealer_offers (dealer_id, material_id, offer_price, unit, pickup_fee, handling_fee, transportation_fee, min_quantity)
select 'd0000001-0000-0000-0000-000000000001', m.id, r.price, r.unit, r.pickup, r.handling, r.transport, r.min_qty
from (values
  ('copper_wire',     610, 'kg', 0, 5, 10, 5),
  ('brass',           445, 'kg', 0, 5, 10, 5),
  ('aluminium',       130, 'kg', 0, 3, 8, 5),
  ('iron_scrap',      27, 'kg', 0, 2, 5, 20),
  ('newspaper',       12, 'kg', 0, 1, 3, 10),
  ('cardboard',       7, 'kg', 0, 1, 3, 10),
  ('pcb_motherboard', 170, 'kg', 0, 5, 10, 1),
  ('lithium_battery', 105, 'kg', 0, 5, 10, 2)
) as r(slug, price, unit, pickup, handling, transport, min_qty)
join public.materials m on m.slug = r.slug;

-- Dealer 2: Salim Bhai Metals
insert into public.dealer_offers (dealer_id, material_id, offer_price, unit, pickup_fee, handling_fee, transportation_fee, min_quantity)
select 'd0000001-0000-0000-0000-000000000002', m.id, r.price, r.unit, r.pickup, r.handling, r.transport, r.min_qty
from (values
  ('copper_wire',     615, 'kg', 20, 0, 15, 5),
  ('brass',           440, 'kg', 20, 0, 15, 5),
  ('aluminium',       132, 'kg', 15, 0, 10, 5),
  ('iron_scrap',      26, 'kg', 10, 0, 5, 30),
  ('stainless_steel', 82, 'kg', 15, 0, 10, 10),
  ('pcb_motherboard', 175, 'kg', 20, 0, 10, 1),
  ('electric_motor',  62, 'kg', 20, 0, 10, 5)
) as r(slug, price, unit, pickup, handling, transport, min_qty)
join public.materials m on m.slug = r.slug;

-- Dealer 3: GreenCycle (premium, low fees)
insert into public.dealer_offers (dealer_id, material_id, offer_price, unit, pickup_fee, handling_fee, transportation_fee, min_quantity)
select 'd0000001-0000-0000-0000-000000000003', m.id, r.price, r.unit, r.pickup, r.handling, r.transport, r.min_qty
from (values
  ('copper_wire',      625, 'kg', 0, 0, 0, 1),
  ('brass',            452, 'kg', 0, 0, 0, 1),
  ('aluminium',        138, 'kg', 0, 0, 0, 1),
  ('iron_scrap',       29, 'kg', 0, 0, 5, 5),
  ('stainless_steel',  87, 'kg', 0, 0, 0, 1),
  ('pcb_motherboard',  185, 'kg', 0, 0, 0, 1),
  ('lithium_battery',  115, 'kg', 0, 0, 0, 1),
  ('lead_battery',     75, 'kg', 0, 0, 0, 1),
  ('newspaper',        14, 'kg', 0, 0, 0, 1),
  ('cardboard',        9, 'kg', 0, 0, 0, 1),
  ('pet_bottle',       15, 'kg', 0, 0, 0, 1),
  ('crt_monitor',      270, 'piece', 0, 0, 0, 1),
  ('lcd_panel',        480, 'piece', 0, 0, 0, 1),
  ('ac_unit',          3800, 'piece', 0, 0, 0, 1),
  ('washing_machine',  2000, 'piece', 0, 0, 0, 1),
  ('electric_motor',   68, 'kg', 0, 0, 0, 1)
) as r(slug, price, unit, pickup, handling, transport, min_qty)
join public.materials m on m.slug = r.slug;

-- Dealer 4: Pappu Raddi Wala (paper specialist)
insert into public.dealer_offers (dealer_id, material_id, offer_price, unit, pickup_fee, handling_fee, transportation_fee, min_quantity)
select 'd0000001-0000-0000-0000-000000000004', m.id, r.price, r.unit, r.pickup, r.handling, r.transport, r.min_qty
from (values
  ('newspaper',       14, 'kg', 0, 0, 5, 20),
  ('cardboard',       9, 'kg', 0, 0, 5, 20),
  ('books_copies',    11, 'kg', 0, 0, 5, 20),
  ('iron_scrap',      25, 'kg', 0, 2, 5, 50),
  ('pet_bottle',      13, 'kg', 0, 0, 5, 20)
) as r(slug, price, unit, pickup, handling, transport, min_qty)
join public.materials m on m.slug = r.slug;

-- Dealer 5: The Kabadiwala (franchise, best service)
insert into public.dealer_offers (dealer_id, material_id, offer_price, unit, pickup_fee, handling_fee, transportation_fee, min_quantity)
select 'd0000001-0000-0000-0000-000000000005', m.id, r.price, r.unit, r.pickup, r.handling, r.transport, r.min_qty
from (values
  ('copper_wire',      618, 'kg', 0, 0, 5, 1),
  ('brass',            448, 'kg', 0, 0, 5, 1),
  ('aluminium',        136, 'kg', 0, 0, 5, 1),
  ('iron_scrap',       28, 'kg', 0, 0, 3, 5),
  ('stainless_steel',  84, 'kg', 0, 0, 5, 1),
  ('pcb_motherboard',  180, 'kg', 0, 0, 5, 1),
  ('lithium_battery',  112, 'kg', 0, 0, 5, 1),
  ('lead_battery',     73, 'kg', 0, 0, 5, 1),
  ('newspaper',        13, 'kg', 0, 0, 2, 1),
  ('cardboard',        8, 'kg', 0, 0, 2, 1),
  ('books_copies',     10, 'kg', 0, 0, 2, 1),
  ('pet_bottle',       14, 'kg', 0, 0, 2, 1),
  ('hdpe_plastic',     17, 'kg', 0, 0, 2, 1),
  ('crt_monitor',      260, 'piece', 0, 0, 10, 1),
  ('lcd_panel',        460, 'piece', 0, 0, 10, 1),
  ('electric_motor',   66, 'kg', 0, 0, 5, 1),
  ('ac_unit',          3600, 'piece', 0, 0, 50, 1),
  ('washing_machine',  1850, 'piece', 0, 0, 50, 1),
  ('ms_drum',          340, 'piece', 0, 0, 10, 1),
  ('tin_container',    21, 'kg', 0, 0, 2, 1)
) as r(slug, price, unit, pickup, handling, transport, min_qty)
join public.materials m on m.slug = r.slug;

-- ====================================================================
-- DONE! Market rates, dealers, and offers are seeded.
-- ====================================================================
