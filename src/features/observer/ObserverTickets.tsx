import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconEye, IconSearch } from '@tabler/icons-react'
import { NavBar } from '../../shared/components/NavBar'
import { SubNav } from '../../shared/components/SubNav'
import { StatusBadge, SeverityBadge } from '../../design-system/components/Badge'
import { COLORS } from '../../design-system/tokens'
import { useTickets } from '../../shared/hooks/useTickets'
import { formatElapsed } from '../../shared/utils/formatDate'
import { OBSERVER_NAV } from '../coordinator/coordinatorNav'

export function ObserverTickets() {
  const { tickets } = useTickets()
  const navigate    = useNavigate()
  const [search, setSearch]   = useState('')
  const [sector, setSector]   = useState('')

  const filtered = tickets.filter((t) => {
    const matchSector = !sector || t.sector === sector
    const q = search.toLowerCase()
    const matchSearch = !q || t.clientName.toLowerCase().includes(q) || t.id.includes(q)
    return matchSector && matchSearch
  })

  const sectors = [...new Set(tickets.map((t) => t.sector))]

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <NavBar title="Observateur — Vue Lecture Seule" />
      <SubNav links={OBSERVER_NAV} />

      <div style={{ paddingTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: COLORS.semantic.info.bg, border: `0.5px solid ${COLORS.semantic.info.border}`, borderRadius: '10px', padding: '10px 14px', marginBottom: '20px' }}>
          <IconEye size={16} color={COLORS.semantic.info.text} />
          <span style={{ fontSize: '13px', color: COLORS.semantic.info.text }}>Mode lecture seule — Aucune action disponible</span>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '20px', fontWeight: 500, color: COLORS.text.primary }}>Tous les Tickets</div>
          <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '3px' }}>{filtered.length} tickets affichés</div>
        </div>

        <div style={{ background: COLORS.bg.surface, borderRadius: '14px', border: `0.5px solid ${COLORS.border.default}`, overflow: 'hidden' }}>
          {/* Controls */}
          <div style={{ padding: '14px 20px', borderBottom: `0.5px solid ${COLORS.border.default}`, display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <IconSearch size={14} color={COLORS.text.muted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un ticket…"
                style={{ width: '100%', height: '34px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', padding: '0 12px 0 32px', fontSize: '13px', color: COLORS.text.primary, background: COLORS.bg.surface, outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <select value={sector} onChange={(e) => setSector(e.target.value)}
              style={{ height: '34px', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '8px', padding: '0 12px', fontSize: '13px', color: COLORS.text.primary, background: COLORS.bg.surface, outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              <option value="">Tous les secteurs</option>
              {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: COLORS.bg.panel }}>
                  {['N° Ticket','Client','Problème','Sévérité','Secteur','Statut','Durée','Détail'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 500, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id}
                    style={{ borderBottom: `0.5px solid #F5F5F5`, background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                    <td style={{ padding: '12px 14px', fontSize: '12px', fontFamily: 'monospace', color: COLORS.text.secondary }}>#{t.id}</td>
                    <td style={{ padding: '12px 8px', fontSize: '13px', fontWeight: 500, color: COLORS.text.primary }}>{t.clientName}</td>
                    <td style={{ padding: '12px 8px', fontSize: '13px', color: '#374151' }}>{t.subCategory}</td>
                    <td style={{ padding: '12px 8px' }}><SeverityBadge severity={t.severity} /></td>
                    <td style={{ padding: '12px 8px', fontSize: '13px', color: COLORS.text.secondary }}>{t.sector}</td>
                    <td style={{ padding: '12px 8px' }}><StatusBadge status={t.status} /></td>
                    <td style={{ padding: '12px 8px', fontSize: '12px', color: COLORS.text.muted }}>{formatElapsed(t.createdAt)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => navigate(`/observer/ticket/${t.id}`)}
                        style={{ height: '28px', background: COLORS.bg.surface, color: '#374151', border: `0.5px solid ${COLORS.border.strong}`, borderRadius: '6px', fontSize: '12px', cursor: 'pointer', padding: '0 10px', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <IconEye size={12} /> Voir
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: COLORS.text.muted, fontSize: '13px' }}>Aucun ticket</td></tr>
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
