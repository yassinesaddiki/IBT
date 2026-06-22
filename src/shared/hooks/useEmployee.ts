import { useEmployeeStore } from '../../store/employeeStore'
import { useVehicleStore } from '../../store/vehicleStore'
import { useAccountStore } from '../../store/accountStore'
import type { Employee } from '../../mock-data/employees'
import type { Vehicle } from '../../mock-data/vehicles'

export interface EmployeeWithVehicle extends Employee {
  vehicle?: Vehicle
}

/** Return a single employee by id, enriched with their vehicle. */
export function useEmployee(id: string | undefined): EmployeeWithVehicle | undefined {
  const employees = useEmployeeStore((s) => s.employees)
  const vehicles  = useVehicleStore((s) => s.vehicles)

  const emp = id ? employees.find((e) => e.id === id) : undefined
  if (!emp) return undefined

  return {
    ...emp,
    vehicle: emp.vehicleId ? vehicles.find((v) => v.id === emp.vehicleId) : undefined,
  }
}

/** Find employee whose agentName matches (fallback for tickets that store name not id). */
export function useEmployeeByName(name: string | undefined): EmployeeWithVehicle | undefined {
  const employees = useEmployeeStore((s) => s.employees)
  const vehicles  = useVehicleStore((s) => s.vehicles)

  const emp = name ? employees.find((e) => e.name === name) : undefined
  if (!emp) return undefined

  return {
    ...emp,
    vehicle: emp.vehicleId ? vehicles.find((v) => v.id === emp.vehicleId) : undefined,
  }
}

/** Map the auth user id (e.g. 'eep-1') to their linked employee via accountStore. */
export function useMyEmployee(userId: string | undefined): EmployeeWithVehicle | undefined {
  const accounts  = useAccountStore((s) => s.accounts)
  const employees = useEmployeeStore((s) => s.employees)
  const vehicles  = useVehicleStore((s) => s.vehicles)

  const account = userId ? accounts.find((a) => a.id === userId) : undefined
  const empId   = account?.employeeId ?? userId
  const emp     = empId ? employees.find((e) => e.id === empId) : undefined
  if (!emp) return undefined
  return { ...emp, vehicle: emp.vehicleId ? vehicles.find((v) => v.id === emp.vehicleId) : undefined }
}
