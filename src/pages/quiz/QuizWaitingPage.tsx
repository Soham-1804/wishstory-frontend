import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Copy, Share2, Heart, Clock } from 'lucide-react'
import { quizApi } from '@/lib/quizApi'
import type { QuizSession } from '@/types/quiz'

export default function QuizWaitingPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const completedPartner = searchParams.get('partner') === '2' ? 2 : 1
  const [session, setSession] = useState<QuizSession | null>(null)

  const partnerLink = typeof window !== 'undefined'
    ? `${window.location.origin}/quiz/${id}?partner=2`
    : ''

  // Poll every 5 seconds for partner 2 to complete
  useEffect(() => {
    if (!id) return
    const check = async () => {
      try {
        const s = await quizApi.getSession(id)
        setSession(s)
        if (s.partner1Completed && s.partner2Completed) {
          navigate(`/quiz/${id}/result`, { replace: true })
        }
      } catch {
        // session expired
        navigate('/', { replace: true })
      }
    }
    check()
    const interval = setInterval(check, 5000)
    return () => clearInterval(interval)
  }, [id, navigate])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(partnerLink)
      toast.success('Link copied!')
    } catch {
      toast.error('Could not copy. Please copy manually.')
    }
  }

  const shareWhatsApp = () => {
    const partnerName = session?.partner2Name || 'your partner'
    const myName = session?.partner1Name || 'me'
    const msg = encodeURIComponent(
      `Hey ${partnerName}! I just completed our Compatibility Quiz on WishStory 💕\n\nNow it's your turn — take the quiz so we can see our score together!\n\n${partnerLink}\n\n(Link expires in 48 hours!)`
    )
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  const waitingFor = completedPartner === 1 ? session?.partner2Name : session?.partner1Name

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Animated hearts */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Heart className="w-16 h-16 text-rose-200 fill-rose-200" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {completedPartner === 1 ? "You're done! 🎉" : "Almost there!"}
          </h1>
          <p className="text-gray-500 text-sm">
            Waiting for <span className="font-semibold text-gray-700">{waitingFor || 'your partner'}</span> to complete their quiz.
            Share the link below!
          </p>
        </div>

        {/* Share card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5 mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Partner's quiz link</p>

          {/* Link display */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5 mb-4">
            <span className="text-xs text-gray-600 flex-1 truncate">{partnerLink}</span>
            <button
              onClick={copyLink}
              className="flex-shrink-0 p-1 rounded hover:bg-gray-200 transition"
              title="Copy link"
            >
              <Copy className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Share buttons */}
          <div className="flex gap-3">
            <button
              onClick={shareWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition"
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.138.561 4.145 1.535 5.882L.057 23.6a.5.5 0 00.613.665l5.87-1.54A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.887 9.887 0 01-5.042-1.378l-.362-.215-3.742.981.999-3.645-.236-.373A9.867 9.867 0 012.1 12C2.1 6.525 6.525 2.1 12 2.1S21.9 6.525 21.9 12 17.475 21.9 12 21.9z"/>
              </svg>
              WhatsApp
            </button>

            <button
              onClick={copyLink}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold transition"
            >
              <Share2 className="w-4 h-4" />
              Copy link
            </button>
          </div>
        </div>

        {/* Waiting indicator */}
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>Checking for your partner's response every few seconds…</span>
        </div>

        {/* Expiry notice */}
        {session?.expiresAt && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Link expires {new Date(session.expiresAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        )}
      </motion.div>
    </div>
  )
}
