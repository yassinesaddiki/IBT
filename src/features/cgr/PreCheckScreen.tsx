import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconBolt, IconPhone, IconCalendarOff, IconCircleCheck, IconArrowRight, IconX } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { COLORS } from '../../design-system/tokens'

export function PreCheckScreen() {
  const [mtChecked,   setMtChecked]   = useState(false)
  const [progChecked, setProgChecked] = useState(false)
  const navigate = useNavigate()

  const bothChecked = mtChecked && progChecked

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Centre de Gestion des Réclamations" notifCount={3} />

      <div
        style={{
          paddingTop: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: COLORS.text.muted,
            marginBottom: '24px',
          }}
        >
          <span
            onClick={() => navigate('/cgr/dashboard')}
            style={{ cursor: 'pointer', color: COLORS.brand.blue }}
          >
            Tableau de bord
          </span>
          <span>›</span>
          <span>Nouveau Appel</span>
          <span>›</span>
          <span style={{ color: COLORS.text.primary, fontWeight: 500 }}>Vérification préalable</span>
        </div>

        {/* Main card */}
        <div
          className="animate-up"
          style={{
            background: COLORS.bg.surface,
            borderRadius: '16px',
            border: `0.5px solid ${COLORS.border.default}`,
            padding: '40px',
            width: '100%',
            maxWidth: '540px',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                background: COLORS.semantic.info.bg,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <IconPhone size={24} color={COLORS.semantic.info.text} />
            </div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '6px' }}>
              Nouveau Appel — Vérification Préalable
            </div>
            <div style={{ fontSize: '13px', color: COLORS.text.secondary, lineHeight: 1.6 }}>
              Avant d'ouvrir un ticket, confirmez avec l'équipe SED que les deux vérifications ci-dessous ont été effectuées.
            </div>
          </div>

          {/* Step indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
            <StepBadge num={1} done={mtChecked} label="Vérification MT" />
            <div style={{ flex: 1, height: '1px', background: bothChecked ? COLORS.brand.green : COLORS.border.default }} />
            <StepBadge num={2} done={progChecked} label="Coupure programmée" />
            <div style={{ flex: 1, height: '1px', background: bothChecked ? COLORS.brand.green : COLORS.border.default }} />
            <StepBadge num={3} done={bothChecked} label="Créer le ticket" />
          </div>

          {/* Check 1 — MT */}
          <CheckCard
            icon={<IconBolt size={20} color={mtChecked ? COLORS.brand.green : '#6B7280'} />}
            iconBg={mtChecked ? '#DCFCE7' : COLORS.bg.panel}
            title="Vérification Moyen Tension (MT)"
            description="Appeler l'équipe SED et confirmer qu'il n'y a pas de problème MT en cours dans ce secteur qui expliquerait la coupure signalée par le client."
            checked={mtChecked}
            onChange={setMtChecked}
            checkLabel="Vérifié avec SED — Pas de problème MT dans ce secteur"
          />

          {/* Check 2 — Programmé */}
          <CheckCard
            icon={<IconCalendarOff size={20} color={progChecked ? COLORS.brand.green : '#6B7280'} />}
            iconBg={progChecked ? '#DCFCE7' : COLORS.bg.panel}
            title="Vérification Coupure Programmée"
            description="Confirmer avec l'équipe SED qu'aucune coupure programmée (maintenance planifiée) n'est en cours ou prévue dans ce secteur."
            checked={progChecked}
            onChange={setProgChecked}
            checkLabel="Vérifié avec SED — Pas de coupure programmée dans ce secteur"
          />

          {/* Result message */}
          {bothChecked && (
            <div
              className="animate-up"
              style={{
                background: COLORS.semantic.success.bg,
                border: '0.5px solid #BBF7D0',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              <IconCircleCheck size={18} color={COLORS.semantic.success.text} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.semantic.success.text }}>
                  Vérifications confirmées
                </div>
                <div style={{ fontSize: '12px', color: COLORS.semantic.success.text, opacity: 0.8 }}>
                  Vous pouvez maintenant créer un nouveau ticket d'intervention.
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/cgr/dashboard')}
              style={{
                height: '44px',
                background: COLORS.bg.surface,
                color: COLORS.text.secondary,
                border: `0.5px solid ${COLORS.border.strong}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                padding: '0 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'inherit',
              }}
            >
              <IconX size={16} /> Annuler
            </button>

            <button
              onClick={() => bothChecked && navigate('/cgr/nouveau-ticket')}
              disabled={!bothChecked}
              style={{
                flex: 1,
                height: '44px',
                background: bothChecked ? COLORS.brand.blue : COLORS.border.default,
                color: bothChecked ? '#fff' : COLORS.text.muted,
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: bothChecked ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'inherit',
                transition: 'background .2s',
              }}
            >
              Créer le ticket
              <IconArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Info note */}
        <div
          style={{
            marginTop: '20px',
            maxWidth: '540px',
            width: '100%',
            fontSize: '12px',
            color: COLORS.text.muted,
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          Ces vérifications sont enregistrées automatiquement sur le ticket et font partie de la traçabilité ONEE.
        </div>
      </div>
    </div>
  )
}

function StepBadge({ num, done, label }: { num: number; done: boolean; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: done ? COLORS.brand.green : COLORS.border.default,
          color: done ? '#fff' : COLORS.text.muted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 500,
          transition: 'background .2s',
        }}
      >
        {done ? '✓' : num}
      </div>
      <span style={{ fontSize: '10px', color: done ? COLORS.brand.green : COLORS.text.muted, whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </div>
  )
}

function CheckCard({
  icon, iconBg, title, description, checked, onChange, checkLabel,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
  checkLabel: string
}) {
  return (
    <div
      style={{
        background: checked ? COLORS.semantic.success.bg : COLORS.bg.page,
        border: `0.5px solid ${checked ? '#BBF7D0' : COLORS.border.default}`,
        borderRadius: '12px',
        padding: '18px',
        marginBottom: '16px',
        transition: 'all .2s',
        cursor: 'pointer',
      }}
      onClick={() => onChange(!checked)}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background .2s',
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '4px' }}>
            {title}
          </div>
          <div style={{ fontSize: '12px', color: COLORS.text.secondary, lineHeight: 1.6, marginBottom: '12px' }}>
            {description}
          </div>
          {/* Checkbox */}
          <label
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '6px',
                border: `1.5px solid ${checked ? COLORS.brand.green : COLORS.border.strong}`,
                background: checked ? COLORS.brand.green : COLORS.bg.surface,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all .15s',
              }}
              onClick={() => onChange(!checked)}
            >
              {checked && (
                <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                  <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 500, color: checked ? COLORS.semantic.success.text : COLORS.text.secondary }}>
              {checkLabel}
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
