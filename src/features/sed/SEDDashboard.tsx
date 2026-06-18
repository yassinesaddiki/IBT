import { useNavigate } from 'react-router-dom'
import { IconBolt, IconBell, IconAlertTriangle, IconChevronRight } from '@tabler/icons-react'
import { COLORS } from '../../design-system/tokens'
import { useAuth } from '../../shared/hooks/useAuth'
import { useTickets } from '../../shared/hooks/useTickets'
import { StatusBadge } from '../../design-system/components/Badge'
import { SeverityBadge } from '../../design-system/components/Badge'
import { formatElapsed } from '../../shared/utils/formatDate'

export function SEDDashboard() {
  const { user, logout } = useAuth()
  const { tickets }      = useTickets()
  const navigate         = useNavigate()

  const sedTickets = tickets.filter((t) =>
    t.status === 'approuve-sed' || t.status === 'en-cours-sed' ||
    t.status === 'suspendu' || t.status === 'programme'
  )

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', background: '#1A1A2E', padding: '20px 0' }}>
      <div style={{ width: '375px', borderRadius: '36px', overflow: 'hidden', border: '10px solid #2A2A3E', background: COLORS.bg.page }}>

        {/* Status bar */}
        <div style={{ background: COLORS.brand.blue, height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <span style={{ color: '#fff', fontSize: '12px', fontWeight: 500 }}>09:41</span>
          <div style={{ color: '#fff', fontSize: '12px' }}>▲ 🔋</div>
        </div>

        {/* Header */}
        <div style={{ background: COLORS.brand.blue, padding: '12px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: COLORS.brand.green, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconBolt size={18} color="#fff" />
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>IBT · SED</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>Service Exploitation & Distribution</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <IconBell size={22} color="rgba(255,255,255,0.8)" />
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 500, color: '#fff', cursor: 'pointer' }}
              onClick={logout}>
              {user?.initials ?? '?'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px', minHeight: '600px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 500, color: COLORS.text.primary }}>Interventions SED</div>
            <div style={{ fontSize: '12px', color: COLORS.text.secondary }}>Tickets approuvés et assignés à l'équipe SED</div>
          </div>

          {sedTickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px', color: COLORS.text.muted }}>
              <IconAlertTriangle size={32} style={{ marginBottom: '8px', opacity: 0.4 }} />
              <div style={{ fontSize: '13px' }}>Aucun ticket SED actif</div>
            </div>
          ) : sedTickets.map((ticket) => (
            <div key={ticket.id} onClick={() => navigate(`/sed/ticket/${ticket.id}`)} className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', padding: '14px', border: `0.5px solid ${COLORS.border.default}`, marginBottom: '10px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', color: COLORS.text.secondary, marginBottom: '2px' }}>#{ticket.id}</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{ticket.clientName}</div>
                </div>
                <SeverityBadge severity={ticket.severity} />
              </div>
              <div style={{ fontSize: '12px', color: '#374151', marginBottom: '6px' }}>{ticket.subCategory}</div>
              <div style={{ fontSize: '11px', color: COLORS.text.secondary, marginBottom: '10px' }}>📍 {ticket.address}</div>
              {ticket.eepIntervention?.actions && (
                <div style={{ background: COLORS.semantic.info.bg, border: `0.5px solid ${COLORS.semantic.info.border}`, borderRadius: '8px', padding: '8px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 500, color: COLORS.semantic.info.text, marginBottom: '3px' }}>RAPPORT EEP</div>
                  <div style={{ fontSize: '11px', color: COLORS.semantic.info.text }}>{ticket.eepIntervention.actions}</div>
                </div>
              )}
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

        {/* Bottom action */}
        <div style={{ padding: '12px 16px 24px', background: COLORS.bg.page }}>
          <button style={{ width: '100%', height: '52px', background: COLORS.brand.blue, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            Mettre à jour le statut
          </button>
        </div>
      </div>
    </div>
  )
}
