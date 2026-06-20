# AGENTS.md — Easibill Landing Page

## Analytics: Mixpanel

**SDK:** `mixpanel-browser`  
**Platform:** React 18, client-side web  
**Token location:** `src/utils/mixpanel.js` → `TOKEN` constant  
**Consent:** GDPR/CCPA consent gate required. SDK only initializes after user accepts via `ConsentBanner`. Do not call `initMixpanel()` or `track()` before consent.

### Tracking utility

All tracking goes through `src/utils/mixpanel.js`. Never import `mixpanel-browser` directly in components.

```js
import { track } from '../utils/mixpanel';
track('event_name', { property: 'value' });
```

### Events (production)

| Event | Trigger | Key properties |
|---|---|---|
| `page_viewed` | Every route change (auto, via `AnalyticsTracker` in `main.jsx`) | `path` |
| `trial_started` | User clicks any "Start free trial" CTA | `source` (navbar/hero/cta_section/pricing), `plan` (pricing only) |
| `demo_requested` | User clicks "Book demo" button OR submits lead form | `source` (navbar/hero/lead_form), `method` (button_click/form_submit), `shop_name`, `location` (form_submit only) |

### Naming rules

- Event names: `snake_case`, `object_verb` pattern
- Property names: `snake_case`
- Property values: lowercase strings
- Never use `$` or `mp_` prefixes on custom properties
- Never construct event names dynamically

### Identity

No auth flow exists in this codebase. Anonymous `distinct_id` is managed automatically by the SDK. Do not call `mixpanel.identify()` or `mixpanel.reset()` here — those belong in the main product app (`easibill.vercel.app`).

### Adding new events

1. Add the event to the tracking plan table above
2. Import `track` from `src/utils/mixpanel`
3. Call `track('event_name', { properties })` at the exact user action point
4. Verify the event appears in Mixpanel Live View before merging
