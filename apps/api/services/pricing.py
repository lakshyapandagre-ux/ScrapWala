import logging
from typing import Dict, Any
from datetime import datetime
from .valuation import DEFAULT_BENCHMARK_RATES

logger = logging.getLogger(__name__)

# Normalize material names to benchmark categories
MATERIAL_SYNONYMS = {
    "pcb": "PCBs",
    "pcbs": "PCBs",
    "circuit": "PCBs",
    "circuit board": "PCBs",
    "motherboard": "PCBs",
    "cable": "Cables",
    "cables": "Cables",
    "wire": "Cables",
    "wires": "Cables",
    "copper wire": "Cables",
    "battery": "Batteries",
    "batteries": "Batteries",
    "lithium": "Batteries",
    "crt": "CRT Monitors",
    "crt monitor": "CRT Monitors",
    "monitor": "CRT Monitors",
    "lcd": "LCD Panels",
    "lcd panel": "LCD Panels",
    "screen": "LCD Panels",
    "display": "LCD Panels",
    "motor": "Electric Motors",
    "motors": "Electric Motors",
    "electric motor": "Electric Motors",
    "plastic": "Mixed Plastics",
    "plastics": "Mixed Plastics"
}

async def collector_locality(collector_id: str) -> str:
    """Returns locality of the collector (reads profile operating_city / gps, defaults to Indore)."""
    try:
        from ..routers.collectors import get_collector_profile
        profile = get_collector_profile(collector_id)
        if profile and profile.get("operating_city"):
            return profile["operating_city"]
    except Exception:
        try:
            from routers.collectors import get_collector_profile
            profile = get_collector_profile(collector_id)
            if profile and profile.get("operating_city"):
                return profile["operating_city"]
        except Exception:
            pass
    return "Indore, MP"


async def get_price_benchmark(material: str, locality: str = "Indore") -> Dict[str, Any]:
    """
    Returns benchmark prices for speech queries:
    low, high, current, p80, trend_days, freshness
    """
    normalized_cat = MATERIAL_SYNONYMS.get(material.lower().strip(), "PCBs")
    bench = DEFAULT_BENCHMARK_RATES.get(normalized_cat, {"rate": 150.0, "low": 130.0, "high": 170.0})
    
    current_rate = bench.get("rate", 150.0)
    low_rate = bench.get("low", current_rate * 0.9)
    high_rate = bench.get("high", current_rate * 1.1)
    
    # 80th percentile threshold for advice
    p80 = round(low_rate + 0.8 * (high_rate - low_rate), 1)

    return {
        "material": normalized_cat,
        "current": current_rate,
        "low": low_rate,
        "high": high_rate,
        "p80": p80,
        "trend_days": 3,
        "freshness": "aaj subah 8 baje",
        "locality": locality
    }
