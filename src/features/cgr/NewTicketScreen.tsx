import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconArrowRight, IconCircleCheck } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { COLORS } from '../../design-system/tokens'
import { useTicketStore } from '../../store/ticketStore'
import { useAuthStore } from '../../store/authStore'
import { useCategoryStore } from '../../store/categoryStore'
import { useDutyStore } from '../../store/dutyStore'
import type { Severity } from '../../shared/types/ticket'

const SEVERITY_OPTIONS: { value: Severity; label: string; desc: string; bg: string; text: string; border: string; dot: string }[] = [
  { value: 'Critique', label: 'Critique', desc: 'Danger immédiat, coupure massive', bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', dot: '#EF4444' },
  { value: 'Haute',    label: 'Haute',    desc: 'Impact important, intervention urgente', bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', dot: '#F97316' },
  { value: 'Moyenne',  label: 'Moyenne',  desc: 'Gêne client, intervention standard', bg: '#FEFCE8', text: '#854D0E', border: '#FEF08A', dot: '#EAB308' },
]

export function NewTicketScreen() {
  const navigate    = useNavigate()
  const addTicket   = useTicketStore((s) => s.addTicket)
  const user        = useAuthStore((s) => s.user)
  const categories  = useCategoryStore((s) => s.categories)
  const allSectors  = useDutyStore((s) => s.sectors)
  const activeSectors = allSectors.filter((s) => s.status === 'actif')

  // Client info
  const [clientName,      setClientName]      = useState('')
  const [contractNumber,  setContractNumber]  = useState('')
  const [phone,           setPhone]           = useState('')
  const [address,         setAddress]         = useState('')
  const [sectorId,        setSectorId]        = useState('')   // DB sector id
  const [sector,          setSector]          = useState('')   // sector name (for display)

  // Problem info
  const [categoryId,    setCategoryId]    = useState('')
  const [subCategoryId, setSubCategoryId] = useState('')
  const [severity,      setSeverity]      = useState<Severity | ''>('')
  const [description,   setDescription]  = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [done,       setDone]       = useState(false)
  const [errors,     setErrors]     = useState<Record<string, string>>({})

  const selectedCategory = categories.find((c) => c.id === categoryId)
  const selectedSub      = selectedCategory?.subCategories.find((s) => s.id === subCategoryId)

  const handleCategoryChange = (id: string) => {
    setCategoryId(id)
    setSubCategoryId('')
    setSeverity('')
  }

  const handleSubCategoryChange = (id: string) => {
    setSubCategoryId(id)
    const sub = selectedCategory?.subCategories.find((s) => s.id === id)
    if (sub?.defaultSeverity) setSeverity(sub.defaultSeverity)
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!clientName.trim())     e.clientName     = 'Requis'
    if (!contractNumber.trim()) e.contractNumber  = 'Requis'
    if (!phone.trim())          e.phone           = 'Requis'
    if (!address.trim())        e.address         = 'Requis'
    if (!sectorId)              e.sector          = 'Requis'
    if (!categoryId)            e.category        = 'Requis'
    if (!subCategoryId)         e.subCategory     = 'Requis'
    if (!severity)              e.severity        = 'Requis'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      await addTicket({
        clientName,
        contractNumber,
        phone,
        address,
        sector,        // sector_name in DB
        sectorId,      // sector_id in DB
        category:          selectedCategory?.label ?? '',
        subCategory:       selectedSub?.label ?? '',
        severity:          severity as Severity,
        description:       description || undefined,
        status:            'nouveau',
        createdBy:         user?.id ?? 'cgr-1',
        preCheckMT:        true,
        preCheckProgramme: true,
      })
      setDone(true)
      setTimeout(() => navigate('/cgr/dashboard'), 1500)
    } catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Centre de Gestion des Réclamations" notifCount={3} />

      <div style={{ paddingTop: '32px', maxWidth: '780px', margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: COLORS.text.muted, marginBottom: '20px' }}>
          <span onClick={() => navigate('/cgr/dashboard')} style={{ cursor: 'pointer', color: COLORS.brand.blue }}>Tableau de bord</span>
          <span>›</span>
          <span onClick={() => navigate('/cgr/precheck')} style={{ cursor: 'pointer', color: COLORS.brand.blue }}>Nouveau Appel</span>
          <span>›</span>
          <span style={{ color: COLORS.text.primary, fontWeight: 500 }}>Nouveau ticket</span>
        </div>

        {/* Page title */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary }}>Nouveau Ticket d'Intervention</div>
          <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '4px' }}>
            Pré-check MT et coupure programmée : <span style={{ color: COLORS.brand.green, fontWeight: 500 }}>✓ Confirmés</span>
          </div>
        </div>

        {/* ── SECTION A: Client info ── */}
        <FormSection letter="A" title="Informations client">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid-2">
            <FormField label="Nom complet du client" error={errors.clientName} required>
              <TextInput
                value={clientName}
                onChange={setClientName}
                placeholder="Ex : Mohammed Alami"
                error={!!errors.clientName}
              />
            </FormField>
            <FormField label="Numéro de contrat" error={errors.contractNumber} required>
              <TextInput
                value={contractNumber}
                onChange={setContractNumber}
                placeholder="Ex : C-004521"
                error={!!errors.contractNumber}
              />
            </FormField>
            <FormField label="Numéro de téléphone" error={errors.phone} required>
              <TextInput
                value={phone}
                onChange={setPhone}
                placeholder="Ex : 0661-234-567"
                error={!!errors.phone}
              />
            </FormField>
            <FormField label="Secteur" error={errors.sector} required>
              <SelectInput
                value={sectorId}
                onChange={(val) => {
                  setSectorId(val)
                  setSector(activeSectors.find((s) => s.id === val)?.name ?? '')
                }}
                options={activeSectors.map((s) => ({ value: s.id, label: s.name }))}
                placeholder="Sélectionner un secteur"
                error={!!errors.sector}
              />
            </FormField>
          </div>
          <FormField label="Adresse complète" error={errors.address} required>
            <TextInput
              value={address}
              onChange={setAddress}
              placeholder="Ex : 12, Rue Ibn Sina, Hay Riad"
              error={!!errors.address}
            />
          </FormField>
        </FormSection>

        {/* ── SECTION B: Problem info ── */}
        <FormSection letter="B" title="Informations sur le problème">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="form-grid-2">
            <FormField label="Catégorie du problème" error={errors.category} required>
              <SelectInput
                value={categoryId}
                onChange={handleCategoryChange}
                options={categories.map((c) => ({ value: c.id, label: c.label }))}
                placeholder="Sélectionner une catégorie"
                error={!!errors.category}
              />
            </FormField>
            <FormField label="Sous-catégorie" error={errors.subCategory} required>
              <SelectInput
                value={subCategoryId}
                onChange={handleSubCategoryChange}
                options={(selectedCategory?.subCategories ?? []).map((s) => ({ value: s.id, label: s.label }))}
                placeholder={categoryId ? 'Sélectionner une sous-catégorie' : 'Choisir d\'abord la catégorie'}
                disabled={!categoryId}
                error={!!errors.subCategory}
              />
            </FormField>
          </div>

          {/* Severity selector */}
          <FormField label="Sévérité" error={errors.severity} required>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginTop: '4px' }}>
              {SEVERITY_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => setSeverity(opt.value)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: `1.5px solid ${severity === opt.value ? opt.dot : COLORS.border.default}`,
                    background: severity === opt.value ? opt.bg : COLORS.bg.surface,
                    cursor: 'pointer',
                    transition: 'all .15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: opt.text }}>{opt.label}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: COLORS.text.secondary, lineHeight: 1.4 }}>{opt.desc}</div>
                </div>
              ))}
            </div>
            {errors.severity && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '6px' }}>{errors.severity}</div>}
          </FormField>

          {/* Description */}
          <FormField label="Description libre (optionnel)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Informations complémentaires communiquées par le client…"
              rows={3}
              style={{
                width: '100%',
                border: `0.5px solid ${COLORS.border.strong}`,
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '14px',
                color: COLORS.text.primary,
                background: COLORS.bg.surface,
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                lineHeight: 1.6,
              }}
            />
          </FormField>
        </FormSection>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
          <button
            onClick={() => navigate('/cgr/dashboard')}
            style={{
              height: '44px', background: COLORS.bg.surface, color: COLORS.text.secondary,
              border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer', padding: '0 24px', fontFamily: 'inherit',
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              height: '44px',
              background: done ? COLORS.brand.green : COLORS.brand.blue,
              color: '#fff', border: 'none', borderRadius: '8px',
              fontSize: '14px', fontWeight: 500, cursor: submitting ? 'default' : 'pointer',
              padding: '0 32px', display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: 'inherit', transition: 'background .2s',
            }}
          >
            {submitting && !done && (
              <>
                <span className="animate-spin-loader" style={{ display: 'inline-flex' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                </span>
                Création en cours…
              </>
            )}
            {done && <><IconCircleCheck size={16} /> Ticket créé !</>}
            {!submitting && !done && <>Créer le ticket <IconArrowRight size={16} /></>}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .form-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Sub-components ── */

function FormSection({ letter, title, children }: { letter: string; title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: COLORS.bg.surface,
        borderRadius: '14px',
        border: `0.5px solid ${COLORS.border.default}`,
        padding: '24px',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          width: '26px', height: '26px', borderRadius: '50%',
          background: COLORS.brand.blue, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 500, flexShrink: 0,
        }}>
          {letter}
        </div>
        <div style={{ fontSize: '15px', fontWeight: 500, color: COLORS.text.primary }}>{title}</div>
      </div>
      {children}
    </div>
  )
}

