import { IconLoader2, IconCheck } from '@tabler/icons-react'
import { COLORS } from '../tokens'

type Variant = 'primary' | 'success' | 'danger' | 'secondary'
type Size    = 'md' | 'sm'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: Variant
  size?: Size
  loading?: boolean
  success?: boolean
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit'
}

const BG: Record<Variant, string> = {
  primary:   COLORS.brand.blue,
  success:   COLORS.brand.green,
  danger:    '#EF4444',
  secondary: COLORS.bg.surface,
}

const TEXT_COLOR: Record<Variant, string> = {
  primary:   '#fff',
  success:   '#fff',
  danger:    '#fff',
  secondary: '#374151',
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  success = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
}: ButtonProps) {
  const height  = size === 'md' ? '44px' : '36px'
  const fontSize = size === 'md' ? '14px' : '13px'
  const bg = success ? COLORS.brand.green : BG[variant]
  const color = TEXT_COLOR[variant]
  const border = variant === 'secondary' ? `0.5px solid ${COLORS.border.strong}` : 'none'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        height,
        background: bg,
        color,
        border,
        borderRadius: '8px',
        fontSize,
        fontWeight: 500,
        cursor: disabled || loading ? 'default' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: size === 'md' ? '0 20px' : '0 14px',
        fontFamily: 'inherit',
        width: fullWidth ? '100%' : undefined,
        transition: 'opacity .15s',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {loading ? (
        <>
          <IconLoader2 size={16} className="animate-spin-loader" />
          Chargement…
        </>
      ) : success ? (
        <>
          <IconCheck size={16} />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
