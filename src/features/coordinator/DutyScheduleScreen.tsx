import { useState } from 'react'
import { IconChevronLeft, IconChevronRight, IconUsers, IconAlertCircle, IconCheck } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { COLORS } from '../../design-system/tokens'
import { DUTY_SCHEDULE, SECTORS } from '../../mock-data/duty-schedule'
import type { DutyAgent } from '../../mock-data/duty-schedule'

// Generate 4 weeks starting from current week
function getWeeks(): { label: string; range: string; start: Date }[] {
  const today = new Date()
  const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayOfWeek)

  return Array.from({ length: 5 }, (_, i) => {
    const start = new Date(monday)
    start.setDate(monday.getDate() + i * 7)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    const weekNum = Math.ceil((start.getDate() + new Date(start.getFullYear(), start.getMonth(), 1).getDay()) / 7) + 24
    return {
      label:  `Semaine ${weekNum + i}`,
      range:  `${start.getDate()}/${start.getMonth() + 1} – ${end.getDate()}/${end.getMonth() + 1}`,
      start,
    }
  })
}

type SlotKey = string // `${sectorIdx}-${slotIdx}`
type Schedule = Record<SlotKey, string> // agentId

export function DutyScheduleScreen() {
  const weeks = getWeeks()
  const [weekIdx,  setWeekIdx]  = useState(0)
  const [schedule, setSchedule] = useState<Schedule>({})
  const [saved,    setSaved]    = useState(false)
  const [saving,   setSaving]   = useState(false)

  const week = weeks[weekIdx]

  const agentsBySector = (sector: string): DutyAgent[] =>
    DUTY_SCHEDULE.filter((a) => a.sector === sector)

  const getSlotAgent = (sectorIdx: number, slotIdx: number): string => {
    const key    = `${weekIdx}-${sectorIdx}-${slotIdx}` as SlotKey
    const id     = schedule[key]
    if (id) return id
    const agents = agentsBySector(SECTORS[sectorIdx])
    return agents[slotIdx]?.id ?? ''
  }

  const setSlotAgent = (sectorIdx: number, slotIdx: number, agentId: string) => {
    const key = `${weekIdx}-${sectorIdx}-${slotIdx}` as SlotKey
    setSchedule((prev) => ({ ...prev, [key]: agentId }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => { setSaving(false); setSaved(true) }, 800)
  }

  const hasEmpty = SECTORS.some((_, si) =>
    [0, 1].some((slot) => !getSlotAgent(si, slot))
  )

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Coordinateur" notifCount={1} />

      <div style={{ paddingTop: '24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary }}>Planning de Garde</div>
            <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '4px' }}>
              Assignez les agents EEP par secteur pour chaque semaine
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              height: '40px',
              background: saved ? COLORS.brand.green : COLORS.brand.blue,
              color: '#fff', border: 'none', borderRadius: '8px',
              fontSize: '13px', fontWeight: 500, cursor: saving ? 'default' : 'pointer',
              padding: '0 20px', display: 'inline-flex', alignItems: 'center',
              gap: '6px', fontFamily: 'inherit', transition: 'background .2s',
            }}
          >
            {saved ? <><IconCheck size={15} /> Enregistré</> : saving ? 'Enregistrement…' : 'Enregistrer le planning'}
          </button>
        </div>

        {/* Week navigator */}
        <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setWeekIdx((i) => Math.max(0, i - 1))}
            disabled={weekIdx === 0}
            style={{ width: '34px', height: '34px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', background: COLORS.bg.surface, cursor: weekIdx === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: weekIdx === 0 ? 0.4 : 1 }}
          >
            <IconChevronLeft size={16} color={COLORS.text.secondary} />
          </button>

          <div style={{ display: 'flex', gap: '8px', flex: 1, flexWrap: 'wrap' }}>
            {weeks.map((w, i) => (
              <button
                key={i}
                onClick={() => setWeekIdx(i)}
                style={{
                  height: '36px', padding: '0 14px', borderRadius: '8px', fontSize: '13px',
                  fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                  background: weekIdx === i ? COLORS.brand.blue : COLORS.bg.page,
                  color: weekIdx === i ? '#fff' : COLORS.text.secondary,
                  border: `0.5px solid ${weekIdx === i ? COLORS.brand.blue : COLORS.border.default}`,
                }}
              >
                {w.label}
                <span style={{ fontSize: '11px', marginLeft: '6px', opacity: 0.75 }}>{w.range}</span>
                {i === 0 && <span style={{ marginLeft: '4px', fontSize: '10px', background: COLORS.brand.green, color: '#fff', padding: '1px 5px', borderRadius: '10px' }}>En cours</span>}
              </button>
            ))}
          </div>

          <button
            onClick={() => setWeekIdx((i) => Math.min(weeks.length - 1, i + 1))}
            disabled={weekIdx === weeks.length - 1}
            style={{ width: '34px', height: '34px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', background: COLORS.bg.surface, cursor: weekIdx === weeks.length - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: weekIdx === weeks.length - 1 ? 0.4 : 1 }}
          >
            <IconChevronRight size={16} color={COLORS.text.secondary} />
          </button>
        </div>

        {/* Empty warning */}
        {hasEmpty && (
          <div style={{ background: COLORS.severity.haute.bg, border: `0.5px solid ${COLORS.severity.haute.border}`, borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconAlertCircle size={16} color={COLORS.severity.haute.text} />
            <span style={{ fontSize: '12px', color: COLORS.severity.haute.text }}>Certains créneaux ne sont pas encore assignés pour {week.label}.</span>
          </div>
        )}

        {/* Schedule grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="schedule-grid">
          {SECTORS.map((sector, si) => {
            const allAgents = DUTY_SCHEDULE
            return (
              <div
                key={sector}
                className="animate-up"
                style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '20px' }}
              >
                {/* Sector header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.brand.green, flexShrink: 0 }} />
                  <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary }}>{sector}</div>
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: COLORS.text.muted }}>2 agents / semaine</span>
                </div>

                {/* Agent slots */}
                {[0, 1].map((slotIdx) => {
                  const currentId    = getSlotAgent(si, slotIdx)
                  const currentAgent = DUTY_SCHEDULE.find((a) => a.id === currentId)
                  const isEmpty      = !currentId

                  return (
                    <div key={slotIdx} style={{ marginBottom: slotIdx === 0 ? '12px' : 0 }}>
                      <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '6px' }}>
                        Agent {slotIdx + 1}
                      </div>
                      <div style={{
                        background: isEmpty ? COLORS.severity.critique.bg : COLORS.bg.page,
                        border: `0.5px solid ${isEmpty ? COLORS.severity.critique.border : COLORS.border.default}`,
                        borderRadius: '10px', padding: '10px 12px',
                      }}>
                        {/* Current agent preview */}
                        {currentAgent && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: COLORS.semantic.info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 500, color: COLORS.semantic.info.text, flexShrink: 0 }}>
                              {currentAgent.initials}
                            </div>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{currentAgent.name}</div>
                              <div style={{ fontSize: '11px', color: COLORS.text.secondary }}>{currentAgent.phone}</div>
                            </div>
                            <span style={{ marginLeft: 'auto', width: '7px', height: '7px', borderRadius: '50%', background: currentAgent.online ? COLORS.brand.green : COLORS.text.muted, flexShrink: 0 }} />
                          </div>
                        )}

                        {/* Dropdown to change */}
                        <select
                          value={currentId}
                          onChange={(e) => setSlotAgent(si, slotIdx, e.target.value)}
                          style={{
                            width: '100%', height: '34px',
                            border: `0.5px solid ${COLORS.border.strong}`,
                            borderRadius: '8px', padding: '0 10px',
                            fontSize: '12px', color: COLORS.text.primary,
                            background: COLORS.bg.surface, outline: 'none',
                            cursor: 'pointer', fontFamily: 'inherit',
                          }}
                        >
                          <option value="">— Sélectionner un agent —</option>
                          <optgroup label="Agents disponibles">
                            {allAgents.map((a) => (
                              <option key={a.id} value={a.id}>{a.name} ({a.sector})</option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '20px', marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <IconUsers size={16} color={COLORS.brand.green} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text.primary }}>Résumé — {week.label} ({week.range})</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }} className="schedule-grid">
            {SECTORS.map((sector, si) => {
              const a0 = DUTY_SCHEDULE.find((a) => a.id === getSlotAgent(si, 0))
              const a1 = DUTY_SCHEDULE.find((a) => a.id === getSlotAgent(si, 1))
              return (
                <div key={sector} style={{ background: COLORS.bg.page, borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '8px' }}>{sector}</div>
                  {[a0, a1].map((a, i) => a ? (
                    <div key={i} style={{ fontSize: '12px', color: COLORS.text.primary, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: COLORS.brand.green, flexShrink: 0 }} />
                      {a.name}
                    </div>
                  ) : (
                    <div key={i} style={{ fontSize: '12px', color: '#EF4444', marginBottom: '4px' }}>⚠ Non assigné</div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px)  { .schedule-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 1100px) { .schedule-grid { grid-template-columns: repeat(2,1fr); } }
      `}</style>
    </div>
  )
}
