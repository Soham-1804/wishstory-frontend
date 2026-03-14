import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

interface Section {
  heading: string
  body: React.ReactNode
}

interface LegalLayoutProps {
  tag: string
  title: string
  subtitle: string
  lastUpdated: string
  sections: Section[]
}

export default function LegalLayout({ tag, title, subtitle, lastUpdated, sections }: LegalLayoutProps) {
  // Always scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen bg-cream">

      {/* ── HERO BAND ── */}
      <div className="relative bg-wine overflow-hidden pt-32 pb-16 px-[5%]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(200,169,126,0.1) 0%, transparent 65%)' }}
        />
        <div className="relative z-10 max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/40 text-xs tracking-widest uppercase hover:text-white/70 transition-colors mb-8"
          >
            <ArrowLeft size={12} /> Back to WishStory
          </Link>
          <div className="inline-flex items-center gap-2 text-gold/70 text-[10px] tracking-[0.2em] uppercase mb-4">
            <span className="w-5 h-px bg-gold/50" />
            {tag}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-cream leading-tight mb-3">{title}</h1>
          <p className="text-white/40 text-sm font-light">{subtitle}</p>
        </div>
      </div>

      {/* ── META BAR ── */}
      <div className="bg-fog border-b border-gold/15 px-[5%] py-3">
        <p className="text-xs text-dusty font-light max-w-3xl">
          Last updated: <span className="text-mauve">{lastUpdated}</span>
          <span className="mx-3 text-gold/30">·</span>
          Effective immediately upon publication
          <span className="mx-3 text-gold/30">·</span>
          wishstory.in
        </p>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-3xl mx-auto px-[5%] py-16">
        <div className="space-y-12">
          {sections.map((section, i) => (
            <motion.div
              key={section.heading}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="font-serif text-2xl text-gold/40 font-light leading-none select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="font-serif text-xl text-wine font-light">{section.heading}</h2>
              </div>
              <div className="pl-11 text-sm text-mauve font-light leading-[1.85] space-y-3">
                {section.body}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── FOOTER NAV ── */}
        <div className="mt-20 pt-10 border-t border-gold/20 flex flex-wrap gap-4 text-xs text-dusty font-light">
          <span className="text-gold/50">Also read:</span>
          {[
            ['Privacy Policy', '/privacy'],
            ['Terms of Service', '/terms'],
            ['Refund Policy', '/refund'],
            ['Contact', '/contact'],
          ].map(([label, href]) => (
            <Link key={label} to={href} className="hover:text-wine transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
