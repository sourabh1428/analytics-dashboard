# Easibill UI Redesign Specification
> For Claude Code — implement all changes in priority order. Each fix includes the exact component/file context, the problem, and the precise Tailwind/code change.

---

## How to Use This Document

Work top-down. Each section is tagged with a priority:
- 🔴 **Critical** — broken UX, accessibility failures, or data-loss risk
- 🟠 **High** — significant friction, patterns that fail on touch/mobile
- 🟡 **Medium** — visual inconsistency, polish
- 🟢 **Low** — nice-to-have improvements

---

## 1. 🔴 Replace All `window.confirm()` with Radix AlertDialog

**Problem:** `window.confirm()` is an unbranded, inaccessible browser dialog. It blocks the JS thread, cannot be styled, breaks in sandboxed iframes, and provides a jarring experience. It is used for three destructive actions: cancel reminder, delete patient, delete medicine.

**Fix:** Create a shared `ConfirmDialog` component using Radix Dialog and use it everywhere.

### 1.1 New Component: `ConfirmDialog`

Create `frontend/components/ui/ConfirmDialog.tsx`:

```tsx
// Props: open, onOpenChange, title, description, confirmLabel, confirmVariant ('danger' | 'default'), onConfirm, loading
// confirmVariant='danger' → bg-red-600 hover:bg-red-700 text-white
// confirmVariant='default' → bg-brand-blue text-white

// Structure (use Radix Dialog primitives):
// Overlay: fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in-0
// Panel: fixed center z-50 bg-white rounded-xl shadow-xl border border-zinc-200 w-full max-w-sm p-6
//        animate-in fade-in-0 zoom-in-95 duration-150

// Layout inside panel:
// - AlertTriangle icon h-10 w-10 text-red-500 mx-auto mb-4 (for danger variant)
// - title: text-base font-semibold text-zinc-900 text-center
// - description: text-sm text-zinc-500 text-center mt-1
// - buttons: flex gap-2 mt-6
//   - Cancel: flex-1 border border-zinc-200 rounded-lg py-2 text-sm text-zinc-600 hover:bg-zinc-50
//   - Confirm: flex-1 rounded-lg py-2 text-sm font-medium text-white (color by variant)
//     - Loading state: Loader2 h-4 w-4 animate-spin inline
```

### 1.2 Replace in Patient List

```
// REMOVE: window.confirm(`Delete patient ${name}? This cannot be undone.`)
// ADD: <ConfirmDialog
//        title="Delete patient"
//        description={`"${name}" and all their purchase history will be permanently removed.`}
//        confirmLabel="Delete patient"
//        confirmVariant="danger"
//        onConfirm={handleDelete}
//      />
```

### 1.3 Replace in Reminders

```
// REMOVE: window.confirm(`Cancel reminder for ${name} — ${medicine}?...`)
// ADD: <ConfirmDialog
//        title="Cancel this reminder?"
//        description={`The scheduled reminder for ${name} (${medicine}) will be cancelled and cannot be undone.`}
//        confirmLabel="Cancel reminder"
//        confirmVariant="danger"
//      />
```

### 1.4 Replace in Inventory

```
// REMOVE: window.confirm(`Delete "${name}"? It will no longer appear in autocomplete.`)
// ADD: <ConfirmDialog
//        title="Remove medicine"
//        description={`"${name}" will be removed from your catalogue and autocomplete.`}
//        confirmLabel="Remove"
//        confirmVariant="danger"
//      />
```

---

## 2. 🔴 Fix Mobile Action Discoverability (Hover-Reveal Breaks on Touch)

**Problem:** Three places use `opacity-0 group-hover:opacity-100` to reveal action buttons. On touch devices (phones/tablets — your primary pharmacy audience), hover never fires. These actions are completely invisible on mobile.

### 2.1 Patient Table — Chevron Arrow

The chevron is already a link, just make the entire row clickable instead.

```
// CHANGE row from: hover:bg-zinc-50 transition-colors group cursor-default
// TO: hover:bg-zinc-50 transition-colors cursor-pointer (remove group class)
// CHANGE chevron column: remove opacity-0 group-hover:opacity-100
// ADD: ChevronRight always visible at opacity-60, text-zinc-400
```

### 2.2 Reminders Table — Action Buttons (Retry / Reschedule / Cancel)

**Fix:** On mobile (< sm), show a three-dot menu button that reveals actions. On desktop, keep hover-reveal.

