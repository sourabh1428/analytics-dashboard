# Easibill Automation — Feature Overview (for landing page copy)

## What it is
A WhatsApp automation builder for pharmacies. Instead of one fixed 28-day refill reminder, pharmacies can set up multiple automatic message sequences ("journeys") that trigger off patient and purchase events — no manual follow-up needed.

## How it works (user-facing)
1. **Pick a trigger** — a journey starts automatically when something happens:
   - N days before a patient's refill is due
   - N days since their last purchase
   - N days since they signed up
   - When a patient gets tagged (e.g. "diabetic", "VIP")
2. **Journey runs automatically** — sends a WhatsApp message, optionally waits, checks if the patient read it, and sends a follow-up if not, then exits. All via approved WhatsApp templates (Gupshup / Meta WhatsApp Cloud API) — same reliable channel as regular reminders.
3. **Patients can be in several journeys at once**, and a purchase mid-sequence auto-exits related ones (so no "please refill" nudge after they've already bought). A daily send cap prevents message overload.

## Built-in templates (turn on with one toggle — no setup needed)
- **Refill Nudge** — reminds patients before their medicine runs out, with a smart follow-up if the first message goes unread
- **Win-back** — re-engages patients who haven't purchased in 45 days
- **Post-purchase check-in** — checks in 5 days after a purchase to see how the medicine is working

## Advanced option
Pharmacies that want more control can build fully custom journeys with a drag-and-drop canvas (branching logic, custom delays, custom messages) instead of using a template.

## Positioning notes
- Channel: **WhatsApp only** today.
- This is a **Pro-plan feature** — good candidate for an upsell/differentiator callout vs. the free/starter tier.
- Selling point: turns manual "who do I need to follow up with" work into a background system — set once, runs forever.
- Avoid describing internal implementation details (event-driven triggering, Kafka, cron scanning) — these are backend reliability details, not something a customer sees or cares about.
