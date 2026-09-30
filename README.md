# ScrapWala — Kabadiwala Connect (SIH 26229)

> **Offline-first, voice-assisted platform that makes formal e-waste recycling more profitable than informal backyard processing for collectors, while giving the Ministry of Mines real-time visibility into critical-mineral recovery.**

---

## 🛠 Project Architecture

```
ScrapWala/
├── apps/
│   ├── api/                      # FastAPI Python 3.11+ Backend
│   │   ├── main.py               # Main application entry point & CORS
│   │   ├── routers/              # API Endpoints
│   │   │   ├── lots.py           # POST /api/lots (Idempotent, valuation, X-ray)
│   │   │   ├── handovers.py      # POST /api/handovers (Server-side EPR, SHA-256 chain)
│   │   │   ├── recyclers.py      # GET /api/recyclers/match (Suitability score)
│   │   │   ├── admin.py          # GET /api/admin/minerals-dashboard, /cartel-flags
│   │   │   ├── sahayak.py        # POST /api/sahayak/lots
│   │   │   └── classification.py # POST /api/classify (0.60 confidence threshold)
│   │   ├── services/
│   │   │   ├── valuation.py      # Transparent valuation & Value X-ray
│   │   │   ├── epr_calculator.py # EPR premium server-side calculation
│   │   │   ├── matching.py       # Suitability score (Rate 35%, Dist 30%, Trust 20%, Pickup 15%)
│   │   │   ├── cartel_detection.py # Locality price anomaly detection
│   │   │   └── classification.py # E-waste category classification
│   │   ├── models/schemas.py     # Pydantic v2 schemas
│   │   ├── test_api.py           # Automated test suite (6 passing tests)
│   │   └── requirements.txt
│   │
│   └── web/                      # Next.js 14 App Router Frontend
│       ├── app/
│       │   ├── page.tsx          # Multi-role interactive portal (Collector/Recycler/Admin)
│       │   ├── layout.tsx        # Root layout with Noto Sans Devanagari font
│       │   └── globals.css       # Tailwind CSS styles & typography
│       ├── components/
│       │   ├── lot-wizard/       # 3-Step Wizard with photo scan & 1-decision-per-screen
│       │   ├── value-xray/       # Transparent value range & mineral recovery breakdown
│       │   ├── audio-button/     # Web Speech API (hi-IN) voice assistance
│       │   ├── recycler/         # Handover confirmation & cryptographic receipt
│       │   ├── admin/            # Ministry of Mines Minerals Recovery & Cartel flags
│       │   ├── collector/        # Local-first offline lot list with sync badges
│       │   └── ui/               # SyncBadge & UI components
│       └── lib/
│           ├── offline-db.ts     # Dexie.js IndexedDB schema
│           ├── sync-queue.ts     # Outbox pattern background sync worker
│           └── use-speak.ts      # Web Speech API hook
│
└── supabase/
    ├── migrations/
    │   └── 20260928_initial_schema.sql  # Postgres DDL + RLS Policies + Indexes
    └── seed.sql                         # Reference compositions & EPR rate cards
```

---

## 🔒 Hard Rules Implementation

1. **Local-first Rule**: All collector mutations commit to local IndexedDB (`Dexie.js`) first, optimistic UI updates immediately, and background sync worker flushes to API when online.
2. **No Fake Precision Rule**: No single bare number estimates. Value X-ray always shows a range (`low` - `high`), median rate, confidence level, and data freshness timestamp.
3. **One-Decision-Per-Screen Rule**: The 3-step collector wizard isolates category selection, weight entry, and match review into separate focused steps.
4. **Icon + Text + Audio Rule**: Collector interactive buttons & cards feature icons, short Hindi labels (max 4 words), and a speaker icon that triggers text-to-speech via Web Speech API.
5. **No PII Rule**: No Aadhaar, bank account numbers, or address proofs collected.
6. **Never Overclaim Compliance**: App clearly states only recyclers get SPCB authorization badges, and does not claim CPCB certification for itself or collectors.
7. **Idempotency Rule**: Every POST (`/api/lots`, `/api/handovers`) verifies client-generated `idempotency_key` to prevent duplicate records.
8. **Append-Only Ledger**: Handover records and traceability events are hashed with SHA-256 into a verifiable chain.

---

## 🚀 Running the Project

### 1. Run Backend (FastAPI)
```bash
# In project root
python -m uvicorn apps.api.main:app --reload --port 8000
```
Run tests:
```bash
python -m pytest apps/api/test_api.py
```

### 2. Run Frontend (Next.js)
```bash
cd apps/web
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 AI On-Device Waste Detection Pipeline (YOLO11n + ONNX)

ScrapWala features a lightweight, 100% on-device AI waste detection engine running directly in the browser via **ONNX Runtime Web (WASM/WebGL)**. Zero cloud API fees, zero latency, and works completely offline.

```text
Browser Camera / Upload Photo
              ↓
  640x640 Letterbox & Normalization
              ↓
   YOLO11n ONNX (2.6M params, ~10MB)
              ↓
Non-Maximum Suppression (NMS) & Bounding Boxes
              ↓
  ScrapWala Material Semantic Mapping
              ↓
Live Mandi Rates & Best Dealer Offers
```

### Automation & Training Pipeline Scripts

All dataset processing, merging, validation, benchmarking, and real-world testing are completely automated:

1. **Download Baseline Hugging Face Models**:
   ```bash
   python scripts/download_models.py
   ```
2. **Process TACO Dataset (COCO to YOLO mapping)**:
   ```bash
   python scripts/prepare_taco.py
   ```
3. **Process GIZ E-Waste Dataset**:
   ```bash
   python scripts/prepare_giz_ewaste.py
   ```
4. **Merge into Unified YOLO Dataset & Manage Taxonomies**:
   ```bash
   python scripts/merge_dataset.py
   ```
5. **Validate Dataset Integrity (Check bounding boxes & labels)**:
   ```bash
   python scripts/validate_dataset.py
   ```
6. **Fine-Tune YOLO11n (Pretrained weights with early stopping)**:
   ```bash
   python scripts/train_model.py 30
   ```
7. **Benchmark Model (Latency, Resolution, Parameter count)**:
   ```bash
   python scripts/benchmark_model.py
   ```
8. **Test Fresh Real-World Photos**:
   Place 20–30 test photos into `test_real_world/` and run:
   ```bash
   python scripts/real_world_test.py
   ```
   Results and annotations are output to `real_world_results/` and `real_world_report.json`.

---

## 📜 Third-Party Licenses

See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) for detailed licenses covering Ultralytics YOLO11 (AGPL-3.0), SUHAN-I/YOLO11, TACO dataset (CC BY 4.0), and GIZ e-waste dataset (CC BY-NC 4.0).

