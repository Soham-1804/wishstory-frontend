import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Input, Button } from '@/components/ui'
import type { LoginFormData } from '@/types'

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false)
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      toast.success('Welcome back.')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid credentials.')
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left — decorative */}
      <div className="hidden md:flex flex-col items-center justify-center bg-wine relative overflow-hidden p-16">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 40% 30%, rgba(200,169,126,0.15) 0%, transparent 60%)' }} />
        <div className="relative z-10 text-center">
          <Link to="/" className="font-serif text-3xl font-light text-cream tracking-wide block mb-12">
            Wish<span className="text-gold">Story</span>
          </Link>
          <div className="w-px h-20 bg-gradient-to-b from-gold/50 to-transparent mx-auto mb-12" />
          <blockquote className="font-serif text-xl italic text-cream/60 font-light leading-relaxed max-w-xs">
            "Every memory deserves to be told beautifully."
          </blockquote>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center px-8 py-16 bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="font-serif text-2xl font-light text-wine block mb-10 md:hidden">
            Wish<span className="text-gold">Story</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-serif text-3xl font-light text-wine mb-2">Welcome back</h1>
            <p className="text-sm text-dusty font-light">Sign in to your WishStory account.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
              })}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPw ? 'text' : 'password'}
                placeholder="Your password"
                error={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-[38px] text-dusty hover:text-mauve transition-colors"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <Button type="submit" loading={isLoading} className="w-full justify-center py-3.5" size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-dusty mt-6 font-light">
            No account yet?{' '}
            <Link to="/register" className="text-wine hover:text-mauve transition-colors">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
