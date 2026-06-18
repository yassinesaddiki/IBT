export type EmployeeRole = 'eep' | 'sed' | 'cgr'
export type EmployeeStatus = 'actif' | 'inactif'

export interface Employee {
  id: string
  name: string
  initials: string
  role: EmployeeRole
  sector?: string
  phone: string
  email: string
  matricule: string
  status: EmployeeStatus
  joinedDate: string
  activeTickets: number
}

export const MOCK_EMPLOYEES: Employee[] = [
  // EEP — Secteur Nord
  { id: 'emp-1',  name: 'Khalid Amrani',      initials: 'KA', role: 'eep', sector: 'Secteur Nord',  phone: '0661-234-567', email: 'k.amrani@onee.ma',      matricule: 'EEP-001', status: 'actif',   joinedDate: '2019-03-15', activeTickets: 2 },
  { id: 'emp-2',  name: 'Mehdi Benali',        initials: 'MB', role: 'eep', sector: 'Secteur Nord',  phone: '0661-345-678', email: 'm.benali@onee.ma',      matricule: 'EEP-002', status: 'actif',   joinedDate: '2021-06-01', activeTickets: 1 },
  // EEP — Secteur Est
  { id: 'emp-3',  name: 'Yassine Ouali',       initials: 'YO', role: 'eep', sector: 'Secteur Est',   phone: '0662-456-789', email: 'y.ouali@onee.ma',       matricule: 'EEP-003', status: 'actif',   joinedDate: '2020-01-20', activeTickets: 3 },
  { id: 'emp-4',  name: 'Amine Kabbaj',         initials: 'AK', role: 'eep', sector: 'Secteur Est',   phone: '0662-567-890', email: 'a.kabbaj@onee.ma',      matricule: 'EEP-004', status: 'actif',   joinedDate: '2022-09-10', activeTickets: 1 },
  // EEP — Secteur Ouest
  { id: 'emp-5',  name: 'Samir Benhima',        initials: 'SB', role: 'eep', sector: 'Secteur Ouest', phone: '0663-678-901', email: 's.benhima@onee.ma',     matricule: 'EEP-005', status: 'actif',   joinedDate: '2018-11-05', activeTickets: 1 },
  { id: 'emp-6',  name: 'Rachid Tazi',          initials: 'RT', role: 'eep', sector: 'Secteur Ouest', phone: '0663-789-012', email: 'r.tazi@onee.ma',        matricule: 'EEP-006', status: 'actif',   joinedDate: '2020-07-14', activeTickets: 2 },
  // EEP — Secteur Sud
  { id: 'emp-7',  name: 'Nabil Mansouri',       initials: 'NM', role: 'eep', sector: 'Secteur Sud',   phone: '0664-890-123', email: 'n.mansouri@onee.ma',    matricule: 'EEP-007', status: 'actif',   joinedDate: '2019-08-22', activeTickets: 2 },
  { id: 'emp-8',  name: 'Farid El Fassi',       initials: 'FE', role: 'eep', sector: 'Secteur Sud',   phone: '0664-901-234', email: 'f.elfassi@onee.ma',     matricule: 'EEP-008', status: 'inactif', joinedDate: '2021-02-28', activeTickets: 0 },
  // EEP — reserve
  { id: 'emp-9',  name: 'Omar Cherkaoui',       initials: 'OC', role: 'eep', sector: undefined,       phone: '0665-012-345', email: 'o.cherkaoui@onee.ma',   matricule: 'EEP-009', status: 'actif',   joinedDate: '2023-04-01', activeTickets: 0 },
  // SED
  { id: 'emp-10', name: 'Hassan Chraibi',       initials: 'HC', role: 'sed', sector: undefined,       phone: '0666-123-456', email: 'h.chraibi@onee.ma',     matricule: 'SED-001', status: 'actif',   joinedDate: '2015-05-10', activeTickets: 2 },
  { id: 'emp-11', name: 'Abdellatif Berrada',   initials: 'AB', role: 'sed', sector: undefined,       phone: '0666-234-567', email: 'a.berrada@onee.ma',     matricule: 'SED-002', status: 'actif',   joinedDate: '2017-09-18', activeTickets: 1 },
  { id: 'emp-12', name: 'Mourad Filali',        initials: 'MF', role: 'sed', sector: undefined,       phone: '0666-345-678', email: 'm.filali@onee.ma',      matricule: 'SED-003', status: 'actif',   joinedDate: '2019-12-03', activeTickets: 0 },
  { id: 'emp-13', name: 'Soufiane Hajji',       initials: 'SH', role: 'sed', sector: undefined,       phone: '0666-456-789', email: 's.hajji@onee.ma',       matricule: 'SED-004', status: 'inactif', joinedDate: '2020-06-15', activeTickets: 0 },
  // CGR
  { id: 'emp-14', name: 'Amina Kettani',        initials: 'AK', role: 'cgr', sector: undefined,       phone: '0667-567-890', email: 'a.kettani@onee.ma',     matricule: 'CGR-001', status: 'actif',   joinedDate: '2018-03-01', activeTickets: 0 },
  { id: 'emp-15', name: 'Sanae Moukhliss',      initials: 'SM', role: 'cgr', sector: undefined,       phone: '0667-678-901', email: 's.moukhliss@onee.ma',   matricule: 'CGR-002', status: 'actif',   joinedDate: '2020-10-12', activeTickets: 0 },
]

export const ROLE_LABELS_FR: Record<EmployeeRole, string> = {
  eep: 'EEP — Terrain',
  sed: 'SED — Intervention lourde',
  cgr: 'CGR — Centre de gestion',
}
