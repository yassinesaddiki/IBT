import { COLORS } from '../tokens'

interface CardProps {
  children: React.ReactNode
  padding?: number
  className?: string
  animate?: boolean
  style?: React.CSSProperties
}

export function Card({ children, padding = 20, className, animate = true, style }: CardProps) {
  return (
    <div
      className={`${animate ? 'animate-up' : ''} ${className ?? ''}`}
      style={{
        background: COLORS.bg.surface,
        borderRadius: '14px',
        border: `0.5px solid ${COLORS.border.default}`,
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
