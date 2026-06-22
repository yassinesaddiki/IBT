import { useNavigate } from 'react-router-dom'
import { IconTicket, IconClockPause, IconCircleCheck, IconUsers, IconCalendarEvent } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { SubNav } from '../../shared/components/SubNav'
import { COORDINATOR_NAV } from './coordinatorNav'
import { StatusBadge } from '../../design-system/components/Badge'
import { SeverityBadge } from '../../design-system/components/Badge'
import { Card } from '../../design-system/components/Card'
import { COLORS } from '../../design-system/tokens'
import { useTickets } from '../../shared/hooks/useTickets'
import { useTicketStore } from '../../store/ticketStore'
import { EmployeeChip } from '../../shared/components/EmployeeChip'
import { useCurrentDuty } from '../../shared/hooks/useDutyAgents'
import { useDutyStore } from '../../store/dutyStore'
import { formatElapsed } from '../../shared/utils/formatDate'

export function CoordinatorDashboard() {
  const { tickets }  = useTickets()
  const navigate     = useNavigate()
  const initTickets  = useTicketStore((s) => s.init)
  const tickLoading  = useTicketStore((s) => s.loading)
  const currentDuty  = useCurrentDuty()
  const dutyLoading  = useDutyStore((s) => s.loading)
  const totalDutyAgents = currentDuty.reduce((n, sd) => n + sd.agents.length, 0)

  const kpi = {
    total:   tickets.length,
    attente: tickets.filter((t) => t.status === 'attente-approbation').length,
    resolus: tickets.filter((t) => t.status === 'resolu-eep' || t.status === 'resolu-sed' || t.status === 'ferme').length,
    agents:  totalDutyAgents,
  }

  const pendingApproval = tickets.filter((t) => t.status === 'attente-approbation')

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Coordinateur" />
      <SubNav links={COORDINATOR_NAV(kpi.attente)} />

      <div style={{ paddingTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 500, color: COLORS.text.primary }}>Tableau de bord Coordinateur</div>
            <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '2px' }}>Vue globale · Gestion et approbations</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => void initTickets()} disabled={tickLoading} style={{ height: '36px', background: COLORS.bg.surface, color: COLORS.text.secondary, border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: tickLoading ? 'wait' : 'pointer', padding: '0 14px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' }}>
              {tickLoading ? 'Chargement…' : 'Actualiser'}
            </button>
            <button onClick={() => navigate('/coordinator/planning')} style={{ height: '36px', background: COLORS.bg.surface, color: COLORS.brand.blue, border: `0.5px solid ${COLORS.brand.blue}`, borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '0 14px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' }}>
              <IconCalendarEvent size={15} /> Planning de garde
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }} className="coord-kpi">
          <KpiCard icon={<IconTicket size={18} color="#1A3A72" />} iconBg={COLORS.semantic.info.bg} label="Tickets total" value={kpi.total} />
          <KpiCard icon={<IconClockPause size={18} color="#C2410C" />} iconBg={COLORS.severity.haute.bg} label="En att. approbation" value={kpi.attente} highlight />
          <KpiCard icon={<IconCircleCheck size={18} color="#166534" />} iconBg={COLORS.semantic.success.bg} label="Résolus / Fermés" value={kpi.resolus} />
          <KpiCard icon={<IconUsers size={18} color="#5B21B6" />} iconBg={COLORS.status.programme.bg} label="Agents en ligne" value={kpi.agents} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }} className="coord-layout">
          <div>

            {/* Pending approvals */}
            {pendingApproval.length > 0 && (
              <Card style={{ marginBottom: '20px', border: `0.5px solid ${COLORS.severity.haute.border}` }}>
                <div style={{ fontSize: '15px', fontWeight: 500, color: COLORS.severity.haute.text, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⏳ Approbations en attente ({pendingApproval.length})
                </div>
                {pendingApproval.map((ticket) => (
                  <div key={ticket.id} style={{ background: COLORS.severity.haute.bg, border: `0.5px solid ${COLORS.severity.haute.border}`, borderRadius: '10px', padding: '14px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#92400E' }}>#{ticket.id}</span>
                      <SeverityBadge severity={ticket.severity} />
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '4px' }}>{ticket.clientName}</div>
                    <div style={{ fontSize: '12px', color: COLORS.text.secondary, marginBottom: '12px' }}>{ticket.subCategory} · {ticket.sector}</div>
                    {ticket.eepIntervention?.actions && (
                      <div style={{ fontSize: '12px', color: '#374151', marginBottom: '12px', lineHeight: 1.5 }}>
                        <strong>Rapport EEP :</strong> {ticket.eepIntervention.actions}
                      </div>
                    )}
                    <button
                      onClick={() => navigate(`/coordinator/ticket/${ticket.id}/approbation`)}
                      style={{ width: '100%', height: '36px', background: COLORS.brand.blue, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Examiner et décider →
                    </button>
                  </div>
                ))}
              </Card>
            )}

            {/* All tickets */}
            <Card>
              <div style={{ fontSize: '15px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '16px' }}>Tous les tickets</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: COLORS.bg.panel }}>
                      {['N° Ticket', 'Client', 'Problème', 'Sévérité', 'Secteur', 'Statut', 'Durée'].map((h) => (
                        <th key={h} style={{ padding: '10px 12px', fontSize: '11px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} style={{ borderBottom: `0.5px solid #F5F5F5` }}>
                        <td style={{ padding: '12px', fontSize: '12px', fontFamily: 'monospace', color: COLORS.text.secondary }}>#{ticket.id}</td>
                        <td style={{ padding: '12px 8px', fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{ticket.clientName}</td>
                        <td style={{ padding: '12px 8px', fontSize: '13px', color: '#374151' }}>{ticket.subCategory}</td>
                        <td style={{ padding: '12px 8px' }}><SeverityBadge severity={ticket.severity} /></td>
                        <td style={{ padding: '12px 8px', fontSize: '13px', color: COLORS.text.secondary }}>{ticket.sector}</td>
                        <td style={{ padding: '12px 8px' }}><StatusBadge status={ticket.status} /></td>
                        <td style={{ padding: '12px 8px', fontSize: '12px', color: COLORS.text.muted }}>{formatElapsed(ticket.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Card>
              <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '14px' }}>Équipe de garde</div>
              {dutyLoading && <div style={{ fontSize: '12px', color: COLORS.text.secondary, padding: '8px 0' }}>Chargement…</div>}
              {!dutyLoading && currentDuty.map((sd) => (
                <div key={sd.sectorId} style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '8px' }}>{sd.sectorName}</div>
                  {sd.agents.length === 0 && <div style={{ fontSize: '11px', color: COLORS.text.muted, fontStyle: 'italic' }}>Aucun agent assigné</div>}
                  {sd.agents.map(({ employee: emp }) => (
                    <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 8px', background: COLORS.bg.panel, borderRadius: '8px', marginBottom: '5px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: COLORS.semantic.info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 500, color: COLORS.semantic.info.text, flexShrink: 0, overflow: 'hidden' }}>
                        {emp.avatarUrl
                          ? <img src={emp.avatarUrl} alt={emp.initials} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : emp.initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <EmployeeChip empId={emp.id} name={emp.name} matricule={emp.matricule} variant="block" />
                        <div style={{ fontSize: '10px', color: COLORS.text.secondary, marginTop: '1px' }}>{emp.phone}</div>
                      </div>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: COLORS.brand.green, flexShrink: 0 }} />
                    </div>
                  ))}
                </div>
              ))}
            </Card>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) { .coord-layout { grid-template-columns: 1fr !important; } }
        @media (max-width: 800px)  { .coord-kpi    { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  )
}

function KpiCard({ icon, iconBg, label, value, highlight }: {
  icon: React.ReactNode; iconBg: string; label: string; value: number; highlight?: boolean
}) {
  return (
    <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '12px', border: `0.5px solid ${highlight ? COLORS.severity.haute.border : COLORS.border.default}`, padding: '18px 20px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>{icon}</div>
      <div style={{ fontSize: '12px', color: COLORS.text.secondary, marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 500, color: highlight ? COLORS.severity.haute.text : COLORS.text.primary, lineHeight: 1 }}>{value}</div>
    </div>
  )
}
