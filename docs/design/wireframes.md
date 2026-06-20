# Easibill — Pixel-Precise Wireframes

> All measurements derived directly from Tailwind classes in the codebase.
> Every element annotated with exact px width × height.

---

## Measurement Reference

### Tailwind Spacing → px

| Class | px |   | Class | px |
|---|---|---|---|---|
| `p-0.5` / `py-0.5` | 2px | | `p-4` / `py-4` | 16px |
| `p-1` / `py-1` | 4px | | `p-5` / `py-5` | 20px |
| `p-1.5` / `py-1.5` | 6px | | `p-6` / `py-6` | 24px |
| `p-2` / `py-2` | 8px | | `p-7` / `py-7` | 28px |
| `p-2.5` / `py-2.5` | 10px | | `p-8` / `py-8` | 32px |
| `p-3` / `py-3` | 12px | | `p-10` / `py-10` | 40px |
| `p-3.5` / `py-3.5` | 14px | | `p-12` / `py-12` | 48px |

### Font → line-height

| Class | font-size | line-height |
|---|---|---|
| `text-xs` | 12px | 16px |
| `text-sm` | 14px | 20px |
| `text-base` | 16px | 24px |
| `text-xl` | 20px | 28px |
| `text-2xl` | 24px | 32px |
| `text-4xl` | 36px | 40px |

### Icon sizes

| Class | px |
|---|---|
| `h-3 w-3` | 12×12 |
| `h-3.5 w-3.5` | 14×14 |
| `h-4 w-4` | 16×16 |
| `h-4.5 w-4.5` | 18×18 |
| `h-5 w-5` | 20×20 |
| `h-6 w-6` | 24×24 |
| `h-8 w-8` | 32×32 |

### Max-widths

| Class | px |
|---|---|
| `max-w-sm` | 384px |
| `max-w-md` | 448px |
| `max-w-lg` | 512px |
| `max-w-2xl` | 672px |
| `max-w-3xl` | 768px |
| `max-w-4xl` | 896px |

### Computed element heights (content + padding, no border)

| Element | Tailwind | Height |
|---|---|---|
| Standard input | `py-2 text-sm` | 8+20+8 = **36px** |
| Standard input lg | `py-2.5 text-sm` | 10+20+10 = **40px** |
| Small input | `py-1.5 text-sm` | 6+20+6 = **32px** |
| Primary button | `py-2.5 text-sm` | 10+20+10 = **40px** |
| Standard button | `py-2 text-sm` | 8+20+8 = **36px** |
| Large button | `py-3 text-sm` | 12+20+12 = **44px** |
| Filter pill | `py-1.5 text-xs` | 6+16+6 = **28px** |
| Tag badge | `py-0.5 text-xs` | 2+16+2 = **20px** |
| Status badge | `py-1 text-xs` | 4+16+4 = **24px** |
| Table row | `py-3.5 text-sm` | 14+20+14 = **48px** |
| Table header | `py-3 text-xs` | 12+16+12 = **40px** |
| Card header | `py-4 text-sm` | 16+20+16 = **52px** |
| Nav link | `py-2 text-sm h-4 icon` | 8+max(20,16)+8 = **36px** |
| Mobile nav slot | `py-2 h-5 icon + text-xs` | 8+20+2+16+8 = **54px** |
| Icon button sm | `p-1.5 h-3.5` | 6+14+6 = **26px** sq |
| Icon button md | `p-2 h-4` | 8+16+8 = **32px** sq |
| Settings cog btn | `p-1.5 h-3.5` | 6+14+6 = **26px** sq |
| Trash btn | `p-2 h-4` | 8+16+8 = **32px** sq |

---

## 1. Atoms

### 1.1 Standard Input Field

```
Total: width varies × 38px (36px + 2px border)
Focus ring: 2px brand-blue, no border offset

┌─────────────────────────────────────┐  ← border 1px zinc-200, rounded-lg (8px)
│  Placeholder text…                  │  ← px-3 (12px), py-2 (8px), text-sm (14px/20px)
└─────────────────────────────────────┘

         ↑ 8px ↑ 20px (line-height) ↑ 8px ↑  = 36px inner, 38px outer

Focus state:
┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐  ← ring-2 brand-blue (2px outside border)
│  Placeholder text…                  │
└╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘
```

### 1.2 Input with Left Icon (Search)

```
Total: w-full × 38px

┌─────────────────────────────────────┐
│ 🔍  Search by name or phone…        │
│ ←12→←9→                             │
└─────────────────────────────────────┘
  icon: 16×16px
  icon left offset: left-3 = 12px from border
  icon vertically centered
  input padding-left: pl-9 = 36px (icon 16 + gap ~12 + border 1)
  input padding-right: pr-4 = 16px
```

### 1.3 Primary Button

```
Width: w-full OR auto   Height: 40px (py-2.5 + text-sm)

┌──────────────────────────────────────┐  ← bg-brand-blue, rounded-lg (8px)
│           Sign in                    │  ← text-sm (14px), font-medium, text-white
└──────────────────────────────────────┘
  padding: px-4 (16px) py-2.5 (10px)
  hover: bg-brand-blue/90
  active: scale-[0.98]
  disabled: opacity-50

Loading state (icon + text):
┌──────────────────────────────────────┐
│  ◌  Signing in…                      │  ← Loader2 h-4 (16×16), gap-2 (8px)
└──────────────────────────────────────┘
```

### 1.4 Stepper Large Button (New Sale CTA)

```
Width: w-full   Height: 44px (py-3 + text-sm)

┌──────────────────────────────────────┐  ← bg-brand-blue, rounded-xl (12px)
│           Continue →                 │  ← text-sm (14px), font-medium
└──────────────────────────────────────┘
  padding: py-3 (12px)
  active: scale-[0.99]
```

### 1.5 Secondary / Outline Button

```
Height: 36px (py-2 + text-sm)

┌──────────┐  ← border border-zinc-200, rounded-lg, bg-white
│  Import  │  ← text-sm, text-zinc-600, px-3 (12px)
└──────────┘
  hover: bg-zinc-50
  Width: auto (content + 24px padding)
```

### 1.6 Filter Pill (rounded-full)

```
Height: 28px (py-1.5 + text-xs)

Active:   ╭──────────────╮  ← bg-brand-blue, text-white, rounded-full
          │   Scheduled  │  ← text-xs (12px), font-medium, px-3 (12px)
          ╰──────────────╯

Inactive: ╭──────────────╮  ← bg-white, border-zinc-200, text-zinc-600
          │   Scheduled  │
          ╰──────────────╯
  hover: bg-zinc-50
  Width: auto (~88px for "Scheduled")
```

### 1.7 Segmented Control (Reminders filter)

```
Outer: bg-zinc-100, rounded-lg (8px), p-1 (4px all sides)
Total outer height: 4+28+4 = 36px

╔═══════════════════════════════════════════╗  ← bg-zinc-100 rounded-lg, p-1
║ ┌─────┐  Scheduled  Sent  Failed  Cancel ║
║ │ All │                                  ║  ← active: bg-white shadow-sm
║ └─────┘                                  ║  ← inactive: text-zinc-500
╚═══════════════════════════════════════════╝
  Each segment: px-3 (12px) py-1.5 (6px) text-xs (12px/16px)
  Each segment height: 6+16+6 = 28px
  Outer total: 4+28+4 = 36px
```

### 1.8 Status Badge (Reminders table)

```
Height: 24px (py-1 + text-xs)   Width: auto

Scheduled: ╭──────────────────╮  bg-blue-50, text-blue-700
           │  ● Scheduled     │  dot: h-1.5 w-1.5 (6×6px) bg-blue-500
           ╰──────────────────╯  px-2 (8px), gap-1.5 (6px)

Sent:      ╭──────────────────╮  bg-brand-blue/10, text-brand-blue
           │  ● Sent          │  dot: bg-brand-blue
           ╰──────────────────╯

Failed:    ╭──────────────────╮  bg-red-50, text-red-700
           │  ● Failed        │  dot: bg-red-500
           ╰──────────────────╯

Cancelled: ╭──────────────────╮  bg-zinc-100, text-zinc-500
           │  ● Cancelled     │  dot: bg-zinc-300
           ╰──────────────────╯

  badge height: 4+16+4 = 24px
  rounded-md (6px)
```

### 1.9 Tag Badge

```
Height: 20px (py-0.5 + text-xs)
╭────────────╮  ← rounded-full, bg-{color}-100, text-{color}-700
│  Diabetic  │  ← text-xs (12px), px-2 (8px)
╰────────────╯
  Width: auto (~76px for "Diabetic")
```

