import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DUTY_SCHEDULE } from '../mock-data/duty-schedule'
import type { DutyAgent } from '../mock-data/duty-schedule'
import { supabase } from '../lib/supabase'

export interface Sector {
  id:     string
  name:   string
  status: 'actif' | 'inactif'
}

// schedule key: `${weekStart}_${sectorId}_${slotIdx}` → employeeId
type Schedule = Record<string, string>

interface DutyState {
  agents:    DutyAgent[]
  sectors:   Sector[]
  schedule:  Schedule
  loading:   boolean

  // Bootstrap from Supabase (call once on app start)
  init: () => Promise<void>

  // Agents
  toggleAgentOnline: (id: string) => void

  // Sectors
  addSector:    (name: string) => Promise<void>
  renameSector: (id: string, name: string) => Promise<void>
  toggleSector: (id: string) => Promise<void>
  removeSector: (id: string) => Promise<void>

  // Schedule
  setSlotAgent: (weekStart: string, sectorId: string, slotIdx: number, employeeId: string) => Promise<void>
  getSlotAgent: (weekStart: string, sectorId: string, slotIdx: number) => string

  reset: () => void
}

// Fallback initial sectors (used before Supabase loads)
const FALLBACK_SECTORS: Sector[] = [
  { id: 's-1', name: 'Oud Nachif',    status: 'actif' },
  { id: 's-2', name: 'Secteur Est',   status: 'actif' },
  { id: 's-3', name: 'Secteur Ouest', status: 'actif' },
  { id: 's-4', name: 'Secteur Sud',   status: 'actif' },
]

export const useDutyStore = create<DutyState>()(
  persist(
    (set, get) => ({
      agents:   DUTY_SCHEDULE,
      sectors:  FALLBACK_SECTORS,
      schedule: {},
      loading:  false,

      init: async () => {
        set({ loading: true })
        try {
          const { data: sectorsData, error: sectorsErr } = await supabase
            .from('sectors')
            .select('*')
            .order('name')
          if (sectorsErr) throw sectorsErr

          const sectors: Sector[] = (sectorsData ?? []).map((r: Record<string, unknown>) => ({
            id:     r.id as string,
            name:   r.name as string,
            status: r.status as 'actif' | 'inactif',
          }))

          // Also load duty schedule for current + next 4 weeks
          const today = new Date()
          const monday = new Date(today)
          monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
          const weekStart = monday.toISOString().slice(0, 10)

          const { data: scheduleData } = await supabase
            .from('duty_schedule')
            .select('week_start, sector_id, slot_index, employee_id')
            .gte('week_start', weekStart)

          const schedule: Schedule = {}
          for (const row of scheduleData ?? []) {
            const r = row as Record<string, unknown>
            const key = `${r.week_start}_${r.sector_id}_${r.slot_index}`
            schedule[key] = r.employee_id as string
          }

          set({ sectors: sectors.length ? sectors : FALLBACK_SECTORS, schedule, loading: false })
        } catch {
          set({ loading: false })
        }
      },

      toggleAgentOnline: (id) =>
        set((s) => ({
          agents: s.agents.map((a) => a.id === id ? { ...a, online: !a.online } : a),
        })),

      addSector: async (name) => {
        const { data, error } = await supabase
          .from('sectors')
          .insert({ name, status: 'actif' })
          .select()
          .single()
        if (error) throw error
        const r = data as Record<string, unknown>
        const sector: Sector = { id: r.id as string, name: r.name as string, status: 'actif' }
        set((s) => ({ sectors: [...s.sectors, sector] }))
      },

      renameSector: async (id, name) => {
        const { error } = await supabase.from('sectors').update({ name }).eq('id', id)
        if (error) throw error
        set((s) => ({
          sectors: s.sectors.map((s2) => s2.id === id ? { ...s2, name } : s2),
        }))
      },

      toggleSector: async (id) => {
        const current = get().sectors.find((s) => s.id === id)
        if (!current) return
        const next: 'actif' | 'inactif' = current.status === 'actif' ? 'inactif' : 'actif'
        const { error } = await supabase.from('sectors').update({ status: next }).eq('id', id)
        if (error) throw error
        set((s) => ({
          sectors: s.sectors.map((s2) =>
            s2.id === id ? { ...s2, status: next } : s2
          ),
        }))
      },

      removeSector: async (id) => {
        const { error } = await supabase.from('sectors').delete().eq('id', id)
        if (error) throw error
        set((s) => ({ sectors: s.sectors.filter((s2) => s2.id !== id) }))
      },

      setSlotAgent: async (weekStart, sectorId, slotIdx, employeeId) => {
        const { error } = await supabase
          .from('duty_schedule')
          .upsert(
            { week_start: weekStart, sector_id: sectorId, slot_index: slotIdx, employee_id: employeeId },
            { onConflict: 'week_start,sector_id,slot_index' }
          )
        if (error) throw error
        const key = `${weekStart}_${sectorId}_${slotIdx}`
        set((s) => ({ schedule: { ...s.schedule, [key]: employeeId } }))
      },

      getSlotAgent: (weekStart, sectorId, slotIdx) => {
        const key = `${weekStart}_${sectorId}_${slotIdx}`
        return get().schedule[key] ?? ''
      },

      reset: () => set({ agents: DUTY_SCHEDULE, sectors: FALLBACK_SECTORS, schedule: {} }),
    }),
    { name: 'ibt-duty' }
  )
)
