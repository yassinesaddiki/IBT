import { useNavigate, useParams } from 'react-router-dom'
import { IconUser, IconMapPin, IconFileText, IconTool, IconPhone, IconAlertTriangle } from '@tabler/icons-react'
import { MobileLayout } from '../../shared/components/MobileLayout'
import { StatusBadge, SeverityBadge } from '../../design-system/components/Badge'
import { COLORS } from '../../design-system/tokens'
import { useTicketStore } from '../../store/ticketStore'
import { useAuthStore } from '../../store/authStore'
import { useEmployeeByName } from '../../shared/hooks/useEmployee'
import { EmployeeChip } from '../../shared/components/EmployeeChip'
import { PhotoGrid } from '../../shared/components/PhotoGrid'
import { formatDateTime } from '../../shared/utils/formatDate'

export function SEDTicketDetail() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const tickets  = useTicketStore((s) => s.tickets)
  const startSED = useTicketStore((s) => s.startSED)
  const user     = useAuthStore((s) => s.user)

  const ticket      = tickets.find((t) => t.id === id)
  const eepEmployee = useEmployeeByName(ticket?.eepIntervention?.agentName)

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

  const canAct = ticket.status === 'approuve-sed' || ticket.status === 'en-cours-sed' ||
    ticket.status === 'suspendu' || ticket.status === 'programme'

  const handlePriseEnCharge = async () => {
    if (ticket.status === 'approuve-sed') {
      await startSED(ticket.id, user?.id ?? 'sed-1', user?.name ?? 'Agent SED')
    }
    navigate(`/sed/ticket/${ticket.id}/statut`)
  }

  return (
    <MobileLayout
      title={ticket.id}
      bottomAction={
        canAct ? (
          <button
            onClick={handlePriseEnCharge}
            style={{
              width: '100%', height: '52px', background: COLORS.brand.blue,
              color: '#fff', border: 'none', borderRadius: '12px',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {ticket.status === 'approuve-sed' ? 'Prendre en charge' : 'Mettre à jour le statut'}
          </button>
        ) : undefined
      }
    >
      {/* Status row */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <SeverityBadge severity={ticket.severity} />
        <StatusBadge status={ticket.status} />
      </div>

      {/* Client */}
      <MobileCard title="Client" icon={<IconUser size={15} color={COLORS.semantic.info.text} />} iconBg={COLORS.semantic.info.bg}>
        <MRow label="Nom"      value={ticket.clientName} />
        <MRow label="Contrat"  value={ticket.contractNumber} mono />
        <MRow label="Tél.">
          <a href={`tel:${ticket.phone}`} style={{ color: COLORS.brand.blue, textDecoration: 'none', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IconPhone size={12} /> {ticket.phone}
          </a>
        </MRow>
      </MobileCard>

      {/* Location */}
      <MobileCard title="Adresse" icon={<IconMapPin size={15} color={COLORS.brand.green} />} iconBg="#DCFCE7">
        <div style={{ fontSize: '13px', color: COLORS.text.primary, lineHeight: 1.6 }}>{ticket.address}</div>
        <span style={{ display: 'inline-block', marginTop: '6px', background: COLORS.semantic.info.bg, color: COLORS.semantic.info.text, padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 500 }}>
          {ticket.sector}
        </span>
      </MobileCard>

      {/* Problem */}
      <MobileCard title="Problème" icon={<IconFileText size={15} color="#C2410C" />} iconBg="#FFF7ED">
        <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '2px' }}>{ticket.category}</div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '6px' }}>{ticket.subCategory}</div>
        {ticket.description && (
          <div style={{ fontSize: '12px', color: COLORS.text.secondary, background: COLORS.bg.page, padding: '8px', borderRadius: '8px', lineHeight: 1.6 }}>
            "{ticket.description}"
          </div>
        )}
      </MobileCard>

      {/* EEP report — key context for SED */}
      {ticket.eepIntervention && (
        <div
          className="animate-up"
          style={{
            background: COLORS.severity.moyenne.bg,
            border: `0.5px solid ${COLORS.severity.moyenne.border}`,
            borderRadius: '14px', padding: '14px', marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconTool size={14} color="#854D0E" />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#854D0E', textTransform: 'uppercase', letterSpacing: '.05em' }}>Rapport EEP</span>
          </div>
          <MRow label="Agent EP">
            <EmployeeChip empId={eepEmployee?.id} name={ticket.eepIntervention.agentName} matricule={eepEmployee?.matricule} variant="inline" />
          </MRow>
          {ticket.eepIntervention.startedAt && (
            <MRow label="Début EEP" value={formatDateTime(ticket.eepIntervention.startedAt)} />
          )}
          {ticket.eepIntervention.finishedAt && (
            <MRow label="Fin EEP" value={formatDateTime(ticket.eepIntervention.finishedAt)} />
          )}
          {ticket.eepIntervention.actions && (
            <div style={{ marginTop: '8px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px', padding: '8px 10px' }}>
              <div style={{ fontSize: '10px', color: '#854D0E', fontWeight: 500, marginBottom: '4px' }}>Actions EEP</div>
              <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.6 }}>{ticket.eepIntervention.actions}</div>
            </div>
          )}
          {ticket.eepIntervention.comments && (
            <div style={{ marginTop: '8px', background: '#FFF7ED', borderRadius: '8px', padding: '8px 10px', border: `0.5px solid ${COLORS.severity.haute.border}` }}>
              <div style={{ fontSize: '10px', color: '#C2410C', fontWeight: 500, marginBottom: '4px' }}>Raison du renvoi à SED</div>
              <div style={{ fontSize: '12px', color: '#C2410C', lineHeight: 1.6 }}>{ticket.eepIntervention.comments}</div>
            </div>
          )}
          {(ticket.eepIntervention.photos?.length ?? 0) > 0 && (
            <div style={{ marginTop: '10px' }}>
              <PhotoGrid photos={ticket.eepIntervention.photos ?? []} label="Photos terrain EP" />
            </div>
          )}
        </div>
      )}

      {/* SED intervention status if started */}
      {ticket.sedIntervention?.startedAt && (
        <MobileCard title="Intervention SED" icon={<IconTool size={15} color="#7C2D12" />} iconBg="#FED7AA">
          <MRow label="Début" value={formatDateTime(ticket.sedIntervention.startedAt)} />
          {ticket.sedIntervention.result && (
            <MRow label="Statut" value={ticket.sedIntervention.result} />
          )}
        </MobileCard>
      )}
    </MobileLayout>
  )
}

function MobileCard({ title, icon, iconBg, children }: { title: string; icon: React.ReactNode; iconBg: string; children: React.ReactNode }) {
  return (
    <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '14px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
        <span style={{ fontSize: '11px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function MRow({ label, value, mono, children }: { label: string; value?: string; mono?: boolean; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: `0.5px solid #F5F5F5` }}>
      <span style={{ fontSize: '12px', color: COLORS.text.muted }}>{label}</span>
      {children ?? <span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, fontFamily: mono ? 'monospace' : 'inherit', textAlign: 'right', maxWidth: '60%' }}>{value}</span>}
    </div>
  )
}
