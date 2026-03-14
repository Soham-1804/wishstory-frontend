import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Volume2, VolumeX, Lock, Play, ChevronDown } from 'lucide-react'
import api from '@/lib/api'
import type { Story } from '@/types'
import { OCCASIONS, THEMES } from '@/lib/utils'

// ── PASSWORD GATE ──
function PasswordGate({ onUnlock }: { onUnlock: (pw: string) => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')

  const handle = async () => {
    if (!pw.trim()) return
    try {
      await api.post('/stories/unlock', { password: pw })
      onUnlock(pw)
    } catch {
      setError('Incorrect password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#1a0a08] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-sm w-full"
      >
        <div className="w-12 h-12 border border-gold/30 flex items-center justify-center mx-auto mb-6">
          <Lock size={18} className="text-gold/70" />
        </div>
        <p className="font-serif text-2xl text-cream font-light mb-2">Private Story</p>
        <p className="text-xs text-white/40 mb-8 font-light">This story is password protected.</p>
        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handle()}
          placeholder="Enter password"
          className="w-full bg-white/5 border border-white/10 text-cream text-center py-3 px-4 text-sm mb-3 outline-none focus:border-gold/40 placeholder:text-white/20"
        />
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        <button
          onClick={handle}
          className="w-full bg-gold text-ink py-2.5 text-xs tracking-widest uppercase hover:bg-gold-light transition-colors"
        >
          Unlock Story
        </button>
      </motion.div>
    </div>
  )
}

// ── CHAPTER DIVIDER ──
function ChapterDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-16">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/30" />
      <p className="text-gold/60 text-[10px] tracking-[0.3em] uppercase">{label}</p>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/30" />
    </div>
  )
}

