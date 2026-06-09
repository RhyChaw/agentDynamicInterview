---
name: voice-agent-prompt-engineer
description: Prompt-engineer production-grade voice AI agents (outbound or inbound phone agents on VAPI, Retell, LiveKit, Bland, Twilio+LLM, or text-simulated calls). Use this skill whenever the user wants to build, write, review, or improve a voice agent, phone agent, call agent, IVR replacement, outbound campaign caller, or any system prompt that will be spoken aloud over a phone line. Also trigger when the user mentions VAPI, Retell, Bland, voice AI, cold calls, appointment-booking calls, or asks to "build the brain" of a calling agent. This skill produces the full agent brain — system prompt, conversation flow, guardrails, tool/function definitions, and outcome schema — not just generic prompting tips.
---

# Voice Agent Prompt Engineer

This skill turns a business scenario into a complete, deployable voice-agent brain. Voice prompts are NOT chat prompts: every token of the system prompt is reloaded on every conversational turn (latency), the output is spoken by TTS (formatting and number rules matter), and the user can interrupt mid-sentence (turns must be short and front-loaded).

## Workflow

1. **Extract the call spec** from the user's scenario (see "Call Spec" below). Ask only for what's missing and blocking; sensible defaults are fine for a prototype.
2. **Read `references/voice-prompting.md`** for the hard rules of writing prompts that will be spoken by TTS and run on a per-turn loop.
3. **Read `references/outbound-compliance.md`** if the agent makes outbound calls (sales, reminders, follow-ups). Skip for inbound-only agents.
4. **Write the agent brain** using the section order in "Agent Brain Template" below.
5. **Write the outcome schema** — every call must end in exactly one machine-readable disposition.
6. **Stress-test on paper**: walk the prompt through at least these turns before delivering: "not interested", "is this an AI?", "stop calling me", an interruption mid-pitch, a voicemail pickup, a wrong number, and one factual question the prompt doesn't answer.

## Call Spec (what to extract before writing anything)

- Business name, what they sell, geography
- Call direction (outbound/inbound) and trigger (campaign, missed call, web lead)
- The ONE conversion goal (e.g., "book a free in-home measure"), plus acceptable fallback outcomes
- The immutable facts: offers, percentages, dates, prices. List them verbatim — these become the FACTS block
- What the agent must NEVER do (invent pricing, discuss financing, quote install dates...)
- Handoff path: who is the human, how does transfer/callback work
- Dispositions the business needs to see afterward

## Agent Brain Template (section order matters)

Write the system prompt in this order — identity first, facts and red lines early, flow in the middle, style rules last. Keep the whole thing under ~1,500–2,000 tokens; it is loaded on every turn.

1. `# Identity & Mission` — one paragraph: who the agent is, who it's calling on behalf of, the single goal, the fallback goals.
2. `# Facts (the only facts you may state)` — verbatim, numbered list. Add: "If asked anything not on this list, say you don't know and offer to have {owner} follow up. NEVER guess or invent prices, terms, dates, or financing."
3. `# Red Lines` — DNC handling, AI disclosure, no pressure after two no's, end-call conditions. Use CAPS for the few absolute rules; caps lose force if overused.
4. `# Call Flow` — numbered states with explicit transitions ("If X → go to step N", "call function `book_appointment`"). Voice models follow state machines far better than vibes.
5. `# Objection Handling` — the 4–6 most likely objections, each with a one-or-two-sentence response and the next state. One rebuttal max, then accept.
6. `# Edge Cases` — voicemail, wrong number, bad timing, abusive caller, silence, child answers.
7. `# Voice & Style` — turn length (1–2 sentences), number/date pronunciation rules, filler words, interruption behavior, no lists/markdown/emoji in speech.
8. `# Tools` — function signatures the prompt references by exact name. Never let the LLM do math or date arithmetic in its head; push it into a function.

## Outcome Schema

Every call ends with exactly one disposition logged via an `end_call`/`log_outcome` function. Standard set: `booked` (with date/time/address), `interested_callback` (with preferred time), `not_interested`, `do_not_call`, `voicemail_left`, `wrong_number`, `no_answer`, `transferred_to_human`. Include a free-text `notes` field and require the agent to fill it — this is the "full conversation summary for human handoff" that production vendors (e.g., AgentDynamics) sell as a headline feature.

## Quality bar checklist (verify before delivering)

- [ ] System prompt ≤ ~2,000 tokens
- [ ] Every number/price/percent in the prompt appears in the FACTS block and nowhere else
- [ ] "Remove me / don't call again" → immediate apology + confirm + `log_outcome(do_not_call)` + end, no rebuttal
- [ ] "Are you an AI / a robot?" → honest yes, one sentence, then continue or end per customer's wish
- [ ] Voicemail script is ≤ 20 seconds spoken and includes business name + callback number
- [ ] Numbers, phone numbers, dates, and addresses have pronunciation rules with examples
- [ ] Agent never quotes a total price; it pivots price questions to the free measure
- [ ] Two rejections max → graceful exit
- [ ] Every exit path maps to exactly one disposition