import {  useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Pen, Play } from 'lucide-react'
import { OCCASIONS, PACKAGE_FEATURES } from '@/lib/utils'

// ── ANIMATION VARIANTS ──
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = { show: { transition: { staggerChildren: 0.12 } } }

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  // Petal animation refs
  const petalColors = ['#e8c5bc','#f5e6e0','#e0b5aa','#f0d0c5','#daa898','#f5e6e0']

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-[5%] pt-28 pb-20">
        {/* Background layers */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(232,197,188,0.45) 0%, transparent 65%), radial-gradient(ellipse 50% 70% at 15% 80%, rgba(200,169,126,0.2) 0%, transparent 60%)'
        }} />

        {/* Floating petals */}
        {petalColors.map((color, i) => (
          <div
            key={i}
            className="absolute rounded-[50%_10%_50%_10%] pointer-events-none opacity-0"
            style={{
              width: `${8 + i * 2}px`, height: `${12 + i * 3}px`,
              background: color,
              left: `${10 + i * 14}%`,
              animation: `floatPetal ${13 + i * 2}s linear ${i * 3}s infinite`,
            }}
          />
        ))}

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-flex items-center gap-3 text-gold text-[11px] tracking-[0.2em] uppercase mb-8"
          >
            <span className="w-8 h-px bg-gold/60" />
            A cinematic gift for someone you love
            <span className="w-8 h-px bg-gold/60" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif font-light text-wine leading-[1.08] mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 6.2rem)' }}
          >
            Turn memories into<br />
            <em className="italic text-mauve">beautiful stories</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-dusty text-lg font-light leading-relaxed max-w-lg mx-auto mb-10"
          >
            Create cinematic surprise pages for birthdays, anniversaries,<br className="hidden md:block" />
            and the people who mean everything to you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/register" className="btn-primary">
              <Pen size={13} />
              Create Your Story
            </Link>
            <a href="#how" className="btn-ghost">
              <Play size={13} />
              How It Works
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent animate-pulse-soft" />
          <span className="text-gold text-[10px] tracking-[0.15em] uppercase">Scroll</span>
        </motion.div>
      </section>

      {/* ── TICKER ── */}
      <div className="bg-wine overflow-hidden py-3">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(2)].map((_, pass) => (
            <div key={pass} className="flex flex-shrink-0">
              {['Birthday Stories','Anniversary Memories','Friendship Tributes','Family Legacies','Wedding Proposals','Memorial Pages','Celebration Films','Love Letters'].map((item) => (
                <span key={item} className="inline-flex items-center gap-6 px-8 text-[11px] tracking-[0.15em] uppercase text-white/40">
                  {item}
                  <span className="w-1 h-1 rounded-full bg-gold/50 flex-shrink-0" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── OCCASIONS ── */}
      <section id="occasions" className="py-28 px-[5%] bg-fog">
        <RevealSection className="text-center mb-14">
          <motion.div variants={fadeUp} className="section-tag justify-center">Occasions</motion.div>
          <motion.h2 variants={fadeUp} className="section-title mt-2">Choose your <em>moment</em></motion.h2>
          <motion.p variants={fadeUp} className="text-dusty text-base font-light mt-3 max-w-md mx-auto">
            Every milestone deserves to be remembered beautifully.
          </motion.p>
        </RevealSection>

        <RevealSection className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {OCCASIONS.map((occ, i) => (
            <motion.div
              key={occ.value}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6 } } }}
              whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(107,61,56,0.12)' }}
              className="bg-cream border border-gold/20 p-6 md:p-8 text-center cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blush/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="text-3xl mb-3 block filter saturate-75">{occ.emoji}</span>
              <p className="font-serif text-lg text-wine mb-1">{occ.label}</p>
              <p className="text-xs text-dusty font-light">
                {occ.value === 'birthday' ? 'A year older, a story richer' :
                 occ.value === 'romantic' ? 'For the one who changed everything' :
                 occ.value === 'friendship' ? 'The bonds that define us' :
                 occ.value === 'family' ? 'Roots, warmth, and belonging' :
                 occ.value === 'celebration' ? 'Milestones worth remembering' :
                 'Forever in our hearts'}
              </p>
            </motion.div>
          ))}
        </RevealSection>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-28 px-[5%] bg-cream">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <RevealSection>
              <motion.div variants={fadeUp} className="section-tag">How it works</motion.div>
              <motion.h2 variants={fadeUp} className="section-title mt-2">
                Crafted with care,<br /><em>just for you</em>
              </motion.h2>
            </RevealSection>

            <div className="mt-10 space-y-8">
              {[
                { n: '01', title: 'Submit your story', text: 'Share memories, upload photos, describe the emotions you want to capture.' },
                { n: '02', title: 'Choose your experience', text: 'Select a storytelling package — from Signature to Luxe Film.' },
                { n: '03', title: 'Our team crafts the story', text: 'Human storytellers design your cinematic page — never automated, always heartfelt.' },
                { n: '04', title: 'Share the surprise', text: 'Receive a private link. Send it to someone you love and watch them be moved.' },
              ].map((step, i) => {
                const ref = useRef<HTMLDivElement>(null)
                const inView = useInView(ref, { once: true, margin: '-60px' })
                return (
                  <motion.div
                    key={step.n}
                    ref={ref}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.12 }}
                    className="flex gap-5"
                  >
                    <span className="font-serif text-4xl font-light text-gold-light leading-none min-w-[3rem] text-right pt-1">{step.n}</span>
                    <div>
                      <p className="font-serif text-xl text-wine mb-1">{step.title}</p>
                      <p className="text-sm text-dusty font-light leading-relaxed">{step.text}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Demo preview */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative bg-[#2c1a17] overflow-hidden shadow-luxury-lg"
              style={{ aspectRatio: '3/4', maxHeight: '520px' }}
            >
              {/* Decorative circles */}
              <div className="absolute -top-20 -right-24 w-96 h-96 rounded-full border border-gold/8" />
              <div className="absolute -bottom-10 -left-16 w-60 h-60 rounded-full border border-gold/6" />

              {/* Photo placeholders */}
              <div className="absolute inset-0">
                <div className="absolute top-[15%] left-[8%] w-[45%] h-[32%] bg-gold/8 rotate-[-2deg]" />
                <div className="absolute top-[20%] left-[47%] w-[40%] h-[25%] bg-gold/6 rotate-[3deg]" />
                <div className="absolute top-[52%] left-[14%] w-[30%] h-[22%] bg-gold/7 rotate-[-1deg]" />
              </div>

              {/* Floating story text */}
              <div className="absolute top-[10%] left-[8%] z-10">
                <p className="font-serif text-[11px] text-gold/50 tracking-[0.2em] uppercase mb-1">A story for</p>
                <p className="font-serif text-4xl font-light text-cream/85 italic">Priya</p>
              </div>

              <div className="absolute top-[48%] left-[8%] right-[8%] z-10 text-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-4" />
                <p className="font-serif text-sm italic text-cream/45 leading-relaxed">
                  "Some memories are too precious<br/>to live only in our minds."
                </p>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e0e0b]/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <div className="inline-flex items-center gap-1.5 bg-gold/20 border border-gold/35 text-gold-light text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  Live preview
                </div>
                <p className="font-serif text-2xl font-light text-cream leading-tight mb-1">A Birthday Story<br/>for Priya</p>
                <p className="text-[11px] text-white/40">Signature Story · Delivered in 24 hrs</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-28 px-[5%] bg-fog">
        <RevealSection className="text-center mb-14">
          <motion.div variants={fadeUp} className="section-tag justify-center">Pricing</motion.div>
          <motion.h2 variants={fadeUp} className="section-title mt-2">One story, <em>infinite meaning</em></motion.h2>
          <motion.p variants={fadeUp} className="text-dusty text-base font-light mt-3 max-w-sm mx-auto">
            Each package is crafted by a human storyteller with love and intention.
          </motion.p>
        </RevealSection>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Signature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="bg-cream border border-gold/20 p-10"
          >
            <p className="font-serif text-2xl text-wine mb-1">Signature Story</p>
            <p className="text-xs text-dusty font-light mb-6">A beautifully curated experience</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-serif text-lg text-mauve">$</span>
              <span className="font-serif text-5xl font-light text-wine">15</span>
            </div>
            <div className="w-full h-px bg-gold/20 mb-6" />
            <ul className="space-y-3 mb-8">
              {PACKAGE_FEATURES.signature.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-mauve font-light">
                  <span className="text-gold mt-0.5 text-xs">—</span>{f}
                </li>
              ))}
            </ul>
            <Link to="/register" className="block w-full text-center btn-ghost py-3 text-xs tracking-widest">
              Create Signature Story
            </Link>
          </motion.div>

          {/* Luxe */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-wine border border-wine p-10 relative"
          >
            <div className="absolute top-0 right-8 bg-gold text-wine text-[10px] tracking-[0.15em] uppercase px-3 py-1">
              Most Popular
            </div>
            <p className="font-serif text-2xl text-gold-light mb-1">Luxe Film</p>
            <p className="text-xs text-white/45 font-light mb-6">A truly cinematic experience</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-serif text-lg text-rose">$</span>
              <span className="font-serif text-5xl font-light text-cream">35</span>
            </div>
            <div className="w-full h-px bg-white/10 mb-6" />
            <ul className="space-y-3 mb-8">
              {PACKAGE_FEATURES.luxe.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white/65 font-light">
                  <span className="text-gold mt-0.5 text-xs">—</span>{f}
                </li>
              ))}
            </ul>
            <Link to="/register" className="block w-full text-center bg-gold text-wine text-xs tracking-widest uppercase py-3 hover:bg-gold-light transition-colors">
              Create Luxe Film
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-28 px-[5%] bg-cream">
        <RevealSection className="mb-12">
          <motion.div variants={fadeUp} className="section-tag">Stories told</motion.div>
          <motion.h2 variants={fadeUp} className="section-title mt-2">What people <em>felt</em></motion.h2>
        </RevealSection>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl">
          {[
            { quote: 'She cried for ten minutes. I\'ve never seen her that moved. WishStory captured something I could never have expressed myself.', author: 'Arjun Reddy', occasion: 'Anniversary · Luxe Film', initials: 'AR' },
            { quote: 'I gifted this to my mother on her 60th birthday. She called it the most beautiful thing anyone has ever done for her.', author: 'Shreya Kapoor', occasion: 'Birthday · Signature Story', initials: 'SK' },
            { quote: 'We used WishStory for our friend\'s farewell. She watched it three times. Some stories deserve to be seen, not just told.', author: 'Meera Joshi', occasion: 'Friendship · Luxe Film', initials: 'MJ' },
          ].map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="bg-fog border border-gold/15 p-7 hover:-translate-y-1 transition-transform duration-300"
            >
              <span className="font-serif text-5xl text-gold-light leading-none block mb-2">"</span>
              <p className="font-serif text-base italic text-wine font-light leading-relaxed mb-6">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose flex items-center justify-center text-wine text-xs font-medium flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs font-medium text-mauve">{t.author}</p>
                  <p className="text-[11px] text-dusty font-light">{t.occasion}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" className="relative py-32 px-[5%] bg-wine text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(200,169,126,0.12) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="section-tag justify-center" style={{ color: 'rgba(200,169,126,0.7)' }}>
            <span style={{ background: 'rgba(200,169,126,0.5)', display: 'block', width: '24px', height: '1px' }} />
            Begin your story
          </div>
          <h2 className="font-serif font-light text-cream leading-tight mt-3 mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
            Some love deserves<br /><em className="italic text-gold-light">to be immortal</em>
          </h2>
          <p className="text-white/45 font-light mb-10 text-base">
            Create a cinematic story that the people you love will treasure forever.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="bg-gold text-wine px-8 py-3.5 text-xs tracking-widest uppercase hover:bg-gold-light transition-colors inline-flex items-center gap-2">
              <Pen size={13} /> Create Your Story
            </Link>
            <a href="#pricing" className="border border-white/25 text-cream px-8 py-3.5 text-xs tracking-widest uppercase hover:bg-white/8 transition-colors">
              View Packages
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes floatPetal {
          0%   { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          5%   { opacity: 0.5; }
          95%  { opacity: 0.3; }
          100% { transform: translateY(-10vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
