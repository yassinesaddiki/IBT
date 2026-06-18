import { useState } from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { COLORS } from '../tokens'

interface InputProps {
  id?: string
  label?: string
  type?: 'text' | 'password' | 'email' | 'tel'
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
  required?: boolean
}

export function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType  = isPassword && showPassword ? 'text' : type

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '6px',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          style={{
            width: '100%',
            height: '42px',
            border: `0.5px solid ${COLORS.border.strong}`,
            borderRadius: '8px',
            padding: isPassword ? '0 40px 0 14px' : '0 14px',
            fontSize: '14px',
            color: COLORS.text.primary,
            background: COLORS.bg.surface,
            outline: 'none',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = COLORS.border.focus
            e.target.style.boxShadow  = `0 0 0 3px rgba(13,43,94,0.09)`
          }}
          onBlur={(e) => {
            e.target.style.borderColor = COLORS.border.strong
            e.target.style.boxShadow  = 'none'
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            style={{
              position: 'absolute',
              right: '11px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: COLORS.text.muted,
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
            }}
          >
            {showPassword ? <IconEyeOff size={17} /> : <IconEye size={17} />}
          </button>
        )}
      </div>
    </div>
  )
}
