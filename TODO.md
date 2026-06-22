# IBT — TODO & Roadmap
## Système IBT · ONEE Maroc · Mis à jour : juin 2026

> **Pour reprendre le travail dans un nouveau chat :**
> Donne à Claude les fichiers `CLAUDE.md`, `IBT_PROJECT_CONTEXT.md`, et ce `TODO.md`.
> Claude peut alors reprendre exactement là où on s'est arrêtés.

---

## ✅ DONE — Travaux terminés

### Infrastructure & Architecture
- [x] Projet Supabase créé (`wcckvfciedyfoparpfnd.supabase.co`)
- [x] `.env.local` configuré avec `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
- [x] Variables d'environnement ajoutées sur Vercel (Production + Preview)
- [x] `src/lib/supabase.ts` — client Supabase avec fallback gracieux (pas de crash si env vars manquantes)
- [x] `supabase/schema.sql` — schéma complet : sectors, categories, sub_categories, employees, vehicles, tickets, eep_interventions, coordinator_approvals, sed_interventions, ticket_closures, duty_schedule, notifications, user_accounts
- [x] `supabase/seed.sql` — données initiales : secteurs réels (Oud Nachif, Sidi Ziane, Sidi Driss El Quadi), catégories, véhicules, employés, comptes utilisateurs, planning de garde
- [x] `@supabase/supabase-js` installé
- [x] Auth reste **mock prototype** — MOCK_USERS dans authStore, pas de Supabase Auth

### Stores Zustand → Supabase
- [x] `dutyStore.ts` — sectors + duty_schedule depuis Supabase, `init()` au démarrage
- [x] `categoryStore.ts` — categories + sub_categories depuis Supabase, CRUD complet async
- [x] `employeeStore.ts` — employees depuis Supabase, CRUD complet async
- [x] `vehicleStore.ts` — vehicles, CRUD (localStorage pour l'instant, Supabase à venir)
- [x] `accountStore.ts` — user_accounts depuis Supabase, CRUD complet async
- [x] `main.tsx` — appelle `init()` sur tous les stores au démarrage de l'app

### Fix Hardcoding — Données dynamiques
- [x] Suppression de `SECTORS` hardcodé dans `mock-data/duty-schedule.ts`
- [x] Suppression de `SECTORS_LIST` hardcodé dans `mock-data/categories.ts`
- [x] `dutyStore.sectors` = source unique de vérité pour les secteurs
- [x] Tous les écrans lisent les secteurs depuis `useDutyStore().sectors` (plus aucun import hardcodé)
- [x] `NewTicketScreen` — secteurs depuis le store
- [x] `CGRDashboard`, `CoordinatorDashboard`, `ObserverDashboard`, `ObserverDutySchedule`, `ReportsScreen`, `ObserverReports` — tous corrigés

### Modèle de données enrichi
- [x] `Employee.matricule` — format `NNNNNL` (5 chiffres + 1 lettre majuscule, ex: `10001A`)
- [x] `Employee.avatarUrl` — champ photo de profil (optionnel, fallback initiales)
- [x] `Employee.vehicleId` — référence au véhicule assigné
- [x] Type `Vehicle` + `MOCK_VEHICLES` + `vehicleStore` + table SQL `vehicles`
- [x] `ROLE_LABELS_FR.eep` = `'Équipe de Permanance'` (renommage visible dans toute l'UI)

### Renommage EEP → Équipe de Permanance
- [x] `status.ts` — STATUS_LABELS : "Lu par EP", "En cours — EP", "Résolu — EP"
- [x] `EEPDashboard` header : "IBT · Équipe de Permanance"
- [x] `EEPStatusUpdate` — label "Résolu par Équipe de Permanance"
- [x] `EmployeeManagement` — "Équipe de Permanance" dans stats et badges
- [x] `DutyScheduleScreen` — description mise à jour
- [x] `CoordinatorTickets`, `CGRDashboard` — filtres "En cours EP", "Résolu EP"

### Nouveaux écrans Coordinateur
- [x] `VehicleManagement.tsx` — `/coordinator/vehicules` — CRUD véhicules complet (plaque, marque, modèle, type, équipe, statut) relié Supabase
- [x] `AccountManagement.tsx` — `/coordinator/comptes` — CRUD comptes utilisateurs (nom, rôle, identifiant, mot de passe, secteur) relié Supabase
- [x] `EmployeeManagement.tsx` — modale ajout/modification complète avec tous les champs (nom, rôle, secteur, matricule NNNNNL, téléphone, email, véhicule, date, statut), validation inline, suppression avec confirmation
- [x] `coordinatorNav.ts` — liens "Véhicules 🚗" et "Comptes 🔑" ajoutés
- [x] `App.tsx` — routes `/coordinator/vehicules` et `/coordinator/comptes` ajoutées

### Migration tickets → Supabase
- [x] `ticketStore.ts` — réécrit entièrement sans localStorage, toutes les mutations async Supabase
- [x] `mock-data/tickets.ts` — vidé (`MOCK_TICKETS = []`)
- [x] `main.tsx` — vide le localStorage `ibt-tickets` au démarrage, appelle `ticketStore.init()` + `vehicleStore.init()`
- [x] Toutes les mutations ticket (`resolveEEP`, `referToSED`, `startSED`, `scheduleSED`, `resolveSED`, `approveTicket`, `rejectTicket`, `closeTicket`) converties en `async/await`
- [x] `ApprovalScreen` — utilise `approveTicket()` / `rejectTicket()` au lieu de `updateStatus()`
- [x] `ClosureScreen` — utilise `closeTicket()` au lieu de `updateStatus()`
- [x] `vehicleStore.ts` — ajout `init()` Supabase, toutes les mutations async

---

## 🔴 TODO — Tâches prioritaires

---

### ~~TÂCHE 1~~ — ✅ DONE — Supprimer les mock tickets, tout depuis Supabase
**Problème :** L'app affiche des tickets fictifs depuis `mock-data/tickets.ts` via `ticketStore` (localStorage). La base de données Supabase est vide de tickets mais l'app les ignore.

**Fichiers à modifier :**
- `src/store/ticketStore.ts` — réécrire complètement avec `init()` Supabase + toutes les mutations async
- `src/shared/hooks/useTickets.ts` — vérifier qu'il lit bien depuis le store
- `src/mock-data/tickets.ts` — garder uniquement comme référence de type, vider `MOCK_TICKETS = []`
- Vider le localStorage (`ibt-tickets`) pour forcer le rechargement depuis Supabase

**Mutations à migrer vers Supabase :**
- `addTicket()` → `INSERT INTO tickets`
- `markReadByEEP()` → `UPDATE tickets` + `INSERT INTO eep_interventions`
- `startEEP()` → `UPDATE eep_interventions SET started_at`
- `resolveEEP()` → `UPDATE tickets status` + `UPDATE eep_interventions SET result, finished_at, actions`
- `referToSED()` → `UPDATE tickets` + `UPDATE eep_interventions` + `INSERT INTO coordinator_approvals`
- `approveTicket()` / `rejectTicket()` → `UPDATE coordinator_approvals` + `UPDATE tickets`
- `startSED()` → `INSERT INTO sed_interventions`
- `suspendSED()`, `scheduleSED()`, `resolveSED()` → `UPDATE sed_interventions`
- `closeTicket()` → `INSERT INTO ticket_closures` + `UPDATE tickets SET status = 'ferme'`

**Notes importantes :**
- Le champ `id` des tickets est auto-généré par le trigger SQL (`IBT-YYMM-NNN`) — ne pas le passer à l'INSERT
- Garder Zustand comme cache local pour la réactivité UI
- Ajouter `init()` au démarrage dans `main.tsx`
- Après chaque mutation Supabase réussie, recharger le ticket concerné dans le store

---

### ~~TÂCHE 2~~ — ✅ DONE — CRUD complet et fonctionnel sur tous les écrans Coordinateur

### ~~TÂCHE 3~~ — ✅ DONE — Profil employé cliquable + noms partout liés
- [x] `src/features/shared/EmployeeProfile.tsx` — page profil complète à `/employee/:id`
- [x] Route `/employee/:id` dans `App.tsx` — accessible à tous les rôles connectés (`AnyAuthRoute`)
- [x] `src/shared/hooks/useEmployee.ts` — hooks `useEmployee(id)`, `useEmployeeByName(name)`, `useMyEmployee(userId)`, avec enrichissement véhicule
- [x] `src/shared/components/EmployeeChip.tsx` — composant réutilisable nom+matricule cliquable (variants `block` et `inline`)
- [x] Noms cliquables dans : `CGRDashboard`, `CoordinatorDashboard`, `ObserverDashboard`, `ObserverDutySchedule`, `DutyScheduleScreen`, `TicketDetailScreen`, `ApprovalScreen`, `SEDTicketDetail`

### ~~TÂCHE 4~~ — ✅ DONE — Matricule toujours affiché avec le nom
- [x] `EmployeeChip` affiche toujours le matricule sous le nom en police monospace grise
- [x] Déployé partout : duty cards, ticket detail, approbation, SED ticket

### ~~TÂCHE 5~~ — ✅ DONE — Véhicule sur profil et tickets
- [x] `EmployeeProfile.tsx` — carte véhicule avec plaque, marque, modèle, statut
- [x] `TicketDetailScreen` — section D (EP) et F (SED) montrent le véhicule de l'agent
- [x] `useEmployee` hook retourne le véhicule enrichi automatiquement

### ~~TÂCHE 6~~ — ✅ DONE — Supabase Storage
- [x] `src/shared/hooks/useStorageUpload.ts` — hook `useStorageUpload(bucket)` + `uploadMultiple()` + `getPublicUrl()`
- [x] `supabase/storage.sql` — SQL pour créer buckets `ticket-photos` et `employee-avatars` avec politiques publiques
- [x] `src/shared/components/PhotoGrid.tsx` — composant grille photos avec lightbox intégrée
- [x] **Action manuelle requise :** Exécuter `supabase/storage.sql` dans Supabase SQL Editor

### ~~TÂCHE 7~~ — ✅ DONE — Photos dans flux de référencement EEP → SED
- [x] `EEPReferToSED.tsx` — section photos avec upload multi-fichiers, prévisualisation, suppression avant envoi. Upload vers `ticket-photos/{ticketId}/eep-refer/`
- [x] `ApprovalScreen.tsx` — affichage `PhotoGrid` des photos jointes par l'EP (contexte clé pour la décision coordinateur)
- [x] `SEDTicketDetail.tsx` — affichage `PhotoGrid` des photos EP (contexte pour l'équipe SED)
- [x] `TicketDetailScreen.tsx` — photos EP (section D) et SED (section F) affichées

**2a — EmployeeManagement (`/coordinator/employes`)**
**Problème :** Le bouton "Modifier" (crayon) met `editId` mais n'affiche aucune modale/formulaire. Pas de formulaire d'ajout non plus.
- Ajouter une modale d'ajout/modification complète avec tous les champs :
  - Nom, prénom, initiales (auto-générées)
  - Rôle (EP / SED / CGR / Coordinateur / Observateur)
  - Secteur (dropdown depuis `useDutyStore().sectors`, visible seulement si rôle = EP)
  - Téléphone, email
  - Matricule (format `NNNNNL` — valider avec regex `/^\d{5}[A-Z]$/`)
  - Véhicule assigné (dropdown depuis `useVehicleStore().vehicles`)
  - Date d'entrée
  - Statut (Actif / Inactif)
- Bouton "Supprimer" avec confirmation
- Validation côté client + affichage erreurs inline
- Appel `addEmployee()` / `updateEmployee()` → Supabase

**2b — VehicleManagement (`/coordinator/vehicules`)**
**Statut :** Formulaire ajout/modif existe mais pas encore relié à Supabase.
- Le `vehicleStore` n'a pas de `init()` Supabase → ajouter `init()` qui charge depuis `vehicles` table
- Vérifier que `addVehicle()` et `updateVehicle()` écrivent bien dans Supabase (code ok mais à tester)

**2c — CategoryManagement (`/coordinator/categories`)**
**Vérifier :** Le formulaire d'ajout/modification de catégories et sous-catégories appelle-t-il bien `useCategoryStore().addCategory()` etc. ? Ces méthodes sont maintenant async (Supabase). S'assurer que les erreurs sont gérées et affichées.

**2d — SectorManagement (`/coordinator/secteurs`)**
**Vérifier :** Appelle-t-il `useDutyStore().addSector()` / `renameSector()` etc. ? Ces méthodes sont async Supabase. Tester et confirmer.

**2e — AccountManagement (`/coordinator/comptes`)**
**Statut :** Formulaire existe. À vérifier : `addAccount()` écrit dans `user_accounts` Supabase ?
- Le store `authStore.ts` lit encore `MOCK_USERS` — il faut qu'après ajout d'un compte dans Supabase, le login fonctionne (authStore doit lire depuis `accountStore` au lieu de `MOCK_USERS` hardcodé)

---

### ~~TÂCHE 3~~ — ✅ Voir section DONE ci-dessus

**3a — Page profil employé** : `src/features/shared/EmployeeProfile.tsx` → route `/employee/:id`
Accessible par : Coordinateur, Observateur (lecture seule), l'employé lui-même

**Contenu de la page profil :**
- Photo de profil (avatar avec upload — voir Tâche 6)
- Nom complet + Matricule (toujours affiché ensemble)
- Rôle, secteur, téléphone, email
- Véhicule actuellement assigné (plaque + marque/modèle)
- Date d'entrée, statut (Actif/Inactif)
- Liste des tickets en cours assignés à cet agent
- Statistiques : tickets résolus ce mois, temps moyen d'intervention
- Pour le Coordinateur : bouton "Modifier le profil" → ouvre EmployeeManagement en mode édition

**3b — Employé voit son propre profil**
Quand un agent EP ou SED se connecte, son profil est accessible via l'avatar/nom dans la navbar mobile.
- Peut modifier : téléphone, photo de profil
- Ne peut PAS modifier : matricule, secteur, rôle (réservé Coordinateur)

**3c — Rendre les noms cliquables partout**
Partout où un nom d'employé apparaît, il doit être un lien cliquable vers `/employee/:id` :
- `DutyScheduleScreen` — agents dans les créneaux
- `ObserverDutySchedule` — tableau de garde
- `CGRDashboard` — sidebar "Équipe de garde"
- `CoordinatorDashboard` — sidebar "Équipe de garde"
- `TicketDetailScreen` — "Agent EEP", "Agent SED"
- `ApprovalScreen` — agent qui a référé
- `EEPDashboard` — nom de l'agent connecté
- `SEDDashboard` — nom de l'agent connecté

---

### ~~TÂCHE 4~~ — ✅ Voir section DONE ci-dessus

**Règle :** Partout où un nom d'employé est affiché, afficher juste en dessous (ou à côté en petite police) son numéro de matricule.

**Format visuel :**
```
Khalid Amrani          ← nom cliquable
10001A · EP            ← matricule + rôle court, petite police grise
```

**Fichiers à mettre à jour :**
- `DutyScheduleScreen` — créneaux agents
- `ObserverDutySchedule` — cartes et tableau
- `CGRDashboard` — sidebar garde
- `CoordinatorDashboard` — sidebar garde
- `TicketDetailScreen` (CGR) — sections D (EEP) et F (SED)
- `ApprovalScreen` — section rapport EEP
- `SEDTicketDetail` — bloc rapport EEP
- `EmployeeManagement` — tableau
- `EEPDashboard` / `SEDDashboard` — profil agent connecté dans le header

**Note :** Pour afficher le matricule, les composants doivent croiser l'`agentId` avec `useEmployeeStore().employees`. Créer un hook utilitaire `useEmployee(id)` qui retourne l'employé depuis le store.

---

### ~~TÂCHE 5~~ — ✅ Voir section DONE ci-dessus

**5a — Profil employé** (voir Tâche 3) : afficher la plaque + marque/modèle du véhicule assigné.

**5b — Ticket détail** : Dans la section D (Intervention EP) et F (Intervention SED), afficher le véhicule de l'agent qui est intervenu.
- `TicketDetailScreen` — ajouter `Véhicule : DO 248 · Dacia Sandero` dans les infos agent
- `SEDTicketDetail` — même chose
- `ApprovalScreen` — visible dans le rapport EEP soumis au coordinateur

**5c — Formulaire création employé** (Tâche 2a) : dropdown véhicule déjà prévu, s'assurer que la sélection est bien sauvegardée.

---

### ~~TÂCHE 6~~ — ✅ Voir section DONE ci-dessus

**6a — Créer les buckets dans Supabase Dashboard → Storage :**
- `ticket-photos` (privé, RLS) — photos terrain EEP et SED
- `employee-avatars` (public) — photos de profil agents

**6b — Politiques Storage (SQL à exécuter dans Supabase) :**
```sql
-- Lecture publique des avatars
CREATE POLICY "avatars_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'employee-avatars');

