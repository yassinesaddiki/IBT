import { useState } from 'react'
import { IconPlus, IconPencil, IconSearch, IconUserCheck, IconUserX, IconX } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { SubNav } from '../../shared/components/SubNav'
import { COLORS } from '../../design-system/tokens'
import { useEmployeeStore } from '../../store/employeeStore'
import { useVehicleStore } from '../../store/vehicleStore'
import { useDutyStore } from '../../store/dutyStore'
import type { Employee, EmployeeRole } from '../../mock-data/employees'
import { ROLE_LABELS_FR, ROLE_SHORT_FR, isValidMatricule } from '../../mock-data/employees'
import { COORDINATOR_NAV } from './coordinatorNav'
import { useTickets } from '../../shared/hooks/useTickets'

const ROLE_COLORS: Record<EmployeeRole, { bg: string; text: string; border: string }> = {
  eep:         { bg: COLORS.severity.moyenne.bg,   text: COLORS.severity.moyenne.text,   border: COLORS.severity.moyenne.border },
  sed:         { bg: '#FFF3E0',                     text: '#92400E',                       border: '#FCD34D' },
  cgr:         { bg: COLORS.semantic.info.bg,      text: COLORS.semantic.info.text,       border: COLORS.semantic.info.border! },
  coordinator: { bg: COLORS.status.programme.bg,   text: '#5B21B6',                       border: '#DDD6FE' },
  observer:    { bg: COLORS.bg.panel,              text: COLORS.text.secondary,            border: COLORS.border.default },
}

type FormData = {
  name:       string
  role:       EmployeeRole
  sectorId:   string
  phone:      string
  email:      string
  matricule:  string
  vehicleId:  string
  status:     'actif' | 'inactif'
  joinedDate: string
}

const EMPTY_FORM: FormData = {
  name: '', role: 'eep', sectorId: '', phone: '', email: '',
  matricule: '', vehicleId: '', status: 'actif',
  joinedDate: new Date().toISOString().slice(0, 10),
}

