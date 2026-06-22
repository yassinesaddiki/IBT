import { useAuthStore } from '../../store/authStore'
import { useDutyStore } from '../../store/dutyStore'

/**
 * Returns the authenticated user enriched with a live sector name
 * derived from the sectors store (so it updates if the sector is renamed).
 */
export function useAuth() {
  const authState = useAuthStore()
  const sectors   = useDutyStore((s) => s.sectors)

  const user = authState.user
  if (!user) return authState

  // Derive the sector name from sectorId — always up to date with DB
  const sectorName = user.sectorId
    ? sectors.find((s) => s.id === user.sectorId)?.name
    : user.sector  // fallback for accounts without sectorId

  return {
    ...authState,
    user: { ...user, sector: sectorName },
  }
}
