import { useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconBell } from '@tabler/icons-react'
import { COLORS } from '../../design-system/tokens'

interface MobileLayoutProps {
  title: string
  children: React.ReactNode
  bottomAction?: React.ReactNode
  onBack?: () => void
  notifCount?: number
  headerRight?: React.ReactNode
}

export function MobileLayout({
  title,
  children,
  bottomAction,
  onBack,
  notifCount = 0,
  headerRight,
}: MobileLayoutProps) {
  const navigate = useNavigate()
  const goBack   = onBack ?? (() => navigate(-1))

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        background: '#1A1A2E',
        padding: '20px 0',
      }}
    >
      <div
        style={{
          width: '375px',
          maxWidth: '100vw',
          borderRadius: '36px',
          overflow: 'hidden',
          border: '10px solid #2A2A3E',
          background: COLORS.bg.page,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Status bar */}
        <div
          style={{
            background: COLORS.brand.blue,
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            flexShrink: 0,
          }}
        >
          <span style={{ color: '#fff', fontSize: '12px', fontWeight: 500 }}>09:41</span>
          <div style={{ color: '#fff', fontSize: '11px' }}>▲ 🔋</div>
        </div>

        {/* App header */}
        <div
          style={{
            background: COLORS.brand.blue,
            padding: '10px 16px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0,
          }}
        >
          <button
            onClick={goBack}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <IconArrowLeft size={18} color="#fff" />
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: '#fff',
                fontSize: '14px',
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </div>
          </div>

          {headerRight ?? (
            <div style={{ position: 'relative' }}>
              <IconBell size={22} color="rgba(255,255,255,0.8)" />
              {notifCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '14px',
                    height: '14px',
                    background: '#EF4444',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '8px',
                    color: '#fff',
                    fontWeight: 500,
                  }}
                >
                  {notifCount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {children}
        </div>

        {/* Bottom action */}
        {bottomAction && (
          <div
            style={{
              padding: '12px 16px 24px',
              background: COLORS.bg.page,
              borderTop: `0.5px solid ${COLORS.border.default}`,
              flexShrink: 0,
            }}
          >
            {bottomAction}
          </div>
        )}
      </div>

      {/* On real phones, remove the frame */}
      <style>{`
        @media (max-width: 430px) {
          .mobile-device-frame {
            border-radius: 0 !important;
            border: none !important;
            width: 100vw !important;
          }
        }
      `}</style>
    </div>
  )
}
