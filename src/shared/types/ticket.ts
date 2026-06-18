import type { TicketStatus } from './status'

export type Severity = 'Critique' | 'Haute' | 'Moyenne'

export interface EEPIntervention {
  agentId: string
  agentName: string
  readAt?: Date
  startedAt?: Date
  finishedAt?: Date
  actions?: string
  photos: string[]
  result?: 'resolu' | 'refere-sed'
  comments?: string
}

export interface CoordinatorApproval {
  coordinatorId: string
  coordinatorName: string
  referredAt: Date
  reviewedAt?: Date
  decision?: 'approuve' | 'refuse'
  comments?: string
}

export interface SEDIntervention {
  agentId: string
  agentName: string
  receivedAt: Date
  startedAt?: Date
  finishedAt?: Date
  result?: 'resolu' | 'suspendu' | 'programme'
  suspensionReason?: string
  scheduledDate?: Date
  report?: string
  photos: string[]
  comments?: string
}

export interface TicketClosure {
  clientCalled: boolean
  satisfaction?: 'satisfait' | 'probleme-persistant' | 'remarques'
  comments?: string
  closedBy: string
  closedAt: Date
}

export interface Ticket {
  id: string
  clientName: string
  contractNumber: string
  phone: string
  address: string
  sector: string
  category: string
  subCategory: string
  severity: Severity
  description?: string
  status: TicketStatus
  createdAt: Date
  createdBy: string
  preCheckMT: boolean
  preCheckProgramme: boolean
  eepIntervention?: EEPIntervention
  coordinatorApproval?: CoordinatorApproval
  sedIntervention?: SEDIntervention
  closure?: TicketClosure
}
