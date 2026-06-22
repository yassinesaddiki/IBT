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

initStores()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
