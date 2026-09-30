from fastapi import APIRouter, HTTPException, status
from typing import Dict, List, Optional
import uuid
import hashlib
import json
from datetime import datetime, timezone

from ..models.schemas import HandoverCreateRequest, HandoverResponse, TraceabilityEventResponse
from ..services.epr_calculator import calculate_epr_premium
from .lots import LOTS_DB

router = APIRouter(prefix="/api/handovers", tags=["Handovers"])

HANDOVERS_DB: Dict[str, Dict] = {}
HANDOVER_IDEMPOTENCY: Dict[str, Dict] = {}
TRACEABILITY_EVENTS: List[Dict] = []

def generate_event_hash(payload: Dict, previous_hash: Optional[str]) -> str:
    content = json.dumps(payload, sort_keys=True) + str(previous_hash or "genesis-block")
    return hashlib.sha256(content.encode("utf-8")).hexdigest()

@router.post("", response_model=HandoverResponse, status_code=status.HTTP_201_CREATED)
def create_handover(payload: HandoverCreateRequest):
    # Rule 7: Idempotency check
    if payload.idempotency_key in HANDOVER_IDEMPOTENCY:
        return HANDOVER_IDEMPOTENCY[payload.idempotency_key]

    lot = LOTS_DB.get(payload.lot_id)
    category = lot.get("material_category", "PCBs") if lot else "PCBs"

    # Server-side EPR premium calculation (Never trust client sent value!)
    epr_premium, total_payout = calculate_epr_premium(
        category=category,
        final_weight_kg=payload.final_weight,
        final_price=payload.final_price
    )

    handover_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()

    # Traceability hash-chain event (Rule 8: Append-only ledger)
    prev_hash = TRACEABILITY_EVENTS[-1]["payload_hash"] if TRACEABILITY_EVENTS else None
    event_payload = {
        "handover_id": handover_id,
        "lot_id": payload.lot_id,
        "recycler_id": payload.recycler_id,
        "final_weight": payload.final_weight,
        "final_price": payload.final_price,
        "epr_premium": epr_premium,
        "total_payout": total_payout,
        "gps_lat": payload.gps_lat,
        "gps_lng": payload.gps_lng,
        "timestamp": created_at
    }
    event_hash = generate_event_hash(event_payload, prev_hash)

    trace_event = {
        "event_id": str(uuid.uuid4()),
        "lot_id": payload.lot_id,
        "actor_role": "recycler",
        "event_type": "HANDOVER_CONFIRMED",
        "event_timestamp": created_at,
        "payload_hash": event_hash,
        "previous_event_hash": prev_hash
    }
    TRACEABILITY_EVENTS.append(trace_event)

    # Update lot status if lot exists
    if lot:
        lot["status"] = "handed_over"

    handover_data = {
        "handover_id": handover_id,
        "lot_id": payload.lot_id,
        "recycler_id": payload.recycler_id,
        "final_weight": payload.final_weight,
        "final_price": payload.final_price,
        "epr_premium": epr_premium,
        "total_payout": total_payout,
        "payment_mode": payload.payment_mode,
        "payment_status": "confirmed",
        "traceability_event_hash": event_hash,
        "gps_lat": payload.gps_lat,
        "gps_lng": payload.gps_lng,
        "created_at": created_at
    }

    HANDOVERS_DB[handover_id] = handover_data
    HANDOVER_IDEMPOTENCY[payload.idempotency_key] = handover_data

    return handover_data

@router.get("/traceability/{lot_id}", response_model=List[TraceabilityEventResponse])
def get_traceability_chain(lot_id: str):
    return [e for e in TRACEABILITY_EVENTS if e["lot_id"] == lot_id]
