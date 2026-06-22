export type EmployeeRole   = 'eep' | 'sed' | 'cgr' | 'coordinator' | 'observer'
export type EmployeeStatus = 'actif' | 'inactif'

export interface Employee {
  id:           string
  name:         string
  initials:     string
  role:         EmployeeRole
  sector?:      string          // sector name (denormalized from sector store)
  sectorId?:    string          // sector id reference
  phone:        string
  email:        string
  matricule:    string          // format: NNNNNL — 5 digits + 1 uppercase letter, ex: 12345A
  avatarUrl?:   string          // URL or undefined (falls back to initials)
  vehicleId?:   string          // reference to vehicle
  status:       EmployeeStatus
  joinedDate:   string          // ISO date string
  activeTickets: number
}

export const MOCK_EMPLOYEES: Employee[] = [
  // Équipe de Permanance — Oud Nachif
  { id: 'emp-1',  name: 'Khalid Amrani',      initials: 'KA', role: 'eep', sectorId: 's-1', sector: 'Oud Nachif',    phone: '0661-234-567', email: 'k.amrani@onee.ma',    matricule: '10001A', vehicleId: 'v-1', status: 'actif',   joinedDate: '2019-03-15', activeTickets: 2 },
  { id: 'emp-2',  name: 'Mehdi Benali',        initials: 'MB', role: 'eep', sectorId: 's-1', sector: 'Oud Nachif',    phone: '0661-345-678', email: 'm.benali@onee.ma',    matricule: '10002B', vehicleId: 'v-2', status: 'actif',   joinedDate: '2021-06-01', activeTickets: 1 },
  // Équipe de Permanance — Secteur Est
  { id: 'emp-3',  name: 'Yassine Ouali',       initials: 'YO', role: 'eep', sectorId: 's-2', sector: 'Secteur Est',   phone: '0662-456-789', email: 'y.ouali@onee.ma',     matricule: '10003C', vehicleId: 'v-3', status: 'actif',   joinedDate: '2020-01-20', activeTickets: 3 },
  { id: 'emp-4',  name: 'Amine Kabbaj',         initials: 'AK', role: 'eep', sectorId: 's-2', sector: 'Secteur Est',   phone: '0662-567-890', email: 'a.kabbaj@onee.ma',    matricule: '10004D', status: 'actif',   joinedDate: '2022-09-10', activeTickets: 1 },
  // Équipe de Permanance — Secteur Ouest
  { id: 'emp-5',  name: 'Samir Benhima',        initials: 'SB', role: 'eep', sectorId: 's-3', sector: 'Secteur Ouest', phone: '0663-678-901', email: 's.benhima@onee.ma',   matricule: '10005E', status: 'actif',   joinedDate: '2018-11-05', activeTickets: 1 },
  { id: 'emp-6',  name: 'Rachid Tazi',          initials: 'RT', role: 'eep', sectorId: 's-3', sector: 'Secteur Ouest', phone: '0663-789-012', email: 'r.tazi@onee.ma',      matricule: '10006F', status: 'actif',   joinedDate: '2020-07-14', activeTickets: 2 },
  // Équipe de Permanance — Secteur Sud
  { id: 'emp-7',  name: 'Nabil Mansouri',       initials: 'NM', role: 'eep', sectorId: 's-4', sector: 'Secteur Sud',   phone: '0664-890-123', email: 'n.mansouri@onee.ma',  matricule: '10007G', status: 'actif',   joinedDate: '2019-08-22', activeTickets: 2 },
  { id: 'emp-8',  name: 'Farid El Fassi',       initials: 'FE', role: 'eep', sectorId: 's-4', sector: 'Secteur Sud',   phone: '0664-901-234', email: 'f.elfassi@onee.ma',   matricule: '10008H', status: 'inactif', joinedDate: '2021-02-28', activeTickets: 0 },
  // Équipe de Permanance — réserve (sans secteur)
  { id: 'emp-9',  name: 'Omar Cherkaoui',       initials: 'OC', role: 'eep', phone: '0665-012-345', email: 'o.cherkaoui@onee.ma', matricule: '10009I', status: 'actif',   joinedDate: '2023-04-01', activeTickets: 0 },
  // SED
  { id: 'emp-10', name: 'Hassan Chraibi',       initials: 'HC', role: 'sed', phone: '0666-123-456', email: 'h.chraibi@onee.ma',   matricule: '20001A', vehicleId: 'v-4', status: 'actif',   joinedDate: '2015-05-10', activeTickets: 2 },
  { id: 'emp-11', name: 'Abdellatif Berrada',   initials: 'AB', role: 'sed', phone: '0666-234-567', email: 'a.berrada@onee.ma',   matricule: '20002B', vehicleId: 'v-5', status: 'actif',   joinedDate: '2017-09-18', activeTickets: 1 },
  { id: 'emp-12', name: 'Mourad Filali',        initials: 'MF', role: 'sed', phone: '0666-345-678', email: 'm.filali@onee.ma',    matricule: '20003C', vehicleId: 'v-6', status: 'actif',   joinedDate: '2019-12-03', activeTickets: 0 },
  { id: 'emp-13', name: 'Soufiane Hajji',       initials: 'SH', role: 'sed', phone: '0666-456-789', email: 's.hajji@onee.ma',     matricule: '20004D', status: 'inactif', joinedDate: '2020-06-15', activeTickets: 0 },
  // CGR
  { id: 'emp-14', name: 'Amina Kettani',        initials: 'AK', role: 'cgr',         phone: '0667-567-890', email: 'a.kettani@onee.ma',   matricule: '30001A', status: 'actif',   joinedDate: '2018-03-01', activeTickets: 0 },
  { id: 'emp-15', name: 'Sanae Moukhliss',      initials: 'SM', role: 'cgr',         phone: '0667-678-901', email: 's.moukhliss@onee.ma', matricule: '30002B', status: 'actif',   joinedDate: '2020-10-12', activeTickets: 0 },
  // Comptes login — liés aux user_accounts
  { id: 'emp-16', name: 'Mohammed Alami',       initials: 'MA', role: 'eep',         sectorId: 's-1', sector: 'Oud Nachif', phone: '0661-999-001', email: 'm.alami@onee.ma',    matricule: '10016A', status: 'actif',   joinedDate: '2023-01-01', activeTickets: 0 },
  { id: 'emp-17', name: 'Yasmine Benali',       initials: 'YB', role: 'coordinator', phone: '0668-100-001', email: 'y.benali@onee.ma',   matricule: '40001A', status: 'actif',   joinedDate: '2017-01-01', activeTickets: 0 },
  { id: 'emp-18', name: 'Directeur El Ahmadi',  initials: 'DA', role: 'observer',    phone: '0668-200-001', email: 'd.elahmadi@onee.ma', matricule: '50001A', status: 'actif',   joinedDate: '2010-01-01', activeTickets: 0 },
]

export const ROLE_LABELS_FR: Record<EmployeeRole, string> = {
  eep:         'Équipe de Permanance',
  sed:         'SED — Intervention lourde',
  cgr:         'CGR — Centre de gestion',
  coordinator: 'Coordinateur',
  observer:    'Observateur / Directeur',
}

export const ROLE_SHORT_FR: Record<EmployeeRole, string> = {
  eep:         'EP',
  sed:         'SED',
  cgr:         'CGR',
  coordinator: 'Coord.',
  observer:    'Obs.',
}

/** Validate matricule format: exactly 5 digits followed by 1 uppercase letter */
export function isValidMatricule(v: string): boolean {
  return /^\d{5}[A-Z]$/.test(v)
}
