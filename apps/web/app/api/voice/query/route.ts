import { NextRequest, NextResponse } from "next/server";

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || "sk_2kejtvj8_Mvkzts36vuBGAmkHEblPM1DO";
const SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text";
const SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech";

const RATES: Record<string, { nameHi: string; low: number; high: number; current: number }> = {
  pcb: { nameHi: "सर्किट बोर्ड (PCB)", low: 130, high: 170, current: 150 },
  battery: { nameHi: "बैटरी (Battery)", low: 45, high: 65, current: 55 },
  cable: { nameHi: "तांबे का तार / केबल", low: 220, high: 280, current: 250 },
  crt: { nameHi: "सीआरटी मॉनिटर / टीवी", low: 15, high: 25, current: 20 },
  lcd: { nameHi: "एलसीडी स्क्रीन / पैनल", low: 40, high: 70, current: 55 },
  motor: { nameHi: "इलेक्ट्रिक मोटर", low: 80, high: 110, current: 95 },
  plastic: { nameHi: "मिक्स ई-कचरा प्लास्टिक", low: 18, high: 28, current: 22 },
  default: { nameHi: "ई-कचरा सामग्री", low: 80, high: 150, current: 110 }
};

function extractMaterial(text: string): { key: string; nameHi: string; low: number; high: number; current: number } {
  const t = text.toLowerCase();
  if (t.includes("pcb") || t.includes("motherboard") || t.includes("circuit") || t.includes("सर्किट") || t.includes("बोर्ड")) {
    return { key: "pcb", ...RATES.pcb };
  }
  if (t.includes("battery") || t.includes("cell") || t.includes("बैटरी") || t.includes("लिथियम")) {
    return { key: "battery", ...RATES.battery };
  }
  if (t.includes("cable") || t.includes("wire") || t.includes("copper") || t.includes("तार") || t.includes("तांबा") || t.includes("केबल")) {
    return { key: "cable", ...RATES.cable };
  }
  if (t.includes("crt") || t.includes("monitor") || t.includes("tv") || t.includes("मॉनिटर") || t.includes("टीवी")) {
    return { key: "crt", ...RATES.crt };
  }
  if (t.includes("lcd") || t.includes("display") || t.includes("screen") || t.includes("एलसीडी") || t.includes("स्क्रीन")) {
    return { key: "lcd", ...RATES.lcd };
  }
  if (t.includes("motor") || t.includes("मोटर")) {
    return { key: "motor", ...RATES.motor };
  }
  if (t.includes("plastic") || t.includes("प्लास्टिक")) {
    return { key: "plastic", ...RATES.plastic };
  }
  return { key: "pcb", ...RATES.pcb };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const collectorId = (formData.get("collector_id") as string) || "COLLECTOR_01";
    const languageCode = (formData.get("language_code") as string) || "hi-IN";

    let transcript = "";

    if (audioFile) {
      // Send audio to Sarvam AI STT
      const sttFormData = new FormData();
      sttFormData.append("file", audioFile);
      sttFormData.append("model", "saaras:v4");
      sttFormData.append("language_code", languageCode);

      try {
        const sttRes = await fetch(SARVAM_STT_URL, {
          method: "POST",
          headers: {
            "api-subscription-key": SARVAM_API_KEY
          },
          body: sttFormData
        });

        if (sttRes.ok) {
          const sttData = await sttRes.json();
          transcript = sttData.transcript || "";
        } else {
          console.warn("Sarvam STT failed:", sttRes.status, await sttRes.text());
        }
      } catch (sttErr) {
        console.error("Sarvam STT call error:", sttErr);
      }
    }

    if (!transcript) {
      transcript = (formData.get("text_query") as string) || "PCB ka rate kya hai?";
    }

    // Determine Intent
    const tLower = transcript.toLowerCase();
    const mat = extractMaterial(transcript);
    let responseText = "";
    let action: any = null;

    if (
      tLower.includes("sell") ||
      tLower.includes("bech") ||
      tLower.includes("lot") ||
      tLower.includes("pickup") ||
      tLower.includes("बेचना") ||
      tLower.includes("लॉट")
    ) {
      responseText = `ठीक है, ${mat.nameHi} का लॉट बनाते हैं। आप वजन और फोटो दर्ज करें।`;
      action = { type: "navigate", route: `/lot/new?category=${mat.key}` };
    } else if (
      tLower.includes("advice") ||
      tLower.includes("time") ||
      tLower.includes("ruk") ||
      tLower.includes("wait") ||
      tLower.includes("badhega") ||
      tLower.includes("सही है") ||
      tLower.includes("रुकें")
    ) {
      responseText = `हाँ, अभी ${mat.nameHi} का भाव ₹${mat.current} प्रति किलो चल रहा है, जो कि अच्छा है।`;
    } else {
      responseText = `${mat.nameHi} का मंडी रेट ₹${mat.low} से ₹${mat.high} प्रति किलो के बीच है।`;
    }

    // Generate spoken audio with Sarvam TTS
    let audioBase64 = "";
    try {
      const ttsPayload = {
        inputs: [responseText],
        target_language_code: languageCode,
        speaker: languageCode.startsWith("hi") ? "meera" : "anushka",
        model: "bulbul:v1"
      };

      const ttsRes = await fetch(SARVAM_TTS_URL, {
        method: "POST",
        headers: {
          "api-subscription-key": SARVAM_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ttsPayload)
      });

      if (ttsRes.ok) {
        const ttsData = await ttsRes.json();
        audioBase64 = ttsData.audios?.[0] || "";
      } else {
        console.warn("Sarvam TTS failed during voice query:", ttsRes.status);
      }
    } catch (ttsErr) {
      console.error("Sarvam TTS call error in query:", ttsErr);
    }

    return NextResponse.json({
      transcript,
      response_text: responseText,
      audio_base64: audioBase64,
      audio_mime: "audio/wav",
      action
    });
  } catch (err: any) {
    console.error("Error in /api/voice/query:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process voice query" },
      { status: 500 }
    );
  }
}
