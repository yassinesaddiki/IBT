import { useState } from 'react'
import { IconPlus, IconPencil, IconTrash, IconSearch, IconCar, IconTruck } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { SubNav } from '../../shared/components/SubNav'
import { COLORS } from '../../design-system/tokens'
import { useVehicleStore } from '../../store/vehicleStore'
import type { Vehicle, VehicleType, VehicleTeam, VehicleStatus } from '../../mock-data/vehicles'
import { VEHICLE_TYPE_LABELS, VEHICLE_STATUS_LABELS } from '../../mock-data/vehicles'
import { COORDINATOR_NAV } from './coordinatorNav'
import { useTickets } from '../../shared/hooks/useTickets'

const TEAM_LABELS: Record<string, string> = {
  eep: 'Équipe de Permanance',
  sed: 'SED',
}

const STATUS_COLORS: Record<VehicleStatus, { bg: string; text: string; border: string }> = {
  actif:       { bg: COLORS.semantic.success.bg,  text: COLORS.semantic.success.text,  border: '#BBF7D0' },
  inactif:     { bg: COLORS.bg.panel,             text: COLORS.text.secondary,          border: COLORS.border.default },
  maintenance: { bg: COLORS.severity.haute.bg,    text: COLORS.severity.haute.text,     border: COLORS.severity.haute.border },
}

const EMPTY: Omit<Vehicle, 'id'> = {
  plate: '', brand: '', model: '', vehicleType: 'voiture', assignedTeam: 'eep', status: 'actif',
}

