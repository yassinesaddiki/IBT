-- ============================================================
-- IBT — Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- ── SECTORS ──────────────────────────────────────────────────
INSERT INTO sectors (id, name, status) VALUES
  ('s-1', 'Oud Nachif',    'actif'),
  ('s-2', 'Sidi Ziane',   'actif'),
  ('s-3', 'Sidi Driss El Quadi', 'actif')
ON CONFLICT (id) DO NOTHING;


-- ── CATEGORIES ───────────────────────────────────────────────
INSERT INTO categories (id, label) VALUES
  ('CAT-01', 'Coupure'),
  ('CAT-02', 'Surtension'),
  ('CAT-03', 'Danger')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sub_categories (id, category_id, label, default_severity) VALUES
  ('COP-01', 'CAT-01', 'Coupure client individuel',      'Moyenne'),
  ('COP-02', 'CAT-01', 'Coupure groupe d''abonnés',       'Haute'),
  ('COP-03', 'CAT-01', 'Compteur endommagé',              'Moyenne'),
  ('COP-04', 'CAT-01', 'Compteur disparu (volé)',         'Haute'),
  ('COP-05', 'CAT-01', 'Compteur bloqué',                 'Moyenne'),
  ('COP-06', 'CAT-01', 'Câble aérien endommagé',          'Haute'),
  ('COP-07', 'CAT-01', 'Câble souterrain endommagé',      'Haute'),
  ('COP-08', 'CAT-01', 'Poste endommagé',                 'Haute'),
  ('COP-09', 'CAT-01', 'Boîte / Disjoncteur grillé',      'Moyenne'),
  ('SUR-01', 'CAT-02', 'Surtension client individuel',    'Haute'),
  ('SUR-02', 'CAT-02', 'Surtension groupe d''abonnés',    'Haute'),
  ('DAN-01', 'CAT-03', 'Incendie électrique',             'Critique'),
  ('DAN-02', 'CAT-03', 'Étincelles sur fils extérieurs',  'Critique'),
  ('DAN-03', 'CAT-03', 'Poste ouvert / non sécurisé',     'Critique'),
  ('DAN-04', 'CAT-03', 'Poteau incliné',                  'Haute'),
  ('DAN-05', 'CAT-03', 'Poteau défaillant / cassé',       'Critique'),
  ('DAN-06', 'CAT-03', 'Fil tombé au sol',                'Critique')
ON CONFLICT (id) DO NOTHING;


-- ── VEHICLES ─────────────────────────────────────────────────
INSERT INTO vehicles (id, plate, brand, model, vehicle_type, assigned_team, status) VALUES
  ('v-1',  'DO 248',    'Dacia',     'Sandero',       'voiture',  'eep', 'actif'),
  ('v-2',  'DO 312',    'Dacia',     'Duster',        'voiture',  'eep', 'actif'),
  ('v-3',  'DO 455',    'Renault',   'Kangoo',        'voiture',  'eep', 'actif'),
  ('v-4',  'DO 119',    'Ford',      'Transit',       'camion',   'sed', 'actif'),
  ('v-5',  'DO 523',    'Mercedes',  'Sprinter',      'camion',   'sed', 'actif'),
  ('v-6',  'DO 087',    'Renault',   'Master Nacelle','nacelle',  'sed', 'actif'),
  ('v-7',  'DO 741',    'Dacia',     'Logan',         'voiture',  'eep', 'maintenance'),
  ('v-8',  'DO 633',    'Toyota',    'Hilux',         'camion',   'sed', 'actif')
ON CONFLICT (id) DO NOTHING;


