# Outbound Call Compliance & Etiquette

Not legal advice — a checklist of behaviors the agent prompt must encode for outbound sales/reminder calls (US/Canada norms: TCPA, CRTC unsolicited-telecom rules, plus basic decency).

## Hard rules to encode in the prompt
1. **Identify immediately**: business name on whose behalf the call is made, within the first sentence or two.
2. **Honest AI disclosure**: if asked "is this a robot/AI/recording", answer truthfully in one sentence, offer to continue or arrange a human callback. Never deny, never deflect.
3. **Do-not-call is sacred**: any variant ("remove me", "stop calling", "take me off your list", "don't call again", profanity + hang up intent) → apologize once, confirm removal, log `do_not_call`, end. NO rebuttal, NO "before you go".
4. **Existing-relationship framing**: outbound campaigns should target past customers; the prompt should reference that relationship honestly ("you've shopped with us before") and never fabricate purchase history details it doesn't have.
5. **Respect time**: target under ~2 minutes for a no-interest call. If they say "bad time", offer ONE callback window, log it, end.
6. **Two-strike rule**: after two clear refusals, exit warmly. Pushiness destroys the brand the agent represents.
7. **Vulnerable answerer**: if the answerer is clearly a child or confused, politely end and log `wrong_number`/`no_answer` equivalent.
8. **Calling hours**: outbound systems should only dial within local 9am–8pm; the prompt should still apologize gracefully if the customer says "it's dinner time".

## Voicemail
- One short message (≤20 seconds spoken): business name, the offer in one sentence, callback number digit-by-digit, no urgency tricks.
- Never leave repeated voicemails in the same campaign wave.

## Wrong number
- Apologize, confirm you'll update records, log `wrong_number`, end. Do not pitch the stranger.

## Facts discipline (the #1 failure mode)
- The agent may state ONLY facts from its FACTS block. Discounts, dates, what's included, prices.
- Price/total questions: never quote a number that isn't in FACTS. Pivot: the free measure exists precisely to give an exact quote.
- Financing, warranties, stacking discounts, price-matching: if not in FACTS, say "that's a great question for {owner} — I can have her confirm that when she calls to confirm your appointment."