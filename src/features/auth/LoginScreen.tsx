import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconBolt, IconArrowRight, IconLock } from '@tabler/icons-react'
import { useAuthStore } from '../../store/authStore'
import { ROLE_ROUTES } from '../../mock-data/users'
import { Input } from '../../design-system/components/Input'
import { COLORS } from '../../design-system/tokens'

export function LoginScreen() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword]     = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [ok, setOk]                 = useState(false)

  const login    = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleLogin = () => {
    setError('')
    if (!identifier || !password) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const success = login(identifier, password)
      if (success) {
        const user = useAuthStore.getState().user!
        setOk(true)
        setTimeout(() => navigate(ROLE_ROUTES[user.role]), 900)
      } else {
        setLoading(false)
        setError('Identifiant ou mot de passe incorrect.')
      }
    }, 1200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: COLORS.bg.page,
        padding: '16px',
      }}
    >
      {/* Card wrapper */}
      <div
        className="animate-up"
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '860px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(13,43,94,0.12)',
        }}
      >
        {/* ── LEFT BRAND PANEL ── */}
        <div
          style={{
            width: '40%',
            background: COLORS.brand.blue,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '34px',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
          }}
          className="login-left-panel"
        >
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: '-70px', right: '-70px',
            width: '260px', height: '260px', borderRadius: '50%',
            border: '44px solid rgba(60,185,122,0.09)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-50px', left: '-55px',
            width: '190px', height: '190px', borderRadius: '50%',
            border: '30px solid rgba(245,197,24,0.07)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: '380px', height: '380px', borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.05)',
            transform: 'translate(-50%,-50%)', pointerEvents: 'none',
          }} />

          {/* SRM ORI logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
            <div style={{
              width: '34px', height: '34px', background: COLORS.brand.green,
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconBolt size={18} color="#fff" />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.82)', letterSpacing: '.1em' }}>
              SRM ORI
            </span>
          </div>

          {/* Brand text */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '18px 0', position: 'relative' }}>
            <div style={{ fontSize: '66px', fontWeight: 500, color: '#fff', letterSpacing: '-2px', lineHeight: 1, marginBottom: '12px' }}>
              IBT
            </div>
            <div style={{ width: '50px', height: '4px', background: COLORS.brand.yellow, borderRadius: '2px', marginBottom: '18px' }} />
            <div style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.78)', lineHeight: 1.45, marginBottom: '8px' }}>
              Intervention<br />Basse Tension
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.36)', lineHeight: 1.65 }}>
              Système de gestion<br />des interventions électriques<br />Maroc
            </div>
          </div>

          {/* Status + version */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11px', color: 'rgba(255,255,255,0.48)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: COLORS.brand.green, flexShrink: 0 }} />
              Système opérationnel
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-mono)' }}>v1.0</span>
          </div>
        </div>

        {/* ── RIGHT FORM PANEL ── */}
        <div
          style={{
            flex: 1,
            background: COLORS.bg.page,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '36px 26px',
          }}
        >
          <div
            style={{
              background: COLORS.bg.surface,
              borderRadius: '14px',
              border: `0.5px solid ${COLORS.border.default}`,
              padding: '36px 32px',
              width: '100%',
              maxWidth: '332px',
            }}
          >
            {/* Role badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              background: COLORS.semantic.info.bg, color: COLORS.semantic.info.text,
              fontSize: '11px', fontWeight: 500, padding: '4px 10px',
              borderRadius: '20px', marginBottom: '22px',
              border: `0.5px solid ${COLORS.semantic.info.border}`,
            }}>
              <IconBolt size={12} />
              IBT · Accès personnel SRM ORI
            </div>

            {/* Heading */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '19px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '5px' }}>
                Connexion
              </div>
              <div style={{ fontSize: '13px', color: COLORS.text.secondary }}>
                Accédez à votre espace de gestion des interventions
              </div>
            </div>

            {/* Form */}
            <div onKeyDown={handleKeyDown}>
              <Input
                id="uid"
                label="Identifiant"
                type="text"
                value={identifier}
                onChange={setIdentifier}
                placeholder="Votre identifiant ou nom"
                autoComplete="username"
              />
              <Input
                id="upw"
                label="Mot de passe"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: COLORS.semantic.danger.bg, color: COLORS.semantic.danger.text,
                fontSize: '12px', padding: '8px 12px', borderRadius: '8px',
                marginBottom: '12px', border: '0.5px solid #FECACA',
              }}>
                {error}
              </div>
            )}

            {/* Hint */}
            <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '8px', lineHeight: 1.5 }}>
              Astuce prototype : utilisez <code style={{ fontFamily: 'monospace', background: '#F3F4F6', padding: '1px 4px', borderRadius: '4px' }}>cgr123</code>, <code style={{ fontFamily: 'monospace', background: '#F3F4F6', padding: '1px 4px', borderRadius: '4px' }}>eep123</code>, <code style={{ fontFamily: 'monospace', background: '#F3F4F6', padding: '1px 4px', borderRadius: '4px' }}>sed123</code>…
            </div>

            {/* Submit button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: '100%',
                height: '44px',
                background: ok ? COLORS.brand.green : COLORS.brand.blue,
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: loading ? 'default' : 'pointer',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'inherit',
                transition: 'background .2s',
              }}
            >
              {loading && !ok && (
                <>
                  <span className="animate-spin-loader" style={{ display: 'inline-flex' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  </span>
                  Connexion en cours…
                </>
              )}
              {ok && (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Connecté — redirection…
                </>
              )}
              {!loading && !ok && (
                <>
                  Se connecter
                  <IconArrowRight size={16} />
                </>
              )}
            </button>

            {/* Divider */}
            <div style={{ borderTop: `0.5px solid #F1F3F5`, margin: '20px 0 16px' }} />

            {/* Security notice */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '11px', color: COLORS.text.placeholder }}>
              <IconLock size={13} />
              Accès réservé au personnel autorisé SRM ORI
            </div>
          </div>

          <div style={{ marginTop: '24px', fontSize: '11px', color: COLORS.text.placeholder, textAlign: 'center' }}>
            © 2026 SRM ORI · IBT Système de Gestion des Interventions
          </div>
        </div>
      </div>

      {/* Mobile-only: hide left panel via media query handled in index.css */}
      <style>{`
        @media (max-width: 600px) {
          .login-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  )
}
