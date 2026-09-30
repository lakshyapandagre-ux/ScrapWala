from fastapi import APIRouter, Query
from typing import List, Optional

from ..models.schemas import MineralsDashboardResponse, CartelFlagResponse, MineralAggregateItem
from ..services.cartel_detection import scan_cartel_anomalies

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/minerals-dashboard", response_model=MineralsDashboardResponse)
def get_minerals_dashboard(
    district: str = Query(default="Indore"),
    month: str = Query(default="2026-09")
):
    # Aggregated mineral recovery data for Ministry of Mines visibility
    minerals_data = [
        MineralAggregateItem(
            mineral_name="Copper (तांबा)",
            total_grams_recovered=48200.0,
            estimated_economic_value_inr=38560.0,
            purity_grade="99.2% Pure Cathode"
        ),
        MineralAggregateItem(
            mineral_name="Gold (सोना)",
            total_grams_recovered=14.5,
            estimated_economic_value_inr=101500.0,
            purity_grade="99.9% 24K bullion"
        ),
        MineralAggregateItem(
            mineral_name="Silver (चांदी)",
            total_grams_recovered=78.2,
            estimated_economic_value_inr=6256.0,
            purity_grade="99.5% Industrial"
        ),
        MineralAggregateItem(
            mineral_name="Lithium (लिथियम)",
            total_grams_recovered=12400.0,
            estimated_economic_value_inr=24800.0,
            purity_grade="Battery Grade Carbonate"
        ),
        MineralAggregateItem(
            mineral_name="Palladium (पैलेडियम)",
            total_grams_recovered=2.8,
            estimated_economic_value_inr=11200.0,
            purity_grade="Catalytic Grade"
        )
    ]

    environmental_impact = {
        "co2_prevented_kg": 1840.5,
        "toxic_lead_diverted_kg": 64.2,
        "informal_backyard_burning_prevented_hours": 120.0
    }

    return MineralsDashboardResponse(
        district=district,
        period=month,
        total_lots_processed=342,
        total_weight_kg=1254.0,
        minerals=minerals_data,
        environmental_impact=environmental_impact
    )

@router.get("/cartel-flags", response_model=List[CartelFlagResponse])
def get_cartel_flags(status: Optional[str] = Query(default="open")):
    flags = scan_cartel_anomalies()
    if status:
        return [f for f in flags if f["status"] == status]
    return flags
