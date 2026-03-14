import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader, Spinner, StatusBadge, EmptyState } from '@/components/ui'
import { formatDate, OCCASIONS } from '@/lib/utils'
import api from '@/lib/api'
import type { Story } from '@/types'

export default function PaymentHistoryPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/stories/my').then(r => {
      setStories((r.data.stories || []).filter((s: Story) => s.paymentStatus === 'paid'))
    }).finally(() => setLoading(false))
  }, [])

  const total = stories.reduce((sum, s) => sum + s.packagePrice, 0)

  return (
    <div className="max-w-3xl">
      <PageHeader title="Payment History" subtitle="All completed payments" />

      {stories.length > 0 && (
        <div className="bg-cream border border-gold/20 p-5 mb-6 flex justify-between items-center">
          <span className="text-sm text-dusty font-light">Total spent</span>
          <span className="font-serif text-2xl text-wine">${total}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center pt-16"><Spinner /></div>
      ) : stories.length === 0 ? (
        <EmptyState icon="💳" title="No payments yet" description="Your payment history will appear here after your first story order." />
      ) : (
        <div className="space-y-3">
          {stories.map((story, i) => {
            const occasion = OCCASIONS.find(o => o.value === story.occasion)
            return (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-cream border border-gold/20 p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{occasion?.emoji}</span>
                  <div>
                    <p className="font-serif text-base text-wine">For {story.recipientName}</p>
                    <p className="text-xs text-dusty font-light">{formatDate(story.createdAt)} · {story.packageType === 'luxe' ? 'Luxe Film' : 'Signature Story'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={story.status} />
                  <span className="font-serif text-lg text-wine">${story.packagePrice}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
