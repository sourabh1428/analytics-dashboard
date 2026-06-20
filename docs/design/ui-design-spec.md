# Easibill UI Design Specification

> Covers every page, every shared component, every interactive state, and every small visual detail present in the codebase as of June 2026.

---

## 1. Global Design Tokens

### Colors

| Token | Value | Usage |
|---|---|---|
| `brand-blue` | Custom blue (primary brand) | Active nav, buttons, focus rings, badges |
| `zinc-50` | Very light grey | Page background |
| `zinc-100` | Light grey | Dividers, avatar backgrounds, skeleton bg |
| `zinc-200` | Soft grey | Default input borders, card borders |
| `zinc-300` | Medium grey | Disabled dots, placeholder icons |
| `zinc-400` | Muted grey | Placeholder text, secondary labels, timestamps |
| `zinc-500` | Medium text grey | Nav inactive, table sub-text |
| `zinc-600` | Dark grey text | Table cell text, secondary actions |
| `zinc-700` | Darker text | Body text, table values |
| `zinc-800` | Near-black | Main body text |
| `zinc-900` | Near-black | Headings, active labels, form values |
| `emerald-600` | Green | "Healthy" credit badge, "Add" buttons in Pro areas |
| `amber-50/200/600` | Yellow tones | Warning banners, opted-out notices |
| `red-50/100/400/500/700` | Red tones | Error states, failed status |
| `blue-50/500/700` | Blue tones | Scheduled reminder status |
| `green-600` | Green | Success send counts in Broadcasts |

### Typography

All text uses the system font stack (Tailwind default). No custom font loaded.

| Class | Size | Weight | Usage |
|---|---|---|---|
| `text-2xl font-semibold tracking-tight` | 24px / 600 | Auth page headings |
| `text-xl font-semibold` | 20px / 600 | Page titles (h1) |
| `text-base font-semibold` | 16px / 600 | Patient name in lookup card |
| `text-sm font-semibold` | 14px / 600 | Section headings inside cards |
| `text-sm font-medium` | 14px / 500 | Table patient names, nav labels, button text |
| `text-sm` | 14px / 400 | General body text, form inputs |
| `text-xs font-medium` | 12px / 500 | Status badges, table column headers (uppercase), filter pills |
| `text-xs` | 12px / 400 | Secondary labels, timestamps, phone numbers, date cells |

### Spacing

- Page padding: `p-4` mobile → `md:p-8` desktop
- Card internal padding: `p-5` or `p-6`
- Section vertical gaps: `space-y-6` or `space-y-8`
- Table cell padding: `px-5 py-3.5` (first col) / `px-4 py-3.5`

### Border Radius

| Element | Radius |
|---|---|
| Cards, tables, modals | `rounded-xl` |
| Inputs, buttons | `rounded-lg` |
| Filter pills, status badges | `rounded-full` |
| Stepper circles, avatars | `rounded-full` |
| Mobile bottom nav container | none |

### Shadows

- Modal dialogs: `shadow-xl`
- Quick action buttons: `shadow-sm`
- Cards and tables: border only, no shadow

---

## 2. Layout Shell

The shell wraps every dashboard page. Auth pages have their own simpler layout.

### Desktop Sidebar (≥ `md`, 768px+)

- Position: fixed left edge, full height, `w-[220px]`, `z-30`
- Background: `bg-white`, right border `border-r border-zinc-200`
- Main content gets `ml-[220px]` offset

**Logo area** (top, `px-4 py-5`, separated by `border-b border-zinc-100`):
- `EasibillLogo` icon at 28px, `variant="on-light"`
- "Easibill" text: `font-semibold text-sm text-zinc-900`
- Pharmacy name below: `text-xs text-zinc-400 truncate`

**Nav links** (`px-2 py-3`, `space-y-0.5`, overflow scrollable):
- 8 items: Dashboard, New Sale, Patients, Inventory, Reminders, Broadcasts, Reports, Settings
- Each: `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm`
- Icon: `h-4 w-4 shrink-0` Lucide icon
- **Active state**: `bg-brand-blue/10 text-brand-blue font-semibold`
- **Inactive state**: `text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800`
- Transition: `duration-100`

**User / Logout button** (bottom, `px-2 py-3`, `border-t border-zinc-100`):
- Full-width button: `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900`
- Left: `h-6 w-6 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-medium text-zinc-700` — shows 2-letter initials
- Middle: owner name, `flex-1 text-left truncate`
- Right: `LogOut` icon `h-3.5 w-3.5`, `opacity-0 group-hover:opacity-100 transition-opacity`

### Mobile Top Bar (< `md`)

- Position: fixed top, full width, `h-14`, `z-30`
- Background: `bg-white border-b border-zinc-200`
- Contents (left→right): `EasibillLogo` (28px) + pharmacy name block (flex-1) + LogOut icon button (`p-2 rounded-md`)

### Mobile Bottom Nav (< `md`)

- Position: fixed bottom, full width, `z-30`
- Background: `bg-white border-t border-zinc-200`
- 5 slots: Home, Sale, Patients, Inventory, Settings
- Each slot: `flex-1 flex-col items-center justify-center py-2 gap-0.5 text-xs`
- Icon: `h-5 w-5`
- **Active**: `text-brand-blue font-semibold` + `text-brand-blue` icon
- **Inactive**: `text-zinc-400 hover:text-zinc-600`

### Main Content Area

- `flex-1 md:ml-[220px] overflow-auto pt-14 md:pt-0 pb-16 md:pb-0 min-h-screen`
- Mobile: top-pad 14 (top bar height) + bottom-pad 16 (bottom nav height)
- Desktop: no extra pad

