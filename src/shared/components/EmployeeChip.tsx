import { useNavigate } from 'react-router-dom'
import { COLORS } from '../../design-system/tokens'

interface Props {
  /** Employee id — used for navigation to /employee/:id */
  empId?:      string
  name:        string
  matricule?:  string
  /** Show as inline text (for inside sentences) vs block card style */
  variant?:    'block' | 'inline'
  /** If true, renders as a non-clickable display */
  readOnly?:   boolean
  /** Show the small avatar circle with initials */
  showAvatar?: boolean
  avatarUrl?:  string
  initials?:   string
}

/**
 * Displays an employee name always paired with their matricule.
 * Clickable → navigates to /employee/:id.
 * Use this everywhere an agent name appears.
 */
export function EmployeeChip({
  empId, name, matricule, variant = 'block', readOnly = false,
  showAvatar = false, avatarUrl, initials,
}: Props) {
  const navigate  = useNavigate()
  const clickable = !readOnly && !!empId

  if (variant === 'inline') {
    return (
      <span
        onClick={clickable ? () => navigate(`/employee/${empId}`) : undefined}
        style={{
          display:    'inline-flex',
          alignItems: 'baseline',
          gap:        '6px',
          cursor:     clickable ? 'pointer' : 'default',
        }}
      >
        <span style={{
          color:      clickable ? COLORS.brand.blue : COLORS.text.primary,
          fontWeight: 500,
          fontSize:   'inherit',
          textDecoration: clickable ? 'underline dotted' : 'none',
          textUnderlineOffset: '2px',
        }}>
          {name}
        </span>
        {matricule && (
          <span style={{ fontSize: '11px', color: COLORS.text.muted, fontFamily: 'monospace' }}>
            {matricule}
          </span>
        )}
      </span>
    )
  }

  // Block variant
  return (
    <div
      onClick={clickable ? () => navigate(`/employee/${empId}`) : undefined}
      style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '8px',
        cursor:     clickable ? 'pointer' : 'default',
        borderRadius: '8px',
        padding:    clickable ? '2px 4px' : '0',
        margin:     clickable ? '-2px -4px' : '0',
        transition: 'background .12s',
      }}
      onMouseEnter={(e) => { if (clickable) (e.currentTarget as HTMLDivElement).style.background = COLORS.bg.panel }}
      onMouseLeave={(e) => { if (clickable) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
    >
      {showAvatar && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
          background: avatarUrl ? 'transparent' : COLORS.semantic.info.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', fontWeight: 500, color: COLORS.semantic.info.text,
          overflow: 'hidden',
        }}>
          {avatarUrl
            ? <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (initials ?? name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2))
          }
        </div>
      )}
      <div>
        <div style={{
          fontSize:   '13px',
          fontWeight: 500,
          color:      clickable ? COLORS.brand.blue : COLORS.text.primary,
          lineHeight: 1.3,
        }}>
          {name}
        </div>
        {matricule && (
          <div style={{ fontSize: '11px', color: COLORS.text.muted, fontFamily: 'monospace', lineHeight: 1.2 }}>
            {matricule}
          </div>
        )}
      </div>
    </div>
  )
}
