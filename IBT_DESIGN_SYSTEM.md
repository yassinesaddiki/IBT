# 🎨 IBT — Design System & UI Specification
## Intervention Basse Tension — ONEE Maroc
### Design Reference File · Version 1.0 · June 2026

---

> **Purpose of this file:** This file contains every visual and code decision made for the IBT UI prototype. Use it alongside `IBT_PROJECT_CONTEXT.md` to generate new screens in any chat session with perfect consistency — same colors, same components, same layout patterns, same code style.

---

## 🧭 Table of Contents
1. [How to Use This File](#1-how-to-use-this-file)
2. [Brand Colors — Exact Hex Values](#2-brand-colors--exact-hex-values)
3. [Typography Scale](#3-typography-scale)
4. [Spacing & Layout Rules](#4-spacing--layout-rules)
5. [Component Library](#5-component-library)
6. [Status Badge System](#6-status-badge-system)
7. [Severity Badge System](#7-severity-badge-system)
8. [Screen Layout Patterns](#8-screen-layout-patterns)
9. [CSS Class Naming Convention](#9-css-class-naming-convention)
10. [Screens Completed](#10-screens-completed)
11. [Screens Remaining](#11-screens-remaining)
12. [Key Design Decisions & Rules](#12-key-design-decisions--rules)
13. [Reusable Code Snippets](#13-reusable-code-snippets)

---

## 1. How to Use This File

### 🚀 Output Format — Deployable Multi-Page Project (Option B)

We are building a **fully deployable  prototype** 

---

## 2. Brand Colors — Exact Hex Values

### Primary Palette
```
Brand Blue (primary)      #0D2B5E   ← nav bars, primary buttons, headings
Brand Green (secondary)   #3CB97A   ← success states, CTA accents, status dots
Brand Yellow (accent)     #F5C518   ← accent bars, warnings, highlights
```

### Background Palette
```
Page background           #F0F2F5   ← main dashboard bg, right panel of login
Surface (card)            #FFFFFF   ← all cards, panels, modals
Sidebar / panel           #F8F9FB   ← secondary panels, table rows alternate
```

### Text Palette
```
Text primary              #1A1A2E   ← headings, main content
Text secondary            #6B7280   ← subtitles, descriptions, labels
Text muted                #9CA3AF   ← timestamps, hints, placeholders
Text placeholder          #B0B7C3   ← input placeholders
```

### Border Palette
```
Border default            #E5E7EB   ← card borders, dividers
Border strong             #D1D5DB   ← input borders, table dividers
Border focus              #0D2B5E   ← input focus (with 3px rgba shadow)
```

### Severity Colors
```
Critical (Critique)       #EF4444   ← text / #FEF2F2 bg / #FECACA border
High (Haute)              #F97316   ← text / #FFF7ED bg / #FED7AA border
Medium (Moyenne)          #EAB308   ← text / #FEFCE8 bg / #FEF08A border
```

### Status Colors
```
Nouveau                   #3B82F6   ← blue
Lu par EEP                #60A5FA   ← light blue
En cours EEP              #EAB308   ← yellow
Référé à SED              #F97316   ← orange
En attente approbation    #F97316   ← orange (same)
Approuvé → SED            #EA580C   ← dark orange
En cours SED              #DC7609   ← amber-orange
Suspendu                  #EF4444   ← red
Programmé                 #8B5CF6   ← purple
Résolu (any)              #22C55E   ← green
Fermé définitivement      #16A34A   ← dark green
```

### Semantic UI Colors
```
Info bg / text            #EEF3FD / #1A3A72
Success bg / text         #F0FDF4 / #166534
Warning bg / text         #FEFCE8 / #854D0E
Danger bg / text          #FEF2F2 / #991B1B
```

---

## 3. Typography Scale

### Font Stack
```css
font-family: var(--font-sans);          /* all UI text */
font-family: var(--font-mono);          /* ticket IDs, version numbers, codes */
```

### Scale
```
Page title / hero         font-size: 22px; font-weight: 500; color: #1A1A2E
Section heading           font-size: 18px; font-weight: 500; color: #1A1A2E
Card title                font-size: 15px; font-weight: 500; color: #1A1A2E
Body text                 font-size: 14px; font-weight: 400; color: #1A1A2E
Label / caption           font-size: 13px; font-weight: 500; color: #374151
Small / meta              font-size: 12px; font-weight: 400; color: #6B7280
Tiny / hint               font-size: 11px; font-weight: 400; color: #9CA3AF
Ticket ID / mono          font-size: 12px; font-family: mono; color: #6B7280

IBT brand text (login)    font-size: 66px; font-weight: 500; color: #fff; letter-spacing: -2px
ONEE wordmark             font-size: 13px; font-weight: 500; letter-spacing: .1em
```

---

## 4. Spacing & Layout Rules

### Border Radius
```
Cards / panels            border-radius: 14px
Buttons / inputs          border-radius: 8px
Badges / pills            border-radius: 20px (full pill)
Small tags / chips        border-radius: 6px
Accent bar (yellow)       border-radius: 2px
```

### Borders
```
Cards                     border: 0.5px solid #E5E7EB
Inputs (default)          border: 0.5px solid #D1D5DB
Inputs (focus)            border-color: #0D2B5E; box-shadow: 0 0 0 3px rgba(13,43,94,0.09)
Nav bar                   border-bottom: 0.5px solid #E5E7EB
Dividers                  border-top: 0.5px solid #F1F3F5
Tables                    border: 0.5px solid #E5E7EB; row dividers: border-bottom: 0.5px solid #F5F5F5
```

### Standard Spacings
```
Card padding              24px (internal)
Card padding (large)      32–38px (login, modals)
Section gap               20–24px
Form group gap            16–18px
Input height              42px
Button height             44px (primary) / 36px (secondary/small)
Nav height                56px
Sidebar width             260–280px
```

---


## 6. Status Badge System

Use these exact styles for every ticket status badge across all screens:

```javascript
const STATUS_STYLES = {
  'Nouveau':                { bg:'#EFF6FF', color:'#1D4ED8', border:'#BFDBFE' },
  'Assigné':                { bg:'#EFF6FF', color:'#1D4ED8', border:'#BFDBFE' },
  'Lu par EEP':             { bg:'#F0F9FF', color:'#0369A1', border:'#BAE6FD' },
  'En cours — EEP':         { bg:'#FEFCE8', color:'#854D0E', border:'#FEF08A' },
  'Référé à SED':           { bg:'#FFF7ED', color:'#C2410C', border:'#FED7AA' },
  'En attente approbation': { bg:'#FFF7ED', color:'#C2410C', border:'#FED7AA' },
  'Approuvé → SED':         { bg:'#FFF3E0', color:'#92400E', border:'#FCD34D' },
  'En cours — SED':         { bg:'#FFF3E0', color:'#92400E', border:'#FCD34D' },
  'Suspendu':               { bg:'#FEF2F2', color:'#991B1B', border:'#FECACA' },
  'Programmé':              { bg:'#F5F3FF', color:'#5B21B6', border:'#DDD6FE' },
  'Résolu — EEP':           { bg:'#F0FDF4', color:'#166534', border:'#BBF7D0' },
  'Résolu — SED':           { bg:'#F0FDF4', color:'#166534', border:'#BBF7D0' },
  'Fermé':                  { bg:'#DCFCE7', color:'#14532D', border:'#86EFAC' },
}
```


## 7. Severity Badge System

```
🔴 Critique   bg:#FEF2F2  color:#991B1B  border:#FECACA  dot:#EF4444
🟠 Haute      bg:#FFF7ED  color:#C2410C  border:#FED7AA  dot:#F97316
🟡 Moyenne    bg:#FEFCE8  color:#854D0E  border:#FEF08A  dot:#EAB308
```


## 8. Screen Layout Patterns

### Pattern A — Split Login Screen (used for all login screens)
```
┌─────────────────────────────────────────────────────┐
│  LEFT PANEL 40%        │  RIGHT PANEL 60%           │
│  bg: #0D2B5E           │  bg: #F0F2F5               │
│                        │                            │
│  [ONEE logo]           │     ┌──────────────────┐   │
│                        │     │  [Role badge]    │   │
│  IBT          ← 66px  │     │  Connexion       │   │
│  ────                  │     │  Subtitle        │   │
│  Intervention          │     │                  │   │
│  Basse Tension         │     │  [Identifiant]   │   │
│  Description           │     │  [Mot de passe]  │   │
│                        │     │  [Se connecter]  │   │
│  ● Système opérationnel│     │  ─────────────── │   │
│                   v1.0 │     │  🔒 Accès ONEE   │   │
│                        │     └──────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Pattern B — Full Web Dashboard (CGR, Coordinator, Observer)
```
┌─────────────────────────────────────────────────────┐
│  NAV BAR  bg:#0D2B5E  height:56px                   │
│  [⚡ IBT]    [Nav links]      [🔔] [User avatar]    │
├─────────────────────────────────────────────────────┤
│  PAGE BG: #F0F2F5                                   │
│  ┌──────────────────────────────┐ ┌───────────────┐ │
│  │  MAIN CONTENT (≈70%)         │ │ SIDEBAR (≈30%)│ │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ │ │               │ │
│  │  │KPI │ │KPI │ │KPI │ │KPI │ │ │  Duty widget  │ │
│  │  └────┘ └────┘ └────┘ └────┘ │ │               │ │
│  │  [Filters row]               │ │  Quick stats  │ │
│  │  [Ticket list / table]       │ │               │ │
│  └──────────────────────────────┘ └───────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Pattern C — Mobile App Screen (EEP, SED)
```
┌─────────────────────┐
│  STATUS BAR          │ ← top system bar simulation
├─────────────────────┤
│  ← Back    Title  🔔 │ ← app header, bg:#0D2B5E, color:#fff
├─────────────────────┤
│  CONTENT AREA        │ ← bg:#F0F2F5
│  (scrollable)        │
│                      │
│  Cards / forms       │
│                      │
├─────────────────────┤
│  [Primary Action]    │ ← sticky bottom button, bg:#0D2B5E
└─────────────────────┘
Width: 375px centered in a device frame
Device frame bg: #1A1A2E (dark, simulates phone)
```

### Pattern D — Modal / Overlay
```
Use a normal-flow faux-viewport div (never position:fixed):
<div style="min-height:500px;background:rgba(13,43,94,0.45);
  border-radius:12px;display:flex;align-items:center;justify-content:center;">
  <!-- modal card inside -->
</div>
```

---


---

## 10. Screens Completed

| ID | Screen | Actor | Platform | Status |
|---|---|---|---|---|
| W-CGR-01 | Login screen | CGR | Web | ✅ Done |
| W-CGR-02 | Main dashboard | CGR | Web | 🔄 Next |

---



## 12. Key Design Decisions & Rules

### Visual Identity
- The **left brand panel** (dark blue, IBT in 66px, yellow bar) is the signature of all login/auth screens
- The **green dot** status indicator always appears at the bottom-left of the brand panel
- The **yellow bar** (4px, 50px wide, border-radius:2px) always appears under the "IBT" hero text
- The ONEE logo uses a green (#3CB97A) rounded square with a white bolt icon (`ti-bolt`)

### Navigation Bar (web dashboards)
- Background: `#0D2B5E` (brand blue), height: 56px
- Left: ONEE bolt logo (24px green square) + "IBT" text in white
- Right: notification bell with badge + user avatar with name
- "Nouveau Appel" CTA button: `background:#3CB97A`, positioned in the nav or as a floating button

### Ticket Table Rules
- Table background: `#fff`, border: `0.5px solid #E5E7EB`
- Header row: `background:#F8F9FB`, `font-size:11px`, `font-weight:500`, `color:#6B7280`, `text-transform:uppercase`, `letter-spacing:.05em`
- Data rows: `font-size:13px`, alternating `background:#fff` / `#FAFAFA`, hover: `#F5F7FA`
- Row height: 52px minimum
- Ticket ID column: mono font, color:#6B7280
- Time elapsed: color:#9CA3AF, font-size:12px

### Mobile Screens
- Simulate inside a device frame (dark border, border-radius:36px, width:375px)
- App header: bg:#0D2B5E, height:56px, white text + icons
- Status bar simulation at top: dark bg, white text, shows time (09:41) + icons
- Bottom action button: always full-width, height:52px, bg:#0D2B5E or #3CB97A
- Cards on mobile: border-radius:14px, padding:16px, margin-bottom:12px

### Animations (all screens)
- Card entrance: `@keyframes up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }` — 0.3s ease
- Button loading: `ti-loader-2` icon with `animation:spin .7s linear infinite`
- Success state: background switches to `#3CB97A` with `ti-check` icon
- Always wrap in `@media(prefers-reduced-motion:no-preference)` for the entrance animation

### Interactivity Rules
- All primary buttons must have a simulated loading state
- After successful action, use `sendPrompt()` to advance to the next screen
- Password fields must have show/hide toggle using `ti-eye` / `ti-eye-off`
- Status filters must work (filter the visible ticket rows on click)
- Notification bell badge must show a number

### No-nos (never do these)
- No `position:fixed` (breaks iframe height)
- No CSS gradients (use flat fills)
- No drop shadows or blur
- No `height:100vh` or `min-height:100vh`
- No CSS variables for brand colors (use hardcoded hex)
- No dark mode overrides (this is a branded mockup with fixed colors)
- No `display:none` for tabs during streaming (use JS after load)
- No external fonts (use `var(--font-sans)` and `var(--font-mono)`)

---

## 13. Reusable Code Snippets

- Always Cheack if there is a reusable componenet before creating a new one and if you do make sure to add to the componenets folder for future use too

*End of IBT Design System File v1.1*
