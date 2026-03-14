import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Layouts
import PublicLayout from '@/components/layout/PublicLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AdminLayout from '@/components/layout/AdminLayout'

// Public pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import StoryPage from '@/pages/StoryPage'

// Legal pages
import PrivacyPolicyPage from '@/pages/legal/PrivacyPolicyPage'
import TermsOfServicePage from '@/pages/legal/TermsOfServicePage'
import RefundPolicyPage from '@/pages/legal/RefundPolicyPage'
import ContactPage from '@/pages/legal/ContactPage'

// User pages
import DashboardPage from '@/pages/dashboard/DashboardPage'
import MyStoriesPage from '@/pages/dashboard/MyStoriesPage'
import CreateStoryPage from '@/pages/dashboard/CreateStoryPage'
import PaymentPage from '@/pages/dashboard/PaymentPage'
import OrderConfirmationPage from '@/pages/dashboard/OrderConfirmationPage'
import ProfilePage from '@/pages/dashboard/ProfilePage'
import PaymentHistoryPage from '@/pages/dashboard/PaymentHistoryPage'

// Admin pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminStoriesPage from '@/pages/admin/AdminStoriesPage'
import AdminStoryDetailPage from '@/pages/admin/AdminStoryDetailPage'

// Guards
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

export default function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms"   element={<TermsOfServicePage />} />
        <Route path="/refund"  element={<RefundPolicyPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Auth */}
      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Story delivery page (public with optional password) */}
      <Route path="/story/:id" element={<StoryPage />} />

      {/* User dashboard */}
      <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route path="/dashboard"              element={<DashboardPage />} />
        <Route path="/dashboard/stories"      element={<MyStoriesPage />} />
        <Route path="/dashboard/create"       element={<CreateStoryPage />} />
        <Route path="/dashboard/payment/:id"  element={<PaymentPage />} />
        <Route path="/dashboard/confirmed/:id"element={<OrderConfirmationPage />} />
        <Route path="/dashboard/profile"      element={<ProfilePage />} />
        <Route path="/dashboard/payments"     element={<PaymentHistoryPage />} />
      </Route>

      {/* Admin */}
      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/admin"                element={<AdminDashboardPage />} />
        <Route path="/admin/stories"        element={<AdminStoriesPage />} />
        <Route path="/admin/stories/:id"    element={<AdminStoryDetailPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
