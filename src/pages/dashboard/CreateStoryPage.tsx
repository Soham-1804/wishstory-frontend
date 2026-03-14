import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { Upload, X, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { Input, Textarea, Select, Button, PageHeader } from '@/components/ui'
import { OCCASIONS, THEMES, MUSIC_OPTIONS, PACKAGE_FEATURES, cn } from '@/lib/utils'
import api from '@/lib/api'
import type { StoryFormData, Package } from '@/types'

const STEPS = ['Details', 'Photos', 'Package', 'Review']

export default function CreateStoryPage() {
  const [step, setStep] = useState(0)
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [selectedPackage, setSelectedPackage] = useState<Package>('signature')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm<StoryFormData>({
    defaultValues: { occasion: 'birthday', theme: 'warm', musicChoice: 'piano-gentle', packageType: 'signature' }
  })
  const values = watch()

  // Dropzone
  const onDrop = useCallback((accepted: File[]) => {
    const newFiles = [...photos, ...accepted].slice(0, 10)
    setPhotos(newFiles)
    const newPreviews = newFiles.map(f => URL.createObjectURL(f))
    setPreviews(prev => { prev.forEach(URL.revokeObjectURL); return newPreviews })
  }, [photos])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': ['.jpg','.jpeg','.png','.webp'] }, maxSize: 10 * 1024 * 1024
  })

  const removePhoto = (i: number) => {
    URL.revokeObjectURL(previews[i])
    setPhotos(p => p.filter((_,idx) => idx !== i))
    setPreviews(p => p.filter((_,idx) => idx !== i))
  }

  const nextStep = async () => {
    if (step === 0) {
      const ok = await trigger(['recipientName','occasion','theme','storyDetails'])
      if (!ok) return
    }
    setStep(s => Math.min(s + 1, 3))
  }

  const prevStep = () => setStep(s => Math.max(s - 1, 0))

  const onSubmit = async (data: StoryFormData) => {
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('recipientName', data.recipientName)
      formData.append('occasion', data.occasion)
      formData.append('theme', data.theme)
      formData.append('storyDetails', data.storyDetails)
      formData.append('musicChoice', data.musicChoice)
      formData.append('packageType', selectedPackage)
      photos.forEach(p => formData.append('photos', p))

      const { data: res } = await api.post('/stories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      navigate(`/dashboard/payment/${res.story._id}`)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: number) => ({ x: dir < 0 ? 40 : -40, opacity: 0 }),
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Create a New Story" subtitle="Fill in the details and our team will craft something beautiful." />

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 text-xs tracking-wide transition-colors ${
              i < step ? 'text-wine' : i === step ? 'text-wine font-medium' : 'text-dusty/40'
            }`}>
              <div className={`w-6 h-6 flex items-center justify-center text-[11px] transition-all ${
                i < step ? 'bg-wine text-cream' :
                i === step ? 'bg-wine text-cream' :
                'bg-fog border border-gold/30 text-dusty/50'
              }`}>
                {i < step ? <Check size={11} /> : i + 1}
              </div>
              <span className="hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-8 md:w-16 mx-2 transition-colors ${i < step ? 'bg-wine/40' : 'bg-gold/20'}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait" custom={1}>
          {/* STEP 0 — Story Details */}
          {step === 0 && (
            <motion.div key="s0" variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-5">
              <Input
                label="Recipient's Name *"
                placeholder="Who is this story for?"
                error={errors.recipientName?.message}
                {...register('recipientName', { required: 'Required' })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Occasion *"
                  options={OCCASIONS.map(o => ({ value: o.value, label: `${o.emoji} ${o.label}` }))}
                  error={errors.occasion?.message}
                  {...register('occasion', { required: 'Required' })}
                />
                <Select
                  label="Tone & Theme *"
                  options={THEMES.map(t => ({ value: t.value, label: t.label }))}
                  error={errors.theme?.message}
                  {...register('theme', { required: 'Required' })}
                />
              </div>
              <div className="bg-fog border border-gold/15 p-3 rounded-sm">
                <p className="text-xs text-dusty font-light">
                  <span className="font-medium text-mauve">{THEMES.find(t => t.value === values.theme)?.label}</span>{' — '}
                  {THEMES.find(t => t.value === values.theme)?.desc}
                </p>
              </div>
              <Textarea
                label="Your Story Details *"
                placeholder="Describe your memories, special moments, what makes this person special to you. The more you share, the more beautiful the story becomes..."
                rows={6}
                error={errors.storyDetails?.message}
                {...register('storyDetails', { required: 'Required', minLength: { value: 80, message: 'Please share at least 80 characters' } })}
              />
              <Select
                label="Background Music"
                options={MUSIC_OPTIONS.map(m => ({ value: m.value, label: m.label }))}
                {...register('musicChoice')}
              />
            </motion.div>
          )}

          {/* STEP 1 — Photos */}
          {step === 1 && (
            <motion.div key="s1" variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <div
                {...getRootProps()}
                className={cn(
                  'border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 mb-5',
                  isDragActive ? 'border-mauve bg-blush/40' : 'border-gold/30 hover:border-mauve/50 hover:bg-blush/20'
                )}
              >
                <input {...getInputProps()} />
                <Upload size={28} className="mx-auto mb-3 text-dusty/50" strokeWidth={1} />
                <p className="text-sm text-mauve font-light mb-1">
                  {isDragActive ? 'Drop photos here...' : 'Drag photos here, or click to browse'}
                </p>
                <p className="text-xs text-dusty/60">Up to 10 photos · JPG, PNG, WebP · Max 10MB each</p>
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative aspect-square group">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-ink/70 text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photos.length === 0 && (
                <p className="text-center text-xs text-dusty/50 mt-4">No photos uploaded yet — you can still proceed without photos.</p>
              )}
            </motion.div>
          )}

          {/* STEP 2 — Package */}
          {step === 2 && (
            <motion.div key="s2" variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="grid grid-cols-2 gap-4">
              {(['signature', 'luxe'] as Package[]).map(pkg => (
                <button
                  key={pkg}
                  type="button"
                  onClick={() => setSelectedPackage(pkg)}
                  className={cn(
                    'text-left p-6 border-2 transition-all duration-200 relative',
                    selectedPackage === pkg
                      ? pkg === 'luxe' ? 'border-wine bg-wine text-cream' : 'border-wine bg-blush/50'
                      : 'border-gold/20 hover:border-gold/50'
                  )}
                >
                  {pkg === 'luxe' && <div className="absolute top-0 right-4 bg-gold text-wine text-[10px] px-2 py-0.5 tracking-wider uppercase">Popular</div>}
                  <p className={cn('font-serif text-lg mb-1', selectedPackage === pkg && pkg === 'luxe' ? 'text-gold-light' : 'text-wine')}>
                    {pkg === 'signature' ? 'Signature Story' : 'Luxe Film'}
                  </p>
                  <p className={cn('font-serif text-3xl font-light mb-4', selectedPackage === pkg && pkg === 'luxe' ? 'text-cream' : 'text-wine')}>
                    ${pkg === 'signature' ? '15' : '35'}
                  </p>
                  <ul className="space-y-2">
                    {PACKAGE_FEATURES[pkg].map(f => (
                      <li key={f} className={cn('text-xs flex items-start gap-1.5', selectedPackage === pkg && pkg === 'luxe' ? 'text-white/65' : 'text-dusty')}>
                        <span className="text-gold mt-0.5">—</span>{f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </motion.div>
          )}

          {/* STEP 3 — Review */}
          {step === 3 && (
            <motion.div key="s3" variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <div className="bg-fog border border-gold/20 p-6 space-y-4 mb-6">
                <h3 className="font-serif text-lg text-wine mb-4">Order Summary</h3>
                {[
                  ['Recipient', values.recipientName],
                  ['Occasion', OCCASIONS.find(o => o.value === values.occasion)?.label],
                  ['Theme', THEMES.find(t => t.value === values.theme)?.label],
                  ['Music', MUSIC_OPTIONS.find(m => m.value === values.musicChoice)?.label],
                  ['Photos', `${photos.length} uploaded`],
                  ['Package', selectedPackage === 'signature' ? 'Signature Story — $15' : 'Luxe Film — $35'],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-dusty font-light">{label}</span>
                    <span className="text-wine font-medium">{val}</span>
                  </div>
                ))}
                <div className="border-t border-gold/20 pt-3 flex justify-between">
                  <span className="text-mauve font-medium text-sm">Total</span>
                  <span className="font-serif text-xl text-wine">${selectedPackage === 'signature' ? '15' : '35'}</span>
                </div>
              </div>
              <p className="text-xs text-dusty/70 font-light leading-relaxed">
                By proceeding, you agree to our terms. After payment, our team will begin crafting your story and deliver it within the promised timeframe.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className={`flex mt-8 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
          {step > 0 && (
            <Button type="button" variant="ghost" onClick={prevStep}>
              <ChevronLeft size={14} /> Back
            </Button>
          )}
          {step < 3 ? (
            <Button type="button" onClick={nextStep}>
              Continue <ChevronRight size={14} />
            </Button>
          ) : (
            <Button type="submit" loading={submitting} size="lg">
              Proceed to Payment →
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
