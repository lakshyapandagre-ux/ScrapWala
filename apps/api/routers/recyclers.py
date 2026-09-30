from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from ..models.schemas import RecyclerMatchResponse
from ..services.matching import rank_recyclers_for_lot
from .lots import LOTS_DB

router = APIRouter(prefix="/api/recyclers", tags=["Recyclers"])

@router.get("/match", response_model=List[RecyclerMatchResponse])
def match_recyclers_for_lot(
    lot_id: Optional[str] = Query(None),
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    radius: Optional[float] = Query(None),
    category: Optional[str] = Query("PCBs")
):
    # Retrieve lot details if available
    lot = LOTS_DB.get(lot_id) if lot_id else None
    if lot:
        cat = lot.get("material_category", category or "PCBs")
        c_lat = lot.get("gps_lat", lat or 22.7196)
        c_lng = lot.get("gps_lng", lng or 75.8577)
        benchmark = lot.get("valuation", {}).get("market_rate_per_kg", 178.0)
    else:
        cat = category or "PCBs"
        c_lat = lat if lat is not None else 22.7196
        c_lng = lng if lng is not None else 75.8577
        benchmark = 178.0

    matches = rank_recyclers_for_lot(
        category=cat,
        collector_lat=c_lat,
        collector_lng=c_lng,
        benchmark_rate=benchmark
    )

    if radius is not None and radius > 0:
        filtered = [m for m in matches if m["distance_km"] <= radius]
        return filtered if filtered else matches

    return matches

@router.get("", response_model=List[RecyclerMatchResponse])
def get_all_recyclers():
    return rank_recyclers_for_lot(category="PCBs")
