# IBT — Intervention Basse Tension
## ONEE Morocco · Field Intervention Management System
### Claude Code Context File — Read this fully before writing any code

---

## Project Overview

IBT is a web + mobile app for ONEE (Office National de l'Électricité et de l'Eau Potable) Morocco.
It digitizes electricity intervention workflows that are currently paper-based.
Language: French (primary). Arabic (secondary — add later, RTL support needed).
Current phase: MVP prototype. No real backend yet — use mock data only.

The generated output must be production-quality React code organized according to the project architecture.

Every screen must:

- Use reusable components
- Use Zustand state
- Use mock data
- Use React Router navigation
- Follow TypeScript strict mode
- Be easily replaceable with API calls later

---

## Actors & Roles

| Actor | Platform | Role |
|---|---|---|
| CGR Agent | Web desktop | Creates & closes tickets |
| EEP Agent | Mobile (iOS/Android) | Field team, first-tier intervention |
| SED Agent | Mobile (iOS/Android) | Heavy team, second-tier intervention |
| Coordinator | Web desktop | Admin, scheduling, approvals |
| Observer/Director | Web desktop | Read-only, no actions |

One login screen routes to a different dashboard per role.
CGR and Coordinator and Observer see wide desktop layouts.
EEP and SED screens must look like a mobile app (max-width: 390px, centered).

---

## Tech Stack

- React 18 + TypeScript (strict mode)
- Vite
- React Router v6
- Zustand (auth store + ticket store)
- Tailwind CSS with custom IBT tokens (see tailwind.config.ts)
- No backend — all data from src/mock-data/

---

## Design System (NEVER deviate from these)

### Brand Colors
```
Primary blue:    #0D2B5E   (nav, headers, primary buttons)
Secondary green: #3CB97A   (CTA buttons, success states, on-duty dots)
Accent yellow:   #F5C518   (severity: Moyenne, accent details)
Background:      #F0F2F5   (page background)
Surface white:   #FFFFFF   (cards, panels)
Text primary:    #1A1A2E
Text secondary:  #6B7280
Border:          #E5E7EB
```

### Severity Colors
```
Critique:  bg #FEE2E2  text #991B1B  dot #EF4444
Haute:     bg #FEF3C7  text #92400E  dot #F59E0B  (actually orange: #F6822E)
Moyenne:   bg #FEF9C3  text #713F12  dot #F5C518
```

### Ticket Status Colors
```
Nouveau:              #DBEAFE / #1D4ED8
Lu par EEP:           #E0F2FE / #0369A1
En cours EEP:         #FEF9C3 / #854D0E
Référé à SED:         #FFEDD5 / #C2410C
En attente approbation: #FEE2E2 / #991B1B
Approuvé → SED:       #FFEDD5 / #9A3412
En cours SED:         #FED7AA / #7C2D12
Suspendu:             #FEE2E2 / #991B1B
Programmé:            #EDE9FE / #5B21B6
Résolu EEP/SED:       #DCFCE7 / #166534
Fermé définitivement: #D1FAE5 / #065F46
```

### Typography
- Font: Inter (already in Tailwind)
- Heading sizes: 20px (h2), 16px (h3), 14px (body), 12px (label), 11px (caption)
- Weight: 400 regular, 500 medium only — never 600 or 700

### Spacing & Radius
- Card radius: 12px (rounded-xl in Tailwind)
- Button radius: 8px (rounded-lg)
- Badge radius: 20px (rounded-full)
- Page padding: 16px mobile, 24px desktop
- Card padding: 20px

---

## Folder Structure

```
src/
├── design-system/
│   ├── tokens.ts           ← export all brand colors as constants
│   └── components/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx       ← StatusBadge, SeverityBadge
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Notification.tsx
├── features/
│   ├── auth/
│   │   └── LoginScreen.tsx ← single login, routes by role
│   ├── cgr/
│   ├── eep/
│   ├── sed/
│   ├── coordinator/
│   └── observer/
├── shared/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useTickets.ts
│   ├── types/
│   │   ├── ticket.ts
│   │   ├── user.ts
│   │   └── status.ts
│   └── utils/
│       ├── formatDate.ts
│       └── getStatusColor.ts
└── mock-data/
    ├── tickets.ts
    ├── users.ts
    └── duty-schedule.ts
```

---

## Coding Conventions

- Use TypeScript strict mode always
- Functional components only, no class components
- Named exports only — no default exports
- Each screen = one file in its feature folder
- All shared UI goes in src/design-system/components/ — never duplicate
- All brand colors come from src/design-system/tokens.ts — never hardcode hex in components
- All mock data comes from src/mock-data/ — never inline fake data in components
- French labels only in UI text (no English in visible strings)
- File names: PascalCase for components, camelCase for hooks/utils