### 1.10 Avatar (Initials)

```
Patient list:       Patient detail:    Sidebar user:
32×32px             48×48px            24×24px
 ╭──╮                ╭────╮             ╭─╮
 │RS│  h-8 w-8       │ RS │  h-12 w-12  │R│  h-6 w-6
 ╰──╯  rounded-full  ╰────╯             ╰─╯
  bg-zinc-100        bg-zinc-100        bg-zinc-200
  text-xs            text-sm            text-xs
  text-zinc-600      text-zinc-600      text-zinc-700
```

### 1.11 Icon Buttons

```
Small (p-1.5, h-3.5 icon):   26×26px total
┌───┐
│ ✎ │  ← h-3.5 w-3.5 (14×14px), p-1.5 (6px), rounded-md
└───┘
hover: bg-zinc-100
opacity-0 → group-hover:opacity-100

Medium (p-2, h-4 icon):      32×32px total
┌────┐
│ 🗑 │  ← h-4 w-4 (16×16px), p-2 (8px), rounded-md
└────┘

Action button inline (p-1.5, h-3.5):   26×26px
Retry (RotateCcw):  hover:text-blue-600
Reschedule (Calendar): hover:text-amber-600
Cancel (X): hover:text-red-500
```

### 1.12 WAStatusBadge

```
Height: ~20px (text-xs + icon)

Connected:    ● Connected      ← dot: h-1.5 w-1.5 (6×6) bg-emerald-500
                                  text-xs text-emerald-700, gap-1.5 (6px)

Disconnected: ● Not connected  ← dot: bg-red-400, text-red-600

Reconnecting: ◌ Reconnecting  ← Loader2 h-3 w-3 (12×12), text-amber-600
```

### 1.13 "Load more" Button

```
Width: auto   Height: 36px (py-2 + text-sm)

         ┌───────────────────────────────┐
         │  Load more (23 remaining)     │  ← px-4 py-2, text-sm, text-zinc-600
         └───────────────────────────────┘
            border-zinc-200, rounded-lg, hover:bg-zinc-50
```

### 1.14 Dashed "Add medicine" Button

```
Width: w-full   Height: ~40px (py-2.5 + text-sm)

┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   ← border-dashed border-zinc-300
  + Add another medicine                    rounded-lg, text-sm, text-zinc-500
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   hover: border-emerald-400 text-emerald-600
  py-2.5 (10px), justify-center, gap-1.5 (6px)
  icon: Plus h-4 (16×16)
```

### 1.15 Inline EditableField (Settings)

```
Total row height: ~48px (py-3.5 top+bottom + text-sm)
Width: full card width (~560px at max-w-2xl - padding)

View mode:
──────────────────────────────────────────────────── ← border-b zinc-100
 Pharmacy name          Sharma Medical Store  [✎]    ← pencil opacity-0 → group-hover
   ↑ w-28 (112px)                                       icon h-3.5 (14px), p-1.5
 text-sm text-zinc-500   text-sm font-medium          26×26px button
──────────────────────────────────────────────────── 
 py-3.5 (14px) each side → row = 14+20+14 = 48px

Edit mode:
──────────────────────────────────────────────────── 
 Pharmacy name  ┌────────────────┐  [✓]  [✗]
                │ Sharma Medical │       ← check: p-1.5 bg-brand-blue text-white, 26×26
                └────────────────┘       ← cancel: p-1.5 hover:bg-zinc-100, 26×26
                   flex-1
────────────────────────────────────────────────────
```

---

## 2. Layout Shell

### 2.1 Desktop Layout (≥ 768px)

```
Total viewport: e.g. 1440 × 900px

┌────────────┬──────────────────────────────────────────────────────────┐
│            │                                                          │
│  SIDEBAR   │                  MAIN CONTENT                           │
│  220px     │           viewport_width − 220px                        │
│  fixed     │           overflow-auto                                 │
│  h-screen  │           padding: 32px (p-8) all sides                │
│            │                                                          │
└────────────┴──────────────────────────────────────────────────────────┘
```

### 2.2 Desktop Sidebar — Detailed

```
Width: 220px   Height: 100vh (fixed)

┌────────────────────────┐  ← bg-white, border-r border-zinc-200
│ ┌──┐                   │  ← px-4 (16px) py-5 (20px)
│ │  │  Easibill         │  logo: 28×28px
│ │  │  Sharma Medical   │  "Easibill": text-sm font-semibold text-zinc-900 → 20px tall
│ └──┘                   │  pharmacy name: text-xs text-zinc-400 → 16px tall
│                        │  logo section total height: 20+28+20 = 68px
├────────────────────────┤  ← border-b zinc-100 (1px)
│                        │  ← nav: px-2 (8px) py-3 (12px)
│  ┌──────────────────┐  │  ← each link: h-36px
│  │ 📊 Dashboard     │  │  active: bg-brand-blue/10 text-brand-blue font-semibold
│  └──────────────────┘  │  
│  ┌──────────────────┐  │  inactive: text-zinc-500 hover:bg-zinc-100
│  │ 🛒 New Sale      │  │  
│  └──────────────────┘  │  each link: px-3 (12px) py-2 (8px)
│  · · · 6 more · · ·   │  = 8+20+8 = 36px per link
│                        │  icon: h-4 w-4 = 16×16px, gap-2.5 (10px)
│                        │  space-y-0.5 (2px gap between links)
│  ↑ nav flex-1          │
│    overflow-y-auto     │
│                        │
├────────────────────────┤  ← border-t zinc-100, px-2 py-3
│  ┌──────────────────┐  │  ← user logout button
│  │ [RK] Raj Kumar ↵ │  │  avatar: h-6 w-6 = 24×24px, rounded-full
│  └──────────────────┘  │  text: flex-1 text-sm, LogOut icon h-3.5 = 14px
└────────────────────────┘  gap-2.5 (10px), px-3 py-2 = 36px row
  ↑ bottom section: 12+36+12 = 60px
```

Sidebar links height breakdown:
```
  8 nav items × 36px = 288px
  8 gaps of 2px      = 14px (7 gaps)
  nav padding top+bot = 24px
  Total nav area     ≈ 326px minimum
```

### 2.3 Mobile Top Bar

```
Width: 100vw   Height: 56px (h-14)

┌─────────────────────────────────────────────────────┐  ← bg-white, border-b zinc-200
│ [28×28 logo]  Easibill        Sharma Medical   [↵]  │  ← h-14 = 56px
│               ←flex-1 min-w-0→                      │  LogOut: p-2 h-4 = 32×32px
└─────────────────────────────────────────────────────┘
  px-4 (16px) gap-3 (12px)
```

### 2.4 Mobile Bottom Nav

```
Width: 100vw   Height: ~54px

┌──────────┬──────────┬──────────┬──────────┬──────────┐  ← bg-white, border-t zinc-200
│    🏠    │    🛒    │   👥    │   📦    │   ⚙️    │  icon: h-5 w-5 = 20×20px
│   Home   │   Sale   │ Patients │ Inventory│ Settings │  text-xs (12px)
└──────────┴──────────┴──────────┴──────────┴──────────┘
  each slot: flex-1, py-2 (8px), gap-0.5 (2px), items-center
  slot height: 8+20+2+16+8 = 54px
  active: text-brand-blue font-semibold
  inactive: text-zinc-400
```

---

## 3. Auth Pages

### 3.1 Auth Page Shell

```
Viewport: 100vw × 100vh   bg-zinc-50

                    ┌──────────────────────────────┐
                    │       [28px EasibillLogo]     │  centered above card
                    │                               │
                    │  ┌────────────────────────┐  │
                    │  │                        │  │
                    │  │   CARD CONTENT         │  │  ← bg-white, rounded-2xl
                    │  │                        │  │    border-zinc-200, shadow-sm
                    │  │                        │  │    w-full max-w-sm (384px)
                    │  │                        │  │    p-8 (32px all sides)
                    │  │                        │  │
                    │  └────────────────────────┘  │
                    └──────────────────────────────┘
  Card inner content width: 384 − 32 − 32 = 320px
```

### 3.2 Login Page

