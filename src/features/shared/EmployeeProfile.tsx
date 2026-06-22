import { useParams, useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { IconArrowLeft, IconPencil, IconPhone, IconMail, IconCalendar, IconCar, IconTicket, IconCamera } from '@tabler/icons-react'
import { COLORS } from '../../design-system/tokens'
import { useEmployee } from '../../shared/hooks/useEmployee'
import { useAuthStore } from '../../store/authStore'
import { useAccountStore } from '../../store/accountStore'
import { useTickets } from '../../shared/hooks/useTickets'
import { ROLE_LABELS_FR } from '../../mock-data/employees'
import { StatusBadge, SeverityBadge } from '../../design-system/components/Badge'
import { formatElapsed } from '../../shared/utils/formatDate'
import { useStorageUpload } from '../../shared/hooks/useStorageUpload'
import { useEmployeeStore } from '../../store/employeeStore'

export function EmployeeProfile() {
  const { id }      = useParams<{ id: string }>()
  const navigate    = useNavigate()
  const emp         = useEmployee(id)
  const user        = useAuthStore((s) => s.user)
  const accounts    = useAccountStore((s) => s.accounts)
  const { tickets } = useTickets()
  const updateEmployee = useEmployeeStore((s) => s.updateEmployee)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const { upload: uploadAvatar, uploading: avatarUploading } = useStorageUpload('employee-avatars')

  if (!emp) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: COLORS.text.muted }}>Employé introuvable.</div>
        <button onClick={() => navigate(-1)} style={{ marginTop: '16px', fontSize: '13px', color: COLORS.brand.blue, background: 'none', border: 'none', cursor: 'pointer' }}>← Retour</button>
      </div>
    )
  }

  // Check if the logged-in user IS this employee (via account linkage)
  const myAccount    = accounts.find((a) => a.id === user?.id)
  const isSelf       = myAccount?.employeeId === emp.id
  const isCoordinator = user?.role === 'coordinator'
  const canEdit      = isSelf || isCoordinator

  // Tickets involving this employee
  const activeTickets = tickets.filter((t) =>
    (t.eepIntervention?.agentId === emp.id || t.eepIntervention?.agentName === emp.name ||
     t.sedIntervention?.agentId === emp.id || t.sedIntervention?.agentName === emp.name) &&
    t.status !== 'ferme'
  )
  const resolvedThisMonth = tickets.filter((t) => {
    const now = new Date()
    const createdAt = new Date(t.createdAt)
    return (
      (t.eepIntervention?.agentId === emp.id || t.eepIntervention?.agentName === emp.name ||
       t.sedIntervention?.agentId === emp.id || t.sedIntervention?.agentName === emp.name) &&
      (t.status === 'resolu-eep' || t.status === 'resolu-sed' || t.status === 'ferme') &&
      createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
    )
  }).length

  async function handleAvatarUpload(file: File) {
    if (!emp) return
    const ext  = file.name.split('.').pop() ?? 'jpg'
    const result = await uploadAvatar(file, `${emp.id}/avatar.${ext}`)
    await updateEmployee(emp.id, { avatarUrl: result.publicUrl })
  }

  const isMobile = user?.role === 'eep' || user?.role === 'sed'

  const roleColor = {
    eep:         { bg: COLORS.severity.moyenne.bg, text: COLORS.severity.moyenne.text, border: COLORS.severity.moyenne.border },
    sed:         { bg: '#FFF3E0', text: '#92400E', border: '#FCD34D' },
    cgr:         { bg: COLORS.semantic.info.bg, text: COLORS.semantic.info.text, border: COLORS.semantic.info.border! },
    coordinator: { bg: COLORS.status.programme.bg, text: '#5B21B6', border: '#DDD6FE' },
    observer:    { bg: COLORS.bg.panel, text: COLORS.text.secondary, border: COLORS.border.default },
  }[emp.role] ?? { bg: COLORS.bg.panel, text: COLORS.text.secondary, border: COLORS.border.default }

  const Wrapper = isMobile
    ? ({ children }: { children: React.ReactNode }) => (
        <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#1A1A2E', padding: '20px 0' }}>
          <div style={{ width: '375px', borderRadius: '36px', overflow: 'hidden', border: '10px solid #2A2A3E', background: COLORS.bg.page, paddingBottom: '24px' }}>
            {children}
          </div>
        </div>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 60px', background: COLORS.bg.page, minHeight: '100vh' }}>
          {children}
        </div>
      )

  return (
    <Wrapper>
      {/* Header */}
      <div style={{ background: COLORS.brand.blue, padding: '16px 20px 24px' }}>
        <button onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginBottom: '16px', padding: 0, fontFamily: 'inherit' }}>
          <IconArrowLeft size={15} /> Retour
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Avatar */}
          <div
            onClick={() => canEdit && avatarInputRef.current?.click()}
            style={{ width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0, overflow: 'hidden', border: '2.5px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 500, color: '#fff', cursor: canEdit ? 'pointer' : 'default', position: 'relative' }}
          >
            {emp.avatarUrl
              ? <img src={emp.avatarUrl} alt={emp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : emp.initials
            }
            {canEdit && (
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderRadius: '50%', background: COLORS.brand.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {avatarUploading ? <span style={{ fontSize: '8px', color: '#fff' }}>…</span> : <IconCamera size={11} color="#fff" />}
              </div>
            )}
            <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleAvatarUpload(f) }} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: 500 }}>{emp.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontFamily: 'monospace', marginTop: '2px' }}>{emp.matricule}</div>
            <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px', background: roleColor.bg, color: roleColor.text, border: `0.5px solid ${roleColor.border}` }}>
                {ROLE_LABELS_FR[emp.role]}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px', background: emp.status === 'actif' ? COLORS.semantic.success.bg : COLORS.bg.panel, color: emp.status === 'actif' ? COLORS.semantic.success.text : COLORS.text.muted, border: `0.5px solid ${emp.status === 'actif' ? '#BBF7D0' : COLORS.border.default}` }}>
                <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: emp.status === 'actif' ? COLORS.brand.green : COLORS.text.muted, marginRight: '4px', verticalAlign: 'middle' }} />
                {emp.status === 'actif' ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>

          {canEdit && (
            <button
              onClick={() => { if (isCoordinator) navigate('/coordinator/employes', { state: { editId: emp.id } }) }}
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <IconPencil size={16} color="#fff" />
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '20px' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'Actifs',       value: activeTickets.length,    color: COLORS.severity.haute.text },
            { label: 'Ce mois',      value: resolvedThisMonth,        color: COLORS.brand.green },
            { label: 'Total équipe', value: tickets.filter((t) => t.eepIntervention?.agentName === emp.name || t.sedIntervention?.agentName === emp.name).length, color: COLORS.brand.blue },
          ].map((s) => (
            <div key={s.label} className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '12px', border: `0.5px solid ${COLORS.border.default}`, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 500, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: COLORS.text.muted, marginTop: '2px' }}>Tickets {s.label}</div>
            </div>
          ))}
        </div>

        {/* Info card */}
        <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '18px', marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '14px' }}>Informations</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: <IconPhone size={14} color={COLORS.text.muted} />, label: 'Téléphone', value: emp.phone },
              { icon: <IconMail  size={14} color={COLORS.text.muted} />, label: 'Email',     value: emp.email },
              { icon: <IconCalendar size={14} color={COLORS.text.muted} />, label: 'Entrée', value: new Date(emp.joinedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: COLORS.bg.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {row.icon}
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted }}>{row.label}</div>
                  <div style={{ fontSize: '13px', color: COLORS.text.primary }}>{row.value}</div>
                </div>
              </div>
            ))}

            {emp.sector && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: COLORS.bg.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}>
                  🗺️
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted }}>Secteur assigné</div>
                  <div style={{ fontSize: '13px', color: COLORS.text.primary }}>{emp.sector}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vehicle card */}
        {emp.vehicle && (
          <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '18px', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconCar size={15} color={COLORS.text.secondary} /> Véhicule assigné
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: COLORS.bg.page, borderRadius: '10px', padding: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: COLORS.semantic.info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconCar size={18} color={COLORS.semantic.info.text} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{emp.vehicle.brand} {emp.vehicle.model}</div>
                <div style={{ fontSize: '12px', color: COLORS.text.muted, fontFamily: 'monospace' }}>{emp.vehicle.plate}</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px', background: emp.vehicle.status === 'actif' ? COLORS.semantic.success.bg : COLORS.severity.haute.bg, color: emp.vehicle.status === 'actif' ? COLORS.semantic.success.text : COLORS.severity.haute.text, border: `0.5px solid ${emp.vehicle.status === 'actif' ? '#BBF7D0' : COLORS.severity.haute.border}` }}>
                {emp.vehicle.status === 'actif' ? 'Actif' : emp.vehicle.status === 'maintenance' ? 'Maintenance' : 'Inactif'}
              </span>
            </div>
          </div>
        )}

        {/* Active tickets */}
        <div className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, padding: '18px' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IconTicket size={15} color={COLORS.text.secondary} /> Tickets actifs ({activeTickets.length})
          </div>
          {activeTickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: COLORS.text.muted }}>Aucun ticket actif en ce moment</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeTickets.map((t) => (
                <div key={t.id} onClick={() => navigate(`/${user?.role === 'eep' || user?.role === 'sed' ? user.role : 'coordinator'}/ticket/${t.id}`)}
                  style={{ background: COLORS.bg.page, borderRadius: '10px', padding: '10px 12px', cursor: 'pointer', border: `0.5px solid ${COLORS.border.default}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', color: COLORS.text.muted }}>#{t.id}</span>
                    <SeverityBadge severity={t.severity} />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.text.primary, marginBottom: '4px' }}>{t.clientName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <StatusBadge status={t.status} />
                    <span style={{ fontSize: '11px', color: COLORS.text.muted }}>{formatElapsed(t.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Self-edit section — employee can update phone */}
        {isSelf && (
          <div className="animate-up" style={{ background: COLORS.severity.moyenne.bg, borderRadius: '14px', border: `0.5px solid ${COLORS.severity.moyenne.border}`, padding: '14px 18px', marginTop: '16px', fontSize: '12px', color: COLORS.severity.moyenne.text }}>
            Pour modifier votre profil (photo, téléphone), contactez votre Coordinateur.
          </div>
        )}
      </div>
    </Wrapper>
  )
}