// ── MAIN STORY PAGE ──
export default function StoryPage() {
  const { id } = useParams<{ id: string }>()
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsPassword, setNeedsPassword] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0])
  const heroY = useTransform(scrollY, [0, 600], [0, 120])

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/stories/view/${id}`)
        setStory(data.story)
        if (data.story.passwordProtected) setNeedsPassword(true)
      } catch {
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleUnlock = async (pw: string) => {
    try {
      const { data } = await api.post(`/stories/view/${id}`, { password: pw })
      setStory(data.story)
      setUnlocked(true)
      setNeedsPassword(false)
    } catch {/* wrong pw handled in gate */}
  }

  const startStory = () => {
    setStarted(true)
    if (audioRef.current) audioRef.current.play().catch(() => {})
  }

  const toggleMute = () => {
    setMuted(m => !m)
    if (audioRef.current) audioRef.current.muted = !muted
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a0a08] flex items-center justify-center">
        <div className="w-px h-20 bg-gradient-to-b from-gold to-transparent animate-pulse-soft" />
      </div>
    )
  }

  if (needsPassword && !unlocked) return <PasswordGate onUnlock={handleUnlock} />

  if (!story) {
    return (
      <div className="min-h-screen bg-[#1a0a08] flex items-center justify-center text-white/40 font-serif text-xl font-light">
        This story doesn't exist or hasn't been published yet.
      </div>
    )
  }

  const occasion = OCCASIONS.find(o => o.value === story.occasion)
  const theme = THEMES.find(t => t.value === story.theme)

  // Pre-entry splash
  if (!started) {
    return (
      <div className="min-h-screen bg-[#1a0a08] flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 40%, rgba(200,169,126,0.07) 0%, transparent 65%)' }} />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="text-center max-w-lg relative z-10">
          <p className="text-[10px] tracking-[0.3em] text-gold/50 uppercase mb-4">{occasion?.emoji} {occasion?.label}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-cream leading-tight mb-3">
            A Story for<br /><em className="italic text-gold-light">{story.recipientName}</em>
          </h1>
          <div className="w-px h-10 bg-gradient-to-b from-gold/40 to-transparent mx-auto my-6" />
          <p className="text-white/35 text-sm font-light italic font-serif mb-10">
            A cinematic memory, crafted with love.
          </p>
          <motion.button
            onClick={startStory}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 border border-gold/40 text-gold px-8 py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-gold/8 transition-all duration-300"
          >
            <Play size={13} fill="currentColor" />
            Begin the Story
          </motion.button>
          <p className="text-white/20 text-[10px] mt-4 font-light">Best experienced with sound on</p>
        </motion.div>
      </div>
    )
  }

  // ── THE CINEMATIC STORY ──
  return (
    <div className="bg-[#0f0705] text-cream overflow-x-hidden">

      {/* Background audio */}
      {story.musicChoice && story.musicChoice !== 'none' && (
        <audio ref={audioRef} loop>
          <source src={`/audio/${story.musicChoice}.mp3`} />
        </audio>
      )}

      {/* Floating controls */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="w-8 h-8 bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/50 hover:text-white/80 transition-colors"
        >
          {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
      </div>

      {/* ── HERO ── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity }}
        className="relative min-h-screen flex items-end overflow-hidden"
      >
        {/* Background — first photo or gradient */}
        {story.uploadedPhotos?.[0] ? (
          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0 scale-110"
          >
            <img src={story.uploadedPhotos[0]} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#0f0705]/55" />
          </motion.div>
        ) : (
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(107,61,56,0.6) 0%, rgba(15,7,5,0.95) 70%)'
          }} />
        )}
        <div className="absolute inset-0 cinematic-overlay" />

        <div className="relative z-10 px-[6%] md:px-[10%] pb-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] tracking-[0.3em] text-gold/60 uppercase mb-4">{occasion?.emoji} {occasion?.label}</p>
            <h1 className="font-serif font-light leading-[1.05] mb-6 story-hero-text" style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}>
              For<br /><em className="italic text-gold-light">{story.recipientName}</em>
            </h1>
            <p className="font-serif italic text-white/45 font-light text-lg leading-relaxed max-w-md">
              {theme?.desc && `A ${theme.desc.toLowerCase()} story, written with love.`}
            </p>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
        >
          <ChevronDown size={20} className="text-gold" />
        </motion.div>
      </motion.section>

      {/* ── CONTENT ── */}
      <div className="px-[6%] md:px-[14%] lg:px-[20%] py-24 max-w-4xl mx-auto">

        {/* Chapter 1 — The Letter */}
        <ChapterDivider label="A Letter" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1 }}
          className="mb-20"
        >
          <p className="font-serif text-xl md:text-2xl font-light text-cream/85 leading-[1.75] tracking-wide italic">
            {story.storyDetails}
          </p>
        </motion.div>

        {/* Chapter 2 — Photo Gallery */}
        {story.uploadedPhotos && story.uploadedPhotos.length > 0 && (
          <>
            <ChapterDivider label="Memories" />
            <div className="space-y-6 mb-20">
              {story.uploadedPhotos.map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.9, delay: i % 2 * 0.1 }}
                  className={`${i % 3 === 1 ? 'md:mx-8' : i % 3 === 2 ? 'md:-mx-4' : ''}`}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full object-cover"
                    style={{ maxHeight: i === 0 ? '70vh' : i % 2 === 0 ? '50vh' : '60vh' }}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Chapter 3 — Closing */}
        <ChapterDivider label="With Love" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center py-16"
        >
          <div className="w-px h-16 bg-gradient-to-b from-gold/50 to-transparent mx-auto mb-10" />
          <p className="font-serif text-3xl md:text-4xl font-light text-cream/80 leading-tight mb-6">
            Happy <span className="italic text-gold-light capitalize">{story.occasion}</span>,<br />
            <em className="italic">{story.recipientName}</em>
          </p>
          <p className="text-white/30 text-xs tracking-[0.25em] uppercase font-light mb-12">
            Crafted with love by WishStory
          </p>

          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-gold/25" />
            <span className="font-serif text-gold/40 text-sm">wishstory.in</span>
            <div className="w-12 h-px bg-gold/25" />
          </div>
        </motion.div>

      </div>

      {/* Footer */}
      <div className="bg-[#0a0402] px-[5%] py-8 text-center">
        <p className="text-white/15 text-xs font-light">
          This story was created with WishStory · wishstory.in
        </p>
      </div>
    </div>
  )
}
