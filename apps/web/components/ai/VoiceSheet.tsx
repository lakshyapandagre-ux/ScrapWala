"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square, X, Loader2, Volume2, Sparkles, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type VoiceState = "idle" | "recording" | "processing" | "playing" | "error";
const LANG_MAP: Record<string, string> = { hi: "hi-IN", mr: "mr-IN", en: "en-IN" };

interface VoiceSheetProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  collectorId?: string;
}

export function VoiceSheet({ open, isOpen, onClose, collectorId = "COLLECTOR_01" }: VoiceSheetProps) {
  const isSheetOpen = open ?? isOpen ?? false;
  const { lang } = useI18n();
  const locale = lang || "hi";
  const router = useRouter();

  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [responseText, setResponseText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition if available in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsRecognitionSupported(true);
      }
    }
  }, []);

  const handleTextQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setState("processing");
    setErrorMsg("");
    setTranscript(queryText);

    try {
      const fd = new FormData();
      fd.append("text_query", queryText);
      fd.append("collector_id", collectorId);
      fd.append("language_code", LANG_MAP[locale] ?? "hi-IN");

      const res = await fetch("/api/voice/query", { method: "POST", body: fd });
      if (!res.ok) {
        throw new Error("सर्वर से उत्तर नहीं मिला।");
      }
      const data = await res.json();
      setResponseText(data.response_text);

      if (data.audio_base64) {
        playBase64Audio(data.audio_base64, data.audio_mime || "audio/wav");
      } else {
        fallbackSpeak(data.response_text);
      }

      if (data.action?.type === "navigate") {
        setTimeout(() => {
          onClose();
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("open-sell-wizard", { detail: data.action }));
          }
          router.push(data.action.route);
        }, 1500);
      }
    } catch (e: any) {
      setErrorMsg(e.message || "कुछ गड़बड़ हो गई, दोबारा कोशिश करें।");
      setState("error");
    }
  };

  const playBase64Audio = (base64Str: string, mime: string) => {
    try {
      const binary = atob(base64Str);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const audioBlob = new Blob([array], { type: mime });
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(audioBlob);
        audioRef.current.play().catch(() => {
          setState("idle");
        });
        setState("playing");
      }
    } catch {
      setState("idle");
    }
  };

  const fallbackSpeak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = LANG_MAP[locale] || "hi-IN";
      u.onend = () => setState("idle");
      window.speechSynthesis.speak(u);
      setState("playing");
    } else {
      setState("idle");
    }
  };

  const startRecording = useCallback(async () => {
    setErrorMsg("");
    setTranscript("");
    setResponseText("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      });
      streamRef.current = stream;

      // Browser Web Speech Recognition for live preview if supported
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.lang = LANG_MAP[locale] ?? "hi-IN";
          rec.continuous = true;
          rec.interimResults = true;
          rec.onresult = (event: any) => {
            let current = "";
            for (let i = 0; i < event.results.length; i++) {
              current += event.results[i][0].transcript;
            }
            if (current) setTranscript(current);
          };
          rec.start();
          recognitionRef.current = rec;
        } catch {
          // ignore recognition init error
        }
      }

      // Check supported MIME type
      let mimeType = "audio/webm";
      if (!MediaRecorder.isTypeSupported("audio/webm")) {
        if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4";
        } else if (MediaRecorder.isTypeSupported("audio/wav")) {
          mimeType = "audio/wav";
        } else {
          mimeType = "";
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch {}
        }
        const finalBlob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
        submitAudio(finalBlob);
      };

      recorder.start(250);
      recorderRef.current = recorder;
      setState("recording");
    } catch (err: any) {
      console.warn("Microphone access issue:", err);
      setErrorMsg("माइक की अनुमति नहीं मिली। आप नीचे दिए गए सुझाव चुन सकते हैं।");
      setState("error");
    }
  }, [collectorId, locale]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setState("processing");
  }, []);

  const submitAudio = async (blob: Blob) => {
    try {
      const fd = new FormData();
      fd.append("audio", blob, blob.type.includes("mp4") ? "voice.m4a" : "voice.webm");
      fd.append("collector_id", collectorId);
      fd.append("language_code", LANG_MAP[locale] ?? "hi-IN");
      if (transcript) {
        fd.append("text_query", transcript);
      }

      const res = await fetch("/api/voice/query", { method: "POST", body: fd });
      if (!res.ok) {
        throw new Error("सर्वर से उत्तर नहीं मिला।");
      }
      const data = await res.json();
      if (data.transcript) {
        setTranscript(data.transcript);
      }
      setResponseText(data.response_text);

      if (data.audio_base64) {
        playBase64Audio(data.audio_base64, data.audio_mime || "audio/wav");
      } else {
        fallbackSpeak(data.response_text);
      }

      if (data.action?.type === "navigate") {
        setTimeout(() => {
          onClose();
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("open-sell-wizard", { detail: data.action }));
          }
          router.push(data.action.route);
        }, 1500);
      }
    } catch (e: any) {
      setErrorMsg(e.message || "कुछ गड़बड़ हो गई, दोबारा कोशिश करें।");
      setState("error");
    }
  };

  const reset = () => {
    setState("idle");
    setTranscript("");
    setResponseText("");
    setErrorMsg("");
  };

  if (!isSheetOpen) return null;

  const quickQueries = [
    "PCB का रेट क्या है?",
    "तांबे के तार का भाव?",
    "बैटरी बेचनी है",
    "अभी बेचना सही है क्या?"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-xs" onClick={onClose}>
      <div
        className="w-full max-w-[480px] mx-auto bg-white rounded-t-[28px] p-5 pb-8 shadow-2xl animate-in slide-in-from-bottom border-t border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-3" />
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EFFAEB] text-[#2E7D1F] flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#14181A]">स्क्रैपवाला वॉयस सहायक</h3>
              <p className="text-[11px] text-gray-500 font-medium">Sarvam AI Powered (Hindi / English)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-black"
          >
            <X size={16} />
          </button>
        </div>

        <audio ref={audioRef} onEnded={() => setState("idle")} className="hidden" />

        {/* Central Voice Button & Status */}
        <div className="flex flex-col items-center py-5 gap-3 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100 mb-4">
          {state === "idle" && (
            <button
              onClick={startRecording}
              className="w-20 h-20 rounded-full bg-[#2E7D1F] hover:bg-[#256619] flex items-center justify-center active:scale-95 transition shadow-lg shadow-[#2E7D1F]/30"
              aria-label="Start Voice Recording"
            >
              <Mic size={32} className="text-white" />
            </button>
          )}
          {state === "recording" && (
            <button
              onClick={stopRecording}
              className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center animate-pulse shadow-lg shadow-red-600/30"
              aria-label="Stop Recording"
            >
              <Square size={28} className="text-white" fill="white" />
            </button>
          )}
          {state === "processing" && (
            <div className="w-20 h-20 rounded-full bg-[#EFFAEB] flex items-center justify-center">
              <Loader2 size={32} className="text-[#2E7D1F] animate-spin" />
            </div>
          )}
          {state === "playing" && (
            <div className="w-20 h-20 rounded-full bg-[#2E7D1F] flex items-center justify-center animate-pulse">
              <Volume2 size={32} className="text-white" />
            </div>
          )}
          
          <p className="text-sm font-semibold text-gray-700 text-center">
            {state === "idle" && "बोलने के लिए माइक बटन दबाएं"}
            {state === "recording" && "सुन रहा हूं... रोकने के लिए लाल बटन दबाएं"}
            {state === "processing" && "Sarvam AI से भाव समझ रहा हूं..."}
            {state === "playing" && "जवाब सुनिए..."}
            {state === "error" && errorMsg}
          </p>
        </div>

        {/* Transcript / Recognized Text */}
        {transcript && (
          <div className="bg-gray-50 rounded-xl p-3 mb-2.5 border border-gray-200">
            <p className="text-[11px] font-bold text-gray-400 mb-0.5">आपने कहा:</p>
            <p className="text-sm text-gray-900 font-medium">"{transcript}"</p>
          </div>
        )}

        {/* AI Voice Answer */}
        {responseText && (
          <div className="bg-[#EFFAEB] rounded-xl p-3 mb-3 border border-[#D9F5D0]">
            <div className="flex items-center gap-1.5 mb-1">
              <Volume2 size={14} className="text-[#2E7D1F]" />
              <p className="text-[11px] font-bold text-[#2E7D1F]">सहायक का उत्तर:</p>
            </div>
            <p className="text-sm text-gray-900 font-semibold leading-relaxed">{responseText}</p>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5 mb-3">
          <p className="text-[11px] font-bold text-gray-500">तुरंत पूछें (Tap to ask):</p>
          <div className="flex flex-wrap gap-1.5">
            {quickQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleTextQuery(q)}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-[#EFFAEB] hover:text-[#2E7D1F] border border-gray-200 text-gray-700 font-medium transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Option */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && textInput.trim()) {
                handleTextQuery(textInput);
                setTextInput("");
              }
            }}
            placeholder="या यहाँ लिखकर पूछें (उदा. PCB rate)..."
            className="flex-1 h-10 px-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D1F]"
          />
          <button
            onClick={() => {
              if (textInput.trim()) {
                handleTextQuery(textInput);
                setTextInput("");
              }
            }}
            disabled={!textInput.trim()}
            className="h-10 px-3.5 rounded-xl bg-[#2E7D1F] text-white flex items-center justify-center disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>

        {state === "error" && (
          <button
            onClick={reset}
            className="w-full h-10 mt-3 rounded-xl bg-[#2E7D1F] text-white font-semibold text-sm transition"
          >
            दोबारा कोशिश करें
          </button>
        )}
      </div>
    </div>
  );
}

export default VoiceSheet;
