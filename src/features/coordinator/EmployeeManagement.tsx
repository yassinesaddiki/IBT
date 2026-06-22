import { useState } from 'react'
import { IconPlus, IconPencil, IconSearch, IconUserCheck, IconUserX } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { SubNav } from '../../shared/components/SubNav'
import { COLORS } from '../../design-system/tokens'
import { useEmployeeStore } from '../../store/employeeStore'
import type { Employee, EmployeeRole } from '../../mock-data/employees'
import { ROLE_LABELS_FR, ROLE_SHORT_FR } from '../../mock-data/employees'
import { COORDINATOR_NAV } from './coordinatorNav'
import { useTickets } from '../../shared/hooks/useTickets'

const ROLE_COLORS: Record<EmployeeRole, { bg: string; text: string; border: string }> = {
  eep:         { bg: COLORS.severity.moyenne.bg,   text: COLORS.severity.moyenne.text,   border: COLORS.severity.moyenne.border },
  sed:         { bg: '#FFF3E0',                     text: '#92400E',                       border: '#FCD34D' },
  cgr:         { bg: COLORS.semantic.info.bg,      text: COLORS.semantic.info.text,       border: COLORS.semantic.info.border! },
  coordinator: { bg: COLORS.status.programme.bg,   text: '#5B21B6',                       border: '#DDD6FE' },
  observer:    { bg: COLORS.bg.panel,              text: COLORS.text.secondary,            border: COLORS.border.default },
}

export function EmployeeManagement() {
  const { tickets }    = useTickets()
  const { employees, toggleStatus } = useEmployeeStore()
  const [search, setSearch]         = useState('')
  const [roleFilter, setRoleFilter] = useState<EmployeeRole | 'tous'>('tous')
  const [editId,  setEditId]        = useState<string | null>(null)

  const pendingApproval = tickets.filter((t) => t.status === 'attente-approbation').length

  const filtered = employees.filter((e) => {
    const matchRole   = roleFilter === 'tous' || e.role === roleFilter
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.matricule.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  const stats = {
    total:  employees.length,
    actifs: employees.filter((e) => e.status === 'actif').length,
    eep:    employees.filter((e) => e.role === 'eep').length,
    sed:    employees.filter((e) => e.role === 'sed').length,
  }

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Coordinateur" notifCount={pendingApproval} />
      <SubNav links={COORDINATOR_NAV(pendingApproval)} />

      <div style={{ paddingTop: '24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary }}>Gestion des Employés</div>
            <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '3px' }}>
              {stats.actifs} actifs · {stats.eep} Équipe de Permanance · {stats.sed} SED
            </div>
          </div>
          <button style={{ height: '40px', background: COLORS.brand.blue, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' }}>
            <IconPlus size={15} /> Ajouter un employé
          </button>
        </div>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }} className="emp-kpi">
          {[
            { label: 'Total employés', value: stats.total, color: COLORS.text.primary },
            { label: 'Actifs',         value: stats.actifs, color: COLORS.brand.green },
            { label: 'Équipe de Permanance', value: stats.eep, color: '#854D0E' },
            { label: 'Équipe SED',     value: stats.sed,   color: '#92400E' },
          ].map((k) => (
            <div key={k.label} className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '12px', border: `0.5px solid ${COLORS.border.default}`, padding: '16px 18px' }}>
              <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '6px' }}>{k.label}</div>
              <div style={{ fontSize: '26px', fontWeight: 500, color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, overflow: 'hidden' }}>
          {/* Controls */}
          <div style={{ padding: '14px 20px', borderBottom: `0.5px solid ${COLORS.border.default}`, display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
              <IconSearch size={14} color={COLORS.text.muted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nom, matricule…"
                style={{ width: '100%', height: '34px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', padding: '0 12px 0 32px', fontSize: '13px', color: COLORS.text.primary, background: COLORS.bg.surface, outline: 'none', fontFamily: 'inherit' }} />
            </div>
            {(['tous', 'eep', 'sed', 'cgr'] as const).map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)}
                style={{ height: '34px', padding: '0 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', background: roleFilter === r ? COLORS.semantic.info.bg : COLORS.bg.page, color: roleFilter === r ? COLORS.semantic.info.text : COLORS.text.secondary, border: roleFilter === r ? `0.5px solid ${COLORS.semantic.info.border}` : `0.5px solid ${COLORS.border.default}` }}>
                {r === 'tous' ? 'Tous' : ROLE_SHORT_FR[r as EmployeeRole]}
              </button>
            ))}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: COLORS.bg.panel }}>
                  {['Employé','Matricule','Rôle','Secteur','Téléphone','Email','Tickets actifs','Statut','Actions'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp: Employee) => {
                  const rc = ROLE_COLORS[emp.role]
                  return (
                    <tr key={emp.id} style={{ borderBottom: `0.5px solid #F5F5F5` }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: COLORS.semantic.info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 500, color: COLORS.semantic.info.text, flexShrink: 0 }}>
                            {emp.initials}
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{emp.name}</div>
                            <div style={{ fontSize: '11px', color: COLORS.text.muted }}>Depuis {emp.joinedDate.split('-')[0]}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: '12px', fontFamily: 'monospace', color: COLORS.text.secondary }}>{emp.matricule}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '20px', background: rc.bg, color: rc.text, border: `0.5px solid ${rc.border}` }}>
                          {ROLE_LABELS_FR[emp.role]}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: '13px', color: COLORS.text.secondary }}>{emp.sector ?? '—'}</td>
                      <td style={{ padding: '12px 8px', fontSize: '12px', color: COLORS.text.secondary, fontFamily: 'monospace' }}>{emp.phone}</td>
                      <td style={{ padding: '12px 8px', fontSize: '12px', color: COLORS.text.secondary }}>{emp.email}</td>
                      <td style={{ padding: '12px 8px', fontSize: '13px', fontWeight: 500, color: emp.activeTickets > 0 ? '#854D0E' : COLORS.text.muted, textAlign: 'center' }}>{emp.activeTickets}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '20px', background: emp.status === 'actif' ? COLORS.semantic.success.bg : COLORS.bg.page, color: emp.status === 'actif' ? COLORS.semantic.success.text : COLORS.text.muted, border: `0.5px solid ${emp.status === 'actif' ? '#BBF7D0' : COLORS.border.default}` }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: emp.status === 'actif' ? COLORS.brand.green : COLORS.text.muted }} />
                          {emp.status === 'actif' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => setEditId(emp.id === editId ? null : emp.id)}
                            style={{ width: '28px', height: '28px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '6px', background: COLORS.bg.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconPencil size={13} color={COLORS.text.secondary} />
                          </button>
                          <button onClick={() => toggleStatus(emp.id)}
                            style={{ width: '28px', height: '28px', border: `0.5px solid ${emp.status === 'actif' ? '#FECACA' : '#BBF7D0'}`, borderRadius: '6px', background: emp.status === 'actif' ? COLORS.semantic.danger.bg : COLORS.semantic.success.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {emp.status === 'actif' ? <IconUserX size={13} color="#991B1B" /> : <IconUserCheck size={13} color="#166534" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '10px 20px', borderTop: `0.5px solid ${COLORS.border.default}`, fontSize: '12px', color: COLORS.text.muted }}>
            {filtered.length} employé{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) { .emp-kpi { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  )
}
