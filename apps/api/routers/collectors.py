from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

router = APIRouter(prefix="/api/collectors", tags=["Collectors"])

COLLECTORS_DB: Dict[str, Dict[str, Any]] = {
    "c1111111-1111-1111-1111-111111111111": {
        "collector_id": "c1111111-1111-1111-1111-111111111111",
        "full_name": "Lakshya (कबाड़ी मित्र)",
        "operating_city": "Indore",
        "gps_lat": 22.7196,
        "gps_lng": 75.8577,
        "rating": 4.8,
        "phone": "+91 98765 43210",
    }
}

class CollectorProfileUpdate(BaseModel):
    gps_lat: Optional[float] = None
    gps_lng: Optional[float] = None
    operating_city: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None

def get_collector_profile(collector_id: str) -> Optional[Dict[str, Any]]:
    return COLLECTORS_DB.get(collector_id)

@router.get("/{collector_id}")
def get_collector(collector_id: str):
    profile = COLLECTORS_DB.get(collector_id)
    if not profile:
        # Return sensible default profile for new or demo collector
        return {
            "collector_id": collector_id,
            "full_name": "कबाड़ी साथी",
            "operating_city": "Indore",
            "gps_lat": 22.7196,
            "gps_lng": 75.8577,
            "rating": 4.8
        }
    return profile

@router.patch("/{collector_id}")
def update_collector_profile(collector_id: str, payload: CollectorProfileUpdate):
    profile = COLLECTORS_DB.setdefault(collector_id, {
        "collector_id": collector_id,
        "full_name": "कबाड़ी साथी",
        "operating_city": "Indore",
        "gps_lat": 22.7196,
        "gps_lng": 75.8577,
        "rating": 4.8
    })

    if payload.gps_lat is not None:
        profile["gps_lat"] = payload.gps_lat
    if payload.gps_lng is not None:
        profile["gps_lng"] = payload.gps_lng
    if payload.operating_city is not None:
        profile["operating_city"] = payload.operating_city
    if payload.full_name is not None:
        profile["full_name"] = payload.full_name
    if payload.phone is not None:
        profile["phone"] = payload.phone

    return {
        "status": "success",
        "message": "Collector profile location updated successfully",
        "profile": profile
    }
