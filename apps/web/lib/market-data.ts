'use client';

import { supabase, isSupabaseConfigured } from './supabase-client';

// ============ Types ============

export interface Material {
  id: string;
  slug: string;
  name_en: string;
  name_hi: string;
  name_mr: string;
  category: string;
  unit: string;
  icon_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface MarketRate {
  id: string;
  material_id: string;
  city: string;
  rate: number;
  unit: string;
  source: string;
  effective_date: string;
  created_at: string;
}

export interface Dealer {
  id: string;
  name: string;
  business_name: string | null;
  phone: string | null;
  email: string | null;
  address: string;
  city: string;
  gps_lat: number | null;
  gps_lng: number | null;
  logo_url: string | null;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_active: boolean;
  pickup_available: boolean;
  min_order_kg: number;
  operating_hours: string;
}

export interface DealerOffer {
  id: string;
  dealer_id: string;
  material_id: string;
  offer_price: number;
  unit: string;
  pickup_fee: number;
  handling_fee: number;
  transportation_fee: number;
  platform_fee: number;
  min_quantity: number;
  max_quantity: number | null;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
  // Joined fields
  dealer?: Dealer;
}

export interface BestDeal {
  offer: DealerOffer;
  dealer: Dealer;
  material: Material;
  marketRate: number;
  grossAmount: number;
  totalFees: number;
  netAmount: number;
  savingsVsMarket: number; // positive = better than market
}

// ============ Fallback Data (when Supabase not connected) ============

const FALLBACK_MATERIALS: Material[] = [
  { id: '1', slug: 'copper_wire', name_en: 'Copper Wire & Cable', name_hi: 'तांबे का तार', name_mr: 'तांब्याची वायर', category: 'metal', unit: 'kg', icon_url: null, is_active: true, sort_order: 1 },
  { id: '2', slug: 'brass', name_en: 'Brass (Pital)', name_hi: 'पीतल (पितळ)', name_mr: 'पितळ', category: 'metal', unit: 'kg', icon_url: null, is_active: true, sort_order: 2 },
  { id: '3', slug: 'aluminium', name_en: 'Aluminium', name_hi: 'एल्युमीनियम', name_mr: 'अॅल्युमिनियम', category: 'metal', unit: 'kg', icon_url: null, is_active: true, sort_order: 3 },
  { id: '4', slug: 'iron_scrap', name_en: 'Iron / MS Scrap', name_hi: 'लोहा / एमएस स्क्रैप', name_mr: 'लोखंड / एमएस', category: 'metal', unit: 'kg', icon_url: null, is_active: true, sort_order: 4 },
  { id: '5', slug: 'stainless_steel', name_en: 'Stainless Steel', name_hi: 'स्टेनलेस स्टील', name_mr: 'स्टेनलेस स्टील', category: 'metal', unit: 'kg', icon_url: null, is_active: true, sort_order: 5 },
  { id: '6', slug: 'pcb_motherboard', name_en: 'PCB / Motherboard', name_hi: 'सर्किट बोर्ड / PCB', name_mr: 'पीसीबी / मदरबोर्ड', category: 'ewaste', unit: 'kg', icon_url: null, is_active: true, sort_order: 6 },
  { id: '7', slug: 'lithium_battery', name_en: 'Lithium Battery', name_hi: 'लिथियम बैटरी', name_mr: 'लिथियम बॅटरी', category: 'ewaste', unit: 'kg', icon_url: null, is_active: true, sort_order: 7 },
  { id: '8', slug: 'lead_battery', name_en: 'Lead Battery', name_hi: 'लेड बैटरी', name_mr: 'लेड बॅटरी', category: 'ewaste', unit: 'kg', icon_url: null, is_active: true, sort_order: 8 },
  { id: '9', slug: 'newspaper', name_en: 'Newspaper (Raddi)', name_hi: 'अखबार (रद्दी)', name_mr: 'वर्तमानपत्र', category: 'paper', unit: 'kg', icon_url: null, is_active: true, sort_order: 9 },
  { id: '10', slug: 'cardboard', name_en: 'Cardboard / Carton', name_hi: 'गत्ता / कार्टन', name_mr: 'पुठ्ठा / बॉक्स', category: 'paper', unit: 'kg', icon_url: null, is_active: true, sort_order: 10 },
  { id: '11', slug: 'books_copies', name_en: 'Books & Copies', name_hi: 'किताबें व कॉपी', name_mr: 'पुस्तकें व वह्या', category: 'paper', unit: 'kg', icon_url: null, is_active: true, sort_order: 11 },
  { id: '12', slug: 'pet_bottle', name_en: 'PET Bottles', name_hi: 'प्लास्टिक बोतलें', name_mr: 'प्लास्टिक बाटल्या', category: 'plastic', unit: 'kg', icon_url: null, is_active: true, sort_order: 12 },
  { id: '13', slug: 'hdpe_plastic', name_en: 'HDPE Plastic', name_hi: 'एचडीपीई प्लास्टिक', name_mr: 'एचडीपीई प्लास्टिक', category: 'plastic', unit: 'kg', icon_url: null, is_active: true, sort_order: 13 },
  { id: '14', slug: 'crt_monitor', name_en: 'CRT Monitor / Old TV', name_hi: 'सीआरटी मॉनिटर', name_mr: 'सीआरटी मॉनिटर', category: 'appliance', unit: 'piece', icon_url: null, is_active: true, sort_order: 14 },
  { id: '15', slug: 'lcd_panel', name_en: 'LCD Display Panel', name_hi: 'एलसीडी स्क्रीन', name_mr: 'एलसीडी स्क्रीन', category: 'appliance', unit: 'piece', icon_url: null, is_active: true, sort_order: 15 },
  { id: '16', slug: 'electric_motor', name_en: 'Electric Motor', name_hi: 'इलेक्ट्रिक मोटर', name_mr: 'इलेक्ट्रिक मोटर', category: 'appliance', unit: 'kg', icon_url: null, is_active: true, sort_order: 16 },
  { id: '17', slug: 'ac_unit', name_en: 'AC Unit (Split/Window)', name_hi: 'एसी यूनिट', name_mr: 'एसी यूनिट', category: 'appliance', unit: 'piece', icon_url: null, is_active: true, sort_order: 17 },
  { id: '18', slug: 'washing_machine', name_en: 'Washing Machine', name_hi: 'वॉशिंग मशीन', name_mr: 'वॉशिंग मशीन', category: 'appliance', unit: 'piece', icon_url: null, is_active: true, sort_order: 18 },
  { id: '19', slug: 'ms_drum', name_en: 'MS Drum (200L)', name_hi: 'एमएस ड्रम', name_mr: 'एमएस ड्रम', category: 'metal', unit: 'piece', icon_url: null, is_active: true, sort_order: 19 },
  { id: '20', slug: 'tin_container', name_en: 'Tin Container / Dabba', name_hi: 'टिन का डिब्बा', name_mr: 'टिनचा डबा', category: 'metal', unit: 'kg', icon_url: null, is_active: true, sort_order: 20 },
];

const FALLBACK_RATES: Record<string, number> = {
  'copper_wire': 620, 'brass': 450, 'aluminium': 135, 'iron_scrap': 28,
  'stainless_steel': 85, 'pcb_motherboard': 178, 'lithium_battery': 110,
  'lead_battery': 72, 'newspaper': 13, 'cardboard': 8, 'books_copies': 10,
  'pet_bottle': 14, 'hdpe_plastic': 18, 'crt_monitor': 250, 'lcd_panel': 450,
  'electric_motor': 65, 'ac_unit': 3500, 'washing_machine': 1800,
  'ms_drum': 350, 'tin_container': 22,
};

const FALLBACK_DEALERS: Dealer[] = [
  { id: 'd1', name: 'Rajesh Kabadiwala', business_name: 'Rajesh Scrap Trading Co.', phone: '+91 98260 44321', email: null, address: 'Loha Mandi, Siyaganj, Indore', city: 'Indore', gps_lat: 22.7175, gps_lng: 75.8573, logo_url: null, rating: 4.5, total_reviews: 234, is_verified: true, is_active: true, pickup_available: true, min_order_kg: 5, operating_hours: '8 AM - 8 PM' },
  { id: 'd2', name: 'Salim Bhai Metals', business_name: 'Salim Metal & E-Waste', phone: '+91 88891 22345', email: null, address: 'Rajwada Road, Near GPO, Indore', city: 'Indore', gps_lat: 22.7196, gps_lng: 75.8577, logo_url: null, rating: 4.2, total_reviews: 167, is_verified: true, is_active: true, pickup_available: true, min_order_kg: 10, operating_hours: '9 AM - 7 PM' },
  { id: 'd3', name: 'GreenCycle Indore', business_name: 'GreenCycle Recycling Pvt. Ltd.', phone: '+91 77230 55667', email: null, address: 'Scheme No. 94, Pithampur Road, Indore', city: 'Indore', gps_lat: 22.6900, gps_lng: 75.8200, logo_url: null, rating: 4.8, total_reviews: 512, is_verified: true, is_active: true, pickup_available: true, min_order_kg: 1, operating_hours: '24/7 Online' },
  { id: 'd4', name: 'Pappu Raddi Wala', business_name: 'Pappu Paper & Scrap House', phone: '+91 99813 67890', email: null, address: 'Palasia Square, Near C21 Mall, Indore', city: 'Indore', gps_lat: 22.7236, gps_lng: 75.8820, logo_url: null, rating: 3.9, total_reviews: 89, is_verified: true, is_active: true, pickup_available: false, min_order_kg: 20, operating_hours: '10 AM - 6 PM' },
  { id: 'd5', name: 'The Kabadiwala Indore', business_name: 'The Kabadiwala (Franchise)', phone: '+91 80850 12345', email: null, address: 'Vijay Nagar, AB Road, Indore', city: 'Indore', gps_lat: 22.7533, gps_lng: 75.8937, logo_url: null, rating: 4.7, total_reviews: 1089, is_verified: true, is_active: true, pickup_available: true, min_order_kg: 1, operating_hours: '8 AM - 9 PM' },
];

// ============ Data Fetching Functions ============

export async function fetchMaterials(): Promise<Material[]> {
  if (!isSupabaseConfigured) return FALLBACK_MATERIALS;
  
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error || !data || data.length === 0) return FALLBACK_MATERIALS;
    return data;
  } catch {
    return FALLBACK_MATERIALS;
  }
}

