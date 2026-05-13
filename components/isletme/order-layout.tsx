'use client'

import { useState, useMemo } from 'react'
import { MenuSection } from './menu-section'
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle, CreditCard, Banknote } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  description: string | null
  category?: string
  image_url?: string
}

interface CartItem extends Product {
  quantity: number
}

interface OrderLayoutProps {
  products: Product[]
  businessName: string
  whatsappNumber?: string
}

export function OrderLayout({ products, businessName, whatsappNumber }: OrderLayoutProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'Nakit' | 'Kart'>('Nakit')

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId)
      if (existing?.quantity === 1) {
        return prev.filter(item => item.id !== productId)
      }
      return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item)
    })
  }

  const clearCart = () => setCart([])

  const total = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart])

  const handleCheckout = () => {
    if (cart.length === 0 || !whatsappNumber) return

    let message = `*YENİ SİPARİŞ - ${businessName}*\n\n`
    cart.forEach(item => {
      message += `• ${item.quantity} x ${item.name} - ${item.price * item.quantity} TL\n`
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
          onAddToCart={addToCart}
          cartItems={cart}
        />
      </div>

      {/* Sağ Taraf: Canlı Sepet */}
      <div className="lg:col-span-4">
        <div className="sticky top-32 space-y-6">
          <div className="bg-[#112240] border border-[#64ffda]/20 rounded-[40px] p-8 shadow-2xl shadow-[#64ffda]/5">
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
                <div key={item.id} className="flex items-center justify-between group">
                  <div className="flex-1">
                    <p className="text-white text-[11px] font-bold uppercase tracking-tight line-clamp-1">{item.name}</p>
                    <p className="text-[#64ffda] text-[10px] font-black mt-0.5">{item.price * item.quantity} TL</p>
                  </div>
                  <div className="flex items-center gap-3 bg-[#0a192f] rounded-xl px-2 py-1 border border-white/5">
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-white"><Minus className="w-3 h-3" /></button>
                    <span className="text-white text-[10px] font-black w-4 text-center">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="text-[#64ffda] hover:scale-110"><Plus className="w-3 h-3" /></button>
                  </div>
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

                <div className="flex items-center justify-between px-2">
                  <span className="text-slate-400 text-[10px] font-black uppercase">Toplam</span>
                  <span className="text-white text-2xl font-black italic tracking-tighter">{total} TL</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full py-5 bg-[#64ffda] text-[#0a192f] rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-[#64ffda]/20 flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-5 h-5" /> SİPARİŞİ TAMAMLA
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
