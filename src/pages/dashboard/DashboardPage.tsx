import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlusCircle, BookOpen, Clock, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import {  StoryCard, Spinner, EmptyState } from '@/components/ui'
import api from '@/lib/api'
import type { Story } from '@/types'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/stories/my').then(r => setStories(r.data.stories || [])).finally(() => setLoading(false))
  }, [])

  const stats = {
    total:     stories.length,
    active:    stories.filter(s => ['submitted','in-production','review'].includes(s.status)).length,
    completed: stories.filter(s => s.status === 'completed').length,
  }

  const statCards = [
    { label: 'Total Stories',   value: stats.total,     icon: BookOpen,      color: 'bg-blush text-wine' },
    { label: 'In Progress',     value: stats.active,    icon: Clock,         color: 'bg-amber-50 text-amber-700' },
    { label: 'Completed',       value: stats.completed, icon: CheckCircle2,  color: 'bg-emerald-50 text-emerald-700' },
  ]

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs tracking-widest uppercase text-gold mb-1">Welcome back</p>
          <h1 className="font-serif text-3xl font-light text-wine">{user?.name}</h1>
          <p className="text-sm text-dusty mt-1 font-light">Here's what's happening with your stories.</p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-cream border border-gold/20 p-5"
          >
            <div className={`inline-flex p-2 rounded ${color} mb-3`}>
              <Icon size={15} strokeWidth={1.5} />
            </div>
            <p className="font-serif text-2xl text-wine mb-0.5">{value}</p>
            <p className="text-xs text-dusty font-light">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent stories */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-xl text-wine font-light">Recent Stories</h2>
        <Link to="/dashboard/create" className="inline-flex items-center gap-1.5 text-xs text-wine border border-wine/25 px-3 py-1.5 hover:bg-blush transition-colors">
          <PlusCircle size={13} /> New Story
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={28} /></div>
      ) : stories.length === 0 ? (
        <EmptyState
          icon="📖"
          title="No stories yet"
          description="Create your first WishStory and turn a memory into something beautiful."
          action={
            <Link to="/dashboard/create" className="btn-primary text-sm px-6 py-2.5">
              Begin Your First Story
            </Link>
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {stories.slice(0, 4).map(story => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      )}

      {stories.length > 4 && (
        <div className="mt-5 text-center">
          <Link to="/dashboard/stories" className="text-xs text-mauve hover:text-wine tracking-wide transition-colors">
            View all {stories.length} stories →
          </Link>
        </div>
      )}
    </div>
  )
}