-- Upload avatar : tout utilisateur authentifié (ou anon pour le prototype)
CREATE POLICY "avatars_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'employee-avatars');

-- Lecture photos tickets : tout le monde (prototype)
CREATE POLICY "ticket_photos_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'ticket-photos');

-- Upload photos tickets : tout le monde (prototype)
CREATE POLICY "ticket_photos_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ticket-photos');
```

**6c — Hook utilitaire `useStorageUpload(bucket)`**
```typescript
// src/shared/hooks/useStorageUpload.ts
// upload(file: File) → storage_path: string
// getUrl(path: string) → public URL ou signed URL (1h)
```

**6d — Upload avatar dans le profil employé (Tâche 3)**
- Input `<type="file" accept="image/*">` dans la page profil
- Upload dans `employee-avatars/{employeeId}/avatar.jpg`
- Sauvegarder l'URL dans `employees.avatar_url` (Supabase)
- Afficher l'image à la place des initiales si `avatarUrl` est défini

**6e — Upload photos terrain dans EEPInterventionReport**
- Remplacer les placeholders photos actuels par un vrai input file
- Upload dans `ticket-photos/{ticketId}/eep/{filename}`
- Stocker les paths dans `eep_interventions.photos` (TEXT[])
- Afficher les photos dans `TicketDetailScreen` et `ApprovalScreen`

**6f — Upload photos terrain dans SEDInterventionReport**
- Même logique, bucket `ticket-photos/{ticketId}/sed/{filename}`
- Stocker dans `sed_interventions.photos`
- Afficher dans `TicketDetailScreen` (sections SED)

---

### ~~TÂCHE 7~~ — ✅ Voir section DONE ci-dessus

**Contexte :** Quand l'agent EP réfère un ticket à SED (écran `EEPReferToSED`), il doit pouvoir joindre des photos du terrain. Ces photos doivent être visibles par :
1. Le Coordinateur quand il examine l'approbation (`ApprovalScreen`)
2. L'équipe SED quand elle reçoit le ticket (`SEDTicketDetail`)

**Modifications à apporter :**

**7a — `EEPReferToSED.tsx`**
- Ajouter une section "Photos du terrain" avant le bouton d'envoi
- Input `<type="file" accept="image/*" multiple>` avec prévisualisation des images sélectionnées
- Les photos sont uploadées vers Supabase Storage (`ticket-photos/{ticketId}/eep-refer/`) au moment de la soumission
- Les paths sont passés dans `referToSED(ticketId, { actions, comments, photos: [...] })`

**7b — `ticketStore.referToSED()`**
- Ajouter le champ `photos?: string[]` dans `EEPIntervention`
- Sauvegarder dans `eep_interventions.photos` (Supabase)

**7c — `ApprovalScreen.tsx` (Coordinateur)**
- Dans le bloc "Rapport d'intervention EP", afficher les photos jointes
- Grille de miniatures 2 colonnes, cliquables pour voir en plein écran (lightbox simple)
- Si aucune photo : afficher "Aucune photo jointe"

**7d — `SEDTicketDetail.tsx` (SED)**
- Dans le bloc "Rapport EP", afficher les photos jointes de la même façon
- Ces photos sont le contexte clé pour que le SED comprenne la situation

**7e — `TicketDetailScreen.tsx` (CGR / Coordinateur / Observateur)**
- Section D (Intervention EP) : afficher les photos
- Si le ticket est référé, les photos de référencement sont incluses

---

## 📋 Ordre d'exécution recommandé

```
Sprint 1 — Base de données propre (bloquer tout le reste)
  → TÂCHE 1 : ticketStore → Supabase complet
    Sous-tâche : vider localStorage ibt-tickets
    Sous-tâche : réécrire toutes les mutations async
    Sous-tâche : ajouter init() dans main.tsx