```
// Action column: 
// - Desktop (sm+): keep opacity-0 group-hover:opacity-100 flex items-center gap-1
// - Mobile: add a single MoreHorizontal icon button (p-1.5, always visible, text-zinc-400)
//   that opens a small Radix DropdownMenu with the same actions listed as text items

// DropdownMenu item classes:
//   flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-zinc-50 rounded-md
//   Retry: text-blue-600
//   Reschedule: text-amber-600
//   Cancel: text-red-500

// Implementation: 
// <div className="flex items-center justify-end gap-1">
//   <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//     {/* existing icon buttons */}
//   </div>
//   <div className="sm:hidden">
//     <DropdownMenu>...</DropdownMenu>
//   </div>
// </div>
```

### 2.3 Settings EditableField — Pencil Icon

```
// CHANGE: pencil icon from opacity-0 group-hover:opacity-100
// TO: always visible, but subtle: text-zinc-300 hover:text-zinc-600
// This is especially important on Settings which users access on mobile
```

### 2.4 Inventory Edit/Delete Icons

```
// CHANGE: pencil/trash icon buttons
// Currently: always visible (good) — but confirm they have min touch target of 44px
// ADD: touch target wrapper if needed: min-h-[44px] min-w-[44px] flex items-center justify-center
```

---

## 3. 🔴 Fix Toast Position Conflict with Mobile Bottom Nav

**Problem:** Sonner toasts appear at `bottom-right`. On mobile, the bottom nav is 54px tall and fixed. Toasts will render beneath or overlapping the nav bar.

**Fix:** Configure Sonner's `position` and `offset` props in the root layout.

```tsx
// In your root layout or _app.tsx, update Toaster:

// CHANGE:
<Toaster />

// TO:
<Toaster
  position="top-center"        // top-center works everywhere
  offset="16px"
  toastOptions={{
    classNames: {
      toast: 'text-sm font-medium',
      success: 'border-l-4 border-l-emerald-500',
      error: 'border-l-4 border-l-red-500',
    }
  }}
/>

// On desktop ≥ md, you can use bottom-right via a media query approach,
// but top-center is universally safe and works better for pharmacists 
// who are often on tablets/mobile in a pharmacy setting.
```

---

## 4. 🔴 Add Password Show/Hide Toggle to All Password Inputs

**Problem:** No show/hide toggle exists on any password field. This causes friction especially for pharmacists typing long pharmacy/email passwords.

**Affects:** Login page, Register page, Reset Password page, Settings > Change Password.

### 4.1 Create `PasswordInput` component

```tsx
// frontend/components/ui/PasswordInput.tsx
// Wraps a standard input with a show/hide toggle button

// Layout: relative container
// Input: same classes as Standard Input + pr-10 (make room for toggle)
// Toggle button: absolute right-3 top-1/2 -translate-y-1/2
//   p-0.5 text-zinc-400 hover:text-zinc-600 transition-colors
//   Icon: Eye h-4 w-4 (when hidden) / EyeOff h-4 w-4 (when visible)
//   aria-label="Show password" / "Hide password"
//   type="button" (critical — prevents form submission)
```

### 4.2 Replace in all auth forms

```
// Login: password field → <PasswordInput />
// Register: password field → <PasswordInput />  
// Reset Password: both new + confirm fields → <PasswordInput />
// Settings > Change Password: all three fields → <PasswordInput />
```

---

## 5. 🔴 Fix Input Error States (Currently Undocumented/Missing)

**Problem:** No error state is defined for inputs. When validation fails, there's no visual feedback beyond potentially a toast. This is a fundamental form UX failure.

### 5.1 Error state classes (add to global input definition)

```
// Error state input:
// border-red-300 bg-red-50/30 focus:ring-red-400 focus:border-transparent

// Error message below input:
// <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
//   <AlertCircle h-3 w-3 /> {errorMessage}
// </p>
```

### 5.2 Apply to all forms

```
// Every <input> and <select> that can error should accept an `error` prop:
// - Name field (required)
// - Phone field (required, must be 10 digits)
// - Email field (required, must be valid email)
// - Password field (required, length constraints)
// - Medicine name in AddPurchaseForm (required)
// - Price field (must be positive number)
```

---

## 6. 🟠 Sidebar: Add Visual Grouping to 8 Nav Items

**Problem:** 8 flat items with no grouping creates cognitive load. Users have to scan all 8 items every time. The nav mixes actions (New Sale), records (Patients, Inventory), communications (Reminders, Broadcasts), and admin (Reports, Settings).

**Fix:** Add subtle section dividers with optional micro-labels.