export async function fetchLatestRates(city: string = 'Indore'): Promise<{ material_id: string; slug: string; rate: number; unit: string; prev_rate?: number }[]> {
  if (!isSupabaseConfigured) {
    return FALLBACK_MATERIALS.map(m => ({
      material_id: m.id,
      slug: m.slug,
      rate: FALLBACK_RATES[m.slug] || 0,
      unit: m.unit,
    }));
  }
  
  try {
    // Get latest rate per material for the given city
    const { data, error } = await supabase
      .from('market_rates')
      .select(`
        id, material_id, rate, unit, effective_date,
        materials!inner(slug)
      `)
      .eq('city', city)
      .order('effective_date', { ascending: false });
    
    if (error || !data) {
      return FALLBACK_MATERIALS.map(m => ({
        material_id: m.id,
        slug: m.slug,
        rate: FALLBACK_RATES[m.slug] || 0,
        unit: m.unit,
      }));
    }
    
    // Group by material_id, take most recent
    const latestByMaterial = new Map<string, { material_id: string; slug: string; rate: number; unit: string; prev_rate?: number }>();
    const prevByMaterial = new Map<string, number>();
    
    for (const row of data) {
      const slug = (row as any).materials?.slug || '';
      if (!latestByMaterial.has(row.material_id)) {
        latestByMaterial.set(row.material_id, {
          material_id: row.material_id,
          slug,
          rate: row.rate,
          unit: row.unit,
        });
      } else if (!prevByMaterial.has(row.material_id)) {
        prevByMaterial.set(row.material_id, row.rate);
      }
    }
    
    // Attach prev_rate
    for (const [mid, entry] of latestByMaterial) {
      if (prevByMaterial.has(mid)) {
        entry.prev_rate = prevByMaterial.get(mid);
      }
    }
    
    return Array.from(latestByMaterial.values());
  } catch {
    return FALLBACK_MATERIALS.map(m => ({
      material_id: m.id,
      slug: m.slug,
      rate: FALLBACK_RATES[m.slug] || 0,
      unit: m.unit,
    }));
  }
}

