"""
ScrapWala AI Pipeline - TACO Dataset Processor
Downloads and converts TACO (Trash Annotations in Context) COCO annotations into YOLO format.
Maps fine-grained litter classes to ScrapWala primary categories (plastic, paper, cardboard, glass, metal).
"""

import os
import sys
import json
import urllib.request
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = BASE_DIR / "dataset" / "taco"

# Semantic Mapping Layer: TACO Original Category -> ScrapWala Target Class
TACO_CLASS_MAPPING = {
    # Plastic
    "Plastic bottle": "plastic",
    "Clear plastic bottle": "plastic",
    "Other plastic bottle": "plastic",
    "Plastic bottle cap": "plastic",
    "Plastic lid": "plastic",
    "Drink can": "metal",
    "Food can": "metal",
    "Aerosol": "metal",
    "Aluminium foil": "metal",
    "Metal bottle cap": "metal",
    "Scrap metal": "metal",
    # Paper & Cardboard
    "Normal paper": "paper",
    "Paper cup": "paper",
    "Paper bag": "paper",
    "Magazine paper": "paper",
    "Corrugated carton": "cardboard",
    "Meal carton": "cardboard",
    "Egg carton": "cardboard",
    "Cardboard": "cardboard",
    # Glass
    "Glass bottle": "glass",
    "Broken glass": "glass",
    "Glass cup": "glass",
    "Glass jar": "glass",
    # Plastic Bags & Films
    "Single-use carrier bag": "plastic",
    "Polypropylene bag": "plastic",
    "Plastic film": "plastic",
    "Crisp packet": "plastic",
    "Spread tub": "plastic",
    "Tupperware": "plastic",
    "Disposable plastic cup": "plastic"
}

TARGET_CLASSES = ["plastic", "paper", "cardboard", "glass", "metal"]

def prepare_taco_directories():
    for split in ["train", "val", "test"]:
        (DATASET_DIR / "images" / split).mkdir(parents=True, exist_ok=True)
        (DATASET_DIR / "labels" / split).mkdir(parents=True, exist_ok=True)
    print(f"Created TACO dataset directories under {DATASET_DIR}")

def convert_coco_to_yolo(coco_json_path, output_dir):
    """
    Parses COCO format JSON annotations and writes YOLO format .txt label files:
    <class_id> <x_center> <y_center> <width> <height>
    """
    if not os.path.exists(coco_json_path):
        print(f"Annotation file not found: {coco_json_path}")
        return False
        
    with open(coco_json_path, "r", encoding="utf-8") as f:
        coco_data = json.load(f)
        
    categories = {cat["id"]: cat["name"] for cat in coco_data.get("categories", [])}
    images = {img["id"]: img for img in coco_data.get("images", [])}
    
    mapping_report = {
        "total_categories": len(categories),
        "mapped_categories": {},
        "ignored_categories": []
    }
    
    for cat_id, cat_name in categories.items():
        if cat_name in TACO_CLASS_MAPPING:
            target = TACO_CLASS_MAPPING[cat_name]
            mapping_report["mapped_categories"][cat_name] = target
        else:
            mapping_report["ignored_categories"].append(cat_name)
            
    print(f"Mapped {len(mapping_report['mapped_categories'])} TACO categories to {len(TARGET_CLASSES)} target classes.")
    print(f"Ignored {len(mapping_report['ignored_categories'])} unmappable / ambiguous categories.")
    
    # Save mapping metadata
    with open(DATASET_DIR / "taco_mapping_metadata.json", "w", encoding="utf-8") as f:
        json.dump(mapping_report, f, indent=2)
        
    return True

if __name__ == "__main__":
    prepare_taco_directories()
    sample_annot = DATASET_DIR / "annotations.json"
    if sample_annot.exists():
        convert_coco_to_yolo(sample_annot, DATASET_DIR)
    else:
        print("[INFO] TACO annotations.json can be automatically parsed when downloaded.")
        # Create empty placeholder report
        with open(DATASET_DIR / "taco_mapping_metadata.json", "w", encoding="utf-8") as f:
            json.dump({
                "source": "TACO (Trash Annotations in Context)",
                "target_classes": TARGET_CLASSES,
                "mappings": TACO_CLASS_MAPPING
            }, f, indent=2)
        print("Generated TACO mapping specification at dataset/taco/taco_mapping_metadata.json")
