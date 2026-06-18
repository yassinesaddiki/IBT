import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconBellOff, IconTicket } from '@tabler/icons-react'
import { MobileLayout } from '../../shared/components/MobileLayout'
import { COLORS } from '../../design-system/tokens'
import { MOCK_NOTIFICATIONS } from '../../mock-data/notifications'

const TYPE_DOT: Record<string, string> = {
  info: COLORS.brand.blue, success: COLORS.brand.green, warning: '#F97316', danger: '#EF4444',
}
const TYPE_BG: Record<string, string> = {
  info: COLORS.semantic.info.bg, success: COLORS.semantic.success.bg, warning: '#FFF7ED', danger: COLORS.semantic.danger.bg,
}
const TYPE_TEXT: Record<string, string> = {
  info: COLORS.semantic.info.text, success: COLORS.semantic.success.text, warning: '#C2410C', danger: COLORS.semantic.danger.text,
}

export function SEDNotifications() {
  const navigate = useNavigate()
  const sed = MOCK_NOTIFICATIONS.filter((n) => n.roles.includes('sed'))
  const [items, setItems] = useState(sed)
  const unread = items.filter((n) => !n.read).length

  const markRead = (id: string) => setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))

  return (
    <MobileLayout title={`Notifications${unread > 0 ? ` (${unread})` : ''}`}>
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: COLORS.text.muted }}>
          <IconBellOff size={32} style={{ marginBottom: '10px', opacity: 0.3 }} />
          <div style={{ fontSize: '13px' }}>Aucune notification</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map((n) => (
            <div
              key={n.id}
              onClick={() => { markRead(n.id); if (n.ticketId) navigate(`/sed/ticket/${n.ticketId}`) }}
              style={{
                background: n.read ? COLORS.bg.surface : TYPE_BG[n.type],
                borderRadius: '12px', padding: '12px 14px', cursor: 'pointer',
                border: `0.5px solid ${n.read ? COLORS.border.default : '#E5E7EB'}`,
                display: 'flex', gap: '10px', alignItems: 'flex-start',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.read ? COLORS.text.muted : TYPE_DOT[n.type], flexShrink: 0, marginTop: '4px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', marginBottom: '3px' }}>
                  <span style={{ fontSize: '13px', fontWeight: n.read ? 400 : 500, color: n.read ? COLORS.text.secondary : TYPE_TEXT[n.type] }}>{n.title}</span>
                  <span style={{ fontSize: '10px', color: COLORS.text.muted, whiteSpace: 'nowrap', flexShrink: 0 }}>{n.time}</span>
                </div>
                <div style={{ fontSize: '12px', color: COLORS.text.secondary, lineHeight: 1.5 }}>{n.message}</div>
                {n.ticketId && (
                  <div style={{ marginTop: '4px', fontSize: '11px', color: COLORS.brand.blue, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <IconTicket size={11} /> {n.ticketId}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </MobileLayout>
  )
}
