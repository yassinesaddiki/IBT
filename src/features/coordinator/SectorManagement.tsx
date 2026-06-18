import { useState } from 'react'
import { IconPlus, IconPencil, IconCheck, IconX } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { SubNav } from '../../shared/components/SubNav'
import { COLORS } from '../../design-system/tokens'
import { DUTY_SCHEDULE } from '../../mock-data/duty-schedule'
import { COORDINATOR_NAV } from './coordinatorNav'
import { useTickets } from '../../shared/hooks/useTickets'

interface Sector {
  id: string
  name: string
  status: 'actif' | 'inactif'
  agentCount: number
}

const INITIAL_SECTORS: Sector[] = [
  { id: 's-1', name: 'Secteur Nord',  status: 'actif', agentCount: 2 },
  { id: 's-2', name: 'Secteur Est',   status: 'actif', agentCount: 2 },
  { id: 's-3', name: 'Secteur Ouest', status: 'actif', agentCount: 2 },
  { id: 's-4', name: 'Secteur Sud',   status: 'actif', agentCount: 2 },
]

export function SectorManagement() {
  const { tickets }   = useTickets()
  const [sectors, setSectors] = useState(INITIAL_SECTORS)
  const [editId,  setEditId]  = useState<string | null>(null)
  const [editVal, setEditVal] = useState('')
  const [newName, setNewName] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const pendingApproval = tickets.filter((t) => t.status === 'attente-approbation').length

  const saveEdit = (id: string) => {
    if (!editVal.trim()) return
    setSectors((prev) => prev.map((s) => s.id === id ? { ...s, name: editVal.trim() } : s))
    setEditId(null)
  }

  const addSector = () => {
    if (!newName.trim()) return
    setSectors((prev) => [...prev, { id: `s-${Date.now()}`, name: newName.trim(), status: 'actif', agentCount: 0 }])
    setNewName('')
    setShowAdd(false)
  }

  const toggle = (id: string) => setSectors((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === 'actif' ? 'inactif' : 'actif' } : s))

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Coordinateur" notifCount={pendingApproval} />
      <SubNav links={COORDINATOR_NAV(pendingApproval)} />

      <div style={{ paddingTop: '24px', maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary }}>Gestion des Secteurs</div>
            <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '3px' }}>
              {sectors.filter((s) => s.status === 'actif').length} secteurs actifs
            </div>
          </div>
          <button onClick={() => setShowAdd(true)} style={{ height: '40px', background: COLORS.brand.blue, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' }}>
            <IconPlus size={15} /> Ajouter un secteur
          </button>
        </div>

        {/* Add new */}
        {showAdd && (
          <div className="animate-up" style={{ background: COLORS.semantic.info.bg, border: `0.5px solid ${COLORS.semantic.info.border}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nom du nouveau secteur" onKeyDown={(e) => e.key === 'Enter' && addSector()}
              style={{ flex: 1, height: '38px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', padding: '0 12px', fontSize: '14px', color: COLORS.text.primary, background: COLORS.bg.surface, outline: 'none', fontFamily: 'inherit' }} autoFocus />
            <button onClick={addSector} style={{ height: '38px', background: COLORS.brand.green, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '0 16px', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <IconCheck size={15} /> Créer
            </button>
            <button onClick={() => setShowAdd(false)} style={{ height: '38px', background: COLORS.bg.surface, color: COLORS.text.secondary, border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer', padding: '0 12px', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center' }}>
              <IconX size={15} />
            </button>
          </div>
        )}

        {/* Sector cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sectors.map((sector) => {
            const agents       = DUTY_SCHEDULE.filter((a) => a.sector === sector.name)
            const sectorTickets = tickets.filter((t) => t.sector === sector.name && t.status !== 'ferme')
            const isEditing    = editId === sector.id

            return (
              <div key={sector.id} className="animate-up" style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${sector.status === 'actif' ? COLORS.border.default : '#FECACA'}`, padding: '18px 20px', opacity: sector.status === 'inactif' ? 0.7 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: sector.status === 'actif' ? COLORS.brand.green : COLORS.text.muted, flexShrink: 0 }} />

                  {isEditing ? (
                    <input value={editVal} onChange={(e) => setEditVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEdit(sector.id)}
                      style={{ flex: 1, height: '36px', border: `1.5px solid ${COLORS.brand.blue}`, borderRadius: '8px', padding: '0 12px', fontSize: '14px', fontWeight: 500, color: COLORS.text.primary, background: COLORS.bg.surface, outline: 'none', fontFamily: 'inherit', boxShadow: '0 0 0 3px rgba(13,43,94,0.09)' }} autoFocus />
                  ) : (
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 500, color: COLORS.text.primary }}>{sector.name}</div>
                      <div style={{ fontSize: '12px', color: COLORS.text.secondary, marginTop: '2px' }}>
                        {agents.length} agent{agents.length !== 1 ? 's' : ''} de garde · {sectorTickets.length} ticket{sectorTickets.length !== 1 ? 's' : ''} actif{sectorTickets.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {isEditing ? (
                      <>
                        <button onClick={() => saveEdit(sector.id)} style={{ height: '32px', background: COLORS.brand.green, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', padding: '0 12px', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <IconCheck size={13} /> Enregistrer
                        </button>
                        <button onClick={() => setEditId(null)} style={{ height: '32px', background: COLORS.bg.surface, color: COLORS.text.secondary, border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', fontSize: '12px', cursor: 'pointer', padding: '0 10px', fontFamily: 'inherit' }}>
                          Annuler
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditId(sector.id); setEditVal(sector.name) }}
                          style={{ height: '30px', background: COLORS.bg.page, border: `0.5px solid ${COLORS.border.default}`, borderRadius: '6px', cursor: 'pointer', padding: '0 10px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: COLORS.text.secondary, fontFamily: 'inherit' }}>
                          <IconPencil size={12} /> Renommer
                        </button>
                        <button onClick={() => toggle(sector.id)}
                          style={{ height: '30px', background: sector.status === 'actif' ? COLORS.semantic.danger.bg : COLORS.semantic.success.bg, border: `0.5px solid ${sector.status === 'actif' ? '#FECACA' : '#BBF7D0'}`, borderRadius: '6px', cursor: 'pointer', padding: '0 10px', fontSize: '12px', fontWeight: 500, color: sector.status === 'actif' ? COLORS.semantic.danger.text : COLORS.semantic.success.text, fontFamily: 'inherit' }}>
                          {sector.status === 'actif' ? 'Désactiver' : 'Réactiver'}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {agents.length > 0 && !isEditing && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `0.5px solid #F1F3F5`, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {agents.map((a) => (
                      <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: COLORS.bg.page, padding: '4px 10px', borderRadius: '20px', border: `0.5px solid ${COLORS.border.default}` }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: a.online ? COLORS.brand.green : COLORS.text.muted }} />
                        <span style={{ fontSize: '12px', color: COLORS.text.primary }}>{a.name}</span>
                      </div>
                    ))}
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
