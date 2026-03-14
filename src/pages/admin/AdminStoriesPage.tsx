import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ExternalLink, Mail, ArrowLeft } from 'lucide-react'
import { StatusBadge, Spinner, Button, Input, Select, Textarea } from '@/components/ui'
import { formatDate, OCCASIONS } from '@/lib/utils'
import api from '@/lib/api'
import type { Story, StoryStatus } from '@/types'

// ── ALL STORIES ──
export function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StoryStatus | 'all'>('all')

  useEffect(() => {
    api.get('/admin/stories').then(r => setStories(r.data.stories || [])).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? stories : stories.filter(s => s.status === filter)

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-light text-[#2c1a17]">All Stories</h1>
        <div className="flex gap-2">
          {(['all','submitted','in-production','review','completed'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-[11px] px-3 py-1.5 capitalize transition-colors ${filter === s ? 'bg-[#6b3d38] text-white' : 'bg-white border border-[#c8a97e]/25 text-[#9d6e65] hover:border-[#9d6e65]/40'}`}>
              {s === 'all' ? 'All' : s.replace('-',' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center pt-16"><Spinner /></div>
      ) : (
        <div className="bg-white border border-[#c8a97e]/20 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#c8a97e]/15">
                {['Recipient','Customer','Occasion','Package','Status','Paid','Date',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[#c9968a] font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const occ = OCCASIONS.find(o => o.value === s.occasion)
                return (
                  <tr key={s._id} className="border-b border-[#c8a97e]/10 hover:bg-[#faf7f2]">
                    <td className="px-4 py-3 font-serif text-sm text-[#2c1a17]">{s.recipientName}</td>
                    <td className="px-4 py-3 text-xs text-[#9d6e65]">{s.clientName}</td>
                    <td className="px-4 py-3 text-xs">{occ?.emoji} {occ?.label}</td>
                    <td className="px-4 py-3 text-xs capitalize text-[#9d6e65]">{s.packageType}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] px-2 py-0.5 ${s.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {s.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#c9968a]">{formatDate(s.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/stories/${s._id}`} className="text-xs text-[#6b3d38] border border-[#6b3d38]/25 px-2 py-1 hover:bg-[#f5e6e0]">
                        Edit
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-sm text-[#c9968a] py-16 font-light">No stories found.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── STORY DETAIL / EDITOR ──
interface AdminUpdateForm {
  status: StoryStatus
  storyLink: string
  adminNotes: string
  sendEmail: boolean
}

export function AdminStoryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [emailSending, setEmailSending] = useState(false)
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<AdminUpdateForm>()

  useEffect(() => {
    api.get(`/admin/stories/${id}`).then(r => {
      setStory(r.data.story)
      reset({ status: r.data.story.status, storyLink: r.data.story.storyLink || '', adminNotes: r.data.story.adminNotes || '', sendEmail: false })
    }).finally(() => setLoading(false))
  }, [id, reset])

  const onSubmit = async (data: AdminUpdateForm) => {
    try {
      await api.put(`/admin/update-story`, { storyId: id, ...data })
      toast.success('Story updated.')
      if (data.sendEmail) toast.success('Completion email sent.')
    } catch { toast.error('Update failed.') }
  }

  const sendCompletionEmail = async () => {
    setEmailSending(true)
    try {
      await api.post(`/admin/send-email/${id}`)
      toast.success('Email sent to customer.')
    } catch { toast.error('Failed to send email.') }
    finally { setEmailSending(false) }
  }

  if (loading) return <div className="flex justify-center pt-24"><Spinner /></div>
  if (!story) return <div className="p-8 text-[#9d6e65]">Story not found.</div>

  const occ = OCCASIONS.find(o => o.value === story.occasion)

  return (
    <div className="p-8 max-w-3xl">
      <button onClick={() => navigate('/admin/stories')} className="flex items-center gap-1.5 text-xs text-[#9d6e65] mb-6 hover:text-[#6b3d38] transition-colors">
        <ArrowLeft size={13} /> Back to Stories
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#c8a97e] mb-1">{occ?.emoji} {occ?.label}</p>
          <h1 className="font-serif text-2xl text-[#2c1a17] font-light">Story for {story.recipientName}</h1>
          <p className="text-sm text-[#9d6e65] mt-0.5 font-light">Ordered by {story.clientName} · {formatDate(story.createdAt)}</p>
        </div>
        <StatusBadge status={story.status} />
      </div>

      {/* Story details */}
      <div className="bg-white border border-[#c8a97e]/20 p-6 mb-5">
        <h3 className="text-xs tracking-[0.15em] uppercase text-[#c8a97e] mb-4">Story Details</h3>
        <div className="space-y-3">
          {[
            ['Customer', story.clientName],
            ['Email', story.clientEmail],
            ['Package', story.packageType === 'luxe' ? 'Luxe Film — $35' : 'Signature Story — $15'],
            ['Theme', story.theme],
            ['Music', story.musicChoice],
            ['Payment', story.paymentStatus],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-4 text-sm">
              <span className="w-24 text-[#c9968a] font-light flex-shrink-0">{k}</span>
              <span className="text-[#2c1a17] capitalize">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[#c8a97e]/15">
          <p className="text-xs text-[#c8a97e] uppercase tracking-wider mb-2">Story Description</p>
          <p className="text-sm text-[#6b3d38] font-light leading-relaxed italic font-serif">{story.storyDetails}</p>
        </div>
      </div>

      {/* Photos */}
      {story.uploadedPhotos?.length > 0 && (
        <div className="bg-white border border-[#c8a97e]/20 p-5 mb-5">
          <p className="text-xs tracking-[0.15em] uppercase text-[#c8a97e] mb-3">Photos ({story.uploadedPhotos.length})</p>
          <div className="grid grid-cols-5 gap-2">
            {story.uploadedPhotos.map((src, i) => (
              <img key={i} src={src} alt="" className="aspect-square object-cover w-full" />
            ))}
          </div>
        </div>
      )}

      {/* Admin update form */}
      <div className="bg-white border border-[#c8a97e]/20 p-6">
        <h3 className="text-xs tracking-[0.15em] uppercase text-[#c8a97e] mb-5">Update Story</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Status"
            options={[
              { value: 'submitted',      label: 'Submitted' },
              { value: 'in-production',  label: 'In Production' },
              { value: 'review',         label: 'Under Review' },
              { value: 'completed',      label: 'Completed' },
            ]}
            {...register('status')}
          />
          <Input
            label="Story Link (delivered to customer)"
            placeholder="https://wishstory.in/story/uniqueID"
            {...register('storyLink')}
          />
          <Textarea
            label="Admin Notes (internal)"
            rows={3}
            placeholder="Internal notes about this order..."
            {...register('adminNotes')}
          />
          <div className="flex items-center gap-2.5">
            <input type="checkbox" id="sendEmail" {...register('sendEmail')} className="accent-[#6b3d38]" />
            <label htmlFor="sendEmail" className="text-xs text-[#9d6e65] cursor-pointer">
              Send completion email to customer when saving
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={isSubmitting}>Save Changes</Button>
            <Button
              type="button"
              variant="ghost"
              loading={emailSending}
              onClick={sendCompletionEmail}
            >
              <Mail size={13} /> Send Email Now
            </Button>
            {story.storyLink && (
              <a href={story.storyLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#6b3d38] border border-[#6b3d38]/25 px-4 py-2.5 hover:bg-[#f5e6e0]">
                <ExternalLink size={12} /> Preview Story
              </a>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminStoriesPage
