import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { ShoppingCart, Truck, ArrowLeft, Package } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface CheckoutForm {
  recipientName: string
  recipientPhone: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
}

declare global {
  interface Window { Razorpay: any }
}

const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
]

export default function GiftCheckoutPage() {
  const { items, total, totalDisplay, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>()

  const SHIPPING = items.length > 0 ? 9900 : 0 // ₹99 shipping, waived if cart empty
  const FREE_SHIPPING_THRESHOLD = 199900 // Free above ₹1,999
  const freeShipping = total() >= FREE_SHIPPING_THRESHOLD
  const grandTotal = total() + (freeShipping ? 0 : SHIPPING)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="text-5xl">🛍️</div>
        <h2 className="font-serif text-wine text-2xl font-light">Your bag is empty</h2>
        <Link to="/gifts" className="bg-wine text-cream px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-mauve transition-colors">
          Browse Gifts
        </Link>
      </div>
    )
  }

  const onSubmit = async (data: CheckoutForm) => {
    if (!user) { navigate('/login'); return }
    setLoading(true)
    try {
      // Create Razorpay order
      const { data: order } = await api.post('/gift-orders/create-payment', {
        amount: grandTotal,
        items: items.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          giftNote: i.giftNote || '',
        })),
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        deliveryAddress: {
          line1: data.line1,
          line2: data.line2,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        },
      })

      const rzp = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: 'INR',
        name: 'WishStory',
        description: `Gift order — ${items.length} item${items.length > 1 ? 's' : ''}`,
        order_id: order.orderId,
        prefill: { name: user.name, email: user.email, contact: data.recipientPhone },
        theme: { color: '#6b3d38' },
        handler: async (response: any) => {
          try {
            await api.post('/gift-orders/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              giftOrderId: order.giftOrderId,
            })
            clearCart()
            toast.success('Order placed! Your gifts are on their way 🎁')
            navigate('/dashboard/my-gifts')
          } catch {
            toast.error('Payment verification failed. Contact support.')
          }
        },
      })
      rzp.open()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-fog">
      {/* Coming soon overlay — covers checkout and blurs background */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-cream/70 backdrop-blur-md" />
        <div className="relative z-10 text-center px-6">
          <h2 className="font-serif text-wine text-3xl mb-2">Coming soon</h2>
          <p className="text-mauve text-sm">Checkout for gifts will be available soon. Stay tuned!</p>
        </div>
      </div>
      {/* Header */}
      <div className="bg-cream border-b border-gold/20 px-[5%] py-4 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl text-wine">Wish<span className="text-gold">Story</span></Link>
        <div className="flex items-center gap-2 text-sm text-mauve font-light">
          <ShoppingCart size={14} className="text-wine" />
          Checkout
        </div>
      </div>

      <div className="px-[5%] py-10 max-w-5xl mx-auto">
        <Link to="/gifts" className="inline-flex items-center gap-1.5 text-[11px] text-dusty hover:text-wine transition-colors mb-8">
          <ArrowLeft size={12} /> Back to Gift Shop
        </Link>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-cream border border-gold/20 p-6">
              <h2 className="font-serif text-wine text-xl mb-5">Delivery Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="label">Recipient Name *</label>
                  <input {...register('recipientName', { required: 'Name is required' })}
                    className="input-field" placeholder="Who are we delivering to?" />
                  {errors.recipientName && <p className="text-red-500 text-[11px] mt-1">{errors.recipientName.message}</p>}
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="label">Phone Number *</label>
                  <input {...register('recipientPhone', {
                    required: 'Phone is required',
                    pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit number' }
                  })}
                    className="input-field" placeholder="10-digit mobile number" />
                  {errors.recipientPhone && <p className="text-red-500 text-[11px] mt-1">{errors.recipientPhone.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="label">Address Line 1 *</label>
                  <input {...register('line1', { required: 'Address is required' })}
                    className="input-field" placeholder="Flat / House No., Building Name, Street" />
                  {errors.line1 && <p className="text-red-500 text-[11px] mt-1">{errors.line1.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="label">Address Line 2 (optional)</label>
                  <input {...register('line2')} className="input-field" placeholder="Area, Landmark" />
                </div>
                <div>
                  <label className="label">City *</label>
                  <input {...register('city', { required: 'City is required' })} className="input-field" placeholder="City" />
                  {errors.city && <p className="text-red-500 text-[11px] mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="label">Pincode *</label>
                  <input {...register('pincode', {
                    required: 'Pincode required',
                    pattern: { value: /^\d{6}$/, message: '6-digit pincode' }
                  })} className="input-field" placeholder="6-digit pincode" maxLength={6} />
                  {errors.pincode && <p className="text-red-500 text-[11px] mt-1">{errors.pincode.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="label">State *</label>
                  <select {...register('state', { required: 'State is required' })} className="input-field">
                    <option value="">Select state</option>
                    {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-red-500 text-[11px] mt-1">{errors.state.message}</p>}
                </div>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: .98 }}
              className="w-full bg-wine text-cream py-4 text-xs tracking-widest uppercase hover:bg-mauve transition-colors disabled:opacity-60 flex items-center justify-center gap-3"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Processing…</>
              ) : (
                <>Place Order · ₹{(grandTotal / 100).toLocaleString('en-IN')}</>
              )}
            </motion.button>
          </form>

          {/* ── ORDER SUMMARY ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: .1 } }}
            className="h-fit bg-cream border border-gold/20"
          >
            <div className="px-5 py-4 border-b border-gold/15">
              <h3 className="font-serif text-wine text-base font-normal">Order Summary</h3>
            </div>
            <div className="px-5 py-4 space-y-4">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-3">
                  <img src={item.product.images[0]} alt="" className="w-14 h-14 object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-wine font-light leading-snug truncate">{item.product.name}</p>
                    <p className="text-[11px] text-dusty">Qty: {item.quantity}</p>
                    {item.giftNote && <p className="text-[10px] text-gold italic truncate">"{item.giftNote}"</p>}
                  </div>
                  <p className="text-sm text-wine font-light whitespace-nowrap">
                    ₹{((item.product.price * item.quantity) / 100).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-gold/12 space-y-2">
              <div className="flex justify-between text-sm text-mauve font-light">
                <span>Subtotal</span>
                <span>{totalDisplay()}</span>
              </div>
              <div className="flex justify-between text-sm text-mauve font-light">
                <span>Shipping</span>
                <span className={freeShipping ? 'text-green-600' : ''}>
                  {freeShipping ? 'Free' : '₹99'}
                </span>
              </div>
              {!freeShipping && (
                <p className="text-[10px] text-dusty">
                  Add ₹{((FREE_SHIPPING_THRESHOLD - total()) / 100).toLocaleString('en-IN')} more for free shipping
                </p>
              )}
            </div>
            <div className="px-5 py-4 border-t border-gold/20 flex justify-between items-center">
              <span className="font-serif text-wine">Total</span>
              <span className="font-serif text-wine text-xl">₹{(grandTotal / 100).toLocaleString('en-IN')}</span>
            </div>

            <div className="px-5 pb-5 space-y-2 text-[11px] text-dusty font-light">
              <div className="flex items-center gap-2"><Truck size={11} />Free gift wrapping on all orders</div>
              <div className="flex items-center gap-2"><Package size={11} />Arrives in premium packaging</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
