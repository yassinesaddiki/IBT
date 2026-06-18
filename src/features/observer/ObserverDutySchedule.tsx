import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconChevronLeft, IconChevronRight, IconPhone, IconEye } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { SubNav } from '../../shared/components/SubNav'
import { OBSERVER_NAV } from '../coordinator/coordinatorNav'
import { COLORS } from '../../design-system/tokens'
import { DUTY_SCHEDULE, SECTORS } from '../../mock-data/duty-schedule'

function getWeeks(): { label: string; range: string; weekNum: number }[] {
  const today = new Date()
  const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayOfWeek)

  return Array.from({ length: 5 }, (_, i) => {
    const start = new Date(monday)
    start.setDate(monday.getDate() + i * 7)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    const wn = 25 + i
    return {
      label:   `Sem. ${wn}`,
      range:   `${start.getDate()}/${start.getMonth() + 1} – ${end.getDate()}/${end.getMonth() + 1}`,
      weekNum: wn,
    }
  })
}

export function ObserverDutySchedule() {
  const navigate = useNavigate()
  const weeks    = getWeeks()
  const [weekIdx, setWeekIdx] = useState(0)
  const week = weeks[weekIdx]

  const onlineCount = DUTY_SCHEDULE.filter((a) => a.online).length

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Observateur — Vue Lecture Seule" />
      <SubNav links={OBSERVER_NAV} />

      <div style={{ paddingTop: '24px' }}>

        {/* Read-only banner */}
        <div style={{ background: COLORS.semantic.info.bg, border: `0.5px solid ${COLORS.semantic.info.border}`, borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconEye size={16} color={COLORS.semantic.info.text} />
          <span style={{ fontSize: '13px', color: COLORS.semantic.info.text }}>Mode lecture seule — Planning géré par le Coordinateur</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary }}>Planning de Garde</div>
            <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '4px' }}>
              {onlineCount} agents en ligne actuellement · {DUTY_SCHEDULE.length} agents de garde
            </div>
          </div>
          <button
            onClick={() => navigate('/observer/dashboard')}
            style={{ height: '36px', background: COLORS.bg.surface, color: COLORS.text.secondary, border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer', padding: '0 16px', fontFamily: 'inherit' }}
          >
            ← Vue d'ensemble
          </button>
        </div>

        {/* Week navigator */}
        <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setWeekIdx((i) => Math.max(0, i - 1))} disabled={weekIdx === 0}
            style={{ width: '32px', height: '32px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', background: COLORS.bg.surface, cursor: weekIdx === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: weekIdx === 0 ? 0.4 : 1 }}>
            <IconChevronLeft size={15} color={COLORS.text.secondary} />
          </button>
          <div style={{ display: 'flex', gap: '6px', flex: 1, flexWrap: 'wrap' }}>
            {weeks.map((w, i) => (
              <button key={i} onClick={() => setWeekIdx(i)}
                style={{ height: '32px', padding: '0 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', background: weekIdx === i ? COLORS.brand.blue : COLORS.bg.page, color: weekIdx === i ? '#fff' : COLORS.text.secondary, border: `0.5px solid ${weekIdx === i ? COLORS.brand.blue : COLORS.border.default}` }}>
                {w.label} <span style={{ opacity: 0.75, fontSize: '11px' }}>{w.range}</span>
                {i === 0 && <span style={{ marginLeft: '4px', fontSize: '10px', background: COLORS.brand.green, color: '#fff', padding: '1px 5px', borderRadius: '10px' }}>Actuelle</span>}
              </button>
            ))}
          </div>
          <button onClick={() => setWeekIdx((i) => Math.min(weeks.length - 1, i + 1))} disabled={weekIdx === weeks.length - 1}
            style={{ width: '32px', height: '32px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', background: COLORS.bg.surface, cursor: weekIdx === weeks.length - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: weekIdx === weeks.length - 1 ? 0.4 : 1 }}>
            <IconChevronRight size={15} color={COLORS.text.secondary} />
          </button>
        </div>

        {/* Quick stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }} className="obs-schedule-kpi">
          {SECTORS.map((sector) => {
            const agents = DUTY_SCHEDULE.filter((a) => a.sector === sector)
            const online = agents.filter((a) => a.online).length
            const totalTickets = agents.reduce((sum, a) => sum + a.activeTickets, 0)
            return (
              <div key={sector} className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '12px', border: `0.5px solid ${COLORS.border.default}`, padding: '14px 16px' }}>
                <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.05em' }}>{sector}</div>
                <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '4px' }}>{agents.length} agents</div>
                <div style={{ fontSize: '11px', color: COLORS.text.secondary, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: COLORS.brand.green }} />
                    {online} en ligne
                  </span>
                  · {totalTickets} tickets actifs
                </div>
              </div>
            )
          })}
        </div>

        {/* Sector cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="obs-schedule-grid">
          {SECTORS.map((sector) => {
            const agents = DUTY_SCHEDULE.filter((a) => a.sector === sector)
            return (
              <div key={sector} className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: `0.5px solid ${COLORS.border.default}` }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.brand.green }} />
                  <div style={{ fontSize: '15px', fontWeight: 500, color: COLORS.text.primary }}>{sector}</div>
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: COLORS.text.muted }}>{week.label}</span>
                </div>

                {agents.map((agent) => (
                  <div key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: COLORS.bg.page, borderRadius: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: COLORS.semantic.info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 500, color: COLORS.semantic.info.text, flexShrink: 0 }}>
                      {agent.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{agent.name}</div>
                      <div style={{ fontSize: '11px', color: COLORS.text.secondary, marginTop: '2px' }}>
                        {agent.activeTickets} ticket{agent.activeTickets !== 1 ? 's' : ''} actif{agent.activeTickets !== 1 ? 's' : ''} · {agent.closedThisWeek} fermés cette semaine
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: agent.online ? COLORS.brand.green : COLORS.text.muted }} />
                      <a
                        href={`tel:${agent.phone}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: COLORS.brand.blue, textDecoration: 'none', background: COLORS.semantic.info.bg, padding: '3px 8px', borderRadius: '20px', fontWeight: 500 }}
                      >
                        <IconPhone size={11} /> {agent.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        {/* Full list */}
        <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '20px', marginTop: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '16px' }}>
            Tous les agents de garde — {week.label}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: COLORS.bg.panel }}>
                  {['Agent', 'Secteur', 'Téléphone', 'Tickets actifs', 'Fermés (semaine)', 'Statut'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DUTY_SCHEDULE.map((agent) => (
                  <tr key={agent.id} style={{ borderBottom: `0.5px solid #F5F5F5` }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: COLORS.semantic.info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 500, color: COLORS.semantic.info.text, flexShrink: 0 }}>
                          {agent.initials}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{agent.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '13px', color: COLORS.text.secondary }}>{agent.sector}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <a href={`tel:${agent.phone}`} style={{ fontSize: '12px', color: COLORS.brand.blue, textDecoration: 'none', fontFamily: 'monospace' }}>{agent.phone}</a>
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '13px', color: COLORS.text.primary, fontWeight: 500 }}>{agent.activeTickets}</td>
                    <td style={{ padding: '12px 8px', fontSize: '13px', color: COLORS.semantic.success.text }}>{agent.closedThisWeek}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '20px', background: agent.online ? COLORS.semantic.success.bg : COLORS.bg.page, color: agent.online ? COLORS.semantic.success.text : COLORS.text.muted, border: `0.5px solid ${agent.online ? '#BBF7D0' : COLORS.border.default}` }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: agent.online ? COLORS.brand.green : COLORS.text.muted }} />
                        {agent.online ? 'En ligne' : 'Hors ligne'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1000px) { .obs-schedule-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 800px)  { .obs-schedule-kpi  { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  )
}
