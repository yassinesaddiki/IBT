import { NavBar } from '../../shared/components/NavBar'
import { SubNav } from '../../shared/components/SubNav'
import { COLORS } from '../../design-system/tokens'
import { useTickets } from '../../shared/hooks/useTickets'
import { OBSERVER_NAV } from '../coordinator/coordinatorNav'
import { STATUS_LABELS } from '../../shared/types/status'
import { useDutyStore } from '../../store/dutyStore'

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

export function ObserverReports() {
  const { tickets } = useTickets()
  const sectors = useDutyStore((s) => s.sectors)

  const total  = tickets.length
  const fermes = tickets.filter((t) => t.status === 'ferme').length
  const referCount = tickets.filter((t) => t.eepIntervention?.result === 'refere-sed').length
  const tauxResolution = total > 0 ? Math.round((fermes / total) * 100) : 0

  const statusGroups = [
    { label: STATUS_LABELS['nouveau'],      key: 'nouveau',      color: '#3B82F6' },
    { label: STATUS_LABELS['en-cours-eep'], key: 'en-cours-eep', color: '#EAB308' },
    { label: STATUS_LABELS['en-cours-sed'], key: 'en-cours-sed', color: '#DC7609' },
    { label: STATUS_LABELS['resolu-eep'],   key: 'resolu-eep',   color: '#22C55E' },
    { label: STATUS_LABELS['resolu-sed'],   key: 'resolu-sed',   color: '#16A34A' },
    { label: STATUS_LABELS['ferme'],        key: 'ferme',        color: '#14532D' },
  ]

  const sevGroups = [
    { label: 'Critique', color: '#EF4444', count: tickets.filter((t) => t.severity === 'Critique').length },
    { label: 'Haute',    color: '#F97316', count: tickets.filter((t) => t.severity === 'Haute').length },
    { label: 'Moyenne',  color: '#EAB308', count: tickets.filter((t) => t.severity === 'Moyenne').length },
  ]

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Observateur — Vue Lecture Seule" />
      <SubNav links={OBSERVER_NAV} />

      <div style={{ paddingTop: '24px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary }}>Rapports & Statistiques</div>
            <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '3px' }}>Lecture seule · Données en temps réel</div>
          </div>
          <button style={{ height: '36px', background: COLORS.bg.surface, color: COLORS.brand.blue, border: `0.5px solid ${COLORS.brand.blue}`, borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '0 16px', fontFamily: 'inherit' }}>
            📄 Exporter PDF
          </button>
        </div>

        {/* KPI Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }} className="obs-reports-kpi">
          {[
            { label: 'Total tickets',   value: total,        color: COLORS.text.primary,          sub: 'tous statuts' },
            { label: 'Clôturés',        value: fermes,       color: '#14532D',                    sub: `${tauxResolution}% taux` },
            { label: 'Référés SED',     value: referCount,   color: '#C2410C',                    sub: 'nécessitaient SED' },
            { label: 'Tickets actifs',  value: total - fermes, color: '#854D0E',                  sub: 'en cours ou nouveaux' },
          ].map((k) => (
            <div key={k.label} className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '12px', border: `0.5px solid ${COLORS.border.default}`, padding: '16px 18px' }}>
              <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '6px' }}>{k.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 500, color: k.color, marginBottom: '4px' }}>{k.value}</div>
              <div style={{ fontSize: '11px', color: COLORS.text.muted }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }} className="obs-reports-grid">
          <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '16px' }}>Par statut</div>
            {statusGroups.map((g) => {
              const count = tickets.filter((t) => t.status === g.key).length
              return <Bar key={g.key} pct={total ? (count / total) * 100 : 0} color={g.color} label={g.label} value={count} />
            })}
          </div>
          <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '16px' }}>Par sévérité</div>
            {sevGroups.map((g) => <Bar key={g.label} pct={total ? (g.count / total) * 100 : 0} color={g.color} label={g.label} value={g.count} />)}
            <div style={{ display: 'flex', height: '20px', borderRadius: '6px', overflow: 'hidden', gap: '2px', marginTop: '16px' }}>
              {sevGroups.map((g) => <div key={g.label} style={{ flex: g.count, background: g.color }} title={`${g.label}: ${g.count}`} />)}
            </div>
          </div>
          <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '16px' }}>Par secteur</div>
            {sectors.map((s) => {
              const count = tickets.filter((t) => t.sector === s.name).length
              return <Bar key={s.id} pct={total ? (count / total) * 100 : 0} color={COLORS.brand.blue} label={s.name} value={count} />
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) { .obs-reports-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 800px)  { .obs-reports-grid { grid-template-columns: 1fr !important; } .obs-reports-kpi { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  )
}
