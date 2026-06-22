import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconArrowRight, IconCircleCheck, IconAlertTriangle, IconCamera, IconX } from '@tabler/icons-react'
import { MobileLayout } from '../../shared/components/MobileLayout'
import { SeverityBadge } from '../../design-system/components/Badge'
import { COLORS } from '../../design-system/tokens'
import { useTicketStore } from '../../store/ticketStore'
import { uploadMultiple } from '../../shared/hooks/useStorageUpload'

const REFER_REASONS = [
  'Nécessite équipement lourd (pick-up, grue)',
  'Câble souterrain — excavation requise',
  'Poste MT endommagé hors compétence EEP',
  'Budget / matériel non disponible EEP',
  'Danger grave — intervention spécialisée requise',
  'Autre raison',
]

export function EEPReferToSED() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const tickets    = useTicketStore((s) => s.tickets)
  const referToSED = useTicketStore((s) => s.referToSED)

  const ticket = tickets.find((t) => t.id === id)

  const [selectedReason, setSelectedReason] = useState('')
  const [actions,        setActions]         = useState('')
  const [comments,       setComments]        = useState('')
  const [photos,         setPhotos]          = useState<File[]>([])
  const [previews,       setPreviews]        = useState<string[]>([])
  const [saving,         setSaving]          = useState(false)
  const [done,           setDone]            = useState(false)
  const [errors,         setErrors]          = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5 - photos.length)
    if (!files.length) return
    setPhotos((p) => [...p, ...files])
    files.forEach((f) => {
      const url = URL.createObjectURL(f)
      setPreviews((p) => [...p, url])
    })
    e.target.value = ''
  }

  const removePhoto = (i: number) => {
    setPhotos((p) => p.filter((_, idx) => idx !== i))
    setPreviews((p) => p.filter((_, idx) => idx !== i))
  }

  if (!ticket) return null

  const handleSubmit = async () => {
    const e: Record<string, string> = {}
    if (!selectedReason) e.reason  = 'Sélectionnez une raison'
    if (!actions.trim()) e.actions = 'Décrivez ce qui a été fait'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSaving(true)
    try {
      const uploadedPaths = photos.length
        ? await uploadMultiple('ticket-photos', photos, `${ticket.id}/eep-refer`)
        : []
      await referToSED(ticket.id, {
        actions,
        comments: [selectedReason, comments].filter(Boolean).join(' — ') || undefined,
        photos:   uploadedPaths,
      })
      setDone(true)
      setTimeout(() => navigate('/eep/dashboard'), 1400)
    } catch {
      setSaving(false)
    }
  }

  return (
    <MobileLayout
      title="Référer à SED"
      bottomAction={
        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            width: '100%', height: '52px',
            background: done ? COLORS.brand.green : '#F97316',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontSize: '14px', fontWeight: 500,
            cursor: saving ? 'default' : 'pointer',
            fontFamily: 'inherit', transition: 'background .2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          {done ? (
            <><IconCircleCheck size={18} /> Renvoi confirmé !</>
          ) : saving ? 'Envoi en cours…' : (
            <>Référer à SED <IconArrowRight size={16} /></>
          )}
        </button>
      }
    >
      {/* Warning banner */}
      <div style={{ background: '#FFF7ED', border: '0.5px solid #FED7AA', borderRadius: '10px', padding: '12px', marginBottom: '16px', display: 'flex', gap: '10px' }}>
        <IconAlertTriangle size={18} color="#C2410C" style={{ flexShrink: 0, marginTop: '1px' }} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#C2410C', marginBottom: '3px' }}>Renvoi vers l'équipe SED</div>
          <div style={{ fontSize: '12px', color: '#92400E', lineHeight: 1.5 }}>
            Cette action nécessitera l'approbation du Coordinateur avant que le ticket soit transféré à l'équipe SED.
          </div>
        </div>
      </div>

      {/* Ticket recap */}
      <div style={{ background: COLORS.bg.surface, borderRadius: '12px', border: `0.5px solid ${COLORS.border.default}`, padding: '12px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontFamily: 'monospace', color: COLORS.text.muted, marginBottom: '4px' }}>#{ticket.id}</div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '4px' }}>{ticket.clientName}</div>
        <div style={{ fontSize: '12px', color: COLORS.text.secondary, marginBottom: '8px' }}>{ticket.subCategory} · {ticket.sector}</div>
        <SeverityBadge severity={ticket.severity} />
      </div>

      {/* Reason selector */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
          Raison du renvoi <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {REFER_REASONS.map((reason) => (
            <div
              key={reason}
              onClick={() => setSelectedReason(reason)}
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                border: `1.5px solid ${selectedReason === reason ? '#FED7AA' : COLORS.border.default}`,
                background: selectedReason === reason ? '#FFF7ED' : COLORS.bg.surface,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all .15s',
              }}
            >
              <div style={{
                width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                border: `1.5px solid ${selectedReason === reason ? '#F97316' : COLORS.border.strong}`,
                background: selectedReason === reason ? '#F97316' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {selectedReason === reason && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff' }} />}
              </div>
              <span style={{ fontSize: '12px', color: selectedReason === reason ? '#C2410C' : COLORS.text.primary }}>
                {reason}
              </span>
            </div>
          ))}
        </div>
        {errors.reason && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '6px' }}>{errors.reason}</div>}
      </div>

      {/* Actions done */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
          Ce qui a été fait par l'EEP <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <textarea
          value={actions}
          onChange={(e) => setActions(e.target.value)}
          placeholder="Décrivez les actions déjà effectuées sur le terrain avant le renvoi…"
          rows={3}
          style={{
            width: '100%', border: `0.5px solid ${errors.actions ? '#EF4444' : COLORS.border.strong}`,
            borderRadius: '10px', padding: '10px 12px', fontSize: '13px',
            color: COLORS.text.primary, background: COLORS.bg.surface,
            outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.6,
          }}
        />
        {errors.actions && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{errors.actions}</div>}
      </div>

      {/* Additional notes */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
          Notes pour l'équipe SED (optionnel)
        </label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Informations utiles pour l'équipe SED…"
          rows={2}
          style={{
            width: '100%', border: `0.5px solid ${COLORS.border.strong}`,
            borderRadius: '10px', padding: '10px 12px', fontSize: '13px',
            color: COLORS.text.primary, background: COLORS.bg.surface,
            outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.6,
          }}
        />
      </div>

      {/* Photos */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
          Photos du terrain <span style={{ color: COLORS.text.muted, fontWeight: 400 }}>(optionnel, max 5)</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
          {previews.map((src, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: '10px', overflow: 'hidden', border: `0.5px solid ${COLORS.border.default}` }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => removePhoto(i)}
                style={{ position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconX size={11} color="#fff" />
              </button>
            </div>
          ))}
          {photos.length < 5 && (
            <button onClick={() => fileInputRef.current?.click()}
              style={{ aspectRatio: '1', borderRadius: '10px', border: `1.5px dashed ${COLORS.border.strong}`, background: COLORS.bg.page, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <IconCamera size={20} color={COLORS.text.muted} />
              <span style={{ fontSize: '10px', color: COLORS.text.muted }}>Ajouter</span>
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoAdd} style={{ display: 'none' }} />
      </div>
    </MobileLayout>
  )
}