---

## Ticket Data Model (TypeScript)

```typescript
type Severity = 'Critique' | 'Haute' | 'Moyenne'

type TicketStatus =
  | 'nouveau'
  | 'assigne'
  | 'lu-eep'
  | 'en-cours-eep'
  | 'resolu-eep'
  | 'refere-sed'
  | 'attente-approbation'
  | 'approuve-sed'
  | 'en-cours-sed'
  | 'suspendu'
  | 'programme'
  | 'resolu-sed'
  | 'attente-confirmation'
  | 'ferme'

interface Ticket {
  id: string                    // 'IBT-2406-001'
  clientName: string
  contractNumber: string
  phone: string
  address: string
  sector: string                // 'Secteur 1' | 'Secteur 2' | ...
  category: string              // 'Coupure' | 'Surtension' | 'Danger'
  subCategory: string
  severity: Severity
  description?: string
  status: TicketStatus
  createdAt: Date
  createdBy: string             // CGR agent ID
  preCheckMT: boolean
  preCheckProgramme: boolean
  eepIntervention?: EEPIntervention
  coordinatorApproval?: CoordinatorApproval
  sedIntervention?: SEDIntervention
  closure?: TicketClosure
}
```

---

## Auth & Routing

```typescript
// Mock users for prototype (no real auth)
const MOCK_USERS = [
  { id: 'cgr-1', name: 'Amina Kettani', role: 'cgr', password: 'cgr123' },
  { id: 'eep-1', name: 'Mohammed Alami', role: 'eep', sector: 'Secteur 1', password: 'eep123' },
  { id: 'sed-1', name: 'Hassan Chraibi', role: 'sed', password: 'sed123' },
  { id: 'coord-1', name: 'Yasmine Benali', role: 'coordinator', password: 'coord123' },
  { id: 'obs-1', name: 'Directeur Tazi', role: 'observer', password: 'obs123' },
]

// Role → route mapping
const ROLE_ROUTES = {
  cgr: '/cgr/dashboard',
  eep: '/eep/dashboard',
  sed: '/sed/dashboard',
  coordinator: '/coordinator/dashboard',
  observer: '/observer/dashboard',
}
```

---

## Commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run type-check   # TypeScript check only
```

---

## What NOT to Do

- Never use 600 or 700 font weight
- Never hardcode colors — always import from tokens.ts
- Never create inline styles for colors or spacing
- Never put mock data inside components
- Never use English text in UI strings visible to users
- Never create a new UI component without checking design-system/components/ first
- Never skip TypeScript types — every prop and every function must be typed

---

## Current Build Status

Phase: MVP Prototype

### Completed screens
| ID | Screen | Route |
|---|---|---|
| W-CGR-01 | Login (all roles) | `/login` |
| W-CGR-02 | CGR Dashboard | `/cgr/dashboard` |
| W-CGR-03 | Pré-check Nouveau Appel | `/cgr/precheck` |
| W-CGR-04 | Nouveau Ticket (formulaire) | `/cgr/nouveau-ticket` |
| M-EEP-02 | EEP Dashboard | `/eep/dashboard` |
| M-EEP-03 | EEP Détail Ticket | `/eep/ticket/:id` |
| M-EEP-04 | EEP Mise à jour statut | `/eep/ticket/:id/statut` |
| M-EEP-05 | EEP Rapport d'intervention | `/eep/ticket/:id/rapport` |
| M-EEP-06 | EEP Référer à SED | `/eep/ticket/:id/referer` |
| W-CRD-02 | Coordinator Dashboard | `/coordinator/dashboard` |
| W-OBS-02 | Observer Dashboard | `/observer/dashboard` |
| M-SED-02  | SED Dashboard (mobile) | `/sed/dashboard` |

### In progress / Next
- W-CGR-05: Détail Ticket (vue simple CGR)
- W-CGR-06: Rapport complet ticket
- W-CGR-07: Confirmation client / Clôture
- W-CRD-05: Approbation EEP→SED (Coordinator)
- W-CRD-06: Planning de garde (Coordinator)
- W-OBS-05: Planning de garde (Observer, lecture seule)
- M-SED-03 to M-SED-06: Full SED mobile flow

### Shared components built
- `src/shared/components/NavBar.tsx` — desktop nav with CTA + logout
- `src/shared/components/MobileLayout.tsx` — mobile device frame for EEP/SED screens
- `src/design-system/components/` — Button, Card, Badge, Input, Modal, Notification
- `src/mock-data/categories.ts` — ticket categories + sub-categories

Reference designs are in /design-reference/ as HTML files exported from prototype sessions.
Use them for visual reference when building each screen — match colors, layout, and labels exactly.
