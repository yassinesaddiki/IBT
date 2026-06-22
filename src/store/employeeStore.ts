import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_EMPLOYEES } from '../mock-data/employees'
import type { Employee, EmployeeStatus } from '../mock-data/employees'
import { supabase } from '../lib/supabase'

interface EmployeeState {
  employees: Employee[]
  loading:   boolean

  init: () => Promise<void>

  addEmployee:    (emp: Omit<Employee, 'id' | 'activeTickets'>) => Promise<void>
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>
  toggleStatus:   (id: string) => Promise<void>
  removeEmployee: (id: string) => Promise<void>
  reset:          () => void
}

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set, get) => ({
      employees: MOCK_EMPLOYEES,
      loading:   false,

      init: async () => {
        set({ loading: true })
        try {
          // Join with sectors to get sector name
          const { data, error } = await supabase
            .from('employees')
            .select('*, sectors(name)')
            .order('name')
          if (error) throw error

          const employees: Employee[] = (data ?? []).map((r: Record<string, unknown>) => {
            const sector = r.sectors as { name: string } | null
            return {
              id:           r.id as string,
              name:         r.name as string,
              initials:     r.initials as string,
              role:         r.role as Employee['role'],
              sectorId:     r.sector_id as string | undefined,
              sector:       sector?.name,
              phone:        r.phone as string,
              email:        r.email as string,
              matricule:    r.matricule as string,
              avatarUrl:    r.avatar_url as string | undefined,
              vehicleId:    r.vehicle_id as string | undefined,
              status:       r.status as EmployeeStatus,
              joinedDate:   r.joined_date as string,
              activeTickets: 0,
            }
          })

          set({ employees: employees.length ? employees : MOCK_EMPLOYEES, loading: false })
        } catch {
          set({ loading: false })
        }
      },

      addEmployee: async (emp) => {
        const { data, error } = await supabase
          .from('employees')
          .insert({
            name:        emp.name,
            initials:    emp.initials,
            role:        emp.role,
            sector_id:   emp.sectorId ?? null,
            phone:       emp.phone,
            email:       emp.email,
            matricule:   emp.matricule,
            avatar_url:  emp.avatarUrl ?? null,
            vehicle_id:  emp.vehicleId ?? null,
            status:      emp.status,
            joined_date: emp.joinedDate,
          })
          .select('*, sectors(name)')
          .single()
        if (error) throw error
        const r = data as Record<string, unknown>
        const sector = r.sectors as { name: string } | null
        const newEmp: Employee = {
          id:           r.id as string,
          name:         emp.name,
          initials:     emp.initials,
          role:         emp.role,
          sectorId:     emp.sectorId,
          sector:       sector?.name ?? emp.sector,
          phone:        emp.phone,
          email:        emp.email,
          matricule:    emp.matricule,
          avatarUrl:    emp.avatarUrl,
          vehicleId:    emp.vehicleId,
          status:       emp.status,
          joinedDate:   emp.joinedDate,
          activeTickets: 0,
        }
        set((s) => ({ employees: [...s.employees, newEmp] }))
      },

      updateEmployee: async (id, data) => {
        const dbData: Record<string, unknown> = {}
        if (data.name      !== undefined) dbData.name       = data.name
        if (data.initials  !== undefined) dbData.initials   = data.initials
        if (data.role      !== undefined) dbData.role        = data.role
        if (data.sectorId  !== undefined) dbData.sector_id  = data.sectorId
        if (data.phone     !== undefined) dbData.phone       = data.phone
        if (data.email     !== undefined) dbData.email       = data.email
        if (data.matricule !== undefined) dbData.matricule   = data.matricule
        if (data.avatarUrl !== undefined) dbData.avatar_url  = data.avatarUrl
        if (data.vehicleId !== undefined) dbData.vehicle_id  = data.vehicleId
        if (data.status    !== undefined) dbData.status      = data.status

        const { error } = await supabase.from('employees').update(dbData).eq('id', id)
        if (error) throw error

        // If sector changed, refresh sector name
        if (data.sectorId !== undefined) {
          await get().init()
        } else {
          set((s) => ({
            employees: s.employees.map((e) => e.id === id ? { ...e, ...data } : e),
          }))
        }
      },

      toggleStatus: async (id) => {
        const emp = get().employees.find((e) => e.id === id)
        if (!emp) return
        const next: EmployeeStatus = emp.status === 'actif' ? 'inactif' : 'actif'
        const { error } = await supabase.from('employees').update({ status: next }).eq('id', id)
        if (error) throw error
        set((s) => ({
          employees: s.employees.map((e) => e.id === id ? { ...e, status: next } : e),
        }))
      },

      removeEmployee: async (id) => {
        const { error } = await supabase.from('employees').delete().eq('id', id)
        if (error) throw error
        set((s) => ({ employees: s.employees.filter((e) => e.id !== id) }))
      },

      reset: () => set({ employees: MOCK_EMPLOYEES }),
    }),
    { name: 'ibt-employees' }
  )
)
