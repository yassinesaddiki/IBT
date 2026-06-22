import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_USERS } from '../mock-data/users'
import type { MockUser, UserRole } from '../shared/types/user'
import { supabase } from '../lib/supabase'

interface AccountState {
  accounts: MockUser[]
  loading:  boolean

  init: () => Promise<void>

  addAccount:    (acc: Omit<MockUser, 'id' | 'initials'>) => Promise<void>
  updateAccount: (id: string, data: Partial<MockUser>) => Promise<void>
  toggleActive:  (id: string) => Promise<void>
  removeAccount: (id: string) => Promise<void>
  reset:         () => void
}

function makeInitials(name: string): string {
  return name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2)
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      accounts: MOCK_USERS,
      loading:  false,

      init: async () => {
        set({ loading: true })
        try {
          const { data, error } = await supabase
            .from('user_accounts')
            .select('*')
            .order('name')
          if (error) throw error

          const accounts: MockUser[] = (data ?? []).map((r: Record<string, unknown>) => ({
            id:         r.id as string,
            name:       r.name as string,
            initials:   makeInitials(r.name as string),
            role:       r.role as UserRole,
            username:   r.username as string,
            password:   r.password as string,
            active:     r.active as boolean,
            sectorId:   r.sector_id as string | undefined,
            employeeId: r.employee_id as string | undefined,
          }))

          set({ accounts: accounts.length ? accounts : MOCK_USERS, loading: false })
        } catch {
          set({ loading: false })
        }
      },

      addAccount: async (acc) => {
        const initials = makeInitials(acc.name)
        const { data, error } = await supabase
          .from('user_accounts')
          .insert({
            name:        acc.name,
            role:        acc.role,
            username:    acc.username,
            password:    acc.password,
            active:      acc.active,
            sector_id:   acc.sectorId ?? null,
            employee_id: acc.employeeId ?? null,
          })
          .select()
          .single()
        if (error) throw error
        const r = data as Record<string, unknown>
        set((s) => ({
          accounts: [...s.accounts, {
            id: r.id as string, name: acc.name, initials, role: acc.role,
            username: acc.username, password: acc.password, active: acc.active,
            sectorId: acc.sectorId, employeeId: acc.employeeId,
          }],
        }))
      },

      updateAccount: async (id, data) => {
        const dbData: Record<string, unknown> = {}
        if (data.name     !== undefined) dbData.name        = data.name
        if (data.role     !== undefined) dbData.role         = data.role
        if (data.username !== undefined) dbData.username     = data.username
        if (data.password !== undefined) dbData.password     = data.password
        if (data.active   !== undefined) dbData.active       = data.active
        if (data.sectorId !== undefined) dbData.sector_id    = data.sectorId
        const { error } = await supabase.from('user_accounts').update(dbData).eq('id', id)
        if (error) throw error
        set((s) => ({
          accounts: s.accounts.map((a) => a.id === id ? { ...a, ...data } : a),
        }))
      },

      toggleActive: async (id) => {
        const acc = get().accounts.find((a) => a.id === id)
        if (!acc) return
        const next = !acc.active
        const { error } = await supabase.from('user_accounts').update({ active: next }).eq('id', id)
        if (error) throw error
        set((s) => ({
          accounts: s.accounts.map((a) => a.id === id ? { ...a, active: next } : a),
        }))
      },

      removeAccount: async (id) => {
        const { error } = await supabase.from('user_accounts').delete().eq('id', id)
        if (error) throw error
        set((s) => ({ accounts: s.accounts.filter((a) => a.id !== id) }))
      },

      reset: () => set({ accounts: MOCK_USERS }),
    }),
    { name: 'ibt-accounts' }
  )
)
