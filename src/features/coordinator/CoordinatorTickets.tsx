import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconSearch, IconAdjustmentsHorizontal, IconDownload } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { SubNav } from '../../shared/components/SubNav'
import { StatusBadge, SeverityBadge } from '../../design-system/components/Badge'
import { COLORS } from '../../design-system/tokens'
import { useTickets } from '../../shared/hooks/useTickets'
import { formatElapsed } from '../../shared/utils/formatDate'
import { COORDINATOR_NAV } from './coordinatorNav'
import type { TicketStatus } from '../../shared/types/status'

type FilterStatus = TicketStatus | 'tous'

const STATUS_FILTERS: { key: FilterStatus; label: string }[] = [
  { key: 'tous',                label: 'Tous' },
  { key: 'nouveau',             label: 'Nouveau' },
  { key: 'en-cours-eep',       label: 'En cours EEP' },
  { key: 'attente-approbation', label: 'En attente approbation' },
  { key: 'en-cours-sed',       label: 'En cours SED' },
  { key: 'suspendu',           label: 'Suspendu' },
  { key: 'programme',          label: 'Programmé' },
  { key: 'resolu-eep',         label: 'Résolu EEP' },
  { key: 'resolu-sed',         label: 'Résolu SED' },
  { key: 'ferme',              label: 'Fermé' },
]

export function CoordinatorTickets() {
  const { tickets } = useTickets()
  const navigate    = useNavigate()
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState<FilterStatus>('tous')
  const [sector, setSector]   = useState('')

  const pendingApproval = tickets.filter((t) => t.status === 'attente-approbation').length

  const filtered = tickets.filter((t) => {
    const matchStatus = filter === 'tous' || t.status === filter
    const matchSector = !sector || t.sector === sector
    const q = search.toLowerCase()
    const matchSearch = !q || t.clientName.toLowerCase().includes(q) || t.id.includes(q) || t.address.toLowerCase().includes(q)
    return matchStatus && matchSector && matchSearch
  })

  const sectors = [...new Set(tickets.map((t) => t.sector))]

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Coordinateur" notifCount={pendingApproval} />
      <SubNav links={COORDINATOR_NAV(pendingApproval)} />

      <div style={{ paddingTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary }}>Gestion des Tickets</div>
            <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '3px' }}>
              {filtered.length} ticket{filtered.length !== 1 ? 's' : ''} · Tous secteurs confondus
            </div>
          </div>
          <button style={{ height: '36px', background: COLORS.bg.surface, color: COLORS.text.secondary, border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer', padding: '0 14px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' }}>
            <IconDownload size={14} /> Exporter
          </button>
        </div>

        <div style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, overflow: 'hidden' }}>
          {/* Controls */}
          <div style={{ padding: '14px 20px', borderBottom: `0.5px solid ${COLORS.border.default}`, display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <IconSearch size={14} color={COLORS.text.muted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par nom, ID, adresse…"
                style={{ width: '100%', height: '36px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', padding: '0 12px 0 32px', fontSize: '13px', color: COLORS.text.primary, background: COLORS.bg.surface, outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <select value={sector} onChange={(e) => setSector(e.target.value)}
              style={{ height: '36px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', padding: '0 12px', fontSize: '13px', color: COLORS.text.primary, background: COLORS.bg.surface, outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              <option value="">Tous les secteurs</option>
              {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button style={{ height: '36px', background: COLORS.bg.surface, color: COLORS.text.secondary, border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer', padding: '0 12px', display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'inherit' }}>
              <IconAdjustmentsHorizontal size={14} /> Filtres
            </button>
          </div>

          {/* Status tabs */}
          <div style={{ padding: '10px 20px', borderBottom: `0.5px solid ${COLORS.border.default}`, display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {STATUS_FILTERS.map((f) => {
              const count = f.key === 'tous' ? tickets.length : tickets.filter((t) => t.status === f.key).length
              return (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  style={{ height: '28px', padding: '0 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, background: filter === f.key ? COLORS.semantic.info.bg : 'transparent', color: filter === f.key ? COLORS.semantic.info.text : COLORS.text.secondary, border: filter === f.key ? `0.5px solid ${COLORS.semantic.info.border}` : '0.5px solid transparent' }}>
                  {f.label} <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(0,0,0,.07)', fontSize: '10px', marginLeft: '3px' }}>{count}</span>
                </button>
              )
            })}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: COLORS.bg.panel }}>
                  {['N° Ticket','Client','Problème','Sévérité','Secteur','Statut','Durée',''].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id} onClick={() => navigate(`/coordinator/ticket/${t.id}`)}
                    style={{ borderBottom: `0.5px solid #F5F5F5`, background: i % 2 === 0 ? '#fff' : '#FAFAFA', cursor: 'pointer' }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#F5F7FA')}
                    onMouseOut={(e)  => (e.currentTarget.style.background  = i % 2 === 0 ? '#fff' : '#FAFAFA')}
                  >
                    <td style={{ padding: '12px 14px', fontSize: '12px', fontFamily: 'monospace', color: COLORS.text.secondary }}>#{t.id}</td>
                    <td style={{ padding: '12px 8px', fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{t.clientName}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ fontSize: '13px', color: '#374151' }}>{t.subCategory}</div>
                      <div style={{ fontSize: '11px', color: COLORS.text.muted }}>{t.address.substring(0, 30)}…</div>
                    </td>
                    <td style={{ padding: '12px 8px' }}><SeverityBadge severity={t.severity} /></td>
                    <td style={{ padding: '12px 8px', fontSize: '13px', color: COLORS.text.secondary }}>{t.sector}</td>
                    <td style={{ padding: '12px 8px' }}><StatusBadge status={t.status} /></td>
                    <td style={{ padding: '12px 8px', fontSize: '12px', color: COLORS.text.muted }}>{formatElapsed(t.createdAt)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      {t.status === 'attente-approbation' && (
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/coordinator/ticket/${t.id}/approbation`) }}
                          style={{ height: '28px', background: '#FFF7ED', color: '#C2410C', border: '0.5px solid #FED7AA', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', padding: '0 10px', fontFamily: 'inherit', fontWeight: 500 }}>
                          Approuver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: COLORS.text.muted, fontSize: '13px' }}>Aucun ticket trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '10px 20px', borderTop: `0.5px solid ${COLORS.border.default}`, fontSize: '12px', color: COLORS.text.muted }}>
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
