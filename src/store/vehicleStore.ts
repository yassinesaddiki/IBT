import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_VEHICLES } from '../mock-data/vehicles'
import type { Vehicle, VehicleStatus } from '../mock-data/vehicles'

interface VehicleState {
  vehicles:      Vehicle[]
  addVehicle:    (v: Omit<Vehicle, 'id'>) => void
  updateVehicle: (id: string, data: Partial<Vehicle>) => void
  toggleStatus:  (id: string) => void
  removeVehicle: (id: string) => void
  reset:         () => void
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      vehicles: MOCK_VEHICLES,

      addVehicle: (v) =>
        set((s) => ({
          vehicles: [...s.vehicles, { ...v, id: `v-${Date.now()}` }],
        })),

      updateVehicle: (id, data) =>
        set((s) => ({
          vehicles: s.vehicles.map((v) => v.id === id ? { ...v, ...data } : v),
        })),

      toggleStatus: (id) =>
        set((s) => ({
          vehicles: s.vehicles.map((v) => {
            if (v.id !== id) return v
            const next: VehicleStatus = v.status === 'actif' ? 'inactif' : 'actif'
            return { ...v, status: next }
          }),
        })),

      removeVehicle: (id) =>
        set((s) => ({ vehicles: s.vehicles.filter((v) => v.id !== id) })),

      reset: () => set({ vehicles: MOCK_VEHICLES }),
    }),
    { name: 'ibt-vehicles' }
  )
)
