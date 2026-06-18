import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DUTY_SCHEDULE } from '../mock-data/duty-schedule'
import type { DutyAgent } from '../mock-data/duty-schedule'

export interface Sector {
  id: string
  name: string
  status: 'actif' | 'inactif'
}

const INITIAL_SECTORS: Sector[] = [
  { id: 's-1', name: 'Secteur Nord',  status: 'actif' },
  { id: 's-2', name: 'Secteur Est',   status: 'actif' },
  { id: 's-3', name: 'Secteur Ouest', status: 'actif' },
  { id: 's-4', name: 'Secteur Sud',   status: 'actif' },
]

// schedule key: `${weekIdx}-${sectorIdx}-${slotIdx}` → agentId
type Schedule = Record<string, string>

interface DutyState {
  agents:   DutyAgent[]
  sectors:  Sector[]
  schedule: Schedule

  // Agents
  toggleAgentOnline: (id: string) => void

  // Sectors
  addSector:    (name: string) => void
  renameSector: (id: string, name: string) => void
  toggleSector: (id: string) => void

  // Schedule
  setSlotAgent: (weekIdx: number, sectorIdx: number, slotIdx: number, agentId: string) => void
  getSlotAgent: (weekIdx: number, sectorIdx: number, slotIdx: number, fallback?: string) => string

  reset: () => void
}

export const useDutyStore = create<DutyState>()(
  persist(
    (set, get) => ({
      agents:   DUTY_SCHEDULE,
      sectors:  INITIAL_SECTORS,
      schedule: {},

      toggleAgentOnline: (id) =>
        set((s) => ({
          agents: s.agents.map((a) => a.id === id ? { ...a, online: !a.online } : a),
        })),

      addSector: (name) =>
        set((s) => ({
          sectors: [...s.sectors, { id: `s-${Date.now()}`, name, status: 'actif' as const }],
        })),

      renameSector: (id, name) =>
        set((s) => ({
          sectors: s.sectors.map((s2) => s2.id === id ? { ...s2, name } : s2),
        })),

      toggleSector: (id) =>
        set((s) => ({
          sectors: s.sectors.map((s2) =>
            s2.id === id
              ? { ...s2, status: (s2.status === 'actif' ? 'inactif' : 'actif') as 'actif' | 'inactif' }
              : s2
          ),
        })),

      setSlotAgent: (weekIdx, sectorIdx, slotIdx, agentId) => {
        const key = `${weekIdx}-${sectorIdx}-${slotIdx}`
        set((s) => ({ schedule: { ...s.schedule, [key]: agentId } }))
      },

      getSlotAgent: (weekIdx, sectorIdx, slotIdx, fallback = '') => {
        const key = `${weekIdx}-${sectorIdx}-${slotIdx}`
        const stored = get().schedule[key]
        if (stored !== undefined) return stored
        // Default to the mock schedule if no override set
        const sector = get().sectors[sectorIdx]
        if (!sector) return fallback
        const agentsInSector = get().agents.filter((a) => a.sector === sector.name)
        return agentsInSector[slotIdx]?.id ?? fallback
      },

      reset: () => set({ agents: DUTY_SCHEDULE, sectors: INITIAL_SECTORS, schedule: {} }),
    }),
    { name: 'ibt-duty' }
  )
)
