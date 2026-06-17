# 📁 IBT — Intervention Basse Tension
## Système de Gestion des Interventions — ONEE Maroc
### Project Context File · Version 1.0 · June 2026

---

> **Purpose of this file:** Complete specification document for the IBT application. Use this file to resume work in any new chat session, generate UI screens, write code, or create presentations. Keep it updated after every working session.

---

## 🧭 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Actors & Roles](#2-actors--roles)
3. [Platform & Devices](#3-platform--devices)
4. [Design System](#4-design-system)
5. [Pre-Ticket Check Logic (CGR)](#5-pre-ticket-check-logic-cgr)
6. [Ticket Structure](#6-ticket-structure)
7. [Problem Categories (Admin-Editable)](#7-problem-categories-admin-editable)
8. [Ticket Status Flow (Full Lifecycle)](#8-ticket-status-flow-full-lifecycle)
9. [Notifications Matrix](#9-notifications-matrix)
10. [Duty Schedule / Planning de Garde](#10-duty-schedule--planning-de-garde)
11. [Analytics & Reports](#11-analytics--reports)
12. [Screens Inventory (All Actors)](#12-screens-inventory-all-actors)
13. [MVP Scope — CEO Presentation](#13-mvp-scope--ceo-presentation)
14. [Key Problems to Highlight](#14-key-problems-to-highlight)
15. [Open Questions / Decisions Pending](#15-open-questions--decisions-pending)
16. [Changelog](#16-changelog)

---

## 1. Project Overview

| Field | Value |
|---|---|
| **Project Name** | IBT — Intervention Basse Tension |
| **Client Organization** | ONEE — Office National de l'Électricité et de l'Eau Potable |
| **Country** | Morocco 🇲🇦 |
| **Project Type** | Field Intervention Management System |
| **Current State** | Paper-based only — no digital system exists |
| **Goal** | Digitize, track and automate electricity intervention workflows |
| **Languages** | French (primary) · Arabic (secondary, bilingual toggle, RTL support needed) |
| **Design Output** | Figma Clickable Prototype (MVP) |
| **Future Goal** | Full production mobile + web application |

### Problem Statement
The current process is entirely paper-based, causing:
- **Communication gaps** between CGR, EEP, and SED teams
- **Missing data** — no traceability on who did what and when
- **No centralized tracking** — ticket status is unknown between handoffs
- **Lost information** — comments, time spent, field observations are not captured
- **No visibility** for coordinators and directors on real-time operations

---

## 2. Actors & Roles

### 2.1 Actor Overview Table

| Actor | Platform | Access Level | Primary Job |
|---|---|---|---|
| **CGR Agent** | Web (Desktop) | Create + Close tickets | Receives client calls, opens/closes tickets |
| **EEP Agent** | Mobile (iOS + Android) | Update assigned tickets | Field team, first-tier intervention |
| **SED Agent** | Mobile (iOS + Android) | Update referred tickets | Field team, heavy/complex interventions |
| **Coordinator** | Web (Desktop) | Full admin + management | Schedule, approvals, all data, settings |
| **Observer / Director** | Web (Desktop) | Read-only | View everything, no interventions |

---

### 2.2 CGR Agent — Centre de Gestion des Réclamations

**Role:** Frontline agent who receives client calls and manages the ticket lifecycle from open to final close.

**Responsibilities:**
- Answer client calls and collect information
- Perform **pre-ticket check** (verify MT or Programmed shortage) by calling SED
- Create tickets and assign to the correct sector
- Monitor ticket progress and receive notifications on status changes
- Call the client (or after-sales service) when ticket is resolved to confirm satisfaction
- Add final comments from client call
- **Definitively close** the ticket after client confirmation

**What they CAN'T do:**
- Cannot modify ticket after EEP/SED have taken over (read only for those stages)
- Cannot approve referrals (that's the Coordinator)
- Cannot modify categories, sectors, or employee lists

**Platform:** Web Dashboard (Desktop)
**Notification:** Yes — notified at every stage change

---

### 2.3 EEP Agent — Équipe d'Exploitation et Production (First-Tier Field Team)

**Role:** First responders. Go to the site, inspect and resolve if possible.

**Team Structure:**
- 4 sectors across the city
- 2 people on duty per sector per week (= 8 agents on duty at any given time)
- Weekly rotation managed by the Coordinator
- Rotation can be planned up to 1 full month in advance
- Structure is **flexible** — more sectors or more people per duty can be added later

**Responsibilities:**
- Receive new ticket notification for their sector
- Go to the intervention site
- Update ticket status: read → in progress → resolved / referred to SED
- Log time spent (start time, end time — system calculates duration)
- Add photos from the intervention site
- Add detailed comments about what was found and what was done
- If the problem is beyond their capability → refer ticket to SED (awaits Coordinator approval)

**Platform:** Mobile App (iOS + Android)
**Notification:** Yes — notified when a new ticket is assigned to their sector

---

### 2.4 SED Agent — Service d'Exploitation et Distribution (Second-Tier Heavy Team)

**Role:** Heavy intervention team. Handles complex problems requiring more budget, equipment, or machinery.

**Equipment:** Pick-up trucks, heavy machinery, wiring equipment

**Responsibilities:**
- Receive tickets that have been: referred by EEP + approved by Coordinator
- Review EEP's full report on the ticket
- Decide course of action:
  - Start working immediately
  - Suspend (needs budget approval, director permission, or material from warehouse)
  - Program for a future date
- Log time, photos, detailed intervention report
- Update status when work is complete
- Handle suspension/hold situations **internally** (their own department handles approvals)

**Platform:** Mobile App (iOS + Android)
**Notification:** Yes — notified when a ticket is approved and assigned to SED

**Note:** SED handles their own "on-hold" approvals. The system just needs to show these statuses clearly.

---

### 2.5 Coordinator

**Role:** System manager and operational supervisor. The central authority of the IBT application.

**Responsibilities:**
- **Schedule Management:** Set and manage duty rotations for EEP teams (weekly, up to 1 month in advance)
- **Approval Flow:** Review and approve (or reject) EEP→SED ticket referrals
- **Employee Management:** Add, edit, remove employees; assign to sectors/teams
- **Sector Management:** Create, rename, or deactivate sectors
- **Ticket Management:** Can modify any ticket; has full edit access
- **Category Management:** Add, edit, or remove problem categories and sub-categories (admin panel)
- **Analytics:** View all metrics and reports; export to PDF
- **Full Visibility:** See all tickets at all stages, all statuses, all teams

**Platform:** Web Dashboard (Desktop)
**Notification:** Yes — notified when EEP refers a ticket for Coordinator approval

---

### 2.6 Observer / Director (Read-Only)

**Role:** High-hierarchy personnel (Chef de département, Director, or any senior leadership) who need visibility without intervention capability.

**Can See:**
- All tickets and their statuses
- Who is currently on duty (EEP team schedule)
- Real-time intervention tracking
- Analytics and performance dashboards
- Full ticket detail/report
- Duty calendar with contact information

**Cannot Do:**
- Cannot create, edit, modify, or close any ticket
- Cannot change any settings
- No actions whatsoever — purely passive

**Platform:** Web Dashboard (Desktop)
**Notification:** NONE — directors are not to be disturbed

---

## 3. Platform & Devices

| Platform | Used By | Notes |
|---|---|---|
| Web Dashboard (Desktop) | CGR, Coordinator, Observer/Director | Optimized for desktop browsers |
| Mobile App — iOS | EEP Agent, SED Agent | Field use, outdoors, large touch targets |
| Mobile App — Android | EEP Agent, SED Agent | Field use, outdoors, large touch targets |

**Current Phase:** UI/UX Prototype only (Figma Clickable Prototype)
**Future Phase:** Full production development (mobile app + web app)

---

## 4. Design System

### 4.1 Brand Colors

| Role | Color | Hex (Suggested) |
|---|---|---|
| Primary | Dark Blue | `#0D2B5E` |
| Secondary | Light Green | `#3CB97A` |
| Accent | Yellow | `#F5C518` |
| Critical Severity | Red | `#E53E3E` |
| High Severity | Orange | `#F6822E` |
| Medium Severity | Yellow | `#F5C518` |
| Background | Off-White | `#F4F6F9` |
| Surface | White | `#FFFFFF` |
| Text Primary | Dark | `#1A1A2E` |
| Text Secondary | Grey | `#6B7280` |
| Border | Light Grey | `#E5E7EB` |
| Success | Green | `#22C55E` |
| Warning | Amber | `#F59E0B` |
| Danger | Red | `#EF4444` |

### 4.2 Typography

- **Primary Font:** Inter (French) / Noto Sans Arabic (Arabic) — both support Latin + Arabic scripts
- **Heading:** Bold, Dark Blue
- **Body:** Regular, Dark Text
- **Labels/Status:** Medium weight, colored by status
- **RTL Support required** for Arabic language version

### 4.3 UI Tone & Style

- **Professional** — government utility agency aesthetic
- **Utility-focused** — EEP/SED agents use it in the field, sometimes in harsh conditions
- **Clear hierarchy** — tickets statuses and severities must be visually obvious at a glance
- **Accessible** — large touch targets on mobile (min 44px), high contrast for outdoor visibility
- **Consistent** — same ticket data shown across all roles, adapted to their view (simple vs full)

### 4.4 Status Color Coding

| Status | Color |
|---|---|
| Nouveau (New) | Blue |
| Lu par EEP (Read) | Light Blue |
| En cours — EEP | Yellow |
| Référé à SED (Pending Approval) | Orange |
| Approuvé → En cours — SED | Dark Orange |
| Suspendu | Red |
| Programmé | Purple |
| Résolu (any stage) | Green |
| Fermé définitivement | Dark Green |

---

## 5. Pre-Ticket Check Logic (CGR)

Before creating any ticket, CGR **must perform a mandatory pre-check**. This is a critical step to avoid creating unnecessary tickets.

### 5.1 Flow

```
Client calls CGR
       ↓
CGR collects: Name, Contract #, Phone, Address, Nature of Problem
       ↓
PRE-CHECK STEP 1: Is this an MT (Moyen Tension) problem?
  → CGR calls SED team by phone (outside the app — phone call)
  → SED confirms YES or NO
  │
  ├── YES (MT problem): 
  │      → Log the pre-check result in the system
  │      → Inform client: "SED team is already working on it"
  │      → NO ticket created
  │      → End call
  │
  └── NO (Not MT):
         ↓
PRE-CHECK STEP 2: Is there a Programmed Shortage in that sector?
  → CGR checks with SED (same call or separate)
  │
  ├── YES (Programmed Shortage):
  │      → Log the pre-check result
  │      → Inform client: "Scheduled maintenance in progress"
  │      → NO ticket created
  │      → End call
  │
  └── NO (Neither MT nor Programmed):
         ↓
       → OPEN A NEW TICKET ✅
```

### 5.2 Pre-Check UI Requirements
- CGR Dashboard must have a clear **"Nouveau Appel / Nouvelle Intervention"** button
- Before the ticket form appears, a **pre-check modal/screen** must appear
- Two confirmation checkboxes/toggles:
  - [ ] Vérifié avec SED — Pas de problème MT dans ce secteur
  - [ ] Vérifié avec SED — Pas de coupure programmée dans ce secteur
- Only after both are checked can the ticket form open
- The pre-check result is **saved on the ticket** for traceability

---

## 6. Ticket Structure

### 6.1 Two Views of the Same Ticket

All data comes from one database, but the ticket is presented in two views:

| View | Used By | Content |
|---|---|---|
| **Simple Ticket** | EEP Agent (mobile) | Client info, problem, severity, sector — clean, readable field card |
| **Full Ticket / Rapport** | CGR, Coordinator, SED, Observer | All simple data + all stage details, times, photos, comments, status history, agents involved |

---

### 6.2 Full Ticket Fields (Complete Data Model)

#### 📌 Section A — Client Information (filled by CGR)
| Field | Type | Notes |
|---|---|---|
| Nom du client | Text | Client's full name |
| Numéro de contrat | Text/Number | Unique contract ID |
| Numéro de téléphone | Phone | Client's phone number |
| Adresse | Text | Full address as told by client |
| Secteur | Dropdown | Assigned by CGR based on address |

#### 📌 Section B — Problem Information (filled by CGR)
| Field | Type | Notes |
|---|---|---|
| Catégorie du problème | Dropdown (Level 1) | Main category: Coupure / Surtension / Danger |
| Sous-catégorie | Dropdown (Level 2) | Detailed sub-type (see Section 7) |
| Sévérité | Select | 🔴 Critique / 🟠 Haute / 🟡 Moyenne |
| Description libre | Text Area | Optional free text from client |

#### 📌 Section C — Pre-Check Log (auto-saved by CGR)
| Field | Type | Notes |
|---|---|---|
| Vérifié MT | Boolean | Was SED called and MT confirmed absent? |
| Vérifié Coupure Programmée | Boolean | Was programmed shortage confirmed absent? |
| Agent CGR créateur | Auto | Which CGR agent created the ticket |
| Date/heure de création | Auto (Timestamp) | When the ticket was opened |
| Numéro de ticket | Auto-generated | Unique ticket ID |

#### 📌 Section D — EEP Intervention (filled by EEP Agent)
| Field | Type | Notes |
|---|---|---|
| Agent(s) EEP assigné(s) | Auto (from duty schedule) | Who is on duty for that sector |
| Date/heure de lecture | Auto (Timestamp) | When EEP first read/opened the ticket |
| Date/heure de début intervention | Timestamp | When EEP started working |
| Date/heure de fin intervention | Timestamp | When EEP finished |
| Durée totale EEP | Calculated | Auto-computed from start/end |
| Actions effectuées | Text Area | What the EEP team did |
| Photos de terrain | Images (multiple) | Photos taken on-site by EEP |
| Résultat EEP | Select | ✅ Résolu / ➡️ Référé à SED |
| Commentaires EEP | Text Area | Any additional important notes |

#### 📌 Section E — Coordinator Approval (if referred to SED)
| Field | Type | Notes |
|---|---|---|
| Date/heure de référence | Auto (Timestamp) | When EEP marked as referred |
| Coordinateur approuvant | Auto | Which coordinator reviewed |
| Date/heure d'approbation | Timestamp | When coordinator approved |
| Commentaires coordinateur | Text Area | Notes from coordinator |
| Décision | Select | ✅ Approuvé / ❌ Refusé (sent back to EEP) |

#### 📌 Section F — SED Intervention (filled by SED Agent)
| Field | Type | Notes |
|---|---|---|
| Agent(s) SED assigné(s) | Text/Select | Who from SED is handling it |
| Date/heure de réception | Auto (Timestamp) | When SED received the ticket |
| Date/heure de début | Timestamp | When SED started |
| Date/heure de fin | Timestamp | When SED finished |
| Durée totale SED | Calculated | Auto-computed |
| Statut SED | Select | 🔧 En cours / ⏸️ Suspendu / 📅 Programmé / ✅ Résolu |
| Raison suspension | Text Area | If suspended: what's needed (budget, permission, material) |
| Date programmée | Date | If scheduled: what date is the intervention |
| Rapport d'intervention SED | Text Area | Full report of work done |
| Photos SED | Images (multiple) | On-site photos |
| Commentaires SED | Text Area | Additional notes |

#### 📌 Section G — Final Closure (CGR)
| Field | Type | Notes |
|---|---|---|
| Appel client effectué | Boolean | Did CGR call the client? |
| Satisfaction client | Select | ✅ Satisfait / ⚠️ Problème persistant / 📝 Remarques |
| Commentaires de clôture | Text Area | Notes from client confirmation call |
| Agent CGR clôturant | Auto | Who closed the ticket |
| Date/heure de clôture définitive | Auto (Timestamp) | Final timestamp |
| Statut final | Auto | 🟢 FERMÉ DÉFINITIVEMENT |

---

## 7. Problem Categories (Admin-Editable)

> These lists must be editable by the Coordinator via an admin panel. New categories can be added, existing ones renamed or deactivated.

### 7.1 Level 1 — Main Categories

| ID | Category (FR) | Severity Suggestion |
|---|---|---|
| CAT-01 | Coupure | Critique to Moyenne |
| CAT-02 | Surtension | Haute to Moyenne |
| CAT-03 | Danger | Critique (always) |

### 7.2 Level 2 — Sub-Categories

#### CAT-01 — Coupure
| Sub-ID | Sub-Category |
|---|---|
| COP-01 | Coupure client individuel |
| COP-02 | Coupure groupe d'abonnés |
| COP-03 | Compteur endommagé |
| COP-04 | Compteur disparu (volé) |
| COP-05 | Compteur bloqué |
| COP-06 | Câble aérien endommagé |
| COP-07 | Câble souterrain endommagé |
| COP-08 | Poste endommagé |
| COP-09 | Boîte / Disjoncteur grillé |

#### CAT-02 — Surtension
| Sub-ID | Sub-Category |
|---|---|
| SUR-01 | Surtension client individuel |
| SUR-02 | Surtension groupe d'abonnés |

#### CAT-03 — Danger
| Sub-ID | Sub-Category |
|---|---|
| DAN-01 | Incendie (électrique) |
| DAN-02 | Étincelles sur fils extérieurs |
| DAN-03 | Poste ouvert / non sécurisé |
| DAN-04 | Poteau incliné |
| DAN-05 | Poteau défaillant / cassé |
| DAN-06 | Fil tombé au sol |

> Note: All Danger sub-categories should auto-suggest "Critique" severity.

---

## 8. Ticket Status Flow (Full Lifecycle)

### 8.1 Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     TICKET LIFECYCLE                        │
└─────────────────────────────────────────────────────────────┘

CLIENT APPEL CGR
       ↓
[PRE-CHECK] — MT? Coupure Programmée?
       ↓ (Neither confirmed)
[🆕 NOUVEAU] — Ticket créé par CGR
       ↓ Assigned to sector
[📋 ASSIGNÉ] — EEP notified
       ↓ EEP opens the ticket
[👁️ LU PAR EEP] — EEP acknowledged
       ↓ EEP goes to site
[🔧 EN COURS — EEP] — Intervention in progress
       ↓
   ┌───────────────────────┐
   │                       │
   ↓                       ↓
[✅ RÉSOLU - EEP]    [➡️ RÉFÉRÉ À SED]
   ↓                       ↓ (Coordinator notified)
CGR calls client    [⏳ EN ATTENTE APPROBATION]
   ↓                       ↓ Coordinator reviews
[📞 APPEL CLIENT]    ┌─────────────────┐
   ↓                 ↓                 ↓
[🟢 FERMÉ        [✅ APPROUVÉ]    [❌ REFUSÉ]
 DÉFINITIVEMENT]      ↓            (sent back to EEP)
                 [🔧 EN COURS — SED]
                      ↓
           ┌──────────┼──────────┐
           ↓          ↓          ↓
      [✅ RÉSOLU] [⏸️ SUSPENDU] [📅 PROGRAMMÉ]
           ↓       (internal)   (future date set)
      CGR calls       ↓              ↓
      client     (SED handles)  (Re-opens on date)
           ↓
      [📞 APPEL CLIENT]
           ↓
      [🟢 FERMÉ DÉFINITIVEMENT]
```

### 8.2 All Possible Ticket Statuses

| Status ID | Label (FR) | Who Sets It | Description |
|---|---|---|---|
| S-01 | 🆕 Nouveau | System (auto) | Ticket just created by CGR |
| S-02 | 📋 Assigné au secteur | System (auto) | Routed to correct sector EEP |
| S-03 | 👁️ Lu par l'EEP | EEP Agent | EEP opened and read the ticket |
| S-04 | 🔧 En cours — EEP | EEP Agent | EEP is on-site and working |
| S-05 | ✅ Résolu — EEP | EEP Agent | EEP completed the work |
| S-06 | ➡️ Référé à SED | EEP Agent | EEP cannot resolve, referring up |
| S-07 | ⏳ En attente approbation | System (auto) | Waiting for Coordinator to approve referral |
| S-08 | ✅ Approuvé → SED | Coordinator | Coordinator approved referral |
| S-09 | ❌ Refusé (retour EEP) | Coordinator | Coordinator rejected referral, sent back |
| S-10 | 🔧 En cours — SED | SED Agent | SED is working on it |
| S-11 | ⏸️ Suspendu | SED Agent | On hold (budget, permission, material) |
| S-12 | 📅 Programmé | SED Agent | Scheduled for a future date |
| S-13 | ✅ Résolu — SED | SED Agent | SED completed the work |
| S-14 | 📞 En attente confirmation client | CGR | CGR called/calling the client |
| S-15 | 🟢 Fermé définitivement | CGR | Client confirmed, ticket closed |

---

## 9. Notifications Matrix

| Event | CGR | EEP | Coordinator | SED | Observer |
|---|---|---|---|---|---|
| Ticket created (new) | ✅ (confirmation) | ✅ (new ticket alert) | — | — | — |
| EEP reads ticket | ✅ | — | — | — | — |
| EEP starts intervention | ✅ | — | — | — | — |
| EEP resolves ticket | ✅ | — | — | — | — |
| EEP refers to SED | ✅ | — | ✅ (approval needed) | — | — |
| Coordinator approves referral | ✅ | ✅ | — | ✅ (new ticket) | — |
| Coordinator rejects referral | ✅ | ✅ (ticket returned) | — | — | — |
| SED updates status | ✅ | — | ✅ | — | — |
| SED resolves ticket | ✅ | — | ✅ | — | — |
| Ticket closed definitively | — | — | ✅ | — | — |

**Rule:** Observers / Directors receive **NO notifications** (passive, read-only).
**Rule:** Notifications are **in-app only** for now (push notifications in future).

---

## 10. Duty Schedule / Planning de Garde

### 10.1 Structure

- **4 sectors** across the city (expandable — Coordinator can add sectors)
- **2 EEP agents on duty** per sector per week (number is flexible per sector)
- Weekly rotation managed by the Coordinator
- Can be planned **up to 1 full month** in advance
- Each week = a "shift" that the Coordinator assigns

### 10.2 Planning Features (Coordinator)

- Monthly calendar view with weekly grid
- Per sector, assign agents to a week slot
- Can drag-drop or select agents from a dropdown list
- Visual indication: "Planned" / "Confirmed" / "Past"
- Ability to swap agents for a specific week without affecting the rest
- Alert if a week slot is empty (no one assigned)

### 10.3 On-Duty Card (Visible to Observers & CGR)

For each person currently on duty, the following is visible:

| Field | Type |
|---|---|
| Nom complet | Text |
| Matricule (Employee Number) | Text |
| Numéro de téléphone | Phone (tappable on mobile) |
| Secteur assigné | Text |
| Tickets en cours | Count + list |
| Tickets clôturés cette semaine | Count |

### 10.4 Who Sees the Schedule

| Actor | Can See Schedule | Can Edit Schedule |
|---|---|---|
| CGR | Yes (read-only) | No |
| EEP | Yes (own schedule only) | No |
| SED | No | No |
| Coordinator | Yes (all) | ✅ Yes |
| Observer | Yes (all) | No |

---

## 11. Analytics & Reports

### 11.1 MVP Dashboard KPIs (Simple — for CEO presentation)

- Total tickets today / this week / this month
- Tickets by status (pie or donut chart)
- Tickets by sector (bar chart)
- Tickets by severity (Critique / Haute / Moyenne)
- Average resolution time (EEP stage)
- % resolved by EEP vs referred to SED
- Tickets currently open vs closed
- Who is on duty right now (live widget)

### 11.2 Future Detailed Analytics

- Per-agent performance (tickets handled, avg time)
- Per-sector frequency
- Category breakdown (most common problem types)
- SED intervention stats (suspended rate, programmed rate)
- Monthly trend graphs
- Time-to-response analysis

### 11.3 Reports

- **MVP:** Simple PDF export of ticket list with filters
- **Future:** Full printable reports with charts and tables
- **Audience:** Coordinator (generates), Observer/Director (reads)

---

## 12. Screens Inventory (All Actors)

### 12.1 Web Dashboard — CGR Agent

| # | Screen Name | Description |
|---|---|---|
| W-CGR-01 | Login | Auth screen for CGR agents |
| W-CGR-02 | Dashboard / Accueil | Ticket list with filters, status overview, quick stats |
| W-CGR-03 | Nouveau Appel — Pré-check | Pre-check modal before opening ticket (MT / Programmé check) |
| W-CGR-04 | Nouveau Ticket — Formulaire | Create ticket form (client info + problem info) |
| W-CGR-05 | Détail Ticket (Simple) | Read ticket status + current stage |
| W-CGR-06 | Détail Ticket (Rapport complet) | Full ticket report with all stages, times, comments, photos |
| W-CGR-07 | Confirmation Client — Clôture | Screen to log client call and confirm resolution before closing |
| W-CGR-08 | Notifications | In-app notification center |

---

### 12.2 Mobile App — EEP Agent

| # | Screen Name | Description |
|---|---|---|
| M-EEP-01 | Login | Auth screen |
| M-EEP-02 | Tableau de bord | My assigned tickets, status, on-duty indicator |
| M-EEP-03 | Détail Ticket (Simple) | Simplified ticket card: client info, problem, severity, address |
| M-EEP-04 | Mise à jour statut | Update ticket status (Read / En cours / Résolu / Référé SED) |
| M-EEP-05 | Rapport d'intervention | Form to fill: actions done, time, photos, comments |
| M-EEP-06 | Référer à SED | Confirmation screen + notes before referring to SED |
| M-EEP-07 | Notifications | Push/in-app alerts for new tickets |

---

### 12.3 Mobile App — SED Agent

| # | Screen Name | Description |
|---|---|---|
| M-SED-01 | Login | Auth screen |
| M-SED-02 | Tableau de bord | Referred + approved tickets assigned to SED |
| M-SED-03 | Détail Ticket (avec rapport EEP) | Full ticket including EEP's report as context |
| M-SED-04 | Mise à jour statut SED | Set status: En cours / Suspendu / Programmé / Résolu |
| M-SED-05 | Rapport SED | Form: work done, duration, photos, comments, reason if suspended |
| M-SED-06 | Programmer intervention | If "Programmé": set date and notes |
| M-SED-07 | Notifications | Alerts for newly assigned tickets |

---

### 12.4 Web Dashboard — Coordinator

| # | Screen Name | Description |
|---|---|---|
| W-CRD-01 | Login | Auth screen |
| W-CRD-02 | Tableau de bord Coordinateur | KPIs, tickets overview, pending approvals alert, who's on duty |
| W-CRD-03 | Gestion des Tickets (All) | Full ticket list, all statuses, all sectors, all teams |
| W-CRD-04 | Détail Ticket (Rapport complet) | Full read + edit access on any ticket |
| W-CRD-05 | Approbation Référence EEP→SED | Review EEP report and approve/reject referral to SED |
| W-CRD-06 | Planning de Garde | Monthly/weekly calendar to set duty rotations |
| W-CRD-07 | Gestion Employés | Add/edit/remove employees; assign to team/sector |
| W-CRD-08 | Gestion Secteurs | Add/rename/deactivate sectors |
| W-CRD-09 | Gestion Catégories | Admin panel: edit problem categories and sub-categories |
| W-CRD-10 | Rapports & Statistiques | Analytics dashboard + PDF export |
| W-CRD-11 | Notifications | Approval requests + system alerts |

---

### 12.5 Web Dashboard — Observer / Director

| # | Screen Name | Description |
|---|---|---|
| W-OBS-01 | Login | Auth screen |
| W-OBS-02 | Vue d'ensemble (Read-only) | High-level KPI dashboard |
| W-OBS-03 | Tickets (Read-only) | All tickets with filters — view only |
| W-OBS-04 | Détail Ticket (Read-only) | Full report view |
| W-OBS-05 | Planning de Garde | Who is on duty now + full calendar (read-only) |
| W-OBS-06 | Rapports | View analytics and export PDF |

---

## 13. MVP Scope — CEO Presentation

### Primary Goal
Demonstrate to the CEO/Director that this system solves the key operational problems. Show the **main intervention circuit** with clarity.

### Priority Screens for Prototype (Figma Clickable)

#### Flow 1 — Main Happy Path (CGR → EEP → Resolved)
1. W-CGR-03 — Pre-check screen
2. W-CGR-04 — New Ticket Form
3. M-EEP-02 — EEP Dashboard (ticket appears)
4. M-EEP-03 — EEP reads ticket
5. M-EEP-04 — EEP updates status to "En cours"
6. M-EEP-05 — EEP fills intervention report
7. W-CGR-06 — CGR sees full ticket updated in real-time
8. W-CGR-07 — CGR calls client and closes ticket
9. W-CRD-02 — Coordinator dashboard shows ticket closed

#### Flow 2 — Referral Path (EEP → SED)
1. M-EEP-06 — EEP refers to SED
2. W-CRD-05 — Coordinator receives and approves
3. M-SED-03 — SED sees ticket with EEP report
4. M-SED-04 — SED updates status
5. M-SED-05 — SED fills report / marks resolved
6. W-CGR-07 — CGR closes ticket

#### Flow 3 — Duty Schedule View
1. W-CRD-06 — Coordinator sets monthly schedule
2. W-OBS-05 — Director sees who's on duty
3. W-CGR-02 — CGR sees who's on duty in their dashboard

### Key Messages for CEO Presentation

1. **"Zéro fuite d'information"** — Every action is logged with timestamp and agent
2. **"Visibilité en temps réel"** — CGR and Director can see exactly what's happening on any ticket
3. **"Traçabilité complète"** — From client call to final closure, everything is recorded
4. **"Coordination automatisée"** — No more phone calls between teams to know who's doing what
5. **"Données exploitables"** — Analytics and reports for performance improvement

---

## 14. Key Problems to Highlight

| Problem | Current (Paper) | With IBT |
|---|---|---|
| Communication | Phone calls between all teams, info lost | In-app notifications + status visible to all |
| Traceability | No record of who did what | Full audit trail on every ticket |
| Data gaps | Time spent unknown, no photos captured | Logged duration + photos at each stage |
| Coordination | EEP→SED referral is informal, no approval | Formal referral + Coordinator approval gate |
| Visibility for directors | No visibility unless asking someone | Real-time read-only dashboard |
| Duty schedule | Manual paper list, hard to distribute | Digital calendar, visible to all |
| Ticket status | Unknown after dispatch | Tracked through all 15 statuses |
| Client satisfaction | Not verified consistently | Mandatory client call + logged confirmation |

---

## 15. Open Questions / Decisions Pending

| # | Question | Priority | Status |
|---|---|---|---|
| OQ-01 | How many SED agents are there total? Do they have their own sectors/sub-teams? | High | ❓ Unanswered |
| OQ-02 | Does SED have a team leader who assigns tasks internally? | Medium | ❓ Unanswered |
| OQ-03 | When a ticket is set to "Programmé" by SED, does it automatically reactivate on that date? | High | ❓ Unanswered |
| OQ-04 | Can a Coordinator reject a referral and send it back to EEP? If yes, what happens next? | High | ❓ Unanswered |
| OQ-05 | Is there one Coordinator or multiple? If multiple, do they have sector assignments? | Medium | ❓ Unanswered |
| OQ-06 | Who is the app's IT Admin (can create accounts, reset passwords)? Is this the Coordinator? | Medium | ❓ Unanswered |
| OQ-07 | For the EEP mobile app, should EEP be able to see tickets from other sectors or only their own? | High | ❓ Unanswered |
| OQ-08 | When CGR confirms with client and there's a "problème persistant", does a new ticket open? | Medium | ❓ Unanswered |
| OQ-09 | Do EEP agents ever work alone, or always in pairs? | Low | ❓ Unanswered |
| OQ-10 | What is the exact name/branding to display? "IBT" or full "Intervention Basse Tension"? | Low | ❓ Unanswered |
| OQ-11 | Should the Observer be able to filter analytics by date range, sector, or category? | Medium | ❓ Unanswered |
| OQ-12 | Is the ONEE logo available for use in the prototype? What font does ONEE use officially? | Low | ❓ Unanswered |

---

## 16. Changelog

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | June 2026 | Initial session | Full initial specification based on stakeholder interviews |

---

## 🔁 How to Use This File in a New Chat

Paste this file at the start of any new Claude chat and say:

> *"Read this context file. This is the IBT — Intervention Basse Tension project for ONEE Morocco. We are building a Figma UI prototype. Pick up from where we left off. The current task is: [describe what you want to do next]."*

---

*End of IBT Project Context File v1.0*
