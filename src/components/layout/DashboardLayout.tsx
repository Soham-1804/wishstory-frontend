import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, BookOpen, PlusCircle, User, CreditCard, LogOut, Menu } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getInitials } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/dashboard',           icon: LayoutDashboard, label: 'Overview' },
  { to: '/dashboard/stories',   icon: BookOpen,        label: 'My Stories' },
  { to: '/dashboard/create',    icon: PlusCircle,      label: 'Create Story' },
  { to: '/dashboard/payments',  icon: CreditCard,      label: 'Payment History' },
  { to: '/dashboard/profile',   icon: User,            label: 'Profile' },
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'w-full' : 'w-64'} flex flex-col h-full bg-cream border-r border-gold/20`}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gold/15">
        <Link to="/" className="font-serif text-xl font-medium text-wine">
          Wish<span className="text-gold">Story</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 ${
                active
                  ? 'bg-wine text-cream'
                  : 'text-mauve hover:bg-blush hover:text-wine'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span className="tracking-wide">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="px-4 pb-6 border-t border-gold/15 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-rose flex items-center justify-center text-wine text-xs font-medium flex-shrink-0">
            {getInitials(user?.name || 'U')}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-wine truncate">{user?.name}</p>
            <p className="text-[10px] text-dusty truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-dusty text-xs hover:text-wine transition-colors w-full px-3 py-1.5"
        >
          <LogOut size={13} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-fog overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-ink/40 z-40 md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-64 z-50 md:hidden"
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 bg-cream border-b border-gold/20">
          <button onClick={() => setSidebarOpen(true)} className="text-wine">
            <Menu size={20} />
          </button>
          <span className="font-serif text-lg text-wine">WishStory</span>
          <div className="w-8 h-8 rounded-full bg-rose flex items-center justify-center text-wine text-xs font-medium">
            {getInitials(user?.name || 'U')}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
