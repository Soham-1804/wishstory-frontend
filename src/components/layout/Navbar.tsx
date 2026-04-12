import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout }            = useAuthStore()
  const { itemCount }               = useCartStore()
  const location                    = useLocation()
  const navigate                    = useNavigate()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  const handleLogout = () => { logout(); navigate('/') }

  const cartCount = itemCount()

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] transition-all duration-300 ${
      scrolled ? 'h-16 bg-cream/92 backdrop-blur-md border-b border-gold/20' : 'h-[72px]'
    }`}>

      {/* Logo */}
      <Link to="/" className="font-serif text-2xl font-medium text-wine tracking-wide">
        Wish<span className="text-gold">Story</span>
      </Link>

      {/* Desktop nav */}
      <ul className="hidden md:flex items-center gap-7 list-none">
        <li>
          <a href="/#occasions" className="text-mauve text-xs tracking-widest uppercase hover:text-wine transition-colors">
            Occasions
          </a>
        </li>
        <li>
          <a href="/#how" className="text-mauve text-xs tracking-widest uppercase hover:text-wine transition-colors">
            How It Works
          </a>
        </li>
        <li>
          <a href="/#pricing" className="text-mauve text-xs tracking-widest uppercase hover:text-wine transition-colors">
            Pricing
          </a>
        </li>

        {/* ── GIFTS NAV ITEM ── */}
        <li>
          <Link
            to="/gifts"
            className={`text-xs tracking-widest uppercase transition-colors flex items-center gap-1.5 ${
              location.pathname.startsWith('/gifts')
                ? 'text-wine font-medium'
                : 'text-mauve hover:text-wine'
            }`}
          >
            <span>🎁</span>
            Gift Shop
          </Link>
        </li>

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
            <li>
              <Link to="/login" className="text-mauve text-xs tracking-widest uppercase hover:text-wine transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="bg-wine text-cream px-5 py-2 text-xs tracking-widest uppercase hover:bg-mauve transition-colors">
                Begin Your Story
              </Link>
            </li>
          </>
        )}

        {/* Cart icon — always visible */}
        <li>
          <Link to="/gifts/checkout" className="relative text-mauve hover:text-wine transition-colors">
            <ShoppingCart size={18} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-ink text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </Link>
        </li>
      </ul>

      {/* Mobile: cart + hamburger */}
      <div className="flex md:hidden items-center gap-3">
        <Link to="/gifts/checkout" className="relative text-mauve">
          <ShoppingCart size={18} strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gold text-ink text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
              {cartCount}
            </span>
          )}
        </Link>
        <button className="text-wine p-1" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute top-full left-0 right-0 bg-cream/97 backdrop-blur-md border-b border-gold/20 px-[5%] py-6 flex flex-col gap-5 md:hidden"
          >
            <a href="/#occasions"   className="text-mauve text-xs tracking-widest uppercase">Occasions</a>
            <a href="/#how"         className="text-mauve text-xs tracking-widest uppercase">How It Works</a>
            <a href="/#pricing"     className="text-mauve text-xs tracking-widest uppercase">Pricing</a>
            <Link to="/gifts"       className="text-mauve text-xs tracking-widest uppercase flex items-center gap-2"><span>🎁</span>Gift Shop</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-mauve text-xs tracking-widest uppercase">Dashboard</Link>
                <button onClick={handleLogout} className="bg-wine text-cream py-2.5 text-xs tracking-widest uppercase w-full">Log Out</button>
              </>
            ) : (
              <>
                <Link to="/login"    className="text-mauve text-xs tracking-widest uppercase">Sign In</Link>
                <Link to="/register" className="bg-wine text-cream py-2.5 text-xs tracking-widest uppercase text-center">Begin Your Story</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
