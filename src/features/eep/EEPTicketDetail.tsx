import { useNavigate, useParams } from 'react-router-dom'
import { IconMapPin, IconUser, IconPhone, IconFileText, IconAlertTriangle } from '@tabler/icons-react'
import { MobileLayout } from '../../shared/components/MobileLayout'
import { StatusBadge, SeverityBadge } from '../../design-system/components/Badge'
import { COLORS } from '../../design-system/tokens'
import { useTicketStore } from '../../store/ticketStore'
import { useAuthStore } from '../../store/authStore'
import { formatDateTime } from '../../shared/utils/formatDate'

export function EEPTicketDetail() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const tickets    = useTicketStore((s) => s.tickets)
  const markRead   = useTicketStore((s) => s.markReadByEEP)
  const user       = useAuthStore((s) => s.user)

  const ticket = tickets.find((t) => t.id === id)

  if (!ticket) {
    return (
      <MobileLayout title="Ticket introuvable">
        <div style={{ textAlign: 'center', padding: '48px 16px', color: COLORS.text.muted }}>
          <IconAlertTriangle size={32} style={{ marginBottom: '8px', opacity: 0.4 }} />
          <div>Ticket non trouvé</div>
        </div>
      </MobileLayout>
    )
  }

  const canTakeAction = ticket.status === 'nouveau' || ticket.status === 'assigne' || ticket.status === 'lu-eep' || ticket.status === 'en-cours-eep'

  const handlePriseEnCharge = async () => {
    if (ticket.status === 'nouveau' || ticket.status === 'assigne') {
      await markRead(ticket.id, user?.id ?? 'eep-1', user?.name ?? 'Agent EEP')
    }
    navigate(`/eep/ticket/${ticket.id}/statut`)
  }

  return (
    <MobileLayout
      title={ticket.id}
      bottomAction={
        canTakeAction ? (
          <button
            onClick={handlePriseEnCharge}
            style={{
              width: '100%', height: '52px', background: COLORS.brand.blue,
              color: '#fff', border: 'none', borderRadius: '12px',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {ticket.status === 'nouveau' || ticket.status === 'assigne'
              ? 'Prendre en charge'
              : 'Mettre à jour le statut'}
          </button>
        ) : undefined
      }
    >
      {/* Severity + status row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <SeverityBadge severity={ticket.severity} />
        <StatusBadge status={ticket.status} />
      </div>

      {/* Client card */}
      <InfoCard title="Informations client" icon={<IconUser size={16} color={COLORS.semantic.info.text} />}>
        <InfoRow label="Client"   value={ticket.clientName} />
        <InfoRow label="Contrat"  value={ticket.contractNumber} mono />
        <InfoRow label="Téléphone">
          <a href={`tel:${ticket.phone}`} style={{ color: COLORS.brand.blue, textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
            <IconPhone size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            {ticket.phone}
          </a>
        </InfoRow>
      </InfoCard>

      {/* Location card */}
      <InfoCard title="Adresse d'intervention" icon={<IconMapPin size={16} color={COLORS.brand.green} />}>
        <div style={{ fontSize: '13px', color: COLORS.text.primary, lineHeight: 1.6 }}>{ticket.address}</div>
        <div style={{ fontSize: '12px', color: COLORS.text.secondary, marginTop: '4px' }}>
          <span style={{ background: COLORS.semantic.info.bg, color: COLORS.semantic.info.text, padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 500 }}>
            {ticket.sector}
          </span>
        </div>
      </InfoCard>

      {/* Problem card */}
      <InfoCard title="Problème signalé" icon={<IconFileText size={16} color="#C2410C" />}>
        <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '2px' }}>{ticket.category}</div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '8px' }}>{ticket.subCategory}</div>
        {ticket.description && (
          <div style={{ fontSize: '12px', color: COLORS.text.secondary, lineHeight: 1.6, background: COLORS.bg.page, padding: '8px 10px', borderRadius: '8px' }}>
            "{ticket.description}"
          </div>
        )}
      </InfoCard>

      {/* Timeline */}
      <InfoCard title="Chronologie">
        <TimeRow label="Ticket créé"         time={formatDateTime(ticket.createdAt)} />
        {ticket.eepIntervention?.readAt && (
          <TimeRow label="Lu par EEP"         time={formatDateTime(ticket.eepIntervention.readAt)} />
        )}
        {ticket.eepIntervention?.startedAt && (
          <TimeRow label="Intervention débutée" time={formatDateTime(ticket.eepIntervention.startedAt)} />
        )}
        {ticket.eepIntervention?.finishedAt && (
          <TimeRow label="Terminée"            time={formatDateTime(ticket.eepIntervention.finishedAt)} />
        )}
      </InfoCard>

      {/* EEP notes if any */}
      {ticket.eepIntervention?.comments && (
        <InfoCard title="Notes EEP">
          <div style={{ fontSize: '12px', color: COLORS.text.secondary, lineHeight: 1.6 }}>
            {ticket.eepIntervention.comments}
          </div>
        </InfoCard>
      )}
    </MobileLayout>
  )
}

function InfoCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      className="animate-up"
      style={{
        background: COLORS.bg.surface, borderRadius: '14px',
        border: `0.5px solid ${COLORS.border.default}`,
        padding: '14px', marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        {icon}
        <span style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value, mono, children }: { label: string; value?: string; mono?: boolean; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `0.5px solid #F5F5F5` }}>
      <span style={{ fontSize: '12px', color: COLORS.text.muted }}>{label}</span>
      {children ?? (
        <span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, fontFamily: mono ? 'monospace' : 'inherit' }}>
          {value}
        </span>
      )}
    </div>
  )
}

function TimeRow({ label, time }: { label: string; time: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: `0.5px solid #F5F5F5` }}>
      <span style={{ fontSize: '12px', color: COLORS.text.secondary }}>{label}</span>
      <span style={{ fontSize: '11px', color: COLORS.text.muted, fontFamily: 'monospace' }}>{time}</span>
    </div>
  )
}
