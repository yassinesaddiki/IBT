import { create } from 'zustand'
import type { Ticket, EEPIntervention, SEDIntervention, TicketClosure } from '../shared/types/ticket'
import type { TicketStatus } from '../shared/types/status'
import { supabase } from '../lib/supabase'

// ─── Supabase row → Ticket ───────────────────────────────────────────────────

function rowToTicket(
  row: Record<string, unknown>,
  eepRows: Record<string, unknown>[],
  approvalRows: Record<string, unknown>[],
  sedRows: Record<string, unknown>[],
  closureRows: Record<string, unknown>[],
): Ticket {
  const id = row.id as string
  const d  = (v: unknown) => (v ? new Date(v as string) : undefined)

  const eep = eepRows.find((r) => r.ticket_id === id)
  const approval = approvalRows.find((r) => r.ticket_id === id)
  const sed = sedRows.find((r) => r.ticket_id === id)
  const closure = closureRows.find((r) => r.ticket_id === id)

  return {
    id,
    clientName:        row.client_name        as string,
    contractNumber:    row.contract_number    as string,
    phone:             row.phone              as string,
    address:           row.address            as string,
    sector:            row.sector_name        as string,
    sectorId:          row.sector_id          as string | undefined,
    category:          row.category_label     as string,
    subCategory:       row.sub_category_label as string,
    severity:          row.severity           as Ticket['severity'],
    description:       row.description        as string | undefined,
    status:            row.status             as TicketStatus,
    createdAt:         new Date(row.created_at as string),
    createdBy:         row.created_by         as string ?? '',
    preCheckMT:        row.pre_check_mt       as boolean,
    preCheckProgramme: row.pre_check_programme as boolean,

    eepIntervention: eep ? {
      agentId:    eep.agent_id   as string ?? '',
      agentName:  eep.agent_name as string ?? '',
      readAt:     d(eep.read_at),
      startedAt:  d(eep.started_at),
      finishedAt: d(eep.finished_at),
      actions:    eep.actions    as string | undefined,
      result:     eep.result     as EEPIntervention['result'],
      comments:   eep.comments   as string | undefined,
      photos:     (eep.photos    as string[] | null) ?? [],
    } : undefined,

    coordinatorApproval: approval ? {
      coordinatorId:   approval.coordinator_id   as string ?? '',
      coordinatorName: approval.coordinator_name as string ?? '',
      referredAt:      new Date(approval.referred_at as string),
      reviewedAt:      d(approval.reviewed_at),
      decision:        approval.decision         as 'approuve' | 'refuse' | undefined,
      comments:        approval.comments         as string | undefined,
    } : undefined,

    sedIntervention: sed ? {
      agentId:          sed.agent_id          as string ?? '',
      agentName:        sed.agent_name        as string ?? '',
      receivedAt:       new Date(sed.received_at as string),
      startedAt:        d(sed.started_at),
      finishedAt:       d(sed.finished_at),
      result:           sed.result            as SEDIntervention['result'],
      suspensionReason: sed.suspension_reason as string | undefined,
      scheduledDate:    d(sed.scheduled_date),
      report:           sed.report            as string | undefined,
      comments:         sed.comments          as string | undefined,
      photos:           (sed.photos           as string[] | null) ?? [],
    } : undefined,

    closure: closure ? {
      clientCalled:  closure.client_called  as boolean,
      satisfaction:  closure.satisfaction   as TicketClosure['satisfaction'],
      comments:      closure.comments       as string | undefined,
      closedBy:      closure.closed_by      as string ?? '',
      closedAt:      new Date(closure.closed_at as string),
    } : undefined,
  }
}

// ─── Fetch all tickets with all relations ────────────────────────────────────

