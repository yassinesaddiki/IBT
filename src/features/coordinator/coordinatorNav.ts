import type { SubNavLink } from '../../shared/components/SubNav'

export const COORDINATOR_NAV = (pendingApproval = 0): SubNavLink[] => [
  { label: 'Tableau de bord', path: '/coordinator/dashboard',    icon: '📊' },
  { label: 'Tickets',         path: '/coordinator/tickets',      icon: '🎫' },
  { label: 'Approbations',    path: '/coordinator/dashboard',    icon: '⏳', badge: pendingApproval },
  { label: 'Planning',        path: '/coordinator/planning',     icon: '📅' },
  { label: 'Rapports',        path: '/coordinator/rapports',     icon: '📈' },
  { label: 'Employés',        path: '/coordinator/employes',     icon: '👥' },
  { label: 'Véhicules',       path: '/coordinator/vehicules',    icon: '🚗' },
  { label: 'Secteurs',        path: '/coordinator/secteurs',     icon: '🗺️' },
  { label: 'Catégories',      path: '/coordinator/categories',   icon: '🏷️' },
  { label: 'Comptes',         path: '/coordinator/comptes',      icon: '🔑' },
  { label: 'Notifications',   path: '/coordinator/notifications',icon: '🔔' },
]

export const OBSERVER_NAV: SubNavLink[] = [
  { label: 'Vue d\'ensemble', path: '/observer/dashboard', icon: '📊' },
  { label: 'Tickets',         path: '/observer/tickets',   icon: '🎫' },
  { label: 'Planning',        path: '/observer/planning',  icon: '📅' },
  { label: 'Rapports',        path: '/observer/rapports',  icon: '📈' },
]