function FormField({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '0' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
        {label}{required && <span style={{ color: '#EF4444', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
      {error && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{error}</div>}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, error }: { value: string; onChange: (v: string) => void; placeholder?: string; error?: boolean }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', height: '42px',
        border: `0.5px solid ${error ? '#EF4444' : COLORS.border.strong}`,
        borderRadius: '8px', padding: '0 14px', fontSize: '14px',
        color: COLORS.text.primary, background: COLORS.bg.surface,
        outline: 'none', fontFamily: 'inherit',
      }}
      onFocus={(e) => { e.target.style.borderColor = COLORS.brand.blue; e.target.style.boxShadow = '0 0 0 3px rgba(13,43,94,0.09)' }}
      onBlur={(e)  => { e.target.style.borderColor = error ? '#EF4444' : COLORS.border.strong; e.target.style.boxShadow = 'none' }}
    />
  )
}

function SelectInput({ value, onChange, options, placeholder, disabled, error }: {
  value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string; disabled?: boolean; error?: boolean
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        width: '100%', height: '42px',
        border: `0.5px solid ${error ? '#EF4444' : COLORS.border.strong}`,
        borderRadius: '8px', padding: '0 14px', fontSize: '14px',
        color: value ? COLORS.text.primary : COLORS.text.placeholder,
        background: COLORS.bg.surface, outline: 'none', cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'inherit', opacity: disabled ? 0.6 : 1,
      }}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