async function fetchAllTickets(): Promise<Ticket[]> {
  const [tRes, eRes, aRes, sRes, cRes] = await Promise.all([
    supabase.from('tickets').select('*').order('created_at', { ascending: false }),
    supabase.from('eep_interventions').select('*'),
    supabase.from('coordinator_approvals').select('*'),
    supabase.from('sed_interventions').select('*'),
    supabase.from('ticket_closures').select('*'),
  ])

  if (tRes.error) throw tRes.error

  const tickets = (tRes.data ?? []) as Record<string, unknown>[]
  const eep     = (eRes.data ?? []) as Record<string, unknown>[]
  const appr    = (aRes.data ?? []) as Record<string, unknown>[]
  const sed     = (sRes.data ?? []) as Record<string, unknown>[]
  const clos    = (cRes.data ?? []) as Record<string, unknown>[]

  return tickets.map((row) => rowToTicket(row, eep, appr, sed, clos))
}

async function fetchOneTicket(id: string): Promise<Ticket | null> {
  const [tRes, eRes, aRes, sRes, cRes] = await Promise.all([
    supabase.from('tickets').select('*').eq('id', id).single(),
    supabase.from('eep_interventions').select('*').eq('ticket_id', id),
    supabase.from('coordinator_approvals').select('*').eq('ticket_id', id),
    supabase.from('sed_interventions').select('*').eq('ticket_id', id),
    supabase.from('ticket_closures').select('*').eq('ticket_id', id),
  ])
  if (tRes.error || !tRes.data) return null
  return rowToTicket(
    tRes.data as Record<string, unknown>,
    (eRes.data ?? []) as Record<string, unknown>[],
    (aRes.data ?? []) as Record<string, unknown>[],
    (sRes.data ?? []) as Record<string, unknown>[],
    (cRes.data ?? []) as Record<string, unknown>[],
  )
}

// ─── Notification helper ─────────────────────────────────────────────────────

async function notifyUsers(
  userIds: string[],
  type: 'info' | 'success' | 'warning' | 'danger',
  title: string,
  message: string,
  ticketId: string,
) {
  if (!userIds.length) return
  const rows = userIds.map((uid) => ({
    user_id:   uid,
    type,
    title,
    message,
    ticket_id: ticketId,
    read:      false,
  }))
  await supabase.from('notifications').insert(rows)
}

async function getAccountsByRole(role: string, sectorId?: string): Promise<string[]> {
  let q = supabase.from('user_accounts').select('id').eq('role', role).eq('active', true)
  if (sectorId) q = q.eq('sector_id', sectorId)
  const { data } = await q
  return (data ?? []).map((r: Record<string, unknown>) => r.id as string)
}

// ─── Store ───────────────────────────────────────────────────────────────────

interface TicketState {
  tickets: Ticket[]
  loading: boolean

  // Bootstrap
  init: () => Promise<void>
  refreshTicket: (id: string) => Promise<void>

  // CGR
  addTicket:     (data: Omit<Ticket, 'id' | 'createdAt'>) => Promise<string>
  closeTicket:   (id: string, closure: Omit<TicketClosure, 'closedAt'>) => Promise<void>

  // EEP
  markReadByEEP: (id: string, agentId: string, agentName: string) => Promise<void>
  startEEP:      (id: string) => Promise<void>
  resolveEEP:    (id: string, data: { actions: string; comments?: string; photos?: string[] }) => Promise<void>
  referToSED:    (id: string, data: { actions: string; comments?: string; photos?: string[] }) => Promise<void>

  // Coordinator
  approveTicket: (id: string, coordinatorId: string, coordinatorName: string, comments?: string) => Promise<void>
  rejectTicket:  (id: string, coordinatorId: string, coordinatorName: string, comments: string) => Promise<void>

  // SED
  startSED:    (id: string, agentId: string, agentName: string) => Promise<void>
  suspendSED:  (id: string, reason: string) => Promise<void>
  scheduleSED: (id: string, date: Date, notes: string) => Promise<void>
  resolveSED:  (id: string, data: { report: string; comments?: string; photos?: string[] }) => Promise<void>

  reset: () => void
}