-- ── EMPLOYEES ────────────────────────────────────────────────
-- matricule format: NNNNNL (5 digits + 1 uppercase letter)
INSERT INTO employees (id, name, initials, role, sector_id, phone, email, matricule, vehicle_id, status, joined_date) VALUES
  -- Équipe de Permanance — Oud Nachif
  ('emp-1',  'Khalid Amrani',      'KA', 'eep', 's-1', '0661-234-567', 'k.amrani@onee.ma',    '10001A', 'v-1', 'actif',   '2019-03-15'),
  ('emp-2',  'Mehdi Benali',       'MB', 'eep', 's-1', '0661-345-678', 'm.benali@onee.ma',    '10002B', 'v-2', 'actif',   '2021-06-01'),
  -- Équipe de Permanance — Secteur Est
  ('emp-3',  'Yassine Ouali',      'YO', 'eep', 's-2', '0662-456-789', 'y.ouali@onee.ma',     '10003C', 'v-3', 'actif',   '2020-01-20'),
  ('emp-4',  'Amine Kabbaj',       'AK', 'eep', 's-2', '0662-567-890', 'a.kabbaj@onee.ma',    '10004D', NULL,  'actif',   '2022-09-10'),
  -- Équipe de Permanance — Secteur Ouest
  ('emp-5',  'Samir Benhima',      'SB', 'eep', 's-3', '0663-678-901', 's.benhima@onee.ma',   '10005E', NULL,  'actif',   '2018-11-05'),
  ('emp-6',  'Rachid Tazi',        'RT', 'eep', 's-3', '0663-789-012', 'r.tazi@onee.ma',      '10006F', NULL,  'actif',   '2020-07-14'),
  -- Équipe de Permanance — réserve
  ('emp-9',  'Omar Cherkaoui',     'OC', 'eep', NULL,  '0665-012-345', 'o.cherkaoui@onee.ma', '10009I', NULL,  'actif',   '2023-04-01'),
  -- SED
  ('emp-10', 'Hassan Chraibi',     'HC', 'sed', NULL,  '0666-123-456', 'h.chraibi@onee.ma',   '20001A', 'v-4', 'actif',   '2015-05-10'),
  ('emp-11', 'Abdellatif Berrada', 'AB', 'sed', NULL,  '0666-234-567', 'a.berrada@onee.ma',   '20002B', 'v-5', 'actif',   '2017-09-18'),
  ('emp-12', 'Mourad Filali',      'MF', 'sed', NULL,  '0666-345-678', 'm.filali@onee.ma',    '20003C', 'v-6', 'actif',   '2019-12-03'),
  ('emp-13', 'Soufiane Hajji',     'SH', 'sed', NULL,  '0666-456-789', 's.hajji@onee.ma',     '20004D', NULL,  'inactif', '2020-06-15'),
  -- CGR
  ('emp-14', 'Amina Kettani',      'AK', 'cgr', NULL,  '0667-567-890', 'a.kettani@onee.ma',   '30001A', NULL,  'actif',   '2018-03-01'),
  ('emp-15', 'Sanae Moukhliss',    'SM', 'cgr', NULL,  '0667-678-901', 's.moukhliss@onee.ma', '30002B', NULL,  'actif',   '2020-10-12')
ON CONFLICT (id) DO NOTHING;


-- ── USER ACCOUNTS ────────────────────────────────────────────
INSERT INTO user_accounts (id, name, role, username, password, sector_id, employee_id, active) VALUES
  ('cgr-1',   'Amina Kettani',    'cgr',         'cgr123',   'cgr123',   NULL,  'emp-14', TRUE),
  ('eep-1',   'Mohammed Alami',   'eep',         'eep123',   'eep123',   's-1', NULL,     TRUE),
  ('sed-1',   'Hassan Chraibi',   'sed',         'sed123',   'sed123',   NULL,  'emp-10', TRUE),
  ('coord-1', 'Yasmine Benali',   'coordinator', 'coord123', 'coord123', NULL,  NULL,     TRUE),
  ('obs-1',   'directeur el ahmadi',   'observer',    'obs123',   'obs123',   NULL,  NULL,     TRUE)
ON CONFLICT (id) DO NOTHING;


-- ── DUTY SCHEDULE (semaine courante) ─────────────────────────
-- Semaine du 16 juin 2026 (lundi)
INSERT INTO duty_schedule (week_start, sector_id, slot_index, employee_id) VALUES
  ('2026-06-16', 's-1', 0, 'emp-1'),
  ('2026-06-16', 's-1', 1, 'emp-2'),
  ('2026-06-16', 's-2', 0, 'emp-3'),
  ('2026-06-16', 's-2', 1, 'emp-4'),
  ('2026-06-16', 's-3', 0, 'emp-5'),
  ('2026-06-16', 's-3', 1, 'emp-6')
ON CONFLICT (week_start, sector_id, slot_index) DO NOTHING;
