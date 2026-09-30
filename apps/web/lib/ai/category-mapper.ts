import { WasteDetectionResult } from './types';
import { DEFAULT_MODEL_CONFIG } from './model-config';

export interface CategoryDetails {
  slug: string;
  nameEn: string;
  nameHi: string;
  approxRatePerKg: number;
  category: string;
}

const CATEGORY_MAP: Record<string, CategoryDetails> = {
  cardboard: {
    slug: 'cardboard',
    nameEn: 'Cardboard / Carton (गत्ता)',
    nameHi: 'गत्ता / कार्टन बॉक्स',
    approxRatePerKg: 14,
    category: 'paper'
  },
  paper: {
    slug: 'newspaper',
    nameEn: 'Newspaper & Books (रद्दी)',
    nameHi: 'अखबार / किताबें / रद्दी',
    approxRatePerKg: 18,
    category: 'paper'
  },
  plastic: {
    slug: 'pet_bottle',
    nameEn: 'Plastic (Bottles & Containers)',
    nameHi: 'प्लास्टिक (बोतलें व डिब्बे)',
    approxRatePerKg: 28,
    category: 'plastic'
  },
  metal: {
    slug: 'iron_scrap',
    nameEn: 'Iron / Steel / Rebar (लोहा / सरिया)',
    nameHi: 'लोहा / सरिया / धातु स्क्रैप',
    approxRatePerKg: 38,
    category: 'metal'
  },
  glass: {
    slug: 'other_waste',
    nameEn: 'Glass (कांच/शीशा)',
    nameHi: 'कांच / शीशा (सावधानी)',
    approxRatePerKg: 0,
    category: 'glass'
  },
  trash: {
    slug: 'other_waste',
    nameEn: 'Mixed / Unclassified Waste',
    nameHi: 'मिश्रित कचरा',
    approxRatePerKg: 0,
    category: 'other'
  },
  e_waste: {
    slug: 'pcb_motherboard',
    nameEn: 'E-Waste / Electronics (ई-कचरा)',
    nameHi: 'ई-कचरा / इलेक्ट्रॉनिक्स',
    approxRatePerKg: 120,
    category: 'ewaste'
  }
};

export function enrichDetectionWithMaterial(
  detectedClass: string,
  confidence: number,
  threshold: number,
  box?: { x: number; y: number; width: number; height: number }
): WasteDetectionResult {
  const normClass = detectedClass.toLowerCase().trim();
  const info = CATEGORY_MAP[normClass] || {
    slug: 'other_waste',
    nameEn: normClass.charAt(0).toUpperCase() + normClass.slice(1),
    nameHi: normClass,
    approxRatePerKg: 0,
    category: 'other'
  };

  const isLowConfidence = confidence < threshold;

  return {
    id: 'det_' + Math.random().toString(36).substring(2, 9),
    className: normClass,
    displayNameEn: isLowConfidence ? `Low Confidence (${info.nameEn})` : info.nameEn,
    displayNameHi: isLowConfidence ? `कम विश्वास (${info.nameHi})` : info.nameHi,
    confidence: Math.round(confidence * 100) / 100,
    confidencePercentage: Math.round(confidence * 100),
    isLowConfidence,
    boundingBox: box,
    mappedMaterialSlug: info.slug,
    suggestedRatePerKg: info.approxRatePerKg
  };
}
