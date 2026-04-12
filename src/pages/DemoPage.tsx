import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Play, ArrowRight, Lock, Clock, Star } from 'lucide-react'

function Reveal({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  )
}

export default function DemoPage() {
  return (
    <div className="bg-cream min-h-screen">

      {/* Hero */}
      <div className="relative bg-wine overflow-hidden pt-36 pb-20 px-[5%] text-center">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 0%, rgba(200,169,126,0.12) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 text-gold/60 text-[10px] tracking-[0.25em] uppercase mb-5">
            <span className="w-5 h-px bg-gold/40" />Live Demos<span className="w-5 h-px bg-gold/40" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif font-light text-cream leading-tight mb-4"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            See a story<br /><em className="italic text-gold-light">before you create one</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-white/40 text-sm font-light leading-relaxed">
            Two real story experiences — one for each package. Open them, scroll through, and feel what your recipient will feel.
          </motion.p>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-8">

        {/* Signature */}
        <Reveal>
          <div className="group relative flex flex-col h-full">
            {/* Preview window */}
            <div className="relative overflow-hidden mb-0" style={{ aspectRatio: '4/3' }}>
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse 70% 65% at 35% 45%, rgba(200,120,90,0.3) 0%, rgba(15,8,6,0.9) 60%)'
              }} />
              {/* Simulated story preview */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <p className="text-[9px] tracking-[0.25em] uppercase text-gold/50 mb-2">🎂 Birthday</p>
                <p className="font-serif text-3xl font-light text-cream/85 leading-tight mb-1">
                  For<br /><em className="italic text-gold-light">Priya</em>
                </p>
                <p className="text-xs text-white/30 font-light italic font-serif">A warm memory, crafted with love.</p>
              </div>
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border border-gold/8" />
              <div className="absolute top-1/3 left-1/3 w-32 h-32 rounded-full border border-gold/5" />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-wine/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <a href="/demo/signature.html" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/30 text-cream px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-white/10 transition-colors">
                  <Play size={11} fill="currentColor" />
                  Open Story
                </a>
              </div>
            </div>

            {/* Card body */}
            <div className="bg-fog border border-gold/20 border-t-0 p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-serif text-xl text-wine mb-0.5">Signature Story</p>
                  <p className="text-xs text-dusty font-light">Warm · Curated · Personal</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl text-wine font-light">$15</p>
                  <p className="text-[10px] text-dusty/60 font-light">per story</p>
                </div>
              </div>

              <div className="space-y-2.5 mb-6 flex-1">
                {[
                  { icon: Clock, text: 'Delivered within 24 hours' },
                  { icon: Star,  text: 'Curated memory sequence + letter' },
                  { icon: Play,  text: 'Background music + transitions' },
                  { icon: ArrowRight, text: 'Private viewing link' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm text-mauve font-light">
                    <Icon size={12} className="text-gold/60 flex-shrink-0" strokeWidth={1.5} />
                    {text}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <a href="/demo/signature.html" target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center border border-wine/25 text-wine text-xs tracking-widest uppercase py-2.5 hover:bg-blush transition-colors inline-flex items-center justify-center gap-1.5">
                  <Play size={11} />
                  View Demo
                </a>
                <Link to="/register"
                  className="flex-1 text-center bg-wine text-cream text-xs tracking-widest uppercase py-2.5 hover:bg-mauve transition-colors inline-flex items-center justify-center gap-1.5">
                  Create
                  <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Luxe */}
        <Reveal delay={0.1}>
          <div className="group relative flex flex-col h-full">
            {/* Popular badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-gold text-wine text-[9px] tracking-[0.15em] uppercase px-3 py-1 whitespace-nowrap">
              Most Popular
            </div>

            {/* Preview window */}
            <div className="relative overflow-hidden mb-0" style={{ aspectRatio: '4/3' }}>
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse 55% 65% at 60% 35%, rgba(80,30,20,0.6) 0%, transparent 60%), linear-gradient(160deg, #1a0b0e 0%, #080506 100%)'
              }} />
              {/* Film letterbox bars */}
              <div className="absolute top-0 left-0 right-0 h-5 bg-black z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-5 bg-black z-10" />
              {/* Story content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8 z-5">
                <p className="text-[9px] tracking-[0.25em] uppercase text-gold/50 mb-2">💌 Anniversary</p>
                <p className="font-serif text-3xl font-light leading-tight mb-1" style={{ color: 'rgba(250,247,242,0.88)' }}>
                  <span className="text-base block" style={{ color: 'rgba(250,247,242,0.3)' }}>For</span>
                  <em className="italic" style={{ color: '#eddcc4' }}>Meera</em>
                </p>
                <p className="text-xs font-light italic font-serif" style={{ color: 'rgba(250,247,242,0.3)' }}>
                  Five years. One film.
                </p>
              </div>
              {/* Grain */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
              }} />
              {/* Lock icon */}
              <div className="absolute top-7 right-4 z-10">
                <Lock size={11} className="text-gold/40" />
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-y-5 inset-x-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <a href="/demo/luxe.html" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gold/40 text-gold px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-gold/10 transition-colors">
                  <Play size={11} fill="currentColor" />
                  Open Film
                </a>
              </div>
            </div>

            {/* Card body — dark */}
            <div className="bg-wine border border-wine flex flex-col flex-1 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-serif text-xl text-gold-light mb-0.5">Luxe Film</p>
                  <p className="text-xs font-light" style={{ color: 'rgba(250,247,242,0.4)' }}>Cinematic · HD · Password protected</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl text-cream font-light">$35</p>
                  <p className="text-[10px] font-light" style={{ color: 'rgba(250,247,242,0.3)' }}>per film</p>
                </div>
              </div>

              <div className="space-y-2.5 mb-6 flex-1">
                {[
                  { icon: Clock, text: 'Delivered within 12 hours' },
                  { icon: Lock,  text: 'Password protected page' },
                  { icon: Star,  text: 'Full cinematic timeline + letter' },
                  { icon: Play,  text: 'HD experience + custom typography' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm font-light" style={{ color: 'rgba(250,247,242,0.6)' }}>
                    <Icon size={12} className="flex-shrink-0" style={{ color: 'rgba(200,169,126,0.6)' }} strokeWidth={1.5} />
                    {text}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <a href="/demo/luxe.html" target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center border text-xs tracking-widest uppercase py-2.5 transition-colors inline-flex items-center justify-center gap-1.5"
                  style={{ borderColor: 'rgba(250,247,242,0.2)', color: 'rgba(250,247,242,0.75)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <Play size={11} />
                  View Demo
                </a>
                <Link to="/register"
                  className="flex-1 text-center text-xs tracking-widest uppercase py-2.5 transition-colors inline-flex items-center justify-center gap-1.5"
                  style={{ background: 'rgba(200,169,126,0.85)', color: '#2c1a17' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#eddcc4')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(200,169,126,0.85)')}>
                  Create
                  <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Bottom note */}
      <Reveal className="text-center pb-20 px-6">
        <p className="text-sm text-dusty font-light max-w-md mx-auto leading-relaxed">
          Both demos use placeholder content. Your real story will contain the actual names, memories, photos, and emotions you share with us.
        </p>
        <div className="mt-6">
          <Link to="/register"
            className="inline-flex items-center gap-2 bg-wine text-cream px-8 py-3 text-xs tracking-widest uppercase hover:bg-mauve transition-colors">
            <Play size={12} />
            Start Creating
          </Link>
        </div>
      </Reveal>
    </div>
  )
}
