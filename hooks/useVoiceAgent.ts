"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildSpeechPhrases,
  pickBestBrowserVoice,
  waitForVoices,
} from "@/lib/voice/natural-speech";

type SpeechRecognitionCtor = new () => SpeechRecognition;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function useVoiceAgent() {
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEngine, setVoiceEngine] = useState<"browser" | "elevenlabs">(
    "browser"
  );
  const [voiceLabel, setVoiceLabel] = useState("Browser voice");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const speakGenRef = useRef(0);

  useEffect(() => {
    setVoiceSupported(
      !!getSpeechRecognitionCtor() &&
        typeof window !== "undefined" &&
        "speechSynthesis" in window
    );

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      waitForVoices().then((voices) => {
        const picked = pickBestBrowserVoice(voices);
        voiceRef.current = picked;
        if (picked) {
          setVoiceLabel((prev) =>
            prev.startsWith("Natural voice") ? prev : `Browser · ${picked.name}`
          );
        }
      });
    }

    fetch("/api/tts")
      .then((r) => r.json())
      .then((data: { available: boolean; label: string }) => {
        if (data.available) {
          setVoiceEngine("elevenlabs");
          setVoiceLabel(data.label);
        } else {
          setVoiceEngine("browser");
          setVoiceLabel((prev) =>
            prev.startsWith("Browser ·") ? prev : "Browser voice (enhanced)"
          );
        }
      })
      .catch(() => {
        setVoiceEngine("browser");
        setVoiceLabel((prev) =>
          prev.startsWith("Browser ·") ? prev : "Browser voice (enhanced)"
        );
      });
  }, []);

  const speakWithBrowser = useCallback(async (text: string): Promise<void> => {
    if (!("speechSynthesis" in window)) return;

    const gen = ++speakGenRef.current;
    window.speechSynthesis.cancel();

    const voices = await waitForVoices();
    const voice = pickBestBrowserVoice(voices) ?? voiceRef.current;
    voiceRef.current = voice;

    const phrases = buildSpeechPhrases(text);

    return new Promise((resolve) => {
      let index = 0;

      const speakNext = () => {
        if (gen !== speakGenRef.current) {
          resolve();
          return;
        }

        if (index >= phrases.length) {
          setIsSpeaking(false);
          resolve();
          return;
        }

        const phrase = phrases[index];
        index++;

        const utterance = new SpeechSynthesisUtterance(phrase.text);
        utterance.rate = phrase.rate;
        utterance.pitch = phrase.pitch;
        utterance.volume = phrase.volume;
        utterance.lang = voice?.lang ?? "en-US";
        if (voice) utterance.voice = voice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setTimeout(speakNext, phrase.pauseAfter);
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      };

      // Brief beat before speaking — feels less abrupt, like picking up the phone
      setTimeout(speakNext, 180);
    });
  }, []);

  const speakWithElevenLabs = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) return false;

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        return new Promise((resolve) => {
          if (audioRef.current) {
            audioRef.current.pause();
            URL.revokeObjectURL(audioRef.current.src);
          }

          const audio = new Audio(url);
          audioRef.current = audio;
          audio.playbackRate = 0.97;

          audio.onplay = () => setIsSpeaking(true);
          audio.onended = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(url);
            resolve(true);
          };
          audio.onerror = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(url);
            resolve(false);
          };

          void audio.play();
        });
      } catch {
        return false;
      }
    },
    []
  );

  const stopSpeaking = useCallback(() => {
    speakGenRef.current++;
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioRef.current.src.startsWith("blob:")) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    async (text: string): Promise<void> => {
      stopSpeaking();

      if (voiceEngine === "elevenlabs") {
        const ok = await speakWithElevenLabs(text);
        if (ok) return;
      }

      await speakWithBrowser(text);
    },
    [voiceEngine, speakWithElevenLabs, speakWithBrowser, stopSpeaking]
  );

  const startListening = useCallback(
    (onResult: (transcript: string) => void) => {
      const Ctor = getSpeechRecognitionCtor();
      if (!Ctor) return;

      recognitionRef.current?.stop();

      const recognition = new Ctor();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        if (event.error === "not-allowed") {
          console.warn("Microphone permission denied");
        }
      };
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript?.trim();
        if (transcript) onResult(transcript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    },
    []
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, [stopListening, stopSpeaking]);

  return {
    voiceSupported,
    isListening,
    isSpeaking,
    voiceEngine,
    voiceLabel,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
  };
}
