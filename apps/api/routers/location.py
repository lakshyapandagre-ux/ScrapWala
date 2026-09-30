import os
import httpx
from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/location", tags=["location"])
LOCATIONIQ_KEY = os.environ.get("LOCATIONIQ_API_KEY", "your_key_here")

@router.get("/reverse")
async def reverse_geocode(lat: float = Query(...), lng: float = Query(...)):
    # 1. Try LocationIQ if key is provided and not placeholder
    if LOCATIONIQ_KEY and LOCATIONIQ_KEY != "your_key_here":
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(
                    "https://us1.locationiq.com/v1/reverse",
                    params={"key": LOCATIONIQ_KEY, "lat": lat, "lon": lng, "format": "json"},
                )
                if resp.status_code == 200:
                    data = resp.json()
                    addr = data.get("address", {})
                    locality = (
                        addr.get("suburb")
                        or addr.get("city_district")
                        or addr.get("neighbourhood")
                        or addr.get("town")
                        or addr.get("village")
                        or addr.get("city")
                        or "अज्ञात स्थान"
                    )
                    return {
                        "locality": locality,
                        "district": addr.get("state_district") or addr.get("county"),
                        "state": addr.get("state"),
                        "display_name": data.get("display_name"),
                    }
        except Exception as e:
            pass

    # 2. Resilient OpenStreetMap Nominatim fallback (Free, no key needed)
    try:
        async with httpx.AsyncClient(timeout=8.0, headers={"User-Agent": "ScrapWala/2.0 (SIH-26229)"}) as client:
            resp = await client.get(
                "https://nominatim.openstreetmap.org/reverse",
                params={"lat": lat, "lon": lng, "format": "json"},
            )
            if resp.status_code == 200:
                data = resp.json()
                addr = data.get("address", {})
                locality = (
                    addr.get("suburb")
                    or addr.get("city_district")
                    or addr.get("neighbourhood")
                    or addr.get("town")
                    or addr.get("village")
                    or addr.get("city")
                    or "अज्ञात स्थान"
                )
                return {
                    "locality": locality,
                    "district": addr.get("state_district") or addr.get("county"),
                    "state": addr.get("state"),
                    "display_name": data.get("display_name"),
                }
    except Exception:
        pass

    # 3. Default fallback based on standard coordinates (Indore/Bhopal region)
    return {
        "locality": "Indore, MP",
        "district": "Indore",
        "state": "Madhya Pradesh",
        "display_name": f"{lat:.4f}, {lng:.4f}, Indore, Madhya Pradesh",
    }
