import type { CallOutcome } from "@/types/call";

const STORAGE_KEY = "maple-carpet-call-outcomes";

export function getStoredOutcomes(): CallOutcome[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CallOutcome[]) : [];
  } catch {
    return [];
  }
}

export function saveOutcome(outcome: CallOutcome): void {
  const existing = getStoredOutcomes();
  existing.unshift(outcome);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 100)));
}

export function clearOutcomes(): void {
  localStorage.removeItem(STORAGE_KEY);
}