```tsx
// Sidebar nav structure — add dividers between groups:

// GROUP 1 — no label (primary)
//   Dashboard
//   New Sale  ← style differently: bg-brand-blue text-white hover:bg-brand-blue/90
//              (not just a nav link — it's the primary action)

// DIVIDER: <div className="mx-3 my-1.5 border-t border-zinc-100" />

// GROUP 2 — optional label: <span className="px-3 pt-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">Patients</span>
//   Patients
//   Inventory

// DIVIDER

// GROUP 3 — label: "Messaging"
//   Reminders
//   Broadcasts

// DIVIDER

// GROUP 4 — label: "Admin"
//   Reports
//   Settings

// "New Sale" special styling:
// className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium 
//            bg-brand-blue text-white hover:bg-brand-blue/90 transition-all duration-100
//            shadow-sm active:scale-[0.98]"
// This makes it always visually prominent, even when not "active"
```

---

## 7. 🟠 Add Debounce to All Search Inputs

**Problem:** Search triggers on every keystroke with no debounce. At 142 patients, every character fires a query/filter. At scale this causes jank and unnecessary API calls.

**Fix:** Add 300ms debounce using `useDeferredValue` or a simple custom hook.

```tsx
// Create: frontend/hooks/useDebounce.ts
// export function useDebounce<T>(value: T, delay = 300): T {
//   const [debounced, setDebounced] = useState(value)
//   useEffect(() => {
//     const timer = setTimeout(() => setDebounced(value), delay)
//     return () => clearTimeout(timer)
//   }, [value, delay])
//   return debounced
// }

// Apply to:
// - Patient list search (currently triggers on change with no debounce)
// - New Sale Step 1 phone lookup (currently instant lookup)
//   → phone lookup: use 500ms since it's a network call
// - Autocomplete in Step 2 medicine name (currently instant)
//   → medicine autocomplete: use 250ms

// The search input UI should show a subtle loading indicator 
// (replace static Search icon with Loader2 animate-spin) 
// while debounce is pending:
// const isDebouncing = value !== debouncedValue
```

---

## 8. 🟠 Standardize All Modal Overlays and Add Entrance Animations

**Problem:** 4 modals have 3 different overlay opacities (`bg-black/50`, `bg-black/30`, `bg-black/30 backdrop-blur-sm`) and 2 have no entrance animation while 2 do. This is inconsistent and the ones without animation feel abrupt.

**Fix:** One standard for all.

```
// STANDARD OVERLAY (apply to ALL modals/dialogs):
// fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4
// animation: animate-in fade-in-0 duration-150

// STANDARD PANEL entrance:
// animate-in fade-in-0 zoom-in-95 duration-150
// (already done for Radix dialogs — apply same to custom modals)

// Update these modals:
// 1. Add Patient modal: change bg-black/50 → bg-black/40 backdrop-blur-[2px], add zoom-in-95
// 2. Add Purchase modal: change bg-black/30 → bg-black/40 backdrop-blur-[2px], add zoom-in-95
// 3. Reschedule dialog: already correct (Radix), just standardize overlay opacity
// 4. Delete confirm: → now handled by ConfirmDialog (item 1 above)

// Add exit animation too:
// animate-out fade-out-0 zoom-out-95 duration-100
```

---

## 9. 🟠 Patient Detail Tab Bar — Fix Inconsistent Active State

**Problem:** Patient detail tabs use `bg-zinc-900 text-white` for active state. Every other tab pattern in the app (Settings, Reminders filter) uses either `brand-blue` or `bg-white shadow-sm`. `bg-zinc-900` is jarring and disconnected from the brand.

```
// Patient detail Zone 2 tabs — CHANGE:
// Active: bg-zinc-900 text-white → bg-brand-blue text-white
// This aligns with filter pills, segmented controls, and badge patterns

// Full class for active tab:
// "rounded-full px-3 py-1.5 text-sm font-medium bg-brand-blue text-white transition-colors"

// Inactive tab stays the same:
// "rounded-full px-3 py-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
```

---

## 10. 🟠 Dashboard — Add Max-Width and Improve Quick Actions

**Problem A:** Dashboard has `w-full space-y-6` with NO max-width. On 1440px+ monitors with sidebar, content stretches 1156px wide. Stats cards become awkwardly wide; reminder cards lose readability.

**Problem B:** Quick action buttons are outlined/bordered — they look like secondary actions. "New Sale" is the primary user action and should look like it.

### 10.1 Add max-width to dashboard

```
// Dashboard page container — CHANGE:
// FROM: p-4 md:p-8 w-full space-y-6 md:space-y-8
// TO:   p-4 md:p-8 w-full max-w-[1280px] space-y-6 md:space-y-8
// (1280px is wide enough for large monitors but prevents unreadable line lengths)
```

### 10.2 Differentiate Quick Actions by hierarchy

