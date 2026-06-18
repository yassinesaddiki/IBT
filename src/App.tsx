import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginScreen }            from './features/auth/LoginScreen'
import { CGRDashboard }           from './features/cgr/CGRDashboard'
import { PreCheckScreen }         from './features/cgr/PreCheckScreen'
import { NewTicketScreen }        from './features/cgr/NewTicketScreen'
import { EEPDashboard }           from './features/eep/EEPDashboard'
import { EEPTicketDetail }        from './features/eep/EEPTicketDetail'
import { EEPStatusUpdate }        from './features/eep/EEPStatusUpdate'
import { EEPInterventionReport }  from './features/eep/EEPInterventionReport'
import { EEPReferToSED }          from './features/eep/EEPReferToSED'
import { SEDDashboard }           from './features/sed/SEDDashboard'
import { CoordinatorDashboard }   from './features/coordinator/CoordinatorDashboard'
import { ObserverDashboard }      from './features/observer/ObserverDashboard'
import { useAuthStore }           from './store/authStore'
import type { UserRole }          from './shared/types/user'

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

      {/* CGR */}
      <Route path="/cgr/dashboard"    element={<ProtectedRoute role="cgr"><CGRDashboard /></ProtectedRoute>} />
      <Route path="/cgr/precheck"     element={<ProtectedRoute role="cgr"><PreCheckScreen /></ProtectedRoute>} />
      <Route path="/cgr/nouveau-ticket" element={<ProtectedRoute role="cgr"><NewTicketScreen /></ProtectedRoute>} />

      {/* EEP */}
      <Route path="/eep/dashboard"               element={<ProtectedRoute role="eep"><EEPDashboard /></ProtectedRoute>} />
      <Route path="/eep/ticket/:id"              element={<ProtectedRoute role="eep"><EEPTicketDetail /></ProtectedRoute>} />
      <Route path="/eep/ticket/:id/statut"       element={<ProtectedRoute role="eep"><EEPStatusUpdate /></ProtectedRoute>} />
      <Route path="/eep/ticket/:id/rapport"      element={<ProtectedRoute role="eep"><EEPInterventionReport /></ProtectedRoute>} />
      <Route path="/eep/ticket/:id/referer"      element={<ProtectedRoute role="eep"><EEPReferToSED /></ProtectedRoute>} />

      {/* SED */}
      <Route path="/sed/dashboard" element={<ProtectedRoute role="sed"><SEDDashboard /></ProtectedRoute>} />

      {/* Coordinator */}
      <Route path="/coordinator/dashboard" element={<ProtectedRoute role="coordinator"><CoordinatorDashboard /></ProtectedRoute>} />

      {/* Observer */}
      <Route path="/observer/dashboard" element={<ProtectedRoute role="observer"><ObserverDashboard /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
