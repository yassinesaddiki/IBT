import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginScreen }          from './features/auth/LoginScreen'
import { CGRDashboard }         from './features/cgr/CGRDashboard'
import { EEPDashboard }         from './features/eep/EEPDashboard'
import { SEDDashboard }         from './features/sed/SEDDashboard'
import { CoordinatorDashboard } from './features/coordinator/CoordinatorDashboard'
import { ObserverDashboard }    from './features/observer/ObserverDashboard'
import { useAuthStore }         from './store/authStore'
import type { UserRole }        from './shared/types/user'

function ProtectedRoute({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function App() {
  return (
    <Routes>
      <Route path="/"      element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginScreen />} />

      <Route path="/cgr/dashboard" element={
        <ProtectedRoute role="cgr"><CGRDashboard /></ProtectedRoute>
      } />
      <Route path="/eep/dashboard" element={
        <ProtectedRoute role="eep"><EEPDashboard /></ProtectedRoute>
      } />
      <Route path="/sed/dashboard" element={
        <ProtectedRoute role="sed"><SEDDashboard /></ProtectedRoute>
      } />
      <Route path="/coordinator/dashboard" element={
        <ProtectedRoute role="coordinator"><CoordinatorDashboard /></ProtectedRoute>
      } />
      <Route path="/observer/dashboard" element={
        <ProtectedRoute role="observer"><ObserverDashboard /></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
