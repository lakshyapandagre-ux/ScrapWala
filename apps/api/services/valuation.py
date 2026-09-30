from typing import Dict, Any, Tuple
from datetime import datetime, timezone

# Reference compositions per kg of material
DEFAULT_COMPOSITIONS: Dict[str, Dict[str, Any]] = {
    "PCBs": {
        "copper_g": 200.0,
        "gold_mg": 30.0,
        "silver_g": 1.0,
        "palladium_mg": 10.0,
        "critical_minerals_detected": ["Copper (तांबा)", "Gold (सोना)", "Silver (चांदी)", "Palladium (पैलेडियम)"],
        "hazardous_components": ["Lead solder", "Brominated flame retardants"]
    },
    "Cables": {
        "copper_g": 450.0,
        "aluminum_g": 100.0,
        "pvc_g": 400.0,
        "critical_minerals_detected": ["Copper (तांबा)", "Aluminum (एल्युमिनियम)"],
        "hazardous_components": ["PVC halogen plastics"]
    },
    "Batteries": {
        "lithium_g": 30.0,
        "cobalt_g": 150.0,
        "nickel_g": 100.0,
        "graphite_g": 120.0,
        "critical_minerals_detected": ["Lithium (लिथियम)", "Cobalt (कोबाल्ट)", "Nickel (निकल)"],
        "hazardous_components": ["Corrosive electrolyte", "Flammable lithium salts"]
    },
    "CRT Monitors": {
        "lead_glass_g": 550.0,
        "copper_g": 50.0,
        "ferrous_metals_g": 150.0,
        "critical_minerals_detected": ["Copper (तांबा)"],
        "hazardous_components": ["Lead oxide funnel glass (toxic)"]
    },
    "LCD Panels": {
        "indium_mg": 50.0,
        "glass_g": 700.0,
        "aluminum_g": 150.0,
        "critical_minerals_detected": ["Indium (इंडियम)", "Aluminum (एल्युमिनियम)"],
        "hazardous_components": ["Mercury backlights (older models)"]
    },
    "Electric Motors": {
        "copper_winding_g": 180.0,
        "steel_iron_g": 720.0,
        "aluminum_g": 80.0,
        "critical_minerals_detected": ["Copper (तांबा)", "Steel (लोहा)"],
        "hazardous_components": ["Insulating varnish"]
    },
    "Mixed Plastics": {
        "abs_g": 600.0,
        "polycarbonate_g": 300.0,
        "critical_minerals_detected": [],
        "hazardous_components": ["Flame retardant additives"]
    }
}

DEFAULT_BENCHMARK_RATES: Dict[str, Dict[str, float]] = {
    "PCBs": {"rate": 178.0, "low": 162.0, "high": 199.0},
    "Cables": {"rate": 140.0, "low": 125.0, "high": 155.0},
    "Batteries": {"rate": 110.0, "low": 95.0, "high": 130.0},
    "CRT Monitors": {"rate": 18.0, "low": 12.0, "high": 24.0},
    "LCD Panels": {"rate": 45.0, "low": 35.0, "high": 55.0},
    "Electric Motors": {"rate": 65.0, "low": 55.0, "high": 75.0},
    "Mixed Plastics": {"rate": 15.0, "low": 10.0, "high": 20.0},
}

def calculate_valuation(
    category: str,
    weight_kg: float,
    locality: str = "Indore"
) -> Dict[str, Any]:
    """
    Computes transparent valuation adhering to the No Fake Precision rule:
    Always returns a range, confidence, and data freshness timestamp.
    """
    benchmarks = DEFAULT_BENCHMARK_RATES.get(category, {"rate": 50.0, "low": 40.0, "high": 60.0})
    rate_per_kg = benchmarks["rate"]
    low_rate = benchmarks["low"]
    high_rate = benchmarks["high"]

    estimated_value = round(rate_per_kg * weight_kg, 2)
    low_total = round(low_rate * weight_kg, 2)
    high_total = round(high_rate * weight_kg, 2)

    # Calculate Value X-ray estimated mineral recovery for this lot weight
    base_comp = DEFAULT_COMPOSITIONS.get(category, {})
    scaled_composition: Dict[str, Any] = {}
    for k, v in base_comp.items():
        if isinstance(v, (int, float)):
            scaled_composition[k] = round(v * weight_kg, 2)
        else:
            scaled_composition[k] = v

    return {
        "estimated_value": estimated_value,
        "market_rate_per_kg": rate_per_kg,
        "market_range": {
            "low": low_total,
            "high": high_total
        },
        "composition_estimate": scaled_composition,
        "confidence": "medium",
        "data_freshness": datetime.now(timezone.utc).strftime("%Y-%m-%dT00:00:00Z")
    }
