
Claude finished the response
https://www.agentdynamics.ai/

I want you to see this website, and extract as much infromation as you can about building agents and insgihts for this

I have ot build an agent for this use case:

 Build a voice agent for a carpet store's weekend sale
Scenario: Priya owns Maple Carpet & Flooring, a small local store. She's running 40% off this weekend and wants to call her past customers to tell them and get them to book a free in-home measure appointment. Build the voice agent that makes these outbound calls.
Your agent should:

Call the customer and identify itself as calling on behalf of Maple Carpet & Flooring.
Share the 40% off weekend sale and drive toward a booked measure appointment (or capture interest / callback).
Handle a real conversation: "what's included?", "when?", "how much will it cost?", "not interested."
Capture the outcome (booked / interested / not interested / callback / do-not-call).
What we care about most:

Stays on the facts — the discount is exactly 40%, this weekend only. Don't let it invent pricing, terms, or financing.
Respects the customer — honor "remove me / don't call again" instantly, disclose it's an AI if asked, keep it short, sound human, handle interruptions.
Handles reality — voicemail, wrong number, bad timing. Tools & setup: Use your own accounts, keys, and whatever stack you're comfortable with (VAPI, Twilio, OpenAI/Anthropic, a script, no-code — your choice). A working prototype is great; a clear design + a partial build counts just as much. If you don't have a paid voice API handy, simulate the call in text and focus on the agent's logic, prompt, conversation flow, and guardrails. Wiring a real phone call is a bonus, not a requirement — we're not expecting a deployed phone system in 45 minutes. Deliver: A 2–3 minute walkthrough — show what you built, walk your prompt/flow, and tell us one thing you'd build next.
And for this I want to first train a claude skill which will prompt engineer the entire agent

