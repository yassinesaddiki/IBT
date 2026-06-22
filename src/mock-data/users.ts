import type { MockUser } from '../shared/types/user'

export const MOCK_USERS: MockUser[] = [
  { id: 'cgr-1',   name: 'Amina Kettani',  initials: 'AK', role: 'cgr',         password: 'cgr123',   username: 'cgr123',   active: true  },
  { id: 'eep-1',   name: 'Mohammed Alami', initials: 'MA', role: 'eep',         password: 'eep123',   username: 'eep123',   active: true,  sectorId: 's-1' },
  { id: 'sed-1',   name: 'Hassan Chraibi', initials: 'HC', role: 'sed',         password: 'sed123',   username: 'sed123',   active: true  },
  { id: 'coord-1', name: 'Yasmine Benali', initials: 'YB', role: 'coordinator', password: 'coord123', username: 'coord123', active: true  },
  { id: 'obs-1',   name: 'Directeur Tazi', initials: 'DT', role: 'observer',    password: 'obs123',   username: 'obs123',   active: true  },
]

export const ROLE_ROUTES: Record<string, string> = {
  cgr:         '/cgr/dashboard',
  eep:         '/eep/dashboard',
  sed:         '/sed/dashboard',
  coordinator: '/coordinator/dashboard',
  observer:    '/observer/dashboard',
}