export function EmployeeManagement() {
  const { tickets }    = useTickets()
  const { employees, addEmployee, updateEmployee, toggleStatus, removeEmployee } = useEmployeeStore()
  const vehicles       = useVehicleStore((s) => s.vehicles)
  const sectors        = useDutyStore((s) => s.sectors).filter((s) => s.status === 'actif')

  const [search,     setSearch]     = useState('')
  const [roleFilter, setRoleFilter] = useState<EmployeeRole | 'tous'>('tous')
  const [showModal,  setShowModal]  = useState(false)
  const [editId,     setEditId]     = useState<string | null>(null)
  const [form,       setForm]       = useState<FormData>(EMPTY_FORM)
  const [errors,     setErrors]     = useState<Record<string, string>>({})
  const [saving,     setSaving]     = useState(false)

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

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setErrors({})
    setShowModal(true)
  }

  function openEdit(emp: Employee) {
    setForm({
      name:       emp.name,
      role:       emp.role,
      sectorId:   emp.sectorId ?? '',
      phone:      emp.phone,
      email:      emp.email,
      matricule:  emp.matricule,
      vehicleId:  emp.vehicleId ?? '',
      status:     emp.status,
      joinedDate: emp.joinedDate,
    })
    setEditId(emp.id)
    setErrors({})
    setShowModal(true)
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim())     e.name      = 'Requis'
    if (!form.phone.trim())    e.phone     = 'Requis'
    if (!form.email.trim())    e.email     = 'Requis'
    if (!form.matricule.trim()) e.matricule = 'Requis'
    else if (!isValidMatricule(form.matricule)) e.matricule = 'Format invalide — ex: 12345A (5 chiffres + 1 lettre)'
    // Check duplicate matricule
    const dup = employees.find((e) => e.matricule === form.matricule && e.id !== editId)
    if (dup) e.matricule = 'Ce matricule est déjà utilisé'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      const initials = form.name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2)
      const sectorObj = sectors.find((s) => s.id === form.sectorId)
      const payload: Omit<Employee, 'id' | 'activeTickets'> = {
        name:       form.name.trim(),
        initials,
        role:       form.role,
        sectorId:   form.sectorId || undefined,
        sector:     sectorObj?.name,
        phone:      form.phone.trim(),
        email:      form.email.trim(),
        matricule:  form.matricule.trim().toUpperCase(),
        vehicleId:  form.vehicleId || undefined,
        status:     form.status,
        joinedDate: form.joinedDate,
      }
      if (editId) {
        await updateEmployee(editId, payload)
      } else {
        await addEmployee(payload)
      }
      setShowModal(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue'
      setErrors((e) => ({ ...e, _server: msg }))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Supprimer cet employé ? Cette action est irréversible.')) return
    await removeEmployee(id)
  }

  const F = ({ label, name, required, children }: { label: string; name: string; required?: boolean; children: React.ReactNode }) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.secondary, display: 'block', marginBottom: '5px' }}>
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      {children}
      {errors[name] && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px' }}>{errors[name]}</div>}
    </div>
  )

  const inputStyle = (name: string) => ({
    width: '100%', height: '38px',
    border: `0.5px solid ${errors[name] ? '#EF4444' : COLORS.border.strong}`,
    borderRadius: '8px', padding: '0 12px', fontSize: '13px',
    color: COLORS.text.primary, outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box' as const, background: COLORS.bg.surface,
  })

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
          <button onClick={openAdd}
            style={{ height: '40px', background: COLORS.brand.blue, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' }}>
            <IconPlus size={15} /> Ajouter un employé
          </button>
        </div>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }} className="emp-kpi">
          {[
            { label: 'Total employés',       value: stats.total,  color: COLORS.text.primary },
            { label: 'Actifs',               value: stats.actifs, color: COLORS.brand.green },
            { label: 'Équipe de Permanance', value: stats.eep,    color: '#854D0E' },
            { label: 'Équipe SED',           value: stats.sed,    color: '#92400E' },
          ].map((k) => (
            <div key={k.label} className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '12px', border: `0.5px solid ${COLORS.border.default}`, padding: '16px 18px' }}>
              <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '6px' }}>{k.label}</div>
              <div style={{ fontSize: '26px', fontWeight: 500, color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, overflow: 'hidden' }}>
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
                  {['Employé', 'Matricule', 'Rôle', 'Secteur', 'Téléphone', 'Véhicule', 'Statut', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => {
                  const rc  = ROLE_COLORS[emp.role] ?? ROLE_COLORS.observer
                  const veh = vehicles.find((v) => v.id === emp.vehicleId)
                  return (
                    <tr key={emp.id} style={{ borderBottom: `0.5px solid #F5F5F5` }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: COLORS.semantic.info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 500, color: COLORS.semantic.info.text, flexShrink: 0 }}>
                            {emp.initials}
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{emp.name}</div>
                            <div style={{ fontSize: '11px', color: COLORS.text.muted }}>Depuis {emp.joinedDate.split('-')[0]}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 500, color: COLORS.text.secondary }}>{emp.matricule}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '20px', background: rc.bg, color: rc.text, border: `0.5px solid ${rc.border}`, whiteSpace: 'nowrap' }}>
                          {ROLE_LABELS_FR[emp.role]}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: '12px', color: COLORS.text.secondary }}>{emp.sector ?? '—'}</td>
                      <td style={{ padding: '12px 8px', fontSize: '12px', color: COLORS.text.secondary, fontFamily: 'monospace' }}>{emp.phone}</td>
                      <td style={{ padding: '12px 8px', fontSize: '12px', color: COLORS.text.secondary }}>{veh ? `${veh.plate} · ${veh.brand} ${veh.model}` : '—'}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '20px', background: emp.status === 'actif' ? COLORS.semantic.success.bg : COLORS.bg.page, color: emp.status === 'actif' ? COLORS.semantic.success.text : COLORS.text.muted, border: `0.5px solid ${emp.status === 'actif' ? '#BBF7D0' : COLORS.border.default}` }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: emp.status === 'actif' ? COLORS.brand.green : COLORS.text.muted }} />
                          {emp.status === 'actif' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => openEdit(emp)} title="Modifier"
                            style={{ width: '28px', height: '28px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '6px', background: COLORS.bg.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconPencil size={13} color={COLORS.text.secondary} />
                          </button>
                          <button onClick={() => toggleStatus(emp.id)} title={emp.status === 'actif' ? 'Désactiver' : 'Activer'}
                            style={{ width: '28px', height: '28px', border: `0.5px solid ${emp.status === 'actif' ? '#FECACA' : '#BBF7D0'}`, borderRadius: '6px', background: emp.status === 'actif' ? COLORS.semantic.danger.bg : COLORS.semantic.success.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {emp.status === 'actif' ? <IconUserX size={13} color="#991B1B" /> : <IconUserCheck size={13} color="#166534" />}
                          </button>
                          <button onClick={() => handleDelete(emp.id)} title="Supprimer"
                            style={{ width: '28px', height: '28px', border: `0.5px solid #FECACA`, borderRadius: '6px', background: COLORS.semantic.danger.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconX size={13} color="#991B1B" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: COLORS.text.muted }}>Aucun employé trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '10px 20px', borderTop: `0.5px solid ${COLORS.border.default}`, fontSize: '12px', color: COLORS.text.muted }}>
            {filtered.length} employé{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: COLORS.bg.surface, borderRadius: '16px', width: '100%', maxWidth: '560px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ fontSize: '17px', fontWeight: 500, color: COLORS.text.primary }}>
                {editId ? 'Modifier l\'employé' : 'Ajouter un employé'}
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <IconX size={18} color={COLORS.text.secondary} />
              </button>
            </div>

            {errors._server && (
              <div style={{ background: COLORS.semantic.danger.bg, border: `0.5px solid #FECACA`, borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#991B1B', marginBottom: '16px' }}>
                {errors._server}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <F label="Nom complet" name="name" required>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="ex: Khalid Amrani" style={inputStyle('name')} />
                </F>
              </div>

              <F label="Rôle" name="role" required>
                <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as EmployeeRole, sectorId: '' }))}
                  style={{ ...inputStyle('role'), padding: '0 10px' }}>
                  {(Object.entries(ROLE_LABELS_FR) as [EmployeeRole, string][]).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </F>

              {form.role === 'eep' ? (
                <F label="Secteur" name="sectorId">
                  <select value={form.sectorId} onChange={(e) => setForm((f) => ({ ...f, sectorId: e.target.value }))}
                    style={{ ...inputStyle('sectorId'), padding: '0 10px' }}>
                    <option value="">— Aucun —</option>
                    {sectors.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </F>
              ) : <div />}

              <F label="Matricule (NNNNNL)" name="matricule" required>
                <input value={form.matricule} onChange={(e) => setForm((f) => ({ ...f, matricule: e.target.value.toUpperCase() }))}
                  placeholder="ex: 12345A" maxLength={6} style={{ ...inputStyle('matricule'), fontFamily: 'monospace' }} />
              </F>

              <F label="Téléphone" name="phone" required>
                <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="ex: 0661-234-567" style={inputStyle('phone')} />
              </F>

              <div style={{ gridColumn: '1 / -1' }}>
                <F label="Email" name="email" required>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="ex: k.amrani@onee.ma" style={inputStyle('email')} />
                </F>
              </div>

              <F label="Véhicule assigné" name="vehicleId">
                <select value={form.vehicleId} onChange={(e) => setForm((f) => ({ ...f, vehicleId: e.target.value }))}
                  style={{ ...inputStyle('vehicleId'), padding: '0 10px' }}>
                  <option value="">— Aucun véhicule —</option>
                  {vehicles.filter((v) => v.status === 'actif').map((v) => (
                    <option key={v.id} value={v.id}>{v.plate} · {v.brand} {v.model}</option>
                  ))}
                </select>
              </F>

              <F label="Date d'entrée" name="joinedDate">
                <input type="date" value={form.joinedDate} onChange={(e) => setForm((f) => ({ ...f, joinedDate: e.target.value }))}
                  style={inputStyle('joinedDate')} />
              </F>

              {editId && (
                <F label="Statut" name="status">
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'actif' | 'inactif' }))}
                    style={{ ...inputStyle('status'), padding: '0 10px' }}>
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </select>
                </F>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button onClick={() => setShowModal(false)} disabled={saving}
                style={{ height: '38px', padding: '0 18px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', background: COLORS.bg.surface, color: COLORS.text.secondary }}>
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ height: '38px', padding: '0 20px', background: COLORS.brand.blue, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: saving ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                {saving ? 'Enregistrement…' : editId ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 800px) { .emp-kpi { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  )
}
