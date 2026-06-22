import { useDutyStore } from '../../store/dutyStore'
import { useEmployeeStore } from '../../store/employeeStore'
import { useVehicleStore } from '../../store/vehicleStore'
import type { Employee } from '../../mock-data/employees'
import type { Vehicle } from '../../mock-data/vehicles'

export interface DutySlotAgent {
  employee:  Employee
  vehicle?:  Vehicle
  slotIndex: number
  online:    boolean   // always true for prototype — EEP on duty is active
}

export interface SectorDuty {
  sectorId:   string
  sectorName: string
  agents:     DutySlotAgent[]
}

/** Returns the Monday (ISO date string) of the week containing `date`. */
export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay() // 0=Sun … 6=Sat
  const diff = (day === 0 ? -6 : 1 - day) // adjust to Monday
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

/**
 * Returns duty agents for the current week grouped by sector.
 * Reads from the duty_schedule stored in dutyStore and resolves to real employees.
 */
export function useCurrentDuty(): SectorDuty[] {
  const sectors   = useDutyStore((s) => s.sectors)
  const getSlot   = useDutyStore((s) => s.getSlotAgent)
  const employees = useEmployeeStore((s) => s.employees)
  const vehicles  = useVehicleStore((s) => s.vehicles)

  const weekStart = getWeekStart()

  return sectors
    .filter((s) => s.status === 'actif')
    .map((sector) => {
      const agents: DutySlotAgent[] = []
      for (let slotIdx = 0; slotIdx < 4; slotIdx++) {
        const empId = getSlot(weekStart, sector.id, slotIdx)
        if (!empId) break
        const emp = employees.find((e) => e.id === empId)
        if (!emp) break
        const vehicle = emp.vehicleId ? vehicles.find((v) => v.id === emp.vehicleId) : undefined
        agents.push({ employee: emp, vehicle, slotIndex: slotIdx, online: true })
      }
      return { sectorId: sector.id, sectorName: sector.name, agents }
    })
}

/**
 * Returns all EP employees available for duty assignment.
 * Use this for the DutyScheduleScreen dropdown — replaces mock DUTY_SCHEDULE.
 */
export function useEPEmployees() {
  const employees = useEmployeeStore((s) => s.employees)
  return employees.filter((e) => e.role === 'eep' && e.status === 'actif')
}
