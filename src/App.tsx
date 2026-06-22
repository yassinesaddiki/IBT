import { Routes, Route, Navigate } from 'react-router-dom'
// Auth
import { LoginScreen }            from './features/auth/LoginScreen'
// CGR
import { CGRDashboard }           from './features/cgr/CGRDashboard'
import { PreCheckScreen }         from './features/cgr/PreCheckScreen'
import { NewTicketScreen }        from './features/cgr/NewTicketScreen'
import { TicketDetailScreen }     from './features/cgr/TicketDetailScreen'
import { ClosureScreen }          from './features/cgr/ClosureScreen'
import { NotificationsScreen }    from './features/cgr/NotificationsScreen'
// EEP
import { EEPDashboard }           from './features/eep/EEPDashboard'
import { EEPTicketDetail }        from './features/eep/EEPTicketDetail'
import { EEPStatusUpdate }        from './features/eep/EEPStatusUpdate'
import { EEPInterventionReport }  from './features/eep/EEPInterventionReport'
import { EEPReferToSED }          from './features/eep/EEPReferToSED'
import { EEPNotifications }       from './features/eep/EEPNotifications'
// SED
import { SEDDashboard }           from './features/sed/SEDDashboard'
import { SEDTicketDetail }        from './features/sed/SEDTicketDetail'
import { SEDStatusUpdate }        from './features/sed/SEDStatusUpdate'
import { SEDInterventionReport }  from './features/sed/SEDInterventionReport'
import { SEDScheduleScreen }      from './features/sed/SEDScheduleScreen'
import { SEDNotifications }       from './features/sed/SEDNotifications'
// Coordinator
import { CoordinatorDashboard }   from './features/coordinator/CoordinatorDashboard'
import { ApprovalScreen }         from './features/coordinator/ApprovalScreen'
import { DutyScheduleScreen }     from './features/coordinator/DutyScheduleScreen'
import { CoordinatorTickets }     from './features/coordinator/CoordinatorTickets'
import { EmployeeManagement }     from './features/coordinator/EmployeeManagement'
import { SectorManagement }       from './features/coordinator/SectorManagement'
import { CategoryManagement }     from './features/coordinator/CategoryManagement'
import { ReportsScreen }          from './features/coordinator/ReportsScreen'
import { CoordinatorNotifications } from './features/coordinator/CoordinatorNotifications'
import { VehicleManagement }       from './features/coordinator/VehicleManagement'
import { AccountManagement }       from './features/coordinator/AccountManagement'
// Observer
import { ObserverDashboard }      from './features/observer/ObserverDashboard'
import { ObserverDutySchedule }   from './features/observer/ObserverDutySchedule'
import { ObserverTickets }        from './features/observer/ObserverTickets'
import { ObserverReports }        from './features/observer/ObserverReports'
// Store
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

      {/* ── CGR ── */}
      <Route path="/cgr/dashboard"              element={<ProtectedRoute role="cgr"><CGRDashboard /></ProtectedRoute>} />
      <Route path="/cgr/precheck"               element={<ProtectedRoute role="cgr"><PreCheckScreen /></ProtectedRoute>} />
      <Route path="/cgr/nouveau-ticket"         element={<ProtectedRoute role="cgr"><NewTicketScreen /></ProtectedRoute>} />
      <Route path="/cgr/ticket/:id"             element={<ProtectedRoute role="cgr"><TicketDetailScreen /></ProtectedRoute>} />
      <Route path="/cgr/ticket/:id/cloture"     element={<ProtectedRoute role="cgr"><ClosureScreen /></ProtectedRoute>} />
      <Route path="/cgr/notifications"          element={<ProtectedRoute role="cgr"><NotificationsScreen /></ProtectedRoute>} />

      {/* ── EEP ── */}
      <Route path="/eep/dashboard"              element={<ProtectedRoute role="eep"><EEPDashboard /></ProtectedRoute>} />
      <Route path="/eep/ticket/:id"             element={<ProtectedRoute role="eep"><EEPTicketDetail /></ProtectedRoute>} />
      <Route path="/eep/ticket/:id/statut"      element={<ProtectedRoute role="eep"><EEPStatusUpdate /></ProtectedRoute>} />
      <Route path="/eep/ticket/:id/rapport"     element={<ProtectedRoute role="eep"><EEPInterventionReport /></ProtectedRoute>} />
      <Route path="/eep/ticket/:id/referer"     element={<ProtectedRoute role="eep"><EEPReferToSED /></ProtectedRoute>} />
      <Route path="/eep/notifications"          element={<ProtectedRoute role="eep"><EEPNotifications /></ProtectedRoute>} />

      {/* ── SED ── */}
      <Route path="/sed/dashboard"              element={<ProtectedRoute role="sed"><SEDDashboard /></ProtectedRoute>} />
      <Route path="/sed/ticket/:id"             element={<ProtectedRoute role="sed"><SEDTicketDetail /></ProtectedRoute>} />
      <Route path="/sed/ticket/:id/statut"      element={<ProtectedRoute role="sed"><SEDStatusUpdate /></ProtectedRoute>} />
      <Route path="/sed/ticket/:id/rapport"     element={<ProtectedRoute role="sed"><SEDInterventionReport /></ProtectedRoute>} />
      <Route path="/sed/ticket/:id/programmer"  element={<ProtectedRoute role="sed"><SEDScheduleScreen /></ProtectedRoute>} />
      <Route path="/sed/notifications"          element={<ProtectedRoute role="sed"><SEDNotifications /></ProtectedRoute>} />

      {/* ── Coordinator ── */}
      <Route path="/coordinator/dashboard"                  element={<ProtectedRoute role="coordinator"><CoordinatorDashboard /></ProtectedRoute>} />
      <Route path="/coordinator/ticket/:id"                 element={<ProtectedRoute role="coordinator"><TicketDetailScreen /></ProtectedRoute>} />
      <Route path="/coordinator/ticket/:id/approbation"     element={<ProtectedRoute role="coordinator"><ApprovalScreen /></ProtectedRoute>} />
      <Route path="/coordinator/tickets"                    element={<ProtectedRoute role="coordinator"><CoordinatorTickets /></ProtectedRoute>} />
      <Route path="/coordinator/planning"                   element={<ProtectedRoute role="coordinator"><DutyScheduleScreen /></ProtectedRoute>} />
      <Route path="/coordinator/rapports"                   element={<ProtectedRoute role="coordinator"><ReportsScreen /></ProtectedRoute>} />
      <Route path="/coordinator/employes"                   element={<ProtectedRoute role="coordinator"><EmployeeManagement /></ProtectedRoute>} />
      <Route path="/coordinator/secteurs"                   element={<ProtectedRoute role="coordinator"><SectorManagement /></ProtectedRoute>} />
      <Route path="/coordinator/categories"                 element={<ProtectedRoute role="coordinator"><CategoryManagement /></ProtectedRoute>} />
      <Route path="/coordinator/vehicules"                  element={<ProtectedRoute role="coordinator"><VehicleManagement /></ProtectedRoute>} />
      <Route path="/coordinator/comptes"                    element={<ProtectedRoute role="coordinator"><AccountManagement /></ProtectedRoute>} />
      <Route path="/coordinator/notifications"              element={<ProtectedRoute role="coordinator"><CoordinatorNotifications /></ProtectedRoute>} />

      {/* ── Observer ── */}
      <Route path="/observer/dashboard" element={<ProtectedRoute role="observer"><ObserverDashboard /></ProtectedRoute>} />
      <Route path="/observer/ticket/:id" element={<ProtectedRoute role="observer"><TicketDetailScreen /></ProtectedRoute>} />
      <Route path="/observer/tickets"    element={<ProtectedRoute role="observer"><ObserverTickets /></ProtectedRoute>} />
      <Route path="/observer/planning"   element={<ProtectedRoute role="observer"><ObserverDutySchedule /></ProtectedRoute>} />
      <Route path="/observer/rapports"   element={<ProtectedRoute role="observer"><ObserverReports /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
