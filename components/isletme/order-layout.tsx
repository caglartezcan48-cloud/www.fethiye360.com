'use client'

import { useState, useMemo } from 'react'
import { MenuSection } from './menu-section'
import { ProductModal } from './product-modal'
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle, CreditCard, Banknote } from 'lucide-react'
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
}

export function OrderLayout({ products, businessName, whatsappNumber }: OrderLayoutProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'Nakit' | 'Kart'>('Nakit')

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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
    toast.success(`${product.name} sepete eklendi`)
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

  const clearCart = () => setCart([])

  const total = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart])

  const handleCheckout = () => {
    if (cart.length === 0 || !whatsappNumber) return

    let message = `*YENİ SİPARİŞ - ${businessName}*\n\n`
    cart.forEach(item => {
      message += `• ${item.quantity} x ${item.name} - ${item.price * item.quantity} TL\n`
      if (item.note) {
        message += `  _Not: ${item.note}_\n`
      }
    })
    message += `\n*TOPLAM TUTAR:* ${total} TL`
    message += `\n*ÖDEME YÖNTEMİ:* Kapıda ${paymentMethod}`
    message += `\n\n_Siparişim hakkında onay bekliyorum._`

    window.open(`https://wa.me/${whatsappNumber.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      {/* Sol Taraf: Menü */}
      <div className="lg:col-span-8">
        <MenuSection 
          products={products} 
          businessName={businessName} 
          onProductClick={(product) => setSelectedProduct(product)}
          cartItems={cart}
        />
      </div>

      <ProductModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      {/* Sağ Taraf: Canlı Sepet (Yemeksepeti Style) */}
      <div className="lg:col-span-4">
        <div className="sticky top-[80px] space-y-6">
          <div className="bg-[#112240] rounded-2xl p-6 shadow-2xl border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda]">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <h4 className="text-white font-black uppercase tracking-widest text-xs">Sepetim</h4>
              </div>
              {cart.length > 0 && (
                <button onClick={clearCart} className="text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex flex-col gap-2 p-3 bg-white/5 rounded-2xl border border-white/5 group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-white text-[11px] font-bold uppercase tracking-tight line-clamp-1">{item.name}</p>
                      <p className="text-[#64ffda] text-[10px] font-black mt-0.5">{item.price * item.quantity} TL</p>
                    </div>
                    <div className="flex items-center gap-3 bg-[#0a192f] rounded-xl px-2 py-1 border border-white/5">
                      <button onClick={() => removeFromCart(item.cartItemId)} className="text-slate-500 hover:text-white"><Minus className="w-3 h-3" /></button>
                      <span className="text-white text-[10px] font-black w-4 text-center">{item.quantity}</span>
                      <button onClick={() => addOneMore(item.cartItemId)} className="text-[#64ffda] hover:scale-110"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                  {item.note && (
                    <div className="flex items-start gap-2 text-[9px] text-slate-500 bg-black/20 p-2 rounded-lg italic">
                      <MessageCircle className="w-3 h-3 shrink-0 mt-0.5" />
                      {item.note}
                    </div>
                  )}
                </div>
              ))}

              {cart.length === 0 && (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                    <ShoppingCart className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Sepetiniz Boş</p>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-10 pt-8 border-t border-white/5 space-y-6">
                {/* Ödeme Yöntemi */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setPaymentMethod('Nakit')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                      paymentMethod === 'Nakit' ? 'bg-[#64ffda] text-[#0a192f] border-[#64ffda]' : 'bg-white/5 text-slate-500 border-white/5'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" /> Nakit
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('Kart')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                      paymentMethod === 'Kart' ? 'bg-[#64ffda] text-[#0a192f] border-[#64ffda]' : 'bg-white/5 text-slate-500 border-white/5'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" /> K. Kartı
                  </button>
                </div>

                <div className="flex items-center justify-between px-1">
                  <span className="text-slate-400 text-sm font-bold">Toplam</span>
                  <span className="text-[#64ffda] text-xl font-black">{total} TL</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-[#64ffda] text-[#0a192f] rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  SİPARİŞİ ONAYLA
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
