import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, LogOut, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const NAV = [
  { to: '/admin',         icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/stories', icon: BookOpen,        label: 'All Stories' },
]

export default function AdminLayout() {
  const { logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-[#1a0d0b] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex flex-col border-r border-white/8 flex-shrink-0">
        <div className="px-6 py-5 border-b border-white/8 flex items-center gap-2">
          <Shield size={14} className="text-gold" />
          <span className="font-serif text-lg text-cream">Admin</span>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-wide transition-colors ${
                  active ? 'bg-wine text-cream' : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <Icon size={14} strokeWidth={1.5} />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="px-3 pb-5">
          <button
            onClick={() => { logout(); navigate('/') }}
            className="flex items-center gap-2 text-white/30 text-xs hover:text-white/60 transition-colors px-3 py-2 w-full"
          >
            <LogOut size={13} />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#f8f4ef]">
        <Outlet />
      </main>
    </div>
  )
}
