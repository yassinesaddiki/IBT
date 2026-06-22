import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconPhone, IconCircleCheck, IconAlertTriangle, IconMoodSmile, IconMoodSad, IconNotes } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { SeverityBadge, StatusBadge } from '../../design-system/components/Badge'
import { COLORS } from '../../design-system/tokens'
import { useTicketStore } from '../../store/ticketStore'
import { useAuthStore } from '../../store/authStore'
import { formatDateTime } from '../../shared/utils/formatDate'
import type { Satisfaction } from '../../shared/types/ticket'

const SATISFACTION_OPTIONS: {
  value: Satisfaction; label: string; desc: string
  icon: React.ReactNode; bg: string; text: string; border: string
}[] = [
  {
    value: 'satisfait',
    label: 'Client satisfait',
    desc: 'Le problème est résolu, le client confirme que tout fonctionne.',
    icon: <IconMoodSmile size={20} color="#166534" />,
    bg: COLORS.semantic.success.bg, text: COLORS.semantic.success.text, border: '#BBF7D0',
  },
  {
    value: 'probleme-persistant',
    label: 'Problème persistant',
    desc: 'Le client signale que le problème n\'est pas totalement résolu.',
    icon: <IconMoodSad size={20} color="#991B1B" />,
    bg: COLORS.semantic.danger.bg, text: COLORS.semantic.danger.text, border: '#FECACA',
  },
  {
    value: 'remarques',
    label: 'Remarques / Réserves',
    desc: 'Le client a des observations ou des remarques à communiquer.',
    icon: <IconNotes size={20} color="#854D0E" />,
    bg: COLORS.severity.moyenne.bg, text: COLORS.severity.moyenne.text, border: COLORS.severity.moyenne.border,
  },
]

