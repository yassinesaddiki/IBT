// SECTORS_LIST is intentionally removed from this file.
// All sector lists must come from useDutyStore().sectors — never hardcoded.

import type { Severity } from '../shared/types/ticket'

export interface SubCategory {
  id: string
  label: string
  defaultSeverity?: Severity
}

export interface Category {
  id: string
  label: string
  subCategories: SubCategory[]
}

export const CATEGORIES: Category[] = [
  {
    id: 'CAT-01',
    label: 'Coupure',
    subCategories: [
      { id: 'COP-01', label: 'Coupure client individuel',       defaultSeverity: 'Moyenne' },
      { id: 'COP-02', label: 'Coupure groupe d\'abonnés',       defaultSeverity: 'Haute'   },
      { id: 'COP-03', label: 'Compteur endommagé',              defaultSeverity: 'Moyenne' },
      { id: 'COP-04', label: 'Compteur disparu (volé)',         defaultSeverity: 'Haute'   },
      { id: 'COP-05', label: 'Compteur bloqué',                 defaultSeverity: 'Moyenne' },
      { id: 'COP-06', label: 'Câble aérien endommagé',          defaultSeverity: 'Haute'   },
      { id: 'COP-07', label: 'Câble souterrain endommagé',      defaultSeverity: 'Haute'   },
      { id: 'COP-08', label: 'Poste endommagé',                 defaultSeverity: 'Haute'   },
      { id: 'COP-09', label: 'Boîte / Disjoncteur grillé',      defaultSeverity: 'Moyenne' },
    ],
  },
  {
    id: 'CAT-02',
    label: 'Surtension',
    subCategories: [
      { id: 'SUR-01', label: 'Surtension client individuel',    defaultSeverity: 'Haute'   },
      { id: 'SUR-02', label: 'Surtension groupe d\'abonnés',    defaultSeverity: 'Haute'   },
    ],
  },
  {
    id: 'CAT-03',
    label: 'Danger',
    subCategories: [
      { id: 'DAN-01', label: 'Incendie électrique',             defaultSeverity: 'Critique' },
      { id: 'DAN-02', label: 'Étincelles sur fils extérieurs',  defaultSeverity: 'Critique' },
      { id: 'DAN-03', label: 'Poste ouvert / non sécurisé',     defaultSeverity: 'Critique' },
      { id: 'DAN-04', label: 'Poteau incliné',                  defaultSeverity: 'Haute'    },
      { id: 'DAN-05', label: 'Poteau défaillant / cassé',       defaultSeverity: 'Critique' },
      { id: 'DAN-06', label: 'Fil tombé au sol',                defaultSeverity: 'Critique' },
    ],
  },
]
