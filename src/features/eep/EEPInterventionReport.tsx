import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconCamera, IconCircleCheck } from '@tabler/icons-react'
import { MobileLayout } from '../../shared/components/MobileLayout'
import { COLORS } from '../../design-system/tokens'
import { useTicketStore } from '../../store/ticketStore'

export function EEPInterventionReport() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const tickets    = useTicketStore((s) => s.tickets)
  const resolveEEP = useTicketStore((s) => s.resolveEEP)

  const ticket = tickets.find((t) => t.id === id)

  const [actions,  setActions]  = useState('')
  const [comments, setComments] = useState('')
  const [saving,   setSaving]   = useState(false)
  const [done,     setDone]     = useState(false)
  const [errors,   setErrors]   = useState<Record<string, string>>({})

  if (!ticket) return null

  const handleSubmit = async () => {
    const e: Record<string, string> = {}
    if (!actions.trim()) e.actions = 'Décrivez les actions effectuées'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSaving(true)
    try {
      await resolveEEP(ticket.id, { actions, comments: comments || undefined })
      setDone(true)
      setTimeout(() => navigate('/eep/dashboard'), 1400)
    } catch {
      setSaving(false)
    }
  }

  return (
    <MobileLayout
      title="Rapport d'intervention"
      bottomAction={
        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            width: '100%', height: '52px',
            background: done ? COLORS.brand.green : COLORS.brand.blue,
            color: '#fff', border: 'none', borderRadius: '12px',
            fontSize: '14px', fontWeight: 500,
            cursor: saving ? 'default' : 'pointer',
            fontFamily: 'inherit', transition: 'background .2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          {done ? (
            <><IconCircleCheck size={18} /> Rapport soumis !</>
          ) : saving ? (
            <>
              <span className="animate-spin-loader" style={{ display: 'inline-flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </span>
              Envoi en cours…
            </>
          ) : 'Soumettre le rapport'}
        </button>
      }
    >
      {/* Ticket recap */}
      <div style={{ background: COLORS.semantic.success.bg, borderRadius: '10px', border: '0.5px solid #BBF7D0', padding: '10px 12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IconCircleCheck size={16} color={COLORS.semantic.success.text} />
        <div>
          <div style={{ fontSize: '12px', fontWeight: 500, color: COLORS.semantic.success.text }}>Résolution confirmée</div>
          <div style={{ fontSize: '11px', color: COLORS.semantic.success.text, opacity: 0.8 }}>#{ticket.id} · {ticket.subCategory}</div>
        </div>
      </div>

      {/* Actions field */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
          Actions effectuées <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <textarea
          value={actions}
          onChange={(e) => setActions(e.target.value)}
          placeholder="Décrivez précisément ce qui a été fait sur le terrain…"
          rows={4}
          style={{
            width: '100%', border: `0.5px solid ${errors.actions ? '#EF4444' : COLORS.border.strong}`,
            borderRadius: '10px', padding: '10px 12px', fontSize: '13px',
            color: COLORS.text.primary, background: COLORS.bg.surface,
            outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.6,
          }}
        />
        {errors.actions && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{errors.actions}</div>}
      </div>

      {/* Time info */}
      <div style={{ background: COLORS.bg.surface, borderRadius: '10px', border: `0.5px solid ${COLORS.border.default}`, padding: '12px', marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.secondary, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Horaires</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>Début</div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, fontFamily: 'monospace' }}>
              {ticket.eepIntervention?.startedAt
                ? new Date(ticket.eepIntervention.startedAt).toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' })
                : 'N/A'}
            </div>
          </div>
          <div style={{ width: '1px', background: COLORS.border.default }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>Fin</div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, fontFamily: 'monospace' }}>
              {new Date().toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div style={{ width: '1px', background: COLORS.border.default }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>Durée</div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.brand.blue, fontFamily: 'monospace' }}>
              {ticket.eepIntervention?.startedAt
                ? `${Math.round((Date.now() - new Date(ticket.eepIntervention.startedAt).getTime()) / 60000)} min`
                : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Photos placeholder */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
          Photos du terrain (optionnel)
        </label>
        <div
          style={{
            border: `1.5px dashed ${COLORS.border.strong}`, borderRadius: '10px',
            padding: '24px', textAlign: 'center', cursor: 'pointer',
            background: COLORS.bg.page,
          }}
        >
          <IconCamera size={24} color={COLORS.text.muted} style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '13px', color: COLORS.text.secondary }}>Appuyer pour ajouter des photos</div>
          <div style={{ fontSize: '11px', color: COLORS.text.muted, marginTop: '4px' }}>JPG, PNG · Max 5 photos</div>
        </div>
      </div>

      {/* Comments */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
          Commentaires additionnels (optionnel)
        </label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Observations, recommandations, informations pour le CGR…"
          rows={3}
          style={{
            width: '100%', border: `0.5px solid ${COLORS.border.strong}`,
            borderRadius: '10px', padding: '10px 12px', fontSize: '13px',
            color: COLORS.text.primary, background: COLORS.bg.surface,
            outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.6,
          }}
        />
      </div>
    </MobileLayout>
  )
}