export async function fetchDealers(city: string = 'Indore'): Promise<Dealer[]> {
  if (!isSupabaseConfigured) return FALLBACK_DEALERS;
  
  try {
    const { data, error } = await supabase
      .from('dealers')
      .select('*')
      .eq('city', city)
      .eq('is_active', true)
      .order('rating', { ascending: false });
    
    if (error || !data || data.length === 0) return FALLBACK_DEALERS;
    return data;
  } catch {
    return FALLBACK_DEALERS;
  }
}

export async function fetchOffersForMaterial(materialId: string): Promise<(DealerOffer & { dealer: Dealer })[]> {
  if (!isSupabaseConfigured) return [];
  
  try {
    const { data, error } = await supabase
      .from('dealer_offers')
      .select(`
        *,
        dealer:dealers(*)
      `)
      .eq('material_id', materialId)
      .eq('is_active', true)
      .order('offer_price', { ascending: false });
    
    if (error || !data) return [];
    return data as any;
  } catch {
    return [];
  }
}

export async function fetchAllActiveOffers(): Promise<(DealerOffer & { dealer: Dealer })[]> {
  if (!isSupabaseConfigured) return [];
  
  try {
    const { data, error } = await supabase
      .from('dealer_offers')
      .select(`
        *,
        dealer:dealers(*)
      `)
      .eq('is_active', true);
    
    if (error || !data) return [];
    return data as any;
  } catch {
    return [];
  }
}

