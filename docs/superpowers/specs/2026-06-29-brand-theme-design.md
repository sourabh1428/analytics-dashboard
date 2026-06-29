# Easibill Brand Theme — Obsidian & Amber

**Date:** 2026-06-29  
**Direction:** Trusted & Authoritative — think Bloomberg terminal meets premium B2B SaaS  
**Rationale:** Previous theme was generic AI-generated dark purple SaaS. Replaced with a distinctive Obsidian & Amber system.

## Color Tokens

| Token | Hex | Role |
|---|---|---|
| `--background` | `#09090B` | Page canvas |
| `--card` | `#18181B` | Cards, panels |
| `--surface-elevated` | `#1C1C1F` | Dropdowns, modals |
| `--border` | `#27272A` | Borders, dividers |
| `--border-subtle` | `#3F3F46` | Hover borders |
| `--primary` (amber) | `#F59E0B` | CTAs, links, highlights |
| `--primary-foreground` | `#09090B` | Text on amber buttons |
| `--primary-dim` | `#D97706` | Amber hover state |
| `--primary-muted` | `#78350F` | Subtle amber backgrounds |
| `--foreground` | `#FAFAFA` | Headings, key text |
| `--muted-foreground` | `#A1A1AA` | Body, labels |
| `--success` | `#22C55E` | Positive metrics |
| `--destructive` | `#EF4444` | Errors, alerts |

## Typography

- **Font:** IBM Plex Sans (400, 500, 600, 700) — loaded via Google Fonts
- Signals: serious data tool, not a startup template

## Eliminated

- All `bg-gradient-to-*` purple/indigo gradients — replaced with flat amber or zinc surfaces
- All `violet-*`, `purple-*`, `indigo-*` Tailwind classes — replaced with `amber-*` or `zinc-*`
- Pure `#000000` background — replaced with `#09090B`
- `transition: all` on `*` — removed

## Files Changed

- `src/App.css` — CSS variables, scrollbar
- `tailwind.config.js` — font family, brand color tokens
- `src/context/ThemeContext.jsx` — theme definitions (amber-based)
- `src/components/ui/button.jsx` — default variant → amber
- `src/components/ui/badge.jsx` — added `purple`, `info`, `success` variants (amber-tinted)
- `index.html` — IBM Plex Sans font, critical CSS background color
- 50+ component and page files — bulk violet/purple/indigo → amber replacement
