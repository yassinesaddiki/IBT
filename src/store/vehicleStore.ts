import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_VEHICLES } from '../mock-data/vehicles'
import type { Vehicle, VehicleStatus } from '../mock-data/vehicles'
import { supabase } from '../lib/supabase'

interface VehicleState {
  vehicles:      Vehicle[]
  loading:       boolean
  init:          () => Promise<void>
  addVehicle:    (v: Omit<Vehicle, 'id'>) => Promise<void>
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<void>
  toggleStatus:  (id: string) => Promise<void>
  removeVehicle: (id: string) => Promise<void>
  reset:         () => void
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      vehicles: MOCK_VEHICLES,
      loading:  false,

      init: async () => {
        set({ loading: true })
        try {
          const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .order('plate')
          if (error) throw error
          const vehicles: Vehicle[] = (data ?? []).map((r: Record<string, unknown>) => ({
            id:           r.id           as string,
            plate:        r.plate        as string,
            brand:        r.brand        as string,
            model:        r.model        as string,
            vehicleType:  r.vehicle_type as Vehicle['vehicleType'],
            assignedTeam: r.assigned_team as Vehicle['assignedTeam'],
            status:       r.status       as VehicleStatus,
          }))
          set({ vehicles: vehicles.length ? vehicles : MOCK_VEHICLES, loading: false })
        } catch {
          set({ loading: false })
        }
      },

      addVehicle: async (v) => {
        const { data, error } = await supabase
          .from('vehicles')
          .insert({
            plate:         v.plate,
            brand:         v.brand,
            model:         v.model,
            vehicle_type:  v.vehicleType,
            assigned_team: v.assignedTeam ?? null,
            status:        v.status,
          })
          .select()
          .single()
        if (error) throw error
        const r = data as Record<string, unknown>
        const newV: Vehicle = { ...v, id: r.id as string }
        set((s) => ({ vehicles: [...s.vehicles, newV] }))
      },

      updateVehicle: async (id, data) => {
        const dbData: Record<string, unknown> = {}
        if (data.plate        !== undefined) dbData.plate         = data.plate
        if (data.brand        !== undefined) dbData.brand         = data.brand
        if (data.model        !== undefined) dbData.model         = data.model
        if (data.vehicleType  !== undefined) dbData.vehicle_type  = data.vehicleType
        if (data.assignedTeam !== undefined) dbData.assigned_team = data.assignedTeam
        if (data.status       !== undefined) dbData.status        = data.status
        const { error } = await supabase.from('vehicles').update(dbData).eq('id', id)
        if (error) throw error
        set((s) => ({
          vehicles: s.vehicles.map((v) => v.id === id ? { ...v, ...data } : v),
        }))
      },

      toggleStatus: async (id) => {
        const v = get().vehicles.find((v) => v.id === id)
        if (!v) return
        const next: VehicleStatus = v.status === 'actif' ? 'inactif' : 'actif'
        await get().updateVehicle(id, { status: next })
      },

      removeVehicle: async (id) => {
        const { error } = await supabase.from('vehicles').delete().eq('id', id)
        if (error) throw error
        set((s) => ({ vehicles: s.vehicles.filter((v) => v.id !== id) }))
      },

      reset: () => set({ vehicles: MOCK_VEHICLES }),
    }),
    { name: 'ibt-vehicles' }
  )
)
