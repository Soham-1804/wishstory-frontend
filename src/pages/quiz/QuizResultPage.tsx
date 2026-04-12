import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Heart, Download, Share2, RefreshCw } from 'lucide-react'
import { quizApi } from '@/lib/quizApi'
import { SCORE_TIERS, CATEGORY_LABELS } from '@/types/quiz'
import type { QuizResult, QuestionCategory } from '@/types/quiz'

const CATEGORY_ORDER: QuestionCategory[] = [
  'loveLanguage', 'lifestyle', 'futureGoals', 'dailyHabits', 'personality'
]

const CATEGORY_COLORS: Record<QuestionCategory, string> = {
  loveLanguage: 'bg-rose-400',
  lifestyle:    'bg-amber-400',
  futureGoals:  'bg-purple-400',
  dailyHabits:  'bg-teal-400',
  personality:  'bg-blue-400',
}

function ScoreGauge({ score }: { score: number }) {
  const tier = SCORE_TIERS.find(t => score >= t.min) ?? SCORE_TIERS[SCORE_TIERS.length - 1]
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="10" />
          {/* Progress */}
          <motion.circle
            cx="60" cy="60" r="50"
            fill="none"
            stroke={tier.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50}`}
            animate={{ strokeDashoffset: `${2 * Math.PI * 50 * (1 - score / 100)}` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center mt-2"
      >
        <p className="text-xl font-bold" style={{ color: tier.color }}>{tier.emoji} {tier.label}</p>
      </motion.div>
    </div>
  )
}

export default function QuizResultPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) return
    quizApi.getResult(id).then(r => {
      setResult(r)
      setLoading(false)
    }).catch(err => {
      const msg = err?.response?.data?.error
      if (msg?.includes('Both partners')) {
        navigate(`/quiz/${id}/waiting`, { replace: true })
      } else {
        toast.error('Could not load result.')
        navigate('/', { replace: true })
      }
    })
  }, [id, navigate])

  const shareResult = async () => {
    if (!result) return
    const text = `${result.partner1Name} & ${result.partner2Name} scored ${result.score}% on the WishStory Compatibility Quiz — "${result.scoreLabel}"! 💕\n\nTry it at wishstory.in/quiz`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Our Compatibility Score!', text, url: `${window.location.origin}/quiz` })
      } else {
        await navigator.clipboard.writeText(text)
        toast.success('Result copied to clipboard!')
      }
    } catch { /* user cancelled */ }
  }

  const tryAgain = () => navigate('/quiz')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-50">
        <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!result) return null

  const tier = SCORE_TIERS.find(t => result.score >= t.min) ?? SCORE_TIERS[SCORE_TIERS.length - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex flex-col items-center px-4 py-12">

      {/* Shareable Card (also shown as the result UI) */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Name header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            Compatibility Result
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {result.partner1Name} <span className="text-rose-400">♥</span> {result.partner2Name}
          </h1>
        </div>

        {/* Score gauge card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 mb-4 flex flex-col items-center">
          <ScoreGauge score={result.score} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-gray-500 text-sm text-center mt-4 leading-relaxed"
          >
            {tier.description}
          </motion.p>
        </div>

        {/* Category breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-md p-5 mb-4"
        >
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Category breakdown</h2>
          <div className="space-y-3">
            {CATEGORY_ORDER.map((cat, i) => {
              const score = result.categoryScores?.[cat] ?? 0
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{CATEGORY_LABELS[cat]}</span>
                    <span className="font-semibold text-gray-700">{score}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${CATEGORY_COLORS[cat]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.8, delay: 0.7 + i * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* WishStory branding watermark */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span className="text-xs text-gray-400">Made with WishStory · wishstory.in</span>
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex gap-3"
        >
          <button
            onClick={shareResult}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition"
          >
            <Share2 className="w-4 h-4" />
            Share result
          </button>
          <button
            onClick={tryAgain}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold transition"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </motion.div>

        {/* Explore more */}
        <div className="mt-6 bg-rose-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Want to create a beautiful memory page for your relationship?
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-500 hover:text-rose-600 transition"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            Explore WishStory
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
