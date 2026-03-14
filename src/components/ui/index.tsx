import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── INPUT ──
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <input
        ref={ref}
        className={cn('input-field', error && 'border-red-400 focus:border-red-400', className)}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-dusty/70">{hint}</p>}
    </div>
  )
)
Input.displayName = 'Input'

// ── TEXTAREA ──
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <textarea
        ref={ref}
        className={cn('input-field resize-none', error && 'border-red-400', className)}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-dusty/70">{hint}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'

// ── SELECT ──
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <select
        ref={ref}
        className={cn('input-field cursor-pointer', error && 'border-red-400', className)}
        {...props}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
)
Select.displayName = 'Select'

// ── BUTTON ──
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
}
export function Button({ variant = 'primary', loading, size = 'md', children, className, disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-sans text-xs tracking-widest uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-wine text-cream hover:bg-mauve active:scale-95',
    ghost:   'bg-transparent text-wine border border-wine/30 hover:bg-blush',
    danger:  'bg-red-600 text-white hover:bg-red-700',
  }
  const sizes = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-3.5',
  }
  return (
    <button
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && <Loader2 size={13} className="animate-spin" />}
      {children}
    </button>
  )
}

// ── STATUS BADGE ──
import { STATUS_MAP } from '@/lib/utils'
import type { StoryStatus } from '@/types'
export function StatusBadge({ status }: { status: StoryStatus }) {
  const s = STATUS_MAP[status]
  return (
    <span
      className="status-badge text-[11px]"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}22` }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
      {s.label}
    </span>
  )
}

// ── SPINNER ──
export function Spinner({ size = 20 }: { size?: number }) {
  return <Loader2 size={size} className="animate-spin text-mauve" />
}

// ── PAGE HEADER ──
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-serif text-2xl md:text-3xl font-light text-wine">{title}</h1>
      {subtitle && <p className="text-sm text-dusty mt-1 font-light">{subtitle}</p>}
    </div>
  )
}

// ── EMPTY STATE ──
export function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="text-5xl mb-4 opacity-30">{icon}</div>
      <h3 className="font-serif text-xl text-wine mb-2 font-light">{title}</h3>
      <p className="text-sm text-dusty max-w-xs font-light mb-6">{description}</p>
      {action}
    </motion.div>
  )
}

// ── STORY CARD ──

import { formatDate, OCCASIONS } from '@/lib/utils'
import type { Story } from '@/types'
export function StoryCard({ story }: { story: Story }) {
  const occasion = OCCASIONS.find(o => o.value === story.occasion)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cream border border-gold/20 p-5 hover:shadow-luxury transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{occasion?.emoji}</span>
          <div>
            <p className="font-serif text-base text-wine">For {story.recipientName}</p>
            <p className="text-xs text-dusty capitalize">{story.occasion} · {story.packageType === 'luxe' ? 'Luxe Film' : 'Signature Story'}</p>
          </div>
        </div>
        <StatusBadge status={story.status} />
      </div>
      <p className="text-xs text-dusty/70 mb-4">{formatDate(story.createdAt)}</p>
      {story.status === 'completed' && story.storyLink ? (
        <a
          href={story.storyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-wine border border-wine/25 px-3 py-1.5 hover:bg-blush transition-colors"
        >
          View Story →
        </a>
      ) : (
        <p className="text-xs text-dusty/50 italic">
          {story.status === 'submitted' ? 'Our team will begin crafting your story soon.' :
           story.status === 'in-production' ? 'Your story is being crafted with care.' :
           'Almost ready — final review in progress.'}
        </p>
      )}
    </motion.div>
  )
}
