# Voice Prompting Rules (TTS + per-turn loop)

These rules exist because the prompt's output is *spoken*, the user can *interrupt*, and the system prompt is *re-sent on every turn*.

## Latency & size
- Keep the system prompt under ~2,000 tokens. It's loaded every turn; bloat = lag = the customer talks over dead air.
- Put knowledge-base Q&A directly in the prompt only if small; otherwise expose it as a retrieval function.
- Prefer a small/fast model + tight prompt over a huge model + sprawling prompt for outbound sales calls.

## Speech formatting
- Output must contain NO markdown, bullets, emoji, parentheses asides, or URLs. They get read aloud literally or garbled.
- 1–2 sentences per turn. End turns with a question or a clear pause point so barge-in works naturally.
- Front-load the important word: "Forty percent off, this weekend only" beats "This weekend we are running a promotion of forty percent."

## Numbers, dates, spelling (give examples in the prompt, not just rules)
- Percent: write "forty percent", never "40%".
- Phone numbers digit-by-digit with commas: "five, one, nine, ..." 
- Postal/zip codes digit-by-digit: 94107 → "nine, four, one, zero, seven".
- Dates as spoken English: 06/13 → "Saturday, June thirteenth".
- Times: "between nine A M and noon", never "9:00-12:00".
- Email: "john, dot, doe, at, gmail, dot, com".
- Money: "about two hundred dollars", never "$200".

## Sounding human
- Permit occasional natural fillers ("okay", "sure", "got it") — sparingly, not every turn.
- Acknowledge-then-move: one short acknowledgment of what the customer said, then advance the flow. NEVER parrot their full answer back.
- Vary confirmations; never repeat the same phrase twice in a call.
- On interruption: stop instantly, answer the new thing, return to the flow without restarting the pitch.

## Reliability
- LLMs must not do arithmetic, date math, or string comparison in-prompt. Route to functions (`check_availability`, `compute_price`).
- Reference functions by exact name in the flow: "call `transfer_call` if the customer asks for a human."
- Use a numbered state machine for the flow; "If the customer says X, go to step 4" is followed far more reliably than prose.
- Use CAPS for at most 3–5 absolute rules (DNC, no invented facts, disclosure). Overuse dilutes them.
- Plan to iterate after listening to real calls; prompt work never fully ends.