```
Card: 384px wide × auto height   Inner width: 320px

┌──────────────────────────────────────┐  ← max-w-sm=384px, p-8=32px
│                                      │
│  Welcome back                        │  ← text-2xl font-semibold = 32px tall
│  Sign in to your pharmacy account    │  ← text-sm text-zinc-500 = 20px tall, mt-1 (4px)
│                                      │  space-y-6 = 24px gap above form
│  Email                               │  ← text-sm font-medium text-zinc-700 = 20px
│  ┌──────────────────────────────┐    │  label margin-bottom: 1.5 (6px)
│  │ you@pharmacy.com             │    │  ← py-2 text-sm → 36px input
│  └──────────────────────────────┘    │  full width (320px)
│                                      │
│  Password                            │  ← space-y-4 (16px) between fields
│  ┌──────────────────────────────┐    │
│  │ ••••••••                     │    │  36px input
│  └──────────────────────────────┘    │
│                          Forgot? →   │  ← text-right text-sm = 20px, mt-1 (4px)
│                                      │
│  ┌──────────────────────────────┐    │  ← py-2.5 text-sm = 40px
│  │            Sign in           │    │  full width, bg-brand-blue
│  └──────────────────────────────┘    │  mt-2 (8px, inside form space-y-4)
│                                      │
│    No account? Register your phar.   │  ← text-sm text-zinc-500, mt-6? space-y-6
│                                      │
└──────────────────────────────────────┘

Total card height approx:
 32 (top pad)
 + 32 (h2 text-2xl)
 + 4 (mt-1)
 + 20 (sub text)
 + 24 (space-y-6)
 + 20 (label)
 + 6 (gap)
 + 36 (input)
 + 16 (space-y-4)
 + 20 (label)
 + 6 (gap)
 + 36 (input)
 + 4 (mt-1)
 + 20 (forgot link)
 + 8 (gap after forgot)
 + 40 (button)
 + 24 (space-y-6)
 + 20 (footer link)
 + 32 (bottom pad)
 ≈ 390px
```

### 3.3 Register Page

```
Card: 384px wide × ~540px   Inner width: 320px

┌──────────────────────────────────────┐
│                                      │
│  Create your account                 │  32px (text-2xl)
│  Get started with...                 │  20px (text-sm)
│                                      │  24px gap (space-y-6)
│  [label 20px] [input 36px]  × 5     │  5 fields × (20+6+36+16) = 390px
│  Pharmacy Name  ┌────────────────┐   │  (last field no bottom gap: -16px)
│                 │                │   │
│                 └────────────────┘   │
│  Owner Name     ┌────────────────┐   │
│                 │                │   │
│  WhatsApp No    ┌────────────────┐   │  type=tel
│  Email          ┌────────────────┐   │
│  Password       ┌────────────────┐   │
│                                      │
│  ┌──────────────────────────────┐    │  40px button, mt-2 (8px extra)
│  │       Create account         │    │
│  └──────────────────────────────┘    │
│                                      │  24px gap
│    Already have account? Sign in     │  20px footer
│                                      │  32px bottom pad
└──────────────────────────────────────┘
```

---

## 4. Onboarding Page

```
Page: 100vw × 100vh   bg-zinc-50, flex center

Card: 512px (max-w-lg) × auto   p-8 (32px)   rounded-2xl   shadow-sm

┌────────────────────────────────────────────────────────┐  512px wide
│                                                        │
│  ●───────────●───────────○                            │  ← Stepper 3 steps
│  Profile  WhatsApp  Patients                          │
│                                                        │
│  ↑ Step circles: h-8 w-8 = 32×32px, rounded-full      │
│    Active/done: bg-brand-blue text-white               │
│    Future: bg-zinc-100 text-zinc-400                   │
│    Connector: h-px flex-1 mx-2 (8px each side)        │
│    Labels: text-sm below circles                       │
│    Total stepper height: ~52px (32px circle + 20px label) │
│                                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  border-t (after step 2+)
│                                                        │
│  STEP CONTENT (varies per step)                        │
│                                                        │
└────────────────────────────────────────────────────────┘
  Inner content width: 512 − 32 − 32 = 448px
```

**Stepper Detail:**
```
●────────●────────○
↑32×32   8  8     ↑32×32   8  8     ○32×32
         ←flex-1→           ←flex-1→
Total connector = (448px − 3×32px − 4×8px) / 2 ≈ 144px each
```

---

## 5. Dashboard Home

### 5.1 Full Page Layout (desktop, viewport 1440px)

```
┌────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR 220px │  MAIN: 1220px, p-8 (32px each side)                   │
│               │  Content width: 1220 − 64 = 1156px                    │
│               │                                                         │
│               │  Good morning, Raj               (text-xl = 28px tall)│
│               │  Sunday, 15 June 2026            (text-sm = 20px, mt-2)│
│               │  ─────────────────── space-y-6 = 24px gap ───────────  │
│               │  [🛒 New Sale] [👤 Add Patient] [📢 New Broadcast]     │
│               │  ─────────────────── space-y-6 = 24px gap ───────────  │
│               │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│               │  │ STAT 1  │ │ STAT 2  │ │ STAT 3  │ │ WA      │     │
│               │  └─────────┘ └─────────┘ └─────────┘ └─────────┘     │
│               │  ─────────────────── space-y-6 = 24px gap ───────────  │
│               │  ┌──────────────────────┐ ┌──────────────────────┐    │
│               │  │ Today's Reminders    │ │ Upcoming This Week   │    │
│               │  │                      │ │                      │    │
│               │  └──────────────────────┘ └──────────────────────┘    │
│               │  ─────────────────── space-y-6 = 24px gap ───────────  │
│               │  ┌────────────────────────────────────────────────┐    │
│               │  │ Recent Activity                                │    │
│               │  └────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Quick Actions Bar

```
Height: 36px (buttons) + spacing
Width: auto, flex gap-3 (12px)

┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│ 🛒 New Sale  │  │ 👤 Add Patient│  │ 📢 New Broadcast │
└──────────────┘  └──────────────┘  └──────────────────┘
  px-3 py-2         px-3 py-2          px-3 py-2
  text-sm (14px)    36px tall          36px tall
  border zinc-200   bg-white           shadow-sm
  icon h-4 (16px)   gap-1.5 (6px)
  Width ≈ 12+16+6+~60+12 = ~106px each (varies by label)
```

### 5.3 Stats Bar (populated state)

```
Grid: 2 cols mobile / 4 cols lg   gap-4 (16px)
Each card width (1156px wide, 4 cols, 3 gaps):
  (1156 − 3×16) / 4 = 272px per card

Each card: 272px × auto   p-4 (16px)   rounded-xl   border-zinc-200
           border-l-4 (4px colored accent left border)
           hover:shadow-sm

