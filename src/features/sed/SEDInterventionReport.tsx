import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { IconCamera, IconCircleCheck, IconPause } from '@tabler/icons-react'
import { MobileLayout } from '../../shared/components/MobileLayout'
import { COLORS } from '../../design-system/tokens'
import { useTicketStore } from '../../store/ticketStore'

export function SEDInterventionReport() {
  const { id }         = useParams<{ id: string }>()
  const [params]       = useSearchParams()
  const isSuspension   = params.get('mode') === 'suspendu'
  const navigate       = useNavigate()
  const tickets        = useTicketStore((s) => s.tickets)
  const resolveSED     = useTicketStore((s) => s.resolveSED)
  const suspendSED     = useTicketStore((s) => s.suspendSED)

  const ticket = tickets.find((t) => t.id === id)

  const [report,           setReport]          = useState('')
  const [suspensionReason, setSuspensionReason] = useState('')
  const [comments,         setComments]         = useState('')
  const [saving,           setSaving]           = useState(false)
  const [done,             setDone]             = useState(false)
  const [errors,           setErrors]           = useState<Record<string, string>>({})

  if (!ticket) return null

  const handleSubmit = () => {
    const e: Record<string, string> = {}
    if (isSuspension && !suspensionReason.trim()) e.suspensionReason = 'Indiquez la raison de la suspension'
    if (!isSuspension && !report.trim())          e.report           = 'Décrivez les travaux effectués'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSaving(true)
    setTimeout(() => {
      if (isSuspension) {
        suspendSED(ticket.id, suspensionReason)
      } else {
        resolveSED(ticket.id, { report, comments: comments || undefined })
      }
      setDone(true)
      setTimeout(() => navigate('/sed/dashboard'), 1400)
    }, 900)
  }

  const accentColor = isSuspension ? COLORS.semantic.danger.text : COLORS.brand.green
  const accentBg    = isSuspension ? COLORS.semantic.danger.bg : COLORS.semantic.success.bg
  const accentBorder = isSuspension ? '#FECACA' : '#BBF7D0'

  return (
    <MobileLayout
      title={isSuspension ? 'Suspension — Rapport' : 'Rapport d\'intervention SED'}
      bottomAction={
        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            width: '100%', height: '52px',
            background: done ? COLORS.brand.green : isSuspension ? '#EF4444' : COLORS.brand.blue,
            color: '#fff', border: 'none', borderRadius: '12px',
            fontSize: '14px', fontWeight: 500,
            cursor: saving ? 'default' : 'pointer',
            fontFamily: 'inherit', transition: 'background .2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          {done ? (
            <><IconCircleCheck size={18} /> {isSuspension ? 'Suspension enregistrée !' : 'Rapport soumis !'}</>
          ) : saving ? (
            <>
              <span className="animate-spin-loader" style={{ display: 'inline-flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </span>
              Envoi en cours…
            </>
          ) : isSuspension ? (
            <><IconPause size={18} /> Confirmer la suspension</>
          ) : (
            <><IconCircleCheck size={18} /> Soumettre le rapport</>
          )}
        </button>
      }
    >
      {/* Status banner */}
      <div style={{ background: accentBg, border: `0.5px solid ${accentBorder}`, borderRadius: '10px', padding: '10px 12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isSuspension ? <IconPause size={16} color={accentColor} /> : <IconCircleCheck size={16} color={accentColor} />}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 500, color: accentColor }}>
            {isSuspension ? 'Suspension de l\'intervention' : 'Résolution confirmée'}
          </div>
          <div style={{ fontSize: '11px', color: accentColor, opacity: 0.8 }}>#{ticket.id} · {ticket.subCategory}</div>
        </div>
      </div>

      {/* Suspension reason — required if suspension mode */}
      {isSuspension && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
            Raison de la suspension <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            value={suspensionReason}
            onChange={(e) => setSuspensionReason(e.target.value)}
            placeholder="Ex : Matériel non disponible, budget en attente d'approbation directeur, accès impossible…"
            rows={3}
            style={{
              width: '100%', border: `0.5px solid ${errors.suspensionReason ? '#EF4444' : COLORS.border.strong}`,
              borderRadius: '10px', padding: '10px 12px', fontSize: '13px',
              color: COLORS.text.primary, background: COLORS.bg.surface,
              outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.6,
            }}
          />
          {errors.suspensionReason && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{errors.suspensionReason}</div>}
        </div>
      )}

      {/* Intervention report */}
      {!isSuspension && (
        <>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
              Rapport d'intervention <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              placeholder="Décrivez précisément les travaux effectués, le matériel utilisé, les résultats…"
              rows={5}
              style={{
                width: '100%', border: `0.5px solid ${errors.report ? '#EF4444' : COLORS.border.strong}`,
                borderRadius: '10px', padding: '10px 12px', fontSize: '13px',
                color: COLORS.text.primary, background: COLORS.bg.surface,
                outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.6,
              }}
            />
            {errors.report && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{errors.report}</div>}
          </div>

          {/* Duration */}
          <div style={{ background: COLORS.bg.surface, borderRadius: '10px', border: `0.5px solid ${COLORS.border.default}`, padding: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: COLORS.text.muted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '10px' }}>Horaires</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { label: 'Début', value: ticket.sedIntervention?.startedAt ? new Date(ticket.sedIntervention.startedAt).toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' }) : 'N/A' },
                { label: 'Fin', value: new Date().toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' }) },
                {
                  label: 'Durée', value: ticket.sedIntervention?.startedAt
                    ? `${Math.round((Date.now() - new Date(ticket.sedIntervention.startedAt).getTime()) / 60000)} min`
                    : 'N/A',
                  highlight: true,
                },
              ].map((col, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: COLORS.text.muted, marginBottom: '4px' }}>{col.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: col.highlight ? COLORS.brand.blue : COLORS.text.primary, fontFamily: 'monospace' }}>{col.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
              Photos du chantier (optionnel)
            </label>
            <div style={{ border: `1.5px dashed ${COLORS.border.strong}`, borderRadius: '10px', padding: '20px', textAlign: 'center', background: COLORS.bg.page, cursor: 'pointer' }}>
              <IconCamera size={22} color={COLORS.text.muted} style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '12px', color: COLORS.text.secondary }}>Appuyer pour ajouter des photos</div>
              <div style={{ fontSize: '11px', color: COLORS.text.muted, marginTop: '3px' }}>JPG, PNG · Max 10 photos</div>
            </div>
          </div>
        </>
      )}

      {/* Comments — both modes */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
          Commentaires additionnels (optionnel)
        </label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Observations, recommandations, informations pour le CGR ou le coordinateur…"
          rows={3}
          style={{
            width: '100%', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '10px',
            padding: '10px 12px', fontSize: '13px', color: COLORS.text.primary,
            background: COLORS.bg.surface, outline: 'none', resize: 'none',
            fontFamily: 'inherit', lineHeight: 1.6,
          }}
        />
      </div>
    </MobileLayout>
  )
}
