"""
ScrapWala AI Pipeline - YOLO11n Fine-Tuning Script
Fine-tunes YOLO11n on the unified ScrapWala dataset with early stopping,
evaluation metrics logging (mAP50, mAP50-95, precision, recall), and automated ONNX export.
"""

import os
import sys
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_YAML = BASE_DIR / "dataset" / "unified" / "data.yaml"
OUTPUT_DIR = BASE_DIR / "runs" / "waste_yolo11n"

def run_training(epochs=50, img_size=640, batch_size=16):
    try:
        from ultralytics import YOLO
    except ImportError:
        print("[ERROR] ultralytics package not installed. Install via: pip install ultralytics")
        return False
        
    print("=" * 60)
    print("Starting YOLO11n Fine-Tuning for ScrapWala Waste Detection")
    print(f"Data configuration: {DATASET_YAML}")
    print(f"Epochs: {epochs} | Input Size: {img_size} | Batch: {batch_size}")
    print("=" * 60)
    
    if not DATASET_YAML.exists():
        print(f"[ERROR] Dataset configuration {DATASET_YAML} not found. Run scripts/merge_dataset.py first.")
        return False
        
    # Load pretrained YOLO11n
    model = YOLO("yolo11n.pt")
    
    # Train
    results = model.train(
        data=str(DATASET_YAML),
        epochs=epochs,
        imgsz=img_size,
        batch=batch_size,
        patience=10,  # early stopping
        project=str(OUTPUT_DIR),
        name="experiment_1",
        save=True,
        device="0" if os.environ.get("CUDA_VISIBLE_DEVICES") else "cpu"
    )
    
    # Export best model to ONNX
    print("Exporting best checkpoint to ONNX...")
    best_pt = OUTPUT_DIR / "experiment_1" / "weights" / "best.pt"
    if best_pt.exists():
        best_model = YOLO(str(best_pt))
        exported_path = best_model.export(format="onnx", imgsz=img_size, dynamic=False, simplify=True)
        print(f"ONNX Model exported successfully to: {exported_path}")
        
    return True

if __name__ == "__main__":
    epochs = int(sys.argv[1]) if len(sys.argv) > 1 else 30
    run_training(epochs=epochs)
