// ── GIFT CATALOG ──
export type GiftCategory =
  | 'soft-toys'
  | 'home-decor'
  | 'perfumes'
  | 'candles'
  | 'jewellery'
  | 'chocolates'
  | 'skincare'
  | 'plants'
  | 'books'
  | 'custom'

export interface GiftProduct {
  id: string
  name: string
  tagline: string
  description: string
  category: GiftCategory
  price: number
  priceDisplay: string
  images: string[]
  badge?: string
  tags: string[]
  inStock: boolean
  rating: number
  reviewCount: number
  occasions: string[]
  deliveryDays: number
  storyBundle?: boolean
  bundleDiscount?: number
}

export interface CartItem {
  product: GiftProduct
  quantity: number
  giftNote?: string
}

export interface CartState {
  items: CartItem[]
  addItem: (product: GiftProduct, qty?: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
  total: () => number
  totalDisplay: () => string
  itemCount: () => number
}

export type GiftOrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered'

export interface GiftOrder {
  _id: string
  userId: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
    giftNote?: string
  }>
  recipientName: string
  recipientPhone: string
  deliveryAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
  }
  totalAmount: number
  paymentStatus: 'pending' | 'paid' | 'failed'
  paymentId?: string
  orderStatus: GiftOrderStatus
  bundledStoryId?: string
  bundleDiscount?: number
  trackingId?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}
