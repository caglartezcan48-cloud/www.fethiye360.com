'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { MenuSection } from './menu-section'
import { ProductModal } from './product-modal'
import Image from 'next/image'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  X, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Star,
  Bike,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  price: number
  description: string | null
  category?: string
  image_url?: string
}

interface CartItem extends Product {
  cartItemId: string
  quantity: number
  note?: string
}

interface OrderLayoutProps {
  products: Product[]
  businessName: string
  whatsappNumber?: string
  isFullMenuOpen?: boolean
  onCloseMenu?: () => void
  onlyOverlay?: boolean
  businessImage?: string
  description?: string
  avgRating?: string
  reviewCount?: number
}

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export function OrderLayout({ products, businessName, whatsappNumber, businessImage, description, avgRating, reviewCount }: OrderLayoutProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'Nakit' | 'Kart'>('Nakit')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Sepeti localStorage'dan yükle
  useEffect(() => {
    const saved = localStorage.getItem(`cart_${businessName}`)
    if (saved) {
      try {
        setCart(JSON.parse(saved))
      } catch (e) {
        console.error('Sepet yüklenemedi', e)
      }
    }
  }, [businessName])

  // Sepeti localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem(`cart_${businessName}`, JSON.stringify(cart))
  }, [cart, businessName])

  const addToCart = (product: Product, quantity: number = 1, note: string = '') => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.note === note)
      if (existingIndex > -1) {
        const newCart = [...prev]
        newCart[existingIndex] = { 
          ...newCart[existingIndex], 
          quantity: newCart[existingIndex].quantity + quantity 
        }
        return newCart
      }
      return [...prev, { 
        ...product, 
        cartItemId: Math.random().toString(36).substr(2, 9),
        quantity, 
        note 
      }]
    })
    toast.success(`${product.name} sepete eklendi`, {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      className: 'bg-slate-900 border border-white/10'
    })
  }

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId)
      if (existing?.quantity === 1) {
        return prev.filter(item => item.cartItemId !== cartItemId)
      }
      return prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: item.quantity - 1 } : item)
    })
  }

  const addOneMore = (cartItemId: string) => {
    setCart(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item))
  }

  const deleteFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId))
  }

  const clearCart = () => setCart([])

  const total = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = parseFloat(String(item.price || 0).replace(/[^0-9.-]+/g,"")) || 0
      const quantity = parseInt(String(item.quantity)) || 1
      return acc + (price * quantity)
    }, 0)
  }, [cart])

  const itemCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart])

  const handleCheckout = () => {
    if (cart.length === 0 || !whatsappNumber) return
    const message = `Merhaba, sipariş vermek istiyorum:\n\n${cart.map(item => `- ${item.quantity}x ${item.name}${item.note ? ` (${item.note})` : ''} - ${(parseFloat(String(item.price).replace(/[^0-9.-]+/g,"")) || 0) * item.quantity} TL`).join('\n')}\n\nToplam: ${total} TL\nÖdeme: ${paymentMethod}\n\nİşletme: ${businessName}`
    window.open(`https://wa.me/${whatsappNumber?.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Premium Restaurant Header */}
      <div className="relative">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 h-[320px] overflow-hidden bg-gradient-to-br from-slate-900 to-cyan-900/20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1a]/60 to-[#0a0f1a] z-10" />
          {businessImage && (
            <Image
              src={businessImage}
              alt={businessName}
              fill
              className="object-cover opacity-40 blur-sm scale-105"
              priority
            />
          )}
        </div>

        {/* Restaurant Info Card */}
        <div className="relative z-20 pt-8 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              {/* Logo/Image */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-[#0a0f1a] shadow-2xl bg-white/5 shrink-0 flex items-center justify-center">
                {businessImage ? (
                  <Image
                    src={businessImage}
                    alt={businessName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 opacity-20 text-white">
                    <Store className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Acik
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 text-white/70 rounded-full text-[10px] font-medium border border-white/10">
                    <Bike className="w-3 h-3" />
                    Paket Servis
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {businessName}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-white font-semibold">{avgRating || '5.0'}</span>
                    <span className="text-white/40">({reviewCount || 0}+)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>25-35 dk</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <span>Fethiye</span>
                  </div>
                </div>

                {description && (
                  <p className="text-sm text-white/50 max-w-2xl line-clamp-2">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32">
        <div className="flex gap-8">
          {/* Menu Section - Left */}
          <div className="flex-1 min-w-0" ref={scrollRef}>
            <MenuSection 
              products={products} 
              businessName={businessName} 
              onProductClick={(product) => setSelectedProduct(product)}
              onAddToCart={addToCart}
              cartItems={cart}
              theme="dark"
            />
          </div>

          {/* Cart Sidebar - Right (Desktop) */}
          <div className="hidden lg:block w-[380px] shrink-0">
            <div className="sticky top-24">
              <div className="bg-[#111827] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                {/* Cart Header */}
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Sepetim</h3>
                        <p className="text-xs text-white/40">{itemCount} urun</p>
                      </div>
                    </div>
                    {cart.length > 0 && (
                      <button 
                        onClick={clearCart} 
                        className="text-white/30 hover:text-rose-400 transition-colors p-2 hover:bg-white/5 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Cart Items */}
                <div className="max-h-[400px] overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-white/20" />
                      </div>
                      <p className="text-white/40 text-sm">Sepetiniz bos</p>
                      <p className="text-white/20 text-xs mt-1">Lezzetli urunleri kesfetmeye baslayin</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {cart.map((item) => (
                        <div 
                          key={item.cartItemId} 
                          className="flex gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-all"
                        >
                          {/* Item Image */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 shrink-0 relative">
                            {item.image_url ? (
                              <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/20">
                                <Sparkles className="w-5 h-5" />
                              </div>
                            )}
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-medium truncate">{item.name}</h4>
                            {item.note && (
                              <p className="text-amber-400/70 text-[10px] mt-0.5 truncate">Not: {item.note}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-cyan-400 font-semibold text-sm">
                                {(parseFloat(String(item.price || 0).replace(/[^0-9.-]+/g,"")) || 0) * item.quantity} TL
                              </span>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-1 bg-[#0a0f1a] rounded-lg p-1">
                                <button 
                                  onClick={() => removeFromCart(item.cartItemId)}
                                  className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-white text-xs font-medium">{item.quantity}</span>
                                <button 
                                  onClick={() => addOneMore(item.cartItemId)}
                                  className="w-6 h-6 flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Delete Button */}
                          <button 
                            onClick={() => deleteFromCart(item.cartItemId)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity self-start p-1 text-white/30 hover:text-rose-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart Footer */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-white/5 space-y-4">
                    {/* Payment Method */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPaymentMethod('Nakit')}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-medium transition-all ${
                          paymentMethod === 'Nakit'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <Banknote className="w-4 h-4" />
                        Nakit
                      </button>
                      <button
                        onClick={() => setPaymentMethod('Kart')}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-medium transition-all ${
                          paymentMethod === 'Kart'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        Kredi Karti
                      </button>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between py-3">
                      <span className="text-white/60 text-sm">Toplam</span>
                      <span className="text-2xl font-bold text-white">{total} <span className="text-sm text-white/40">TL</span></span>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.98]"
                    >
                      <WhatsappIcon className="w-5 h-5" />
                      Siparisi Tamamla
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cart Bar */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#0a0f1a]/95 backdrop-blur-xl border-t border-white/10">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-semibold text-sm flex items-center justify-between px-6 shadow-lg shadow-emerald-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <span>{itemCount} urun</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{total} TL</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}

      {/* Mobile Cart Drawer */}
      {isCartOpen && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-[#111827] rounded-t-3xl max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-[#111827] p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Sepetim</h3>
                  <p className="text-xs text-white/40">{itemCount} urun</p>
                </div>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="overflow-y-auto max-h-[50vh] p-4 space-y-3">
              {cart.map((item) => (
                <div 
                  key={item.cartItemId} 
                  className="flex gap-3 p-3 bg-white/5 rounded-2xl border border-white/5"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 shrink-0 relative">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">{item.name}</h4>
                    {item.note && <p className="text-amber-400/70 text-[10px] mt-0.5">Not: {item.note}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-cyan-400 font-semibold text-sm">
                        {(parseFloat(String(item.price || 0).replace(/[^0-9.-]+/g,"")) || 0) * item.quantity} TL
                      </span>
                      <div className="flex items-center gap-1 bg-[#0a0f1a] rounded-lg p-1">
                        <button onClick={() => removeFromCart(item.cartItemId)} className="w-6 h-6 flex items-center justify-center text-white/50">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-white text-xs font-medium">{item.quantity}</span>
                        <button onClick={() => addOneMore(item.cartItemId)} className="w-6 h-6 flex items-center justify-center text-cyan-400">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 space-y-4 bg-[#111827]">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod('Nakit')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-medium transition-all ${
                    paymentMethod === 'Nakit' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-white/50 border border-white/5'
                  }`}
                >
                  <Banknote className="w-4 h-4" /> Nakit
                </button>
                <button
                  onClick={() => setPaymentMethod('Kart')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-medium transition-all ${
                    paymentMethod === 'Kart' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-white/50 border border-white/5'
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Kredi Karti
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-white/60 text-sm">Toplam</span>
                <span className="text-2xl font-bold text-white">{total} <span className="text-sm text-white/40">TL</span></span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20"
              >
                <WhatsappIcon className="w-5 h-5" />
                Siparisi Tamamla
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        theme="dark"
      />
    </div>
  )
}