```
// Quick Actions row — CHANGE button styles:

// "New Sale" (primary CTA):
// FROM: border border-zinc-200 bg-white text-zinc-700 shadow-sm
// TO:   bg-brand-blue text-white shadow-sm hover:bg-brand-blue/90 active:scale-[0.98]

// "Add Patient" (secondary):
// Keep: border border-zinc-200 bg-white text-zinc-700 — no change needed

// "New Broadcast" (tertiary, less frequent):  
// FROM: same as others
// TO:   border border-zinc-200 bg-white text-zinc-500 (slightly de-emphasize)

// This creates a clear visual hierarchy: blue → bordered → muted-bordered
```

### 10.3 Add trend indicators to stat cards

```
// Each StatCard — ADD below the value:
// A trend row: flex items-center gap-1 mt-1
// - Up arrow: TrendingUp h-3 w-3 text-emerald-500
// - Down arrow: TrendingDown h-3 w-3 text-red-400
// - Text: text-xs text-zinc-400 "vs last 30 days"
// Example: "↑ 12 this month" in text-xs text-emerald-600

// Only add this if trend data is available from API.
// If not available, skip and add the API endpoint later.
// Do NOT show skeleton/placeholder for this — simply omit the row.
```

---

## 11. 🟠 Add "Same as Phone" Toggle to Patient Forms

**Problem:** Both "Add Patient" modal and "New Sale > New Patient form" ask for a separate WhatsApp number. In India, ~90% of users have WhatsApp on the same number. Forcing them to re-type (or even see) a second field is friction.

**Fix:** Default to "same as phone" with a toggle to reveal the separate field.

```tsx
// In PatientModal and New Sale Step 1 new patient form:
// REPLACE the always-visible WhatsApp input with:

// A checkbox row: flex items-center gap-2 mt-1
//   <input type="checkbox" id="wa-same" defaultChecked className="rounded" />
//   <label htmlFor="wa-same" className="text-xs text-zinc-500 cursor-pointer">
//     WhatsApp is the same number
//   </label>

// When unchecked, reveal the WhatsApp input with a smooth transition:
// <div className={cn("overflow-hidden transition-all", waIsSame ? "max-h-0" : "max-h-20 mt-3")}>
//   <label>WhatsApp number</label>
//   <input ... />
// </div>

// When saving: if waIsSame is true, set whatsapp_number = phone_number
```

---

## 12. 🟠 Reminders Page — Make Actions Always Visible on Mobile + Add Pagination

**Problem A:** Covered in item 2 — also apply the mobile dropdown solution here.

**Problem B:** "All reminders loaded at once" with 247+ records. This is a performance problem. No virtualization, no pagination.

### 12.1 Add pagination to Reminders

```
// Reminders API: add server-side pagination, 25 per page
// UI: add "Load more" button (same pattern as Patients list)
// Position: bottom of table, same style as Patients load-more

// CHANGE page description:
// "247 total" → "Showing 25 of 247"  (text-sm text-zinc-400)

// Load more button: same style as Patient list:
// px-4 py-2 text-sm font-medium text-zinc-600 border border-zinc-200 rounded-lg 
// hover:bg-zinc-50 disabled:opacity-50
// "Load more (222 remaining)"
```

### 12.2 Failed error message: show full, not truncated

```
// Error text below failed status badge — CHANGE:
// FROM: max-w-[160px] truncate
// TO:   max-w-[240px] (wider) — or remove truncation entirely and let it wrap
// The error message is actionable context; pharmacists need to read it

// If the error is very long, use line-clamp-2 instead of truncate:
// className="text-xs text-red-400 mt-1 line-clamp-2"
```

---

## 13. 🟠 New Sale Step 2 — Surface Refill Days by Default

**Problem:** Refill days is the most important data for the whole product — it determines WHEN the reminder fires. Hiding it behind a `⚙` toggle means pharmacists will skip it, causing reminders to fire on wrong dates.

**Fix:** Show refill days as a normal column. Remove the cog toggle.

```
// MedicineRow — CHANGE:
// FROM: refill days hidden behind ⚙ toggle, expandable sub-row
// TO:   Add "Days" as a 4th inline input column, always visible

// Updated column layout (desktop):
// [Medicine name flex-1] [₹ Price w-20] [Qty w-14] [Days w-14] [Subtotal w-14] [Trash w-8]

// Column header row — ADD "Days" header:
// "Medicine" | "Price (₹)" | "Qty" | "Days" | "" | ""
// text-xs text-zinc-400

// Remove the ⚙ settings cog toggle button entirely
// Remove the expandable sub-row
// Move refill days input inline, same style as price/qty inputs

// Mobile: keep the 3-column grid for Price/Qty/Days (remove old 2-col grid with cog)
// Mobile line 2: grid-cols-3 gap-2 (Price | Qty | Days) — each with label above
```

