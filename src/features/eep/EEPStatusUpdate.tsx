import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconCircleCheck, IconTool, IconArrowRight, IconAlertTriangle } from '@tabler/icons-react'
import { MobileLayout } from '../../shared/components/MobileLayout'
import { StatusBadge, SeverityBadge } from '../../design-system/components/Badge'
import { COLORS } from '../../design-system/tokens'
import { useTicketStore } from '../../store/ticketStore'

type EEPAction = 'lu-eep' | 'en-cours-eep' | 'resolu-eep' | 'refere-sed'

const ACTIONS: { key: EEPAction; label: string; desc: string; icon: React.ReactNode; bg: string; text: string; border: string }[] = [
  {
    key: 'lu-eep', label: 'Lu — En route',
    desc: 'J\'ai pris connaissance du ticket et je me rends sur place.',
    icon: <IconArrowRight size={18} color="#0369A1" />,
    bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD',
  },
  {
    key: 'en-cours-eep', label: 'En cours d\'intervention',
    desc: 'Je suis sur place et l\'intervention est en cours.',
    icon: <IconTool size={18} color="#854D0E" />,
    bg: '#FEFCE8', text: '#854D0E', border: '#FEF08A',
  },
  {
    key: 'resolu-eep', label: 'Résolu par Équipe de Permanance',
    desc: 'L\'intervention est terminée et le problème est résolu.',
    icon: <IconCircleCheck size={18} color="#166534" />,
    bg: '#F0FDF4', text: '#166534', border: '#BBF7D0',
  },
  {
    key: 'refere-sed', label: 'Référer à SED',
    desc: 'Le problème dépasse mes capacités. Renvoi au service SED.',
    icon: <IconAlertTriangle size={18} color="#C2410C" />,
    bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA',
  },
]

export function EEPStatusUpdate() {
  const { id }       = useParams<{ id: string }>()
  const navigate     = useNavigate()
  const tickets      = useTicketStore((s) => s.tickets)
  const startEEP     = useTicketStore((s) => s.startEEP)

  const ticket   = tickets.find((t) => t.id === id)
  const [selected, setSelected] = useState<EEPAction | null>(null)
  const [saving,   setSaving]   = useState(false)

  if (!ticket) return null

  const handleConfirm = async () => {
    if (!selected) return
    setSaving(true)
    if (selected === 'en-cours-eep') {
      await startEEP(ticket.id)
      navigate(`/eep/ticket/${ticket.id}`)
    } else if (selected === 'resolu-eep') {
      navigate(`/eep/ticket/${ticket.id}/rapport`)
    } else if (selected === 'refere-sed') {
      navigate(`/eep/ticket/${ticket.id}/referer`)
    } else {
      navigate(`/eep/ticket/${ticket.id}`)
    }
    setSaving(false)
  }

  return (
    <MobileLayout
      title="Mise à jour du statut"
      bottomAction={
        <button
          onClick={handleConfirm}
          disabled={!selected || saving}
          style={{
            width: '100%', height: '52px',
            background: selected ? COLORS.brand.blue : COLORS.border.default,
            color: selected ? '#fff' : COLORS.text.muted,
            border: 'none', borderRadius: '12px',
            fontSize: '14px', fontWeight: 500,
            cursor: selected ? 'pointer' : 'default',
            fontFamily: 'inherit', transition: 'background .2s',
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
        Choisir la nouvelle action :
      </div>

      {/* Action options */}
      {ACTIONS.map((action) => (
        <div
          key={action.key}
          onClick={() => setSelected(action.key)}
          style={{
            padding: '14px',
            borderRadius: '12px',
            border: `1.5px solid ${selected === action.key ? action.border : COLORS.border.default}`,
            background: selected === action.key ? action.bg : COLORS.bg.surface,
            cursor: 'pointer',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            transition: 'all .15s',
          }}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `0.5px solid ${action.border}` }}>
            {action.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: action.text, marginBottom: '3px' }}>{action.label}</div>
            <div style={{ fontSize: '12px', color: COLORS.text.secondary, lineHeight: 1.5 }}>{action.desc}</div>
          </div>
          <div style={{
            width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
            border: `1.5px solid ${selected === action.key ? COLORS.brand.blue : COLORS.border.strong}`,
            background: selected === action.key ? COLORS.brand.blue : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {selected === action.key && (
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
            )}
          </div>
        </div>
      ))}
    </MobileLayout>
  )
}
