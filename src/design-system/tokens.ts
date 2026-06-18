// IBT Design Tokens — single source of truth for all brand colors
// Used for dynamic styles (badge colors, status indicators)
// Static layout colors use Tailwind utility classes from index.css @theme

export const COLORS = {
  brand: {
    blue:   '#0D2B5E',
    green:  '#3CB97A',
    yellow: '#F5C518',
  },
  bg: {
    page:    '#F0F2F5',
    surface: '#FFFFFF',
    panel:   '#F8F9FB',
  },
  text: {
    primary:     '#1A1A2E',
    secondary:   '#6B7280',
    muted:       '#9CA3AF',
    placeholder: '#B0B7C3',
  },
  border: {
    default: '#E5E7EB',
    strong:  '#D1D5DB',
    focus:   '#0D2B5E',
  },
  severity: {
    critique: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', dot: '#EF4444' },
    haute:    { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', dot: '#F97316' },
    moyenne:  { bg: '#FEFCE8', text: '#854D0E', border: '#FEF08A', dot: '#EAB308' },
  },
  status: {
    nouveau:             { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', dot: '#3B82F6' },
    assigne:             { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', dot: '#3B82F6' },
    'lu-eep':            { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD', dot: '#60A5FA' },
    'en-cours-eep':      { bg: '#FEFCE8', text: '#854D0E', border: '#FEF08A', dot: '#EAB308' },
    'resolu-eep':        { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', dot: '#22C55E' },
    'refere-sed':        { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', dot: '#F97316' },
    'attente-approbation': { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', dot: '#F97316' },
    'approuve-sed':      { bg: '#FFF3E0', text: '#92400E', border: '#FCD34D', dot: '#EA580C' },
    'en-cours-sed':      { bg: '#FFF3E0', text: '#92400E', border: '#FCD34D', dot: '#DC7609' },
    suspendu:            { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', dot: '#EF4444' },
    programme:           { bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE', dot: '#8B5CF6' },
    'resolu-sed':        { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', dot: '#22C55E' },
    'attente-confirmation': { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', dot: '#F97316' },
    ferme:               { bg: '#DCFCE7', text: '#14532D', border: '#86EFAC', dot: '#16A34A' },
  },
  semantic: {
    info:    { bg: '#EEF3FD', text: '#1A3A72', border: '#C5D7F5' },
    success: { bg: '#F0FDF4', text: '#166534' },
    warning: { bg: '#FEFCE8', text: '#854D0E' },
    danger:  { bg: '#FEF2F2', text: '#991B1B' },
  },
} as const

export type SeverityKey = keyof typeof COLORS.severity
export type StatusKey   = keyof typeof COLORS.status
