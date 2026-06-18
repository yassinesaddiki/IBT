import { COLORS } from '../../design-system/tokens'
import type { TicketStatus } from '../types/status'
import type { Severity } from '../types/ticket'

export interface ColorSet {
  bg: string
  text: string
  border: string
  dot: string
}

export function getStatusColor(status: TicketStatus): ColorSet {
  return COLORS.status[status]
}

export function getSeverityColor(severity: Severity): ColorSet {
  const map: Record<Severity, ColorSet> = {
    Critique: COLORS.severity.critique,
    Haute:    COLORS.severity.haute,
    Moyenne:  COLORS.severity.moyenne,
  }
  return map[severity]
}
