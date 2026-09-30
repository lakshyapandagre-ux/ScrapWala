"""
ScrapWala AI Pipeline - Model Benchmark & Evaluation
Measures model file size, parameter count, input resolution, inference latency,
and validation metrics. Saves report to benchmark_report.json.
"""

import os
import sys
import json
import time
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "apps" / "web" / "public" / "models" / "yolo11n_waste.onnx"
CONFIG_PATH = BASE_DIR / "apps" / "web" / "public" / "models" / "model_config.json"

def run_benchmark():
    report = {
        "model_name": "SUHAN-I/YOLO11 (YOLO11n Baseline)",
        "architecture": "YOLO11n (Nano)",
        "model_file": str(MODEL_PATH.name),
        "model_size_mb": "NOT MEASURED",
        "parameter_count": "2.6M (YOLO11n standard)",
        "input_resolution": "640x640",
        "precision": "NOT MEASURED",
        "recall": "NOT MEASURED",
        "mAP50": "NOT MEASURED",
        "mAP50_95": "NOT MEASURED",
        "per_class_metrics": {
            "cardboard": "NOT MEASURED",
            "glass": "NOT MEASURED",
            "metal": "NOT MEASURED",
            "paper": "NOT MEASURED",
            "plastic": "NOT MEASURED",
            "trash": "NOT MEASURED"
        },
        "average_inference_time_ms": "NOT MEASURED",
        "hardware_environment": "CPU / WebAssembly SIMD Browser runtime"
    }
    
    if MODEL_PATH.exists():
        size_bytes = MODEL_PATH.stat().st_size
        report["model_size_mb"] = f"{size_bytes / (1024 * 1024):.2f} MB"
        
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            cfg = json.load(f)
            report["input_resolution"] = f"{cfg.get('input_width', 640)}x{cfg.get('input_height', 640)}"
            report["classes"] = cfg.get("classes", [])

    out_path = BASE_DIR / "benchmark_report.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
        
    print("=" * 60)
    print("ScrapWala Model Benchmark Report")
    print(f"Model: {report['model_name']}")
    print(f"Size: {report['model_size_mb']}")
    print(f"Resolution: {report['input_resolution']}")
    print(f"Inference Latency: {report['average_inference_time_ms']}")
    print(f"Report saved to: {out_path}")
    print("=" * 60)
    return report

if __name__ == "__main__":
    run_benchmark()
