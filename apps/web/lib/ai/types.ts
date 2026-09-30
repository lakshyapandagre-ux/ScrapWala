export interface BoundingBox {
  x: number;      // normalized [0, 1] or pixel
  y: number;
  width: number;
  height: number;
}

export interface WasteDetectionResult {
  id: string;
  className: string;           // e.g., 'plastic', 'metal', 'cardboard', 'paper', 'glass', 'trash'
  displayNameEn: string;       // e.g., 'Plastic (PET Bottles)'
  displayNameHi: string;       // e.g., 'प्लास्टिक (बोतलें)'
  confidence: number;          // e.g., 0.91
  confidencePercentage: number;// e.g., 91
  isLowConfidence: boolean;    // true if below configured threshold (e.g. 0.45)
  boundingBox?: BoundingBox;
  mappedMaterialSlug?: string; // slug matching ScrapWala materials (e.g. 'pet_bottle', 'copper_wire')
  suggestedRatePerKg?: number; // from market rates
}

export interface ModelConfig {
  model_name: string;
  version: string;
  format: string;
  runtime: string;
  model_url: string;
  input_width: number;
  input_height: number;
  confidence_threshold: number;
  iou_threshold: number;
  classes: string[];
  material_mapping: Record<string, string>;
  source: string;
  license: string;
}
