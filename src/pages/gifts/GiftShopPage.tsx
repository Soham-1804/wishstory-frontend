import { useState, useMemo, useRef, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Search, Star, Truck, Shield, Filter, X, Heart } from 'lucide-react'
import { GIFTS, GIFT_CATEGORIES, getGiftsByCategory } from '@/lib/giftData'
import { useCartStore } from '@/store/cartStore'
import type { GiftProduct } from '@/types/gifts'
import toast from 'react-hot-toast'

/* ── PRODUCT CARD ── */
const GiftCard = forwardRef(function GiftCard({ gift, onAddToCart }: { gift: GiftProduct; onAddToCart: (g: GiftProduct) => void }, ref) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [liked, setLiked] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      layout
      className="group relative bg-cream border border-gold/18 flex flex-col hover:shadow-[0_12px_40px_rgba(107,61,56,.12)] transition-shadow duration-300"
    >
      {/* Badge */}
      {gift.badge && (
        <div className="absolute top-3 left-3 z-10 bg-wine text-cream text-[9px] font-medium tracking-widest uppercase px-2.5 py-1">
          {gift.badge}
        </div>
      )}

      {/* Bundle badge */}
      {gift.storyBundle && (
        <div className="absolute top-3 right-10 z-10 bg-gold text-ink text-[9px] font-medium tracking-wide uppercase px-2.5 py-1">
          +Story Bundle
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={() => setLiked(!liked)}
        className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center"
      >
        <Heart
          size={16}
          className={liked ? 'fill-rose-400 text-rose-400' : 'text-white/60 group-hover:text-white/80'}
          strokeWidth={1.5}
        />
      </button>

      {/* Image */}
      <Link to={`/gifts/${gift.id}`} className="block relative overflow-hidden aspect-[4/3] bg-fog">
        {!imgLoaded && <div className="absolute inset-0 bg-fog animate-pulse" />}
        <img
          src={gift.images[0]}
          alt={gift.name}
          onLoad={() => setImgLoaded(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          style={{ opacity: imgLoaded ? 1 : 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] tracking-[0.18em] text-gold uppercase mb-1 font-light">
          {GIFT_CATEGORIES.find(c => c.value === gift.category)?.emoji}{' '}
          {GIFT_CATEGORIES.find(c => c.value === gift.category)?.label}
        </p>

        <Link to={`/gifts/${gift.id}`}>
          <h3 className="font-serif text-wine text-lg font-normal leading-tight mb-1 hover:text-mauve transition-colors">
            {gift.name}
          </h3>
        </Link>

        <p className="text-xs text-dusty font-light leading-relaxed flex-1 mb-3">
          {gift.tagline}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(gift.rating) ? 'fill-gold text-gold' : 'text-fog fill-fog'}
              />
            ))}
          </div>
          <span className="text-[11px] text-dusty font-light">{gift.rating} ({gift.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-xl text-wine font-normal">{gift.priceDisplay}</p>
            {gift.storyBundle && gift.bundleDiscount && (
              <p className="text-[10px] text-gold font-light">
                {gift.bundleDiscount}% off with a story
              </p>
            )}
          </div>
          <button
            onClick={() => onAddToCart(gift)}
            disabled={!gift.inStock}
            className="flex items-center gap-2 bg-wine text-cream px-4 py-2 text-[11px] tracking-widest uppercase hover:bg-mauve transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={12} />
            {gift.inStock ? 'Add' : 'Sold'}
          </button>
        </div>

        {/* Delivery note */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gold/12">
          <Truck size={11} className="text-dusty flex-shrink-0" />
          <p className="text-[10px] text-dusty font-light">
            Delivers in {gift.deliveryDays}–{gift.deliveryDays + 2} days
          </p>
        </div>
      </div>
    </motion.div>
  )
})

/* ── CART DRAWER ── */
function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQty, total, totalDisplay, itemCount } = useCartStore()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-ink/50 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-cream z-50 flex flex-col shadow-2xl"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gold/20">
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} className="text-wine" strokeWidth={1.5} />
                <h2 className="font-serif text-wine text-lg">Your Gift Bag</h2>
                {itemCount() > 0 && (
                  <span className="bg-wine text-cream text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {itemCount()}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="text-dusty hover:text-wine transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
                  <div className="text-5xl">🎁</div>
                  <p className="font-serif text-wine text-xl font-light">Your bag is empty</p>
                  <p className="text-sm text-dusty font-light">Add something beautiful for someone special</p>
                  <button onClick={onClose} className="text-xs tracking-widest uppercase text-mauve hover:text-wine transition-colors mt-2">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.product.id} className="flex gap-4 pb-4 border-b border-gold/12">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-wine text-sm leading-snug mb-0.5">{item.product.name}</p>
                      <p className="text-[11px] text-dusty mb-2">{item.product.priceDisplay}</p>
                      <div className="flex items-center gap-3">
                        {/* Qty */}
                        <div className="flex items-center border border-gold/25">
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-mauve hover:text-wine text-sm"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-sm text-wine">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-mauve hover:text-wine text-sm"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-[11px] text-dusty hover:text-wine transition-colors underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="font-serif text-wine font-normal whitespace-nowrap text-sm">
                      ₹{((item.product.price * item.quantity) / 100).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-gold/20 space-y-4">
                {/* Bundle upsell */}
                <div className="bg-gold/8 border border-gold/25 p-3 flex items-center gap-3">
                  <span className="text-xl">📖</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-wine mb-0.5">Add a WishStory</p>
                    <p className="text-[11px] text-dusty font-light leading-snug">
                      Bundle with a personalised story and save up to 20%
                    </p>
                  </div>
                  <Link
                    to="/dashboard/create"
                    className="text-[10px] tracking-widest uppercase text-wine border border-wine/30 px-3 py-1.5 hover:bg-wine hover:text-cream transition-colors whitespace-nowrap"
                    onClick={onClose}
                  >
                    + Story
                  </Link>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-dusty font-light">Subtotal</span>
                  <span className="font-serif text-wine text-xl">{totalDisplay()}</span>
                </div>
                <p className="text-[11px] text-dusty font-light">Shipping calculated at checkout</p>
                <Link
                  to="/gifts/checkout"
                  onClick={onClose}
                  className="w-full block text-center bg-wine text-cream py-3.5 text-xs tracking-widest uppercase hover:bg-mauve transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={onClose}
                  className="w-full text-center text-xs tracking-widest uppercase text-mauve hover:text-wine transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function GiftShopPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured')
  const { addItem, itemCount } = useCartStore()
  const searchRef = useRef<HTMLInputElement>(null)

  const filteredGifts = useMemo(() => {
    let list = getGiftsByCategory(activeCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.tagline.toLowerCase().includes(q) ||
        g.tags.some(t => t.includes(q))
      )
    }
    switch (sortBy) {
      case 'price-asc':  return [...list].sort((a,b) => a.price - b.price)
      case 'price-desc': return [...list].sort((a,b) => b.price - a.price)
      case 'rating':     return [...list].sort((a,b) => b.rating - a.rating)
      default:           return list
    }
  }, [activeCategory, searchQuery, sortBy])

  const handleAddToCart = (gift: GiftProduct) => {
    addItem(gift)
    toast.success(`${gift.name} added to your bag`, {
      style: { fontFamily: 'DM Sans, sans-serif', fontSize: '13px' },
      iconTheme: { primary: '#c8a97e', secondary: '#faf7f2' },
    })
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* ── HERO BANNER ── */}
      <section className="relative bg-wine overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse 70% 70% at 80% 30%, rgba(200,169,126,.6) 0%, transparent 60%)' }}
        />
        <div className="relative z-10 px-[5%] py-24 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
            <p className="text-[10px] tracking-[0.3em] text-gold/60 uppercase mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-gold/40" />
              The Gift Shop
            </p>
            <h1 className="font-serif text-cream font-light leading-tight mb-4" style={{ fontSize: 'clamp(2.4rem,5vw,4.2rem)' }}>
              Everything you'd want<br />
              <em className="italic text-gold-light">to leave on their doorstep</em>
            </h1>
            <p className="text-white/45 font-light leading-relaxed max-w-lg text-sm mb-8">
              Soft toys, home decor, perfumes, candles, jewellery, and more — all curated for moments that matter. Bundle any gift with a WishStory and save up to 20%.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Free gift wrapping', 'Pan-India delivery', '100% satisfaction'].map(f => (
                <span key={f} className="flex items-center gap-1.5 text-[11px] text-white/50 border border-white/15 px-3 py-1.5">
                  <Shield size={10} className="text-gold/60" />
                  {f}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-gold/18 px-[5%] py-3 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dusty" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search gifts…"
            className="w-full pl-9 pr-4 py-2 bg-fog border border-gold/20 text-sm text-ink placeholder:text-dusty/50 outline-none focus:border-mauve/50 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-dusty hover:text-wine">
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-dusty" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent text-xs text-mauve border-none outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 bg-wine text-cream px-4 py-2 text-[11px] tracking-widest uppercase hover:bg-mauve transition-colors"
          >
            <ShoppingCart size={13} />
            Bag
            {itemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {itemCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="px-[5%] py-8 max-w-7xl mx-auto">

        {/* ── CATEGORY PILLS ── */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          {GIFT_CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 text-xs tracking-wide border transition-all duration-200 flex-shrink-0 ${
                activeCategory === cat.value
                  ? 'bg-wine text-cream border-wine'
                  : 'bg-transparent text-mauve border-gold/25 hover:border-wine/40 hover:text-wine'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* ── BUNDLE PROMO BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gold/8 via-gold/12 to-gold/8 border border-gold/25 p-5 mb-8 flex items-center gap-5 flex-wrap"
        >
          <div className="text-3xl">🎁 + 📖</div>
          <div className="flex-1">
            <p className="font-serif text-wine text-lg font-light mb-0.5">Bundle a Gift + a WishStory</p>
            <p className="text-sm text-mauve font-light">Add any eligible gift to a story order and save up to 20% on both. The most thoughtful thing you can give.</p>
          </div>
          <Link
            to="/dashboard/create"
            className="flex-shrink-0 bg-wine text-cream px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-mauve transition-colors"
          >
            Create a Story
          </Link>
        </motion.div>

        {/* ── RESULTS COUNT ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-dusty font-light">
            {filteredGifts.length} {filteredGifts.length === 1 ? 'gift' : 'gifts'}
            {searchQuery && <span> for "<strong className="text-wine">{searchQuery}</strong>"</span>}
          </p>
        </div>

        {/* ── GRID ── */}
        {filteredGifts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="text-5xl">🔍</div>
            <p className="font-serif text-wine text-2xl font-light">Nothing found</p>
            <p className="text-sm text-dusty font-light">Try a different search or browse all categories</p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('all') }} className="text-xs tracking-widest uppercase text-mauve hover:text-wine transition-colors mt-2">
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredGifts.map(gift => (
                <GiftCard key={gift.id} gift={gift} onAddToCart={handleAddToCart} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── TRUST BAR ── */}
      <div className="bg-fog border-t border-gold/15 px-[5%] py-8 mt-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🎁', title: 'Free Gift Wrapping', desc: 'Every order, beautifully wrapped' },
            { icon: '🚚', title: 'Pan-India Delivery', desc: '2–10 day delivery everywhere' },
            { icon: '✨', title: 'Curated Quality', desc: 'Every product personally reviewed' },
            { icon: '💌', title: 'Story Bundles', desc: 'Pair any gift with a WishStory' },
          ].map(item => (
            <div key={item.title} className="text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-xs font-medium text-wine mb-1">{item.title}</p>
              <p className="text-[11px] text-dusty font-light leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CART DRAWER */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
