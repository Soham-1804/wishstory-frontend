import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Truck, Shield, Star, ArrowLeft, Plus, Minus, Package, Heart } from 'lucide-react'
import { getGiftById, getRelatedGifts, GIFT_CATEGORIES } from '@/lib/giftData'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

export default function GiftProductPage() {
  const { id } = useParams<{ id: string }>()
  const gift = getGiftById(id || '')
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [giftNote, setGiftNote] = useState('')
  const [liked, setLiked] = useState(false)
  const { addItem } = useCartStore()

  if (!gift) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="text-5xl">🎁</div>
        <h2 className="font-serif text-wine text-2xl">Gift not found</h2>
        <Link to="/gifts" className="text-xs tracking-widest uppercase text-mauve hover:text-wine transition-colors">
          ← Back to Gift Shop
        </Link>
      </div>
    )
  }

  const related = getRelatedGifts(gift)
  const catLabel = GIFT_CATEGORIES.find(c => c.value === gift.category)

  const handleAddToCart = () => {
    addItem(gift, qty)
    toast.success(`${gift.name} added to your bag`, {
      style: { fontFamily: 'DM Sans, sans-serif', fontSize: '13px' },
      iconTheme: { primary: '#c8a97e', secondary: '#faf7f2' },
    })
  }

  const bundledPrice = gift.storyBundle && gift.bundleDiscount
    ? Math.round(gift.price * (1 - gift.bundleDiscount / 100))
    : null

  return (
    <div className="min-h-screen bg-cream">
      {/* Coming soon overlay — covers gift pages and blurs background */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-cream/70 backdrop-blur-md" />
        <div className="relative z-10 text-center px-6">
          <h2 className="font-serif text-wine text-3xl mb-2">Coming soon</h2>
          <p className="text-mauve text-sm">Gift Shop features are coming soon — please check back later.</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-[5%] py-4 border-b border-gold/15 flex items-center gap-2 text-[11px] text-dusty font-light">
        <Link to="/" className="hover:text-wine transition-colors">Home</Link>
        <span>/</span>
        <Link to="/gifts" className="hover:text-wine transition-colors">Gift Shop</Link>
        <span>/</span>
        <Link to={`/gifts?cat=${gift.category}`} className="hover:text-wine transition-colors">
          {catLabel?.label}
        </Link>
        <span>/</span>
        <span className="text-wine">{gift.name}</span>
      </div>

      <div className="px-[5%] py-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">

          {/* ── LEFT: IMAGES ── */}
          <div>
            <div className="relative overflow-hidden aspect-[4/3] bg-fog mb-3 group">
              <img
                src={gift.images[activeImg]}
                alt={gift.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {gift.badge && (
                <div className="absolute top-4 left-4 bg-wine text-cream text-[9px] tracking-widest uppercase px-3 py-1.5">
                  {gift.badge}
                </div>
              )}
              <button
                onClick={() => setLiked(!liked)}
                className="absolute top-4 right-4 w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center"
              >
                <Heart size={16} className={liked ? 'fill-rose-400 text-rose-400' : 'text-mauve'} strokeWidth={1.5} />
              </button>
            </div>
            {gift.images.length > 1 && (
              <div className="flex gap-2">
                {gift.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-16 overflow-hidden border-2 transition-all ${i === activeImg ? 'border-wine' : 'border-gold/20 hover:border-gold/50'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: DETAILS ── */}
          <div>
            <Link to="/gifts" className="inline-flex items-center gap-1.5 text-[11px] text-dusty hover:text-wine transition-colors mb-4">
              <ArrowLeft size={12} />
              Back to Gift Shop
            </Link>

            <p className="text-[10px] tracking-[0.2em] text-gold uppercase mb-2">
              {catLabel?.emoji} {catLabel?.label}
            </p>

            <h1 className="font-serif text-wine text-3xl font-normal leading-tight mb-2">
              {gift.name}
            </h1>
            <p className="text-base text-mauve font-light font-serif italic mb-4">{gift.tagline}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={i < Math.floor(gift.rating) ? 'fill-gold text-gold' : 'text-fog fill-fog'} />
                ))}
              </div>
              <span className="text-sm text-dusty">{gift.rating} · {gift.reviewCount} reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 mb-6">
              <p className="font-serif text-3xl text-wine">{gift.priceDisplay}</p>
              {bundledPrice && (
                <div className="text-sm text-gold font-light pb-1">
                  ₹{(bundledPrice / 100).toLocaleString('en-IN')} with Story Bundle
                  <span className="ml-1.5 bg-gold/15 text-gold text-[10px] px-2 py-0.5">
                    -{gift.bundleDiscount}%
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-mauve font-light leading-relaxed mb-6">{gift.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {gift.tags.map(tag => (
                <span key={tag} className="text-[10px] tracking-wide border border-gold/25 text-dusty px-3 py-1 capitalize">
                  {tag}
                </span>
              ))}
            </div>

            {/* Gift Note */}
            <div className="mb-5">
              <label className="block text-[11px] tracking-widest uppercase text-mauve/80 mb-2">
                Add a personal note (optional)
              </label>
              <textarea
                value={giftNote}
                onChange={e => setGiftNote(e.target.value)}
                placeholder="A short message to include with the gift…"
                rows={2}
                maxLength={120}
                className="w-full bg-fog border border-gold/25 px-4 py-3 text-sm text-ink font-light outline-none focus:border-mauve/50 transition-colors placeholder:text-dusty/50 resize-none"
              />
              <p className="text-[10px] text-dusty/50 text-right mt-1">{giftNote.length}/120</p>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center border border-gold/30">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-11 flex items-center justify-center text-mauve hover:text-wine text-lg">
                  <Minus size={13} />
                </button>
                <span className="w-10 text-center text-sm font-medium text-wine">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-11 flex items-center justify-center text-mauve hover:text-wine">
                  <Plus size={13} />
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: .98 }}
                onClick={handleAddToCart}
                disabled={!gift.inStock}
                className="flex-1 flex items-center justify-center gap-2 bg-wine text-cream py-3 text-xs tracking-widest uppercase hover:bg-mauve transition-colors disabled:opacity-40"
              >
                <ShoppingCart size={14} />
                {gift.inStock ? `Add to Bag — ${gift.priceDisplay}` : 'Out of Stock'}
              </motion.button>
            </div>

            {/* Story bundle CTA */}
            {gift.storyBundle && (
              <div className="bg-gold/8 border border-gold/25 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">📖</span>
                  <div>
                    <p className="text-sm font-medium text-wine mb-1">Bundle with a WishStory and save {gift.bundleDiscount}%</p>
                    <p className="text-xs text-mauve font-light mb-3">Add a personalised cinematic story to this gift. Delivered together. Save on both.</p>
                    <Link
                      to="/dashboard/create"
                      className="inline-flex items-center gap-2 bg-wine text-cream px-4 py-2 text-[11px] tracking-widest uppercase hover:bg-mauve transition-colors"
                    >
                      Create Story + Bundle
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery + guarantees */}
            <div className="space-y-3 pt-4 border-t border-gold/15">
              <div className="flex items-center gap-3 text-sm text-mauve font-light">
                <Truck size={15} className="text-dusty flex-shrink-0" />
                Delivers in {gift.deliveryDays}–{gift.deliveryDays + 2} business days · Free wrapping
              </div>
              <div className="flex items-center gap-3 text-sm text-mauve font-light">
                <Shield size={15} className="text-dusty flex-shrink-0" />
                100% satisfaction guarantee
              </div>
              <div className="flex items-center gap-3 text-sm text-mauve font-light">
                <Package size={15} className="text-dusty flex-shrink-0" />
                Arrives in premium gift packaging
              </div>
            </div>
          </div>
        </div>

        {/* ── RELATED ── */}
        {related.length > 0 && (
          <div className="pt-12 border-t border-gold/15">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-wine text-2xl font-light">You might also love</h2>
              <Link to="/gifts" className="text-xs tracking-widest uppercase text-mauve hover:text-wine transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(rg => (
                <Link key={rg.id} to={`/gifts/${rg.id}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden mb-3 bg-fog">
                    <img
                      src={rg.images[0]}
                      alt={rg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="font-serif text-wine text-sm leading-tight group-hover:text-mauve transition-colors">{rg.name}</p>
                  <p className="text-xs text-dusty font-light mt-0.5">{rg.priceDisplay}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
