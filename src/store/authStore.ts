import { create } from 'zustand'
import type { User, UserRole } from '../shared/types/user'
import { MOCK_USERS } from '../mock-data/users'

interface AuthState {
  user: User | null
  login: (identifier: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: (identifier, password) => {
    const found = MOCK_USERS.find(
      (u) =>
        (u.id === identifier || u.name.toLowerCase() === identifier.toLowerCase()) &&
        u.password === password
    )
    if (!found) return false
    const { password: _pw, ...user } = found
    void _pw
    set({ user })
    return true
  },

  logout: () => set({ user: null }),
}))

export const ROLE_LABELS: Record<UserRole, string> = {
  cgr:         'CGR — Centre de Gestion des Réclamations',
  eep:         'EEP — Équipe Exploitation & Production',
  sed:         'SED — Service Exploitation & Distribution',
  coordinator: 'Coordinateur',
  observer:    'Observateur / Directeur',
}
