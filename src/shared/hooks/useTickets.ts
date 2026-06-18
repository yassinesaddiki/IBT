import { useTicketStore } from '../../store/ticketStore'

export function useTickets() {
  return useTicketStore()
}