export function VehicleManagement() {
  const { tickets } = useTickets()
  const pendingApproval = tickets.filter((t) => t.status === 'attente-approbation').length

  const { vehicles, addVehicle, updateVehicle, removeVehicle } = useVehicleStore()
  const [search,     setSearch]     = useState('')
  const [teamFilter, setTeamFilter] = useState<VehicleTeam | 'tous'>('tous')
  const [showModal,  setShowModal]  = useState(false)
  const [editId,     setEditId]     = useState<string | null>(null)
  const [form,       setForm]       = useState<Omit<Vehicle, 'id'>>(EMPTY)
  const [errors,     setErrors]     = useState<Record<string, string>>({})
  const [saving,     setSaving]     = useState(false)

  const filtered = vehicles.filter((v) => {
    const matchTeam   = teamFilter === 'tous' || v.assignedTeam === teamFilter
    const matchSearch = !search
      || v.plate.toLowerCase().includes(search.toLowerCase())
      || v.brand.toLowerCase().includes(search.toLowerCase())
      || v.model.toLowerCase().includes(search.toLowerCase())
    return matchTeam && matchSearch
  })

  const stats = {
    total:       vehicles.length,
    actifs:      vehicles.filter((v) => v.status === 'actif').length,
    maintenance: vehicles.filter((v) => v.status === 'maintenance').length,
    eep:         vehicles.filter((v) => v.assignedTeam === 'eep').length,
    sed:         vehicles.filter((v) => v.assignedTeam === 'sed').length,
  }

  function openAdd() {
    setForm(EMPTY)
    setEditId(null)
    setErrors({})
    setShowModal(true)
  }

  function openEdit(v: Vehicle) {
    setForm({ plate: v.plate, brand: v.brand, model: v.model, vehicleType: v.vehicleType, assignedTeam: v.assignedTeam, status: v.status })
    setEditId(v.id)
    setErrors({})
    setShowModal(true)
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.plate.trim())  e.plate  = 'Requis'
    if (!form.brand.trim())  e.brand  = 'Requis'
    if (!form.model.trim())  e.model  = 'Requis'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      if (editId) {
        await updateVehicle(editId, form)
      } else {
        await addVehicle(form)
      }
      setShowModal(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove(id: string) {
    if (!window.confirm('Supprimer ce véhicule ?')) return
    await removeVehicle(id)
  }

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Coordinateur" notifCount={pendingApproval} />
      <SubNav links={COORDINATOR_NAV(pendingApproval)} />

      <div style={{ paddingTop: '24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary }}>Gestion des Véhicules</div>
            <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '3px' }}>
              {stats.actifs} actifs · {stats.maintenance} en maintenance · {stats.eep} EP · {stats.sed} SED
            </div>
          </div>
          <button onClick={openAdd}
            style={{ height: '40px', background: COLORS.brand.blue, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' }}>
            <IconPlus size={15} /> Ajouter un véhicule
          </button>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }} className="veh-kpi">
          {[
            { label: 'Total',         value: stats.total,       color: COLORS.text.primary },
            { label: 'Actifs',        value: stats.actifs,      color: COLORS.brand.green },
            { label: 'Maintenance',   value: stats.maintenance, color: '#92400E' },
            { label: 'Éq. Permanance',value: stats.eep,         color: '#854D0E' },
            { label: 'SED',           value: stats.sed,         color: '#9A3412' },
          ].map((k) => (
            <div key={k.label} className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '12px', border: `0.5px solid ${COLORS.border.default}`, padding: '14px 16px' }}>
              <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '6px' }}>{k.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 500, color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `0.5px solid ${COLORS.border.default}`, display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
              <IconSearch size={14} color={COLORS.text.muted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Plaque, marque, modèle…"
                style={{ width: '100%', height: '34px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', padding: '0 12px 0 32px', fontSize: '13px', color: COLORS.text.primary, background: COLORS.bg.surface, outline: 'none', fontFamily: 'inherit' }} />
            </div>
            {(['tous', 'eep', 'sed'] as const).map((t) => (
              <button key={t} onClick={() => setTeamFilter(t)}
                style={{ height: '34px', padding: '0 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', background: teamFilter === t ? COLORS.semantic.info.bg : COLORS.bg.page, color: teamFilter === t ? COLORS.semantic.info.text : COLORS.text.secondary, border: teamFilter === t ? `0.5px solid ${COLORS.semantic.info.border}` : `0.5px solid ${COLORS.border.default}` }}>
                {t === 'tous' ? 'Tous' : t === 'eep' ? 'Éq. Permanance' : 'SED'}
              </button>
            ))}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: COLORS.bg.panel }}>
                  {['Véhicule', 'Plaque', 'Type', 'Équipe', 'Statut', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => {
                  const sc = STATUS_COLORS[v.status]
                  const isHeavy = v.vehicleType === 'camion' || v.vehicleType === 'nacelle'
                  return (
                    <tr key={v.id} style={{ borderBottom: `0.5px solid #F5F5F5` }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: isHeavy ? COLORS.severity.haute.bg : COLORS.semantic.info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {isHeavy
                              ? <IconTruck size={16} color={COLORS.severity.haute.text} />
                              : <IconCar   size={16} color={COLORS.semantic.info.text} />}
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{v.brand} {v.model}</div>
                            <div style={{ fontSize: '11px', color: COLORS.text.muted }}>{VEHICLE_TYPE_LABELS[v.vehicleType]}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{v.plate}</td>
                      <td style={{ padding: '12px 8px', fontSize: '12px', color: COLORS.text.secondary }}>{VEHICLE_TYPE_LABELS[v.vehicleType]}</td>
                      <td style={{ padding: '12px 8px', fontSize: '12px', color: COLORS.text.secondary }}>{v.assignedTeam ? TEAM_LABELS[v.assignedTeam] : '—'}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '20px', background: sc.bg, color: sc.text, border: `0.5px solid ${sc.border}` }}>
                          {VEHICLE_STATUS_LABELS[v.status]}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => openEdit(v)}
                            style={{ width: '28px', height: '28px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '6px', background: COLORS.bg.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconPencil size={13} color={COLORS.text.secondary} />
                          </button>
                          <button onClick={() => handleRemove(v.id)}
                            style={{ width: '28px', height: '28px', border: `0.5px solid #FECACA`, borderRadius: '6px', background: COLORS.semantic.danger.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconTrash size={13} color="#991B1B" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: COLORS.text.muted }}>
                      Aucun véhicule trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '10px 20px', borderTop: `0.5px solid ${COLORS.border.default}`, fontSize: '12px', color: COLORS.text.muted }}>
            {filtered.length} véhicule{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: COLORS.bg.surface, borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '17px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '20px' }}>
              {editId ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
            </div>

            {[
              { label: 'Plaque d\'immatriculation', key: 'plate', placeholder: 'ex: DO 248' },
              { label: 'Marque',                    key: 'brand', placeholder: 'ex: Dacia' },
              { label: 'Modèle',                    key: 'model', placeholder: 'ex: Sandero' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.secondary, display: 'block', marginBottom: '5px' }}>
                  {label} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ width: '100%', height: '38px', border: `0.5px solid ${errors[key] ? '#EF4444' : COLORS.border.strong}`, borderRadius: '8px', padding: '0 12px', fontSize: '13px', color: COLORS.text.primary, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                {errors[key] && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px' }}>{errors[key]}</div>}
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.secondary, display: 'block', marginBottom: '5px' }}>Type</label>
                <select value={form.vehicleType} onChange={(e) => setForm((f) => ({ ...f, vehicleType: e.target.value as VehicleType }))}
                  style={{ width: '100%', height: '38px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', padding: '0 10px', fontSize: '13px', color: COLORS.text.primary, outline: 'none', fontFamily: 'inherit', background: COLORS.bg.surface }}>
                  {(Object.entries(VEHICLE_TYPE_LABELS) as [VehicleType, string][]).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.secondary, display: 'block', marginBottom: '5px' }}>Équipe</label>
                <select value={form.assignedTeam ?? ''} onChange={(e) => setForm((f) => ({ ...f, assignedTeam: e.target.value as VehicleTeam | null }))}
                  style={{ width: '100%', height: '38px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', padding: '0 10px', fontSize: '13px', color: COLORS.text.primary, outline: 'none', fontFamily: 'inherit', background: COLORS.bg.surface }}>
                  <option value="eep">Équipe de Permanance</option>
                  <option value="sed">SED</option>
                </select>
              </div>
            </div>

            {editId && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.secondary, display: 'block', marginBottom: '5px' }}>Statut</label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as VehicleStatus }))}
                  style={{ width: '100%', height: '38px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', padding: '0 10px', fontSize: '13px', color: COLORS.text.primary, outline: 'none', fontFamily: 'inherit', background: COLORS.bg.surface }}>
                  <option value="actif">Actif</option>
                  <option value="maintenance">En maintenance</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
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
        @media (max-width: 900px) { .veh-kpi { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 600px) { .veh-kpi { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  )
}
