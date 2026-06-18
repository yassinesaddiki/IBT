import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  IconShieldCheck, IconShieldX, IconTool, IconUser, IconMapPin,
  IconAlertTriangle, IconCircleCheck, IconChevronRight,
} from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { StatusBadge, SeverityBadge } from '../../design-system/components/Badge'
import { COLORS } from '../../design-system/tokens'
import { useTicketStore } from '../../store/ticketStore'
import { useAuthStore } from '../../store/authStore'
import { formatDateTime, formatElapsed } from '../../shared/utils/formatDate'

export function ApprovalScreen() {
  const { id }         = useParams<{ id: string }>()
  const navigate       = useNavigate()
  const tickets        = useTicketStore((s) => s.tickets)
  const updateStatus   = useTicketStore((s) => s.updateStatus)
  const user           = useAuthStore((s) => s.user)

  const ticket = tickets.find((t) => t.id === id)

  const [decision,  setDecision]  = useState<'approuve' | 'refuse' | ''>('')
  const [comments,  setComments]  = useState('')
  const [saving,    setSaving]    = useState(false)
  const [done,      setDone]      = useState(false)
  const [error,     setError]     = useState('')

  if (!ticket) {
    return (
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px' }}>
        <NavBar title="Coordinateur" />
        <div style={{ textAlign: 'center', padding: '80px', color: COLORS.text.muted }}>
          <IconAlertTriangle size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <div>Ticket introuvable</div>
        </div>
      </div>
    )
  }

  const handleSubmit = () => {
    if (!decision) { setError('Sélectionnez une décision avant de confirmer.'); return }
    setError('')
    setSaving(true)
    setTimeout(() => {
      updateStatus(ticket.id, decision === 'approuve' ? 'approuve-sed' : 'en-cours-eep')
      setDone(true)
      setTimeout(() => navigate('/coordinator/dashboard'), 1400)
    }, 900)
  }

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Coordinateur" notifCount={1} />

      <div style={{ paddingTop: '24px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: COLORS.text.muted, marginBottom: '20px' }}>
          <span onClick={() => navigate('/coordinator/dashboard')} style={{ cursor: 'pointer', color: COLORS.brand.blue }}>Tableau de bord</span>
          <span>›</span>
          <span style={{ color: COLORS.text.primary, fontWeight: 500 }}>Approbation référence EEP→SED</span>
        </div>

        <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '6px' }}>
          Approbation de référence EEP → SED
        </div>
        <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginBottom: '28px' }}>
          Examinez le rapport EEP et décidez d'approuver ou de refuser le transfert vers l'équipe SED.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }} className="approval-layout">

          {/* Left — full report */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Ticket header */}
            <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.severity.haute.border}`, padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', color: COLORS.text.muted, marginBottom: '4px' }}>#{ticket.id}</div>
                  <div style={{ fontSize: '18px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '6px' }}>{ticket.clientName}</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <SeverityBadge severity={ticket.severity} />
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>Créé il y a</div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: COLORS.text.primary }}>{formatElapsed(ticket.createdAt)}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', paddingTop: '14px', borderTop: `0.5px solid ${COLORS.border.default}` }}>
                <div>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '3px' }}>Secteur</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{ticket.sector}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '3px' }}>Catégorie</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{ticket.category}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '3px' }}>Sous-catégorie</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{ticket.subCategory}</div>
                </div>
              </div>
            </div>

            {/* Client info */}
            <SectionCard title="Informations client" icon={<IconUser size={16} color={COLORS.semantic.info.text} />} iconBg={COLORS.semantic.info.bg}>
              <InfoGrid>
                <InfoItem label="Client"    value={ticket.clientName} />
                <InfoItem label="Contrat"   value={ticket.contractNumber} mono />
                <InfoItem label="Téléphone" value={ticket.phone} />
                <InfoItem label="Adresse"   value={ticket.address} />
              </InfoGrid>
            </SectionCard>

            {/* EEP report — the key section */}
            {ticket.eepIntervention ? (
              <SectionCard
                title="Rapport d'intervention EEP"
                icon={<IconTool size={16} color="#854D0E" />}
                iconBg={COLORS.severity.moyenne.bg}
                accent
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '3px' }}>Agent EEP</div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{ticket.eepIntervention.agentName}</div>
                  </div>
                  {ticket.eepIntervention.startedAt && (
                    <div>
                      <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '3px' }}>Début intervention</div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.primary, fontFamily: 'monospace' }}>{formatDateTime(ticket.eepIntervention.startedAt)}</div>
                    </div>
                  )}
                  {ticket.eepIntervention.finishedAt && (
                    <div>
                      <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '3px' }}>Fin intervention</div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.primary, fontFamily: 'monospace' }}>{formatDateTime(ticket.eepIntervention.finishedAt)}</div>
                    </div>
                  )}
                </div>

                {ticket.eepIntervention.actions && (
                  <div style={{ background: COLORS.bg.page, borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', color: COLORS.text.muted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '8px' }}>
                      Actions effectuées par EEP
                    </div>
                    <div style={{ fontSize: '13px', color: COLORS.text.primary, lineHeight: 1.7 }}>
                      {ticket.eepIntervention.actions}
                    </div>
                  </div>
                )}

                {ticket.eepIntervention.comments && (
                  <div style={{ background: COLORS.severity.haute.bg, border: `0.5px solid ${COLORS.severity.haute.border}`, borderRadius: '10px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '11px', color: COLORS.severity.haute.text, fontWeight: 500, marginBottom: '6px' }}>
                      ⚠️ Observations / Raison du renvoi
                    </div>
                    <div style={{ fontSize: '13px', color: COLORS.severity.haute.text, lineHeight: 1.6 }}>
                      {ticket.eepIntervention.comments}
                    </div>
                  </div>
                )}
              </SectionCard>
            ) : (
              <div style={{ background: COLORS.severity.haute.bg, border: `0.5px solid ${COLORS.severity.haute.border}`, borderRadius: '12px', padding: '16px', display: 'flex', gap: '10px' }}>
                <IconAlertTriangle size={18} color="#C2410C" />
                <div style={{ fontSize: '13px', color: '#C2410C' }}>Aucun rapport EEP disponible pour ce ticket.</div>
              </div>
            )}

            {/* Address */}
            <SectionCard title="Localisation" icon={<IconMapPin size={16} color={COLORS.brand.green} />} iconBg="#DCFCE7">
              <div style={{ fontSize: '14px', color: COLORS.text.primary, lineHeight: 1.6 }}>{ticket.address}</div>
              <div style={{ marginTop: '8px' }}>
                <span style={{ background: COLORS.semantic.info.bg, color: COLORS.semantic.info.text, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>
                  {ticket.sector}
                </span>
              </div>
            </SectionCard>

          </div>

          {/* Right — decision panel */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Decision card */}
            <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '6px' }}>Décision</div>
              <div style={{ fontSize: '12px', color: COLORS.text.secondary, marginBottom: '16px', lineHeight: 1.5 }}>
                Cette décision sera notifiée à l'agent EEP, à l'équipe CGR, et si approuvée, à l'équipe SED.
              </div>

              {/* Approve */}
              <div
                onClick={() => setDecision('approuve')}
                style={{
                  padding: '14px', borderRadius: '10px', cursor: 'pointer', marginBottom: '10px',
                  border: `1.5px solid ${decision === 'approuve' ? '#BBF7D0' : COLORS.border.default}`,
                  background: decision === 'approuve' ? COLORS.semantic.success.bg : COLORS.bg.surface,
                  transition: 'all .15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: COLORS.semantic.success.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `0.5px solid #BBF7D0`, flexShrink: 0 }}>
                    <IconShieldCheck size={20} color={COLORS.semantic.success.text} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: decision === 'approuve' ? COLORS.semantic.success.text : COLORS.text.primary }}>
                      ✓ Approuver → SED
                    </div>
                    <div style={{ fontSize: '11px', color: COLORS.text.secondary, marginTop: '2px', lineHeight: 1.4 }}>
                      Le ticket est transféré à l'équipe SED pour intervention.
                    </div>
                  </div>
                  <Radio checked={decision === 'approuve'} />
                </div>
              </div>

              {/* Reject */}
              <div
                onClick={() => setDecision('refuse')}
                style={{
                  padding: '14px', borderRadius: '10px', cursor: 'pointer', marginBottom: '16px',
                  border: `1.5px solid ${decision === 'refuse' ? '#FECACA' : COLORS.border.default}`,
                  background: decision === 'refuse' ? COLORS.semantic.danger.bg : COLORS.bg.surface,
                  transition: 'all .15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: COLORS.semantic.danger.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `0.5px solid #FECACA`, flexShrink: 0 }}>
                    <IconShieldX size={20} color={COLORS.semantic.danger.text} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: decision === 'refuse' ? COLORS.semantic.danger.text : COLORS.text.primary }}>
                      ✕ Refuser — Retour EEP
                    </div>
                    <div style={{ fontSize: '11px', color: COLORS.text.secondary, marginTop: '2px', lineHeight: 1.4 }}>
                      Le ticket est retourné à l'équipe EEP avec les instructions du coordinateur.
                    </div>
                  </div>
                  <Radio checked={decision === 'refuse'} color="#EF4444" />
                </div>
              </div>

              {/* Comments */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                  Commentaires coordinateur
                  {decision === 'refuse' && <span style={{ color: '#EF4444', marginLeft: '3px' }}>*</span>}
                  {decision === 'approuve' && <span style={{ fontSize: '11px', color: COLORS.text.muted, fontWeight: 400, marginLeft: '4px' }}>(optionnel)</span>}
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={
                    decision === 'refuse'
                      ? 'Expliquez pourquoi vous refusez et ce que l\'EEP doit faire…'
                      : 'Instructions pour l\'équipe SED (optionnel)…'
                  }
                  rows={3}
                  style={{
                    width: '100%', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px',
                    padding: '10px 12px', fontSize: '13px', color: COLORS.text.primary,
                    background: COLORS.bg.surface, outline: 'none', resize: 'none',
                    fontFamily: 'inherit', lineHeight: 1.6,
                  }}
                />
              </div>

              {/* Coordinator info */}
              <div style={{ background: COLORS.bg.page, borderRadius: '8px', padding: '8px 12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: COLORS.semantic.info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 500, color: COLORS.semantic.info.text, flexShrink: 0 }}>
                  {user?.initials ?? '?'}
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.primary }}>{user?.name ?? 'Coordinateur'}</div>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted }}>Responsable de la décision</div>
                </div>
              </div>

              {error && (
                <div style={{ background: COLORS.semantic.danger.bg, color: COLORS.semantic.danger.text, fontSize: '12px', padding: '8px 12px', borderRadius: '8px', marginBottom: '12px', border: '0.5px solid #FECACA' }}>
                  {error}
                </div>
              )}

              {/* Action buttons */}
              <button
                onClick={handleSubmit}
                disabled={saving || !decision}
                style={{
                  width: '100%', height: '44px',
                  background: done
                    ? COLORS.brand.green
                    : decision === 'approuve'
                      ? COLORS.brand.green
                      : decision === 'refuse'
                        ? '#EF4444'
                        : COLORS.border.default,
                  color: decision ? '#fff' : COLORS.text.muted,
                  border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 500,
                  cursor: (saving || !decision) ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', fontFamily: 'inherit', transition: 'background .2s',
                }}
              >
                {done ? (
                  <><IconCircleCheck size={16} /> Décision enregistrée !</>
                ) : saving ? (
                  'Enregistrement…'
                ) : decision === 'approuve' ? (
                  <><IconShieldCheck size={16} /> Confirmer l'approbation</>
                ) : decision === 'refuse' ? (
                  <><IconShieldX size={16} /> Confirmer le refus</>
                ) : (
                  'Sélectionner une décision'
                )}
              </button>
            </div>

            {/* Back */}
            <button
              onClick={() => navigate('/coordinator/dashboard')}
              style={{
                width: '100%', height: '36px', background: COLORS.bg.surface, color: COLORS.text.secondary,
                border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', fontSize: '13px',
                cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '6px',
              }}
            >
              <IconChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /> Retour tableau de bord
            </button>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) { .approval-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

/* ── Sub-components ── */

function SectionCard({ title, icon, iconBg, accent, children }: {
  title: string; icon: React.ReactNode; iconBg: string; accent?: boolean; children: React.ReactNode
}) {
  return (
    <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${accent ? COLORS.severity.moyenne.border : COLORS.border.default}`, padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
        <span style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary }}>{title}</span>
        {accent && <span style={{ fontSize: '11px', color: COLORS.severity.moyenne.text, background: COLORS.severity.moyenne.bg, border: `0.5px solid ${COLORS.severity.moyenne.border}`, padding: '2px 8px', borderRadius: '20px', marginLeft: 'auto' }}>Rapport EEP</span>}
      </div>
      {children}
    </div>
  )
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>{children}</div>
}

function InfoItem({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
      <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, fontFamily: mono ? 'monospace' : 'inherit' }}>{value ?? '—'}</div>
    </div>
  )
}

function Radio({ checked, color = COLORS.brand.blue }: { checked: boolean; color?: string }) {
  return (
    <div style={{ width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, border: `1.5px solid ${checked ? color : COLORS.border.strong}`, background: checked ? color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {checked && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
    </div>
  )
}

