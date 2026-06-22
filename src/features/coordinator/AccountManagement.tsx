import { useState } from 'react'
import { IconPlus, IconPencil, IconUserCheck, IconUserX, IconSearch, IconEye, IconEyeOff } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { SubNav } from '../../shared/components/SubNav'
import { COLORS } from '../../design-system/tokens'
import { useAccountStore } from '../../store/accountStore'
import { useDutyStore } from '../../store/dutyStore'
import type { MockUser, UserRole } from '../../shared/types/user'
import { COORDINATOR_NAV } from './coordinatorNav'
import { useTickets } from '../../shared/hooks/useTickets'

const ROLE_LABELS: Record<UserRole, string> = {
  cgr:         'CGR — Centre de gestion',
  eep:         'Équipe de Permanance',
  sed:         'SED — Intervention lourde',
  coordinator: 'Coordinateur',
  observer:    'Observateur / Directeur',
}

const ROLE_COLORS: Record<UserRole, { bg: string; text: string; border: string }> = {
  cgr:         { bg: COLORS.semantic.info.bg,      text: COLORS.semantic.info.text,      border: COLORS.semantic.info.border! },
  eep:         { bg: COLORS.severity.moyenne.bg,   text: COLORS.severity.moyenne.text,   border: COLORS.severity.moyenne.border },
  sed:         { bg: '#FFF3E0',                     text: '#92400E',                       border: '#FCD34D' },
  coordinator: { bg: COLORS.status.programme.bg,   text: '#5B21B6',                       border: '#DDD6FE' },
  observer:    { bg: COLORS.bg.panel,              text: COLORS.text.secondary,            border: COLORS.border.default },
}

const EMPTY: Omit<MockUser, 'id' | 'initials'> = {
  name: '', role: 'eep', username: '', password: '', active: true,
}

