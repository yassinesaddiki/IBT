import { COLORS } from '../tokens'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  maxWidth?: number
}

export function Modal({ open, onClose, title, children, maxWidth = 480 }: ModalProps) {
  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(13,43,94,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="animate-up"
        style={{
          background: COLORS.bg.surface,
          borderRadius: '14px',
          border: `0.5px solid ${COLORS.border.default}`,
          padding: '32px',
          width: '100%',
          maxWidth,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: COLORS.text.primary,
              marginBottom: '20px',
            }}
          >
            {title}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
