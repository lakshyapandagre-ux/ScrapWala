import { ModelConfig } from './types';

export const DEFAULT_MODEL_CONFIG: ModelConfig = {
  model_name: "Jeremy341/MIRA-AI (YOLO11n exp019)",
  version: "1.0.0",
  format: "ONNX",
  runtime: "onnxruntime-web",
  model_url: "/models/yolo11n_waste.onnx",
  input_width: 640,
  input_height: 640,
  confidence_threshold: 0.35, // Balanced threshold
  iou_threshold: 0.45,
  classes: [
    "glass",
    "metal",
    "paper",
    "plastic",
    "trash"
  ],
  material_mapping: {
    "plastic": "pet_bottle",
    "metal": "iron_scrap",
    "paper": "newspaper",
    "glass": "other_waste",
    "trash": "other_waste"
  },
  source: "https://huggingface.co/Jeremy341/MIRA-AI",
  license: "MIT / AGPL-3.0"
};

// Configurable threshold getter / setter
let activeConfidenceThreshold = DEFAULT_MODEL_CONFIG.confidence_threshold;

export function getConfidenceThreshold(): number {
  return activeConfidenceThreshold;
}

export function setConfidenceThreshold(threshold: number): void {
  activeConfidenceThreshold = Math.max(0.1, Math.min(0.95, threshold));
}
