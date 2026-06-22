export type VehicleType   = 'voiture' | 'camion' | 'nacelle' | 'moto' | 'autre'
export type VehicleStatus = 'actif' | 'inactif' | 'maintenance'
export type VehicleTeam   = 'eep' | 'sed'

export interface Vehicle {
  id:           string
  plate:        string        // ex: DO 248
  brand:        string        // ex: Dacia
  model:        string        // ex: Sandero
  vehicleType:  VehicleType
  assignedTeam: VehicleTeam | null
  status:       VehicleStatus
}

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v-1', plate: 'DO 248',  brand: 'Dacia',    model: 'Sandero',        vehicleType: 'voiture', assignedTeam: 'eep', status: 'actif' },
  { id: 'v-2', plate: 'DO 312',  brand: 'Dacia',    model: 'Duster',         vehicleType: 'voiture', assignedTeam: 'eep', status: 'actif' },
  { id: 'v-3', plate: 'DO 455',  brand: 'Renault',  model: 'Kangoo',         vehicleType: 'voiture', assignedTeam: 'eep', status: 'actif' },
  { id: 'v-4', plate: 'DO 119',  brand: 'Ford',     model: 'Transit',        vehicleType: 'camion',  assignedTeam: 'sed', status: 'actif' },
  { id: 'v-5', plate: 'DO 523',  brand: 'Mercedes', model: 'Sprinter',       vehicleType: 'camion',  assignedTeam: 'sed', status: 'actif' },
  { id: 'v-6', plate: 'DO 087',  brand: 'Renault',  model: 'Master Nacelle', vehicleType: 'nacelle', assignedTeam: 'sed', status: 'actif' },
  { id: 'v-7', plate: 'DO 741',  brand: 'Dacia',    model: 'Logan',          vehicleType: 'voiture', assignedTeam: 'eep', status: 'maintenance' },
  { id: 'v-8', plate: 'DO 633',  brand: 'Toyota',   model: 'Hilux',          vehicleType: 'camion',  assignedTeam: 'sed', status: 'actif' },
]

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  voiture:     'Voiture',
  camion:      'Camion',
  nacelle:     'Nacelle / Élévateur',
  moto:        'Moto',
  autre:       'Autre',
}

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  actif:       'Actif',
  inactif:     'Inactif',
  maintenance: 'En maintenance',
}
