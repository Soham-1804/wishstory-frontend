// AdminDashboardPage.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, DollarSign, Clock, CheckCircle2 } from 'lucide-react'
import { StatusBadge, Spinner } from '@/components/ui'
import { formatDate, OCCASIONS } from '@/lib/utils'
import api from '@/lib/api'
import type { AdminStats } from '@/types'

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.stats)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center pt-24"><Spinner /></div>
  if (!stats) return null

  const statCards = [
    { label: 'Total Orders',    value: stats.totalOrders,    icon: BookOpen,      color: 'text-blue-700 bg-blue-50' },
    { label: 'Revenue',         value: `$${stats.totalRevenue}`, icon: DollarSign, color: 'text-emerald-700 bg-emerald-50' },
    { label: 'In Progress',     value: stats.pendingOrders,  icon: Clock,         color: 'text-amber-700 bg-amber-50' },
    { label: 'Completed',       value: stats.completedOrders,icon: CheckCircle2,  color: 'text-purple-700 bg-purple-50' },
  ]

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase text-[#c8a97e] mb-1">WishStory Admin</p>
        <h1 className="font-serif text-3xl font-light text-[#2c1a17]">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white border border-[#c8a97e]/20 p-5">
            <div className={`inline-flex p-2 rounded mb-3 ${color}`}>
              <Icon size={15} strokeWidth={1.5} />
            </div>
            <p className="font-serif text-2xl text-[#2c1a17] mb-0.5">{value}</p>
            <p className="text-xs text-[#c9968a] font-light">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl text-[#2c1a17] font-light">Recent Orders</h2>
        <Link to="/admin/stories" className="text-xs text-[#6b3d38] border border-[#6b3d38]/25 px-3 py-1.5 hover:bg-[#f5e6e0] transition-colors">
          View All →
        </Link>
      </div>

      <div className="bg-white border border-[#c8a97e]/20 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#c8a97e]/15">
              {['Recipient','Occasion','Package','Status','Date','Action'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[#c9968a] font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map(story => {
              const occ = OCCASIONS.find(o => o.value === story.occasion)
              return (
                <tr key={story._id} className="border-b border-[#c8a97e]/10 hover:bg-[#faf7f2] transition-colors">
                  <td className="px-4 py-3 font-serif text-sm text-[#2c1a17]">{story.recipientName}</td>
                  <td className="px-4 py-3 text-xs text-[#9d6e65]">{occ?.emoji} {occ?.label}</td>
                  <td className="px-4 py-3 text-xs text-[#9d6e65] capitalize">{story.packageType}</td>
                  <td className="px-4 py-3"><StatusBadge status={story.status} /></td>
                  <td className="px-4 py-3 text-xs text-[#c9968a] font-light">{formatDate(story.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/stories/${story._id}`} className="text-xs text-[#6b3d38] hover:underline">Edit</Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboardPage
