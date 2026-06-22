# IBT — Migration vers Supabase (Backend réel)
## Instructions pour la prochaine session Claude

> **Contexte :** L'application IBT est un prototype React avec Zustand + localStorage.
> L'objectif est de **remplacer toutes les données mock par Supabase** — base de données PostgreSQL, temps réel.
>
> Lire aussi : `CLAUDE.md`, `IBT_PROJECT_CONTEXT.md`

---

## Décisions d'architecture

### ❌ Auth — NE PAS MIGRER
L'authentification reste en mode prototype (mock users dans `src/mock-data/users.ts`).
- Pas de Supabase Auth, pas de session réelle
- Les utilisateurs de test (`cgr123`, `eep123`, etc.) restent tels quels
- Raison : l'objectif est une démo CEO, pas une app de production sécurisée

### ✅ Données — TOUT MIGRER VERS SUPABASE
Tout ce qui est affiché doit venir de Supabase, jamais hardcodé :
- Secteurs (noms, statuts)
- Catégories et sous-catégories
- Employés (avec matricule, photo, véhicule)
- Véhicules
- Tickets et interventions
- Planning de garde
- Notifications

---

## Exigences fonctionnelles ajoutées (session juin 2026)

### 1. Flexibilité totale des données
**Problème actuel :** Les noms de secteurs, catégories, agents sont hardcodés à plusieurs endroits.
**Solution :** Un seul store Zustand par entité, initialisé depuis Supabase. Aucun screen n'importe depuis `mock-data/` directement.

### 2. Modèle Employé enrichi
- `matricule` : format `NNNNNL` (5 chiffres + 1 lettre) ex: `12345A`
- `avatar` : URL photo de profil (Supabase Storage ou initiales fallback)
- Association à un véhicule

### 3. Table Véhicules (nouveau)
Chaque véhicule utilisé par les équipes EEP/SED :
- `id`, `plate` (ex: `DO 248`), `brand`, `model`, `type`, `status`, `assignedTeam`

### 4. Renommage EEP → Équipe de Permanance
- Dans toute l'interface visible, "EEP" devient "Équipe de Permanance"
- Les clés techniques (`role: 'eep'`, routes `/eep/...`) ne changent pas
- `ROLE_LABELS_FR.eep` = `'Équipe de Permanance'`

### 5. Coordinateur — CRUD complet sur tout
Le coordinateur doit pouvoir gérer via l'interface :
- ✅ Employés (déjà fait)
- ✅ Secteurs (déjà fait)
- ✅ Catégories (déjà fait)
- ✅ Planning de garde (déjà fait)
- 🆕 Véhicules (`/coordinator/vehicules`)
- 🆕 Comptes utilisateurs / logins (`/coordinator/comptes`) — mock uniquement

---

## Stack cible

- **Supabase** — PostgreSQL + Realtime + Storage (photos)
- **@supabase/supabase-js** — client JS officiel
- **Zustand** — cache local, synchronisé depuis Supabase au démarrage
- **React Query** (`@tanstack/react-query`) — fetches async, loading states
- Auth : reste mock (MOCK_USERS dans authStore)

---

## Étape 1 — Setup Supabase

### 1.1 Créer le projet Supabase
- supabase.com → New project → `ibt-onee`
- Récupérer : `SUPABASE_URL` et `SUPABASE_ANON_KEY`

### 1.2 Variables d'environnement
Créer `.env.local` :
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

### 1.3 Installer les dépendances
```bash
npm install @supabase/supabase-js @tanstack/react-query
```

---

## Étape 2 — Schéma SQL (exécuter dans Supabase SQL Editor)

Fichier : `supabase/schema.sql`

Tables à créer (dans l'ordre) :
1. `sectors` — secteurs géographiques
2. `categories` + `sub_categories` — catégories de problèmes
3. `employees` + `vehicles` — agents et véhicules
4. `tickets` + `eep_interventions` + `coordinator_approvals` + `sed_interventions` + `ticket_closures`
5. `duty_schedule` — planning de garde
6. `notifications`

---

## Étape 3 — Stores Zustand → Supabase

Pour chaque store, le pattern est :
```typescript
// init(): charge depuis Supabase, peuple le store
// Toutes les mutations → Supabase + optimistic update local
```

Stores à mettre à jour :
- `dutyStore.ts` → `sectors` table + `duty_schedule` table
- `categoryStore.ts` → `categories` + `sub_categories` tables
- `employeeStore.ts` → `employees` table
- `vehicleStore.ts` (nouveau) → `vehicles` table
- `ticketStore.ts` → `tickets` + interventions tables

---

## Étape 4 — Écrans mis à jour

### Hardcoding à éliminer
- `mock-data/duty-schedule.ts` : supprimer `export const SECTORS`
- `mock-data/categories.ts` : supprimer `export const SECTORS_LIST`
- `store/dutyStore.ts` : supprimer `INITIAL_SECTORS` hardcodé
- Tous les `import { SECTORS }` → `useDutyStore(s => s.sectors)`

### Nouveaux écrans Coordinateur
- `coordinator/VehicleManagement.tsx` → `/coordinator/vehicules`
- `coordinator/AccountManagement.tsx` → `/coordinator/comptes`

### Navigation Coordinateur mise à jour
Ajouter dans `coordinatorNav.ts` :
- Véhicules
- Comptes utilisateurs

---

## Étape 5 — Realtime

```typescript
// Tickets : invalider cache sur INSERT/UPDATE
// Notifications : push temps réel
```

---

## Ordre d'exécution

```
Phase 1 — Infrastructure ← EN COURS
  □ 1. Créer projet Supabase + récupérer credentials
  □ 2. Exécuter supabase/schema.sql
  □ 3. Créer src/lib/supabase.ts
  □ 4. npm install @supabase/supabase-js @tanstack/react-query

Phase 2 — Modèles et stores
  □ 5. Ajouter Vehicle type + vehicleStore
  □ 6. Mettre à jour Employee (matricule NNNNNL, avatar)
  □ 7. Connecter tous les stores à Supabase

Phase 3 — Fix hardcoding (indépendant de Supabase)
  □ 8. Supprimer SECTORS de mock-data, tout via useDutyStore
  □ 9. Renommer EEP → Équipe de Permanance dans l'UI

Phase 4 — Nouveaux écrans Coordinateur
  □ 10. VehicleManagement.tsx
  □ 11. AccountManagement.tsx
  □ 12. Mettre à jour coordinatorNav.ts

Phase 5 — Seed data
  □ 13. supabase/seed.sql avec toutes les données mock

Phase 6 — Tests et déploiement
  □ 14. Tests end-to-end tous les rôles
  □ 15. Déployer sur Vercel avec env vars Supabase
```

---

## Notes importantes

1. **Auth reste mock** — ne pas toucher `authStore.ts`, `LoginScreen.tsx`, `MOCK_USERS`
2. **RLS désactivé** pour le prototype — utiliser la clé anon avec politiques permissives
3. **Matricule format** : `NNNNNL` — 5 chiffres + 1 lettre majuscule (ex: `12345A`)
4. **Véhicules** : plaque format marocain (ex: `DO 248`, `12345-A-1`)
5. **Équipe de Permanance** : le terme complet dans l'UI, l'abréviation "EP" acceptable dans les badges compacts

---

*Dernière mise à jour : juin 2026*