### Full-page Loading State

- Centered `Loader2` spinner `h-5 w-5 animate-spin text-zinc-400` on `bg-zinc-50` full screen

---

## 3. Auth Pages

Auth pages share a common card layout (`frontend/app/(auth)/layout.tsx`):

- Page: `min-h-screen bg-zinc-50 flex items-center justify-center p-4`
- Card: `bg-white border border-zinc-200 rounded-2xl shadow-sm w-full max-w-sm p-8`
- Logo above card: `EasibillLogo` centered

### Standard Input (used on all auth forms)

```
border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white
placeholder:text-zinc-400
focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent
transition-shadow
```

### Standard Primary Button

```
w-full bg-brand-blue text-white rounded-lg py-2.5 text-sm font-medium
hover:bg-brand-blue/90 disabled:opacity-50
transition-all duration-150 active:scale-[0.98]
flex items-center justify-center gap-2
```
- When loading: `Loader2 h-4 w-4 animate-spin` + text changes to e.g. "Signing in…"

---

### 3.1 Login Page (`/login`)

- Heading: "Welcome back" (`text-2xl font-semibold tracking-tight text-zinc-900`)
- Sub: "Sign in to your pharmacy account" (`text-sm text-zinc-500 mt-1`)
- Fields: Email (type=email), Password (type=password) — `space-y-4`
- "Forgot password?" link: right-aligned below password field, `text-sm text-zinc-500 hover:text-zinc-900`
- Submit button: "Sign in" / "Signing in…"
- Footer: "No account? Register your pharmacy" — link `text-zinc-900 font-medium hover:underline underline-offset-4`

### 3.2 Register Page (`/register`)

- Heading: "Create your account"
- Sub: "Get started with WhatsApp refill reminders"
- 5 fields stacked: Pharmacy Name, Owner Name, WhatsApp Number (tel), Email, Password
- Each field has a `<label>` (`text-sm font-medium text-zinc-700`) above the input
- Submit: "Create account" / "Creating account…"
- Footer: "Already have an account? Sign in"
- On success → redirects to `/onboarding`

### 3.3 Forgot Password Page (`/forgot-password`)

- Email input + "Send reset link" button
- Success state shows a text confirmation message

### 3.4 Reset Password Page (`/reset-password`)

- New password + confirm password inputs
- "Reset password" button

---

## 4. Onboarding Flow (`/onboarding`)

Used after first registration. Full-page, not inside the dashboard shell.

- Page: `min-h-screen bg-zinc-50 flex items-center justify-center p-6`
- Card: `bg-white rounded-2xl border border-zinc-200 shadow-sm w-full max-w-lg p-8`

**Stepper** (top of card, 3 steps: Profile / Connect WhatsApp / Add Patients):
- Step circle: `h-8 w-8 rounded-full` — completed = `bg-brand-blue text-white` with `CheckCircle` icon; current = `bg-brand-blue text-white` with number; future = `bg-zinc-100 text-zinc-400`
- Connector line: `h-px flex-1 mx-2` — completed = `bg-brand-blue/40`, pending = `bg-zinc-200`

**Step 1 — Pharmacy Profile:**
- Pharmacy Name input (pre-filled), Timezone select (4 options)
- Primary button "Save & Continue"

**Step 2 — Connect WhatsApp:**
- QR code display area with polling
- "Skip for now" secondary link
- "Continue" primary button once connected

**Step 3 — Add Patients:**
- Two action buttons: "Import from CSV" (`Upload` icon) + "Add manually" (`UserPlus` icon)
- "Skip for now" link

---

## 5. Dashboard Home (`/`)

Page padding: `p-4 md:p-8 w-full space-y-6 md:space-y-8`. No max-width constraint.

### Greeting Header

- `text-xl font-semibold text-zinc-900` — "Good morning/afternoon/evening, {first name}"
- `text-sm text-zinc-500 mt-0.5` — today's date e.g. "Sunday, 15 June 2026"

### Error Banner (conditional)

- `rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700`
- "Couldn't load dashboard data." + inline "Retry" link (`font-medium underline hover:no-underline`)

### Quick Actions Row

Three buttons side-by-side (`flex items-center gap-3`):

Each button: `flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 transition-all shadow-sm`

- "New Sale" → `/new-sale` (ShoppingCart icon)
- "Add Patient" → `/patients` (UserPlus icon)
- "New Broadcast" → `/broadcasts` (Megaphone icon)

### Empty State (0 patients)

`bg-white rounded-xl border border-zinc-200`:

- `EmptyState` component: Building2 icon `h-8 w-8 text-zinc-300`, heading "Welcome to Easibill", body "Get started by setting up your pharmacy in three steps."
- Below it: 3 checklist links (`px-6 pb-8 max-w-md mx-auto space-y-3`)
  - Each: `flex items-center gap-3 p-4 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300`
  - Step circle: `h-7 w-7 rounded-full bg-brand-blue text-white text-xs font-semibold`
  - Label: `text-sm font-medium text-zinc-900`
  - Trailing: `ArrowRight h-4 w-4 text-zinc-400`
  - Steps: (1) Connect WhatsApp → `/settings`, (2) Add your first patient → `/patients`, (3) Make your first sale → `/new-sale`

### Populated State: Stats Bar

