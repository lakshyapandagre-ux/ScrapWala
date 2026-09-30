-- ====================================================================
-- ScrapWala Seed Data
-- Reference materials, compositions, and initial EPR rates
-- ====================================================================

-- 1. Materials Reference (with critical mineral composition JSON)
insert into materials_reference (category, hazard_class, composition_json) values
('PCBs', 'Class 9 - Miscellaneous', '{
  "copper_pct": 20.0,
  "gold_g_per_ton": 250.0,
  "silver_g_per_ton": 1000.0,
  "palladium_g_per_ton": 110.0,
  "lead_pct": 2.5,
  "critical_minerals": ["copper", "gold", "silver", "palladium"]
}'::jsonb),
('Cables', 'Class 9 - Low Hazard', '{
  "copper_pct": 45.0,
  "aluminum_pct": 10.0,
  "pvc_pct": 40.0,
  "critical_minerals": ["copper", "aluminum"]
}'::jsonb),
('Batteries', 'Class 8 - Corrosive / Class 9', '{
  "lithium_pct": 3.0,
  "cobalt_pct": 15.0,
  "nickel_pct": 10.0,
  "graphite_pct": 12.0,
  "critical_minerals": ["lithium", "cobalt", "nickel"]
}'::jsonb),
('CRT Monitors', 'Class 6.1 - Toxic (Lead Glass)', '{
  "lead_glass_pct": 55.0,
  "copper_pct": 5.0,
  "ferrous_metals_pct": 15.0,
  "plastics_pct": 20.0,
  "critical_minerals": ["copper"]
}'::jsonb),
('LCD Panels', 'Class 9 - Low Hazard', '{
  "indium_tin_oxide_pct": 0.05,
  "glass_pct": 70.0,
  "aluminum_frame_pct": 15.0,
  "critical_minerals": ["indium", "aluminum"]
}'::jsonb),
('Electric Motors', 'Class 9 - Low Hazard', '{
  "copper_winding_pct": 18.0,
  "steel_iron_pct": 72.0,
  "aluminum_casing_pct": 8.0,
  "critical_minerals": ["copper"]
}'::jsonb),
('Mixed Plastics', 'Class 9 - Low Hazard', '{
  "abs_pct": 60.0,
  "polycarbonate_pct": 30.0,
  "critical_minerals": []
}'::jsonb)
on conflict (category) do update set
  hazard_class = excluded.hazard_class,
  composition_json = excluded.composition_json;

-- 2. EPR Rate Card (with passthrough_percentage default 0.30 to collector)
insert into epr_rate_card (material_category, epr_value_per_kg, passthrough_percentage) values
('PCBs', 75.00, 0.30),
('Cables', 40.00, 0.30),
('Batteries', 90.00, 0.35),
('CRT Monitors', 20.00, 0.25),
('LCD Panels', 35.00, 0.30),
('Electric Motors', 45.00, 0.30),
('Mixed Plastics', 15.00, 0.25)
on conflict (material_category) do update set
  epr_value_per_kg = excluded.epr_value_per_kg,
  passthrough_percentage = excluded.passthrough_percentage;

-- 3. Baseline Price Observations (Market Benchmark Data)
insert into price_observations (material_category, locality, price_per_kg, unit, source_type, verification_status) values
('PCBs', 'Indore', 178.0, 'kg', 'admin_estimate', 'verified'),
('PCBs', 'Bhopal', 172.0, 'kg', 'admin_estimate', 'verified'),
('PCBs', 'Delhi NCR', 185.0, 'kg', 'completed_transaction', 'verified'),
('PCBs', 'Bengaluru', 190.0, 'kg', 'completed_transaction', 'verified'),
('Cables', 'Indore', 140.0, 'kg', 'admin_estimate', 'verified'),
('Cables', 'Bhopal', 135.0, 'kg', 'admin_estimate', 'verified'),
('Batteries', 'Indore', 110.0, 'kg', 'admin_estimate', 'verified'),
('Batteries', 'Bengaluru', 125.0, 'kg', 'completed_transaction', 'verified'),
('CRT Monitors', 'Indore', 18.0, 'kg', 'admin_estimate', 'verified'),
('LCD Panels', 'Indore', 45.0, 'kg', 'admin_estimate', 'verified'),
('Electric Motors', 'Indore', 65.0, 'kg', 'admin_estimate', 'verified');