Prompt engineering best practices for voice AI agents
[General Discussion](https://www.reddit.com/r/PromptEngineering/?f=flair_name%3A%22General%20Discussion%22)
Prompt engineering is an art instead of a science. Even though prompts look like plain language (English, German, Spanish, etc.), there is definitely a different way to prompting an AI agent than talking to a human. 
Find below a couple of prompt engineering tips and tricks that we at [Leaping AI](https://www.leapingai.com/) have learnt in the last 2 years:

Keep the agent setup prompt (system message) short and ideally to under 2,000 tokens. This is important because it gets loaded at every step of the conversation. Making it too large could add latency to the conversation.
To make the conversation more human, you can include a prompt telling the AI to add filler words regularly, such as “umm, uhh, ok”.
Specify explicitly how certain numbers should be pronounced, giving examples as well. For example, say “convert post codes to words, eg. 94107 -> nine, four, one, zero, seven”. Not doing this will make the AI pronounce this specific number as ninety four thousand, one hundred and seven.
Refer to transitions (aka functions) in the prompt. E.g., “call the function ‘call transfer’ if the customer would like to speak to a human”.
Try to use steps and examples in the prompt. This will tell the AI exactly what you would like it to do.
Emphasise things using capitalisation that you want the AI agent to do. Example: “DO NOT repeat the customer answer back to the customer and ALWAYS go to the next question”.
Be very specific about how certain things should be spelled in order for them to be spoken clearly and slowly, e.g.,
“Convert email addresses into words and separate them by commas, e.g., ‘[john.doe@gmail.com](mailto:john.doe@gmail.com)’ to ‘john, dot, doe, at, gmail, dot, com’
“Convert customer numbers into words and separate the words by commas, e.g., ‘324124’ to ‘three, two, four, one, two, four’”
“Convert birthdays into words and separate them by commas, e.g., ‘01/04/1992’ to ‘january fourth, nineteen ninetytwo’”
Do not rely on prompts to compare two pieces of text or to do math. LLMs are next token predictors and give probabilistic (non-exact) output. Always leverage extra functions to do math operations.
If you have a knowledge base or Q&A that you want the agent to refer to, you can include them directly in the prompts, assuming it doesn’t exceed the acceptable context window of the large language model.
Be ready to continuously iterate on the prompts. It is an ongoing activity even after going live that never ends. Things like this,
I want you to build the actual brain of hte agent

Show more
5:12 PM

Architected deployable agent system with prompt, tools, and transcript
Architected deployable agent system with prompt, tools, and transcript
Skill is built. Now I'll use it to generate the actual agent brain for Maple Carpet & Flooring — the deployable system prompt, the tool definitions, and the outcome schema.


Orchestrated design doc, stress-test transcript, and deliverable packaging strategy
Orchestrated design doc, stress-test transcript, and deliverable packaging strategy
Done. Here's what you have, in the order it was built:

1. Insights from agentdynamics.ai. They're a voice-AI company for car dealerships (their agent is "Dan"), and their Sales Campaigns product — automated voice and messaging follow-ups for missed calls, no-shows, and inactive leads — is structurally identical to Priya's carpet campaign. The patterns they market are your grading rubric: appointments booked directly into existing systems with instant confirmation, and handoff to humans with full conversation summaries — no repetition, no guesswork. Their testimonials all emphasize that the calls felt very human and natural, and their blog's core thesis is that the dealer who responds first with accurate information wins — everything else is secondary. So: accuracy + naturalness + booking + structured handoff. That's exactly what the prompt is optimized for. 
agentdynamics + 3

2. The Claude skill (voice-agent-prompt-engineer.skill) — installable. It encodes the workflow: extract a "call spec," apply voice-specific prompting rules (sub-2k-token prompts, TTS number/date formatting with examples, function references by name, state-machine flows, CAPS sparingly), apply outbound compliance (instant DNC, honest AI disclosure, two-strike rule, voicemail rules), then emit a brain in a fixed section order plus a closed disposition schema. The two reference files split TTS mechanics from compliance so only what's needed loads.

3. The agent brain (system_prompt.md) — the deployable prompt for "Maya." The key structural decisions: facts live in a closed allowlist (the only place "forty percent" appears as a claimable fact — anything off-list defers to Priya), availability and booking are functions, never imagination, price questions pivot to the free measure rather than guessing, and every exit path lands on exactly one of nine dispositions with a summary note for Priya. It's ~1,300 tokens, so it stays fast on every turn.

4. The walkthrough doc — architecture, tool JSON schemas, a simulated stress-test transcript covering interruption, the price trap, DNC, AI disclosure, and the discount-stacking trap, plus your "one thing I'd build next": an automated post-call grader that checks every transcript against the FACTS block and DNC handling, feeding back into prompt iteration.

To use the skill going forward: install the .skill file, then any prompt like "build a voice agent for X" will route through it. Want me to run a longer simulated call against the prompt so you have a full transcript for your video?


System prompt
Document · MD 

Design and walkthrough
Document · MD 

voice-agent-prompt-engineer
Skill 

Fable is the most capable model and takes 2× the usage of Opus






Claude is AI and can make mistakes. Please double-check responses.


raw
Design and walkthrough · MD
# Maple Carpet & Flooring — Outbound Voice Agent: Design & Walkthrough
 
## Architecture (target stack)
 
Dialer (Twilio) → VAPI/Retell session → LLM (Claude/GPT, system_prompt.md) → TTS
                                   ↓ tools
                  check_availability / book_appointment / log_outcome → calendar + CRM row per call
 
The brain is platform-agnostic: paste `system_prompt.md` into VAPI or run it as a plain chat loop for text simulation. All state the business needs lands in `log_outcome` — one disposition + a human-readable summary per call, so Priya gets a clean campaign report and a no-repetition handoff (the same pattern production vendors like AgentDynamics lead with).
 
## Tool schemas
 
```json
{
  "name": "check_availability",
  "input": { "day": "string (YYYY-MM-DD)" },
  "returns": { "windows": ["10:00-12:00", "13:00-15:00"] }
}
{
  "name": "book_appointment",
  "input": { "day": "string", "window": "string", "address": "string",
             "customer_name": "string", "phone": "string" }
}
{
  "name": "log_outcome",
  "input": {
    "disposition": "booked | interested_callback | callback | not_interested | do_not_call | voicemail_left | wrong_number | no_answer | transferred_to_human",
    "notes": "string, 1-2 sentence summary for Priya"
  }
}
```
 
Design choices worth saying out loud in the walkthrough:
- **Facts are a closed list.** Every number the agent may speak lives in one FACTS block; everything else routes to "I'll have Priya confirm." This is the structural defense against invented pricing — not a vibe instruction, an allowlist.
- **Availability is a function, never the LLM's imagination.** The agent cannot offer a time it didn't get from `check_availability`.
- **Two-strike rule + instant DNC.** Respect is encoded as flow transitions, not adjectives.
- **Prompt ≈ 1,300 tokens.** It reloads every turn; small prompt = low latency = fewer awkward silences.
## Simulated stress-test (text mode)
 
**Happy path + interruption + price question:**
> **Maya:** Hi, is this Raj?
> **Raj:** Speaking.
> **Maya:** Hi Raj, this is Maya calling on behalf of Maple Carpet and Flooring here in Waterloo — you've shopped with us before. Do you have a quick thirty seconds?
> **Raj:** Uh, sure.
> **Maya:** Great. Priya's running a sale this weekend only — forty percent off carpet and flooring, Saturday and—
> **Raj:** *(interrupting)* How much would a bedroom cost?
> **Maya:** That depends on the room and material, which is exactly what the free measure is for — you'd get an exact quote with the forty percent already applied, no obligation. Want me to set one up?
> **Raj:** Okay, Saturday morning?
> **Maya:** *(calls check_availability("Saturday"))* I have Saturday between ten and noon, or between one and three — which works better?
> **Raj:** Ten to noon.
> **Maya:** Perfect. And we still have you at the address from your last order — is that right?
> **Raj:** Yep.
> **Maya:** So that's Saturday, June thirteenth, between ten and noon, at your address on file. *(calls book_appointment, then log_outcome: booked, "Booked Sat 10-12 measure for bedroom carpet; price-sensitive, wants exact quote at measure.")* You're booked — Priya will text a confirmation shortly. Thanks Raj, enjoy your day!
 
**DNC path:**
> **Customer:** Stop calling me, take me off your list.
> **Maya:** Of course — I apologize for the bother. You're removed from our list and won't hear from us again. Take care. *(log_outcome: do_not_call, "Requested removal at opening; removed immediately.")*
 
**AI disclosure:**
> **Customer:** Wait, are you a robot?
> **Maya:** Yes — I'm an AI assistant calling on behalf of Maple Carpet and Flooring. Happy to continue, or I can have Priya call you personally — which would you prefer?
 
**Fact-discipline trap:**
> **Customer:** Does the forty percent stack with my seniors discount? And do you do financing?
> **Maya:** Good questions — I don't have those details in front of me, so I don't want to guess. I can have Priya confirm both when she calls to confirm your appointment. Should I book you a free measure?
 
## One thing I'd build next
 
A **post-call evaluation loop**: pipe every transcript through an LLM grader that checks (a) only FACTS-block claims were made, (b) DNC honored within one turn, (c) disposition matches the transcript — and flag failures back into prompt iteration. Voice prompts are never done after v1; the teams doing this well treat prompt iteration on real calls as a permanent activity.
 
