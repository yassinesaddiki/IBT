import type { MockUser } from '../shared/types/user'

export const MOCK_USERS: MockUser[] = [
  {
    id:       'cgr-1',
    name:     'Amina Kettani',
    initials: 'AK',
    role:     'cgr',
    password: 'cgr123',
  },
  {
    id:       'eep-1',
    name:     'Mohammed Alami',
    initials: 'MA',
    role:     'eep',
    sector:   'Secteur Nord',
    password: 'eep123',
  },
  {
    id:       'sed-1',
    name:     'Hassan Chraibi',
    initials: 'HC',
    role:     'sed',
    password: 'sed123',
  },
  {
    id:       'coord-1',
    name:     'Yasmine Benali',
    initials: 'YB',
    role:     'coordinator',
    password: 'coord123',
  },
  {
    id:       'obs-1',
    name:     'Directeur Tazi',
    initials: 'DT',
    role:     'observer',
    password: 'obs123',
  },
]

export const ROLE_ROUTES: Record<string, string> = {
  cgr:         '/cgr/dashboard',
  eep:         '/eep/dashboard',
  sed:         '/sed/dashboard',
  coordinator: '/coordinator/dashboard',
  observer:    '/observer/dashboard',
}