┌─────────────────────────────────────────┐  272px wide
│  TOTAL PATIENTS        [icon 26×26px]  │  ← flex justify-between, mb-3 (12px)
│  text-xs font-semibold uppercase        │    icon: p-1.5 (6px) + h-3.5 (14px) = 26px sq
│  text-zinc-500                          │    rounded-md
│                                         │
│  142                                   │  ← text-2xl font-bold = 32px tall
│  text-zinc-900                          │    leading-none
└─────────────────────────────────────────┘
  Card total height: 16+16+12+12+32+16 = 104px
                     pad  label gap  icon  value pad
  (label row: ~16px, icon: 26px, but they're flex side-by-side → row = 26px)
  Actual: 16 (top) + 26 (label/icon row) + 12 (mb-3) + 32 (value) + 16 (bottom) = 102px

WhatsApp card value (text-base font-semibold = 24px instead of 32px):
  height ≈ 94px
```

### 5.4 Reminder Cards Panel

```
Grid: 1 col mobile / 2 cols lg (at 1156px content)
Each panel: (1156 − 16) / 2 = 570px wide

┌──────────────────────────────────────────────────────┐  570px
│  Today's Reminders              [3]    View all →   │  ← Card header: py-4 px-5 = 52px
│─────────────────────────────────────────────────────│  border-b zinc-100
│                                                      │  ← px-5 (20px)
│  ● Ravi Kumar     Metformin 500mg       15 Jun      │  ← ReminderCard: py-3 (12px each)
│    ···········                    [✓] [z]           │    text-sm (20px line-height)
│─────────────────────────────────────────────────────│    = 12+20+12 = 44px per card
│  ● Priya Sharma   Amlodipine            15 Jun      │    border-b zinc-100
│─────────────────────────────────────────────────────│    last:border-0
│  ● Ahmed Khan     Atorvastatin          15 Jun      │
└──────────────────────────────────────────────────────┘

ReminderCard row detail (px-5 container):
  flex items-center gap-3 (12px)

  ● = dot: h-2 w-2 = 8×8px, rounded-full
  Name: text-sm font-medium text-zinc-900
  Medicine: text-xs text-zinc-400 (below name)
  Date: text-xs text-zinc-400, ml-auto
  Action buttons (Today only): p-1.5 rounded-md icon h-3.5 = 26×26px each, gap-1
  
  Full row height: py-3 (12px each side) + max(name 20px + med 16px) = 12+36+12 = 60px
  (two-line content: name 20px + gap ~2px + medicine 16px = ~38px + 24px pad = 62px)
```

### 5.5 Empty State (0 patients)

```
Card: full content width × auto   bg-white rounded-xl border-zinc-200

EmptyState section:
  py-12 (48px) flex-col items-center justify-center
  icon: Building2 h-8 w-8 = 32×32px, text-zinc-300
  heading: mt-3 (12px) text-sm font-medium text-zinc-500 = 20px
  body: mt-1 (4px) text-xs text-zinc-400 = 16px

Checklist (px-6 pb-8 max-w-md mx-auto space-y-3):
  3 links, each: p-4 (16px) rounded-xl border-zinc-200

  ┌────────────────────────────────────────────────────┐  ~448px (max-w-md)
  │  ① Connect WhatsApp                          →    │  
  └────────────────────────────────────────────────────┘
    Step circle: h-7 w-7 = 28×28px, rounded-full, bg-brand-blue
    Label: text-sm font-medium text-zinc-900 (flex-1)
    Arrow: ArrowRight h-4 w-4 = 16×16px, text-zinc-400
    Row height: 16+28+16 = 60px (circle is tallest element)
    gap-3 (12px) between items
```

---

## 6. Patients List Page

### 6.1 Page Layout

```
Page: p-4 md:p-8   max-w-4xl (896px) + padding

┌─────────────────────────────────────────────────────────────┐  896px max
│  Patients                           [📥 Import] [+ Add]    │  ← header row: mb-6 (24px)
│  142 registered                                             │    h1: text-xl = 28px
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │  ← mb-5 (20px)
│  │ 🔍  Search by name or phone…                         │  │  38px tall input
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  [All] [Active] [Inactive 60d+]                            │  ← mb-4 (16px), pills 28px
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PATIENT  PHONE    TAGS     LANGUAGE  ADDED        │   │  ← table header 40px
│  ├─────────────────────────────────────────────────────┤   │
│  │ [RS] Raj Sharma  9999…   Diabetic  Hindi  1 Jun  │   │  ← row 48px
│  ├─────────────────────────────────────────────────────┤   │
│  │ [PK] Priya Kumar 8888…   BP        English 5 Jun  │   │  48px
│  ├─────────────────────────────────────────────────────┤   │
│  │ · · · · · · · · ·                               · │   │
│  ├─────────────────────────────────────────────────────┤   │  border-t zinc-100
│  │              [ Load more (23 remaining) ]           │   │  ← py-4 (16px) centered
│  └─────────────────────────────────────────────────────┘   │    button: 36px
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Header Row

```
Width: 100% of page   Height: auto

Patients                    [📥 Import]  [+ Add Patient]
↑ text-xl (28px)                 ↑ 36px       ↑ 36px
142 registered               gap-2 (8px)    bg-brand-blue
↑ text-sm (20px) mt-0.5 (2px)

Import button: px-3 py-2, border zinc-200, text-zinc-600
  Width: ~82px (icon 16 + gap 8 + text "Import" ~43 + padding 24) on ≥sm
  Mobile: shows icon only → ~32×32px

Add Patient button: px-3 py-2, bg-brand-blue, text-white
  Width: ~108px
  Mobile: shows icon only
```

### 6.3 Table Columns

```
Table: w-full   border-collapse implied

Column widths (896px content, approx):

  Patient:  px-5 → ~200px (flex: avatar 32 + gap 12 + name text)
  Phone:    px-4 → ~120px
  Tags:     px-4 → ~140px  [hidden < lg]
  Language: px-4 → ~90px   [hidden < sm]
  Added:    px-4 → ~100px  [hidden < md]
  Arrow:    w-8 = 32px

Header: text-xs font-medium text-zinc-500 uppercase tracking-wide
  Height: py-3 (12px) + text-xs (16px) + py-3 = 40px

Row: py-3.5 (14px) + text-sm (20px) + py-3.5 = 48px
  hover:bg-zinc-50, border-b zinc-100

Patient cell:
  ┌──────────────────────────────────────────────────┐
  │  [RS]  Raj Sharma                                │
  │   32×32   ← gap-3 (12px) →  font-medium zinc-900 │
  └──────────────────────────────────────────────────┘
  avatar: h-8 w-8 (32×32), rounded-full, bg-zinc-100, text-xs

Chevron button (last col):
  p-1.5 rounded-md → 26×26px
  ChevronRight h-4 = 16×16px
  opacity-0 → group-hover:opacity-100
```

### 6.4 Load More Button

```
Position: py-4 text-center border-t border-zinc-100

                 ┌────────────────────────────────┐  auto width
                 │  Load more (23 remaining)       │  36px tall
                 └────────────────────────────────┘
  centered horizontally, px-4 py-2, text-sm, border-zinc-200, rounded-lg
```

### 6.5 Add Patient Modal

```
Overlay: fixed inset-0, bg-black/50, z-50, flex center p-4

Card: 448px (max-w-md) × auto   bg-white rounded-xl shadow-xl
Inner width: 448 − 0 (no extra p on card itself, inner sections have px-5)

┌──────────────────────────────────────────────────┐  448px
│  Add Patient                              [✕]    │  ← border-b zinc-100, px-5 py-4 = 52px
│──────────────────────────────────────────────────│     ✕: p-1.5 h-4 = 26×26px
│                                                  │
│  Name *                                          │  ← px-5 py-5 = 20px each side
│  ┌──────────────────────────────────────────┐    │  label: text-sm font-medium
│  │ Raj Sharma                               │    │  input: 36px (py-2), mt-1.5 (6px)
│  └──────────────────────────────────────────┘    │
│                                                  │
│  Phone *                                         │  field gap: space-y-4 (16px)
│  ┌──────────────────────────────────────────┐    │
│  │ +91 99999 99999                          │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  WhatsApp No  (if different)                     │
│  ┌──────────────────────────────────────────┐    │
│  │                                          │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  Language                                        │
│  ┌──────────────────────────────────────────┐    │
│  │ Hindi                              ▾     │    │  ← select
│  └──────────────────────────────────────────┘    │
│                                                  │
│  Notes                                           │
│  ┌──────────────────────────────────────────┐    │
│  │                                          │    │  ← textarea min-h ~80px
│  └──────────────────────────────────────────┘    │
│                                                  │
│  [Cancel]              [Save Patient]           │  ← px-5 py-4 border-t
└──────────────────────────────────────────────────┘
  Cancel: flex-1, border zinc-200, py-2 = 36px
  Save: flex-1, bg-brand-blue, py-2 = 36px
  Footer: border-t zinc-100, px-5 py-4
```

---

## 7. Patient Detail Page

```
Page: p-4 md:p-8   max-w-3xl (768px)

← Back  [RefreshCw icon 20×20]   ← text-sm, mb-4 (16px)

┌──────────────────────────────────────────────────────────┐  768px
│ Zone 1 — Patient Header Card                             │  bg-white rounded-xl border
│ p-6 (24px all sides)                                     │
│                                                          │
│  [48×48 avatar]  Raj Sharma                    [✎][🗑]  │  Row A
│                  +91 9999 999999               [+ Sale] │
│                  Hindi  [Diabetic tag]                   │
│                                                          │
│  ┌── OPTED-OUT BANNER (conditional) ───────────────┐    │
│  │  ⚠ WhatsApp opted out — reminders...  Re-enable │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│ ───────────────────────────────── border-t zinc-100 ──── │  pt-4 mt-4
│                                                          │
│  3          ₹4,200       15 May 2026      18 Jun        │  Row B stats
│  Purchases  Total spend  Last purchase    Next reminder  │
│  grid 4 cols (sm), 2 cols mobile                        │
│                                                          │
│  [Diabetic] [BP] [+ tag]                               │  Row C tags
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Zone 1 dimensions:**
```
Row A height:
  avatar h-12 = 48px (tallest item)
  actions: edit/delete icons 26px, "New Sale" button 36px
  → row approx 48px + 24px top pad

Avatar: 48×48px, rounded-full, bg-zinc-100
  initials: text-sm font-medium (not text-xs)

Edit button: Pencil icon h-4 = 16×16px, p-1.5 = 26×26px
Delete button: Trash2 h-4 = 16×16px, p-1.5 = 26×26px
New Sale button: px-3 py-1.5 text-sm → 12+20+12=44px? No: py-1.5=6px each → 6+20+6=32px
  hidden sm:flex   icon: ShoppingCart h-4 = 16px

Opted-out banner:
  bg-amber-50, border amber-200, rounded-lg, px-4 (16px) py-2.5 (10px)
  height: 10+20+10 = 40px (text-sm single line)
  MessageCircleOff icon h-4 = 16×16px, gap-2 (8px)

Stats strip (Row B): grid-cols-2 sm:grid-cols-4
  Each cell: ~(768-48)/4 = 180px wide at desktop
  Value: text-xl font-semibold = 28px tall
  Label: text-xs text-zinc-400 mt-0.5 = 16px + 2px = 18px
  Cell height: ~46px

Tags row (Row C):
  Tag: py-0.5 px-2 text-xs = 20px tall
  +Add tag button: same height
```

### 7.1 Tab Bar

```
Width: 100%   Height: ~28px (pill buttons)

╭────────────────╮  ╭──────────────╮
│ Purchases (3)  │  │ Messages (7) │    ← flex gap-1, mb-4 (16px)
╰────────────────╯  ╰──────────────╯
  Active: bg-zinc-900 text-white
  Inactive: text-zinc-500 hover:text-zinc-900
  Each: px-3 (12px) py-1.5 (6px) text-sm (14px/20px) font-medium
  Height: 6+20+6 = 32px
  rounded-full
```

### 7.2 Purchases Tab

```
┌ "Purchase history" text-sm font-semibold ──── [+ Add purchase] ┐  mb-4, flex j-between
│  ← label: 20px tall                            32px button      │

┌──────────────────────────────────────────────────────────────────┐  bg-white rounded-xl
│ MEDICINE         DATE      TOTAL    REFILL    STATUS             │  ← table header 40px
│──────────────────────────────────────────────────────────────────│  hidden on mobile
│ Metformin 500mg  15 May    ₹240    28 days   ● Sent             │  ← row 48px
│ × 2 strips       2026                                            │    qty below name text-xs
│──────────────────────────────────────────────────────────────────│
│ Amlodipine 5mg   20 Apr    ₹180    30 days   ● Scheduled        │
└──────────────────────────────────────────────────────────────────┘

Row grid: grid-cols-[1fr_auto_auto_auto_auto] desktop
  Medicine col: text-sm font-medium + text-xs qty below (2-line: ~40px content)
  Date: text-xs zinc-400, hidden sm → d MMM (mobile), d MMM yyyy (desktop)
  Total: text-sm zinc-700, hidden sm
  Refill: text-xs zinc-400, hidden sm
  Status badge: rounded-full px-2 py-0.5 text-xs = 20px
  Row padding: px-4 py-3 = 12px each vert → 12+40+12 = 64px (2-line) or 12+20+12=44px (1-line)

"+ Add purchase" button: px-3 py-1.5 text-sm → 32px tall, bg-emerald-600 text-white rounded-lg
```

### 7.3 Add Purchase Modal

```
Overlay: fixed inset-0 bg-black/30 z-50 flex center p-4

Card: 448px max-w-md × auto   bg-white rounded-xl shadow-xl

┌──────────────────────────────────────────────────┐
│  Add Purchase                             [✕]    │  52px header (py-4 px-5)
│──────────────────────────────────────────────────│
│                                                  │  px-5 py-5 (20px pad)
│  AddPurchaseForm content                         │
│  · Medicine name (with autocomplete) 36px        │
│  · Unit Price  (number)              36px        │
│  · Quantity    (number)              36px        │
│  · Refill days (number, default 28)  36px        │
│  · Date picker                       36px        │
│  space-y-4 (16px) between fields                 │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │           Save Purchase                  │    │  40px, bg-brand-blue
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

---

## 8. New Sale — 3-Step Stepper

### 8.1 Stepper Header

```
Width: 100%   Height: ~56px

bg-white, border-b zinc-100, shrink-0 (sticky top)

              ●──────●──────○
           Patient    Meds   Payment

flex center, py-4 (16px each side)

Each step:
  ● circle: h-6 w-6 = 24×24px, rounded-full
    Done: bg-brand-blue text-white + Check icon h-3 (12px)
    Active: bg-brand-blue text-white + number text-xs
    Future: bg-zinc-200 text-zinc-400 + number text-xs
  label: text-sm (20px line-height)
    Active: font-semibold text-zinc-900
    Done: text-zinc-500
    Future: text-zinc-400
  Full step node width: 24 (circle) + gap 8 + ~50px (label) ≈ 82px

Connector: h-px (1px) w-8 = 32px, mx-1 (4px each side)
  Done: bg-brand-blue/40
  Pending: bg-zinc-200

Total stepper width ≈ 82+4+32+4+82+4+32+4+82 = 326px (centered on page)
Total stepper height: 16 (py-4) + max(24circle, 20label) + 16 = 56px
  But circle and label are side-by-side (flex), not stacked: height = 16+24+16 = 56px
```

### 8.2 Step 1 — Patient

```
Container: flex center, p-4 md:p-8, overflow-y-auto
Content: max-w-md = 448px

┌──────────────────────────────────────────────┐  448px
│  New Sale                                    │  text-xl (28px)
│  Start by looking up the customer            │  text-sm zinc-400 mt-0.5
│                                              │  space-y-5 (20px) below
│  ┌──────────────────────────────────────┐    │  ← card: bg-white rounded-xl border p-5
│  │  Customer          text-sm font-semi │    │
│  │                                      │    │
│  │  ┌──────────────────────────────┐    │    │  38px input (border)
│  │  │ 🔍 Mobile number (10 digits) │◌   │    │  pl-9 pr-9, Loader2 right when looking up
│  │  └──────────────────────────────┘    │    │
│  │                                      │    │
│  │  ← FOUND PATIENT CARD (conditional) │    │
│  │  ┌──────────────────────────────┐    │    │
│  │  │ [👤]  Raj Sharma             │    │    │  h-8 w-8 (32×32) icon in circle
│  │  │       +91 99999 · hindi      │    │    │  bg-brand-blue/10 rounded-lg p-3
│  │  └──────────────────────────────┘    │    │  border brand-blue/20
│  │  (or NEW PATIENT FORM)               │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │  44px button (py-3)
│  │              Continue →              │    │  bg-brand-blue, rounded-xl
│  └──────────────────────────────────────┘    │  disabled: opacity-50
│  Enter a 10-digit mobile number              │  hint: text-xs zinc-400 text-center mt-1.5
└──────────────────────────────────────────────┘

Found patient card height:
  p-3 (12px) + max(32px avatar, 2-line text) + p-3 (12px)
  name: text-base font-semibold (24px)
  phone+lang: text-xs (16px), mt-0 (below name)
  = 12 + 24 + 16 + 12 = 64px

New patient form (border-t pt-3):
  amber notice row (UserPlus icon + text): ~20px (text-sm)
  name input: 36px
  language select: 36px
  space-y-3 (12px) between
  Total: 12+20+12+36+12+36 = 128px
```

### 8.3 Step 2 — Medicines (desktop, w/ side panel)

```
Container: flex flex-col lg:flex-row gap-4 (16px) h-full overflow-hidden

LEFT PANEL (flex-1, overflow-y-auto, p-4 md:p-6):
─────────────────────────────────────────────────────

Column headers (hidden sm:flex, mb-2):
  ┌────────────────────────────┬──────┬────┬──────┬────────┬────────┐
  │ Medicine                   │ ₹ Pr │ Qty│      │        │        │
  └────────────────────────────┴──────┴────┴──────┴────────┴────────┘
  text-xs text-zinc-400 mb-2 (8px)
  col widths: flex-1 | w-24(96px) | w-16(64px) | 26px | 64px | 32px

MedicineRow (each item):
  height: 36px (single line) + optional 32px days row

  ┌─────────────────────────────────────────────────────────────┐
  │ ┌───────────────────────────────┐ ┌──────┐ ┌────┐ ⚙ ₹XXX 🗑│
  │ │ Metformin 500mg               │ │  45  │ │ 2  │          │
  │ └───────────────────────────────┘ └──────┘ └────┘          │
  │      ↑ flex-1                     ↑ w-24   ↑w-16  26 64 32 │
  │                                    96px     64px   px px px │
  └─────────────────────────────────────────────────────────────┘
  gap-2 (8px) between elements
  All inputs: py-2 (8px) text-sm → 36px tall, border rounded-lg
  Price input (px-2): text-right, w-24 (96px), min-w-0
  Qty input: w-16 (64px), text-center
  ⚙ toggle button: p-1.5 h-3.5 = 26×26px
  Subtotal span (desktop): w-16 (64px) text-xs text-right text-zinc-500
  Trash button: p-2 h-4 = 32×32px; opacity-0 sm:group-hover:opacity-100

  Refill days sub-row (expanded):
    ← pl-1 (4px) mt-1 (4px) grid-cols-2 gap-2 →
    label: text-xs zinc-400 mb-0.5 = 16px + 2px
    input: 36px (py-2 text-sm px-2 rounded-lg)
    sub-row total: 4+16+2+36 = 58px

  Subtotal (mobile): text-right text-xs zinc-500 sm:hidden
    height: 16px (text-xs)

  Full MedicineRow typical height: 36px (main row)
    + 16px (mobile subtotal, hidden desktop)
    → desktop: 36px, mobile: 36+4+16=56px

Autocomplete dropdown:
  absolute, z-10, top-full left-0 right-0, mt-1 (4px)
  bg-white border zinc-200 rounded-lg shadow-lg overflow-hidden

  Each suggestion: px-3 py-2 text-sm = 12+20+12 = 44px? No: py-2=8px → 8+20+8=36px
  Loading row: px-3 py-2 flex items-center gap-2 → 36px (Loader2 h-3=12px)
  Error row: px-3 py-2 → 36px
  Max ~5 suggestions visible before scroll

"Add medicine" button: w-full py-2.5 rounded-lg border-dashed → 40px tall

Running total:
  text-right text-sm font-semibold zinc-900, mt-2 (8px)
  height: 20px (text-sm)

───────────────────────────────────────────────────────────────────
RIGHT PANEL (PatientContextPanel, desktop only: hidden lg:flex)
  w-64 (256px), shrink-0, bg-zinc-50 rounded-xl border zinc-200
  p-4 (16px), overflow-y-auto

  Patient name text-sm font-semibold
  Phone text-xs zinc-400
  Language tag 20px
  ─────────────────────────
  "Last medicines" text-xs uppercase mt-4
  · Metformin 500mg   (text-sm)
  · Amlodipine 5mg    (text-sm)
  Each: py-2 (8px) = 36px row
```

### 8.4 Step 3 — Payment

```
Container: flex center p-4 md:p-8
Content: max-w-md = 448px   space-y-4 (16px gap between cards)

ORDER SUMMARY CARD
┌────────────────────────────────────────────┐  bg-white rounded-xl border p-5
│  Order Summary       text-sm font-semibold │  20px label + mb-3 (12px)
│                                            │
│  Metformin 500mg              ×2   ₹90    │  ← each item: flex items-center gap-2
│  Amlodipine 5mg               ×1   ₹45    │    name: text-sm zinc-700 flex-1 truncate
│  ─ ─ ─ ─ ─ ─ ─ ─   max-h-48 (192px)      │    ×qty: text-xs zinc-400
│                                            │    amount: text-sm zinc-700 w-16 text-right
│  ──────────────────────── border-t zinc-100│    (item row height: flex → ~20px per row)
│  Total                           ₹135     │    total row: border-t mt-3 pt-3 flex j-between
│                                            │    "Total": text-sm zinc-600
│                                            │    amount: text-xl font-bold zinc-900 (28px)
└────────────────────────────────────────────┘
  Card height: 20 (top p-5) + 20 (label) + 12 (mb-3) + items + 12 (mt-3) + 28 (total) + 20 = ~120px+

PAYMENT METHOD CARD
┌────────────────────────────────────────────┐  bg-white rounded-xl border p-4
│  Payment method   text-sm font-semibold    │  label: 20px, mb-2 (8px)
│                                            │
│  [Cash] [UPI] [Card] [Other]              │  ← flex gap-2 flex-wrap
└────────────────────────────────────────────┘
  Each pill: px-3 py-1.5 text-sm rounded-full
  Height: 6+20+6 = 32px
  Width: auto ("Cash"≈60px, "UPI"≈52px, "Card"≈60px, "Other"≈64px)
  Selected: bg-brand-blue text-white
  Unselected: bg-white border zinc-200 text-zinc-600

WHATSAPP NOTICE
  text-xs: 16px tall, mt-0 (part of space-y-4 gap)
  ✅ text-zinc-500 or ⚠️ text-amber-600

ACTIONS ROW  flex gap-3
┌────────┐  ┌───────────────────────────────┐
│ ← Back │  │       Complete Sale           │
└────────┘  └───────────────────────────────┘
  Back: px-4 py-3 border zinc-200 text-zinc-600 rounded-xl → 44px
        width: 80px approx (auto)
  Submit: flex-1, py-3, bg-brand-blue, rounded-xl → 44px
        Loading: Loader2 h-4 (16px) + "Processing…"
```

---

## 9. Inventory Page

```
Page: p-4 md:p-8   max-w-4xl (896px)

Inventory                                  ← text-xl (28px) font-semibold
Manage your medicine catalogue...          ← text-sm zinc-500 mt-0.5 (2px)
                                           space-y-6 (24px)

ADD-MEDICINE CARD
┌───────────────────────────────────────────────────────────────────┐  bg-white rounded-xl border p-5
│  ┌──────────────────────────┐  ┌────────────┐  ┌────────┐  [Add] │
│  │ Medicine name            │  │ ₹ Price    │  │ Days   │        │
│  └──────────────────────────┘  └────────────┘  └────────┘        │
└───────────────────────────────────────────────────────────────────┘
  Desktop: flex gap-2, all on one row
  Mobile: stacked (flex-col)
  
  Name input: flex-1 (fills remaining), py-2 text-sm = 36px
  Price input: w-32 (128px)?, py-2 = 36px, placeholder "₹ Price"
  Days input: w-24 (96px)?, py-2 = 36px, placeholder "Days"
  Add button: bg-emerald-600 text-white, px-4 py-2 = 36px, rounded-lg
    Loading: Loader2 h-4 (16px) animate-spin
    Width: ~72px ("Add" + padding)
  
  Card height (desktop): 20 (p-5 top) + 36 (inputs) + 20 (p-5 bottom) = 76px

MEDICINE LIST CARD
┌───────────────────────────────────────────────────────────────────┐  bg-white rounded-xl border
│  NAME                   DEFAULT PRICE    REFILL DAYS  ACTIONS    │  ← header: text-xs uppercase
│  ─────────────────────────────────────────────────────────────── │  40px (py-3)
│  Metformin 500mg        ₹45              28 days  [✎] [🗑]       │  ← view row: 48px (py-3.5)
│  ─────────────────────────────────────────────────────────────── │
│  Amlodipine 5mg         ₹30              30 days  [✎] [🗑]       │
│  ─────────────────────────────────────────────────────────────── │
│  Aspirin 75mg           —                28 days  [✎] [🗑]       │  ← null price shows "—"
└───────────────────────────────────────────────────────────────────┘

View row:
  Name: font-medium text-zinc-900
  Price: text-zinc-500 (₹45 or —)
  Days: text-zinc-500 (28 days)
  Pencil: p-1.5 h-3.5 = 26×26px, aria-label="Edit {name}"
  Trash: p-1.5 h-3.5 = 26×26px, aria-label="Delete {name}"
  Row: px-4 py-3.5 (md: px-5), items-center, gap-2
  Height: 14+20+14 = 48px

EDIT ROW (inline, replaces view row):
  ┌─────────────────────────┐ ┌────────┐ ┌────────┐ [✓] [✗]
  │ Metformin 500mg         │ │ 45     │ │ 28     │
  └─────────────────────────┘ └────────┘ └────────┘
  Uses smallInputClass: px-2 py-1.5 text-sm → 32px inputs
  ✓ check: p-1.5 bg-brand-blue text-white rounded-md, 26×26px (Check h-3.5)
  ✗ cancel: p-1.5 hover:bg-zinc-100, 26×26px

EMPTY STATE
  py-12 (48px) text-center
  Package icon h-8 w-8 = 32×32px, text-zinc-300
  "No medicines yet."  text-sm zinc-500 mt-2
  subtitle text-xs zinc-400 mt-1
```

---

## 10. Reminders Page

```
Page: p-4 md:p-8   max-w-4xl (896px)

┌────────────────────────────────────────────────────────────────┐
│  Reminders                     ┌──────────────────────────────┐│
│  247 total  (text-sm zinc-400) │  All  Scheduled  Sent  ···  ││  segmented: 36px outer
│                                └──────────────────────────────┘│
│                                   self-start (top-right on sm)  │
├────────────────────────────────────────────────────────────────┤  mb-6 (24px)
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ PATIENT        MEDICINE  DATE         STATUS     ACTIONS │  │  ← 40px header
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Ravi Kumar     Metformin  15 Jun 26  ● Scheduled  [📅][✕]│  │  ← 48px row
│  │ +91 9999…                                                 │  │    group-hover actions
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Priya Sharma   Amlodip.   12 Jun 26  ● Sent             │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Ahmed Khan     Aspirin    10 Jun 26  ● Failed    [↺]     │  │
│  │                           Failed: socket error truncated  │  │  text-xs red-400 mt-1
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘

Patient cell: name text-sm font-medium zinc-900 + phone text-xs zinc-400 mt-0.5 (2px)
  Two-line: 20+2+16 = 38px content, + py-3.5 pad = 14+38+14 = 66px
  (dictates row height when has phone)

Error message below status: text-xs text-red-400 mt-1, max-w-[160px] truncate

Action buttons (opacity-0 group-hover:opacity-100):
  flex items-center justify-end gap-1 (4px)
  each: p-1.5 rounded-md h-3.5 → 26×26px
  Retry: RotateCcw h-3.5, hover:text-blue-600
  Calendar: Calendar h-3.5, hover:text-amber-600
  Cancel: X h-3.5, hover:text-red-500
```

### 10.1 Reschedule Dialog

```
Overlay: fixed inset-0 bg-black/30 backdrop-blur-sm z-50
Panel: fixed center, bg-white rounded-xl shadow-xl border zinc-200
       w-full max-w-sm (384px), p-6 (24px all)
Inner width: 384 − 48 = 336px

┌────────────────────────────────────────────┐  384px
│  Reschedule Reminder              [✕]      │  header: flex j-between items-center mb-4(16px)
│                                            │  Title: font-semibold zinc-900 (text-base = 24px)
│  New Date                                  │  ✕: p-1.5 h-4 = 26×26px
│  ┌──────────────────────────────────────┐  │
│  │ 2026-06-20                     [📅]  │  │  date input: py-2 text-sm = 36px + border
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────┐  ┌──────────────────┐   │  flex gap-2, each flex-1
│  │    Cancel    │  │   Reschedule     │   │  Cancel: border zinc-200 py-2 text-sm = 36px
│  └──────────────┘  └──────────────────┘   │  Confirm: bg-brand-blue text-white py-2 = 36px
│                                            │    disabled when no date: opacity-50
└────────────────────────────────────────────┘
  Total height: 24+24(title)+16+16(label)+6+36+8+36+24 ≈ 190px
  Animation: fade-in-0 zoom-in-95
```

---

## 11. Broadcasts Page

### 11.1 Desktop Layout

```
Page: p-4 md:p-8   two-column (desktop) / stacked (mobile)

┌──────────────────────────────────────────────────────────────────────────┐
│  COMPOSE CARD (flex-1)         │  HISTORY CARD (w-80 = 320px)           │
│  bg-white rounded-xl border p-5│  bg-white rounded-xl border p-5        │
│  ← gap-6 (24px) between →      │                                        │
└──────────────────────────────────────────────────────────────────────────┘

At max-w-2xl (672px) page content:
  With sidebar (1440px): content = 1440-220-64 = 1156px → lg:flex-row applies
  Compose: 1156-16(gap)-320 = 820px
  History: 320px (w-80)
```

### 11.2 Compose Card Detail

```
Width: 820px (desktop), 100% mobile   p-5 (20px)
Inner width: 820-40 = 780px

MODE TOGGLE + FILTERS
  flex gap-2 flex-wrap items-center

  Language select: auto width (~140px), 36px (py-2 text-sm)
  Tag select: auto width (~140px), 36px
  [Free text] [Use template] pills:
    rounded-full px-3 py-1.5 text-sm = 32px tall
    Active: bg-emerald-600 text-white
    Inactive: bg-white border zinc-200 text-zinc-600

FREE TEXT MODE:
─────────────────────────────────────────────────────────────────
AMBER WARNING BANNER: bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5
  height: 10+20+10 = 40px (single line) or taller if wraps
  Alert icon h-4 = 16px

TEXTAREA:
  ┌──────────────────────────────────────────────────────────────┐
  │ Hello {{name}}, your medicines are ready...                  │
  │                                                              │
  │                                                              │
  │                                              140 / 1024  ▾  │  char counter text-xs
  └──────────────────────────────────────────────────────────────┘
  min-h-[100px] = 100px minimum height
  py-2 px-3 text-sm, border zinc-200 rounded-lg, w-full

SEND BUTTON: w-full py-2.5 text-sm = 40px
  bg-brand-blue, rounded-lg, Send icon h-4 (16px) gap-2

TEMPLATE MODE:
─────────────────────────────────────────────────────────────────
TEMPLATE SELECT (or skeleton/error):
  <select> full width, 36px (py-2)
  placeholder "Select a template…"

TEMPLATE PREVIEW:
  label: text-xs zinc-500 mb-1 "Template content · fixed by WhatsApp"
  content: bg-zinc-50 rounded-lg p-3 text-sm zinc-700
  Mobile: line-clamp-2 + "Show full" toggle (ChevronDown/Up h-4)
  "Show full" button: text-xs zinc-400 flex items-center gap-1 mt-1

PARAMETER MAPPING (if {{N}} vars):
  label: text-sm font-medium zinc-700 mb-2
  Each row: flex items-center gap-3 py-2 border-b zinc-100
    "Variable 1" label: text-sm zinc-500 w-24 (96px)
    <select>: flex-1, 36px
  If > 4 params: max-h-48 (192px) overflow-y-auto
```

### 11.3 Broadcast History Card

```
Width: 320px (w-80)   p-5 (20px)
Inner width: 280px

History   (text-sm font-semibold zinc-900, mb-4)

Each BroadcastRow: py-4 border-b zinc-100 last:border-0

  ┌─────────────────────────────────────────────────────────┐
  │  Message preview (line-clamp-2)          ✓ 142  ✗ 3   │
  │  text-sm zinc-800                        ↑ text-xs     │
  │                                          green  red     │
  │  15 Jun 2026  [hindi]                    142 recipients │
  │  text-xs zinc-400  ← pill bg-zinc-100    text-xs zinc-400│
  └─────────────────────────────────────────────────────────┘
  
  Left: min-w-0 flex-1 (message + meta)
  Right: shrink-0 text-right (counts + recipients)

  Message: text-sm zinc-800, line-clamp-2 → ~40px (2 × 20px)
  Meta row: text-xs zinc-400, mt-1.5 (6px), flex gap-3 → 16px
  Language pill: bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full → 20px
  
  Counts right:
    sent: flex items-center gap-1 text-xs text-green-600 (CheckCircle2 h-3.5 + number)
    failed: text-xs text-red-500 (XCircle h-3.5 + number)
    recipients: text-xs zinc-400 mt-0.5

  Row total height: 16(py-4) + 40(msg) + 6(mt-1.5) + 16(meta) + 16(py-4) = 94px
```

---

## 12. Settings Page

### 12.1 Tab Bar

```
Width: full   Height: ~38px (py-2 text-sm) + 1px border underline

Profile  WhatsApp & Templates  Team  Billing  Data
   ↑active                     ↑inactive
   border-b-2 brand-blue       border-b-2 transparent
   text-brand-blue             text-zinc-500

Tab: px-3 py-2 text-sm font-medium whitespace-nowrap
  Height: 8+20+8 = 36px (border-b doesn't add height, it's -mb-px + overflow-hidden)
  flex gap-1, border-b border-zinc-200 mb-6 overflow-x-auto
```

### 12.2 Profile Tab

```
Card: bg-white rounded-xl border zinc-200 divide-y divide-zinc-100

Each EditableField row: py-3.5 border-b zinc-100
  Height: 14+20+14 = 48px

VIEW ROW:
┌────────────────────────────────────────────────────────────────┐
│  Pharmacy name       ←flex-1→  Sharma Medical Store  [✎]     │
│  ↑ w-28 (112px)                ↑ text-sm font-medium          │  48px
│  text-sm zinc-500               text-zinc-900                  │
└────────────────────────────────────────────────────────────────┘
  label: w-28 = 112px, shrink-0
  pencil: opacity-0 → group-hover:opacity-100, ml-2

EDIT ROW:
┌────────────────────────────────────────────────────────────────┐
│  Pharmacy name  ┌────────────────────────────┐  [✓]  [✗]     │
│                 │ Sharma Medical Store         │               │  48px
│                 └────────────────────────────┘               │
└────────────────────────────────────────────────────────────────┘
  input: flex-1, border zinc-200 rounded-lg px-3 py-1.5 text-sm = 32px
  ✓: p-1.5 bg-brand-blue text-white rounded-md = 26×26 (Check h-3.5 inside)
  ✗: p-1.5 hover:bg-zinc-100 = 26×26 (X h-3.5)
  gap-2 (8px) between input and buttons

CHANGE PASSWORD (collapsible):
  Trigger row: 48px (same as EditableField)
  Expanded form:
    ┌───────────────────────────────────────────────┐
    │  Current Password                             │  label 20px + gap 6px + input 36px
    │  ┌─────────────────────────────────────────┐  │
    │  │ ••••••••                                │  │
    │  └─────────────────────────────────────────┘  │
    │  New Password  (same)                         │
    │  Confirm Password  (same)                     │
    │  ┌────────────────────────┐                   │
    │  │   Update Password      │                   │  40px
    │  └────────────────────────┘                   │
    └───────────────────────────────────────────────┘
    space-y-4 (16px) between fields, p-4 (16px) pad
```

### 12.3 WhatsApp & Templates Tab

```
WHATSAPP CONNECTION CARD: bg-white rounded-xl border p-5

Connected state:
  ┌──────────────────────────────────────────────────────────────┐
  │  WhatsApp Connection                                         │  section heading
  │                                                              │
  │  ● Connected to Sharma Medical Store                         │  WAStatusBadge: text-xs
  │                                         [Disconnect]         │  button: 32px
  └──────────────────────────────────────────────────────────────┘

Disconnected state:
  ┌──────────────────────────────────────────────────────────────┐
  │  ● Not connected                                             │
  │                                                              │
  │  ┌─────────────────────────────────────────┐                │  40px button
  │  │          Connect WhatsApp               │                │  bg-brand-blue
  │  └─────────────────────────────────────────┘                │
  └──────────────────────────────────────────────────────────────┘

QR code display (during connecting):
  bg-zinc-50 rounded-lg p-4 (16px) border zinc-200
  QR img: ~200×200px centered
  caption: text-xs zinc-400 text-center mt-2 (8px)
  Total QR area: 16+200+16 = 232px square

MESSAGE TEMPLATES CARD: mt-6 (24px) above, p-5
  2 template rows (Hindi + English)
  Each: label pill + read-only textarea
  label: rounded-full bg-zinc-100 text-xs px-2 py-0.5 = 20px, mb-2 (8px)
  textarea: min-h-[80px]?, border zinc-200 rounded-lg p-3 text-sm bg-zinc-50
```

### 12.4 Billing Tab

```
BALANCE CARD: bg-white rounded-xl border p-5

┌──────────────────────────────────────────────────────────────┐
│  Credit Balance                                              │
│                                                              │
│  247                                                         │  text-4xl font-bold = 40px tall
│  credits                    ╭──────────────────╮            │  "credits" text-sm zinc-500
│                             │ ✓  Healthy        │            │  badge: py-1 px-3 text-sm
│                             ╰──────────────────╯            │  rounded-full bg-emerald-50
└──────────────────────────────────────────────────────────────┘  text-emerald-700

Low balance badge: bg-amber-50 text-amber-700 "Running low — top up soon"
Zero badge: bg-red-50 text-red-700 "Credits exhausted — top up to continue..."

CREDIT PACK GRID: grid-cols-1 sm:grid-cols-3 gap-4, mt-4 (16px)
At 672px content (max-w-2xl), 3 cols, 2 gaps:
  Each card: (672 − 2×16) / 3 = 213px

Each pack card: bg-white rounded-xl border p-4 (16px)

┌────────────────────────────────────────┐  213px
│  Starter                               │  label: text-sm font-semibold zinc-900
│                                        │
│  100 credits                           │  value: text-2xl font-bold = 32px
│                                        │
│  ₹99                                   │  price: text-lg zinc-600 = 28px
│                                        │
│  ┌──────────────────────────────────┐  │
│  │            Buy                   │  │  40px (py-2.5 text-sm), bg-brand-blue
│  └──────────────────────────────────┘  │  disabled while purchasing
└────────────────────────────────────────┘
  Card height: 16+20+8+32+8+28+8+40+16 ≈ 176px

Popular card gets "Most popular" pill ABOVE label:
  ╭──────────────────╮  text-xs px-2 py-0.5 rounded-full
  │ ★ Most popular   │  bg-emerald-100 text-emerald-700 = 20px tall
  ╰──────────────────╯  mb-2 (8px) above label

TRANSACTION HISTORY TABLE: mt-6, overflow-x-auto
  bg-white rounded-xl border overflow-hidden

  ┌────────────────────────────────────────────────────────────┐
  │ DATE            DESCRIPTION              AMOUNT            │  40px header
  │─────────────────────────────────────────────────────────── │
  │ 15 Jun 2026    Broadcast message         − 1  [−]         │  48px row
  │ 14 Jun 2026    350 credits (popular)     +350 [✓]         │
  └────────────────────────────────────────────────────────────┘
  Amount positive: text-green-600, CheckCircle2 h-4 = 16×16
  Amount negative: text-red-500, Minus h-4 = 16×16
  gap-1.5 (6px) between icon and number
```

---

## 13. Modal / Dialog Summary

| Dialog | Width | Overlay | Animation |
|---|---|---|---|
| Add Patient modal | 448px (max-w-md) | `bg-black/50` | none |
| Add Purchase modal | 448px (max-w-md) | `bg-black/30` | none |
| Reschedule dialog (Radix) | 384px (max-w-sm) | `bg-black/30 backdrop-blur-sm` | `fade-in-0 zoom-in-95` |
| Delete confirm (Radix) | 384px (max-w-sm) | same | same |

All modals:
- `fixed inset-0 z-50 flex items-center justify-center p-4`
- Inner card: `bg-white rounded-xl shadow-xl`
- Header section: `border-b border-zinc-100 px-5 py-4` = 52px
- Close (✕) button: `p-1.5 h-4` = 26×26px, top-right of header
- Click backdrop to close (custom modals)

---

## 14. Toast Notifications (Sonner)

```
Position: bottom-right (Sonner default)
Offset: ~16px from screen edges

┌─────────────────────────────────────────┐
│  ✓  Medicine saved                      │  ← success: green left border
└─────────────────────────────────────────┘
Width: ~356px (Sonner default)
Height: ~52px (auto, single line)
rounded-lg, shadow-lg
text-sm

Error: red accent   Success: green accent   Duration: ~4s
```

---

## 15. Page-Level Loading State

```
All pages show this while fetching initial data:

  (page content area, any height)
                    ◌            ← Loader2 h-5 w-5 (20×20px), animate-spin, text-zinc-400
  flex items-center justify-center
  min-height: h-64 (256px) on most pages
```

---

## 16. Skeleton Loading (Patient Detail)

```
Avatar skeleton:     h-12 w-12 (48×48) rounded-full bg-zinc-100 animate-pulse
Name skeleton:       h-5 (20px) w-40 (160px) rounded-lg bg-zinc-100 animate-pulse
Phone skeleton:      h-3 (12px) w-28 (112px) rounded-lg bg-zinc-100 animate-pulse
Stat skeleton:       h-8 (32px) w-full bg-zinc-100 animate-pulse (4 of them)
TableRowSkeleton:    h-12 (48px) w-full bg-zinc-100 animate-pulse, 3 of them
Generic Skeleton:    className prop sets h and w, bg-zinc-100 animate-pulse rounded-lg
```

---

## 17. Complete Page Height Summary (Desktop, without sidebar)

Approximate total scroll heights (content only, not viewport):

| Page | Est. Total Height |
|---|---|
| Login | ~390px (fits in viewport) |
| Register | ~540px (fits in viewport) |
| Onboarding | ~480px (fits in viewport) |
| Dashboard (empty) | ~540px |
| Dashboard (populated, 5 reminders each) | ~900px |
| Patients (20 rows) | ~1060px |
| Patient Detail (3 purchases) | ~850px |
| New Sale Step 1 | ~500px (fits) |
| New Sale Step 2 | scrollable, depends on medicines |
| New Sale Step 3 | ~480px (fits) |
| Inventory (10 medicines) | ~680px |
| Reminders (20 rows) | ~1020px |
| Broadcasts | ~700px |
| Settings — Profile | ~520px |
| Settings — Billing | ~620px |