Sprint 2 — CRUD complet
  → TÂCHE 2a : EmployeeManagement modale complète
  → TÂCHE 2b : VehicleManagement init() Supabase
  → TÂCHE 2c/d : Vérifier CategoryManagement + SectorManagement
  → TÂCHE 2e : AccountManagement → authStore lit depuis accountStore

Sprint 3 — Identité employé
  → TÂCHE 4 : Matricule + nom partout (hook useEmployee)
  → TÂCHE 3 : Page profil employé + noms cliquables
  → TÂCHE 5 : Véhicule sur profil et tickets

Sprint 4 — Photos & Storage
  → TÂCHE 6a/b : Créer buckets Supabase + politiques
  → TÂCHE 6c : Hook useStorageUpload
  → TÂCHE 7 : Photos dans EEPReferToSED + ApprovalScreen + SEDTicketDetail
  → TÂCHE 6d : Upload avatar profil employé
  → TÂCHE 6e/f : Photos EEP/SED dans rapports d'intervention
```

---

## 🔧 Notes techniques pour Claude

- **Ne jamais exposer la `service_role` key côté client** — uniquement dans Edge Functions si besoin
- **Auth reste mock** — ne pas toucher `authStore.ts` login/logout, mais `authStore` peut lire les comptes depuis `accountStore` pour valider
- **Format matricule** : `/^\d{5}[A-Z]$/` — valider côté client avant envoi
- **Tickets** : le champ `id` est auto-généré par trigger SQL (`IBT-YYMM-NNN`), ne pas le passer à l'INSERT
- **Photos** : stocker le `storage_path` en base (ex: `ticket-photos/IBT-2406-001/eep/photo1.jpg`), reconstruire l'URL publique à l'affichage avec `supabase.storage.from(bucket).getPublicUrl(path)`
- **localStorage** : après migration vers Supabase, supprimer les clés `ibt-tickets`, `ibt-employees`, etc. du localStorage pour éviter les données périmées — ajouter un mécanisme de versioning ou `reset()` au démarrage

---

*Fichier maintenu manuellement — mettre à jour à chaque session de travail*
