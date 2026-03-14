import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Input, Button } from '@/components/ui'
import type { RegisterFormData } from '@/types'

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false)
  const { register: registerUser, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>()
  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.name, data.email, data.password)
      toast.success('Welcome to WishStory!')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed.')
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left */}
      <div className="hidden md:flex flex-col items-center justify-center bg-wine relative overflow-hidden p-16">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 40% 30%, rgba(200,169,126,0.15) 0%, transparent 60%)' }} />
        <div className="relative z-10 text-center">
          <Link to="/" className="font-serif text-3xl font-light text-cream tracking-wide block mb-12">
            Wish<span className="text-gold">Story</span>
          </Link>
          <div className="w-px h-20 bg-gradient-to-b from-gold/50 to-transparent mx-auto mb-12" />
          <p className="font-serif text-xl italic text-cream/60 font-light leading-relaxed max-w-xs">
            "Begin your first story today."
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center justify-center px-8 py-16 bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-light text-wine mb-2">Create your account</h1>
            <p className="text-sm text-dusty font-light">Join WishStory and start creating beautiful memories.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Your name"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })}
            />
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
                placeholder="Min. 8 characters"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Must be at least 8 characters' }
                })}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-[38px] text-dusty hover:text-mauve transition-colors"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: v => v === password || 'Passwords do not match'
              })}
            />

            <Button type="submit" loading={isLoading} className="w-full justify-center" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-dusty mt-6 font-light">
            Already have an account?{' '}
            <Link to="/login" className="text-wine hover:text-mauve transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
