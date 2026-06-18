import { useNavigate, useLocation } from 'react-router-dom'
import { COLORS } from '../../design-system/tokens'

export interface SubNavLink {
  label: string
  path: string
  badge?: number
  icon?: string
}

export function SubNav({ links }: { links: SubNavLink[] }) {
  const navigate  = useNavigate()
  const { pathname } = useLocation()

  return (
    <div
      style={{
        background: COLORS.bg.surface,
        borderBottom: `0.5px solid ${COLORS.border.default}`,
        padding: '0 24px',
        display: 'flex',
        gap: '4px',
        overflowX: 'auto',
      }}
    >
      {links.map((link) => {
        const active = pathname === link.path || pathname.startsWith(link.path + '/')
        return (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              height: '44px',
              padding: '0 14px',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${active ? COLORS.brand.blue : 'transparent'}`,
              color: active ? COLORS.brand.blue : COLORS.text.secondary,
              fontSize: '13px',
              fontWeight: active ? 500 : 400,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color .15s',
              flexShrink: 0,
            }}
          >
            {link.icon && <span style={{ fontSize: '15px' }}>{link.icon}</span>}
            {link.label}
            {link.badge !== undefined && link.badge > 0 && (
              <span style={{
                background: '#EF4444', color: '#fff',
                fontSize: '10px', fontWeight: 500,
                padding: '1px 5px', borderRadius: '10px',
                minWidth: '16px', textAlign: 'center',
              }}>
                {link.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
