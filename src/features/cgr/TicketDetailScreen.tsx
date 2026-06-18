import { useNavigate, useParams } from 'react-router-dom'
import {
  IconUser, IconMapPin, IconFileText, IconTool, IconShieldCheck,
  IconWrenchOff, IconCircleCheck, IconPhone, IconArrowRight,
  IconClock, IconAlertTriangle, IconChevronRight,
} from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { StatusBadge, SeverityBadge } from '../../design-system/components/Badge'
import { COLORS } from '../../design-system/tokens'
import { useTicketStore } from '../../store/ticketStore'
import { formatDateTime, formatElapsed } from '../../shared/utils/formatDate'
import type { TicketStatus } from '../../shared/types/status'
import { STATUS_LABELS } from '../../shared/types/status'

const STATUS_FLOW: TicketStatus[] = [
  'nouveau', 'lu-eep', 'en-cours-eep', 'resolu-eep', 'ferme',
]
const STATUS_FLOW_SED: TicketStatus[] = [
  'nouveau', 'lu-eep', 'en-cours-eep', 'refere-sed',
  'attente-approbation', 'approuve-sed', 'en-cours-sed', 'resolu-sed', 'ferme',
]

export function TicketDetailScreen() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const tickets  = useTicketStore((s) => s.tickets)
  const ticket   = tickets.find((t) => t.id === id)

  if (!ticket) {
    return (
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px' }}>
        <NavBar title="Centre de Gestion des Réclamations" notifCount={3} />
        <div style={{ textAlign: 'center', padding: '80px', color: COLORS.text.muted }}>
          <IconAlertTriangle size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <div style={{ fontSize: '16px' }}>Ticket introuvable</div>
        </div>
      </div>
    )
  }

  const isSEDPath = ticket.status === 'refere-sed' || ticket.status === 'attente-approbation' ||
    ticket.status === 'approuve-sed' || ticket.status === 'en-cours-sed' || ticket.status === 'resolu-sed'
  const flow = isSEDPath ? STATUS_FLOW_SED : STATUS_FLOW
  const currentIdx = flow.indexOf(ticket.status)

  const canClose = ticket.status === 'resolu-eep' || ticket.status === 'resolu-sed'

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Centre de Gestion des Réclamations" notifCount={3} />

      <div style={{ paddingTop: '24px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: COLORS.text.muted, marginBottom: '20px' }}>
          <span onClick={() => navigate('/cgr/dashboard')} style={{ cursor: 'pointer', color: COLORS.brand.blue }}>Tableau de bord</span>
          <span>›</span>
          <span style={{ color: COLORS.text.primary, fontWeight: 500, fontFamily: 'monospace' }}>#{ticket.id}</span>
        </div>

        {/* Header card */}
        <div
          className="animate-up"
          style={{
            background: COLORS.bg.surface, borderRadius: '14px',
            border: `0.5px solid ${COLORS.border.default}`,
            padding: '24px', marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 500, color: COLORS.text.primary, fontFamily: 'monospace' }}>#{ticket.id}</span>
                <SeverityBadge severity={ticket.severity} />
                <StatusBadge status={ticket.status} />
              </div>
              <div style={{ fontSize: '14px', color: COLORS.text.secondary }}>
                Créé le {formatDateTime(ticket.createdAt)} · {formatElapsed(ticket.createdAt)} écoulé(s)
              </div>
            </div>
            {canClose && (
              <button
                onClick={() => navigate(`/cgr/ticket/${ticket.id}/cloture`)}
                style={{
                  height: '40px', background: COLORS.brand.green, color: '#fff',
                  border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                  cursor: 'pointer', padding: '0 18px', display: 'inline-flex',
                  alignItems: 'center', gap: '6px', fontFamily: 'inherit',
                }}
              >
                <IconPhone size={15} /> Appeler &amp; Clôturer
              </button>
            )}
          </div>

          {/* Status flow */}
          <div style={{ marginTop: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content' }}>
              {flow.map((s, i) => {
                const done    = i < currentIdx
                const current = i === currentIdx
                const future  = i > currentIdx
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                        background: done ? COLORS.brand.green : current ? COLORS.brand.blue : COLORS.border.default,
                        color: future ? COLORS.text.muted : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 500,
                        border: current ? `2px solid ${COLORS.brand.blue}` : 'none',
                        boxShadow: current ? `0 0 0 3px rgba(13,43,94,0.15)` : 'none',
                      }}>
                        {done ? '✓' : i + 1}
                      </div>
                      <span style={{ fontSize: '10px', color: future ? COLORS.text.muted : done ? COLORS.brand.green : COLORS.brand.blue, whiteSpace: 'nowrap', maxWidth: '80px', textAlign: 'center', lineHeight: 1.3 }}>
                        {STATUS_LABELS[s]}
                      </span>
                    </div>
                    {i < flow.length - 1 && (
                      <div style={{ width: '32px', height: '1.5px', background: done ? COLORS.brand.green : COLORS.border.default, margin: '0 4px', marginBottom: '14px', flexShrink: 0 }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }} className="detail-layout">

          {/* Left column — timeline sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Section A — Client */}
            <Section letter="A" title="Informations client" icon={<IconUser size={16} color={COLORS.semantic.info.text} />} iconBg={COLORS.semantic.info.bg}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="info-grid-2">
                <InfoCell label="Nom client"       value={ticket.clientName} />
                <InfoCell label="N° contrat"       value={ticket.contractNumber} mono />
                <InfoCell label="Téléphone">
                  <a href={`tel:${ticket.phone}`} style={{ color: COLORS.brand.blue, textDecoration: 'none', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconPhone size={13} /> {ticket.phone}
                  </a>
                </InfoCell>
                <InfoCell label="Secteur"          value={ticket.sector} />
                <InfoCell label="Adresse" colSpan   value={ticket.address} />
              </div>
            </Section>

            {/* Section B — Problem */}
            <Section letter="B" title="Problème signalé" icon={<IconFileText size={16} color="#C2410C" />} iconBg="#FFF7ED">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="info-grid-2">
                <InfoCell label="Catégorie"     value={ticket.category} />
                <InfoCell label="Sous-catégorie" value={ticket.subCategory} />
              </div>
              {ticket.description && (
                <div style={{ marginTop: '12px', background: COLORS.bg.page, borderRadius: '8px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>Description client</div>
                  <div style={{ fontSize: '13px', color: COLORS.text.secondary, lineHeight: 1.6 }}>"{ticket.description}"</div>
                </div>
              )}
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontSize: '12px', color: COLORS.text.muted }}>Pré-check MT :</div>
                <CheckPill ok={ticket.preCheckMT} label={ticket.preCheckMT ? 'Confirmé' : 'Non vérifié'} />
                <div style={{ fontSize: '12px', color: COLORS.text.muted }}>Coupure programmée :</div>
                <CheckPill ok={ticket.preCheckProgramme} label={ticket.preCheckProgramme ? 'Confirmé' : 'Non vérifié'} />
              </div>
            </Section>

            {/* Section D — EEP Intervention */}
            {ticket.eepIntervention && (
              <Section letter="D" title="Intervention EEP" icon={<IconTool size={16} color="#854D0E" />} iconBg={COLORS.severity.moyenne.bg}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }} className="info-grid-2">
                  <InfoCell label="Agent EEP" value={ticket.eepIntervention.agentName} />
                  <InfoCell label="Résultat">
                    {ticket.eepIntervention.result ? (
                      <span style={{
                        fontSize: '12px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px',
                        background: ticket.eepIntervention.result === 'resolu' ? COLORS.semantic.success.bg : '#FFF7ED',
                        color: ticket.eepIntervention.result === 'resolu' ? COLORS.semantic.success.text : '#C2410C',
                        border: `0.5px solid ${ticket.eepIntervention.result === 'resolu' ? '#BBF7D0' : '#FED7AA'}`,
                      }}>
                        {ticket.eepIntervention.result === 'resolu' ? '✓ Résolu' : '→ Référé SED'}
                      </span>
                    ) : <span style={{ fontSize: '12px', color: COLORS.text.muted }}>En cours</span>}
                  </InfoCell>
                  {ticket.eepIntervention.readAt && (
                    <InfoCell label="Lu à" value={formatDateTime(ticket.eepIntervention.readAt)} />
                  )}
                  {ticket.eepIntervention.startedAt && (
                    <InfoCell label="Début" value={formatDateTime(ticket.eepIntervention.startedAt)} />
                  )}
                  {ticket.eepIntervention.finishedAt && (
                    <InfoCell label="Fin" value={formatDateTime(ticket.eepIntervention.finishedAt)} />
                  )}
                  {ticket.eepIntervention.startedAt && ticket.eepIntervention.finishedAt && (
                    <InfoCell label="Durée EEP">
                      <span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.brand.blue }}>
                        {Math.round((new Date(ticket.eepIntervention.finishedAt).getTime() - new Date(ticket.eepIntervention.startedAt).getTime()) / 60000)} min
                      </span>
                    </InfoCell>
                  )}
                </div>
                {ticket.eepIntervention.actions && (
                  <div style={{ background: COLORS.bg.page, borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
                    <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>Actions effectuées</div>
                    <div style={{ fontSize: '13px', color: COLORS.text.primary, lineHeight: 1.6 }}>{ticket.eepIntervention.actions}</div>
                  </div>
                )}
                {ticket.eepIntervention.comments && (
                  <div style={{ background: COLORS.bg.page, borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>Commentaires EEP</div>
                    <div style={{ fontSize: '13px', color: COLORS.text.secondary, lineHeight: 1.6 }}>{ticket.eepIntervention.comments}</div>
                  </div>
                )}
              </Section>
            )}

            {/* Section E — Coordinator Approval */}
            {ticket.coordinatorApproval && (
              <Section letter="E" title="Approbation Coordinateur" icon={<IconShieldCheck size={16} color="#5B21B6" />} iconBg="#F5F3FF">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="info-grid-2">
                  <InfoCell label="Coordinateur" value={ticket.coordinatorApproval.coordinatorName || '—'} />
                  <InfoCell label="Décision">
                    {ticket.coordinatorApproval.decision ? (
                      <span style={{
                        fontSize: '12px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px',
                        background: ticket.coordinatorApproval.decision === 'approuve' ? COLORS.semantic.success.bg : COLORS.semantic.danger.bg,
                        color: ticket.coordinatorApproval.decision === 'approuve' ? COLORS.semantic.success.text : COLORS.semantic.danger.text,
                        border: `0.5px solid ${ticket.coordinatorApproval.decision === 'approuve' ? '#BBF7D0' : '#FECACA'}`,
                      }}>
                        {ticket.coordinatorApproval.decision === 'approuve' ? '✓ Approuvé' : '✕ Refusé'}
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#C2410C', fontWeight: 500 }}>En attente</span>
                    )}
                  </InfoCell>
                  <InfoCell label="Référé le" value={formatDateTime(ticket.coordinatorApproval.referredAt)} />
                  {ticket.coordinatorApproval.reviewedAt && (
                    <InfoCell label="Traité le" value={formatDateTime(ticket.coordinatorApproval.reviewedAt)} />
                  )}
                </div>
                {ticket.coordinatorApproval.comments && (
                  <div style={{ background: COLORS.bg.page, borderRadius: '8px', padding: '10px 12px', marginTop: '10px' }}>
                    <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>Notes coordinateur</div>
                    <div style={{ fontSize: '13px', color: COLORS.text.secondary, lineHeight: 1.6 }}>{ticket.coordinatorApproval.comments}</div>
                  </div>
                )}
              </Section>
            )}

            {/* Section F — SED Intervention */}
            {ticket.sedIntervention && (
              <Section letter="F" title="Intervention SED" icon={<IconWrenchOff size={16} color="#7C2D12" />} iconBg="#FED7AA">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }} className="info-grid-2">
                  <InfoCell label="Agent SED"    value={ticket.sedIntervention.agentName} />
                  <InfoCell label="Reçu le"      value={formatDateTime(ticket.sedIntervention.receivedAt)} />
                  {ticket.sedIntervention.startedAt && (
                    <InfoCell label="Début" value={formatDateTime(ticket.sedIntervention.startedAt)} />
                  )}
                  {ticket.sedIntervention.finishedAt && (
                    <InfoCell label="Fin"   value={formatDateTime(ticket.sedIntervention.finishedAt)} />
                  )}
                  {ticket.sedIntervention.result && (
                    <InfoCell label="Résultat">
                      <ResultPill result={ticket.sedIntervention.result} />
                    </InfoCell>
                  )}
                  {ticket.sedIntervention.scheduledDate && (
                    <InfoCell label="Programmé le" value={formatDateTime(ticket.sedIntervention.scheduledDate)} />
                  )}
                </div>
                {ticket.sedIntervention.suspensionReason && (
                  <div style={{ background: COLORS.severity.critique.bg, borderRadius: '8px', padding: '10px 12px', marginBottom: '8px', border: `0.5px solid ${COLORS.severity.critique.border}` }}>
                    <div style={{ fontSize: '11px', color: COLORS.severity.critique.text, fontWeight: 500, marginBottom: '4px' }}>Raison suspension</div>
                    <div style={{ fontSize: '13px', color: COLORS.severity.critique.text, lineHeight: 1.6 }}>{ticket.sedIntervention.suspensionReason}</div>
                  </div>
                )}
                {ticket.sedIntervention.report && (
                  <div style={{ background: COLORS.bg.page, borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>Rapport SED</div>
                    <div style={{ fontSize: '13px', color: COLORS.text.primary, lineHeight: 1.6 }}>{ticket.sedIntervention.report}</div>
                  </div>
                )}
              </Section>
            )}

            {/* Section G — Closure */}
            {ticket.closure && (
              <Section letter="G" title="Clôture définitive" icon={<IconCircleCheck size={16} color={COLORS.semantic.success.text} />} iconBg={COLORS.semantic.success.bg}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="info-grid-2">
                  <InfoCell label="Appel client">
                    <CheckPill ok={ticket.closure.clientCalled} label={ticket.closure.clientCalled ? 'Effectué' : 'Non effectué'} />
                  </InfoCell>
                  <InfoCell label="Clôturé le" value={formatDateTime(ticket.closure.closedAt)} />
                  {ticket.closure.satisfaction && (
                    <InfoCell label="Satisfaction client">
                      <SatisfactionPill value={ticket.closure.satisfaction} />
                    </InfoCell>
                  )}
                </div>
                {ticket.closure.comments && (
                  <div style={{ background: COLORS.bg.page, borderRadius: '8px', padding: '10px 12px', marginTop: '10px' }}>
                    <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>Commentaires de clôture</div>
                    <div style={{ fontSize: '13px', color: COLORS.text.secondary, lineHeight: 1.6 }}>{ticket.closure.comments}</div>
                  </div>
                )}
              </Section>
            )}
          </div>

          {/* Right sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Quick info */}
            <div style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '18px' }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconClock size={15} color={COLORS.text.secondary} /> Chronologie
              </div>
              <TimelineItem dot={COLORS.brand.blue}  label="Ticket créé"              time={formatDateTime(ticket.createdAt)} />
              {ticket.eepIntervention?.readAt && (
                <TimelineItem dot="#60A5FA"            label="Lu par EEP"              time={formatDateTime(ticket.eepIntervention.readAt)} />
              )}
              {ticket.eepIntervention?.startedAt && (
                <TimelineItem dot="#EAB308"            label="Intervention EEP débutée" time={formatDateTime(ticket.eepIntervention.startedAt)} />
              )}
              {ticket.eepIntervention?.finishedAt && (
                <TimelineItem dot={ticket.eepIntervention.result === 'resolu' ? COLORS.brand.green : '#F97316'} label={ticket.eepIntervention.result === 'resolu' ? 'Résolu par EEP' : 'Référé à SED'} time={formatDateTime(ticket.eepIntervention.finishedAt)} />
              )}
              {ticket.coordinatorApproval?.reviewedAt && ticket.coordinatorApproval.decision && (
                <TimelineItem dot="#8B5CF6" label={`${ticket.coordinatorApproval.decision === 'approuve' ? 'Approuvé' : 'Refusé'} par coord.`} time={formatDateTime(ticket.coordinatorApproval.reviewedAt)} />
              )}
              {ticket.sedIntervention?.startedAt && (
                <TimelineItem dot="#DC7609" label="Intervention SED débutée" time={formatDateTime(ticket.sedIntervention.startedAt)} />
              )}
              {ticket.sedIntervention?.finishedAt && (
                <TimelineItem dot={COLORS.brand.green} label="Résolu par SED" time={formatDateTime(ticket.sedIntervention.finishedAt)} />
              )}
              {ticket.closure?.closedAt && (
                <TimelineItem dot="#16A34A" label="Fermé définitivement" time={formatDateTime(ticket.closure.closedAt)} last />
              )}
            </div>

            {/* Actions */}
            {canClose && (
              <div style={{ background: COLORS.semantic.success.bg, borderRadius: '14px', border: '0.5px solid #BBF7D0', padding: '18px' }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.semantic.success.text, marginBottom: '8px' }}>
                  ✓ Ticket résolu — Action requise
                </div>
                <div style={{ fontSize: '12px', color: COLORS.semantic.success.text, lineHeight: 1.5, marginBottom: '14px', opacity: 0.85 }}>
                  Appelez le client pour confirmer que le problème est résolu, puis clôturez définitivement le ticket.
                </div>
                <button
                  onClick={() => navigate(`/cgr/ticket/${ticket.id}/cloture`)}
                  style={{
                    width: '100%', height: '40px', background: COLORS.brand.green, color: '#fff',
                    border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '6px', fontFamily: 'inherit',
                  }}
                >
                  <IconPhone size={15} /> Appeler &amp; Clôturer <IconArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Back */}
            <button
              onClick={() => navigate('/cgr/dashboard')}
              style={{
                width: '100%', height: '36px', background: COLORS.bg.surface, color: COLORS.text.secondary,
                border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', fontSize: '13px',
                cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '6px',
              }}
            >
              <IconChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /> Retour au tableau de bord
            </button>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) { .detail-layout { grid-template-columns: 1fr !important; } }
        @media (max-width: 600px)  { .info-grid-2   { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

/* ── Sub-components ── */

function Section({ letter, title, icon, iconBg, children }: {
  letter: string; title: string; icon: React.ReactNode; iconBg: string; children: React.ReactNode
}) {
  return (
    <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: COLORS.brand.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 500, flexShrink: 0 }}>
          {letter}
        </div>
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
        <span style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function InfoCell({ label, value, mono, colSpan, children }: {
  label: string; value?: string; mono?: boolean; colSpan?: boolean; children?: React.ReactNode
}) {
  return (
    <div style={{ gridColumn: colSpan ? '1 / -1' : undefined }}>
      <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
      {children ?? (
        <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, fontFamily: mono ? 'monospace' : 'inherit' }}>
          {value ?? '—'}
        </div>
      )}
    </div>
  )
}

function CheckPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span style={{
      fontSize: '12px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px',
      background: ok ? COLORS.semantic.success.bg : COLORS.semantic.danger.bg,
      color: ok ? COLORS.semantic.success.text : COLORS.semantic.danger.text,
      border: `0.5px solid ${ok ? '#BBF7D0' : '#FECACA'}`,
    }}>
      {ok ? '✓' : '✕'} {label}
    </span>
  )
}

function ResultPill({ result }: { result: string }) {
  const map: Record<string, { bg: string; text: string; border: string; label: string }> = {
    resolu:   { bg: COLORS.semantic.success.bg, text: COLORS.semantic.success.text, border: '#BBF7D0', label: '✓ Résolu' },
    suspendu: { bg: COLORS.semantic.danger.bg,  text: COLORS.semantic.danger.text,  border: '#FECACA', label: '⏸ Suspendu' },
    programme:{ bg: '#F5F3FF',                  text: '#5B21B6',                    border: '#DDD6FE', label: '📅 Programmé' },
  }
  const c = map[result] ?? map.resolu
  return <span style={{ fontSize: '12px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px', background: c.bg, color: c.text, border: `0.5px solid ${c.border}` }}>{c.label}</span>
}

function SatisfactionPill({ value }: { value: string }) {
  const map: Record<string, { label: string; color: string }> = {
    'satisfait':           { label: '😊 Satisfait',           color: COLORS.semantic.success.text },
    'probleme-persistant': { label: '⚠️ Problème persistant', color: '#C2410C' },
    'remarques':           { label: '📝 Remarques',           color: COLORS.text.secondary },
  }
  const c = map[value] ?? { label: value, color: COLORS.text.secondary }
  return <span style={{ fontSize: '13px', fontWeight: 500, color: c.color }}>{c.label}</span>
}

function TimelineItem({ dot, label, time, last }: { dot: string; label: string; time: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: '10px', paddingBottom: last ? 0 : '12px', position: 'relative' }}>
      {!last && <div style={{ position: 'absolute', left: '7px', top: '16px', bottom: 0, width: '1.5px', background: COLORS.border.default }} />}
      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: dot, flexShrink: 0, marginTop: '1px', position: 'relative', zIndex: 1 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.primary }}>{label}</div>
        <div style={{ fontSize: '11px', color: COLORS.text.muted, fontFamily: 'monospace' }}>{time}</div>
      </div>
    </div>
  )
}
