---
name: lead-gen-fix-chatbot
description: Fix step navigation bug in LeadGeneration form and add 15-second chatbot popup that captures leads and sends to Cloudflare Worker
metadata:
  type: project
---

# Lead Generation Fix + Chatbot Popup

## Problem

1. **Form step navigation broken**: Pressing Enter in any input fires `handleSubmit`, which validates all fields including unfilled future steps. This prevents the multi-step flow from working correctly.
2. **No passive lead capture**: Users who browse but don't navigate to `/lead` are never prompted.

## Solution

### Part 1 — Fix LeadGeneration.jsx

- Add `onKeyDown` handler to each input: if `Enter` is pressed and it is not the last step, advance to the next step (after validating current field). If it is the last step, allow normal form submission.
- No changes to validation logic or data flow.

### Part 2 — New LeadChatbot component

**File:** `src/components/LeadChatbot.jsx`

**Trigger:**
- 15-second `setTimeout` on mount.
- If user has already submitted or dismissed this session, do not show (`sessionStorage` key `easibill_chatbot_dismissed`).

**Position:** Fixed bottom-left (`fixed bottom-6 left-6 z-50`).

**Visual design:**
- Collapsed state: a pulsing chat bubble button (purple gradient) with a `MessageCircle` icon.
- Expanded state: a `w-80` (mobile: `w-[calc(100vw-3rem)]`) card, max-height `480px`, scrollable.
- Header: bot avatar + "Easibill Assistant" name + × close button.
- Chat area: alternating bubbles — bot messages left-aligned (purple/slate bg), user answers right-aligned (white bg).
- Input row at bottom: text input + send button.

**Conversation flow (bot-driven):**
1. Bot: "Hi! 👋 I'm the Easibill assistant. Can I get your name?"
2. User types name → bot: "Nice to meet you, {name}! What's your email address?"
3. User types email → bot: "Got it! And your mobile number?"
4. User types mobile → bot: "What's your pharmacy / shop name?"
5. User types shop → bot: "Last one — which city or area are you in?"
6. User types location → auto-submit to Worker → bot: "You're all set! We'll reach out soon. 🎉"

**Validation:** Same rules as the main form (email format, 10-digit mobile). Bot shows inline error bubble if validation fails and re-asks the same question.

**Submission:** POST to `https://landingpage-lead.sppathak1428.workers.dev/` with `{ name, email, mobile, companyName, location }`. On success show success bubble and close after 3 seconds.

**Responsive:**
- Desktop: `w-80` fixed card.
- Mobile: `w-[calc(100vw-3rem)]` so it fills most of the screen width without overflow.

**Mount point:** Added to `App.jsx` outside `<Routes>` so it persists on all pages.

## Data flow

```
User on site for 15s
  → LeadChatbot timer fires
  → User answers 5 questions
  → POST https://landingpage-lead.sppathak1428.workers.dev/
  → Worker forwards to Discord
  → Success bubble shown
```

## Files changed

| File | Change |
|------|--------|
| `src/components/LeadGeneration.jsx` | Add Enter-key handler to inputs |
| `src/components/LeadChatbot.jsx` | New file |
| `src/App.jsx` | Mount `<LeadChatbot />` outside Routes |
