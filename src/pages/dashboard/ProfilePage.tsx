import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { Input, Button, PageHeader } from '@/components/ui'
import { getInitials } from '@/lib/utils'
import api from '@/lib/api'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' }
  })
  const pwForm = useForm<{ currentPassword: string; newPassword: string; confirm: string }>()

  const onUpdateProfile = async (data: { name: string; email: string }) => {
    try {
      await api.put('/auth/profile', data)
      toast.success('Profile updated.')
    } catch { toast.error('Update failed.') }
  }

  const onChangePassword = async (data: { currentPassword: string; newPassword: string; confirm: string }) => {
    if (data.newPassword !== data.confirm) { toast.error('Passwords do not match'); return }
    try {
      await api.put('/auth/password', { currentPassword: data.currentPassword, newPassword: data.newPassword })
      toast.success('Password changed.')
      pwForm.reset()
    } catch (err: any) { toast.error(err.response?.data?.error || 'Failed to change password.') }
  }

  return (
    <div className="max-w-lg">
      <PageHeader title="Profile Settings" />

      {/* Avatar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-full bg-rose flex items-center justify-center text-wine text-xl font-serif">
          {getInitials(user?.name || 'U')}
        </div>
        <div>
          <p className="font-serif text-lg text-wine">{user?.name}</p>
          <p className="text-sm text-dusty font-light">{user?.email}</p>
        </div>
      </motion.div>

      {/* Profile form */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-cream border border-gold/20 p-6 mb-5">
        <h3 className="font-serif text-lg text-wine mb-5 pb-3 border-b border-gold/15">Personal Information</h3>
        <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
          <Input label="Full Name" error={errors.name?.message} {...register('name', { required: 'Required' })} />
          <Input label="Email Address" type="email" error={errors.email?.message} {...register('email', { required: 'Required' })} />
          <Button type="submit" loading={isSubmitting} size="sm">Save Changes</Button>
        </form>
      </motion.div>

      {/* Password form */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-cream border border-gold/20 p-6">
        <h3 className="font-serif text-lg text-wine mb-5 pb-3 border-b border-gold/15">Change Password</h3>
        <form onSubmit={pwForm.handleSubmit(onChangePassword)} className="space-y-4">
          <Input label="Current Password" type="password" {...pwForm.register('currentPassword', { required: 'Required' })} />
          <Input label="New Password" type="password" {...pwForm.register('newPassword', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })} />
          <Input label="Confirm New Password" type="password" {...pwForm.register('confirm', { required: 'Required' })} />
          <Button type="submit" loading={pwForm.formState.isSubmitting} size="sm">Update Password</Button>
        </form>
      </motion.div>
    </div>
  )
}
