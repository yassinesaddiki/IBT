import { useNavigate } from 'react-router-dom'
import { IconBell, IconBellOff, IconTicket } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { COLORS } from '../../design-system/tokens'
import { useNotificationStore } from '../../store/notificationStore'
import { useAuthStore } from '../../store/authStore'

const TYPE_STYLE = {
  info:    { bg: COLORS.semantic.info.bg,    text: COLORS.semantic.info.text,    border: COLORS.semantic.info.border!,  dot: COLORS.brand.blue },
  success: { bg: COLORS.semantic.success.bg, text: COLORS.semantic.success.text, border: '#BBF7D0', dot: COLORS.brand.green },
  warning: { bg: COLORS.severity.haute.bg,   text: COLORS.severity.haute.text,   border: COLORS.severity.haute.border,  dot: '#F97316' },
  danger:  { bg: COLORS.semantic.danger.bg,  text: COLORS.semantic.danger.text,  border: '#FECACA', dot: '#EF4444' },
} as const

export function NotificationsScreen() {
  const navigate = useNavigate()
  const user     = useAuthStore((s) => s.user)
  const { notifications, markRead, markAllRead } = useNotificationStore()

  const unread = notifications.filter((n) => !n.read).length

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Centre de Gestion des Réclamations" />

      <div style={{ paddingTop: '24px', maxWidth: '720px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IconBell size={22} color={COLORS.brand.blue} />
              Notifications
              {unread > 0 && (
                <span style={{ background: '#EF4444', color: '#fff', fontSize: '11px', fontWeight: 500, padding: '2px 7px', borderRadius: '10px' }}>
                  {unread} non lue{unread > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '4px' }}>
              Alertes et mises à jour sur vos tickets
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {unread > 0 && (
              <button onClick={() => markAllRead(user?.id ?? '')} style={{ height: '34px', background: COLORS.bg.surface, color: COLORS.text.secondary, border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', fontSize: '12px', cursor: 'pointer', padding: '0 14px', fontFamily: 'inherit' }}>
                Tout marquer comme lu
              </button>
            )}
            <button onClick={() => navigate('/cgr/dashboard')} style={{ height: '34px', background: COLORS.bg.surface, color: COLORS.text.secondary, border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', fontSize: '12px', cursor: 'pointer', padding: '0 14px', fontFamily: 'inherit' }}>
              ← Tableau de bord
            </button>
          </div>
        </div>

        {/* Notifications list */}
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: COLORS.text.muted }}>
            <IconBellOff size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <div style={{ fontSize: '14px' }}>Aucune notification</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.map((n) => {
              const s = TYPE_STYLE[n.type]
              return (
                <div
                  key={n.id}
                  className="animate-up"
                  onClick={() => { markRead(n.id); if (n.ticketId) navigate(`/cgr/ticket/${n.ticketId}`) }}
                  style={{
                    background: n.read ? COLORS.bg.surface : s.bg,
                    border: `0.5px solid ${n.read ? COLORS.border.default : s.border}`,
                    borderRadius: '12px', padding: '14px 16px', cursor: n.ticketId ? 'pointer' : 'default',
                    display: 'flex', gap: '12px', alignItems: 'flex-start',
                    transition: 'background .15s',
                  }}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: n.read ? COLORS.bg.page : s.bg, border: `0.5px solid ${n.read ? COLORS.border.default : s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.read ? COLORS.text.muted : s.dot }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: n.read ? 400 : 500, color: n.read ? COLORS.text.secondary : s.text }}>{n.title}</span>
                      <span style={{ fontSize: '11px', color: COLORS.text.muted, whiteSpace: 'nowrap', flexShrink: 0 }}>{n.time}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: COLORS.text.secondary, lineHeight: 1.6 }}>{n.message}</div>
                    {n.ticketId && (
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: COLORS.brand.blue, fontWeight: 500 }}>
                        <IconTicket size={12} /> Voir le ticket {n.ticketId}
                      </div>
                    )}
                  </div>
                  {!n.read && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: s.dot, flexShrink: 0, marginTop: '4px' }} />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
