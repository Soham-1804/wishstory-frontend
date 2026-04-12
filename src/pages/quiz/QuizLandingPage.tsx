import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Heart, Sparkles, Clock, Share2 } from 'lucide-react'
import { quizApi } from '@/lib/quizApi'

interface FormValues {
  partner1Name: string
  partner2Name: string
}

const features = [
  { icon: Sparkles, text: '20 fun questions across 5 categories' },
  { icon: Heart,    text: 'Both partners answer independently' },
  { icon: Clock,    text: 'Takes about 3 minutes each' },
  { icon: Share2,   text: 'Get a shareable result card' },
]

export default function QuizLandingPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

  const onSubmit = async ({ partner1Name, partner2Name }: FormValues) => {
    setLoading(true)
    try {
      const { quizId } = await quizApi.start(partner1Name.trim(), partner2Name.trim())
      // Partner 1 goes straight into the quiz
      navigate(`/quiz/${quizId}?partner=1`)
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Compatibility Meter</h1>
          <p className="text-gray-500 text-base">
            Discover how compatible you and your partner really are — answer separately, reveal together.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-2 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
              <Icon className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-gray-600 leading-snug">{text}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5">Enter your names to begin</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
              <input
                {...register('partner1Name', { required: 'Your name is required', maxLength: { value: 60, message: 'Too long' } })}
                type="text"
                placeholder="e.g. Priya"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition"
              />
              {errors.partner1Name && (
                <p className="text-xs text-red-500 mt-1">{errors.partner1Name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your partner's name</label>
              <input
                {...register('partner2Name', { required: "Partner's name is required", maxLength: { value: 60, message: 'Too long' } })}
                type="text"
                placeholder="e.g. Rohan"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition"
              />
              {errors.partner2Name && (
                <p className="text-xs text-red-500 mt-1">{errors.partner2Name.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  Start the quiz
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          No account needed · Link expires in 48 hours · Made with love by WishStory
        </p>
      </motion.div>
    </div>
  )
}
