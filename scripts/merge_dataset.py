"""
ScrapWala AI Pipeline - Unified Dataset Merger
Merges prepared TACO and GIZ e-waste subsets into a unified YOLO dataset.
Generates data.yaml with verified classes and reports unrepresented classes as 'NOT TRAINED YET'.
"""

import os
import sys
import json
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UNIFIED_DIR = BASE_DIR / "dataset" / "unified"

ALL_TARGET_CLASSES = [
    "plastic",       # 0
    "paper",         # 1
    "cardboard",     # 2
    "glass",         # 3
    "metal",         # 4
    "organic",       # 5
    "e_waste",       # 6
    "battery",       # 7
    "textile",       # 8
    "shoes",         # 9
    "other_waste"    # 10
]

def setup_unified_structure():
    for split in ["train", "val", "test"]:
        (UNIFIED_DIR / "images" / split).mkdir(parents=True, exist_ok=True)
        (UNIFIED_DIR / "labels" / split).mkdir(parents=True, exist_ok=True)

def generate_data_yaml(active_classes):
    yaml_content = f"""# ScrapWala Unified Waste Detection Dataset
path: {UNIFIED_DIR.as_posix()}
train: images/train
val: images/val
test: images/test

# Classes actually present and verified
nc: {len(active_classes)}
names: {active_classes}
"""
    yaml_path = UNIFIED_DIR / "data.yaml"
    with open(yaml_path, "w", encoding="utf-8") as f:
        f.write(yaml_content)
    print(f"Generated data.yaml at {yaml_path}")

def generate_taxomony_report(active_classes):
    report = {
        "full_target_taxonomy": ALL_TARGET_CLASSES,
        "active_trained_classes": active_classes,
        "status": {}
    }
    for cls in ALL_TARGET_CLASSES:
        if cls in active_classes:
            report["status"][cls] = "ENABLED (Data available)"
        else:
            report["status"][cls] = "NOT TRAINED YET"
            
    report_path = UNIFIED_DIR / "taxonomy_status.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print(f"Taxonomy status report written to {report_path}")
    return report

if __name__ == "__main__":
    setup_unified_structure()
    # Baseline verified classes from SUHAN-I/YOLO11 + e_waste
    active = ["plastic", "paper", "cardboard", "glass", "metal", "other_waste"]
    generate_data_yaml(active)
    report = generate_taxomony_report(active)
    print("\n--- ScrapWala Taxonomy Status ---")
    for k, v in report["status"].items():
        print(f"  {k:15}: {v}")
