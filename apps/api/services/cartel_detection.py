from typing import List, Dict, Any
from datetime import datetime, timezone
import numpy as np
from .valuation import DEFAULT_BENCHMARK_RATES

# Mock in-memory price observation store for anomaly detection
PRICE_HISTORY: List[Dict[str, Any]] = [
    {"material_category": "PCBs", "locality": "Indore - Zone 1", "price_per_kg": 140.0, "source": "recycler_quote"},
    {"material_category": "PCBs", "locality": "Indore - Zone 1", "price_per_kg": 142.0, "source": "recycler_quote"},
    {"material_category": "PCBs", "locality": "Indore - Zone 1", "price_per_kg": 138.0, "source": "recycler_quote"},
    {"material_category": "Batteries", "locality": "Bhopal Industrial", "price_per_kg": 85.0, "source": "recycler_quote"},
    {"material_category": "Cables", "locality": "Indore - Zone 2", "price_per_kg": 139.0, "source": "recycler_quote"},
]

def scan_cartel_anomalies() -> List[Dict[str, Any]]:
    """
    Identifies localities where average offered price deviates abnormally (>15% below benchmark),
    indicating potential buyer cartel or unfair depression of collector payouts.
    """
    flags = []
    
    # Group by category and locality
    grouped: Dict[tuple, List[float]] = {}
    for obs in PRICE_HISTORY:
        key = (obs["material_category"], obs["locality"])
        grouped.setdefault(key, []).append(obs["price_per_kg"])

    for (cat, locality), prices in grouped.items():
        bench = DEFAULT_BENCHMARK_RATES.get(cat, {}).get("rate", 100.0)
        avg_price = float(np.mean(prices))
        deviation_pct = round(((bench - avg_price) / bench) * 100.0, 1)

        # If price is artificially suppressed by > 15%
        if deviation_pct >= 15.0:
            flags.append({
                "flag_id": f"flag-{cat.lower()}-{locality.replace(' ', '-').lower()}",
                "material_category": cat,
                "locality": locality,
                "avg_price": round(avg_price, 2),
                "benchmark_price": bench,
                "deviation_pct": deviation_pct,
                "flagged_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT08:00:00Z"),
                "status": "open"
            })

    return flags
