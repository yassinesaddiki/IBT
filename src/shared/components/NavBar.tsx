import { useNavigate } from 'react-router-dom'
import { IconBolt, IconBell, IconLogout } from '@tabler/icons-react'
import { useAuthStore } from '../../store/authStore'
import { useEmployeeStore } from '../../store/employeeStore'
import { useNotificationStore } from '../../store/notificationStore'
import { COLORS } from '../../design-system/tokens'

const NOTIF_ROUTE: Record<string, string> = {
  cgr:         '/cgr/notifications',
  coordinator: '/coordinator/notifications',
  observer:    '/observer/notifications',
}

interface NavBarProps {
  ctaLabel?:   string
  onCtaClick?: () => void
  title?:      string
}

export function NavBar({ ctaLabel, onCtaClick, title }: NavBarProps) {
  const user          = useAuthStore((s) => s.user)
  const logout        = useAuthStore((s) => s.logout)
  const navigate      = useNavigate()
  const employees     = useEmployeeStore((s) => s.employees)
  const notifications = useNotificationStore((s) => s.notifications)

  const myEmployee = user?.employeeId ? employees.find((e) => e.id === user.employeeId) : undefined
  const avatarUrl  = myEmployee?.avatarUrl
  const unread     = notifications.filter((n) => !n.read).length
  const notifRoute = user?.role ? (NOTIF_ROUTE[user.role] ?? null) : null

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav
      style={{
        background: COLORS.brand.blue,
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '16px',
        justifyContent: 'space-between',
        borderRadius: '14px 14px 0 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '28px', height: '28px', background: COLORS.brand.green,
          borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <IconBolt size={16} color="#fff" />
        </div>
        <span style={{ color: '#fff', fontSize: '14px', fontWeight: 500, letterSpacing: '.05em' }}>IBT</span>
        {title && (
          <>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>|</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{title}</span>
          </>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {ctaLabel && onCtaClick && (
          <button
            onClick={onCtaClick}
            style={{
              height: '34px', background: COLORS.brand.green, color: '#fff',
              border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', padding: '0 14px', display: 'inline-flex',
              alignItems: 'center', gap: '6px', fontFamily: 'inherit',
            }}
          >
            {ctaLabel}
          </button>
        )}

        {/* Bell — real unread count, clickable */}
        <div
          onClick={() => notifRoute && navigate(notifRoute)}
          style={{ position: 'relative', cursor: notifRoute ? 'pointer' : 'default' }}
        >
          <IconBell size={20} color="rgba(255,255,255,0.7)" />
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: '-4px', right: '-5px',
              minWidth: '16px', height: '16px', background: '#EF4444',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 500,
              padding: '0 3px',
            }}>
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </div>

        {/* Avatar + name → profile */}
        <div
          onClick={() => user?.employeeId && navigate(`/employee/${user.employeeId}`)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: user?.employeeId ? 'pointer' : 'default', padding: '4px 6px', borderRadius: '8px' }}
          onMouseEnter={(e) => { if (user?.employeeId) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 500, color: '#fff', flexShrink: 0,
            overflow: 'hidden',
          }}>
            {avatarUrl
              ? <img src={avatarUrl} alt={user?.initials ?? '?'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (user?.initials ?? '?')}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>{user?.name}</span>
        </div>

        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)' }} />

        <button
          onClick={handleLogout}
          title="Se déconnecter"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', padding: '4px',
          }}
        >
          <IconLogout size={18} />
        </button>
      </div>
    </nav>
  )
}