export function ClosureScreen() {
  const { id }         = useParams<{ id: string }>()
  const navigate       = useNavigate()
  const tickets        = useTicketStore((s) => s.tickets)
  const closeTicket    = useTicketStore((s) => s.closeTicket)
  const user           = useAuthStore((s) => s.user)

  const ticket = tickets.find((t) => t.id === id)

  const [clientCalled,   setClientCalled]   = useState(false)
  const [satisfaction,   setSatisfaction]   = useState<Satisfaction | ''>('')
  const [comments,       setComments]       = useState('')
  const [saving,         setSaving]         = useState(false)
  const [done,           setDone]           = useState(false)
  const [errors,         setErrors]         = useState<Record<string, string>>({})

  if (!ticket) {
    return (
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px' }}>
        <NavBar title="Centre de Gestion des Réclamations" notifCount={3} />
        <div style={{ textAlign: 'center', padding: '80px', color: COLORS.text.muted }}>
          <IconAlertTriangle size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <div>Ticket introuvable</div>
        </div>
      </div>
    )
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!clientCalled)  e.clientCalled  = 'Confirmez que l\'appel client a été effectué'
    if (!satisfaction)  e.satisfaction  = 'Sélectionnez le niveau de satisfaction client'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleClose = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await closeTicket(ticket.id, {
        clientCalled,
        satisfaction:  satisfaction as Satisfaction,
        comments:      comments || undefined,
        closedBy:      user?.id ?? 'cgr-1',
      })
      setDone(true)
      setTimeout(() => navigate('/cgr/dashboard'), 1500)
    } catch {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Centre de Gestion des Réclamations" notifCount={3} />

      <div style={{ paddingTop: '32px', maxWidth: '640px', margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: COLORS.text.muted, marginBottom: '20px' }}>
          <span onClick={() => navigate('/cgr/dashboard')} style={{ cursor: 'pointer', color: COLORS.brand.blue }}>Tableau de bord</span>
          <span>›</span>
          <span onClick={() => navigate(`/cgr/ticket/${ticket.id}`)} style={{ cursor: 'pointer', color: COLORS.brand.blue, fontFamily: 'monospace' }}>#{ticket.id}</span>
          <span>›</span>
          <span style={{ color: COLORS.text.primary, fontWeight: 500 }}>Confirmation client & Clôture</span>
        </div>

        {/* Page title */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary }}>Confirmation client & Clôture définitive</div>
          <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '4px' }}>Appelez le client, confirmez la résolution et clôturez le ticket.</div>
        </div>

        {/* Ticket summary card */}
        <div
          className="animate-up"
          style={{
            background: COLORS.bg.surface, borderRadius: '14px',
            border: `0.5px solid ${COLORS.border.default}`, padding: '20px', marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', color: COLORS.text.muted, marginBottom: '4px' }}>#{ticket.id}</div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: COLORS.text.primary }}>{ticket.clientName}</div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <SeverityBadge severity={ticket.severity} />
              <StatusBadge status={ticket.status} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
            <div>
              <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '2px' }}>Problème</div>
              <div style={{ color: COLORS.text.primary }}>{ticket.subCategory}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '2px' }}>Adresse</div>
              <div style={{ color: COLORS.text.primary }}>{ticket.address}</div>
            </div>
          </div>

          {/* Client phone — big tap target */}
          <a
            href={`tel:${ticket.phone}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px',
              background: COLORS.semantic.info.bg, border: `0.5px solid ${COLORS.semantic.info.border}`,
              borderRadius: '10px', padding: '12px 14px', textDecoration: 'none',
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: COLORS.brand.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconPhone size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: COLORS.semantic.info.text, marginBottom: '2px' }}>Appeler le client</div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: COLORS.semantic.info.text, fontFamily: 'monospace' }}>{ticket.phone}</div>
            </div>
          </a>

          {/* Resolution summary */}
          {(ticket.eepIntervention?.actions || ticket.sedIntervention?.report) && (
            <div style={{ background: COLORS.bg.page, borderRadius: '8px', padding: '10px 12px', marginTop: '12px' }}>
              <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>
                Résumé de l'intervention {ticket.sedIntervention ? 'SED' : 'EEP'}
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.secondary, lineHeight: 1.6 }}>
                {ticket.sedIntervention?.report ?? ticket.eepIntervention?.actions}
              </div>
              {ticket.eepIntervention?.finishedAt && (
                <div style={{ fontSize: '11px', color: COLORS.text.muted, marginTop: '6px' }}>
                  Terminé le {formatDateTime(ticket.eepIntervention.finishedAt)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirmation form card */}
        <div
          className="animate-up"
          style={{
            background: COLORS.bg.surface, borderRadius: '14px',
            border: `0.5px solid ${COLORS.border.default}`, padding: '24px', marginBottom: '20px',
          }}
        >
          {/* Step 1: confirm call */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: COLORS.brand.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 500, flexShrink: 0 }}>1</div>
              Confirmer l'appel client
            </div>
            <div
              onClick={() => setClientCalled((v) => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px', borderRadius: '10px', cursor: 'pointer',
                border: `1.5px solid ${clientCalled ? COLORS.brand.green : errors.clientCalled ? '#EF4444' : COLORS.border.default}`,
                background: clientCalled ? COLORS.semantic.success.bg : COLORS.bg.page,
                transition: 'all .15s',
              }}
            >
              <div style={{
                width: '22px', height: '22px', borderRadius: '6px',
                border: `1.5px solid ${clientCalled ? COLORS.brand.green : COLORS.border.strong}`,
                background: clientCalled ? COLORS.brand.green : COLORS.bg.surface,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {clientCalled && (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: clientCalled ? COLORS.semantic.success.text : COLORS.text.primary }}>
                  {clientCalled ? '✓ Appel client effectué' : 'J\'ai appelé le client'}
                </div>
                <div style={{ fontSize: '12px', color: COLORS.text.secondary }}>
                  Cochez après avoir contacté le client au {ticket.phone}
                </div>
              </div>
              <IconPhone size={18} color={clientCalled ? COLORS.brand.green : COLORS.text.muted} style={{ marginLeft: 'auto' }} />
            </div>
            {errors.clientCalled && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '6px' }}>{errors.clientCalled}</div>}
          </div>

          {/* Step 2: satisfaction */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: COLORS.brand.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 500, flexShrink: 0 }}>2</div>
              Satisfaction client
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SATISFACTION_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => setSatisfaction(opt.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
                    border: `1.5px solid ${satisfaction === opt.value ? opt.border : COLORS.border.default}`,
                    background: satisfaction === opt.value ? opt.bg : COLORS.bg.surface,
                    transition: 'all .15s',
                  }}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: opt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `0.5px solid ${opt.border}` }}>
                    {opt.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: satisfaction === opt.value ? opt.text : COLORS.text.primary }}>{opt.label}</div>
                    <div style={{ fontSize: '11px', color: COLORS.text.secondary, lineHeight: 1.4 }}>{opt.desc}</div>
                  </div>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                    border: `1.5px solid ${satisfaction === opt.value ? COLORS.brand.blue : COLORS.border.strong}`,
                    background: satisfaction === opt.value ? COLORS.brand.blue : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {satisfaction === opt.value && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                  </div>
                </div>
              ))}
            </div>
            {errors.satisfaction && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '6px' }}>{errors.satisfaction}</div>}
          </div>

          {/* Step 3: comments */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: COLORS.border.default, color: COLORS.text.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 500, flexShrink: 0 }}>3</div>
              Commentaires de clôture <span style={{ fontSize: '12px', color: COLORS.text.muted, fontWeight: 400 }}>(optionnel)</span>
            </div>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Notes suite à l'appel client, remarques, informations complémentaires…"
              rows={3}
              style={{
                width: '100%', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '10px',
                padding: '10px 14px', fontSize: '13px', color: COLORS.text.primary,
                background: COLORS.bg.surface, outline: 'none', resize: 'vertical',
                fontFamily: 'inherit', lineHeight: 1.6,
              }}
            />
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate(`/cgr/ticket/${ticket.id}`)}
            style={{
              height: '48px', background: COLORS.bg.surface, color: COLORS.text.secondary,
              border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '10px',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer', padding: '0 24px', fontFamily: 'inherit',
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleClose}
            disabled={saving}
            style={{
              flex: 1, height: '48px',
              background: done ? COLORS.brand.green : COLORS.brand.blue,
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '14px', fontWeight: 500, cursor: saving ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', fontFamily: 'inherit', transition: 'background .2s',
            }}
          >
            {done ? (
              <><IconCircleCheck size={18} /> Ticket clôturé définitivement !</>
            ) : saving ? (
              <>
                <span className="animate-spin-loader" style={{ display: 'inline-flex' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                </span>
                Clôture en cours…
              </>
            ) : (
              <>
                <IconCircleCheck size={18} />
                Clôturer définitivement
                {user?.name && <span style={{ fontSize: '12px', opacity: 0.8 }}>· {user.name}</span>}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
