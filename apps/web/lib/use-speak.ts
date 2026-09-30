'use client';

import { useCallback, useRef } from 'react';

/**
 * Custom hook to read aloud text using Sarvam AI TTS with browser SpeechSynthesis fallback
 */
export function useSpeak() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fallbackBrowserSpeak = (text: string, lang: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find(
        (v) => v.lang === lang || v.lang.startsWith(lang.split('-')[0])
      );
      if (matchVoice) {
        utterance.voice = matchVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Browser speech synthesis fallback failed:', e);
    }
  };

  const speak = useCallback(async (text: string, lang: string = 'hi-IN') => {
    if (!text || !text.trim()) return;

    // Try Sarvam AI TTS via our API endpoint first
    try {
      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          language_code: lang
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio_base64) {
          const binary = atob(data.audio_base64);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], { type: data.audio_mime || 'audio/wav' });
          const audioUrl = URL.createObjectURL(blob);

          if (!audioRef.current) {
            audioRef.current = new Audio();
          }
          audioRef.current.pause();
          audioRef.current.src = audioUrl;
          await audioRef.current.play();
          return;
        }
      }
    } catch (e) {
      console.warn('Sarvam TTS API request failed, switching to browser voice:', e);
    }

    // Fallback to browser TTS if Sarvam API is unreachable or fails
    fallbackBrowserSpeak(text, lang);
  }, []);

  return { speak };
}