`StatsBar` component — 4 stat cards in a row (scrollable on mobile).
Each card: `bg-white rounded-xl border border-zinc-200 p-4`
- Large number: `text-2xl font-bold text-zinc-900`
- Label below: `text-xs text-zinc-500 mt-0.5`
- Stats: Total Patients, Active Reminders, Sent This Month, WhatsApp status (`WAStatusBadge`)

### 2-Column Reminder Grid

`grid grid-cols-1 lg:grid-cols-2 gap-6`

**Today's Reminders card** + **Upcoming This Week card** — same structure:
- Card: `bg-white rounded-xl border border-zinc-200 overflow-hidden`
- Header: `px-5 py-4 border-b border-zinc-100 flex items-center justify-between`
  - Title: `text-sm font-semibold text-zinc-900`
  - Count badge (if >0): `text-xs font-medium bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full`
  - "View all →" link (Today's only): `text-xs text-zinc-400 hover:text-zinc-700`
- Body: `px-5` containing `ReminderCard` list or empty message
- Empty: `py-10 text-center` + `text-sm text-zinc-500`

**ReminderCard** (shared component):
- `py-3 border-b border-zinc-100 last:border-0 flex items-center gap-3`
- Status dot: `h-2 w-2 rounded-full` (color by status)
- Patient name: `text-sm font-medium text-zinc-900`
- Medicine name: `text-xs text-zinc-400`
- Date: `text-xs text-zinc-400 ml-auto`
- Actions (Today's only): "Mark Sent" + "Snooze 7d" icon buttons (appear on hover)

### Recent Activity Card

- Card: `bg-white rounded-xl border border-zinc-200 overflow-hidden`
- Header: "Recent Activity" + "View all →" → `/reports`
- `ActivityFeed` component: list of last 10 events
  - Each row: status icon + description text + timestamp right-aligned
  - `py-3 border-b border-zinc-100 last:border-0 flex items-center gap-3`

### Loading State

Centered `Loader2 h-5 w-5 animate-spin text-zinc-400` in `h-64` container.

---

## 6. Patients List (`/patients`)

Page: `p-4 md:p-8 max-w-4xl`

### Header Row

`flex items-center justify-between mb-6 gap-2`:
- Left: `text-xl font-semibold text-zinc-900` "Patients" + `text-sm text-zinc-500 mt-0.5` "{N} registered"
- Right: 2 buttons:
  - **Import** button: `flex items-center gap-2 border border-zinc-200 text-zinc-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50` — `Upload h-4 w-4` + "Import" label (hidden on mobile: `hidden sm:inline`)
  - **Add Patient** button: `flex items-center gap-2 bg-brand-blue text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-brand-blue/90 transition-all duration-150 active:scale-[0.98]` — `Plus h-4 w-4` + "Add Patient" (`hidden sm:inline`)

### Search Input

`relative mb-5`:
- `Search h-4 w-4 text-zinc-400` icon at `left-3 top-1/2 -translate-y-1/2`
- Input: `w-full border border-zinc-200 rounded-lg pl-9 pr-4 py-2.5 text-sm`, placeholder "Search by name or phone…"
- Focus: `ring-2 ring-brand-blue border-transparent`
- Triggers live search on change (no debounce)

### Filter Pills

`flex items-center gap-2 mb-4` — 3 pills: All / Active / Inactive 60d+

- **Active pill**: `px-3 py-1.5 rounded-full text-xs font-medium bg-brand-blue text-white`
- **Inactive pill**: `bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50`

### Patient Table

`bg-white rounded-xl border border-zinc-200 overflow-hidden`:

Column headers (`border-b border-zinc-100`): `text-xs font-medium text-zinc-500 uppercase tracking-wide`
- Patient (always visible)
- Phone (always)
- Tags (hidden < `lg`)
- Language (hidden < `sm`)
- Added (hidden < `md`)
- Empty column (chevron, `w-8`)

Each row: `border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors group`

- **Patient cell**: avatar `h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-medium text-zinc-600` (2-letter initials) + name `font-medium text-zinc-900`
- **Phone**: `text-zinc-500`
- **Tags**: up to 2 `Tag` components inline, `+N` if overflow. Each tag: colored rounded-full pill.
- **Language**: `text-zinc-500 capitalize`
- **Added**: `text-zinc-400` date `d MMM yyyy`
- **Chevron**: `ChevronRight h-4 w-4` icon button, `opacity-0 group-hover:opacity-100` transition, links to patient detail

### Pagination

"Load more" pattern — no numbered pages:
- `py-4 text-center border-t border-zinc-100`
- Button: `px-4 py-2 text-sm font-medium text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50`
- Text: "Load more ({N} remaining)" or "Loading…"
- Only visible when `patients.length < total`

### Empty State

`bg-white rounded-xl border border-zinc-200 py-16 text-center`:
- "No patients found" (after search) or "No patients yet" + "Add your first patient to get started" (`text-xs text-zinc-400 mt-1`)

### Add Patient Modal

Triggered by "Add Patient" button. Full-screen overlay modal (`PatientModal` component):
- Overlay: `fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4`
- Card: `bg-white rounded-xl shadow-xl w-full max-w-md`
- Header: "Add Patient" title + `X` close button, `border-b border-zinc-100 px-5 py-4`
- Fields: Name, Phone, WhatsApp Number, Language (select), Notes (textarea)
- Footer: Cancel + Save buttons

---

## 7. Patient Detail (`/patients/[id]`)

### Zone 1 — Patient Header Card

`bg-white rounded-xl border border-zinc-200 p-6` (full width)

**Row A — Identity + Actions**:
- Left: `h-12 w-12 rounded-full bg-zinc-100` avatar (2-letter initials) + name `text-xl font-semibold` + phone `text-sm text-zinc-500` + optional WA phone + language badge `rounded-full bg-zinc-100 text-xs px-2 py-0.5`
- Right (desktop): Edit icon button + Delete icon button + "New Sale" `bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-sm` (`hidden sm:flex`)
- Right (mobile): ShoppingCart icon-only button

**Opted-out banner** (if applicable, between Row A and B):
`bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5` with `MessageCircleOff` icon + "WhatsApp opted out — reminders will not be sent" + "Re-enable" inline link

**Row B — Stats Strip** (`border-t border-zinc-100 pt-4 mt-4`):
`grid grid-cols-2 sm:grid-cols-4 gap-4`
Each stat: value `text-xl font-semibold text-zinc-900` + label `text-xs text-zinc-400 mt-0.5`
1. Purchase count — "Purchases"
2. Total spend (₹, en-IN format) — "Total spend"
3. Last purchase date — "Last purchase"
4. Next reminder date — "Next reminder"

**Row C — Tags**: tag add/remove UI (existing Tag component)

### Zone 2 — Tabs

`flex gap-1 mb-4` pill tabs:
- `rounded-full px-3 py-1.5 text-sm font-medium transition-colors`
- **Active**: `bg-zinc-900 text-white`
- **Inactive**: `text-zinc-500 hover:text-zinc-900`
- Labels: "Purchases ({N})" and "Messages ({N})"

#### Purchases Tab

Header: "Purchase history" (`text-sm font-semibold`) + "+ Add purchase" (`bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-sm`)

Table inside `bg-white rounded-xl border border-zinc-200 overflow-hidden divide-y divide-zinc-100`:

Each row: `grid grid-cols-[1fr_auto_auto_auto_auto] sm:grid-cols-[2fr_1fr_auto_auto_auto_auto] gap-4 px-4 py-3 items-center`
- Medicine name `text-sm font-medium text-zinc-900` + qty below `text-xs text-zinc-400`
- Date `text-xs text-zinc-400` (`hidden sm:block` for full, short always)
- Total `text-sm text-zinc-700` (`hidden sm:block`)
- Refill interval `text-xs text-zinc-400` (`hidden sm:block`)
- **Status badge**: `rounded-full px-2 py-0.5 text-xs font-medium` (color-coded per STATUS_CONFIG)

Empty: centered `+ Add first purchase` emerald button

#### Messages Tab

`bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100`
Each row: status dot + status text + timestamp right + message body `line-clamp-2`

### Add Purchase Modal

`fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4`:
- Inner: `bg-white rounded-xl shadow-xl max-w-md w-full`
- Header: "Add Purchase" + `X` button (`border-b border-zinc-100 px-5 py-4`)
- Body: `AddPurchaseForm` component

### Loading / Error States

- **Loading**: avatar skeleton `h-12 w-12 rounded-full` + text skeletons + 4 stat skeletons + table row skeletons
- **Error**: `AlertCircle` icon + "Could not load patient" + Retry button (replaces full page)
- **Not found**: "Patient not found" + back button

---

## 8. New Sale (`/new-sale`)

3-step stepper. Full-height page without a scroll on the outer container.

### Stepper Header (always visible at top)

`flex items-center justify-center py-4 px-4 border-b border-zinc-100 bg-white shrink-0`

3 steps: Patient → Medicines → Payment

Each step node:
- Circle: `h-6 w-6 rounded-full text-xs font-semibold`
  - Done: `bg-brand-blue text-white` + `Check h-3 w-3` icon (clickable to go back)
  - Active: `bg-brand-blue text-white` + step number
  - Future: `bg-zinc-200 text-zinc-400` + step number
- Label: `text-sm` — active = `font-semibold text-zinc-900`, done = `text-zinc-500`, future = `text-zinc-400`
- Connector: `h-px w-8 mx-1` — done = `bg-brand-blue/40`, pending = `bg-zinc-200`

### Step 1 — Patient

`flex-1 flex items-start justify-center p-4 md:p-8 overflow-y-auto`
Content max width: `max-w-md`

- Heading "New Sale" + sub "Start by looking up the customer"
- Card `bg-white rounded-xl border border-zinc-200 p-5 space-y-4`:
  - Section label "Customer" `text-sm font-semibold text-zinc-900`
  - Phone input with `Search` icon on left, auto `Loader2` spinner on right during lookup
  - **Found patient card**: `flex items-center gap-3 p-3 bg-brand-blue/10 rounded-lg border border-brand-blue/20` — `User` icon in `h-8 w-8 rounded-full bg-brand-blue/10`, name `text-base font-semibold`, phone + language `text-xs text-zinc-500`, amber opted-out notice if applicable
  - **New patient form** (if phone not found): `border-t border-zinc-100 pt-3` with amber `UserPlus` label "New patient — enter their details" + name input + language select
- Continue button: `w-full flex items-center justify-center gap-2 bg-brand-blue text-white rounded-xl py-3 text-sm font-medium hover:bg-brand-blue/90 disabled:opacity-50 active:scale-[0.99]`
- Helper text below if disabled: `text-xs text-zinc-400 text-center` (e.g. "Enter a 10-digit mobile number")

### Step 2 — Medicines

Left/right layout on desktop: `flex flex-col lg:flex-row gap-4 h-full overflow-hidden`
- **Left panel** (`flex-1 overflow-y-auto p-4 md:p-6 space-y-3`): medicine rows + "Add medicine" button
- **Right panel** (desktop only `hidden lg:flex`): `PatientContextPanel` — shows patient summary + recent medicines

**MedicineRow** (each added item):

Desktop layout — single line: `group relative flex items-start gap-2 sm:gap-3`
Mobile layout — two-line:
- Line 1: name input (`flex-1`) + Trash2 (always visible mobile)
- Line 2: `grid grid-cols-3 gap-2 sm:hidden` — each cell has `text-xs text-zinc-400 mb-0.5 block` label ("Price (₹)", "Qty", "Days") above input

Inputs use the global input class. Fields:
- Medicine name — text, `flex-1`, `aria-label="Medicine name for item {N}"`
- Price — number, `w-24`, `aria-label="Price per unit in rupees for item {N}"`
- Quantity — number, `w-16`, `aria-label="Quantity for item {N}"`
- Refill days — number, `w-16`, `aria-label="Refill interval in days for item {N}"`
- Remove button — `Trash2 h-4 w-4` (`aria-label="Remove item {N}"`); when only 1 row: `opacity-30 cursor-not-allowed`

**Autocomplete dropdown** (medicine suggestions):
- Appears below name input when focused and text entered
- `absolute z-10 left-0 right-0 bg-white border border-zinc-200 rounded-lg shadow-md mt-1 overflow-hidden`
- Each option: `px-3 py-2 text-sm hover:bg-zinc-50 cursor-pointer flex items-center justify-between` — name on left + price badge `text-xs text-zinc-400` on right
- **Loading state**: `Loader2 h-3 w-3 animate-spin` + "Loading…" `text-zinc-400`
- **Error state**: "Could not load suggestions" `text-red-500` + "Retry" underline link
- **No results**: dropdown hidden

**Per-row subtotal** (only when `unit_price > 0`):
- Mobile: third line, right-aligned `text-right text-sm text-zinc-700`
- Desktop: inline between inputs and remove button `hidden sm:block`
- Format: `₹{Math.round(unit_price * qty).toLocaleString('en-IN')}`

**"Add another medicine" button**:
`w-full py-2.5 border border-dashed border-zinc-300 rounded-lg text-sm text-zinc-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1.5`

**Running total** (below all rows): `text-right text-sm font-semibold text-zinc-900`
Format: `₹{Math.round(total).toLocaleString('en-IN')}`

### Step 3 — Payment

`flex-1 flex items-start justify-center p-4 md:p-8 overflow-y-auto`
Content max width: `max-w-md space-y-4`

**Order Summary card** (`bg-white rounded-xl border border-zinc-200 p-5`):
- Heading "Order Summary" `text-sm font-semibold text-zinc-900 mb-3`
- Item list `max-h-48 overflow-y-auto space-y-2`: each row `flex items-center gap-2` — name `text-sm text-zinc-700 flex-1 truncate` + `×{qty}` `text-xs text-zinc-400` + amount `text-sm text-zinc-700 w-16 text-right`
- Total row `flex items-center justify-between border-t border-zinc-100 mt-3 pt-3`: label `text-sm text-zinc-600` + amount `text-xl font-bold text-zinc-900`

**Payment Method card** (`bg-white rounded-xl border border-zinc-200 p-4 space-y-2`):
- "Payment method" `text-sm font-semibold text-zinc-900`
- 4 pill buttons (Cash, UPI, Card, Other) `flex gap-2 flex-wrap`:
  - **Selected**: `px-3 py-1.5 rounded-full text-sm font-medium bg-brand-blue text-white`
  - **Unselected**: `bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50`

**WhatsApp notice** (`text-xs`):
- Opted-in: `text-zinc-500` "✅ WhatsApp confirmation will be sent to {name}"
- Opted-out: `text-amber-600` "⚠️ This patient has opted out of WhatsApp messages"

**Actions** (`flex gap-3`):
- Back: `px-4 py-3 border border-zinc-200 text-zinc-600 rounded-xl text-sm hover:bg-zinc-50` "← Back"
- Complete Sale: `flex-1 bg-brand-blue text-white rounded-xl py-3 text-sm font-medium active:scale-[0.99]`; loading = `Loader2 + "Processing…"`

### Success Screen

Replaces content after sale completes:
- `CheckCircle` icon (emerald/green, large)
- "Sale recorded!" heading
- Patient name + total amount summary
- Two buttons: "New Sale" + "View Patients"

---

## 9. Inventory (`/inventory`)

Page: `p-4 md:p-8 max-w-4xl`

### Header

- Heading "Inventory" `text-xl font-semibold text-zinc-900`
- Sub: "Manage your medicine catalogue — names, default prices, and refill intervals appear as autocomplete in New Sale." `text-sm text-zinc-500`

### Add-Medicine Form Card

`bg-white rounded-xl border border-zinc-200 p-5`

One row desktop / stacked mobile: Name (text, `flex-1`, placeholder "Medicine name") + Price (number, `w-32`, placeholder "₹ Price") + Days (number, `w-24`, placeholder "Days", default 28) + Add button (type=submit, emerald, `Loader2` while saving)

On success: `toast.success('Medicine saved')`, form clears, new row prepended.

### Medicine List Card

`bg-white rounded-xl border border-zinc-200 overflow-hidden`

Column header row (hidden on mobile): Name / Default Price / Refill Days / (actions) — `text-xs font-medium text-zinc-500 uppercase tracking-wide`

**View mode** each row (`border-b border-zinc-100 last:border-0`):
- Name: `font-medium text-zinc-900`
- Default price: `₹N` or `—` `text-zinc-500`
- Refill days: `N days` `text-zinc-500`
- **Pencil button**: `aria-label="Edit {name}"` `p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600`
- **Trash button**: `aria-label="Delete {name}"` — triggers `window.confirm(...)` before delete

**Edit mode** (inline, same row):
- Three inputs pre-filled, `flex-1` style
- **Save (Check)**: emerald icon button
- **Cancel (X)**: grey icon button

### Empty State

`text-sm text-zinc-400` centered: "No medicines yet. Add your first medicine above to enable autocomplete in New Sale."

### Loading State

3 `animate-pulse` skeleton rows

---

## 10. Reminders (`/reminders`)

Page: `p-4 md:p-8 max-w-4xl`

### Header

`flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3`:
- Left: "Reminders" heading + "{N} total" sub
- Right: segmented filter tabs

### Filter Tabs (segmented control)

`flex items-center gap-1 bg-zinc-100 rounded-lg p-1 self-start sm:self-auto overflow-x-auto`

5 segments: All / Scheduled / Sent / Failed / Cancelled

- **Active**: `px-3 py-1.5 rounded-md text-xs font-medium bg-white text-zinc-900 shadow-sm`
- **Inactive**: `text-zinc-500 hover:text-zinc-700`
- Transition: `duration-100`

### Reminders Table

`bg-white rounded-xl border border-zinc-200 overflow-hidden`

Columns: Patient / Medicine (hidden `< sm`) / Date / Status / Actions (`w-20 text-right`)

Each row: `border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors group`

- **Patient cell**: name `font-medium text-zinc-900` + phone `text-xs text-zinc-400 mt-0.5`
- **Medicine**: `text-zinc-600`
- **Date**: `text-zinc-500 text-xs` formatted `d MMM yyyy`
- **Status badge**: `inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium`

| Status | Dot | Text | Background |
|---|---|---|---|
| scheduled | `bg-blue-500` | `text-blue-700` | `bg-blue-50` |
| sent | `bg-brand-blue` | `text-brand-blue` | `bg-brand-blue/10` |
| failed | `bg-red-500` | `text-red-700` | `bg-red-50` |
| cancelled | `bg-zinc-300` | `text-zinc-500` | `bg-zinc-100` |

- Failed reminders also show error message below badge: `text-xs text-red-400 mt-1 max-w-[160px] truncate`

**Action buttons** (`opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1`):
- Failed → `RotateCcw h-3.5 w-3.5` Retry: `hover:text-blue-600`
- Scheduled → `Calendar h-3.5 w-3.5` Reschedule: `hover:text-amber-600` + `X h-3.5 w-3.5` Cancel: `hover:text-red-500`
- All: `p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400`

### Reschedule Dialog (Radix Dialog)

- Overlay: `fixed inset-0 bg-black/30 backdrop-blur-sm z-50` with `fade-in-0` animation
- Panel: `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-xl border border-zinc-200 w-full max-w-sm p-6`
- Header: "Reschedule Reminder" `font-semibold text-zinc-900` + `X` close button
- Body: `space-y-4`
  - Date input `type="date"` with `min` = today
  - Two buttons row `flex gap-2`: "Cancel" `flex-1 border border-zinc-200 rounded-lg py-2 text-sm` + "Reschedule" `flex-1 bg-brand-blue text-white rounded-lg py-2`
- Opens with `zoom-in-95 fade-in-0` animation

### No Results

`bg-white rounded-xl border border-zinc-200 py-16 text-center` + `text-sm text-zinc-400` "No reminders found"

**Pagination**: none — all results loaded at once (no load-more on this page)

---

## 11. Broadcasts (`/broadcasts`)

Page: `p-4 md:p-8`, content `max-w-2xl mx-auto`

### Layout: two-column (desktop) / stacked (mobile)

`flex flex-col lg:flex-row gap-6`

**Left: Compose form** (`flex-1`)
**Right: Broadcast history** (`w-full lg:w-80 shrink-0`)

### Compose Card

`bg-white rounded-xl border border-zinc-200 p-5 space-y-4`

**Filters row** `flex gap-2 flex-wrap`:
- Language select: `<select>` styled with global input class, 9 options (blank = All)
- Tag select: `<select>` with pharmacy patient tags

**Mode Toggle**:
Two pill buttons `rounded-full`:
- **Active**: `bg-emerald-600 text-white`
- **Inactive**: `bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50`
- Options: "Free text" / "Use template"

#### Free Text Mode

- **24h amber warning banner**: `bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-sm text-amber-700 flex items-start gap-2`
- Textarea: `min-h-[100px]` with `{{name}}` hint, char counter `text-xs text-zinc-400 text-right`

#### Template Mode

1. **Template dropdown** `<select>` with loading/error/empty states:
   - Loading: `animate-pulse` skeleton
   - Error: disabled select + "Retry" button `text-xs underline`
   - Empty: disabled select showing "No approved templates" + contact support note
   - Loaded: options by `elementName`

2. **Template preview**: read-only block, label "Template content · fixed by WhatsApp" `text-xs text-zinc-500`. Mobile: 2-line clamp + "Show full" toggle (`ChevronDown`/`ChevronUp`)

3. **Parameter mapping** (if template has `{{N}}` placeholders):
   One `<select>` per placeholder from `MAPPING_OPTIONS` (Patient name / Pharmacy name / Medicine list / Refill due in days). Rows > 4: `max-h-48 overflow-y-auto`

**Send button**: `w-full flex items-center justify-center gap-2 bg-brand-blue text-white rounded-lg py-2.5 text-sm font-medium` with `Send h-4 w-4`. Loading: `Loader2 + "Sending…"`. Disabled while `sending`.

### Broadcast History Card

`bg-white rounded-xl border border-zinc-200 p-5`

- Heading "History" `text-sm font-semibold text-zinc-900 mb-4`
- Each `BroadcastRow`:
  - `py-4 border-b border-zinc-100 last:border-0`
  - Left: message body `text-sm text-zinc-800 line-clamp-2` + meta row `text-xs text-zinc-400` (date + language tag if set)
  - Right: sent count `text-green-600` with `CheckCircle2 h-3.5 w-3.5` + failed count `text-red-500` with `XCircle h-3.5 w-3.5` (if > 0) + total recipients `text-xs text-zinc-400`
- Empty: `text-sm text-zinc-400 text-center py-8` "No broadcasts yet"
- Loading: spinner centered

---

## 12. Reports (`/reports`)

Page: `p-4 md:p-8 max-w-4xl`

- Summary stats cards
- Activity feed / message log table
- No pagination specified in current implementation

---

## 13. Settings (`/settings`)

Page: `p-4 md:p-8 max-w-2xl`

### Tab Bar

`flex gap-1 border-b border-zinc-200 mb-6 overflow-x-auto`

5 tabs: Profile / WhatsApp & Templates / Team / Billing / Data

Each tab: `px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px`
- **Active**: `border-brand-blue text-brand-blue`
- **Inactive**: `border-transparent text-zinc-500 hover:text-zinc-900`

URL synced: `?tab=profile` etc. via `useSearchParams`.

---

### Tab 13.1 — Profile

`bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100`

Uses `EditableField` inline-edit pattern for each row:
- Row: `group flex items-center justify-between py-3.5 border-b border-zinc-100 last:border-0`
- Label: `text-sm text-zinc-500 w-28 shrink-0`

**View mode**: value `text-sm font-medium text-zinc-900` + pencil icon `p-1.5 rounded-md hover:bg-zinc-100 opacity-0 group-hover:opacity-100`

**Edit mode**: input `flex-1 border border-zinc-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-brand-blue` + save button `p-1.5 rounded-md bg-brand-blue text-white` (Check/Loader2) + cancel button (X)

Fields: Pharmacy Name, Owner Name, Email, Phone, Timezone

**Change Password section** (collapsible accordion):
- Trigger: "Change Password" row with `ChevronDown`/`ChevronUp`
- Expanded: 3 password inputs (Current, New, Confirm) + "Update Password" button
- Validation: new ≥ 8 chars, confirm matches

---

### Tab 13.2 — WhatsApp & Templates

**WhatsApp Connection card** (`bg-white rounded-xl border border-zinc-200 p-5`):

- `WAStatusBadge` component at top
- Three states:
  - **Connected**: green dot + "Connected" + disconnect button
  - **Disconnected**: red dot + "Disconnected" + "Connect WhatsApp" button
  - **Reconnecting**: amber spinner
- QR code display area (when connecting): centered `<img>` inside `bg-zinc-50 rounded-lg p-4 border border-zinc-200` with "Scan with your WhatsApp" caption `text-xs text-zinc-400`
- Polling interval: every 3s while QR shown

**Message Templates card** (`bg-white rounded-xl border border-zinc-200 p-5`):

- Title "Message Templates" `text-sm font-semibold`
- Two default templates: Hindi and English
- Each: read-only textarea showing template text with `{variable}` placeholders highlighted
- Language label: `rounded-full bg-zinc-100 text-xs px-2 py-0.5`

**Gupshup Templates** (Pro only):

- Table: Template name / Status / Actions
- Status badges: Approved (emerald), Pending (amber), Rejected (red)
- "Request Template" button → form modal

---

### Tab 13.3 — Team

- Placeholder content in MVP: "Team members" section (coming soon or basic list)

---

### Tab 13.4 — Billing

**Balance card** (`bg-white rounded-xl border border-zinc-200 p-5`):

- Balance number: `text-4xl font-bold text-zinc-900` + "credits" label
- Status badge:
  - ≥ 50: `bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 text-sm` "Healthy"
  - 1–49: amber "Running low — top up soon"
  - ≤ 0: red "Credits exhausted — top up to continue sending reminders"
- Loading: `Skeleton` component

**Credit Pack Cards** (`grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4`):

Each `bg-white rounded-xl border border-zinc-200 p-4`:
- Pack label `font-semibold text-zinc-900`
- Credit count `text-2xl font-bold` + "credits"
- Price `text-lg text-zinc-600`
- "Most popular" pill on Popular pack: `bg-emerald-100 text-emerald-700 rounded-full text-xs px-2 py-0.5`
- "Buy" button: `w-full bg-brand-blue text-white rounded-lg py-2 text-sm font-medium` — disabled while `purchasing === packId`

Packs:
| Pack | Credits | Price |
|---|---|---|
| Starter | 100 | ₹99 |
| Popular | 350 | ₹299 |
| Pro | 1000 | ₹799 |

**Purchase flow**: Razorpay modal opens on "Buy" click. Script loaded lazily on first click.

**Transaction History table** (`overflow-x-auto`):

Columns: Date / Description / Amount

- `amount > 0`: `text-green-600` "+ {N}" + `CheckCircle2 h-4 w-4`
- `amount < 0`: `text-red-500` "− {N}" + `Minus h-4 w-4`
- Empty: `EmptyState` component "No transactions yet"

---

### Tab 13.5 — Data

- **Export data**: download CSV/JSON of patients + purchases
- `Download` icon button `border border-zinc-200 rounded-lg px-3 py-2 text-sm`
- **Danger zone**: delete account option with `AlertCircle` warning
- Delete button: `text-red-600 border border-red-200 hover:bg-red-50`

---

## 14. Shared Components

### `EmptyState`

`flex flex-col items-center justify-center py-12 px-4 text-center`
- Icon slot (customizable, e.g. `Building2 h-8 w-8 text-zinc-300`)
- Heading: `text-sm font-medium text-zinc-500 mt-3`
- Body: `text-xs text-zinc-400 mt-1`
- Optional action button

### `Skeleton`

`animate-pulse bg-zinc-100 rounded-lg` — height/width set by parent via className prop.

### `WAStatusBadge`

Inline badge showing WhatsApp connection status:
- `flex items-center gap-1.5 text-xs font-medium`
- Connected: `text-emerald-700` + green dot `h-1.5 w-1.5 rounded-full bg-emerald-500`
- Disconnected: `text-red-600` + red dot
- Reconnecting: `text-amber-600` + `Loader2 h-3 w-3 animate-spin`

### `Tag`

`rounded-full px-2 py-0.5 text-xs font-medium`

Color system — each tag has a `color` field mapping to a Tailwind-safe class:
- `emerald`: `bg-emerald-100 text-emerald-700`
- Other named colors: similar pattern using `bg-{color}-100 text-{color}-700`
- Logo color constants extracted in `frontend/lib/brandColors.ts`

### `ReminderCard`

`py-3 border-b border-zinc-100 last:border-0 flex items-center gap-3`
- Status dot `h-2 w-2 rounded-full` (blue=scheduled, brand-blue=sent, red=failed, zinc=cancelled)
- Patient name `text-sm font-medium text-zinc-900`
- Medicine `text-xs text-zinc-400`
- Date `text-xs text-zinc-400 ml-auto shrink-0`
- Optional action buttons (today's reminders only): `Mark Sent` + `Snooze 7d` icon-only buttons (`opacity-0 group-hover:opacity-100`)

### `ActivityFeed`

List of activity items:
- Each: `py-3 flex items-center gap-3 border-b border-zinc-100 last:border-0`
- Status icon (colored per event type)
- Description `text-sm text-zinc-700`
- Timestamp `text-xs text-zinc-400 ml-auto`

### `StatsBar`

4-column row of stat cards. On mobile: horizontally scrollable `flex gap-3 overflow-x-auto`.
Each card: `bg-white rounded-xl border border-zinc-200 p-4 shrink-0`
- Value: `text-2xl font-bold text-zinc-900`
- Label: `text-xs text-zinc-500 mt-0.5`

### `PatientModal`

Full-screen centered modal for adding/editing a patient:
- Overlay: `fixed inset-0 bg-black/50 z-50`
- Card: `bg-white rounded-xl shadow-xl w-full max-w-md`
- Fields: Name, Phone, WhatsApp (optional), Language (select), Notes (textarea)
- Footer: Cancel + Save buttons

### `AddPurchaseForm`

Inline form (used inside Patient Detail modal):
- Medicine name (with autocomplete)
- Quantity, Unit Price, Refill interval (days)
- Date purchased (date input)
- Submit: `bg-brand-blue text-white rounded-lg px-4 py-2 text-sm font-medium`

### `EasibillLogo`

SVG icon component. Props: `size: number`, `variant: 'on-light' | 'on-dark'`
- `on-light`: dark logo colors
- `on-dark`: white/light logo colors

---

## 15. Interactive Patterns

### Toast Notifications (Sonner)

Positioned bottom-right (Sonner default):
- `toast.success('...')` — green
- `toast.error('...')` — red
- Duration: Sonner default (~4s)

### Confirmation Dialogs

`window.confirm(...)` used for destructive actions:
- Cancel reminder: "Cancel reminder for {name} — {medicine}? This cannot be undone."
- Delete patient: "Delete patient {name}? This cannot be undone."
- Delete medicine: "Delete "{name}"? It will no longer appear in autocomplete."

### Focus Ring

All focusable inputs: `focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent`

### Hover Reveal Pattern

Actions that appear only on row hover: `opacity-0 group-hover:opacity-100 transition-opacity`
Used on: patient table chevron, reminders action buttons, EditableField pencil icon.

### Active Press Scale

Primary buttons: `active:scale-[0.98]` or `active:scale-[0.99]` (slight compress on click)

### Page-level Loading

Each page shows a centered `Loader2 h-5 w-5 animate-spin text-zinc-400` inside a height container while data loads, then swaps to content.

---

## 16. Responsive Breakpoints

| Breakpoint | Prefix | Width | Behavior |
|---|---|---|---|
| Mobile | (default) | < 640px | Stacked layout, bottom nav, condensed tables |
| Small | `sm:` | ≥ 640px | Some hidden columns appear, inline actions |
| Medium | `md:` | ≥ 768px | Desktop sidebar appears, top bar hidden, full padding |
| Large | `lg:` | ≥ 1024px | 2-column grids, tag columns, side panels |

---

## 17. Pagination Summary by Page

| Page | Pagination type |
|---|---|
| Patients | "Load more" button — server-side, 20/page |
| Reminders | None — all loaded at once |
| Broadcasts | None — history loaded at once |
| Inventory | None — full list loaded at once |
| Dashboard | None — fixed counts (today, upcoming 7 days, last 10 activity) |
| Patient detail | None — all purchases + messages loaded |
| Reports | None documented |
