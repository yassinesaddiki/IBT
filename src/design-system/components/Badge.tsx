import { COLORS } from '../tokens'
import { STATUS_LABELS } from '../../shared/types/status'
import type { TicketStatus } from '../../shared/types/status'
import type { Severity } from '../../shared/types/ticket'
import { getStatusColor, getSeverityColor } from '../../shared/utils/getStatusColor'

interface BadgeProps {
  label: string
  bg: string
  text: string
  border: string
  dot?: string
}

function Badge({ label, bg, text, border, dot }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 9px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 500,
        background: bg,
        color: text,
        border: `0.5px solid ${border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {dot && (
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: dot,
            flexShrink: 0,
          }}
        />
      )}
      {label}
    </span>
  )
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  const c = getStatusColor(status)
  return <Badge label={STATUS_LABELS[status]} bg={c.bg} text={c.text} border={c.border} dot={c.dot} />
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const c = getSeverityColor(severity)
  return <Badge label={severity} bg={c.bg} text={c.text} border={c.border} dot={c.dot} />
}

export function RoleBadge({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        background: COLORS.semantic.info.bg,
        color: COLORS.semantic.info.text,
        fontSize: '11px',
        fontWeight: 500,
        padding: '4px 10px',
        borderRadius: '20px',
        marginBottom: '22px',
        border: `0.5px solid ${COLORS.semantic.info.border}`,
      }}
    >
      {icon}
      {label}
    </div>
  )
}
