'use client'

import { useState, useMemo, useEffect } from 'react'
import { MenuSection } from './menu-section'
import { ProductModal } from './product-modal'
import { Header as SiteHeader } from '@/components/fethiye/header'
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

  // --- SEPETİ HAFIZADA TUT (LocalStorage Entegrasyonu) ---
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

  const total = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = parseFloat(String(item.price || 0).replace(/[^0-9.-]+/g,"")) || 0
      const quantity = parseInt(String(item.quantity)) || 1
      return acc + (price * quantity)
    }, 0)
  }, [cart])

  const handleCheckout = () => {
    if (cart.length === 0 || !whatsappNumber) return
    const message = `Merhaba, sipariş vermek istiyorum:\n\n${cart.map(item => `- ${item.quantity}x ${item.name}${item.note ? ` (${item.note})` : ''} - ${(parseFloat(String(item.price).replace(/[^0-9.-]+/g,"")) || 0) * item.quantity} TL`).join('\n')}\n\nToplam: ${total} TL\nÖdeme: ${paymentMethod}\n\nİşletme: ${businessName}`
    window.open(`https://wa.me/${whatsappNumber?.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
  }

  // --- NEW UI RENDERING (Lovable Style) ---
  
  if (onlyOverlay) {
    // --- PREMIUM CATALOG MODE (Lovable Style - Light & Orange) ---
    return (
      <>
        {isFullMenuOpen && (
          <div className="fixed inset-0 z-[150] bg-[#0a192f] animate-in fade-in slide-in-from-bottom duration-700 overflow-y-auto no-scrollbar selection:bg-orange-200">
            {/* Site Navbar */}
            <SiteHeader />

            <div className="max-w-7xl mx-auto px-4 md:px-6 mt-20 mb-20 relative">
              {/* Beyaz Menü Zemini - Desenli ve Sıcak (Flu Desen) */}
              <div className="bg-[#fdfaf5] rounded-[48px] shadow-2xl overflow-hidden relative min-h-screen border border-orange-100/50">
                {/* Flu Desen (Subtle Warm Blurred Pattern) */}
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none -z-10" 
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ea580c' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='50' cy='50' r='20'/%3E%3Ccircle cx='150' cy='150' r='20'/%3E%3Ccircle cx='150' cy='50' r='10'/%3E%3Ccircle cx='50' cy='150' r='10'/%3E%3C/g%3E%3C/svg%3E")`,
                    filter: 'blur(20px)',
                    backgroundSize: '400px 400px'
                  }} 
                />
                {/* Secondary texture for 'antetli' feel */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#ea580c 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="px-6 py-8 space-y-12 relative">


               <div className="space-y-24">
                 <MenuSection 
                   products={products} 
                   businessName={businessName} 
                   onProductClick={(product) => setSelectedProduct(product)}
                   onAddToCart={addToCart}
                   cartItems={cart}
                   viewMode="catalog"
                   theme="light"
                 />
               </div>

               {/* Sepet Özet Listesi (Katalog İçinde Görünür Yapıldı) */}
               {cart.length > 0 && (
                 <div className="fixed bottom-32 right-10 z-[60] w-72 animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] p-6 shadow-2xl border border-orange-100/50 space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ea580c] mb-2">SEPETİNİZDEKİLER</p>
                       {cart.map((item) => {
                         const itemPrice = parseFloat(String(item.price || 0).replace(/[^0-9.-]+/g,"")) || 0
                         const itemQuantity = parseInt(String(item.quantity)) || 1
                         
                         return (
                           <div key={item.cartItemId} className="flex items-center justify-between gap-3 animate-in fade-in slide-in-from-right-4 group">
                              <div className="flex-1">
                                 <p className="text-[#1a1a1a] text-[11px] font-black uppercase tracking-tight">{item.name}</p>
                                 {item.note && <p className="text-[#ea580c] text-[8px] font-medium italic">"{item.note}"</p>}
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="flex items-center gap-2 bg-slate-50 rounded-full px-2 py-1 border border-slate-100">
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); removeFromCart(item.cartItemId) }}
                                     className="text-slate-400 hover:text-red-500 transition-colors"
                                   >
                                     <Minus className="w-3 h-3" />
                                   </button>
                                   <span className="text-[10px] font-black text-[#1a1a1a] w-4 text-center">{itemQuantity}</span>
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); addOneMore(item.cartItemId) }}
                                     className="text-[#ea580c] hover:scale-110 transition-transform"
                                   >
                                     <Plus className="w-3 h-3" />
                                   </button>
                                 </div>
                                 <div className="text-right min-w-[60px]">
                                   <p className="text-[11px] font-black text-[#1a1a1a]">{itemPrice * itemQuantity} TL</p>
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); setCart(prev => prev.filter(i => i.cartItemId !== item.cartItemId)) }}
                                     className="text-[8px] font-bold text-slate-300 hover:text-red-500 uppercase tracking-tighter"
                                   >
                                     SİL
                                   </button>
                                 </div>
                              </div>
                           </div>
                         )
                       })}
                    </div>
                 </div>
               )}

               {/* Sepete Dön Butonu - Hareketli (Bobbing) Efekt Eklendi */}
               <div className="fixed bottom-10 right-10 z-[60] animate-bounce-slow">
                  <button 
                    onClick={onCloseMenu}
                    className="bg-[#ea580c] text-white px-8 py-5 rounded-[32px] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-orange-400/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-6 border-4 border-white"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xs">{cart.length}</div>
                    SEPETE DÖN
                    <span className="text-white/60">{total} TL</span>
                  </button>
               </div>

               <div className="py-20 text-center border-t border-orange-100">
                  <p className="text-slate-300 text-[9px] font-black uppercase tracking-[0.8em]">FETHIYE360 DİJİTAL MENÜ SİSTEMİ</p>
               </div>
                </div>
              </div>
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
              onAddToCart={addToCart}
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
                          <p className="text-[#64ffda] text-[10px] font-black mt-0.5">
                            {(parseFloat(String(item.price).replace(/[^0-9.-]+/g,"")) || 0) * item.quantity} TL
                          </p>
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
