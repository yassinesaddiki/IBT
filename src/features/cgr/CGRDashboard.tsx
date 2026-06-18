import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconTicket, IconTool, IconCircleCheck, IconClockPause, IconSearch, IconMapPin, IconAdjustmentsHorizontal, IconDownload, IconPhoneCall, IconUsersGroup, IconCalendarEvent, IconEye, IconPhone } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { StatusBadge } from '../../design-system/components/Badge'
import { SeverityBadge } from '../../design-system/components/Badge'
import { COLORS } from '../../design-system/tokens'
import { useTickets } from '../../shared/hooks/useTickets'
import { formatElapsed } from '../../shared/utils/formatDate'
import { DUTY_SCHEDULE, SECTORS } from '../../mock-data/duty-schedule'
import type { TicketStatus } from '../../shared/types/status'

type FilterStatus = TicketStatus | 'tous'

const FILTER_TABS: { key: FilterStatus; label: string }[] = [
  { key: 'tous',                 label: 'Tous' },
  { key: 'nouveau',              label: 'Nouveau' },
  { key: 'en-cours-eep',        label: 'En cours EEP' },
  { key: 'en-cours-sed',        label: 'En cours SED' },
  { key: 'attente-approbation', label: 'Approbation' },
  { key: 'resolu-eep',          label: 'Résolu' },
  { key: 'ferme',               label: 'Fermé' },
]

