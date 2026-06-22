import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconCalendar, IconCircleCheck } from '@tabler/icons-react'
import { MobileLayout } from '../../shared/components/MobileLayout'
import { SeverityBadge } from '../../design-system/components/Badge'
import { COLORS } from '../../design-system/tokens'
import { useTicketStore } from '../../store/ticketStore'

const SCHEDULE_REASONS = [
  'Matériel en commande — livraison prévue',
  'Équipe insuffisante — renfort nécessaire',
  'Accès au site impossible actuellement',
  'Conditions météo défavorables',
  'Approbation budgétaire en cours',
  'Coordination avec d\'autres services',
]

export function SEDScheduleScreen() {
  const { id }       = useParams<{ id: string }>()
  const navigate     = useNavigate()
  const tickets      = useTicketStore((s) => s.tickets)
  const scheduleSED  = useTicketStore((s) => s.scheduleSED)

  const ticket = tickets.find((t) => t.id === id)

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const [date,     setDate]     = useState('')
  const [reason,   setReason]   = useState('')
  const [notes,    setNotes]    = useState('')
  const [saving,   setSaving]   = useState(false)
  const [done,     setDone]     = useState(false)
  const [errors,   setErrors]   = useState<Record<string, string>>({})

  if (!ticket) return null

  const handleSubmit = async () => {
    const e: Record<string, string> = {}
    if (!date)   e.date   = 'Sélectionnez une date'
    if (!reason) e.reason = 'Sélectionnez une raison'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSaving(true)
    try {
      await scheduleSED(ticket.id, new Date(date), [reason, notes].filter(Boolean).join(' — '))
      setDone(true)
      setTimeout(() => navigate('/sed/dashboard'), 1400)
    } catch {
      setSaving(false)
    }
  }

  return (
    <MobileLayout
      title="Programmer l'intervention"
      bottomAction={
        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            width: '100%', height: '52px',
            background: done ? COLORS.brand.green : '#8B5CF6',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontSize: '14px', fontWeight: 500,
            cursor: saving ? 'default' : 'pointer',
            fontFamily: 'inherit', transition: 'background .2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          {done ? (
            <><IconCircleCheck size={18} /> Intervention programmée !</>
          ) : saving ? 'Enregistrement…' : (
            <><IconCalendar size={18} /> Confirmer la programmation</>
          )}
        </button>
      }
    >
      {/* Ticket recap */}
      <div style={{ background: COLORS.bg.surface, borderRadius: '12px', border: `0.5px solid ${COLORS.border.default}`, padding: '12px', marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', fontFamily: 'monospace', color: COLORS.text.muted, marginBottom: '4px' }}>#{ticket.id}</div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '4px' }}>{ticket.clientName}</div>
        <div style={{ fontSize: '12px', color: COLORS.text.secondary, marginBottom: '8px' }}>{ticket.subCategory} · {ticket.sector}</div>
        <SeverityBadge severity={ticket.severity} />
      </div>

      {/* Date picker */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
          Date d'intervention prévue <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <IconCalendar size={16} color={COLORS.text.muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="date"
            value={date}
            min={minDate}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: '100%', height: '46px',
              border: `0.5px solid ${errors.date ? '#EF4444' : COLORS.border.strong}`,
              borderRadius: '10px', padding: '0 14px 0 38px', fontSize: '14px',
              color: date ? COLORS.text.primary : COLORS.text.placeholder,
              background: COLORS.bg.surface, outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>
        {errors.date && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{errors.date}</div>}
        {date && (
          <div className="animate-up" style={{ marginTop: '8px', background: '#F5F3FF', border: '0.5px solid #DDD6FE', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#5B21B6', fontWeight: 500 }}>
            📅 Prévu le {new Date(date + 'T00:00:00').toLocaleDateString('fr-MA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        )}
      </div>

      {/* Reason */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
          Raison de la programmation <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {SCHEDULE_REASONS.map((r) => (
            <div
              key={r}
              onClick={() => setReason(r)}
              style={{
                padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                border: `1.5px solid ${reason === r ? '#DDD6FE' : COLORS.border.default}`,
                background: reason === r ? '#F5F3FF' : COLORS.bg.surface,
                display: 'flex', alignItems: 'center', gap: '10px', transition: 'all .15s',
              }}
            >
              <div style={{
                width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                border: `1.5px solid ${reason === r ? '#8B5CF6' : COLORS.border.strong}`,
                background: reason === r ? '#8B5CF6' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {reason === r && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff' }} />}
              </div>
              <span style={{ fontSize: '12px', color: reason === r ? '#5B21B6' : COLORS.text.primary }}>{r}</span>
            </div>
          ))}
        </div>
        {errors.reason && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '6px' }}>{errors.reason}</div>}
      </div>

      {/* Notes */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
          Notes complémentaires (optionnel)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Informations supplémentaires pour le coordinateur ou le CGR…"
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