export const useTicketStore = create<TicketState>()((set, get) => ({
  tickets: [],
  loading: false,

  init: async () => {
    set({ loading: true })
    try {
      const tickets = await fetchAllTickets()
      set({ tickets, loading: false })
    } catch (err) {
      console.error('[ticketStore] init failed:', err)
      set({ loading: false })
    }
  },

  refreshTicket: async (id) => {
    const ticket = await fetchOneTicket(id)
    if (!ticket) return
    set((s) => ({
      tickets: s.tickets.some((t) => t.id === id)
        ? s.tickets.map((t) => t.id === id ? ticket : t)
        : [ticket, ...s.tickets],
    }))
  },

  // ── CGR ────────────────────────────────────────────────────────────────────

  addTicket: async (data) => {
    const { data: row, error } = await supabase
      .from('tickets')
      .insert({
        client_name:          data.clientName,
        contract_number:      data.contractNumber,
        phone:                data.phone,
        address:              data.address,
        sector_name:          data.sector,
        sector_id:            (data as Ticket & { sectorId?: string }).sectorId ?? null,
        category_label:       data.category,
        sub_category_label:   data.subCategory,
        severity:             data.severity,
        description:          data.description ?? null,
        status:               'nouveau',
        created_by:           data.createdBy,
        created_by_name:      data.createdBy,
        pre_check_mt:         data.preCheckMT,
        pre_check_programme:  data.preCheckProgramme,
      })
      .select('id')
      .single()
    if (error) throw error
    const newId = (row as Record<string, unknown>).id as string
    await get().refreshTicket(newId)
    // Notify EEP agents of the sector about the new ticket
    const eepIds = await getAccountsByRole('eep', (data as Ticket & { sectorId?: string }).sectorId)
    await notifyUsers(eepIds, 'info', 'Nouveau ticket', `Ticket ${newId} créé — ${data.category}`, newId)
    return newId
  },

  closeTicket: async (id, closure) => {
    await supabase.from('ticket_closures').insert({
      ticket_id:     id,
      closed_by:     closure.closedBy,
      client_called: closure.clientCalled,
      satisfaction:  closure.satisfaction ?? null,
      comments:      closure.comments ?? null,
    })
    await supabase.from('tickets').update({ status: 'ferme' }).eq('id', id)
    await get().refreshTicket(id)
  },

  // ── EEP ────────────────────────────────────────────────────────────────────

  markReadByEEP: async (id, agentId, agentName) => {
    const ticket = get().tickets.find((t) => t.id === id)
    if (ticket?.eepIntervention) {
      // Already has an intervention row — just update read_at
      await supabase
        .from('eep_interventions')
        .update({ read_at: new Date().toISOString() })
        .eq('ticket_id', id)
    } else {
      await supabase.from('eep_interventions').insert({
        ticket_id:  id,
        agent_id:   agentId,
        agent_name: agentName,
        read_at:    new Date().toISOString(),
        photos:     [],
      })
    }
    await supabase.from('tickets').update({ status: 'lu-eep' }).eq('id', id)
    await get().refreshTicket(id)
  },

  startEEP: async (id) => {
    await supabase
      .from('eep_interventions')
      .update({ started_at: new Date().toISOString() })
      .eq('ticket_id', id)
    await supabase.from('tickets').update({ status: 'en-cours-eep' }).eq('id', id)
    await get().refreshTicket(id)
  },

  resolveEEP: async (id, data) => {
    await supabase.from('eep_interventions').update({
      finished_at: new Date().toISOString(),
      actions:     data.actions,
      comments:    data.comments ?? null,
      photos:      data.photos ?? [],
      result:      'resolu',
    }).eq('ticket_id', id)
    await supabase.from('tickets').update({ status: 'resolu-eep' }).eq('id', id)
    await get().refreshTicket(id)
    const cgrIds = await getAccountsByRole('cgr')
    await notifyUsers(cgrIds, 'success', 'Ticket résolu', `Ticket ${id} résolu par l'équipe de permanance`, id)
  },

  referToSED: async (id, data) => {
    await supabase.from('eep_interventions').update({
      finished_at: new Date().toISOString(),
      actions:     data.actions,
      comments:    data.comments ?? null,
      photos:      data.photos ?? [],
      result:      'refere-sed',
    }).eq('ticket_id', id)
    await supabase.from('coordinator_approvals').insert({
      ticket_id:  id,
      referred_at: new Date().toISOString(),
    })
    await supabase.from('tickets').update({ status: 'attente-approbation' }).eq('id', id)
    await get().refreshTicket(id)
    const coordIds = await getAccountsByRole('coordinator')
    await notifyUsers(coordIds, 'warning', 'Approbation requise', `Ticket ${id} référé à SED — en attente d'approbation`, id)
  },

  // ── Coordinator ────────────────────────────────────────────────────────────

  approveTicket: async (id, coordinatorId, coordinatorName, comments) => {
    await supabase.from('coordinator_approvals').update({
      coordinator_id:   coordinatorId,
      coordinator_name: coordinatorName,
      reviewed_at:      new Date().toISOString(),
      decision:         'approuve',
      comments:         comments ?? null,
    }).eq('ticket_id', id)
    await supabase.from('sed_interventions').insert({
      ticket_id:   id,
      received_at: new Date().toISOString(),
      photos:      [],
    })
    await supabase.from('tickets').update({ status: 'approuve-sed' }).eq('id', id)
    await get().refreshTicket(id)
    const sedIds = await getAccountsByRole('sed')
    await notifyUsers(sedIds, 'info', 'Nouveau ticket SED', `Ticket ${id} approuvé et assigné à votre équipe`, id)
  },

  rejectTicket: async (id, coordinatorId, coordinatorName, comments) => {
    await supabase.from('coordinator_approvals').update({
      coordinator_id:   coordinatorId,
      coordinator_name: coordinatorName,
      reviewed_at:      new Date().toISOString(),
      decision:         'refuse',
      comments,
    }).eq('ticket_id', id)
    await supabase.from('tickets').update({ status: 'en-cours-eep' }).eq('id', id)
    await get().refreshTicket(id)
  },

  // ── SED ────────────────────────────────────────────────────────────────────

  startSED: async (id, agentId, agentName) => {
    await supabase.from('sed_interventions').update({
      agent_id:   agentId,
      agent_name: agentName,
      started_at: new Date().toISOString(),
    }).eq('ticket_id', id)
    await supabase.from('tickets').update({ status: 'en-cours-sed' }).eq('id', id)
    await get().refreshTicket(id)
  },

  suspendSED: async (id, reason) => {
    await supabase.from('sed_interventions').update({
      result:            'suspendu',
      suspension_reason: reason,
    }).eq('ticket_id', id)
    await supabase.from('tickets').update({ status: 'suspendu' }).eq('id', id)
    await get().refreshTicket(id)
  },

  scheduleSED: async (id, date, notes) => {
    await supabase.from('sed_interventions').update({
      result:         'programme',
      scheduled_date: date.toISOString(),
      comments:       notes || null,
    }).eq('ticket_id', id)
    await supabase.from('tickets').update({ status: 'programme' }).eq('id', id)
    await get().refreshTicket(id)
  },

  resolveSED: async (id, data) => {
    await supabase.from('sed_interventions').update({
      finished_at: new Date().toISOString(),
      result:      'resolu',
      report:      data.report,
      comments:    data.comments ?? null,
      photos:      data.photos ?? [],
    }).eq('ticket_id', id)
    await supabase.from('tickets').update({ status: 'resolu-sed' }).eq('id', id)
    await get().refreshTicket(id)
    const cgrIds2 = await getAccountsByRole('cgr')
    await notifyUsers(cgrIds2, 'success', 'Ticket résolu SED', `Ticket ${id} résolu par l'équipe SED`, id)
  },

  reset: () => set({ tickets: [], loading: false }),
}))
