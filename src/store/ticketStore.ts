import { create } from 'zustand'
import type { Ticket, EEPIntervention } from '../shared/types/ticket'
import type { TicketStatus } from '../shared/types/status'
import { MOCK_TICKETS } from '../mock-data/tickets'

interface TicketState {
  tickets: Ticket[]
  updateStatus:      (id: string, status: TicketStatus) => void
  addTicket:         (ticket: Ticket) => void
  markReadByEEP:     (id: string, agentId: string, agentName: string) => void
  startEEP:          (id: string) => void
  resolveEEP:        (id: string, data: Partial<EEPIntervention>) => void
  referToSED:        (id: string, data: Partial<EEPIntervention>) => void
}

export const useTicketStore = create<TicketState>((set) => ({
  tickets: MOCK_TICKETS,

  updateStatus: (id, status) =>
    set((s) => ({ tickets: s.tickets.map((t) => t.id === id ? { ...t, status } : t) })),

  addTicket: (ticket) =>
    set((s) => ({ tickets: [ticket, ...s.tickets] })),

  markReadByEEP: (id, agentId, agentName) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'lu-eep' as TicketStatus,
              eepIntervention: {
                agentId,
                agentName,
                readAt: new Date(),
                photos: t.eepIntervention?.photos ?? [],
              },
            }
          : t
      ),
    })),

  startEEP: (id) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'en-cours-eep' as TicketStatus,
              eepIntervention: {
                ...t.eepIntervention!,
                startedAt: new Date(),
              },
            }
          : t
      ),
    })),

  resolveEEP: (id, data) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'resolu-eep' as TicketStatus,
              eepIntervention: {
                ...t.eepIntervention!,
                finishedAt: new Date(),
                result: 'resolu' as const,
                ...data,
              },
            }
          : t
      ),
    })),

  referToSED: (id, data) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'attente-approbation' as TicketStatus,
              eepIntervention: {
                ...t.eepIntervention!,
                finishedAt: new Date(),
                result: 'refere-sed' as const,
                ...data,
              },
              coordinatorApproval: {
                coordinatorId:   '',
                coordinatorName: '',
                referredAt:      new Date(),
              },
            }
          : t
      ),
    })),
}))