---

## 14. 🟠 Inventory — Add Search Filter

**Problem:** With even 30+ medicines, the list becomes hard to navigate. There's no search.

```tsx
// Above the medicine list card, add a search input:
// Same style as Patient search: relative, Search icon left-3, pl-9, py-2 text-sm
// placeholder: "Filter medicines…"
// Filter is client-side (no API call needed — list is loaded once)
// useMemo to filter by name, case-insensitive

// Position: between add-medicine card and list card
// Add mb-3 gap

// Show count when filtering:
// "{filteredCount} of {totalCount} medicines" text-xs text-zinc-400 mt-2 text-right
```

---

## 15. 🟡 Standardize `<select>` Elements Across the App

**Problem:** Native `<select>` elements are used in 8+ places. They look inconsistent across browsers — especially bad on Windows where they have a very different default appearance. They also don't match the input styling.

**Affected:** Language select in PatientModal, Broadcasts (language + tag selects), template select, parameter mapping selects, Inventory (none), New Sale Step 1 language select.

**Fix:** Wrap all `<select>` elements with a consistent styled wrapper.

```tsx
// Create: frontend/components/ui/Select.tsx (simple native select wrapper — NOT radix)
// A lightweight wrapper that ensures cross-platform consistency:

// className for the select element:
// "w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white
//  text-zinc-900 appearance-none cursor-pointer
//  focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent
//  disabled:opacity-50 disabled:cursor-not-allowed"

// Wrapper: relative
// Add a ChevronDown icon: absolute right-3 top-1/2 -translate-y-1/2 
//   h-4 w-4 text-zinc-400 pointer-events-none

// This removes browser-default styling while keeping native select behavior
// (which is actually GOOD on mobile — uses the native picker, which is fast)
```

---

## 16. 🟡 Fix Low-Contrast Text Across the App

