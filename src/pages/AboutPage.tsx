import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Pen, Heart, ArrowRight } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = { show: { transition: { staggerChildren: 0.12 } } }

function Reveal({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  )
}

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

function ChapterDivider({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }} className="flex items-center gap-5 my-14">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/30" />
      <span className="text-gold/50 text-[10px] tracking-[0.3em] uppercase font-light flex-shrink-0">{label}</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/30" />
    </motion.div>
  )
}

function ValueCard({ emoji, title, desc, delay }: { emoji: string; title: string; desc: string; delay: number }) {
  return (
    <Reveal delay={delay}>
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }}
        className="bg-cream border border-gold/20 p-6 h-full group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blush/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="text-2xl mb-4 block">{emoji}</span>
        <p className="font-serif text-lg text-wine mb-2 leading-tight">{title}</p>
        <p className="text-sm text-dusty font-light leading-relaxed">{desc}</p>
      </motion.div>
    </Reveal>
  )
}

export default function AboutPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroY       = useTransform(scrollY, [0, 500], [0, 80])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.35])

  return (
    <div className="bg-cream overflow-x-hidden">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <div className="absolute inset-0" style={{
            background:
              'radial-gradient(ellipse 70% 60% at 30% 40%, rgba(107,61,56,0.55) 0%, rgba(44,26,23,0.95) 65%), ' +
              'radial-gradient(ellipse 50% 80% at 80% 20%, rgba(200,169,126,0.08) 0%, transparent 50%)',
          }} />
        </motion.div>

        <div className="absolute top-1/2 right-[4%] -translate-y-1/2 font-serif font-light leading-none select-none pointer-events-none"
          style={{ fontSize: 'clamp(14rem, 22vw, 26rem)', color: 'rgba(200,169,126,0.04)' }}>
          W
        </div>

        {['#e8c5bc','#f5e6e0','#c8a97e','#e0b5aa','#eddcc4'].map((color, i) => (
          <div key={i} className="absolute rounded-[50%_10%_50%_10%] pointer-events-none opacity-0"
            style={{ width: `${6+i*2}px`, height: `${10+i*3}px`, background: color,
              left: `${8+i*18}%`, animation: `floatPetal ${14+i*2.5}s linear ${i*2.5}s infinite` }} />
        ))}

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 w-full px-8 md:px-16 lg:px-24 pb-24 pt-36">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }} className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-gold/50" />
            <span className="text-gold/70 text-[10px] tracking-[0.25em] uppercase">Our Story</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif font-light text-cream leading-[1.08] mb-6 max-w-3xl"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}>
            Built from distance.<br />
            <em className="italic text-gold-light">Born from love.</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-white/45 text-lg font-light leading-relaxed font-serif italic max-w-xl">
            "Because some people deserve more than a message. They deserve a moment."
          </motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-10 bg-gradient-to-b from-gold/40 to-transparent animate-pulse" />
          <span className="text-gold/40 text-[9px] tracking-[0.2em] uppercase">Scroll</span>
        </motion.div>
      </section>

      {/* ── ORIGIN STORY ── */}
      <section className="py-24 bg-cream">
        {/*
          KEY FIX: no max-w on the section itself.
          One centered column with max-w-2xl and horizontal padding only.
          This prevents the double-constraint that was crushing the text.
        */}
        <div className="max-w-2xl mx-auto px-6">
          <ChapterDivider label="How it began" />

          <RevealSection>
            <motion.div variants={fadeUp} className="mb-8">
              <div className="inline-flex items-center gap-2 text-gold text-[10px] tracking-[0.2em] uppercase mb-4">
                <span className="w-5 h-px bg-gold/60" />
                The Founder
              </div>
              <h2 className="font-serif font-light text-wine leading-tight"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
                Sohamgiri Gosai<br />
                <em className="italic text-mauve text-[0.6em]">Founder, WishStory</em>
              </h2>
            </motion.div>

            <motion.p variants={fadeUp}
              className="font-serif text-xl font-light text-ink/75 leading-relaxed italic mb-10">
              "There was someone I wanted to make feel loved. Valued. Worthy. Seen. The kind of feeling that doesn't fit inside a text message."
            </motion.p>
          </RevealSection>

          <div className="space-y-6">
            <Reveal>
              <p className="text-base text-mauve font-light leading-[1.9]">
                Sohamgiri was far away from someone who meant a great deal to him. That distance wasn't just physical — it was the gap between what he felt and what he could express. He wanted that person to feel something real. Not just read words, but <em className="italic text-wine">experience</em> them.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="text-base text-mauve font-light leading-[1.9]">
                Gifts feel good. Everyone knows that. But there is something different about something made — something built specifically for one person, with their name woven into every pixel, their story told in a way only they would understand. Especially when you can't be there in person to hand it to them.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-base text-mauve font-light leading-[1.9]">
                So he started building. A digital experience. A website that didn't feel like a website — it felt like a story. Cinematic, warm, personal. Something you open and feel before you read. Something that says: <em className="italic text-wine">I made this. For you. Because you matter to me.</em>
              </p>
            </Reveal>

            {/* Pull quote */}
            <Reveal delay={0.08}>
              <div className="my-10 pl-5 border-l-2 border-gold/40 py-1">
                <p className="font-serif text-xl md:text-2xl italic font-light text-wine leading-relaxed">
                  "While making it, something hit me. If I'm going through this — wanting to reach someone across distance, wanting to make them feel truly seen — there must be thousands of people feeling exactly the same thing."
                </p>
                <p className="text-[11px] text-gold/60 tracking-widest uppercase mt-4 font-light">
                  — Sohamgiri Gosai
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="text-base text-mauve font-light leading-[1.9]">
                That realisation changed everything. What began as something deeply personal became a platform for everyone who has ever wanted to make someone feel extraordinary — not with money, not with flowers that wilt, but with something crafted, something cinematic, something that says more than any off-the-shelf gift ever could.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="text-base text-mauve font-light leading-[1.9]">
                WishStory was born — not from a boardroom, not from a business plan — but from a simple, human need. To close the distance. To make someone feel loved even from far away. To turn a feeling into something they can see, hear, and keep.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-24 px-6 bg-wine relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(200,169,126,0.1) 0%, transparent 65%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-gold/60 text-[10px] tracking-[0.25em] uppercase mb-6">
              <span className="w-5 h-px bg-gold/40" />Our Mission<span className="w-5 h-px bg-gold/40" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif font-light text-cream leading-tight mb-8"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}>
              To make every person feel like<br />
              <em className="italic text-gold-light">the most special one in the room</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/45 font-light text-base leading-relaxed max-w-xl mx-auto">
              WishStory exists for everyone who has ever wanted to reach across distance, across silence, across the ordinary — and hand someone something extraordinary. Something that says: I see you. I made this for you. You are worth this.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 px-6 md:px-10 bg-fog">
        <div className="max-w-5xl mx-auto">
          <RevealSection className="text-center mb-12">
            <motion.div variants={fadeUp} className="section-tag justify-center">What we believe</motion.div>
            <motion.h2 variants={fadeUp} className="section-title mt-2">
              The values behind<br /><em>every story we tell</em>
            </motion.h2>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ValueCard emoji="💌" title="Distance is just distance" delay={0}
              desc="Being far from someone doesn't mean you can't make them feel close. The most powerful things are often felt from thousands of kilometres away." />
            <ValueCard emoji="✍️" title="Human hands, always" delay={0.06}
              desc="Every story on WishStory is crafted by a real person. No AI, no templates. A human reads your memories and builds something from them." />
            <ValueCard emoji="🎬" title="Emotion is the product" delay={0.12}
              desc="We don't sell websites. We sell the feeling someone gets when they open their story. That feeling — of being seen, valued, remembered — is everything." />
            <ValueCard emoji="🌸" title="Personalization is respect" delay={0.06}
              desc="Generic gifts say 'I remembered you'. A WishStory says 'I thought about you, I wrote about you, I built this for you specifically.'" />
            <ValueCard emoji="🕯️" title="Every moment matters" delay={0.12}
              desc="Birthdays, anniversaries, farewells, proposals, memorials — every milestone deserves something more than a notification." />
            <ValueCard emoji="♾️" title="Stories outlast everything" delay={0.18}
              desc="Flowers wilt. Gifts get lost. A story — beautifully told, privately kept — can be revisited for years. That's what we build." />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6 bg-cream border-y border-gold/15">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { number: '100%', label: 'Human crafted'    },
            { number: '∞',    label: 'Love put in'      },
            { number: '1',    label: 'Person at a time' },
          ].map(({ number, label }, i) => (
            <Reveal key={label} delay={i * 0.1}>
              <p className="font-serif text-4xl md:text-5xl font-light text-wine mb-2">{number}</p>
              <p className="text-xs text-dusty tracking-widest uppercase font-light">{label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PERSONAL LETTER ── */}
      <section className="py-24 bg-cream">
        {/* Same single-column pattern — max-w-2xl, px-6 only */}
        <div className="max-w-2xl mx-auto px-6">
          <ChapterDivider label="A personal note" />

          <Reveal className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-rose/60 flex items-center justify-center mx-auto mb-4 border border-gold/25">
              <span className="font-serif text-xl text-wine font-light">SG</span>
            </div>
            <p className="font-serif text-lg text-wine">Sohamgiri Gosai</p>
            <p className="text-[11px] text-gold/60 tracking-widest uppercase font-light mt-1">
              Founder &amp; Creator, WishStory
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            {/* Letter — full width of the column, no inner padding fighting it */}
            <div className="bg-fog border border-gold/20 p-8 relative">
              <span className="absolute -top-5 left-6 font-serif text-7xl leading-none select-none text-gold/15"
                aria-hidden="true">"</span>

              <div className="space-y-5 pt-2">
                <p className="font-serif text-lg font-light text-wine/80 leading-[1.85] italic">
                  I started WishStory because of one person. You probably have someone like that in your life too — someone you want to reach, to move, to remind of how much they mean to you.
                </p>
                <p className="font-serif text-lg font-light text-wine/80 leading-[1.85] italic">
                  I couldn't be there in person. So I built something instead. And when I saw what it did — the feeling it created — I knew this wasn't just for me.
                </p>
                <p className="font-serif text-lg font-light text-wine/80 leading-[1.85] italic">
                  This is for everyone who has something to say and doesn't know how to say it beautifully. WishStory says it for you.
                </p>
                <p className="font-serif text-lg font-light text-wine/80 leading-[1.85] italic">
                  With love — from one person who missed someone, to the world.
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-gold/15 flex items-center gap-2.5">
                <Heart size={13} className="text-gold/55" strokeWidth={1.5} />
                <span className="font-serif text-sm text-mauve font-light italic">
                  Sohamgiri Gosai, Founder — WishStory
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 px-6 bg-fog">
        <div className="max-w-xl mx-auto text-center">
          <Reveal>
            <div className="section-tag justify-center mb-3">The team</div>
            <h2 className="section-title mb-5">Small team.<br /><em>Enormous care.</em></h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-sm text-dusty font-light leading-relaxed">
              WishStory is built and run by a small, passionate team of storytellers, designers, and writers who believe the best digital experiences feel like being held — warm, personal, and made just for you. Every story that goes out carries a piece of us in it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6 bg-wine relative overflow-hidden text-center">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(200,169,126,0.1) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-xl mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-gold/60 text-[10px] tracking-[0.25em] uppercase mb-5">
              <span className="w-5 h-px bg-gold/40" />Your turn<span className="w-5 h-px bg-gold/40" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif font-light text-cream leading-tight mb-4"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              Is there someone you want<br />
              <em className="italic text-gold-light">to make feel extraordinary?</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/40 text-sm font-light mb-10 leading-relaxed">
              You don't need to be a writer. You don't need to be nearby.<br />
              You just need to care. We'll do the rest.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register"
                className="inline-flex items-center gap-2 bg-gold text-wine px-8 py-3.5 text-xs tracking-widest uppercase hover:bg-gold-light transition-colors">
                <Pen size={13} />Create Their Story
              </Link>
              <Link to="/"
                className="inline-flex items-center gap-2 border border-white/20 text-cream px-8 py-3.5 text-xs tracking-widest uppercase hover:bg-white/5 transition-colors">
                See How It Works<ArrowRight size={13} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        @keyframes floatPetal {
          0%   { transform: translateY(110vh) rotate(0deg);   opacity: 0; }
          5%   { opacity: 0.45; }
          95%  { opacity: 0.25; }
          100% { transform: translateY(-10vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
