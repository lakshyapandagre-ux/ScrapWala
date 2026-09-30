# Third-Party Licenses & Dataset Attributions

This document records all third-party models, datasets, and dependencies utilized in ScrapWala's AI Waste Detection system.

---

## 1. AI Models

### 1.1 Ultralytics YOLO11n Base Architecture
- **Origin**: Ultralytics Inc. (https://github.com/ultralytics/ultralytics)
- **License**: AGPL-3.0 (Affero General Public License v3.0) / Commercial Enterprise License
- **Attribution**: Copyright © 2024 Ultralytics Inc.
- **Commercial Restrictions**: AGPL-3.0 requires open-sourcing derivative software if modified and distributed or served over a network, unless an Ultralytics enterprise commercial license is acquired.
- **Reference**: https://www.ultralytics.com/license

### 1.2 SUHAN-I/YOLO11 (Baseline Waste Model)
- **Repository**: https://huggingface.co/SUHAN-I/YOLO11
- **Base Architecture**: YOLO11n (Nano)
- **Detected Classes**: `cardboard`, `glass`, `metal`, `paper`, `plastic`, `trash`
- **Model Weight Files**: `yolo11_trash_detection.pt` (~5.5MB), `yolo11_trash_detection.onnx` (~10MB)
- **License**: Inherits AGPL-3.0 / Open-Source research license.

### 1.3 Jeremy341/MIRA-AI (Edge Waste Model)
- **Repository**: https://huggingface.co/Jeremy341/MIRA-AI
- **Project**: Jugend Forscht 2027 Waste Sorting Robot
- **License**: MIT License
- **Commercial Use**: Permitted with copyright and permission notice.

---

## 2. Datasets

### 2.1 TACO (Trash Annotations in Context)
- **Official Repository**: https://github.com/pedropro/TACO
- **Hugging Face / Mirror**: `koria/taco`, `pictograph/taco`
- **Format**: COCO Object Detection / Segmentations
- **License**: Creative Commons Attribution 4.0 International (CC BY 4.0)
- **Attribution Requirement**: You must give appropriate credit, provide a link to the license, and indicate if changes were made:
  > Pedro F. Proença and Pedro Simões, "TACO: Trash Annotations in Context for Litter Detection", arXiv preprint arXiv:2003.06975, 2020.
- **Commercial Use**: Permitted under CC BY 4.0 terms with proper attribution.

### 2.2 GIZ E-Waste Dataset
- **Repository**: https://huggingface.co/datasets/GIZ/e-waste-dataset-COCO-labels
- **Organization**: Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ) GmbH
- **Content**: Scrapyard electronic waste imagery (monitors, TV, cooling appliances, electronics).
- **License**: Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0) / Open Access for Development Research
- **Commercial Restrictions**: Non-commercial research / public good use. Production commercial exploitation requires specific bilateral licensing from the data curators.

---

## 3. Client-Side Runtimes

### 3.1 ONNX Runtime Web
- **Repository**: https://github.com/microsoft/onnxruntime
- **License**: MIT License
- **Vendor**: Microsoft Corporation
- **Commercial Use**: Freely usable in commercial and open-source applications without royalty.
