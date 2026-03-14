// ── AUTH ──
export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

// ── STORY ──
export type StoryStatus = 'submitted' | 'in-production' | 'review' | 'completed'
export type Occasion = 'birthday' | 'romantic' | 'friendship' | 'family' | 'celebration' | 'memorial'
export type Package  = 'signature' | 'luxe'
export type Theme    = 'warm' | 'cinematic' | 'elegant' | 'playful' | 'melancholic' | 'joyful'

export interface Story {
  _id: string
  userId: string
  clientName: string
  clientEmail: string
  recipientName: string
  occasion: Occasion
  theme: Theme
  storyDetails: string
  uploadedPhotos: string[]
  musicChoice: string
  packageType: Package
  packagePrice: number
  paymentStatus: 'pending' | 'paid' | 'failed'
  paymentId?: string
  status: StoryStatus
  storyLink?: string
  passwordProtected?: boolean
  storyPassword?: string
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

// ── PAYMENT ──
export interface RazorpayOrder {
  orderId: string
  amount: number
  currency: string
  key: string
}

export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

// ── FORMS ──
export interface StoryFormData {
  recipientName: string
  occasion: Occasion
  theme: Theme
  storyDetails: string
  musicChoice: string
  packageType: Package
  photos: File[]
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// ── API ──
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// ── ADMIN ──
export interface AdminStats {
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  totalRevenue: number
  recentOrders: Story[]
}
