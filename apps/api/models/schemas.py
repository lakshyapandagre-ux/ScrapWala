from typing import List, Optional, Dict, Any, Literal
from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime

# ==================== COMMON ====================

class ConfidenceLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class PaymentMode(str, Enum):
    CASH = "cash"
    UPI = "upi"
    PENDING = "pending"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PAID = "paid"

# ==================== LOT SCHEMAS ====================

class LotCreateRequest(BaseModel):
    collector_id: str = Field(..., description="UUID of collector")
    material_category: str = Field(..., description="Category like PCBs, Cables, Batteries, etc.")
    approximate_weight: float = Field(..., gt=0, description="Approximate weight in specified unit")
    unit: str = Field(default="kg")
    gps_lat: Optional[float] = None
    gps_lng: Optional[float] = None
    photos: List[str] = Field(default_factory=list)
    idempotency_key: str = Field(..., description="Unique client generated UUID")

class SahayakLotCreateRequest(LotCreateRequest):
    sahayak_id: str = Field(..., description="UUID of Sahayak")
    collector_phone: Optional[str] = None

class MarketRange(BaseModel):
    low: float
    high: float

class ValuationResponse(BaseModel):
    estimated_value: float
    market_rate_per_kg: float
    market_range: MarketRange
    composition_estimate: Dict[str, Any]
    confidence: Literal["low", "medium", "high"]
    data_freshness: str

class LotResponse(BaseModel):
    lot_id: str
    lot_display_id: str
    collector_id: str
    material_category: str
    approximate_weight: float
    unit: str
    status: str
    gps_lat: Optional[float] = None
    gps_lng: Optional[float] = None
    photos: List[str] = Field(default_factory=list)
    valuation: ValuationResponse
    created_at: str

# ==================== RECYCLER & MATCHING SCHEMAS ====================

class ScoreBreakdown(BaseModel):
    rate: float = Field(..., description="0-100 score based on offered rate vs benchmark")
    distance: float = Field(..., description="0-100 score based on proximity (closer is higher)")
    pickup: float = Field(..., description="0-100 score based on pickup availability")
    trust: float = Field(..., description="0-100 score based on SPCB authorization & track record")

class RecyclerMatchResponse(BaseModel):
    recycler_id: str
    facility_name: str
    suitability_score: float
    breakdown: ScoreBreakdown
    distance_km: float
    authorized: bool
    spcb_license_number: Optional[str] = None
    pickup_availability: Optional[str] = None
    rate_offer_per_kg: Optional[float] = None

# ==================== HANDOVER SCHEMAS ====================

class HandoverCreateRequest(BaseModel):
    lot_id: str
    recycler_id: str
    final_weight: float = Field(..., gt=0)
    final_price: float = Field(..., gt=0)
    payment_mode: Literal["cash", "upi", "pending"] = "cash"
    idempotency_key: str
    gps_lat: Optional[float] = None
    gps_lng: Optional[float] = None

class HandoverResponse(BaseModel):
    handover_id: str
    lot_id: str
    recycler_id: str
    final_weight: float
    final_price: float
    epr_premium: float
    total_payout: float
    payment_mode: str
    payment_status: str
    traceability_event_hash: str
    created_at: str
    gps_lat: Optional[float] = None
    gps_lng: Optional[float] = None

# ==================== TRACEABILITY SCHEMAS ====================

class TraceabilityEventResponse(BaseModel):
    event_id: str
    lot_id: str
    actor_role: str
    event_type: str
    event_timestamp: str
    payload_hash: str
    previous_event_hash: Optional[str] = None

# ==================== ADMIN & CARTEL SCHEMAS ====================

class CartelFlagResponse(BaseModel):
    flag_id: str
    material_category: str
    locality: str
    avg_price: float
    benchmark_price: float
    deviation_pct: float
    flagged_at: str
    status: Literal["open", "reviewed", "dismissed"]

class MineralAggregateItem(BaseModel):
    mineral_name: str
    total_grams_recovered: float
    estimated_economic_value_inr: float
    purity_grade: str

class MineralsDashboardResponse(BaseModel):
    district: str
    period: str
    total_lots_processed: int
    total_weight_kg: float
    minerals: List[MineralAggregateItem]
    environmental_impact: Dict[str, Any]

# ==================== CLASSIFICATION SCHEMAS ====================

class ClassificationResponse(BaseModel):
    category: str
    confidence: float
    requires_manual_selection: bool
    suggested_categories: List[str]
