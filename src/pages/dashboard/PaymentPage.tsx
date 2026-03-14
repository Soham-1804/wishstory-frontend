import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Lock, CreditCard } from 'lucide-react'
import { Button, Spinner, PageHeader } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import type { Story, RazorpayOrder, RazorpayResponse } from '@/types'
import { OCCASIONS } from '@/lib/utils'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    api.get(`/stories/${id}`).then(r => setStory(r.data.story)).finally(() => setLoading(false))
    // Load Razorpay script
    if (!window.Razorpay) {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.head.appendChild(script)
    }
  }, [id])

  const handlePayment = async () => {
    if (!story) return
    setProcessing(true)
    try {
      // Create Razorpay order
      const { data } = await api.post<{ order: RazorpayOrder }>('/payment/create-order', {
        storyId: story._id,
        packageType: story.packageType
      })
      const { orderId, amount, currency, key } = data.order

      const options = {
        key,
        amount,
        currency,
        name: 'WishStory',
        description: story.packageType === 'luxe' ? 'Luxe Film' : 'Signature Story',
        order_id: orderId,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#6b3d38' },
        handler: async (response: RazorpayResponse) => {
          try {
            await api.post('/payment/verify', {
              storyId: story._id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            })
            toast.success('Payment successful!')
            navigate(`/dashboard/confirmed/${story._id}`)
          } catch {
            toast.error('Payment verification failed. Contact support.')
          }
        },
        modal: { ondismiss: () => setProcessing(false) }
      }
      new window.Razorpay(options).open()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Could not initiate payment.')
      setProcessing(false)
    }
  }

  if (loading) return <div className="flex justify-center pt-24"><Spinner size={28} /></div>
  if (!story) return <div className="text-center pt-24 text-dusty">Story not found.</div>

  const occasion = OCCASIONS.find(o => o.value === story.occasion)

  return (
    <div className="max-w-lg">
      <PageHeader title="Complete Your Order" subtitle="Secure payment via Razorpay" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cream border border-gold/20 p-8 mb-6"
      >
        {/* Order summary */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gold/15">
          <span className="text-3xl">{occasion?.emoji}</span>
          <div>
            <p className="font-serif text-lg text-wine">For {story.recipientName}</p>
            <p className="text-xs text-dusty capitalize">{story.occasion} · {story.packageType === 'luxe' ? 'Luxe Film' : 'Signature Story'}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {[
            ['Package', story.packageType === 'luxe' ? 'Luxe Film' : 'Signature Story'],
            ['Delivery', story.packageType === 'luxe' ? 'Within 12 hours' : 'Within 24 hours'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="text-dusty font-light">{k}</span>
              <span className="text-wine">{v}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gold/15 mb-8">
          <span className="text-sm font-medium text-mauve">Total Amount</span>
          <span className="font-serif text-3xl text-wine font-light">${story.packagePrice}</span>
        </div>

        <Button
          onClick={handlePayment}
          loading={processing}
          className="w-full justify-center py-4"
          size="lg"
        >
          <CreditCard size={15} />
          Pay ${story.packagePrice} Securely
        </Button>

        <div className="flex items-center justify-center gap-1.5 mt-4">
          <Lock size={11} className="text-dusty/50" />
          <p className="text-[11px] text-dusty/50">Secured by Razorpay · SSL encrypted</p>
        </div>
      </motion.div>

      <p className="text-xs text-dusty/60 text-center font-light">
        After payment, our team will receive your story request and begin working on it immediately.
      </p>
    </div>
  )
}
