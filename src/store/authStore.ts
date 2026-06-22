import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '../shared/types/user'
import { MOCK_USERS } from '../mock-data/users'
import { initNotifications } from './notificationStore'

interface AuthState {
  user: User | null
  login: (identifier: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      login: (identifier, password) => {
        const found = MOCK_USERS.find(
          (u) =>
            (u.id === identifier ||
              u.username === identifier ||
              u.name.toLowerCase() === identifier.toLowerCase()) &&
            u.password === password
        )
        if (!found) return false
        const { password: _pw, ...user } = found
        void _pw
        set({ user })
        void initNotifications(found.id)
        return true
      },

      logout: () => set({ user: null }),
    }),
    {
      name: 'ibt-auth',
      partialize: (s) => ({ user: s.user }),
    }
  )
)

export const ROLE_LABELS: Record<UserRole, string> = {
  cgr:         'CGR — Centre de Gestion des Réclamations',
  eep:         'EEP — Équipe Exploitation & Production',
  sed:         'SED — Service Exploitation & Distribution',
  coordinator: 'Coordinateur',
  observer:    'Observateur / Directeur',
}
