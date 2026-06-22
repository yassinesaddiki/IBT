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

// Bootstrap all stores from Supabase on app load
async function initStores() {
  await Promise.allSettled([
    useDutyStore.getState().init(),
    useCategoryStore.getState().init(),
    useEmployeeStore.getState().init(),
    useAccountStore.getState().init(),
  ])
  // Vehicles don't have a Supabase-backed init yet — they use localStorage
  void useVehicleStore.getState()
}

initStores()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
