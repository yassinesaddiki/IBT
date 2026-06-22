export type UserRole = 'cgr' | 'eep' | 'sed' | 'coordinator' | 'observer'

export interface User {
  id:          string
  name:        string
  role:        UserRole
  initials:    string
  sectorId?:   string   // DB sector id (e.g. 's-1') — sector name is derived dynamically
  sector?:     string   // derived at runtime from sectorId via dutyStore
  employeeId?: string   // links to employees table
}

export interface MockUser extends User {
  password:   string
  username:   string
  active:     boolean
}
