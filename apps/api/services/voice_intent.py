import re
from typing import Dict, Any, Optional

MATERIALS = [
    ("PCB", ["pcb", "pcbs", "circuit", "circuit board", "motherboard"]),
    ("Battery", ["battery", "batteries", "cell", "lithium", "lead acid"]),
    ("Cable", ["cable", "cables", "wire", "wires", "copper wire", "tamba"]),
    ("CRT Monitor", ["crt", "monitor", "tv tube", "crt monitor"]),
    ("LCD Panel", ["lcd", "screen", "display", "panel", "led panel"]),
    ("Electric Motor", ["motor", "motors", "electric motor"]),
    ("Plastic", ["plastic", "mixed plastic", "polymers"])
]

def extract_material(text: str) -> Optional[str]:
    text_lower = text.lower()
    for mat_name, keywords in MATERIALS:
        for kw in keywords:
            if re.search(r'\b' + re.escape(kw) + r'\b', text_lower):
                return mat_name
    return None

def detect_intent(transcript: str) -> Dict[str, Any]:
    """
    Detects user intent from transcript.
    Saaras:v4 translates Hindi/Marathi to English, so we match both English
    and common Hinglish keywords.
    """
    if not transcript or not transcript.strip():
        return {"intent": "unknown", "material": None}

    text_lower = transcript.lower()
    material = extract_material(text_lower)

    # 1. Price Advice / Timing intent ("Should I sell now?", "Is rate good?")
    advice_keywords = [
        "should i sell", "good time to sell", "sell now", "wait", "hold",
        "right time", "rate accha hai", "bechna chahiye", "abhi bechna",
        "market up", "price increase", "rate badhega"
    ]
    if any(k in text_lower for k in advice_keywords):
        return {
            "intent": "price_advice",
            "material": material or "PCB",
            "raw_text": transcript
        }

    # 2. Rate Query intent ("What is the price of...", "PCB rate")
    rate_keywords = [
        "rate", "price", "bhav", "keemat", "cost", "how much", "value",
        "per kg", "kilo ka rate", "kitna hai"
    ]
    if any(k in text_lower for k in rate_keywords):
        return {
            "intent": "rate_query",
            "material": material or "PCB",
            "raw_text": transcript
        }

    # 3. Start Lot / Sell intent ("I want to sell", "create lot", "lot banao")
    sell_keywords = [
        "sell", "bechna", "bechni", "create lot", "make lot", "pickup",
        "lot banate", "lot banana", "start lot", "collect"
    ]
    if any(k in text_lower for k in sell_keywords):
        return {
            "intent": "start_sell",
            "material": material or "PCB",
            "raw_text": transcript
        }

    # Default fallback if a material is mentioned without specific verb
    if material:
        return {
            "intent": "rate_query",
            "material": material,
            "raw_text": transcript
        }

    return {
        "intent": "unknown",
        "material": None,
        "raw_text": transcript
    }
