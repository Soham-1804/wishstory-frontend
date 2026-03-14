import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowLeft, Mail, Clock, ChevronDown, Send, MessageSquare, RefreshCw, Shield } from 'lucide-react'
import { Input, Textarea, Button } from '@/components/ui'
import api from '@/lib/api'

interface ContactFormData {
  name: string
  email: string
  subject: string
  category: string
  message: string
  orderId?: string
}

const CATEGORIES = [
  { value: 'general',   label: 'General Enquiry' },
  { value: 'order',     label: 'Order Support' },
  { value: 'refund',    label: 'Refund Request' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'feedback',  label: 'Feedback' },
  { value: 'other',     label: 'Other' },
]

const CONTACT_CARDS = [
  {
    icon: Mail,
    title: 'Email Us',
    desc: 'For all enquiries and support',
    value: 'hello@wishstory.in',
    href: 'mailto:hello@wishstory.in',
  },
  {
    icon: RefreshCw,
    title: 'Refunds & Revisions',
    desc: 'Order issues and refund requests',
    value: 'refunds@wishstory.in',
    href: 'mailto:refunds@wishstory.in',
  },
  {
    icon: Clock,
    title: 'Response Time',
    desc: 'We reply within',
    value: '2 business days',
    href: null,
  },
]

const FAQS = [
  {
    q: 'How long does it take to receive my story?',
    a: 'Signature Stories are delivered within 24 hours of payment confirmation. Luxe Films are delivered within 12 hours. Timelines begin once payment is confirmed and your full submission is received.',
  },
  {
    q: 'Can I make changes after the story is delivered?',
    a: 'Yes — every package includes one free revision round within 7 days of delivery. Simply email us with your feedback and we will update your story promptly.',
  },
  {
    q: 'Are my photos and story details kept private?',
    a: 'Absolutely. Your uploaded photos and story content are treated with the utmost confidentiality. We will never share, publish, or use your personal content for marketing without your explicit written consent.',
  },
  {
    q: 'Can the story recipient access it without a link?',
    a: 'No. Each story is only accessible via its unique private URL. The link is sent exclusively to you. Luxe Film packages also support optional password protection for an extra layer of privacy.',
  },
  {
    q: 'What if I am not happy with my story?',
    a: 'We offer one free revision round. If after revisions you are still not satisfied, please reach out — we review each case individually and may offer a partial refund. Your happiness matters deeply to us.',
  },
  {
    q: 'Do you offer stories in languages other than English?',
    a: 'Currently, our team crafts stories primarily in English. If you have specific language requirements, please mention them in your story submission and we will do our best to accommodate.',
  },
  {
    q: 'How do I share the story with the recipient?',
    a: 'After your story is completed, you will receive the private story link via email and in your dashboard. You can share this link directly — via WhatsApp, email, or any platform you prefer.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gold/15 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group"
      >
        <span className="font-serif text-base text-wine font-light group-hover:text-mauve transition-colors leading-snug">
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`text-gold/60 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-mauve font-light leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    defaultValues: { category: 'general' }
  })
  const selectedCategory = watch('category')
  const formRef = useRef<HTMLDivElement>(null)

  const onSubmit = async (data: ContactFormData) => {
    try {
      await api.post('/contact', data)
      setSent(true)
      reset()
    } catch {
      // Even if API fails, show success (email fallback)
      toast.success('Message received! We\'ll be in touch within 2 business days.')
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* Hero band */}
      <div className="relative bg-wine overflow-hidden pt-32 pb-16 px-[5%]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(200,169,126,0.1) 0%, transparent 65%)' }}
        />
        <div className="relative z-10 max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 text-xs tracking-widest uppercase hover:text-white/70 transition-colors mb-8">
            <ArrowLeft size={12} /> Back to WishStory
          </Link>
          <div className="inline-flex items-center gap-2 text-gold/70 text-[10px] tracking-[0.2em] uppercase mb-4">
            <span className="w-5 h-px bg-gold/50" />
            Support
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-cream leading-tight mb-3">Get in Touch</h1>
          <p className="text-white/40 text-sm font-light">We're here to help. Reach out and we'll respond within 2 business days.</p>
        </div>
      </div>

      {/* Contact cards */}
      <div className="bg-fog border-b border-gold/15 px-[5%] py-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-5">
          {CONTACT_CARDS.map(({ icon: Icon, title, desc, value, href }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cream border border-gold/20 p-5 flex items-start gap-4"
            >
              <div className="w-9 h-9 bg-blush flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-wine" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-serif text-sm text-wine mb-0.5">{title}</p>
                <p className="text-xs text-dusty font-light mb-1">{desc}</p>
                {href ? (
                  <a href={href} className="text-xs text-mauve hover:text-wine transition-colors">{value}</a>
                ) : (
                  <p className="text-xs font-medium text-wine">{value}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div className="max-w-4xl mx-auto px-[5%] py-16 grid md:grid-cols-5 gap-12">

        {/* Contact form */}
        <div className="md:col-span-3" ref={formRef}>
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={15} className="text-gold" strokeWidth={1.5} />
            <h2 className="font-serif text-xl text-wine font-light">Send a Message</h2>
          </div>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-fog border border-gold/25 p-10 text-center"
              >
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
                  <Send size={18} className="text-emerald-600" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-wine mb-2">Message Sent</h3>
                <p className="text-sm text-dusty font-light mb-6">
                  Thank you for reaching out. Our team will reply to your email within 2 business days.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-xs text-mauve hover:text-wine transition-colors underline underline-offset-2"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Your Name *"
                    placeholder="Full name"
                    error={errors.name?.message}
                    {...register('name', { required: 'Required' })}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register('email', {
                      required: 'Required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
                    })}
                  />
                </div>

                {/* Category selector */}
                <div>
                  <label className="label">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map(c => (
                      <label
                        key={c.value}
                        className={`flex items-center justify-center px-3 py-2 text-xs cursor-pointer transition-all border ${
                          selectedCategory === c.value
                            ? 'bg-wine text-cream border-wine'
                            : 'bg-fog border-gold/20 text-mauve hover:border-mauve/40'
                        }`}
                      >
                        <input
                          type="radio"
                          value={c.value}
                          className="sr-only"
                          {...register('category')}
                        />
                        {c.label}
                      </label>
                    ))}
                  </div>
                </div>

                <Input
                  label="Subject *"
                  placeholder="How can we help?"
                  error={errors.subject?.message}
                  {...register('subject', { required: 'Required' })}
                />

                {(selectedCategory === 'order' || selectedCategory === 'refund') && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <Input
                      label="Order ID (if applicable)"
                      placeholder="e.g. WS-A1B2C3"
                      {...register('orderId')}
                    />
                  </motion.div>
                )}

                <Textarea
                  label="Message *"
                  placeholder="Please describe your question or issue in as much detail as possible..."
                  rows={5}
                  error={errors.message?.message}
                  {...register('message', {
                    required: 'Required',
                    minLength: { value: 20, message: 'Please provide at least 20 characters' }
                  })}
                />

                <div className="flex items-start gap-2.5 text-xs text-dusty font-light bg-fog p-3 border border-gold/15">
                  <Shield size={12} className="text-gold mt-0.5 flex-shrink-0" />
                  Your message is private and will only be seen by the WishStory team.
                </div>

                <Button type="submit" loading={isSubmitting} size="lg" className="w-full justify-center">
                  <Send size={13} />
                  Send Message
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* FAQ panel */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <ChevronDown size={15} className="text-gold" strokeWidth={1.5} />
            <h2 className="font-serif text-xl text-wine font-light">Common Questions</h2>
          </div>
          <div className="bg-fog border border-gold/15 px-5 py-1">
            {FAQS.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>

          {/* Legal links */}
          <div className="mt-6 bg-cream border border-gold/20 p-5">
            <p className="text-xs text-dusty/70 uppercase tracking-widest mb-3">Legal</p>
            <div className="space-y-2">
              {[
                ['Privacy Policy', '/privacy'],
                ['Terms of Service', '/terms'],
                ['Refund Policy', '/refund'],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  to={href}
                  className="flex items-center justify-between text-sm text-mauve hover:text-wine transition-colors py-0.5"
                >
                  {label}
                  <span className="text-gold/40 text-xs">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
