import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_EMPLOYEES } from '../mock-data/employees'
import type { Employee, EmployeeStatus } from '../mock-data/employees'

interface EmployeeState {
  employees: Employee[]
  addEmployee:    (emp: Omit<Employee, 'id'>) => void
  updateEmployee: (id: string, data: Partial<Employee>) => void
  toggleStatus:   (id: string) => void
  removeEmployee: (id: string) => void
  reset:          () => void
}

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set) => ({
      employees: MOCK_EMPLOYEES,

      addEmployee: (emp) =>
        set((s) => ({
          employees: [...s.employees, { ...emp, id: `emp-${Date.now()}` }],
        })),

      updateEmployee: (id, data) =>
        set((s) => ({
          employees: s.employees.map((e) => e.id === id ? { ...e, ...data } : e),
        })),

      toggleStatus: (id) =>
        set((s) => ({
          employees: s.employees.map((e) =>
            e.id === id
              ? { ...e, status: (e.status === 'actif' ? 'inactif' : 'actif') as EmployeeStatus }
              : e
          ),
        })),

      removeEmployee: (id) =>
        set((s) => ({ employees: s.employees.filter((e) => e.id !== id) })),

      reset: () => set({ employees: MOCK_EMPLOYEES }),
    }),
    { name: 'ibt-employees' }
  )
)
