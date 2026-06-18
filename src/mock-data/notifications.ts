import type { UserRole } from '../shared/types/user'

export interface AppNotification {
  id: string
  type: 'info' | 'success' | 'warning' | 'danger'
  title: string
  message: string
  time: string
  read: boolean
  ticketId?: string
  roles: UserRole[]
}

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-01', type: 'danger', read: false, ticketId: 'IBT-2406-059',
    title: 'Nouveau ticket CRITIQUE',
    message: 'Ticket IBT-2406-059 créé — Incendie électrique, Hay Riad. Équipe Secteur Est notifiée.',
    time: 'Il y a 12 min',
    roles: ['cgr', 'eep', 'coordinator'],
  },
  {
    id: 'n-02', type: 'warning', read: false, ticketId: 'IBT-2406-055',
    title: 'Approbation requise',
    message: 'L\'agent EEP Samir Benhima a référé le ticket IBT-2406-055 (Poste endommagé) à l\'équipe SED. Votre approbation est nécessaire.',
    time: 'Il y a 1h 58min',
    roles: ['coordinator'],
  },
  {
    id: 'n-03', type: 'info', read: false, ticketId: 'IBT-2406-058',
    title: 'EEP a pris en charge',
    message: 'Khalid Amrani a pris en charge le ticket IBT-2406-058 (Fil tombé au sol, Secteur Nord). Intervention en cours.',
    time: 'Il y a 40 min',
    roles: ['cgr', 'coordinator'],
  },
  {
    id: 'n-04', type: 'success', read: true, ticketId: 'IBT-2406-050',
    title: 'Ticket résolu par EEP',
    message: 'Farid El Fassi a résolu le ticket IBT-2406-050 (Compteur endommagé, Secteur Sud). En attente de confirmation client.',
    time: 'Il y a 20 min',
    roles: ['cgr', 'coordinator'],
  },
  {
    id: 'n-05', type: 'info', read: true, ticketId: 'IBT-2406-051',
    title: 'SED en cours d\'intervention',
    message: 'Hassan Chraibi a débuté l\'intervention sur le ticket IBT-2406-051 (Câble souterrain endommagé, Secteur Sud).',
    time: 'Il y a 2h 20min',
    roles: ['cgr', 'coordinator'],
  },
  {
    id: 'n-06', type: 'success', read: true, ticketId: 'IBT-2406-048',
    title: 'Ticket résolu par SED',
    message: 'SED a résolu le ticket IBT-2406-048 (Câble aérien endommagé). Durée totale : 5h 33min. Prêt pour clôture.',
    time: 'Il y a 1h 02min',
    roles: ['cgr', 'coordinator'],
  },
  {
    id: 'n-07', type: 'danger', read: false, ticketId: 'IBT-2406-059',
    title: 'Nouveau ticket — Secteur Est',
    message: 'Ticket IBT-2406-059 : Incendie électrique à Hay Riad. Sévérité CRITIQUE. Intervenez immédiatement.',
    time: 'Il y a 12 min',
    roles: ['eep'],
  },
  {
    id: 'n-08', type: 'info', read: false, ticketId: 'IBT-2406-056',
    title: 'Nouveau ticket assigné',
    message: 'Ticket IBT-2406-056 : Surtension groupe d\'abonnés, Cité Salam. Votre secteur (Secteur Est).',
    time: 'Il y a 1h 19min',
    roles: ['eep'],
  },
  {
    id: 'n-09', type: 'success', read: true, ticketId: 'IBT-2406-051',
    title: 'Ticket approuvé → SED',
    message: 'Coordinateur Yasmine Benali a approuvé votre renvoi du ticket IBT-2406-051. SED a pris en charge.',
    time: 'Il y a 2h 30min',
    roles: ['eep'],
  },
  {
    id: 'n-10', type: 'warning', read: false, ticketId: 'IBT-2406-051',
    title: 'Nouveau ticket SED approuvé',
    message: 'Le ticket IBT-2406-051 (Câble souterrain endommagé, Lotissement Oasis) vous a été assigné après approbation du coordinateur.',
    time: 'Il y a 2h 28min',
    roles: ['sed'],
  },
  {
    id: 'n-11', type: 'info', read: true, ticketId: 'IBT-2406-048',
    title: 'Ticket SED précédent clôturé',
    message: 'Le ticket IBT-2406-048 que vous avez résolu a été confirmé et fermé définitivement par le CGR.',
    time: 'Il y a 45 min',
    roles: ['sed'],
  },
]
