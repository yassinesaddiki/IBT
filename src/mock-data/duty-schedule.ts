export interface DutyAgent {
  id: string
  name: string
  initials: string
  phone: string
  sector: string
  activeTickets: number
  closedThisWeek: number
  online: boolean
}

export const DUTY_SCHEDULE: DutyAgent[] = [
  {
    id: 'eep-1', name: 'Khalid Amrani',  initials: 'KA',
    phone: '0661-234-567', sector: 'Secteur Nord',  activeTickets: 2, closedThisWeek: 5, online: true,
  },
  {
    id: 'eep-2', name: 'Mehdi Benali',   initials: 'MB',
    phone: '0661-345-678', sector: 'Secteur Nord',  activeTickets: 1, closedThisWeek: 3, online: true,
  },
  {
    id: 'eep-3', name: 'Yassine Ouali',  initials: 'YO',
    phone: '0662-456-789', sector: 'Secteur Est',   activeTickets: 3, closedThisWeek: 7, online: true,
  },
  {
    id: 'eep-4', name: 'Amine Kabbaj',   initials: 'AK',
    phone: '0662-567-890', sector: 'Secteur Est',   activeTickets: 1, closedThisWeek: 4, online: true,
  },
  {
    id: 'eep-5', name: 'Samir Benhima',  initials: 'SB',
    phone: '0663-678-901', sector: 'Secteur Ouest', activeTickets: 1, closedThisWeek: 6, online: true,
  },
  {
    id: 'eep-6', name: 'Rachid Tazi',    initials: 'RT',
    phone: '0663-789-012', sector: 'Secteur Ouest', activeTickets: 2, closedThisWeek: 4, online: true,
  },
  {
    id: 'eep-7', name: 'Nabil Mansouri', initials: 'NM',
    phone: '0664-890-123', sector: 'Secteur Sud',   activeTickets: 2, closedThisWeek: 5, online: true,
  },
  {
    id: 'eep-8', name: 'Farid El Fassi', initials: 'FE',
    phone: '0664-901-234', sector: 'Secteur Sud',   activeTickets: 1, closedThisWeek: 3, online: false,
  },
]

export const SECTORS = ['Secteur Nord', 'Secteur Est', 'Secteur Ouest', 'Secteur Sud']
