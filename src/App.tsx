import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { AppLayout } from '@/components/layout/AppLayout'

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────

const Login = lazy(() => import('@/pages/auth/Login'))
const Register = lazy(() => import('@/pages/auth/Register'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const MonitorList = lazy(() => import('@/pages/monitors/MonitorList'))
const MonitorNew = lazy(() => import('@/pages/monitors/MonitorNew'))
const MonitorDetail = lazy(() => import('@/pages/monitors/MonitorDetail'))
const MonitorEdit = lazy(() => import('@/pages/monitors/MonitorEdit'))
const Profile = lazy(() => import('@/pages/settings/Profile'))
const Billing = lazy(() => import('@/pages/settings/Billing'))
const StatusPage = lazy(() => import('@/pages/StatusPage'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// ─── Route guards ─────────────────────────────────────────────────────────────

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  if (token) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />

        {/* Auth routes (unauthenticated only) */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />

        {/* Public status page */}
        <Route path="/status/:slug" element={<StatusPage />} />

        {/* Protected app routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/monitors" element={<MonitorList />} />
          <Route path="/monitors/new" element={<MonitorNew />} />
          <Route path="/monitors/:id" element={<MonitorDetail />} />
          <Route path="/monitors/:id/edit" element={<MonitorEdit />} />
          <Route path="/settings" element={<Profile />} />
          <Route path="/settings/billing" element={<Billing />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
