export type UserRole = 'cgr' | 'eep' | 'sed' | 'coordinator' | 'observer'

export interface User {
  id: string
  name: string
  role: UserRole
  initials: string
  sector?: string
}

export interface MockUser extends User {
  password: string
}
