import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] transition-all duration-400 ${
      scrolled ? 'h-16 bg-cream/88 backdrop-blur-md border-b border-gold/20' : 'h-[72px]'
    }`}>
      <Link to="/" className="font-serif text-2xl font-medium text-wine tracking-wide">
        Wish<span className="text-gold">Story</span>
      </Link>

      {/* Desktop nav */}
      <ul className="hidden md:flex items-center gap-8 list-none">
        <li><a href="/#occasions" className="text-mauve text-xs tracking-widest uppercase hover:text-wine transition-colors">Occasions</a></li>
        <li><a href="/#how" className="text-mauve text-xs tracking-widest uppercase hover:text-wine transition-colors">How It Works</a></li>
        <li><a href="/#pricing" className="text-mauve text-xs tracking-widest uppercase hover:text-wine transition-colors">Pricing</a></li>
        {user ? (
          <>
            <li>
              <Link to="/dashboard" className="text-mauve text-xs tracking-widest uppercase hover:text-wine transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-wine text-cream px-5 py-2 text-xs tracking-widest uppercase hover:bg-mauve transition-colors"
              >
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="text-mauve text-xs tracking-widest uppercase hover:text-wine transition-colors">Sign In</Link></li>
            <li>
              <Link to="/register" className="bg-wine text-cream px-5 py-2 text-xs tracking-widest uppercase hover:bg-mauve transition-colors">
                Begin Your Story
              </Link>
            </li>
          </>
        )}
      </ul>

      {/* Mobile toggle */}
      <button className="md:hidden text-wine p-1" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute top-full left-0 right-0 bg-cream/95 backdrop-blur-md border-b border-gold/20 px-[5%] py-6 flex flex-col gap-5 md:hidden"
          >
            <a href="/#occasions" className="text-mauve text-xs tracking-widest uppercase">Occasions</a>
            <a href="/#how" className="text-mauve text-xs tracking-widest uppercase">How It Works</a>
            <a href="/#pricing" className="text-mauve text-xs tracking-widest uppercase">Pricing</a>
            {user ? (
              <>
                <Link to="/dashboard" className="text-mauve text-xs tracking-widest uppercase">Dashboard</Link>
                <button onClick={handleLogout} className="text-left text-mauve text-xs tracking-widest uppercase">Log Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-mauve text-xs tracking-widest uppercase">Sign In</Link>
                <Link to="/register" className="bg-wine text-cream px-5 py-2.5 text-xs tracking-widest uppercase text-center">
                  Begin Your Story
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
