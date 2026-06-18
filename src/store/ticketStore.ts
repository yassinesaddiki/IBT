import { create } from 'zustand'
import type { Ticket, EEPIntervention, SEDIntervention } from '../shared/types/ticket'
import type { TicketStatus } from '../shared/types/status'
import { MOCK_TICKETS } from '../mock-data/tickets'

interface TicketState {
  tickets: Ticket[]
  updateStatus:  (id: string, status: TicketStatus) => void
  addTicket:     (ticket: Ticket) => void
  markReadByEEP: (id: string, agentId: string, agentName: string) => void
  startEEP:      (id: string) => void
  resolveEEP:    (id: string, data: Partial<EEPIntervention>) => void
  referToSED:    (id: string, data: Partial<EEPIntervention>) => void
  startSED:      (id: string, agentId: string, agentName: string) => void
  suspendSED:    (id: string, reason: string) => void
  scheduleSED:   (id: string, date: Date, notes: string) => void
  resolveSED:    (id: string, data: Partial<SEDIntervention>) => void
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
        t.id !== id ? t : {
          ...t,
          status: 'lu-eep' as TicketStatus,
          eepIntervention: { agentId, agentName, readAt: new Date(), photos: t.eepIntervention?.photos ?? [] },
        }
      ),
    })),

  startEEP: (id) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id !== id ? t : {
          ...t, status: 'en-cours-eep' as TicketStatus,
          eepIntervention: { ...t.eepIntervention!, startedAt: new Date() },
        }
      ),
    })),

  resolveEEP: (id, data) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id !== id ? t : {
          ...t, status: 'resolu-eep' as TicketStatus,
          eepIntervention: { ...t.eepIntervention!, finishedAt: new Date(), result: 'resolu' as const, ...data },
        }
      ),
    })),

  referToSED: (id, data) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id !== id ? t : {
          ...t, status: 'attente-approbation' as TicketStatus,
          eepIntervention: { ...t.eepIntervention!, finishedAt: new Date(), result: 'refere-sed' as const, ...data },
          coordinatorApproval: { coordinatorId: '', coordinatorName: '', referredAt: new Date() },
        }
      ),
    })),

  startSED: (id, agentId, agentName) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id !== id ? t : {
          ...t, status: 'en-cours-sed' as TicketStatus,
          sedIntervention: {
            ...(t.sedIntervention ?? { receivedAt: new Date(), photos: [] }),
            agentId, agentName,
            startedAt: t.sedIntervention?.startedAt ?? new Date(),
          },
        }
      ),
    })),

  suspendSED: (id, reason) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id !== id ? t : {
          ...t, status: 'suspendu' as TicketStatus,
          sedIntervention: {
            ...(t.sedIntervention ?? { agentId: '', agentName: '', receivedAt: new Date(), photos: [] }),
            result: 'suspendu' as const,
            suspensionReason: reason,
          },
        }
      ),
    })),

  scheduleSED: (id, date, notes) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id !== id ? t : {
          ...t, status: 'programme' as TicketStatus,
          sedIntervention: {
            ...(t.sedIntervention ?? { agentId: '', agentName: '', receivedAt: new Date(), photos: [] }),
            result: 'programme' as const,
            scheduledDate: date,
            comments: notes || undefined,
          },
        }
      ),
    })),

  resolveSED: (id, data) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id !== id ? t : {
          ...t, status: 'resolu-sed' as TicketStatus,
          sedIntervention: {
            ...(t.sedIntervention ?? { agentId: '', agentName: '', receivedAt: new Date(), photos: [] }),
            finishedAt: new Date(),
            result: 'resolu' as const,
            ...data,
          },
        }
      ),
    })),
}))
