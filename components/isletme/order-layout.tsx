'use client'

import { useState, useMemo } from 'react'
import { MenuSection } from './menu-section'
import { ProductModal } from './product-modal'
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle, CreditCard, Banknote, X, ChevronRight } from 'lucide-react'
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
    const message = `Merhaba, sipariş vermek istiyorum:\n\n${cart.map(item => `- ${item.quantity}x ${item.name}${item.note ? ` (${item.note})` : ''} - ${item.price * item.quantity} TL`).join('\n')}\n\nToplam: ${total} TL\nÖdeme: ${paymentMethod}\n\nİşletme: ${businessName}`
    window.open(`https://wa.me/${whatsappNumber?.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
  }

  // --- NEW UI RENDERING (Lovable Style) ---
  
  if (onlyOverlay) {
    // --- PREMIUM CATALOG MODE (Lovable Style - Light & Orange) ---
    return (
      <>
        {isFullMenuOpen && (
          <div className="fixed inset-0 z-[150] bg-[#fdfaf5] animate-in fade-in slide-in-from-bottom duration-700 overflow-y-auto no-scrollbar selection:bg-orange-200">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-[#fdfaf5]/80 backdrop-blur-2xl border-b border-orange-100 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#ea580c] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200">
                    {businessName[0]}
                  </div>
                  <div>
                    <h2 className="text-[#1a1a1a] font-black uppercase tracking-[0.3em] text-[11px] italic leading-tight">{businessName}</h2>
                    <p className="text-[#ea580c] text-[9px] font-black uppercase tracking-[0.4em] opacity-80">GÜNCEL DİJİTAL KATALOG</p>
                  </div>
              </div>
              <button 
                onClick={onCloseMenu}
                className="w-14 h-14 rounded-3xl bg-white border border-orange-100 flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:border-orange-200 hover:text-[#ea580c] transition-all group shadow-sm"
              >
                <X className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16 space-y-20 relative">
               {/* Background Texture Placeholder */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#ea580c 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />

               {/* Hero Header */}
               <div className="text-center space-y-6">
                  <div className="inline-block px-4 py-1.5 bg-orange-100 border border-orange-200 rounded-full text-[#ea580c] text-[8px] font-black uppercase tracking-[0.5em] mb-4">
                    Hoş Geldiniz
                  </div>
                  <h1 className="text-5xl md:text-8xl font-black text-[#1a1a1a] italic tracking-tighter uppercase leading-[0.85] flex flex-col items-center">
                    <span>LEZZET</span>
                    <span className="text-[#ea580c] -mt-2">DOLU</span>
                    <span className="text-4xl md:text-6xl text-slate-200 -mt-2">DENEYİM</span>
                  </h1>
               </div>

               {/* Category Nav for Catalog */}
               <div className="flex flex-wrap justify-center gap-3">
                  {Array.from(new Set(products.map(p => p.category))).map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => document.getElementById(`cat-${cat}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                      className="px-6 py-3 bg-white border border-orange-100 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-[#ea580c] hover:text-white hover:border-[#ea580c] transition-all shadow-sm"
                    >
                      {cat}
                    </button>
                  ))}
               </div>

               <div className="space-y-24">
                 <MenuSection 
                   products={products} 
                   businessName={businessName} 
                   onProductClick={(product) => setSelectedProduct(product)}
                   cartItems={cart}
                   viewMode="catalog"
                   theme="light"
                 />
               </div>

               <div className="py-20 text-center border-t border-orange-100">
                  <p className="text-slate-300 text-[9px] font-black uppercase tracking-[0.8em]">FETHIYE360 DİJİTAL MENÜ SİSTEMİ</p>
               </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-6">
               <button 
                 onClick={onCloseMenu}
                 className="w-full bg-[#ea580c] text-white p-6 rounded-[32px] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-orange-300/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-between"
               >
                 <span className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white text-[#ea580c] flex items-center justify-center text-[10px]">
                      {cart.length}
                    </div>
                    SEPETE DÖN
                 </span>
                 <span className="text-base italic tracking-tighter">{total} TL</span>
               </button>
            </div>
          </div>
        )}

        <ProductModal 
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          theme="light"
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a192f]">
      <div className="max-w-7xl mx-auto px-6 pt-2 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Menu Section */}
          <div className="lg:col-span-8">
            <MenuSection 
              products={products} 
              businessName={businessName} 
              onProductClick={(product) => setSelectedProduct(product)}
              cartItems={cart}
              theme="dark"
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
        theme="dark"
      />
    </div>
  )
}
