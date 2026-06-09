export interface SpeechPhrase {
  text: string;
  rate: number;
  pitch: number;
  volume: number;
  pauseAfter: number;
}

/** Wait for Chrome/Safari to load voices (empty on first call is a common bug) */
export function waitForVoices(timeoutMs = 800): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([]);
      return;
    }

    const synth = window.speechSynthesis;
    const existing = synth.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }

    const timer = setTimeout(() => resolve(synth.getVoices()), timeoutMs);

    synth.onvoiceschanged = () => {
      clearTimeout(timer);
      resolve(synth.getVoices());
    };
  });
}

export function pickBestBrowserVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  if (en.length === 0) return null;

  const score = (v: SpeechSynthesisVoice): number => {
    const n = v.name.toLowerCase();
    let s = 0;

    if (n.includes("neural") || n.includes("natural")) s += 120;
    if (n.includes("premium") || n.includes("enhanced")) s += 100;
    if (n.includes("samantha")) s += 95;
    if (n.includes("karen") || n.includes("moira") || n.includes("tessa")) s += 85;
    if (n.includes("google us english") && n.includes("female")) s += 82;
    if (n.includes("microsoft aria") || n.includes("jenny") || n.includes("sonia"))
      s += 78;
    if (n.includes("female") || n.includes("woman")) s += 40;
    if (v.lang === "en-US") s += 15;
    // Cloud voices in Chrome often sound less robotic
    if (!v.localService) s += 25;
    if (n.includes("compact") || n.includes("basic")) s -= 30;

    return s;
  };

  return [...en].sort((a, b) => score(b) - score(a))[0];
}

export function prepareTextForSpeech(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/—/g, ", ")
    .replace(/…/g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

function prosodyForPhrase(phrase: string, index: number): Pick<
  SpeechPhrase,
  "rate" | "pitch" | "volume" | "pauseAfter"
> {
  const trimmed = phrase.trim();
  const isQuestion = trimmed.endsWith("?");
  const isExclamation = trimmed.endsWith("!");
  const wordCount = trimmed.split(/\s+/).length;
  const isShort =
    wordCount <= 4 ||
    /^(sure|got it|of course|great|perfect|okay|ok|hi|hello|absolutely|wonderful)/i.test(
      trimmed
    );
  const isWarmClose = /thanks|take care|enjoy|bye|goodbye|have a great/i.test(
    trimmed
  );
  const isEmpathy =
    /understand|sorry|hear you|no worries|totally|makes sense/i.test(trimmed);

  // Gentle arc across the turn — rises slightly mid-call, softens at the end
  const arc = Math.sin((index / 4) * Math.PI) * 0.03;
  const wobble = ((index % 5) - 2) * 0.015;

  if (isQuestion) {
    return {
      rate: 0.87 + wobble,
      pitch: 1.12 + arc,
      volume: 1,
      pauseAfter: 520,
    };
  }
  if (isExclamation) {
    return {
      rate: 0.92 + wobble,
      pitch: 1.08 + arc,
      volume: 1,
      pauseAfter: 380,
    };
  }
  if (isShort) {
    return {
      rate: 0.94 + wobble,
      pitch: 1.06 + arc,
      volume: 1,
      pauseAfter: 260,
    };
  }
  if (isEmpathy) {
    return {
      rate: 0.82 + wobble,
      pitch: 0.97 + arc,
      volume: 0.95,
      pauseAfter: 460,
    };
  }
  if (isWarmClose) {
    return {
      rate: 0.8 + wobble,
      pitch: 0.96 + arc,
      volume: 0.92,
      pauseAfter: 500,
    };
  }
  return {
    rate: 0.84 + wobble + (wordCount > 12 ? -0.03 : 0),
    pitch: 1.03 + arc,
    volume: 0.98,
    pauseAfter: 360,
  };
}

function splitIntoBreathChunks(sentence: string): string[] {
  if (sentence.length <= 58) return [sentence];

  const byClause = sentence
    .split(/\s*(?:;\s+|—\s+|\s+-\s+)\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  for (const clause of byClause) {
    if (clause.length <= 58) {
      chunks.push(clause);
      continue;
    }
    const commaParts = clause.split(/,\s+/).map((p, i, arr) =>
      i < arr.length - 1 ? `${p},` : p
    );
    chunks.push(...commaParts);
  }
  return chunks;
}

/** Break into short phrases — smaller chunks = less monotone in browser TTS */
export function buildSpeechPhrases(text: string): SpeechPhrase[] {
  const clean = prepareTextForSpeech(text);
  const sentences = clean
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const phrases: SpeechPhrase[] = [];
  let index = 0;

  for (const sentence of sentences) {
    for (const part of splitIntoBreathChunks(sentence)) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const prosody = prosodyForPhrase(trimmed, index);
      phrases.push({ text: trimmed, ...prosody });
      index++;
    }
  }

  return phrases.length > 0
    ? phrases
    : [{ text: clean, rate: 0.86, pitch: 1.02, volume: 1, pauseAfter: 320 }];
}
