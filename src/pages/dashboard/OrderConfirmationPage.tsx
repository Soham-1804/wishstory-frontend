import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Sparkles } from 'lucide-react'

export default function OrderConfirmationPage() {
  const { id } = useParams()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Confetti-like petal animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const petals: { x: number; y: number; vx: number; vy: number; size: number; color: string; rotation: number; vr: number }[] = []
    const colors = ['#e8c5bc','#f5e6e0','#c8a97e','#daa898','#eddcc4']

    for (let i = 0; i < 60; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 80,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 1.5 + Math.random() * 2,
        size: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.08,
      })
    }

    let frame: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      petals.forEach(p => {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.8
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
        p.x += p.vx; p.y += p.vy; p.rotation += p.vr
        if (p.y > canvas.height + 20) p.y = -20; p.x = Math.random() * canvas.width
      })
      frame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center max-w-md mx-auto bg-cream/90 backdrop-blur-sm border border-gold/25 p-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 14 }}
          className="w-16 h-16 bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 size={28} className="text-emerald-600" strokeWidth={1.5} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="inline-flex items-center gap-2 text-gold text-[10px] tracking-[0.2em] uppercase mb-4">
            <Sparkles size={11} />
            Payment Confirmed
          </div>
          <h1 className="font-serif text-3xl font-light text-wine mb-3">
            Your story request<br />has been received.
          </h1>
          <p className="text-dusty font-light text-sm leading-relaxed mb-2">
            Our team is now crafting something beautiful for you.
          </p>
          <p className="text-dusty/60 text-xs font-light mb-8">
            You'll receive an email when your story is ready. Order ID: {id?.slice(-8).toUpperCase()}
          </p>

          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="block w-full text-center bg-wine text-cream px-6 py-3 text-xs tracking-widest uppercase hover:bg-mauve transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/dashboard/stories"
              className="block w-full text-center border border-wine/25 text-wine px-6 py-3 text-xs tracking-widest uppercase hover:bg-blush transition-colors"
            >
              View My Stories
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
