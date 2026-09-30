from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import base64

from ..services.voice_assistant import speech_to_text, text_to_speech
from ..services.voice_intent import detect_intent
from ..services.pricing import get_price_benchmark, collector_locality

router = APIRouter(prefix="/api/voice", tags=["voice"])
SUPPORTED_LANGS = {"hi-IN", "mr-IN", "en-IN"}
SUFFIX_MAP = {"audio/webm": ".webm", "audio/ogg": ".ogg", "audio/wav": ".wav", "audio/mp4": ".m4a"}

@router.post("/query")
async def voice_query(
    audio: UploadFile = File(...),
    collector_id: str = Form(...),
    language_code: str = Form("hi-IN"),
):
    if language_code not in SUPPORTED_LANGS:
        language_code = "hi-IN"

    audio_bytes = await audio.read()
    if len(audio_bytes) < 1000:
        raise HTTPException(status_code=400, detail="Recording bahut chhoti hai, dobara try karein.")

    suffix = SUFFIX_MAP.get(audio.content_type or "", ".webm")
    transcript = speech_to_text(audio_bytes, language_code=language_code, suffix=suffix)

    intent = detect_intent(transcript)
    action = None

    if intent["intent"] == "rate_query" and intent.get("material"):
        b = await get_price_benchmark(intent["material"], await collector_locality(collector_id))
        response_text = f"{intent['material']} ka rate lagbhag {b['low']} se {b['high']} rupaye kilo hai, {b['freshness']} ka data hai."
    elif intent["intent"] == "price_advice" and intent.get("material"):
        b = await get_price_benchmark(intent["material"], await collector_locality(collector_id))
        if b["current"] >= b["p80"]:
            response_text = f"Haan, abhi {intent['material']} ka rate accha hai. Ye anumaan hai, final keemat recycler tay karega."
        else:
            response_text = f"Abhi rate thoda kam hai, {b['trend_days']} din ruk sakte ho. Ye anumaan hai, guarantee nahi."
    elif intent["intent"] == "start_sell":
        response_text = "Theek hai, lot banate hain."
        action = {"type": "navigate", "route": f"/lot/new?category={intent.get('material','')}"}
    else:
        response_text = "Maaf kijiye, samajh nahi aaya. Jaise poochein: 'PCB ka rate kya hai'."

    audio_out = text_to_speech(response_text, language_code=language_code)
    return JSONResponse({
        "transcript": transcript,
        "response_text": response_text,
        "audio_base64": base64.b64encode(audio_out).decode("utf-8"),
        "audio_mime": "audio/wav",
        "action": action,
    })
