from typing import Dict, Any, List

CATEGORIES_MAP = {
    "pcb": "PCBs",
    "circuit": "PCBs",
    "cable": "Cables",
    "wire": "Cables",
    "battery": "Batteries",
    "cell": "Batteries",
    "crt": "CRT Monitors",
    "monitor": "CRT Monitors",
    "lcd": "LCD Panels",
    "screen": "LCD Panels",
    "motor": "Electric Motors",
    "plastic": "Mixed Plastics"
}

ALL_CATEGORIES = [
    "PCBs",
    "Cables",
    "Batteries",
    "CRT Monitors",
    "LCD Panels",
    "Electric Motors",
    "Mixed Plastics"
]

def classify_ewaste_image(
    filename_or_hints: str,
    confidence_override: float = None
) -> Dict[str, Any]:
    """
    Classifies e-waste category from image hints/metadata or ML model.
    Rule: if confidence < 0.6, UI must show 'श्रेणी चुनें (सुनिश्चित नहीं)'
    and force manual category selection.
    """
    lower = filename_or_hints.lower()
    matched_cat = None
    for keyword, cat in CATEGORIES_MAP.items():
        if keyword in lower:
            matched_cat = cat
            break

    if matched_cat:
        conf = confidence_override if confidence_override is not None else 0.88
    else:
        # Default fallback guess with medium/low confidence
        matched_cat = "PCBs"
        conf = confidence_override if confidence_override is not None else 0.52

    requires_manual = conf < 0.60

    return {
        "category": matched_cat,
        "confidence": round(conf, 2),
        "requires_manual_selection": requires_manual,
        "suggested_categories": ALL_CATEGORIES
    }