export function AccountManagement() {
  const { tickets } = useTickets()
  const pendingApproval = tickets.filter((t) => t.status === 'attente-approbation').length

  const { accounts, addAccount, updateAccount, toggleActive } = useAccountStore()
  const sectors = useDutyStore((s) => s.sectors).filter((s) => s.status === 'actif')

  const [search,     setSearch]     = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'tous'>('tous')
  const [showModal,  setShowModal]  = useState(false)
  const [editId,     setEditId]     = useState<string | null>(null)
  const [form,       setForm]       = useState<Omit<MockUser, 'id' | 'initials'>>(EMPTY)
  const [errors,     setErrors]     = useState<Record<string, string>>({})
  const [saving,     setSaving]     = useState(false)
  const [showPwd,    setShowPwd]    = useState(false)

  const filtered = accounts.filter((a) => {
    const matchRole   = roleFilter === 'tous' || a.role === roleFilter
    const matchSearch = !search
      || a.name.toLowerCase().includes(search.toLowerCase())
      || a.username.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  function openAdd() {
    setForm(EMPTY)
    setEditId(null)
    setErrors({})
    setShowPwd(false)
    setShowModal(true)
  }

  function openEdit(a: MockUser) {
    setForm({ name: a.name, role: a.role, username: a.username, password: a.password, active: a.active, sectorId: a.sectorId })
    setEditId(a.id)
    setErrors({})
    setShowPwd(false)
    setShowModal(true)
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim())     e.name     = 'Requis'
    if (!form.username.trim()) e.username = 'Requis'
    if (!form.password.trim()) e.password = 'Requis'
    const dup = accounts.find((a) => a.username === form.username && a.id !== editId)
    if (dup) e.username = 'Ce nom d\'utilisateur est déjà utilisé'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      if (editId) {
        await updateAccount(editId, form)
      } else {
        await addAccount(form)
      }
      setShowModal(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Coordinateur" notifCount={pendingApproval} />
      <SubNav links={COORDINATOR_NAV(pendingApproval)} />

      <div style={{ paddingTop: '24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary }}>Gestion des Comptes Utilisateurs</div>
            <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '3px' }}>
              {accounts.filter((a) => a.active).length} comptes actifs · {accounts.length} total
            </div>
          </div>
          <button onClick={openAdd}
            style={{ height: '40px', background: COLORS.brand.blue, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' }}>
            <IconPlus size={15} /> Ajouter un compte
          </button>
        </div>

        {/* Notice */}
        <div style={{ background: COLORS.severity.moyenne.bg, border: `0.5px solid ${COLORS.severity.moyenne.border}`, borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', fontSize: '12px', color: COLORS.severity.moyenne.text }}>
          ⚠️ Mode prototype — Les mots de passe sont stockés en clair. À sécuriser avant mise en production.
        </div>

        {/* Table */}
        <div style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `0.5px solid ${COLORS.border.default}`, display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
              <IconSearch size={14} color={COLORS.text.muted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nom, identifiant…"
                style={{ width: '100%', height: '34px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', padding: '0 12px 0 32px', fontSize: '13px', color: COLORS.text.primary, background: COLORS.bg.surface, outline: 'none', fontFamily: 'inherit' }} />
            </div>
            {(['tous', 'cgr', 'eep', 'sed', 'coordinator', 'observer'] as const).map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)}
                style={{ height: '34px', padding: '0 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', background: roleFilter === r ? COLORS.semantic.info.bg : COLORS.bg.page, color: roleFilter === r ? COLORS.semantic.info.text : COLORS.text.secondary, border: roleFilter === r ? `0.5px solid ${COLORS.semantic.info.border}` : `0.5px solid ${COLORS.border.default}` }}>
                {r === 'tous' ? 'Tous' : r === 'eep' ? 'EP' : r === 'coordinator' ? 'Coord.' : r.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: COLORS.bg.panel }}>
                  {['Nom', 'Identifiant', 'Rôle', 'Secteur', 'Statut', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((acc) => {
                  const rc = ROLE_COLORS[acc.role]
                  const sectorName = acc.sectorId ? sectors.find((s) => s.id === acc.sectorId)?.name : undefined
                  return (
                    <tr key={acc.id} style={{ borderBottom: `0.5px solid #F5F5F5` }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: rc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 500, color: rc.text, flexShrink: 0 }}>
                            {acc.initials}
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{acc.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontSize: '12px', color: COLORS.text.secondary }}>{acc.username}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '20px', background: rc.bg, color: rc.text, border: `0.5px solid ${rc.border}` }}>
                          {ROLE_LABELS[acc.role]}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: '12px', color: COLORS.text.secondary }}>{sectorName ?? '—'}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '20px', background: acc.active ? COLORS.semantic.success.bg : COLORS.bg.page, color: acc.active ? COLORS.semantic.success.text : COLORS.text.muted, border: `0.5px solid ${acc.active ? '#BBF7D0' : COLORS.border.default}` }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: acc.active ? COLORS.brand.green : COLORS.text.muted }} />
                          {acc.active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => openEdit(acc)}
                            style={{ width: '28px', height: '28px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '6px', background: COLORS.bg.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconPencil size={13} color={COLORS.text.secondary} />
                          </button>
                          <button onClick={() => toggleActive(acc.id)}
                            style={{ width: '28px', height: '28px', border: `0.5px solid ${acc.active ? '#FECACA' : '#BBF7D0'}`, borderRadius: '6px', background: acc.active ? COLORS.semantic.danger.bg : COLORS.semantic.success.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {acc.active ? <IconUserX size={13} color="#991B1B" /> : <IconUserCheck size={13} color="#166534" />}
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
            {filtered.length} compte{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: COLORS.bg.surface, borderRadius: '16px', width: '100%', maxWidth: '460px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '17px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '20px' }}>
              {editId ? 'Modifier le compte' : 'Ajouter un compte'}
            </div>

            {/* Name */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.secondary, display: 'block', marginBottom: '5px' }}>Nom complet <span style={{ color: '#EF4444' }}>*</span></label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="ex: Khalid Amrani"
                style={{ width: '100%', height: '38px', border: `0.5px solid ${errors.name ? '#EF4444' : COLORS.border.strong}`, borderRadius: '8px', padding: '0 12px', fontSize: '13px', color: COLORS.text.primary, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              {errors.name && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px' }}>{errors.name}</div>}
            </div>

            {/* Role */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.secondary, display: 'block', marginBottom: '5px' }}>Rôle <span style={{ color: '#EF4444' }}>*</span></label>
              <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                style={{ width: '100%', height: '38px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', padding: '0 10px', fontSize: '13px', color: COLORS.text.primary, outline: 'none', fontFamily: 'inherit', background: COLORS.bg.surface, boxSizing: 'border-box' }}>
                {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            {/* Sector (only for EEP) */}
            {form.role === 'eep' && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.secondary, display: 'block', marginBottom: '5px' }}>Secteur assigné</label>
                <select value={form.sectorId ?? ''} onChange={(e) => setForm((f) => ({ ...f, sectorId: e.target.value || undefined }))}
                  style={{ width: '100%', height: '38px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', padding: '0 10px', fontSize: '13px', color: COLORS.text.primary, outline: 'none', fontFamily: 'inherit', background: COLORS.bg.surface, boxSizing: 'border-box' }}>
                  <option value="">— Aucun secteur —</option>
                  {sectors.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}

            {/* Username */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.secondary, display: 'block', marginBottom: '5px' }}>Identifiant <span style={{ color: '#EF4444' }}>*</span></label>
              <input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} placeholder="ex: k.amrani"
                style={{ width: '100%', height: '38px', border: `0.5px solid ${errors.username ? '#EF4444' : COLORS.border.strong}`, borderRadius: '8px', padding: '0 12px', fontSize: '13px', color: COLORS.text.primary, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              {errors.username && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px' }}>{errors.username}</div>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: COLORS.text.secondary, display: 'block', marginBottom: '5px' }}>Mot de passe <span style={{ color: '#EF4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Mot de passe"
                  style={{ width: '100%', height: '38px', border: `0.5px solid ${errors.password ? '#EF4444' : COLORS.border.strong}`, borderRadius: '8px', padding: '0 40px 0 12px', fontSize: '13px', color: COLORS.text.primary, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setShowPwd((p) => !p)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {showPwd ? <IconEyeOff size={15} color={COLORS.text.muted} /> : <IconEye size={15} color={COLORS.text.muted} />}
                </button>
              </div>
              {errors.password && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px' }}>{errors.password}</div>}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
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
    </div>
  )
}
