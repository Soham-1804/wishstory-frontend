import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Truck, Gift, Sparkles } from 'lucide-react'

const FEATURED = [
  { emoji:'🧸', name:'Soft Toys',    desc:'Plush bears, elephants & cuddle companions',       image:'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400&q=80&fit=crop', href:'/gifts?cat=soft-toys',  badge:'Bestseller' },
  { emoji:'🏡', name:'Home Decor',   desc:'Star maps, frames & things to hang with love',     image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80&fit=crop', href:'/gifts?cat=home-decor', badge:'Personalised' },
  { emoji:'🌸', name:'Perfumes',     desc:'Scents that stay long after the moment passes',    image:'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80&fit=crop', href:'/gifts?cat=perfumes' },
  { emoji:'🕯️', name:'Candles',      desc:'Amber, oud & warmth for any room',                 image:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80&fit=crop', href:'/gifts?cat=candles' },
  { emoji:'💎', name:'Jewellery',    desc:'Delicate pieces worth keeping forever',             image:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80&fit=crop', href:'/gifts?cat=jewellery' },
  { emoji:'🎨', name:'Customised',   desc:'Portraits, recipe books, star maps — made for them', image:'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80&fit=crop', href:'/gifts?cat=custom', badge:'Made For You' },
]

function CategoryCard({ item, index }: { item: typeof FEATURED[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div ref={ref} initial={{ opacity:0, y:20 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:.6, delay:index*.08, ease:[.22,1,.36,1] }}>
      <Link to={item.href} className="group block relative overflow-hidden bg-cream border border-gold/18 hover:shadow-[0_12px_40px_rgba(107,61,56,.14)] transition-shadow duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent"/>
          {item.badge && <span className="absolute top-3 left-3 bg-wine text-cream text-[9px] tracking-widest uppercase px-2.5 py-1">{item.badge}</span>}
          <span className="absolute top-3 right-3 text-xl">{item.emoji}</span>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-serif text-wine text-lg font-normal">{item.name}</h3>
            <ArrowRight size={14} className="text-dusty group-hover:text-wine group-hover:translate-x-1 transition-all"/>
          </div>
          <p className="text-xs text-mauve font-light leading-snug">{item.desc}</p>
        </div>
      </Link>
    </motion.div>
  )
}

export default function GiftShopTeaser() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView   = useInView(titleRef, { once: true, margin: '-40px' })
  return (
    <section className="bg-fog py-20 border-t border-gold/12" id="gifts">
      <div className="max-w-6xl mx-auto px-[5%]">

        <motion.div ref={titleRef} initial={{ opacity:0, y:18 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="section-tag">🎁 The Gift Shop</p>
            <h2 className="section-title">Everything you'd want<br/><em>to leave on their doorstep</em></h2>
            <p className="text-sm text-mauve font-light leading-relaxed mt-3 max-w-lg">
              Soft toys, perfumes, candles, jewellery, home decor and more — curated for moments that matter.
              Bundle any gift with a WishStory and save up to 20%.
            </p>
          </div>
          <Link to="/gifts" className="flex-shrink-0 inline-flex items-center gap-2 border border-wine/30 text-wine px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-blush transition-colors self-start md:self-auto">
            <Gift size={13}/> Browse All Gifts
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {FEATURED.map((item, i) => <CategoryCard key={item.name} item={item} index={i}/>)}
        </div>

        {/* Bundle promo strip */}
        <motion.div initial={{ opacity:0, y:12 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:.7, delay:.5 }}
          className="bg-gradient-to-r from-wine to-mauve p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="text-3xl">🎁 + 📖</div>
          <div className="flex-1">
            <p className="font-serif text-cream text-lg font-light mb-1">Bundle a Gift + a WishStory and save up to 20%</p>
            <p className="text-white/55 text-xs font-light leading-relaxed">
              Add any eligible gift to a story order. Delivered together. The most thoughtful thing you can give.
            </p>
          </div>
          <Link to="/dashboard/create" className="flex-shrink-0 bg-gold text-ink px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-gold-light transition-colors font-medium">
            Create a Story
          </Link>
        </motion.div>

        <div className="flex flex-wrap gap-6 mt-8 justify-center">
          {[{icon:Truck,label:'Free gift wrapping on every order'},{icon:Sparkles,label:'Pan-India delivery · 2–10 days'},{icon:Gift,label:'100% satisfaction guarantee'}].map(({icon:Icon,label}) => (
            <div key={label} className="flex items-center gap-2 text-xs text-dusty font-light">
              <Icon size={12} className="text-gold" strokeWidth={1.5}/> {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
