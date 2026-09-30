import math
from typing import List, Dict, Any, Optional

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance in kilometers between two points."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

# Mock/demo authorized recyclers for instant local testing and fallback
DEMO_RECYCLERS = [
    {
        "recycler_id": "rec-001",
        "facility_name": "E-Parisaraa Clean Tech Pvt. Ltd.",
        "physical_address": "Plot 12, Pithampur Industrial Area, Sector 3, Indore, MP",
        "gps_lat": 22.6139,
        "gps_lng": 75.6822,
        "service_area": "Indore, Dewas, Dhar",
        "spcb_license_number": "MPPCB/E-WASTE/AUTH/2024/089",
        "authorization_status": "authorized",
        "pickup_availability": "scheduled",
        "rate_multipliers": {"PCBs": 1.05, "Batteries": 1.02, "Cables": 1.04}
    },
    {
        "recycler_id": "rec-002",
        "facility_name": "Moonstar Enterprises Clean Tech",
        "physical_address": "Sanwer Road Industrial Area, Sector B, Indore, MP",
        "gps_lat": 22.7533,
        "gps_lng": 75.8937,
        "service_area": "Indore Metro",
        "spcb_license_number": "MPPCB/E-WASTE/AUTH/2023/142",
        "authorization_status": "authorized",
        "pickup_availability": "on_request",
        "rate_multipliers": {"PCBs": 0.98, "Batteries": 1.05, "Cables": 0.95}
    },
    {
        "recycler_id": "rec-003",
        "facility_name": "Malwa Eco-Recyclers Hub",
        "physical_address": "Dewas Road, Ujjain Border, MP",
        "gps_lat": 23.1765,
        "gps_lng": 75.7885,
        "service_area": "Indore-Ujjain Corridor",
        "spcb_license_number": "MPPCB/E-WASTE/AUTH/2025/019",
        "authorization_status": "authorized",
        "pickup_availability": "by_appointment",
        "rate_multipliers": {"PCBs": 1.02, "Batteries": 0.96, "Cables": 1.01}
    }
]

def score_recycler(
    recycler: Dict[str, Any],
    collector_lat: Optional[float],
    collector_lng: Optional[float],
    category: str,
    benchmark_rate: float
) -> Dict[str, Any]:
    # 1. Rate score
    rate_mult = recycler.get("rate_multipliers", {}).get(category, 1.0)
    offered_rate = round(benchmark_rate * rate_mult, 2)
    # 100 if offered >= benchmark * 1.1, 50 if offered == benchmark * 0.9
    rate_score = max(0.0, min(100.0, (offered_rate / benchmark_rate) * 85.0))

    # 2. Distance score
    r_lat = recycler.get("gps_lat", 22.7196)
    r_lng = recycler.get("gps_lng", 75.8577)
    if collector_lat is not None and collector_lng is not None:
        dist_km = haversine_distance_km(collector_lat, collector_lng, r_lat, r_lng)
    else:
        dist_km = 12.5  # default estimate

    # Proximity decay: 100 at 0km, 50 at 25km, 0 at >=50km
    distance_score = max(0.0, min(100.0, 100.0 - (dist_km * 2.0)))

    # 3. Pickup score
    pickup_type = recycler.get("pickup_availability", "by_appointment")
    pickup_map = {
        "scheduled": 100.0,
        "on_request": 75.0,
        "by_appointment": 50.0
    }
    pickup_score = pickup_map.get(pickup_type, 50.0)

    # 4. Trust score (SPCB authorization + verification)
    is_auth = recycler.get("authorization_status") == "authorized"
    trust_score = 95.0 if is_auth else 30.0

    # Overall Suitability score (weights: Rate: 35%, Distance: 30%, Trust: 20%, Pickup: 15%)
    total_score = round(
        0.35 * rate_score +
        0.30 * distance_score +
        0.20 * trust_score +
        0.15 * pickup_score,
        1
    )

    return {
        "recycler_id": recycler.get("recycler_id"),
        "facility_name": recycler.get("facility_name"),
        "suitability_score": total_score,
        "breakdown": {
            "rate": round(rate_score, 1),
            "distance": round(distance_score, 1),
            "pickup": round(pickup_score, 1),
            "trust": round(trust_score, 1)
        },
        "distance_km": dist_km,
        "authorized": is_auth,
        "spcb_license_number": recycler.get("spcb_license_number"),
        "pickup_availability": pickup_type,
        "rate_offer_per_kg": offered_rate
    }

def rank_recyclers_for_lot(
    category: str,
    collector_lat: Optional[float] = None,
    collector_lng: Optional[float] = None,
    benchmark_rate: float = 178.0
) -> List[Dict[str, Any]]:
    scored = [
        score_recycler(r, collector_lat, collector_lng, category, benchmark_rate)
        for r in DEMO_RECYCLERS
    ]
    # Sort descending by suitability score
    scored.sort(key=lambda x: x["suitability_score"], reverse=True)
    return scored
