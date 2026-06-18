import { IconEye, IconTicket, IconCircleCheck, IconUsers, IconClock } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { StatusBadge } from '../../design-system/components/Badge'
import { SeverityBadge } from '../../design-system/components/Badge'
import { Card } from '../../design-system/components/Card'
import { COLORS } from '../../design-system/tokens'
import { useTickets } from '../../shared/hooks/useTickets'
import { DUTY_SCHEDULE, SECTORS } from '../../mock-data/duty-schedule'
import { formatElapsed } from '../../shared/utils/formatDate'

export function ObserverDashboard() {
  const { tickets } = useTickets()

  const kpi = {
    total:   tickets.length,
    ouverts: tickets.filter((t) => t.status !== 'ferme').length,
    fermes:  tickets.filter((t) => t.status === 'ferme').length,
    agents:  DUTY_SCHEDULE.length,
  }

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Observateur — Vue Lecture Seule" />

      <div style={{ paddingTop: '24px' }}>

        {/* Read-only notice */}
        <div style={{ background: COLORS.semantic.info.bg, border: `0.5px solid ${COLORS.semantic.info.border}`, borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconEye size={16} color={COLORS.semantic.info.text} />
          <span style={{ fontSize: '13px', color: COLORS.semantic.info.text }}>Mode lecture seule — Aucune action disponible sur cet espace</span>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '18px', fontWeight: 500, color: COLORS.text.primary }}>Vue d'ensemble</div>
          <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '2px' }}>Tableau de bord en temps réel</div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }} className="obs-kpi">
          <KpiCard icon={<IconTicket size={18} color="#1A3A72" />} iconBg={COLORS.semantic.info.bg} label="Tickets total" value={kpi.total} />
          <KpiCard icon={<IconClock size={18} color="#854D0E" />} iconBg={COLORS.severity.moyenne.bg} label="Tickets ouverts" value={kpi.ouverts} />
          <KpiCard icon={<IconCircleCheck size={18} color="#166534" />} iconBg={COLORS.semantic.success.bg} label="Fermés définitivement" value={kpi.fermes} />
          <KpiCard icon={<IconUsers size={18} color="#1A3A72" />} iconBg={COLORS.semantic.info.bg} label="Agents de garde" value={kpi.agents} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }} className="obs-layout">

          {/* Ticket list (read-only) */}
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

          {/* Duty schedule */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Card>
              <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '14px' }}>Planning de garde — Semaine 25</div>
              {SECTORS.map((sector) => (
                <div key={sector} style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '8px' }}>{sector}</div>
                  {DUTY_SCHEDULE.filter((a) => a.sector === sector).map((agent) => (
                    <div key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 8px', background: COLORS.bg.panel, borderRadius: '8px', marginBottom: '5px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: COLORS.semantic.info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 500, color: COLORS.semantic.info.text, flexShrink: 0 }}>
                        {agent.initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.primary }}>{agent.name}</div>
                        <div style={{ fontSize: '10px', color: COLORS.text.secondary }}>{agent.phone}</div>
                      </div>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: agent.online ? COLORS.brand.green : COLORS.text.muted, flexShrink: 0 }} />
                    </div>
                  ))}
                </div>
              ))}
            </Card>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) { .obs-layout { grid-template-columns: 1fr !important; } }
        @media (max-width: 800px)  { .obs-kpi    { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  )
}

function KpiCard({ icon, iconBg, label, value }: { icon: React.ReactNode; iconBg: string; label: string; value: number }) {
  return (
    <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '12px', border: `0.5px solid ${COLORS.border.default}`, padding: '18px 20px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>{icon}</div>
      <div style={{ fontSize: '12px', color: COLORS.text.secondary, marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 500, color: COLORS.text.primary, lineHeight: 1 }}>{value}</div>
    </div>
  )
}
