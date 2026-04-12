import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Heart, ChevronLeft, Check } from 'lucide-react'
import { quizApi } from '@/lib/quizApi'
import { QUESTION_MAP } from '@/lib/quizData'
import { CATEGORY_LABELS } from '@/types/quiz'
import type { QuizSession, Answer, Question } from '@/types/quiz'

const CATEGORY_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  loveLanguage: { bg: 'bg-rose-50',   text: 'text-rose-600',   bar: 'bg-rose-400' },
  lifestyle:    { bg: 'bg-amber-50',  text: 'text-amber-600',  bar: 'bg-amber-400' },
  futureGoals:  { bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-400' },
  dailyHabits:  { bg: 'bg-teal-50',   text: 'text-teal-600',   bar: 'bg-teal-400' },
  personality:  { bg: 'bg-blue-50',   text: 'text-blue-600',   bar: 'bg-blue-400' },
}

const ADVANCE_DELAY = 420 // ms flash before sliding to next question

export default function QuizPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const partnerParam = searchParams.get('partner')
  const partner = partnerParam === '2' ? 2 : 1

  const [session, setSession]     = useState<QuizSession | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent]     = useState(0)
  const [answers, setAnswers]     = useState<Record<string, string | number>>({})
  const [flash, setFlash]         = useState<string | number | null>(null)
  const [direction, setDirection] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading]     = useState(true)
  const [sliderVal, setSliderVal] = useState(3)
  const sliderTimer               = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!id) return
    quizApi.getSession(id).then(s => {
      if (partner === 1 && s.partner1Completed) { navigate(`/quiz/${id}/waiting`, { replace: true }); return }
      if (partner === 2 && s.partner2Completed) {
        navigate(s.partner1Completed ? `/quiz/${id}/result` : `/quiz/${id}/waiting`, { replace: true }); return
      }
      setSession(s)
      const qs = s.questionIds.map(qid => QUESTION_MAP[qid]).filter(Boolean)
      setQuestions(qs)
      setLoading(false)
    }).catch(() => {
      toast.error('Quiz not found or has expired.')
      navigate('/', { replace: true })
    })
  }, [id, partner, navigate])

  // Sync slider when navigating between questions
  useEffect(() => {
    const q = questions[current]
    if (q?.type === 'slider') setSliderVal((answers[q.id] as number) ?? 3)
  }, [current, questions]) // eslint-disable-line

  const advance = useCallback((fromIndex: number) => {
    setDirection(1)
    setFlash(null)
    setCurrent(fromIndex + 1)
  }, [])

  const handleChoice = useCallback((value: string, questionIndex: number, questionId: string) => {
    setFlash(value)
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    const isLast = questionIndex === questions.length - 1
    if (!isLast) setTimeout(() => advance(questionIndex), ADVANCE_DELAY)
  }, [questions.length, advance])

  const handleSliderChange = useCallback((value: number, questionId: string) => {
    setSliderVal(value)
    if (sliderTimer.current) clearTimeout(sliderTimer.current)
    sliderTimer.current = setTimeout(() => {
      setAnswers(prev => ({ ...prev, [questionId]: value }))
    }, 150)
  }, [])

  const goPrev = () => {
    if (current === 0) return
    setDirection(-1)
    setFlash(null)
    setCurrent(c => c - 1)
  }

  const handleSubmit = async () => {
    if (!id || !session) return
    const finalAnswers = { ...answers }
    const q = questions[current]
    if (q?.type === 'slider') finalAnswers[q.id] = sliderVal

    const formatted: Answer[] = questions.map(q => ({
      questionId: q.id,
      value: finalAnswers[q.id] ?? (q.type === 'slider' ? 3 : ''),
    }))

    setSubmitting(true)
    try {
      const { bothCompleted } = await quizApi.submit(id, partner, formatted)
      navigate(bothCompleted ? `/quiz/${id}/result` : `/quiz/${id}/waiting?partner=${partner}`, { replace: true })
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Submit failed. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-50">
        <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const currentQ: Question = questions[current]
  const colors = CATEGORY_COLORS[currentQ?.category] ?? CATEGORY_COLORS.loveLanguage
  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0
  const partnerName = partner === 1 ? session?.partner1Name : session?.partner2Name
  const isLast = current === questions.length - 1
  const lastAnswered = isLast && answers[currentQ?.id] !== undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex flex-col">

      {/* Top bar */}
      <header className="flex items-center justify-between px-4 pt-5 pb-2 max-w-xl mx-auto w-full">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="p-2 rounded-full hover:bg-white/70 transition disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span className="text-sm font-semibold text-gray-700">{partnerName}</span>
        </div>

        <span className="text-sm text-gray-400 tabular-nums w-12 text-right">
          {current + 1} / {questions.length}
        </span>
      </header>

      {/* Progress bar */}
      <div className="px-4 max-w-xl mx-auto w-full mb-1">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${colors.bar}`}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full px-4 py-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQ?.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 56 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -56 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            {/* Category pill */}
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-5 ${colors.bg} ${colors.text}`}>
              {CATEGORY_LABELS[currentQ?.category]}
            </span>

            {/* Question */}
            <h2 className="text-xl font-bold text-gray-900 mb-7 leading-snug">
              {currentQ?.question}
            </h2>

            {/* Choice options — tap to select + auto-advance */}
            {currentQ?.type === 'choice' && currentQ.options && (
              <div className="space-y-3">
                {currentQ.options.map(opt => {
                  const isSelected = answers[currentQ.id] === opt.value || flash === opt.value
                  return (
                    <motion.button
                      key={opt.value}
                      onClick={() => handleChoice(opt.value, current, currentQ.id)}
                      whileTap={{ scale: 0.97 }}
                      className={`
                        w-full text-left px-4 py-4 rounded-2xl border-2 text-sm font-medium
                        flex items-center gap-3 transition-all duration-150
                        ${isSelected
                          ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-sm'
                          : 'border-gray-100 bg-white text-gray-700 active:border-rose-200 active:bg-rose-50/40'
                        }
                      `}
                    >
                      <span className={`
                        flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                        transition-all duration-150
                        ${isSelected ? 'border-rose-400 bg-rose-400' : 'border-gray-300 bg-white'}
                      `}>
                        {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </span>
                      {opt.label}
                    </motion.button>
                  )
                })}
              </div>
            )}

            {/* Slider — tap a number or drag */}
            {currentQ?.type === 'slider' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex justify-between text-xs text-gray-400 mb-5">
                  <span className="max-w-[40%] text-left">{currentQ.leftLabel}</span>
                  <span className="max-w-[40%] text-right">{currentQ.rightLabel}</span>
                </div>

                {/* Tap-to-select number buttons */}
                <div className="flex gap-2 mb-5">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => {
                        setSliderVal(n)
                        setAnswers(prev => ({ ...prev, [currentQ.id]: n }))
                      }}
                      className={`
                        flex-1 py-3.5 rounded-xl text-base font-bold border-2 transition-all duration-150
                        ${sliderVal === n
                          ? 'border-rose-400 bg-rose-400 text-white scale-105 shadow-sm'
                          : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-rose-200 hover:text-gray-600'
                        }
                      `}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <input
                  type="range"
                  min={1} max={5} step={1}
                  value={sliderVal}
                  onChange={e => handleSliderChange(Number(e.target.value), currentQ.id)}
                  className="w-full accent-rose-500"
                />

                {/* Slider next button (only way to advance for slider Qs) */}
                {!isLast && (
                  <motion.button
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    onClick={() => {
                      setAnswers(prev => ({ ...prev, [currentQ.id]: sliderVal }))
                      advance(current)
                    }}
                    className="mt-5 w-full py-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold transition"
                  >
                    Next →
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Submit — floats up only on the last question after answering */}
      <AnimatePresence>
        {isLast && lastAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-10 max-w-xl mx-auto w-full"
          >
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-base font-bold shadow-lg transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting
                ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Heart className="w-5 h-5 fill-white" /> Submit my answers</>
              }
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
