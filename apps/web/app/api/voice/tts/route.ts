import { NextRequest, NextResponse } from "next/server";

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || "sk_2kejtvj8_Mvkzts36vuBGAmkHEblPM1DO";
const SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech";

export async function POST(req: NextRequest) {
  try {
    const { text, language_code = "hi-IN", speaker } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Default speaker based on language
    const chosenSpeaker = speaker || (language_code.startsWith("hi") ? "meera" : "anushka");

    const payload = {
      inputs: [text.trim().slice(0, 500)],
      target_language_code: language_code,
      speaker: chosenSpeaker,
      pitch: 0,
      pace: 1.0,
      loudness: 1.5,
      speech_sample_rate: 8000,
      enable_preprocessing: true,
      model: "bulbul:v1"
    };

    const response = await fetch(SARVAM_TTS_URL, {
      method: "POST",
      headers: {
        "api-subscription-key": SARVAM_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.warn("Sarvam TTS API failed with status", response.status, errBody);
      return NextResponse.json({ error: "Sarvam TTS generation failed", detail: errBody }, { status: response.status });
    }

    const data = await response.json();
    const audioBase64 = data.audios?.[0];

    if (!audioBase64) {
      return NextResponse.json({ error: "No audio data in Sarvam response" }, { status: 500 });
    }

    return NextResponse.json({
      audio_base64: audioBase64,
      audio_mime: "audio/wav",
      language_code
    });
  } catch (err: any) {
    console.error("Error in /api/voice/tts:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
