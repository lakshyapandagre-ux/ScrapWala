from fastapi import APIRouter, status
import uuid
from datetime import datetime, timezone

from ..models.schemas import SahayakLotCreateRequest, LotResponse
from ..services.valuation import calculate_valuation
from .lots import LOTS_DB, IDEMPOTENCY_CACHE

router = APIRouter(prefix="/api/sahayak", tags=["Sahayak"])

@router.post("/lots", response_model=LotResponse, status_code=status.HTTP_201_CREATED)
def create_lot_on_behalf_of_collector(payload: SahayakLotCreateRequest):
    # Rule 7: Idempotency check
    if payload.idempotency_key in IDEMPOTENCY_CACHE:
        return IDEMPOTENCY_CACHE[payload.idempotency_key]

    lot_id = str(uuid.uuid4())
    date_str = datetime.now(timezone.utc).strftime("%Y%m%d")
    lot_display_id = f"EW-SAH-{date_str}-{len(LOTS_DB) + 1:04d}"

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
        "created_at": created_at,
        "created_by_sahayak_id": payload.sahayak_id,
        "collector_phone": payload.collector_phone
    }

    LOTS_DB[lot_id] = lot_data
    IDEMPOTENCY_CACHE[payload.idempotency_key] = lot_data

    return lot_data
