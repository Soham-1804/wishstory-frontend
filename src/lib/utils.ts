import type { Occasion, Package, StoryStatus, Theme } from '@/types'

export const PACKAGES = {
  signature: { name: 'Signature Story', price: 15, priceINR: 1250 },
  luxe:      { name: 'Luxe Film',       price: 35, priceINR: 2900 },
} as const

export const OCCASIONS: { value: Occasion; label: string; emoji: string }[] = [
  { value: 'birthday',    label: 'Birthday',    emoji: '🎂' },
  { value: 'romantic',    label: 'Romantic',    emoji: '💌' },
  { value: 'friendship',  label: 'Friendship',  emoji: '🤝' },
  { value: 'family',      label: 'Family',      emoji: '🌿' },
  { value: 'celebration', label: 'Celebration', emoji: '✨' },
  { value: 'memorial',    label: 'Memorial',    emoji: '🕯️' },
]

export const THEMES: { value: Theme; label: string; desc: string }[] = [
  { value: 'warm',        label: 'Warm & Cozy',     desc: 'Golden, nostalgic, hearth-lit' },
  { value: 'cinematic',   label: 'Cinematic',       desc: 'Dark, dramatic, film-like' },
  { value: 'elegant',     label: 'Elegant',         desc: 'Refined, minimal, luxurious' },
  { value: 'playful',     label: 'Playful',         desc: 'Light, bright, joyful' },
  { value: 'melancholic', label: 'Bittersweet',     desc: 'Tender, wistful, emotional' },
  { value: 'joyful',      label: 'Joyful',          desc: 'Celebratory, vibrant, alive' },
]

export const MUSIC_OPTIONS = [
  { value: 'none',             label: 'No music' },
  { value: 'piano-gentle',     label: 'Gentle Piano' },
  { value: 'strings-emotional',label: 'Emotional Strings' },
  { value: 'acoustic-guitar',  label: 'Acoustic Guitar' },
  { value: 'cinematic-ambient',label: 'Cinematic Ambient' },
  { value: 'soft-jazz',        label: 'Soft Jazz' },
  { value: 'orchestral',       label: 'Orchestral Swell' },
]

export const STATUS_MAP: Record<StoryStatus, { label: string; color: string; bg: string }> = {
  submitted:     { label: 'Submitted',      color: '#1d4ed8', bg: '#eff6ff' },
  'in-production':{ label: 'In Production', color: '#b45309', bg: '#fffbeb' },
  review:        { label: 'Under Review',   color: '#7c3aed', bg: '#f5f3ff' },
  completed:     { label: 'Completed',      color: '#065f46', bg: '#ecfdf5' },
}

export const PACKAGE_FEATURES: Record<Package, string[]> = {
  signature: [
    'Curated memory sequence',
    'Refined personal letter',
    'Background music',
    'Cinematic transitions',
    'Private viewing link',
    'Delivery within 24 hours',
  ],
  luxe: [
    'Unlimited memories',
    'Emotionally refined letter',
    'Advanced cinematic transitions',
    'Custom typography',
    'Password protected page',
    'HD cinematic experience',
    'Delivery within 12 hours',
  ],
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(dateStr))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency, maximumFractionDigits: 0
  }).format(amount)
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
