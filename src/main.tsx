import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { App } from './App'
import { useDutyStore } from './store/dutyStore'
import { useCategoryStore } from './store/categoryStore'
import { useEmployeeStore } from './store/employeeStore'
import { useVehicleStore } from './store/vehicleStore'
import { useAccountStore } from './store/accountStore'
import { useTicketStore } from './store/ticketStore'
import { useAuthStore } from './store/authStore'
import { initNotifications } from './store/notificationStore'

// Clear stale localStorage keys from old mock-data era
const STALE_KEYS = ['ibt-tickets']
STALE_KEYS.forEach((k) => localStorage.removeItem(k))

// Bootstrap all stores from Supabase on app load
async function initStores() {
  await Promise.allSettled([
    useTicketStore.getState().init(),
    useDutyStore.getState().init(),
    useCategoryStore.getState().init(),
    useEmployeeStore.getState().init(),
    useAccountStore.getState().init(),
    useVehicleStore.getState().init(),
  ])
}

initStores().then(() => {
  // If user session was persisted (page refresh), reinit notifications
  const user = useAuthStore.getState().user
  if (user) void initNotifications(user.id)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