**Problem:** `text-zinc-400` (#a1a1aa on white) has a contrast ratio of ~2.85:1. WCAG AA requires 4.5:1 for normal text and 3:1 for large text. This affects timestamps, phone numbers, secondary labels, and empty state text.

**Audit of zinc-400 usages — change to zinc-500 (#71717a = 4.6:1 on white):**

```
// CHANGE these specific usages from text-zinc-400 → text-zinc-500:
// - ReminderCard: medicine name text-xs
// - ReminderCard: date text-xs  
// - Patient table: "Added" date column
// - Patient table: phone number (currently zinc-500 — keep)
// - Dashboard stat card labels: text-xs text-zinc-500 (already correct)
// - Broadcast history: date/meta row text-xs
// - New Sale Step 1: helper text below button
// - Inventory: empty state subtitle text-xs

// KEEP zinc-400 only for:
// - Placeholder text inside inputs (this is intentional — less prominent)
// - Skeleton/loading states
// - Decorative dividers/dots

// Summary: any zinc-400 text that conveys information → zinc-500
//          any zinc-400 text that is decorative/placeholder → keep
```

---

## 17. 🟡 Billing Page — Add Credit Context and Value Explanation

**Problem:** The billing page shows "247 credits" and pack options (100/350/1000) with no explanation of what a credit does. First-time users don't know the value proposition.

```tsx
// Below the balance number, ADD a context line:
// <p className="text-xs text-zinc-400 mt-1">1 credit = 1 WhatsApp message sent</p>

// On the credit pack cards, ADD a "covers X messages" sub-label:
// Below the credit count, in text-xs text-zinc-400:
// Starter (100 credits): "Good for ~100 reminders"
// Popular (350 credits): "Good for ~350 reminders"  
// Pro (1000 credits): "Good for ~1,000 reminders"

// Position: between "100 credits" and "₹99" price
// className: "text-xs text-zinc-400 mt-0.5 mb-1"
```

---

## 18. 🟡 New Sale Success Screen — Add More Completion Actions

**Problem:** After completing a sale, the user only gets "New Sale" or "View Patients". No option to view the specific patient who just purchased.

```tsx
// Success screen — CHANGE button layout:
// FROM: [New Sale] [View Patients]
// TO:   [New Sale] [View {patientName}] [All Patients]

// "View {patientName}":
// bg-white border border-zinc-200 text-zinc-700 rounded-xl py-3 text-sm
// Routes to /patients/{patientId}

// Also ADD a small receipt summary on the success screen:
// Below the "Sale recorded!" heading:
// Patient name: text-base font-semibold zinc-900
// Items and total: text-sm zinc-500
// "WhatsApp confirmation sent" (if opted in): text-xs text-emerald-600 flex items-center gap-1
//   CheckCircle2 h-3 w-3 "Confirmation sent to {phone}"
```

---

## 19. 🟡 Auth Pages — Reduce Register Friction

**Problem:** The register form has 5 fields. Pharmacy Name, Owner Name, WhatsApp Number, Email, and Password. WhatsApp is the most friction-inducing field at sign-up — users don't know if you need it, why you need it, or whether their number will be shared.

**Fix:** Move WhatsApp connection to onboarding Step 2 where there's better context. Keep registration to 4 fields.

```
// Register page — REMOVE the WhatsApp Number field
// The WhatsApp number will be collected in Onboarding Step 2 (Connect WhatsApp)
// where the QR code flow provides natural context

// Register form fields (reduced to 4):
// 1. Pharmacy Name
// 2. Owner Name  
// 3. Email
// 4. Password

// UPDATE Onboarding Step 2 copy:
// Add below the QR code: "Your WhatsApp account is the number patients will see on messages."
// After connecting, store the WhatsApp number from the session

// This reduces registration drop-off and makes the first step feel lighter
```

---

## 20. 🟡 Broadcasts — Add Message Preview

**Problem:** In free-text mode, pharmacists type `Hello {{name}}` but never see how it looks with a real name substituted. They can easily send "Hello {{name}}" literally if they forget the syntax.

```tsx
// Below the textarea (or beside it on desktop), ADD a live preview panel:
// Only show when textarea has content

// Preview container:
// mt-3 rounded-lg bg-zinc-50 border border-zinc-200 p-3

// Preview header: text-xs text-zinc-400 mb-2 "Preview (with sample data)"

// Preview content: text-sm text-zinc-800 whitespace-pre-wrap
// Replace {{name}} with "Ravi Kumar" (first patient name or "Ravi Kumar" as placeholder)
// Replace {{pharmacy}} with actual pharmacy name from context

// If no variables: show a subtle "No variables detected" in text-xs zinc-400

// Variable detection: scan for {{...}} patterns and highlight substituted text
// in the preview with: bg-brand-blue/10 text-brand-blue rounded px-0.5 (inline span)
```

---

## 21. 🟡 Mobile Bottom Nav — Reconcile with Desktop Sidebar (8 vs 5 items)

**Problem:** Desktop sidebar has 8 nav items; mobile bottom nav has only 5. "Reminders", "Broadcasts", and "Reports" are missing from mobile nav. Users who switch between devices lose navigation consistency.

**Fix:** Keep bottom nav to 5 but ensure the missing pages are accessible.

```tsx
// Mobile bottom nav — keep 5 slots but reorder:
// 1. Home (Dashboard) — LayoutDashboard icon
// 2. New Sale — ShoppingCart icon (primary action, center position) 
//    STYLE: bg-brand-blue/10 text-brand-blue rounded-xl for the icon area
//    This makes New Sale visually prominent as the center action
// 3. Patients — Users icon
// 4. Reminders — Bell icon (replace Inventory — more time-sensitive)
// 5. More — MoreHorizontal icon → opens a bottom sheet or menu with:
//    - Inventory
//    - Broadcasts  
//    - Reports
//    - Settings

// "More" drawer: slides up from bottom, bg-white rounded-t-2xl
// List of remaining nav items with icons
// Same active state: text-brand-blue

// If a "More" drawer is too complex for now:
// Simpler alternative: replace "Inventory" slot with "Reminders"
// and make Inventory accessible via Settings or a deep link
```

---

## 22. 🟡 Patient Detail — Fix Info Density in Header Card

**Problem:** Zone 1 header card shows: avatar + name + phone + language + tags (Row A), then opted-out banner, then stats strip (Row B), then tags again (Row C). The tags appear in Row A AND Row C — this is a duplicate. The banner breaks the visual flow awkwardly.

```tsx
// Zone 1 — RESTRUCTURE:

// Row A: avatar + name + phone
//   avatar: keep h-12 w-12
//   name: text-xl font-semibold (keep)
//   phone: text-sm text-zinc-500 (keep)
//   REMOVE language badge from Row A — move to Row C with tags

// Row A right side: Edit | Delete | New Sale (keep same)

// MOVE opted-out banner: place ABOVE the stats strip (Row B), 
//   NOT between Row A and stats — makes the flow A → banner → B → C cleaner
//   Actually, keep it where it is but add mt-3 mb-0 to make spacing intentional

// Row C (tags): ADD language badge as first item in tags row
//   [Hindi] [Diabetic] [BP] [+ tag]
//   This consolidates identity info in one place

// Add border-t border-zinc-100 pt-3 between Row C and the tabs
// to create visual separation
```

---

## 23. 🟡 Unify Stat Card Accent Colors

**Problem:** Stat cards on the Dashboard use `border-l-4` with a colored left border, but the color source is never defined. This is a dangling spec that could result in all cards having the same default color.

**Fix:** Define explicit colors per stat.

```tsx
// Dashboard StatCard — define border-l-4 colors:
// Total Patients:     border-l-brand-blue
// Active Reminders:   border-l-amber-400
// Sent This Month:    border-l-emerald-400
// WhatsApp Status:    border-l-zinc-300 (neutral, since it's a status not a metric)

// Also define the icon background color per card (the 26×26px icon container):
// Total Patients:     bg-brand-blue/10 text-brand-blue
// Active Reminders:   bg-amber-50 text-amber-500
// Sent This Month:    bg-emerald-50 text-emerald-500  
// WhatsApp Status:    bg-zinc-100 text-zinc-500

// This creates a coherent color system where border accent = icon accent
```

---

## 24. 🟢 Empty States — Improve Visual Impact

**Problem:** Empty state icons are `text-zinc-300` — nearly invisible. Empty states are an opportunity to guide users; the current implementation is too passive.

```tsx
// Empty state icons — CHANGE:
// FROM: text-zinc-300
// TO:   text-zinc-200 with a background circle:
//   <div className="h-16 w-16 rounded-full bg-zinc-50 border border-zinc-100 
//                   flex items-center justify-center mb-4 mx-auto">
//     <BuildingIcon className="h-8 w-8 text-zinc-300" />
//   </div>

// Empty state heading — CHANGE:
// FROM: text-sm font-medium text-zinc-500
// TO:   text-base font-semibold text-zinc-700 (more readable, more authority)

// Empty state body — CHANGE:
// FROM: text-xs text-zinc-400
// TO:   text-sm text-zinc-400 (more legible)

// Apply to: Dashboard empty, Patients empty, Inventory empty, 
//           Reminders empty, Broadcasts history empty
```

---

## 25. 🟢 Add Skeleton Loading to More Pages

**Problem:** Only Patient Detail has skeleton loading. All other pages show a centered spinner (`Loader2`) in a 256px container. This causes layout shift and feels slower than it is.

```tsx
// Pages to add skeleton loading:
// 1. Patients list: skeleton table rows (3-5 of them)
//    Each: h-12 w-full bg-zinc-100 animate-pulse rounded-lg mb-1
// 2. Reminders: same pattern — skeleton rows
// 3. Inventory medicine list: same
// 4. Dashboard stats: 4 skeleton stat cards
//    h-24 bg-zinc-100 animate-pulse rounded-xl

// Keep full-page Loader2 only for auth-gated redirects and initial app boot
// For data-fetching within pages, always use skeletons that match the content shape

// Skeleton helper (already exists as generic Skeleton component):
// Use it with: <Skeleton className="h-12 w-full" /> etc.
```

---

## 26. 🟢 Broadcasts — Replace Language/Tag `<select>` with Better UX

**Problem:** The language and tag filters in Broadcasts are plain `<select>` elements that look inconsistent. More importantly, "Language = All" means ALL patients — but there's no count shown.

```tsx
// Broadcasts compose card — filter row CHANGE:

// Replace plain selects with labeled filter pills (same pattern as Patients page):
// Row: flex gap-2 flex-wrap items-center mb-4

// Language filter: 
// [All] [Hindi] [English] [Telugu] [Tamil] etc.
// Show counts: [Hindi (43)] [English (12)] etc.
// Use filter pill pattern from Patients page

// Tag filter (can stay as select since there can be many tags):
// Style it with the standardized Select component from item 15

// Recipient count (ADD):
// After selecting filters, show below: 
// "Sending to 43 patients" text-sm text-zinc-600
// Updates reactively as filters change
// This is the most important missing piece — pharmacists need to know reach before sending
```

---

## 27. 🟢 Add Keyboard Shortcut Hints for Power Users

**Problem:** Pharmacists use this at a counter, often processing patients quickly. No keyboard shortcuts are documented or visible.

```tsx
// Add the following keyboard shortcuts:
// n → /new-sale (from any page)
// p → /patients
// r → /reminders
// Escape → close any open modal

// Show hints: in each modal header, tiny kbd hint
// Example in Add Patient modal header:
// <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
//   <h2 className="text-sm font-semibold text-zinc-900">Add Patient</h2>
//   <div className="flex items-center gap-3">
//     <kbd className="hidden sm:inline text-xs text-zinc-300 font-mono 
//                     bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-200">esc</kbd>
//     <button ...>✕</button>
//   </div>
// </div>

// Implementation: useEffect with keydown listener in a useKeyboardShortcuts hook
// Only activate when no input is focused (document.activeElement is not an input/textarea)
```

---

## 28. 🟢 Improve Mobile Top Bar

**Problem:** Mobile top bar shows `[logo] Easibill [pharmacy name] [logout]`. The pharmacy name in the center is truncated and users can't tap it for anything useful. "Easibill" and pharmacy name compete for space.

```tsx
// Mobile top bar — RESTRUCTURE:
// FROM: [logo] [Easibill] [pharmacy name] [logout]
// TO:   [logo] [pharmacy name] [logout]
// Remove "Easibill" text from mobile top bar — the logo implies the brand

// Pharmacy name: flex-1 font-medium text-sm text-zinc-900 truncate
// tap → no action (or could open a "switch pharmacy" drawer later)

// This gives more horizontal space to the pharmacy name
// which is actually what the pharmacist wants to see ("which store am I logged into")
```

---

## Summary Checklist for Claude Code

Implement in this order:

**Phase 1 — Critical (do first, nothing else ships without these):**
- [ ] 1. Replace all `window.confirm()` with `ConfirmDialog` component
- [ ] 2. Fix mobile action discoverability (hover-reveal → always visible / dropdown)
- [ ] 3. Fix toast position (top-center, safe from bottom nav)
- [ ] 4. Add password show/hide toggle to all password inputs
- [ ] 5. Add input error states globally

**Phase 2 — High (significant UX fixes):**
- [ ] 6. Sidebar nav grouping with dividers
- [ ] 7. Add debounce to all search/lookup inputs
- [ ] 8. Standardize modal overlays and add animations
- [ ] 9. Patient detail tab active state → brand-blue
- [ ] 10. Dashboard max-width + quick action hierarchy
- [ ] 11. Add "Same as phone" toggle to patient forms
- [ ] 12. Reminders pagination + wider error messages
- [ ] 13. New Sale Step 2 — show refill days inline, remove cog
- [ ] 14. Inventory search filter

**Phase 3 — Medium (polish and consistency):**
- [ ] 15. Standardize native `<select>` elements
- [ ] 16. Fix low-contrast zinc-400 text → zinc-500
- [ ] 17. Billing: add credit value context
- [ ] 18. New Sale success screen: add patient link + WhatsApp confirmation
- [ ] 19. Register form: remove WhatsApp field (move to onboarding)
- [ ] 20. Broadcasts: add live message preview
- [ ] 21. Mobile bottom nav: add "Reminders" slot, move Inventory to "More"
- [ ] 22. Patient detail Zone 1: remove duplicate tag display
- [ ] 23. Dashboard stat cards: define per-card accent colors

**Phase 4 — Low (progressive enhancement):**
- [ ] 24. Empty states: improve icon container and text size
- [ ] 25. Add skeleton loading to Patients, Reminders, Inventory, Dashboard
- [ ] 26. Broadcasts filter: add recipient count display
- [ ] 27. Add keyboard shortcuts for power users
- [ ] 28. Mobile top bar: remove "Easibill" text, show pharmacy name only

---

## Global Design Token Additions

Add these to `tailwind.config.js` or your globals if not already present:

```js
// Ensure these are explicitly defined (not just using Tailwind defaults):
colors: {
  'brand-blue': '#2563EB',  // or your actual hex — define it once here
  // If brand-blue is already defined, document the hex here for consistency
}

// Add these animation utilities if not already in the config:
animation: {
  'in': 'in 0.15s ease-out',
  'out': 'out 0.1s ease-in',
}
keyframes: {
  'zoom-in-95': { '0%': { transform: 'scale(0.95)' }, '100%': { transform: 'scale(1)' } },
  'zoom-out-95': { '0%': { transform: 'scale(1)' }, '100%': { transform: 'scale(0.95)' } },
}
// (Or use tailwindcss-animate plugin which provides all of these)
```

---

## Notes for Claude Code

1. **Do not change any API contracts or data shapes** — all changes are purely UI/UX.
2. **Each item can be implemented independently** — they don't depend on each other.
3. **Test on mobile viewport (375px)** after implementing items 2, 3, 21, and 28.
4. **The ConfirmDialog component (item 1) is a prerequisite** for items that currently use `window.confirm()`.
5. **When in doubt on exact hex for brand-blue**, check `tailwind.config.js` — use whatever is already defined there.