// ============ Best Deal Calculator ============

/**
 * Calculate the best deal for a given material and quantity.
 * Returns offers sorted by NET AMOUNT (highest first).
 * Net = (offer_price * quantity) - pickup_fee - handling_fee - transportation_fee - platform_fee
 */
export function calculateBestDeals(
  offers: (DealerOffer & { dealer: Dealer })[],
  quantity: number,
  marketRate: number,
): BestDeal[] {
  return offers
    .filter(o => quantity >= o.min_quantity && (!o.max_quantity || quantity <= o.max_quantity))
    .map(offer => {
      const grossAmount = offer.offer_price * quantity;
      const totalFees = offer.pickup_fee + offer.handling_fee + offer.transportation_fee + offer.platform_fee;
      const netAmount = grossAmount - totalFees;
      const marketValue = marketRate * quantity;
      const savingsVsMarket = netAmount - marketValue;
      
      return {
        offer,
        dealer: offer.dealer,
        material: {} as Material, // filled by caller
        marketRate,
        grossAmount,
        totalFees,
        netAmount,
        savingsVsMarket,
      };
    })
    .sort((a, b) => b.netAmount - a.netAmount); // Highest net amount first
}

// ============ Admin: Insert new market rate ============

export async function insertMarketRate(materialId: string, rate: number, unit: string, city: string = 'Indore'): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  
  try {
    const { error } = await supabase
      .from('market_rates')
      .insert({
        material_id: materialId,
        city,
        rate,
        unit,
        source: 'admin',
        effective_date: new Date().toISOString().split('T')[0],
      });
    
    return !error;
  } catch {
    return false;
  }
}

export async function insertDealerOffer(offer: Partial<DealerOffer>): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  
  try {
    const { error } = await supabase
      .from('dealer_offers')
      .insert(offer);
    
    return !error;
  } catch {
    return false;
  }
}
