export type TicketStatus =
  | 'nouveau'
  | 'assigne'
  | 'lu-eep'
  | 'en-cours-eep'
  | 'resolu-eep'
  | 'refere-sed'
  | 'attente-approbation'
  | 'approuve-sed'
  | 'en-cours-sed'
  | 'suspendu'
  | 'programme'
  | 'resolu-sed'
  | 'attente-confirmation'
  | 'ferme'

export const STATUS_LABELS: Record<TicketStatus, string> = {
  'nouveau':               'Nouveau',
  'assigne':               'Assigné',
  'lu-eep':                'Lu par EP',
  'en-cours-eep':          'En cours — EP',
  'resolu-eep':            'Résolu — EP',
  'refere-sed':            'Référé à SED',
  'attente-approbation':   'Att. approbation',
  'approuve-sed':          'Approuvé → SED',
  'en-cours-sed':          'En cours — SED',
  'suspendu':              'Suspendu',
  'programme':             'Programmé',
  'resolu-sed':            'Résolu — SED',
  'attente-confirmation':  'Att. confirmation',
  'ferme':                 'Fermé définitivement',
}
