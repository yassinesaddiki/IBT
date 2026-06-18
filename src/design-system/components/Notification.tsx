import { COLORS } from '../tokens'

interface NotificationProps {
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'danger'
  time?: string
}

const TYPE_COLORS = {
  info:    { bg: COLORS.semantic.info.bg,    text: COLORS.semantic.info.text,    border: COLORS.semantic.info.border! },
  success: { bg: COLORS.semantic.success.bg, text: COLORS.semantic.success.text, border: '#BBF7D0' },
  warning: { bg: COLORS.semantic.warning.bg, text: COLORS.semantic.warning.text, border: '#FEF08A' },
  danger:  { bg: COLORS.semantic.danger.bg,  text: COLORS.semantic.danger.text,  border: '#FECACA' },
} as const

type NotifType = keyof typeof TYPE_COLORS

export function Notification({ title, message, type = 'info', time }: NotificationProps) {
  const c = TYPE_COLORS[type as NotifType]
  return (
    <div
      style={{
        background: c.bg,
        border: `0.5px solid ${c.border}`,
        borderRadius: '10px',
        padding: '12px 14px',
        marginBottom: '8px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: c.text }}>{title}</span>
        {time && <span style={{ fontSize: '11px', color: COLORS.text.muted }}>{time}</span>}
      </div>
      <p style={{ fontSize: '12px', color: COLORS.text.secondary, margin: 0, lineHeight: 1.5 }}>{message}</p>
    </div>
  )
}
