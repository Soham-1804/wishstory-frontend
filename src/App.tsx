import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'


import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import StoryPage from '@/pages/StoryPage'

import GiftShopPage from '@/pages/gifts/GiftShopPage'
import GiftProductPage from '@/pages/gifts/GiftProductPage'
import GiftCheckoutPage from '@/pages/gifts/GiftCheckoutPage'

import DashboardPage from '@/pages/dashboard/DashboardPage'
import MyStoriesPage from '@/pages/dashboard/MyStoriesPage'
import CreateStoryPage from '@/pages/dashboard/CreateStoryPage'
import PaymentPage from '@/pages/dashboard/PaymentPage'
import OrderConfirmationPage from '@/pages/dashboard/OrderConfirmationPage'
import ProfilePage from '@/pages/dashboard/ProfilePage'
import PaymentHistoryPage from '@/pages/dashboard/PaymentHistoryPage'

import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminStoriesPage from '@/pages/admin/AdminStoriesPage'
import AdminStoryDetailPage from '@/pages/admin/AdminStoryDetailPage'
import QuizLandingPage  from '@/pages/quiz/QuizLandingPage'
import QuizPage         from '@/pages/quiz/QuizPage'
import QuizWaitingPage  from '@/pages/quiz/QuizWaitingPage'
import QuizResultPage   from '@/pages/quiz/QuizResultPage'
import PublicLayout from '@/components/layout/PublicLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AdminLayout from '@/components/layout/AdminLayout'

import QuestionsPage  from '@/pages/studio/QuestionsPage'
import MemoryReelPage from '@/pages/studio/MemoryReelPage'
import PolaroidPage   from '@/pages/studio/PolaroidPage'
import CarouselPage   from '@/pages/studio/CarouselPage'
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
  useEffect(() => { checkAuth() }, [checkAuth])

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gifts" element={<GiftShopPage />} />
        <Route path="/gifts/checkout" element={<GiftCheckoutPage />} />
        <Route path="/gifts/:id" element={<GiftProductPage />} />
      </Route>

      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/story/:id" element={<StoryPage />} />

      <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route path="/dashboard"               element={<DashboardPage />} />
        <Route path="/dashboard/stories"       element={<MyStoriesPage />} />
        <Route path="/dashboard/create"        element={<CreateStoryPage />} />
        <Route path="/dashboard/payment/:id"   element={<PaymentPage />} />
        <Route path="/dashboard/confirmed/:id" element={<OrderConfirmationPage />} />
        <Route path="/dashboard/profile"       element={<ProfilePage />} />
        <Route path="/dashboard/payments"      element={<PaymentHistoryPage />} />
      </Route>

      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/admin"             element={<AdminDashboardPage />} />
        <Route path="/admin/stories"     element={<AdminStoriesPage />} />
        <Route path="/admin/stories/:id" element={<AdminStoryDetailPage />} />
      </Route>
 <Route path="/quiz"                   element={<QuizLandingPage />} />
      <Route path="/quiz/:id"               element={<QuizPage />} />
      <Route path="/quiz/:id/waiting"       element={<QuizWaitingPage />} />
      <Route path="/quiz/:id/result"        element={<QuizResultPage />} />
       <Route path="/36-questions" element={<QuestionsPage />} />
      <Route path="/memory-reel"  element={<MemoryReelPage />} />
      <Route path="/polaroid"     element={<PolaroidPage />} />
      <Route path="/carousel"     element={<CarouselPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
