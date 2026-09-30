import pytest
from fastapi.testclient import TestClient
from apps.api.main import app

client = TestClient(app)

def test_root_health():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_create_lot_and_idempotency():
    idempotency_key = "test-idemp-001"
    payload = {
        "collector_id": "c1111111-1111-1111-1111-111111111111",
        "material_category": "PCBs",
        "approximate_weight": 2.5,
        "unit": "kg",
        "gps_lat": 22.7196,
        "gps_lng": 75.8577,
        "photos": ["demo_pcb.jpg"],
        "idempotency_key": idempotency_key
    }
    
    # 1. First creation call
    res1 = client.post("/api/lots", json=payload)
    assert res1.status_code == 201
    data1 = res1.json()
    assert "lot_id" in data1
    assert data1["lot_display_id"].startswith("EW-IND-")
    assert data1["valuation"]["market_rate_per_kg"] == 178.0
    assert data1["valuation"]["estimated_value"] == 445.0  # 2.5 * 178
    assert "copper_g" in data1["valuation"]["composition_estimate"]

    # 2. Duplicate call with same idempotency_key must return identical lot_id (no-op/cached)
    res2 = client.post("/api/lots", json=payload)
    assert res2.status_code in [200, 201]
    data2 = res2.json()
    assert data2["lot_id"] == data1["lot_id"]
    assert data2["lot_display_id"] == data1["lot_display_id"]

def test_recycler_matching():
    # Fetch recyclers for a lot
    res = client.get("/api/recyclers/match?lot_id=dummy-lot-id")
    assert res.status_code == 200
    matches = res.json()
    assert len(matches) > 0
    top = matches[0]
    assert "suitability_score" in top
    assert "breakdown" in top
    assert "rate" in top["breakdown"]
    assert "distance" in top["breakdown"]
    assert "pickup" in top["breakdown"]
    assert "trust" in top["breakdown"]

def test_handover_epr_and_traceability():
    # Handover test
    idempotency_key = "handover-idemp-001"
    payload = {
        "lot_id": "test-lot-99",
        "recycler_id": "rec-001",
        "final_weight": 2.0,
        "final_price": 356.0,
        "payment_mode": "cash",
        "idempotency_key": idempotency_key
    }
    res = client.post("/api/handovers", json=payload)
    assert res.status_code == 201
    data = res.json()
    # For PCBs: 2.0 kg * 75 INR/kg * 30% = 45 INR premium
    assert data["epr_premium"] == 45.0
    assert data["total_payout"] == 401.0
    assert len(data["traceability_event_hash"]) == 64  # sha256 length

def test_admin_minerals_and_cartel():
    res_minerals = client.get("/api/admin/minerals-dashboard?district=Indore")
    assert res_minerals.status_code == 200
    data_min = res_minerals.json()
    assert len(data_min["minerals"]) > 0

    res_cartel = client.get("/api/admin/cartel-flags")
    assert res_cartel.status_code == 200
    flags = res_cartel.json()
    assert isinstance(flags, list)

def test_ai_classification_confidence_threshold():
    # High confidence case
    res1 = client.post("/api/classify", json={"image_name_or_hints": "motherboard_pcb.jpg"})
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["category"] == "PCBs"
    assert data1["requires_manual_selection"] is False

    # Low confidence case (< 0.60 threshold)
    res2 = client.post("/api/classify", json={"image_name_or_hints": "unknown_rusty_scrap.jpg", "confidence_override": 0.45})
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["requires_manual_selection"] is True

def test_location_reverse_and_collector_profile():
    # Test reverse geocode
    res_loc = client.get("/api/location/reverse?lat=22.7196&lng=75.8577")
    assert res_loc.status_code == 200
    loc_data = res_loc.json()
    assert "locality" in loc_data
    assert "district" in loc_data

    # Test update collector profile with GPS
    col_id = "c1111111-1111-1111-1111-111111111111"
    patch_res = client.patch(f"/api/collectors/{col_id}", json={
        "gps_lat": 22.7196,
        "gps_lng": 75.8577,
        "operating_city": "Indore, MP"
    })
    assert patch_res.status_code == 200
    assert patch_res.json()["profile"]["operating_city"] == "Indore, MP"

    # Test recycler matching with coordinates & radius
    res_rec = client.get("/api/recyclers/match?lat=22.7196&lng=75.8577&radius=50")
    assert res_rec.status_code == 200
    matches = res_rec.json()
    assert len(matches) > 0
    assert matches[0]["distance_km"] <= 50

