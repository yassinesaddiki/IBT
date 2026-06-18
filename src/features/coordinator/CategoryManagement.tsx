import { useState } from 'react'
import { IconPlus, IconChevronDown, IconChevronRight, IconPencil, IconCheck, IconX } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { SubNav } from '../../shared/components/SubNav'
import { COLORS } from '../../design-system/tokens'
import { useCategoryStore } from '../../store/categoryStore'
import type { Category, SubCategory } from '../../mock-data/categories'
import { COORDINATOR_NAV } from './coordinatorNav'
import { useTickets } from '../../shared/hooks/useTickets'

export function CategoryManagement() {
  const { tickets }    = useTickets()
  const {
    categories,
    addCategory, updateCategory,
    addSubCategory, updateSubCategory,
  } = useCategoryStore()

  const [expanded, setExpanded] = useState<string[]>(categories.map((c) => c.id))
  const [editKey,  setEditKey]  = useState<string | null>(null)
  const [editVal,  setEditVal]  = useState('')
  const [newCatLabel, setNewCatLabel] = useState('')
  const [showNewCat,  setShowNewCat]  = useState(false)

  const pendingApproval = tickets.filter((t) => t.status === 'attente-approbation').length

  const toggleExpand = (id: string) =>
    setExpanded((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])

  const startEdit = (key: string, val: string) => { setEditKey(key); setEditVal(val) }

  const saveEdit = () => {
    if (!editKey || !editVal.trim()) return
    const isCat = categories.some((c) => c.id === editKey)
    if (isCat) updateCategory(editKey, editVal.trim())
    else        updateSubCategory(editKey, editVal.trim())
    setEditKey(null)
  }

  const handleAddSub = (catId: string) => {
    const label = window.prompt('Nom de la nouvelle sous-catégorie :')
    if (label?.trim()) addSubCategory(catId, label.trim())
  }

  const handleAddCat = () => {
    if (newCatLabel.trim()) {
      addCategory(newCatLabel.trim())
      setNewCatLabel('')
      setShowNewCat(false)
    }
  }

  const CAT_COLORS: Record<string, { bg: string; text: string }> = {
    'CAT-01': { bg: COLORS.semantic.info.bg,   text: COLORS.semantic.info.text },
    'CAT-02': { bg: COLORS.severity.haute.bg,  text: COLORS.severity.haute.text },
    'CAT-03': { bg: COLORS.semantic.danger.bg, text: COLORS.semantic.danger.text },
  }

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Coordinateur" notifCount={pendingApproval} />
      <SubNav links={COORDINATOR_NAV(pendingApproval)} />

      <div style={{ paddingTop: '24px', maxWidth: '780px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary }}>Gestion des Catégories</div>
            <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '3px' }}>
              {categories.length} catégories · {categories.reduce((n, c) => n + c.subCategories.length, 0)} sous-catégories · Les modifications sont sauvegardées automatiquement
            </div>
          </div>
          <button onClick={() => setShowNewCat(true)} style={{ height: '40px', background: COLORS.brand.blue, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' }}>
            <IconPlus size={15} /> Nouvelle catégorie
          </button>
        </div>

        {/* Add new category */}
        {showNewCat && (
          <div className="animate-up" style={{ background: COLORS.semantic.info.bg, border: `0.5px solid ${COLORS.semantic.info.border}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input value={newCatLabel} onChange={(e) => setNewCatLabel(e.target.value)} placeholder="Nom de la nouvelle catégorie" onKeyDown={(e) => e.key === 'Enter' && handleAddCat()}
              style={{ flex: 1, height: '38px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', padding: '0 12px', fontSize: '14px', color: COLORS.text.primary, background: COLORS.bg.surface, outline: 'none', fontFamily: 'inherit' }} autoFocus />
            <button onClick={handleAddCat} style={{ height: '38px', background: COLORS.brand.green, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '0 16px', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <IconCheck size={15} /> Créer
            </button>
            <button onClick={() => setShowNewCat(false)} style={{ height: '38px', background: COLORS.bg.surface, color: COLORS.text.secondary, border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer', padding: '0 12px', fontFamily: 'inherit' }}>
              <IconX size={15} />
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {categories.map((cat: Category) => {
            const cc = CAT_COLORS[cat.id] ?? { bg: COLORS.bg.page, text: COLORS.text.secondary }
            const isExpanded  = expanded.includes(cat.id)
            const catTickets  = tickets.filter((t) => t.category === cat.label).length

            return (
              <div key={cat.id} className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, overflow: 'hidden' }}>
                {/* Category header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', cursor: 'pointer', background: isExpanded ? COLORS.bg.page : COLORS.bg.surface }}
                  onClick={() => toggleExpand(cat.id)}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: cc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: cc.text }}>{cat.id.replace('CAT-', '')}</span>
                  </div>

                  {editKey === cat.id ? (
                    <input value={editVal} onChange={(e) => setEditVal(e.target.value)} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                      style={{ flex: 1, height: '34px', border: `1.5px solid ${COLORS.brand.blue}`, borderRadius: '8px', padding: '0 10px', fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, background: COLORS.bg.surface, outline: 'none', fontFamily: 'inherit' }} autoFocus />
                  ) : (
                    <span style={{ flex: 1, fontSize: '15px', fontWeight: 500, color: COLORS.text.primary }}>{cat.label}</span>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: COLORS.text.muted }}>{cat.subCategories.length} sous-cat.</span>
                    <span style={{ fontSize: '11px', background: COLORS.semantic.info.bg, color: COLORS.semantic.info.text, padding: '2px 7px', borderRadius: '10px' }}>{catTickets} tickets</span>
                    {editKey === cat.id ? (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); saveEdit() }} style={{ height: '26px', background: COLORS.brand.green, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', padding: '0 8px', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><IconCheck size={12} />OK</button>
                        <button onClick={(e) => { e.stopPropagation(); setEditKey(null) }} style={{ height: '26px', background: COLORS.bg.surface, color: COLORS.text.secondary, border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '6px', fontSize: '11px', cursor: 'pointer', padding: '0 8px', fontFamily: 'inherit' }}><IconX size={12} /></button>
                      </>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); startEdit(cat.id, cat.label) }}
                        style={{ height: '26px', background: COLORS.bg.page, border: `0.5px solid ${COLORS.border.default}`, borderRadius: '6px', cursor: 'pointer', padding: '0 8px', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: COLORS.text.secondary, fontFamily: 'inherit' }}>
                        <IconPencil size={11} />
                      </button>
                    )}
                    {isExpanded ? <IconChevronDown size={16} color={COLORS.text.muted} /> : <IconChevronRight size={16} color={COLORS.text.muted} />}
                  </div>
                </div>

                {/* Sub-categories */}
                {isExpanded && (
                  <div style={{ borderTop: `0.5px solid ${COLORS.border.default}`, padding: '8px 16px 12px' }}>
                    {cat.subCategories.map((sub: SubCategory) => {
                      const subTickets = tickets.filter((t) => t.subCategory === sub.label).length
                      return (
                        <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 4px', borderBottom: `0.5px solid #F9F9F9` }}>
                          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: COLORS.text.muted, flexShrink: 0, minWidth: '70px' }}>{sub.id}</span>
                          {editKey === sub.id ? (
                            <input value={editVal} onChange={(e) => setEditVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                              style={{ flex: 1, height: '30px', border: `1.5px solid ${COLORS.brand.blue}`, borderRadius: '6px', padding: '0 8px', fontSize: '13px', color: COLORS.text.primary, background: COLORS.bg.surface, outline: 'none', fontFamily: 'inherit' }} autoFocus />
                          ) : (
                            <span style={{ flex: 1, fontSize: '13px', color: COLORS.text.primary }}>{sub.label}</span>
                          )}
                          {sub.defaultSeverity && (
                            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '10px', flexShrink: 0,
                              background: sub.defaultSeverity === 'Critique' ? COLORS.semantic.danger.bg : sub.defaultSeverity === 'Haute' ? COLORS.severity.haute.bg : COLORS.severity.moyenne.bg,
                              color:      sub.defaultSeverity === 'Critique' ? COLORS.semantic.danger.text : sub.defaultSeverity === 'Haute' ? COLORS.severity.haute.text : COLORS.severity.moyenne.text,
                            }}>{sub.defaultSeverity}</span>
                          )}
                          <span style={{ fontSize: '11px', color: COLORS.text.muted, flexShrink: 0 }}>{subTickets} tickets</span>
                          {editKey === sub.id ? (
                            <>
                              <button onClick={saveEdit} style={{ height: '24px', background: COLORS.brand.green, color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', padding: '0 7px', fontFamily: 'inherit' }}><IconCheck size={11} /></button>
                              <button onClick={() => setEditKey(null)} style={{ height: '24px', background: COLORS.bg.surface, color: COLORS.text.secondary, border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '5px', fontSize: '11px', cursor: 'pointer', padding: '0 7px', fontFamily: 'inherit' }}><IconX size={11} /></button>
                            </>
                          ) : (
                            <button onClick={() => startEdit(sub.id, sub.label)} style={{ height: '24px', background: COLORS.bg.page, border: `0.5px solid ${COLORS.border.default}`, borderRadius: '5px', cursor: 'pointer', padding: '0 7px', display: 'inline-flex', alignItems: 'center', fontFamily: 'inherit' }}>
                              <IconPencil size={11} color={COLORS.text.muted} />
                            </button>
                          )}
                        </div>
                      )
                    })}
                    <button onClick={() => handleAddSub(cat.id)} style={{ marginTop: '8px', height: '28px', background: 'none', border: `0.5px dashed ${COLORS.border.strong}`, borderRadius: '6px', cursor: 'pointer', padding: '0 12px', fontSize: '12px', color: COLORS.text.muted, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '5px', width: '100%', justifyContent: 'center' }}>
                      <IconPlus size={13} /> Ajouter une sous-catégorie
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
