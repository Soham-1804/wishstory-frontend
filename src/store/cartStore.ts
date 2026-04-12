import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartState, GiftProduct } from '@/types/gifts'
import { formatPrice } from '@/lib/giftData'

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: GiftProduct, qty = 1) => {
        const items = get().items
        const existing = items.find(i => i.product.id === product.id)
        if (existing) {
          set({ items: items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i) })
        } else {
          set({ items: [...items, { product, quantity: qty }] })
        }
      },

      removeItem: (productId: string) =>
        set({ items: get().items.filter(i => i.product.id !== productId) }),

      updateQty: (productId: string, qty: number) => {
        if (qty <= 0) { get().removeItem(productId); return }
        set({ items: get().items.map(i => i.product.id === productId ? { ...i, quantity: qty } : i) })
      },

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      totalDisplay: () => formatPrice(get().total()),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'wishstory-cart' }
  )
)
