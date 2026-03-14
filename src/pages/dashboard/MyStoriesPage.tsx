// MyStoriesPage.tsx
import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import { PageHeader, StoryCard, Spinner, EmptyState } from '@/components/ui'
import api from '@/lib/api'
import type { Story, StoryStatus } from '@/types'

const FILTERS: { label: string; value: StoryStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'In Production', value: 'in-production' },
  { label: 'Under Review', value: 'review' },
  { label: 'Completed', value: 'completed' },
]

export function MyStoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StoryStatus | 'all'>('all')

  useEffect(() => {
    api.get('/stories/my').then(r => setStories(r.data.stories || [])).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? stories : stories.filter(s => s.status === filter)

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <PageHeader title="My Stories" subtitle={`${stories.length} story request${stories.length !== 1 ? 's' : ''} total`} />
        <Link to="/dashboard/create" className="btn-primary text-xs px-5 py-2.5 mt-1">+ New Story</Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-xs px-4 py-1.5 transition-all ${filter === f.value ? 'bg-wine text-cream' : 'bg-cream border border-gold/25 text-dusty hover:border-mauve/40'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center pt-16"><Spinner size={28} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📖" title="No stories here" description="Create a new story to get started."
          action={<Link to="/dashboard/create" className="btn-primary text-xs px-5 py-2.5">Create Story</Link>}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(story => <StoryCard key={story._id} story={story} />)}
        </div>
      )}
    </div>
  )
}

export default MyStoriesPage
