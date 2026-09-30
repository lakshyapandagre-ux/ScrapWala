"""
ScrapWala AI Pipeline - GIZ E-Waste Dataset Processor
Processes GIZ E-Waste annotations, maps electronics/appliances into ScrapWala 'e_waste',
and formats YOLO format bounding box labels.
"""

import os
import sys
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = BASE_DIR / "dataset" / "giz_ewaste"

# Semantic Mapping: GIZ E-waste categories -> ScrapWala 'e_waste'
GIZ_CLASS_MAPPING = {
    "tv": "e_waste",
    "television": "e_waste",
    "crt_monitor": "e_waste",
    "lcd_monitor": "e_waste",
    "monitor": "e_waste",
    "computer": "e_waste",
    "cpu": "e_waste",
    "laptop": "e_waste",
    "keyboard": "e_waste",
    "printer": "e_waste",
    "microwave": "e_waste",
    "refrigerator": "e_waste",
    "fridge": "e_waste",
    "air_conditioner": "e_waste",
    "ac": "e_waste",
    "compressor": "e_waste",
    "washing_machine": "e_waste",
    "electric_motor": "e_waste",
    "circuit_board": "e_waste",
    "pcb": "e_waste"
}

def prepare_giz_directories():
    for split in ["train", "val", "test"]:
        (DATASET_DIR / "images" / split).mkdir(parents=True, exist_ok=True)
        (DATASET_DIR / "labels" / split).mkdir(parents=True, exist_ok=True)
    print(f"Created GIZ E-Waste dataset directories under {DATASET_DIR}")

def generate_giz_metadata():
    metadata = {
        "dataset_name": "GIZ E-Waste Dataset",
        "source": "https://huggingface.co/datasets/GIZ/e-waste-dataset-COCO-labels",
        "target_class": "e_waste",
        "supported_mappings": GIZ_CLASS_MAPPING,
        "notes": "Maps varied electronic scrap types from scrapyard imagery into the unified e_waste class for downstream damage assessment and mineral valuation."
    }
    with open(DATASET_DIR / "giz_mapping_metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print("Generated GIZ metadata at dataset/giz_ewaste/giz_mapping_metadata.json")

if __name__ == "__main__":
    prepare_giz_directories()
    generate_giz_metadata()
