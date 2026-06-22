import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconTool, IconPlayerPause, IconCalendar, IconCircleCheck, IconAlertTriangle } from '@tabler/icons-react'
import { MobileLayout } from '../../shared/components/MobileLayout'
import { SeverityBadge, StatusBadge } from '../../design-system/components/Badge'
import { COLORS } from '../../design-system/tokens'
import { useTicketStore } from '../../store/ticketStore'
import { useAuthStore } from '../../store/authStore'

type SEDAction = 'en-cours-sed' | 'suspendu' | 'programme' | 'resolu-sed'

const ACTIONS: {
  key: SEDAction; label: string; desc: string
  icon: React.ReactNode; bg: string; text: string; border: string
}[] = [
  {
    key: 'en-cours-sed', label: 'En cours d\'intervention',
    desc: 'Je suis sur le terrain et l\'intervention est en cours.',
    icon: <IconTool size={18} color="#92400E" />,
    bg: '#FFF3E0', text: '#92400E', border: '#FCD34D',
  },
  {
    key: 'suspendu', label: 'Suspendre l\'intervention',
    desc: 'Travaux en attente (budget, permission, matériel manquant).',
    icon: <IconPlayerPause size={18} color="#991B1B" />,
    bg: COLORS.semantic.danger.bg, text: COLORS.semantic.danger.text, border: '#FECACA',
  },
  {
    key: 'programme', label: 'Programmer pour plus tard',
    desc: 'Fixer une date d\'intervention future.',
    icon: <IconCalendar size={18} color="#5B21B6" />,
    bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE',
  },
  {
    key: 'resolu-sed', label: 'Résolu par SED',
    desc: 'L\'intervention est terminée et le problème est résolu.',
    icon: <IconCircleCheck size={18} color="#166534" />,
    bg: COLORS.semantic.success.bg, text: COLORS.semantic.success.text, border: '#BBF7D0',
  },
]

export function SEDStatusUpdate() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const tickets    = useTicketStore((s) => s.tickets)
  const startSED   = useTicketStore((s) => s.startSED)
  const user       = useAuthStore((s) => s.user)

  const ticket = tickets.find((t) => t.id === id)
  const [selected, setSelected] = useState<SEDAction | null>(null)
  const [saving,   setSaving]   = useState(false)

  if (!ticket) return null

  const handleConfirm = async () => {
    if (!selected) return
    setSaving(true)
    if (selected === 'en-cours-sed') {
      await startSED(ticket.id, user?.id ?? 'sed-1', user?.name ?? 'Agent SED')
      navigate(`/sed/ticket/${ticket.id}`)
    } else if (selected === 'resolu-sed') {
      navigate(`/sed/ticket/${ticket.id}/rapport`)
    } else if (selected === 'suspendu') {
      navigate(`/sed/ticket/${ticket.id}/rapport?mode=suspendu`)
    } else if (selected === 'programme') {
      navigate(`/sed/ticket/${ticket.id}/programmer`)
    }
    setSaving(false)
  }

  return (
    <MobileLayout
      title="Mise à jour statut SED"
      bottomAction={
        <button
          onClick={handleConfirm}
          disabled={!selected || saving}
          style={{
            width: '100%', height: '52px',
            background: selected ? COLORS.brand.blue : COLORS.border.default,
            color: selected ? '#fff' : COLORS.text.muted,
            border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 500,
            cursor: selected ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'background .2s',
          }}
        >
          {saving ? 'Enregistrement…' : 'Confirmer'}
        </button>
      }
    >
      {/* Ticket recap */}
      <div style={{ background: COLORS.bg.surface, borderRadius: '12px', border: `0.5px solid ${COLORS.border.default}`, padding: '12px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontFamily: 'monospace', color: COLORS.text.muted, marginBottom: '4px' }}>#{ticket.id}</div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '6px' }}>{ticket.clientName}</div>
        <div style={{ fontSize: '12px', color: COLORS.text.secondary, marginBottom: '8px' }}>{ticket.subCategory}</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <SeverityBadge severity={ticket.severity} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '12px' }}>
        Choisir une action :
      </div>

      {ACTIONS.map((action) => (
        <div
          key={action.key}
          onClick={() => setSelected(action.key)}
          style={{
            padding: '14px', borderRadius: '12px', marginBottom: '10px', cursor: 'pointer',
            border: `1.5px solid ${selected === action.key ? action.border : COLORS.border.default}`,
            background: selected === action.key ? action.bg : COLORS.bg.surface,
            display: 'flex', alignItems: 'flex-start', gap: '12px', transition: 'all .15s',
          }}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `0.5px solid ${action.border}` }}>
            {action.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: selected === action.key ? action.text : COLORS.text.primary, marginBottom: '3px' }}>{action.label}</div>
            <div style={{ fontSize: '11px', color: COLORS.text.secondary, lineHeight: 1.5 }}>{action.desc}</div>
          </div>
          <div style={{
            width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
            border: `1.5px solid ${selected === action.key ? COLORS.brand.blue : COLORS.border.strong}`,
            background: selected === action.key ? COLORS.brand.blue : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {selected === action.key && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
          </div>
        </div>
      ))}

      {/* Warning for suspend */}
      {selected === 'suspendu' && (
        <div className="animate-up" style={{ background: COLORS.semantic.danger.bg, border: '0.5px solid #FECACA', borderRadius: '10px', padding: '10px 12px', display: 'flex', gap: '8px' }}>
          <IconAlertTriangle size={16} color={COLORS.semantic.danger.text} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div style={{ fontSize: '12px', color: COLORS.semantic.danger.text, lineHeight: 1.5 }}>
            Vous devrez indiquer la raison de la suspension dans l'étape suivante.
          </div>
        </div>
      )}
    </MobileLayout>
  )
}
