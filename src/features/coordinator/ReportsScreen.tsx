import { NavBar } from '../../shared/components/NavBar'
import { SubNav } from '../../shared/components/SubNav'
import { COLORS } from '../../design-system/tokens'
import { useTickets } from '../../shared/hooks/useTickets'
import { COORDINATOR_NAV } from './coordinatorNav'
import { STATUS_LABELS } from '../../shared/types/status'
import { MOCK_EMPLOYEES } from '../../mock-data/employees'
import { SECTORS } from '../../mock-data/duty-schedule'

function Bar({ pct, color, label, value }: { pct: number; color: string; label: string; value: string | number }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '12px', color: COLORS.text.secondary }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.primary }}>{value}</span>
      </div>
      <div style={{ height: '8px', background: COLORS.bg.page, borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.max(pct, 2)}%`, background: color, borderRadius: '4px', transition: 'width .4s ease' }} />
      </div>
    </div>
  )
}

export function ReportsScreen() {
  const { tickets } = useTickets()
  const pendingApproval = tickets.filter((t) => t.status === 'attente-approbation').length

  const total  = tickets.length
  const fermes = tickets.filter((t) => t.status === 'ferme').length
  const resolus = tickets.filter((t) => t.status === 'resolu-eep' || t.status === 'resolu-sed').length
  const enCours = tickets.filter((t) => ['en-cours-eep','en-cours-sed','lu-eep'].includes(t.status)).length
  const referCount = tickets.filter((t) => t.eepIntervention?.result === 'refere-sed').length

  const tauxResolution = total > 0 ? Math.round((fermes / total) * 100) : 0
  const tauxRenvoi     = total > 0 ? Math.round((referCount / total) * 100) : 0

  // By status
  const statusGroups = [
    { label: STATUS_LABELS['nouveau'],             key: 'nouveau',             color: '#3B82F6' },
    { label: STATUS_LABELS['en-cours-eep'],        key: 'en-cours-eep',        color: '#EAB308' },
    { label: STATUS_LABELS['attente-approbation'], key: 'attente-approbation', color: '#F97316' },
    { label: STATUS_LABELS['en-cours-sed'],        key: 'en-cours-sed',        color: '#DC7609' },
    { label: STATUS_LABELS['resolu-eep'],          key: 'resolu-eep',          color: '#22C55E' },
    { label: STATUS_LABELS['resolu-sed'],          key: 'resolu-sed',          color: '#16A34A' },
    { label: STATUS_LABELS['ferme'],               key: 'ferme',               color: '#14532D' },
  ]

  // By severity
  const sevGroups = [
    { label: 'Critique', color: '#EF4444', count: tickets.filter((t) => t.severity === 'Critique').length },
    { label: 'Haute',    color: '#F97316', count: tickets.filter((t) => t.severity === 'Haute').length },
    { label: 'Moyenne',  color: '#EAB308', count: tickets.filter((t) => t.severity === 'Moyenne').length },
  ]

  // By sector
  const sectorGroups = SECTORS.map((s) => ({
    label: s,
    count: tickets.filter((t) => t.sector === s).length,
  }))

  // Agent performance
  const eepAgents = MOCK_EMPLOYEES.filter((e) => e.role === 'eep')

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Coordinateur" notifCount={pendingApproval} />
      <SubNav links={COORDINATOR_NAV(pendingApproval)} />

      <div style={{ paddingTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary }}>Rapports & Statistiques</div>
            <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '3px' }}>Données en temps réel — Prototype</div>
          </div>
          <button style={{ height: '36px', background: COLORS.bg.surface, color: COLORS.brand.blue, border: `0.5px solid ${COLORS.brand.blue}`, borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '0 16px', fontFamily: 'inherit' }}>
            📄 Exporter PDF
          </button>
        </div>

        {/* KPI Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '24px' }} className="reports-kpi">
          {[
            { label: 'Total tickets',     value: total,           color: COLORS.text.primary,          sub: 'tous statuts' },
            { label: 'Fermés défin.',     value: fermes,          color: '#14532D',                    sub: `${tauxResolution}% taux clôture` },
            { label: 'Résolus (att.)',    value: resolus,         color: COLORS.semantic.success.text, sub: 'en attente CGR' },
            { label: 'En cours',          value: enCours,         color: '#854D0E',                    sub: 'EEP + SED' },
            { label: 'Référés SED',       value: referCount,      color: '#C2410C',                    sub: `${tauxRenvoi}% des tickets` },
          ].map((k) => (
            <div key={k.label} className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '12px', border: `0.5px solid ${COLORS.border.default}`, padding: '16px 18px' }}>
              <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '6px' }}>{k.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 500, color: k.color, marginBottom: '4px' }}>{k.value}</div>
              <div style={{ fontSize: '11px', color: COLORS.text.muted }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Three-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }} className="reports-grid">

          {/* Status breakdown */}
          <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '16px' }}>Répartition par statut</div>
            {statusGroups.map((g) => {
              const count = tickets.filter((t) => t.status === g.key).length
              return <Bar key={g.key} pct={total ? (count / total) * 100 : 0} color={g.color} label={g.label} value={count} />
            })}
          </div>

          {/* Severity breakdown */}
          <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '16px' }}>Répartition par sévérité</div>
            {sevGroups.map((g) => <Bar key={g.label} pct={total ? (g.count / total) * 100 : 0} color={g.color} label={g.label} value={g.count} />)}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: `0.5px solid ${COLORS.border.default}` }}>
              <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginBottom: '8px' }}>Synthèse visuelle</div>
              <div style={{ display: 'flex', height: '20px', borderRadius: '6px', overflow: 'hidden', gap: '2px' }}>
                {sevGroups.map((g) => (
                  <div key={g.label} style={{ flex: g.count, background: g.color, minWidth: g.count > 0 ? '20px' : 0 }} title={`${g.label}: ${g.count}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Sector breakdown */}
          <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '16px' }}>Répartition par secteur</div>
            {sectorGroups.map((g) => <Bar key={g.label} pct={total ? (g.count / total) * 100 : 0} color={COLORS.brand.blue} label={g.label} value={g.count} />)}
          </div>
        </div>

        {/* Agent performance */}
        <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '16px' }}>Performance agents EEP</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: COLORS.bg.panel }}>
                  {['Agent','Secteur','Tickets actifs','Clôturés (semaine)','Taux résolution','Statut'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {eepAgents.map((a) => {
                  const closed = tickets.filter((t) => t.eepIntervention?.agentName === a.name && (t.status === 'resolu-eep' || t.status === 'ferme')).length
                  const assigned = tickets.filter((t) => t.eepIntervention?.agentName === a.name).length
                  const rate = assigned > 0 ? Math.round((closed / assigned) * 100) : 0
                  return (
                    <tr key={a.id} style={{ borderBottom: `0.5px solid #F5F5F5` }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: COLORS.semantic.info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 500, color: COLORS.semantic.info.text, flexShrink: 0 }}>{a.initials}</div>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{a.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: '13px', color: COLORS.text.secondary }}>{a.sector ?? '—'}</td>
                      <td style={{ padding: '12px 8px', fontSize: '13px', fontWeight: 500, color: a.activeTickets > 0 ? '#854D0E' : COLORS.text.muted }}>{a.activeTickets}</td>
                      <td style={{ padding: '12px 8px', fontSize: '13px', color: COLORS.semantic.success.text, fontWeight: 500 }}>{closed}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '6px', background: COLORS.bg.page, borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
                            <div style={{ height: '100%', width: `${rate}%`, background: rate > 70 ? COLORS.brand.green : rate > 40 ? '#EAB308' : '#EF4444', borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.primary, minWidth: '32px' }}>{rate}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '20px', background: a.status === 'actif' ? COLORS.semantic.success.bg : COLORS.bg.page, color: a.status === 'actif' ? COLORS.semantic.success.text : COLORS.text.muted, border: `0.5px solid ${a.status === 'actif' ? '#BBF7D0' : COLORS.border.default}` }}>
                          {a.status === 'actif' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) { .reports-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 800px)  { .reports-grid { grid-template-columns: 1fr !important; } .reports-kpi { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  )
}
