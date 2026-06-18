import { useNavigate } from 'react-router-dom'
import { IconBolt, IconBell, IconTicket, IconClock, IconCircleCheck, IconChevronRight } from '@tabler/icons-react'
import { COLORS } from '../../design-system/tokens'
import { useAuth } from '../../shared/hooks/useAuth'
import { useTickets } from '../../shared/hooks/useTickets'
import { StatusBadge } from '../../design-system/components/Badge'
import { SeverityBadge } from '../../design-system/components/Badge'
import { formatElapsed } from '../../shared/utils/formatDate'

export function EEPDashboard() {
  const { user, logout } = useAuth()
  const { tickets }      = useTickets()
  const navigate         = useNavigate()

  const myTickets = tickets.filter((t) =>
    t.sector === user?.sector &&
    t.status !== 'ferme' &&
    t.status !== 'resolu-sed'
  )

  const stats = {
    total:    myTickets.length,
    enCours:  myTickets.filter((t) => t.status === 'en-cours-eep').length,
    resolus:  tickets.filter((t) => t.eepIntervention?.agentName === user?.name && t.status === 'resolu-eep').length,
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', background: '#1A1A2E', padding: '20px 0' }}>
      <div style={{ width: '375px', borderRadius: '36px', overflow: 'hidden', border: '10px solid #2A2A3E', background: COLORS.bg.page }}>

        {/* Status bar */}
        <div style={{ background: COLORS.brand.blue, height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <span style={{ color: '#fff', fontSize: '12px', fontWeight: 500 }}>09:41</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', color: '#fff', fontSize: '12px' }}>
            ▲ 🔋
          </div>
        </div>

        {/* App header */}
        <div style={{ background: COLORS.brand.blue, padding: '12px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: COLORS.brand.green, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconBolt size={18} color="#fff" />
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>IBT · EEP</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>{user?.sector ?? 'Équipe terrain'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <IconBell size={22} color="rgba(255,255,255,0.8)" />
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', background: '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#fff', fontWeight: 500 }}>2</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 500, color: '#fff', cursor: 'pointer' }}
              onClick={logout}>
              {user?.initials ?? '?'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px', minHeight: '600px' }}>

          {/* Greeting */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 500, color: COLORS.text.primary }}>Bonjour, {user?.name?.split(' ')[0]} 👋</div>
            <div style={{ fontSize: '12px', color: COLORS.text.secondary }}>Voici vos interventions du jour</div>
          </div>

          {/* Mini stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '16px' }}>
            <MiniStat icon={<IconTicket size={16} color="#1A3A72" />} iconBg={COLORS.semantic.info.bg} value={stats.total} label="Assignés" />
            <MiniStat icon={<IconClock size={16} color="#854D0E" />} iconBg={COLORS.severity.moyenne.bg} value={stats.enCours} label="En cours" />
            <MiniStat icon={<IconCircleCheck size={16} color="#166534" />} iconBg={COLORS.semantic.success.bg} value={stats.resolus} label="Résolus" />
          </div>

          {/* Ticket list */}
          <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '10px' }}>Mes tickets actifs</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myTickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: COLORS.text.muted, fontSize: '13px' }}>Aucun ticket actif</div>
            ) : myTickets.slice(0, 6).map((ticket) => (
              <div
                key={ticket.id}
                className="animate-up"
                onClick={() => navigate(`/eep/ticket/${ticket.id}`)}
                style={{ background: COLORS.bg.surface, borderRadius: '14px', padding: '14px', border: `0.5px solid ${COLORS.border.default}`, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: COLORS.text.secondary, marginBottom: '2px' }}>#{ticket.id}</div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{ticket.clientName}</div>
                  </div>
                  <SeverityBadge severity={ticket.severity} />
                </div>
                <div style={{ fontSize: '12px', color: '#374151', marginBottom: '8px' }}>{ticket.subCategory}</div>
                <div style={{ fontSize: '11px', color: COLORS.text.secondary, marginBottom: '10px' }}>📍 {ticket.address}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <StatusBadge status={ticket.status} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: COLORS.text.muted }}>{formatElapsed(ticket.createdAt)}</span>
                    <IconChevronRight size={14} color={COLORS.text.muted} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom action */}
        <div style={{ padding: '12px 16px 24px', background: COLORS.bg.page }}>
          <button style={{ width: '100%', height: '52px', background: COLORS.brand.blue, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            Mettre à jour un ticket
          </button>
        </div>
      </div>
    </div>
  )
}

function MiniStat({ icon, iconBg, value, label }: { icon: React.ReactNode; iconBg: string; value: number; label: string }) {
  return (
    <div style={{ background: COLORS.bg.surface, borderRadius: '10px', border: `0.5px solid ${COLORS.border.default}`, padding: '10px', textAlign: 'center' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>{icon}</div>
      <div style={{ fontSize: '18px', fontWeight: 500, color: COLORS.text.primary }}>{value}</div>
      <div style={{ fontSize: '10px', color: COLORS.text.secondary }}>{label}</div>
    </div>
  )
}