export function CGRDashboard() {
  const { tickets } = useTickets()
  const navigate    = useNavigate()
  const [filter, setFilter]   = useState<FilterStatus>('tous')
  const [search, setSearch]   = useState('')

  const today = new Date()
  const dateLabel = today.toLocaleDateString('fr-MA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const filtered = tickets.filter((t) => {
    const matchStatus = filter === 'tous' || t.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || t.clientName.toLowerCase().includes(q) || t.id.includes(q) || t.address.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const kpi = {
    today:     tickets.length,
    enCours:   tickets.filter((t) => t.status === 'en-cours-eep' || t.status === 'en-cours-sed').length,
    resolus:   tickets.filter((t) => t.status === 'resolu-eep' || t.status === 'resolu-sed').length,
    attente:   tickets.filter((t) => t.status === 'attente-approbation').length,
  }

  const sev = {
    critique: tickets.filter((t) => t.severity === 'Critique').length,
    haute:    tickets.filter((t) => t.severity === 'Haute').length,
    moyenne:  tickets.filter((t) => t.severity === 'Moyenne').length,
  }

  const pendingClosure = tickets.filter((t) => t.status === 'resolu-eep' || t.status === 'resolu-sed')

  const tabCount = (key: FilterStatus) =>
    key === 'tous' ? tickets.length : tickets.filter((t) => t.status === key).length

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>

      {/* Nav */}
      <NavBar
        title="Centre de Gestion des Réclamations"
        ctaLabel="+ Nouveau Appel"
        onCtaClick={() => navigate('/cgr/precheck')}
        notifCount={3}
      />

      <div style={{ paddingTop: '24px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 500, color: COLORS.text.primary }}>Tableau de bord</div>
            <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '2px' }}>Gestion des interventions Basse Tension</div>
          </div>
          <div style={{ fontSize: '13px', color: COLORS.text.secondary, display: 'flex', alignItems: 'center', gap: '6px' }}>
            📅 {dateLabel}
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}
          className="cgr-layout">

          {/* Main column */}
          <div>

            {/* KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' }}
              className="kpi-row">
              <KpiCard icon={<IconTicket size={18} color="#1A3A72" />} iconBg={COLORS.semantic.info.bg}
                label="Tickets aujourd'hui" value={kpi.today}
                trend={<><span style={{ color: '#22C55E' }}>+3</span> vs hier</>} />
              <KpiCard icon={<IconTool size={18} color="#854D0E" />} iconBg={COLORS.severity.moyenne.bg}
                label="En cours" value={kpi.enCours}
                trend={<>{kpi.enCours} actifs</>} />
              <KpiCard icon={<IconCircleCheck size={18} color="#166534" />} iconBg={COLORS.semantic.success.bg}
                label="Résolus ce jour" value={kpi.resolus}
                trend={<>Taux <strong style={{ color: '#166534' }}>{kpi.today ? Math.round(kpi.resolus / kpi.today * 100) : 0}%</strong></>} />
              <KpiCard icon={<IconClockPause size={18} color="#C2410C" />} iconBg={COLORS.severity.haute.bg}
                label="En att. approbation" value={kpi.attente}
                trend={<>Référés SED</>} />
            </div>

            {/* Severity summary */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <SevPill num={sev.critique} label="Critique" color="#991B1B" barColor="#EF4444" />
              <SevPill num={sev.haute}    label="Haute"    color="#C2410C" barColor="#F97316" />
              <SevPill num={sev.moyenne}  label="Moyenne"  color="#854D0E" barColor="#EAB308" />
              <div style={{ flex: 2, background: COLORS.bg.surface, borderRadius: '10px', border: `0.5px solid ${COLORS.border.default}`, padding: '12px 14px' }}>
                <div style={{ fontSize: '12px', color: COLORS.text.secondary, marginBottom: '6px' }}>Durée moy. résolution</div>
                <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary }}>1h 42min</div>
                <div style={{ height: '3px', borderRadius: '2px', marginTop: '8px', background: COLORS.brand.green }} />
              </div>
            </div>

            {/* Ticket table */}
            <div style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, overflow: 'hidden' }}>

              {/* Table controls */}
              <div style={{ padding: '16px 20px', borderBottom: `0.5px solid ${COLORS.border.default}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '15px', fontWeight: 500, color: COLORS.text.primary }}>Tickets du jour</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <IconSearch size={14} color={COLORS.text.muted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Nom, N° contrat, adresse…"
                      style={{
                        height: '34px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px',
                        padding: '0 12px 0 32px', fontSize: '13px', color: COLORS.text.primary,
                        background: COLORS.bg.surface, outline: 'none', fontFamily: 'inherit', width: '200px',
                      }}
                    />
                  </div>
                  <FilterBtn icon={<IconMapPin size={14} />} label="Secteur" />
                  <FilterBtn icon={<IconAdjustmentsHorizontal size={14} />} label="Filtres" />
                  <FilterBtn icon={<IconDownload size={14} />} label="Export" />
                </div>
              </div>

              {/* Status filter tabs */}
              <div style={{ padding: '12px 20px', borderBottom: `0.5px solid ${COLORS.border.default}`, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    style={{
                      height: '28px', padding: '0 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'inherit',
                      background: filter === tab.key ? COLORS.semantic.info.bg : 'transparent',
                      color:      filter === tab.key ? COLORS.semantic.info.text : COLORS.text.secondary,
                      border:     filter === tab.key ? `0.5px solid ${COLORS.semantic.info.border}` : '0.5px solid transparent',
                    }}
                  >
                    {tab.label}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: 'rgba(0,0,0,0.07)', fontSize: '10px', marginLeft: '4px',
                    }}>
                      {tabCount(tab.key)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: COLORS.bg.panel }}>
                      {['N° Ticket', 'Client', 'Problème', 'Sévérité', 'Secteur', 'Statut', 'Durée', ''].map((h) => (
                        <th key={h} style={{ padding: '10px 16px', fontSize: '11px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((ticket, i) => (
                      <tr
                        key={ticket.id}
                        style={{ borderBottom: `0.5px solid #F5F5F5`, background: i % 2 === 0 ? '#fff' : '#FAFAFA', cursor: 'pointer' }}
                        onMouseOver={(e) => (e.currentTarget.style.background = '#F5F7FA')}
                        onMouseOut={(e) => (e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFAFA')}
                      >
                        <td style={{ padding: '13px 16px', fontSize: '12px', fontFamily: 'monospace', color: COLORS.text.secondary }}>#{ticket.id}</td>
                        <td style={{ padding: '13px 8px', fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{ticket.clientName}</td>
                        <td style={{ padding: '13px 8px' }}>
                          <div style={{ fontSize: '13px', color: '#374151' }}>{ticket.subCategory}</div>
                          <div style={{ fontSize: '12px', color: COLORS.text.secondary, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.address}</div>
                        </td>
                        <td style={{ padding: '13px 8px' }}><SeverityBadge severity={ticket.severity} /></td>
                        <td style={{ padding: '13px 8px', fontSize: '13px', color: COLORS.text.secondary }}>{ticket.sector}</td>
                        <td style={{ padding: '13px 8px' }}><StatusBadge status={ticket.status} /></td>
                        <td style={{ padding: '13px 8px', fontSize: '12px', color: COLORS.text.muted, whiteSpace: 'nowrap' }}>{formatElapsed(ticket.createdAt)}</td>
                        <td style={{ padding: '13px 16px' }}>
                          {(ticket.status === 'resolu-eep' || ticket.status === 'resolu-sed') ? (
                            <button onClick={() => navigate(`/cgr/ticket/${ticket.id}/cloture`)} style={{ height: '28px', background: COLORS.semantic.success.bg, color: COLORS.semantic.success.text, border: `0.5px solid #BBF7D0`, borderRadius: '6px', fontSize: '12px', cursor: 'pointer', padding: '0 10px', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <IconPhone size={12} /> Clore
                            </button>
                          ) : (
                            <button onClick={() => navigate(`/cgr/ticket/${ticket.id}`)} style={{ height: '28px', background: COLORS.bg.surface, color: '#374151', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '6px', fontSize: '12px', cursor: 'pointer', padding: '0 10px', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <IconEye size={12} /> Voir
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: COLORS.text.muted, fontSize: '13px' }}>Aucun ticket trouvé</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div style={{ padding: '12px 20px', borderTop: `0.5px solid ${COLORS.border.default}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '12px', color: COLORS.text.muted }}>Affichage 1–{filtered.length} sur {filtered.length} tickets</div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Pre-check notice */}
            <div style={{ background: COLORS.semantic.info.bg, border: `0.5px solid ${COLORS.semantic.info.border}`, borderRadius: '10px', padding: '12px 14px', display: 'flex', gap: '10px' }}>
              <span style={{ color: COLORS.semantic.info.text, fontSize: '16px', flexShrink: 0 }}>ℹ️</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: COLORS.semantic.info.text, marginBottom: '3px' }}>Avant d'ouvrir un ticket</div>
                <div style={{ fontSize: '12px', color: COLORS.semantic.info.text, lineHeight: 1.5 }}>Effectuez toujours la vérification MT et coupure programmée avant de créer un nouveau ticket.</div>
                <a href="#" style={{ fontSize: '12px', color: COLORS.semantic.info.text, fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                  Lancer le pré-check →
                </a>
              </div>
            </div>

            {/* Duty team */}
            <div style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconUsersGroup size={15} color={COLORS.brand.green} /> Équipe de garde
                </div>
                <span style={{ fontSize: '11px', color: COLORS.text.secondary }}>Sem. 25</span>
              </div>
              {SECTORS.map((sector) => (
                <div key={sector} style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '8px' }}>{sector}</div>
                  {DUTY_SCHEDULE.filter((a) => a.sector === sector).map((agent) => (
                    <div key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: COLORS.bg.panel, borderRadius: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: COLORS.semantic.info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 500, color: COLORS.semantic.info.text, flexShrink: 0 }}>
                        {agent.initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{agent.name}</div>
                        <div style={{ fontSize: '11px', color: COLORS.text.secondary }}>{agent.phone} · {agent.activeTickets} tickets</div>
                      </div>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: agent.online ? COLORS.brand.green : COLORS.text.muted, flexShrink: 0 }} />
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ paddingTop: '12px', borderTop: `0.5px solid #F1F3F5` }}>
                <a href="#" style={{ fontSize: '12px', color: COLORS.brand.blue, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconCalendarEvent size={13} /> Voir le planning complet
                </a>
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '18px' }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '14px' }}>Cette semaine</div>
              {[
                { label: 'Total tickets', value: '47', color: COLORS.text.primary },
                { label: 'Fermés',        value: '38', color: '#166534' },
                { label: 'Référés SED',   value: '6',  color: COLORS.text.primary },
                { label: 'Durée moy.',    value: '1h 48min', color: COLORS.text.primary },
                { label: 'Satisfaction',  value: '94%', color: '#166534' },
              ].map((row) => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `0.5px solid #F1F3F5` }}>
                  <div style={{ fontSize: '12px', color: COLORS.text.secondary }}>{row.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: row.color }}>{row.value}</div>
                </div>
              ))}
            </div>

            {/* Pending closure */}
            {pendingClosure.length > 0 && (
              <div style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.severity.haute.border}`, padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.severity.haute.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <IconPhoneCall size={15} /> Appels clients en attente
                  </div>
                  <span style={{ background: COLORS.severity.haute.bg, color: COLORS.severity.haute.text, border: `0.5px solid ${COLORS.severity.haute.border}`, fontSize: '11px', padding: '2px 7px', borderRadius: '20px', fontWeight: 500 }}>
                    {pendingClosure.length}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: COLORS.text.secondary, marginBottom: '12px', lineHeight: 1.5 }}>
                  Ces tickets sont résolus. Appelez les clients pour confirmer et clôturer définitivement.
                </p>
                {pendingClosure.map((t) => (
                  <div key={t.id} style={{ background: COLORS.severity.haute.bg, border: `0.5px solid ${COLORS.severity.haute.border}`, borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#92400E' }}>#{t.id}</span>
                      <SeverityBadge severity={t.severity} />
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{t.clientName}</div>
                    <div style={{ fontSize: '12px', color: COLORS.text.secondary }}>{t.subCategory} · {t.sector}</div>
                    <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '12px', fontWeight: 500, color: COLORS.severity.haute.text, textDecoration: 'none' }}>
                      <IconPhone size={13} /> Appeler et clôturer
                    </a>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 1100px) {
          .cgr-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 800px) {
          .kpi-row { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 480px) {
          .kpi-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function KpiCard({ icon, iconBg, label, value, trend }: {
  icon: React.ReactNode; iconBg: string; label: string; value: number; trend: React.ReactNode
}) {
  return (
    <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '12px', border: `0.5px solid ${COLORS.border.default}`, padding: '18px 20px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
        {icon}
      </div>
      <div style={{ fontSize: '12px', color: COLORS.text.secondary, marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 500, color: COLORS.text.primary, lineHeight: 1, marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '12px', color: COLORS.text.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>{trend}</div>
    </div>
  )
}

function SevPill({ num, label, color, barColor }: { num: number; label: string; color: string; barColor: string }) {
  return (
    <div style={{ flex: 1, background: COLORS.bg.surface, borderRadius: '10px', border: `0.5px solid ${COLORS.border.default}`, padding: '12px 14px', textAlign: 'center' }}>
      <div style={{ fontSize: '20px', fontWeight: 500, color }}>{num}</div>
      <div style={{ fontSize: '11px', color: COLORS.text.secondary, marginTop: '2px' }}>{label}</div>
      <div style={{ height: '3px', borderRadius: '2px', marginTop: '8px', background: barColor }} />
    </div>
  )
}

function FilterBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button style={{ height: '34px', background: COLORS.bg.surface, color: '#374151', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer', padding: '0 12px', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      {icon} {label}
    </button>
  )
}
