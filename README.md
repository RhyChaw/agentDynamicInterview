# Maple Carpet & Flooring — Outbound Voice Agent

Local Next.js prototype for Maya, the AI outbound sale agent. Styled like [AgentDynamics](https://www.agentdynamics.ai/) with a text call simulator powered by Claude and `System_prompt.md`.

## Quick start

```bash
npm install
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open:
- **http://localhost:3000** — Marketing landing page
- **http://localhost:3000/demo** — Call simulator (carpet-roll entrance + live transcript)
- **http://localhost:3000/dashboard** — Campaign outcomes

## Architecture

```
UI (Next.js) → /api/chat → Claude API + System_prompt.md
                              ↓ tools
              check_availability / book_appointment / log_outcome
                              ↓
              localStorage dashboard
```

The agent brain is [`System_prompt.md`](System_prompt.md) — platform-agnostic, pasteable into VAPI/Retell or run here as a text simulation loop.

## Key files

| File | Purpose |
|------|---------|
| `System_prompt.md` | Maya's deployable system prompt (~1,300 tokens) |
| `Skill.md` | Voice-agent-prompt-engineer skill used to build the prompt |
| `Design_and_walkthrough.md` | Architecture, tool schemas, stress-test transcript |
| `app/api/chat/route.ts` | Claude tool-use loop |
| `lib/agent/tools.ts` | Tool handlers (availability, booking, outcomes) |

## 2–3 minute walkthrough

1. **Landing** — AgentDynamics-style site for Maple Carpet, running locally
2. **Start call** — Carpet animation → Maya opens: "Hi, is this Raj?"
3. **Happy path** — Interrupt with price question → pivots to free measure → books via tools
4. **DNC** — "Stop calling me" → instant removal, `log_outcome(do_not_call)`
5. **AI disclosure** — "Are you a robot?" → honest yes
6. **Fact trap** — "Does forty percent stack with seniors discount?" → defers to Priya
7. **Dashboard** — Show disposition + notes saved from the call

## One thing I'd build next

A **post-call evaluation loop**: pipe every transcript through an LLM grader that checks (a) only FACTS-block claims were made, (b) DNC honored within one turn, (c) disposition matches the transcript — and flag failures back into prompt iteration.

## Voice mode (Phase B — built, no VAPI needed)

On `/demo`, toggle **Voice** in the transcript header:
- **TTS**: Maya speaks aloud — enhanced browser voice (free) or ElevenLabs (optional, more human)
- **STT**: Tap the mic to speak as the customer via Web Speech API
- Works best in **Chrome or Edge**

### Free voice quality tiers

| Tier | Cost | Quality | Setup |
|------|------|---------|-------|
| **Enhanced browser** | $0 | Better than default — picks best system voice, sentence pauses | Nothing — already on |
| **ElevenLabs** | Free tier (~10k chars/mo) | Much more human, conversational | Add `ELEVENLABS_API_KEY` to `.env.local` |
| **VAPI** | ~$10 trial credits | Natural voice + **real phone calls** | Overkill for browser demo |

Text mode remains the default and works in all browsers.

### VAPI — optional upgrade for real phone calls

**You do NOT need VAPI for the voice demo in the browser.** Web Speech API handles speaking and listening locally.

**VAPI is for real outbound phone calls** — dialing Raj's actual cell number, natural TTS (ElevenLabs), telephony via Twilio. New accounts get **~$10 free credits** (~30–45 minutes), enough to test a few real calls.

| Feature | Web Speech API (built) | VAPI ($10 trial) |
|---------|------------------------|------------------|
| Cost | $0 | ~$0.15–0.35/min after credits |
| Speaks Maya's replies | Yes (robotic browser voice) | Yes (natural voice) |
| Real phone dial-out | No | Yes |
| Uses System_prompt.md | Yes (via our /api/chat) | Yes (paste as system prompt) |

To add VAPI later: create account at [vapi.ai](https://vapi.ai), paste `System_prompt.md`, point the assistant at your tool webhooks. Happy to wire this in if you want real calls for the interview.
