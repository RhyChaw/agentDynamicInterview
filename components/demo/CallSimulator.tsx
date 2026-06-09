"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaKeyboard,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhone,
  FaPhoneSlash,
  FaVolumeUp,
} from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { OutcomeBadge } from "@/components/demo/OutcomeBadge";
import { ScenarioPicker } from "@/components/demo/ScenarioPicker";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";
import { customers } from "@/lib/customers";
import { saveOutcome } from "@/lib/storage";
import type {
  CallOutcome,
  Disposition,
  Message,
  Scenario,
  ToolLogEntry,
} from "@/types/call";

const QUICK_REPLIES = [
  "What's included?",
  "When is the sale?",
  "How much will it cost?",
  "Not interested.",
  "Remove me from your list.",
  "Are you a robot?",
  "Does the forty percent stack with my seniors discount?",
];

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function CallSimulator() {
  const [customerId, setCustomerId] = useState("raj");
  const [scenario, setScenario] = useState<Scenario>("live");
  const [messages, setMessages] = useState<Message[]>([]);
  const [toolLog, setToolLog] = useState<ToolLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [disposition, setDisposition] = useState<Disposition | undefined>();
  const [notes, setNotes] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [voiceMode, setVoiceMode] = useState(false);
  const [sessionId] = useState(
    () => `session-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  const [startedAt, setStartedAt] = useState<string>("");
  const transcriptRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const isLoadingRef = useRef(false);
  const voiceModeRef = useRef(voiceMode);
  const callActiveRef = useRef(callActive);
  const callEndedRef = useRef(callEnded);

  const {
    voiceSupported,
    isListening,
    isSpeaking,
    voiceLabel,
    voiceEngine,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
  } = useVoiceAgent();

  const customer = customers.find((c) => c.id === customerId)!;

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);
  useEffect(() => {
    callActiveRef.current = callActive;
  }, [callActive]);
  useEffect(() => {
    callEndedRef.current = callEnded;
  }, [callEnded]);

  const autoListen = useCallback(() => {
    if (
      !voiceModeRef.current ||
      !callActiveRef.current ||
      callEndedRef.current ||
      isLoadingRef.current
    ) {
      return;
    }
    startListening((transcript) => {
      void sendMessageRef.current(transcript);
    });
  }, [startListening]);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (callActive && !callEnded) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callActive, callEnded]);

  const parseApiResponse = async (res: Response) => {
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const text = await res.text();
      if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
        throw new Error(
          "Server error — try restarting the dev server (npm run dev) and call again."
        );
      }
      throw new Error(text.slice(0, 180) || `Request failed (${res.status})`);
    }
    return res.json();
  };

  const sendToApi = useCallback(
    async (
      currentMessages: Message[],
      options: { isOpening?: boolean } = {}
    ) => {
      if (isLoadingRef.current) return null;
      isLoadingRef.current = true;
      setIsLoading(true);
      setError("");
      stopListening();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            customerId,
            messages: currentMessages,
            scenario,
            isOpening: options.isOpening,
          }),
        });

        const data = await parseApiResponse(res);
        if (!res.ok) throw new Error(data.error || "API error");

        if (data.reply) {
          const assistantMsg: Message = {
            role: "assistant",
            content: data.reply,
          };
          setMessages((prev) => {
            const next = [...prev, assistantMsg];
            messagesRef.current = next;
            return next;
          });

          if (voiceModeRef.current) {
            await speak(data.reply);
          }
        }

        if (data.toolLog?.length) {
          setToolLog((prev) => [...prev, ...data.toolLog]);
        }

        if (data.outcome) {
          setDisposition(data.outcome.disposition);
          setNotes(data.outcome.notes);
        }

        if (data.callEnded) {
          setCallEnded(true);
          setCallActive(false);
          stopListening();
        } else if (voiceModeRef.current && data.reply) {
          setTimeout(() => autoListen(), 400);
        }

        return data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to reach API";
        setError(msg);
        return null;
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [sessionId, customerId, scenario, speak, stopListening, autoListen]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoadingRef.current || callEndedRef.current) return;

      const userMsg: Message = { role: "user", content: trimmed };
      const updated = [...messagesRef.current, userMsg];
      messagesRef.current = updated;
      setMessages(updated);
      setInput("");

      const result = await sendToApi(updated);
      if (!result) {
        const rolledBack = messagesRef.current.slice(0, -1);
        messagesRef.current = rolledBack;
        setMessages(rolledBack);
      }
    },
    [sendToApi]
  );

  const sendMessageRef = useRef(sendMessage);
  sendMessageRef.current = sendMessage;

  const startCall = async () => {
    messagesRef.current = [];
    setMessages([]);
    setToolLog([]);
    setDisposition(undefined);
    setNotes("");
    setCallEnded(false);
    setCallActive(true);
    setElapsed(0);
    setStartedAt(new Date().toISOString());
    stopListening();
    stopSpeaking();
    await sendToApi([], { isOpening: true });
  };

  const endCall = () => {
    setCallEnded(true);
    setCallActive(false);
    stopListening();
    stopSpeaking();
  };

  const handleMicPress = () => {
    if (
      !callActive ||
      callEnded ||
      isLoadingRef.current ||
      isSpeaking ||
      isLoading
    ) {
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        void sendMessageRef.current(transcript);
      });
    }
  };

  const saveCallOutcome = (overrideDisposition?: Disposition) => {
    const finalDisposition = overrideDisposition || disposition || "no_answer";
    const outcome: CallOutcome = {
      id: `call-${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      disposition: finalDisposition,
      notes: notes || "Call ended manually.",
      startedAt: startedAt || new Date().toISOString(),
      endedAt: new Date().toISOString(),
      messageCount: messages.length,
    };
    saveOutcome(outcome);
    setDisposition(finalDisposition);
    alert("Outcome saved to dashboard!");
  };

  const panelClass =
    "bg-white rounded-2xl border border-navy/10 shadow-sm flex flex-col h-full min-h-0 overflow-hidden";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-0">
      {/* Left panel */}
      <div className={`lg:col-span-3 ${panelClass} p-5`}>
        <div className="shrink-0 space-y-4 overflow-y-auto min-h-0">
          <div>
            <label className="text-xs font-semibold text-navy/50 uppercase tracking-wider block mb-2">
              Customer
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              disabled={callActive}
              className="w-full bg-cream border border-navy/10 rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-maple/50 disabled:opacity-50"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-cream rounded-xl p-4 space-y-1.5">
            <p className="font-semibold text-navy">{customer.name}</p>
            <p className="text-sm text-navy/60">{customer.phone}</p>
            <p className="text-sm text-navy/60">{customer.address}</p>
            <p className="text-xs text-navy/40 mt-1">
              Past: {customer.pastPurchase} ({customer.lastOrderYear})
            </p>
          </div>

          <ScenarioPicker
            value={scenario}
            onChange={setScenario}
            disabled={callActive}
          />

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs text-navy/50 uppercase tracking-wider">
                Timer
              </p>
              <p className="text-2xl font-mono font-bold text-navy">
                {formatElapsed(elapsed)}
              </p>
            </div>
            <OutcomeBadge disposition={disposition} />
          </div>
        </div>
      </div>

      {/* Center — transcript */}
      <div className={`lg:col-span-6 ${panelClass}`}>
        <div className="shrink-0 px-5 py-3 border-b border-navy/10 bg-cream/50 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-navy text-sm">Live Transcript</h2>
            <p className="text-xs text-navy/50">
              Maya — Outbound Sale Agent
              {voiceMode && (
                <span className="text-maple ml-1.5">· {voiceLabel}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isSpeaking && (
              <span className="flex items-center gap-1 text-xs text-maple font-medium">
                <FaVolumeUp className="animate-pulse" /> Speaking
              </span>
            )}
            {isListening && (
              <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                <FaMicrophone className="animate-pulse" /> Listening
              </span>
            )}
            <button
              onClick={() => {
                setVoiceMode(false);
                stopSpeaking();
                stopListening();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                !voiceMode
                  ? "bg-navy text-white"
                  : "bg-cream text-navy/60 hover:bg-navy/5"
              }`}
            >
              <FaKeyboard /> Text
            </button>
            <button
              onClick={() => voiceSupported && setVoiceMode(true)}
              disabled={!voiceSupported}
              title={
                voiceSupported
                  ? "Use microphone and speaker"
                  : "Voice requires Chrome or Edge"
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 ${
                voiceMode
                  ? "bg-navy text-white"
                  : "bg-cream text-navy/60 hover:bg-navy/5"
              }`}
            >
              <FaMicrophone /> Voice
            </button>
          </div>
        </div>

        <div
          ref={transcriptRef}
          className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4"
        >
          {messages.length === 0 && !callActive && (
            <div className="text-center text-navy/40 py-16">
              <FaPhone className="mx-auto text-3xl mb-3 text-navy/20" />
              <p className="text-lg mb-1">Ready to dial</p>
              <p className="text-sm">
                Select a customer and scenario, then press Start Call
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-navy text-white rounded-bl-sm"
                    : "bg-cream text-navy border border-navy/10 rounded-br-sm"
                }`}
              >
                <p className="text-xs opacity-60 mb-1 font-semibold">
                  {msg.role === "assistant" ? "Maya" : customer.name}
                </p>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-navy/10 rounded-2xl px-4 py-3 text-sm text-navy/60">
                Maya is typing...
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="shrink-0 mx-5 mb-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="shrink-0 px-5 py-3 border-t border-navy/10">
          <div className="flex flex-wrap gap-1.5 mb-2 max-h-16 overflow-y-auto">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={!callActive || callEnded || isLoading || isSpeaking}
                className="text-xs px-2.5 py-1 rounded-full bg-cream border border-navy/10 text-navy/70 hover:bg-maple/20 transition-colors disabled:opacity-40"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {voiceMode ? (
              <button
                onClick={handleMicPress}
                disabled={
                  !callActive || callEnded || isLoading || isSpeaking
                }
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-navy text-white hover:bg-navy-light"
                } disabled:opacity-40`}
              >
                {isListening ? (
                  <>
                    <FaMicrophoneSlash /> Tap to stop
                  </>
                ) : (
                  <>
                    <FaMicrophone /> Tap to speak
                  </>
                )}
              </button>
            ) : (
              <>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder={
                    callActive && !callEnded
                      ? "Type as the customer..."
                      : "Start a call first"
                  }
                  disabled={!callActive || callEnded || isLoading}
                  className="flex-1 border border-navy/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-maple/50 disabled:opacity-40"
                />
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!callActive || callEnded || isLoading}
                  size="sm"
                >
                  Send
                </Button>
              </>
            )}
          </div>
          {voiceMode && !voiceSupported && (
            <p className="text-xs text-orange-600 mt-2">
              Voice mode requires Chrome or Edge browser.
            </p>
          )}
          {voiceMode && voiceEngine === "browser" && (
            <p className="text-xs text-navy/40 mt-2">
              Tip: add a free{" "}
              <a
                href="https://elevenlabs.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-maple hover:underline"
              >
                ElevenLabs
              </a>{" "}
              key to <code className="text-[10px]">.env.local</code> for a
              much more human voice.
            </p>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className={`lg:col-span-3 ${panelClass} p-5`}>
        <div className="shrink-0 space-y-3 mb-4">
          {!callActive && !callEnded && (
            <Button onClick={startCall} className="w-full gap-2" size="md">
              <FaPhone /> Start Call
            </Button>
          )}
          {callActive && !callEnded && (
            <Button
              onClick={endCall}
              variant="secondary"
              className="w-full gap-2"
              size="md"
            >
              <FaPhoneSlash /> End Call
            </Button>
          )}
          {(callEnded || messages.length > 0) && (
            <Button
              onClick={() => saveCallOutcome()}
              variant="primary"
              className="w-full"
              size="md"
            >
              Save to Dashboard
            </Button>
          )}
        </div>

        <div className="shrink-0 mb-4">
          <label className="text-xs font-semibold text-navy/50 uppercase tracking-wider block mb-2">
            Manual Outcome Override
          </label>
          <select
            onChange={(e) => {
              const d = e.target.value as Disposition;
              if (d) saveCallOutcome(d);
            }}
            defaultValue=""
            className="w-full bg-cream border border-navy/10 rounded-xl px-4 py-2.5 text-sm"
          >
            <option value="" disabled>
              Override disposition...
            </option>
            <option value="booked">Booked</option>
            <option value="interested_callback">Interested</option>
            <option value="callback">Callback</option>
            <option value="not_interested">Not Interested</option>
            <option value="do_not_call">Do Not Call</option>
            <option value="voicemail_left">Voicemail</option>
            <option value="wrong_number">Wrong Number</option>
          </select>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
          {notes && (
            <div>
              <p className="text-xs font-semibold text-navy/50 uppercase tracking-wider mb-2">
                Agent Notes
              </p>
              <p className="text-sm text-navy/70 bg-cream rounded-xl p-3 leading-relaxed">
                {notes}
              </p>
            </div>
          )}

          {toolLog.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-navy/50 uppercase tracking-wider mb-2">
                Tool Activity
              </p>
              <div className="space-y-2">
                {toolLog.map((t, i) => (
                  <div
                    key={i}
                    className="text-xs bg-cream rounded-lg p-3 border border-navy/5"
                  >
                    <span className="font-mono font-bold text-maple">
                      {t.name}()
                    </span>
                    <pre className="text-navy/50 mt-1 whitespace-pre-wrap break-all">
                      {JSON.stringify(t.input, null, 0)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
