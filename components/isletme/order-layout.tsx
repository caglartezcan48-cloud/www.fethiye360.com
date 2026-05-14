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
  isFullMenuOpen?: boolean
  onCloseMenu?: () => void
  onlyOverlay?: boolean // Yeni: Sadece tam ekran katalog modunu aktif eder
}

export function OrderLayout({ products, businessName, whatsappNumber, isFullMenuOpen, onCloseMenu, onlyOverlay }: OrderLayoutProps) {
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
    if (cart.length === 0) return
    const message = `Merhaba, sipariş vermek istiyorum:\n\n${cart.map(item => `- ${item.quantity}x ${item.name}${item.note ? ` (${item.note})` : ''} - ${item.price * item.quantity} TL`).join('\n')}\n\nToplam: ${total} TL\nÖdeme: ${paymentMethod}\n\nİşletme: ${businessName}`
    window.open(`https://wa.me/${whatsappNumber?.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
  }

  // --- NEW UI RENDERING (Lovable Style) ---
  
  if (onlyOverlay) {
    // Mobile/Full-screen Catalog Mode
    return (
      <>
        {isFullMenuOpen && (
          <div className="fixed inset-0 z-[150] bg-[#0a192f] animate-in fade-in slide-in-from-bottom duration-500 overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-[#0a192f]/80 backdrop-blur-xl border-b border-white/5 px-6 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#64ffda] flex items-center justify-center text-[#0a192f] font-black">
                    {businessName[0]}
                  </div>
                  <div>
                    <h2 className="text-white font-black uppercase tracking-widest text-[10px] italic">{businessName}</h2>
                    <p className="text-[#64ffda] text-[8px] font-bold uppercase tracking-widest">DİJİTAL KATALOG</p>
                  </div>
              </div>
              <button 
                onClick={onCloseMenu}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
              >
                <Trash2 className="w-4 h-4 rotate-45" />
              </button>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-12">
               <MenuSection 
                 products={products} 
                 businessName={businessName} 
                 onProductClick={(product) => setSelectedProduct(product)}
                 cartItems={cart}
               />
            </div>
          </div>
        )}

        <ProductModal 
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a192f]">
      {/* Horizontal Sticky Categories */}
      <div className="sticky top-[80px] z-[40] bg-[#0a192f]/80 backdrop-blur-xl border-b border-white/5 py-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar flex items-center gap-2">
           {Array.from(new Set(products.map(p => p.category))).map((cat) => (
             <button 
               key={cat}
               onClick={() => document.getElementById(`cat-${cat}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
               className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-widest hover:bg-[#64ffda] hover:text-[#0a192f] transition-all whitespace-nowrap"
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Menu Section */}
          <div className="lg:col-span-8">
            <MenuSection 
              products={products} 
              businessName={businessName} 
              onProductClick={(product) => setSelectedProduct(product)}
              cartItems={cart}
            />
          </div>

          {/* Premium Floating/Sidebar Cart */}
          <div className="lg:col-span-4">
            <div className="sticky top-[160px] bg-[#112240] rounded-[40px] border border-white/10 p-8 shadow-2xl shadow-black/50">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda]">
                       <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase tracking-widest text-xs">Sepetim</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{cart.length} Ürün</p>
                    </div>
                  </div>
                  {cart.length > 0 && (
                    <button onClick={clearCart} className="text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
               </div>

               <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar mb-8">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group transition-all hover:bg-white/10">
                       <div className="flex-1">
                          <p className="text-white text-[11px] font-black uppercase tracking-tight line-clamp-1">{item.name}</p>
                          <p className="text-[#64ffda] text-[10px] font-black mt-0.5">{item.price * item.quantity} TL</p>
                       </div>
                       <div className="flex items-center gap-3 bg-[#0a192f] rounded-xl px-3 py-1.5 border border-white/10">
                          <button onClick={() => removeFromCart(item.cartItemId)} className="text-slate-500 hover:text-white"><Minus className="w-3 h-3" /></button>
                          <span className="text-white text-[10px] font-black w-4 text-center">{item.quantity}</span>
                          <button onClick={() => addOneMore(item.cartItemId)} className="text-[#64ffda] hover:scale-110"><Plus className="w-3 h-3" /></button>
                       </div>
                    </div>
                  ))}

                  {cart.length === 0 && (
                    <div className="py-20 text-center space-y-6">
                       <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-10">
                          <ShoppingCart className="w-10 h-10 text-white" />
                       </div>
                       <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Lezzet Seçmeye Başlayın</p>
                    </div>
                  )}
               </div>

               {cart.length > 0 && (
                 <div className="space-y-6 border-t border-white/5 pt-8">
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setPaymentMethod('Nakit')}
                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          paymentMethod === 'Nakit' ? 'bg-[#64ffda] text-[#0a192f] border-[#64ffda]' : 'bg-white/5 text-slate-500 border-white/5'
                        }`}
                      >
                        <Banknote className="w-4 h-4" /> Nakit
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('Kart')}
                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          paymentMethod === 'Kart' ? 'bg-[#64ffda] text-[#0a192f] border-[#64ffda]' : 'bg-white/5 text-slate-500 border-white/5'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" /> K. Kartı
                      </button>
                    </div>

                    <div className="flex items-center justify-between px-2">
                       <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Ödenecek Tutar</span>
                       <span className="text-[#64ffda] text-3xl font-black italic tracking-tighter">{total} TL</span>
                    </div>

                    <button 
                      onClick={handleCheckout}
                      className="w-full py-6 bg-[#64ffda] text-[#0a192f] rounded-[32px] font-black uppercase tracking-[0.2em] text-[11px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-[#64ffda]/20 flex items-center justify-center gap-3"
                    >
                      SİPARİŞİ TAMAMLA <Plus className="w-4 h-4" />
                    </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      <ProductModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />
    </div>
  )
}
