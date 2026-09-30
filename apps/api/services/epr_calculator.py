from typing import Dict, Any, Tuple

# Default EPR rates in INR per kg and mandated passthrough percentage to collector
DEFAULT_EPR_RATES: Dict[str, Dict[str, float]] = {
    "PCBs": {"epr_value_per_kg": 75.0, "passthrough_percentage": 0.30},
    "Cables": {"epr_value_per_kg": 40.0, "passthrough_percentage": 0.30},
    "Batteries": {"epr_value_per_kg": 90.0, "passthrough_percentage": 0.35},
    "CRT Monitors": {"epr_value_per_kg": 20.0, "passthrough_percentage": 0.25},
    "LCD Panels": {"epr_value_per_kg": 35.0, "passthrough_percentage": 0.30},
    "Electric Motors": {"epr_value_per_kg": 45.0, "passthrough_percentage": 0.30},
    "Mixed Plastics": {"epr_value_per_kg": 15.0, "passthrough_percentage": 0.25}
}

def calculate_epr_premium(
    category: str,
    final_weight_kg: float,
    final_price: float
) -> Tuple[float, float]:
    """
    Computes EPR premium and total payout strictly server-side.
    Formula:
      epr_premium = final_weight * epr_value_per_kg * passthrough_percentage
      total_payout = final_price + epr_premium
    Returns:
      (epr_premium, total_payout)
    """
    rate_info = DEFAULT_EPR_RATES.get(category, {"epr_value_per_kg": 30.0, "passthrough_percentage": 0.30})
    epr_per_kg = rate_info["epr_value_per_kg"]
    passthrough = rate_info["passthrough_percentage"]

    epr_premium = round(final_weight_kg * epr_per_kg * passthrough, 2)
    total_payout = round(final_price + epr_premium, 2)

    return epr_premium, total_payout
