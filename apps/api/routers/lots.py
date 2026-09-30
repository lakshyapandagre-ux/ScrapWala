from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone

from ..models.schemas import LotCreateRequest, LotResponse, ValuationResponse
from ..services.valuation import calculate_valuation

router = APIRouter(prefix="/api/lots", tags=["Lots"])

# In-memory store (mirrored with Supabase table in production)
LOTS_DB: Dict[str, Dict] = {}
IDEMPOTENCY_CACHE: Dict[str, Dict] = {}

@router.post("", response_model=LotResponse, status_code=status.HTTP_201_CREATED)
def create_lot(payload: LotCreateRequest):
    # Rule 7: Idempotency check
    if payload.idempotency_key in IDEMPOTENCY_CACHE:
        existing_lot = IDEMPOTENCY_CACHE[payload.idempotency_key]
        return existing_lot

    lot_id = str(uuid.uuid4())
    date_str = datetime.now(timezone.utc).strftime("%Y%m%d")
    lot_display_id = f"EW-IND-{date_str}-{len(LOTS_DB) + 1:04d}"

    # Calculate valuation and Value X-ray
    valuation_data = calculate_valuation(
        category=payload.material_category,
        weight_kg=payload.approximate_weight
    )

    created_at = datetime.now(timezone.utc).isoformat()

    lot_data = {
        "lot_id": lot_id,
        "lot_display_id": lot_display_id,
        "collector_id": payload.collector_id,
        "material_category": payload.material_category,
        "approximate_weight": payload.approximate_weight,
        "unit": payload.unit,
        "status": "draft",
        "gps_lat": payload.gps_lat,
        "gps_lng": payload.gps_lng,
        "photos": payload.photos,
        "valuation": valuation_data,
        "idempotency_key": payload.idempotency_key,
        "created_at": created_at
    }

    LOTS_DB[lot_id] = lot_data
    IDEMPOTENCY_CACHE[payload.idempotency_key] = lot_data

    return lot_data

@router.get("/{lot_id}", response_model=LotResponse)
def get_lot(lot_id: str):
    if lot_id not in LOTS_DB:
        raise HTTPException(status_code=404, detail="Lot not found")
    return LOTS_DB[lot_id]

@router.get("", response_model=List[LotResponse])
def list_lots(collector_id: Optional[str] = Query(None)):
    if collector_id:
        return [l for l in LOTS_DB.values() if l["collector_id"] == collector_id]
    return list(LOTS_DB.values())
