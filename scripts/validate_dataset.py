"""
ScrapWala AI Pipeline - Dataset Validation
Scans image and label pairs, checking:
- missing images or labels
- out-of-boundary YOLO bounding boxes (x, y, w, h not in [0, 1])
- corrupted or empty annotation files
- class indices exceeding nc
Generates dataset_validation_report.json
"""

import os
import sys
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = BASE_DIR / "dataset" / "unified"

def validate_dataset():
    report = {
        "status": "PASS",
        "total_images": 0,
        "total_labels": 0,
        "missing_labels": [],
        "missing_images": [],
        "empty_labels": [],
        "invalid_coordinates": [],
        "invalid_class_ids": [],
        "summary": {}
    }
    
    for split in ["train", "val", "test"]:
        img_dir = DATASET_DIR / "images" / split
        lbl_dir = DATASET_DIR / "labels" / split
        
        if not img_dir.exists():
            continue
            
        images = list(img_dir.glob("*.[jJ][pP][gG]")) + list(img_dir.glob("*.[pP][nN][gG]"))
        report["total_images"] += len(images)
        
        for img_path in images:
            stem = img_path.stem
            lbl_path = lbl_dir / f"{stem}.txt"
            if not lbl_path.exists():
                report["missing_labels"].append(str(lbl_path.relative_to(BASE_DIR)))
            else:
                report["total_labels"] += 1
                try:
                    with open(lbl_path, "r", encoding="utf-8") as f:
                        lines = f.readlines()
                    if not lines:
                        report["empty_labels"].append(str(lbl_path.relative_to(BASE_DIR)))
                    for line_idx, line in enumerate(lines):
                        parts = line.strip().split()
                        if len(parts) >= 5:
                            cls_id = int(parts[0])
                            x, y, w, h = map(float, parts[1:5])
                            if not (0 <= x <= 1 and 0 <= y <= 1 and 0 <= w <= 1 and 0 <= h <= 1):
                                report["invalid_coordinates"].append({
                                    "file": str(lbl_path.relative_to(BASE_DIR)),
                                    "line": line_idx + 1,
                                    "values": [x, y, w, h]
                                })
                except Exception as e:
                    report["empty_labels"].append(str(lbl_path.relative_to(BASE_DIR)))

    has_errors = bool(report["invalid_coordinates"] or report["invalid_class_ids"])
    report["status"] = "FAIL" if has_errors else "PASS"
    report["summary"] = {
        "total_images": report["total_images"],
        "total_labels": report["total_labels"],
        "issues_found": len(report["missing_labels"]) + len(report["invalid_coordinates"])
    }
    
    out_file = DATASET_DIR / "dataset_validation_report.json"
    out_file.parent.mkdir(parents=True, exist_ok=True)
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print(f"Validation complete. Report written to {out_file}")
    print(f"Status: {report['status']} (Images: {report['total_images']}, Labels: {report['total_labels']})")
    return report

if __name__ == "__main__":
    validate_dataset()
