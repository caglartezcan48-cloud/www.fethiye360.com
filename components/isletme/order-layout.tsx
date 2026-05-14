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
  onlyOverlay?: boolean
}

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

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

  // --- NEW UI RENDERING (Unified Hybrid Style) ---
  
  return (
    <div className="fixed inset-0 z-[150] bg-[#0a192f] animate-in fade-in slide-in-from-bottom duration-700 overflow-y-auto no-scrollbar selection:bg-orange-200">
      {/* Site Navbar */}
      <SiteHeader />

      <div className="max-w-[1600px] mx-auto px-4 md:px-10 mt-32 mb-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SOL TARAF: KATALOG VEYA STANDART LİSTE */}
          <div className="lg:col-span-8 transition-all duration-500">
            {isFullMenuOpen ? (
              /* BEYAZ KATALOG GÖRÜNÜMÜ */
              <div className="bg-[#fdfaf5] rounded-[48px] shadow-2xl overflow-hidden relative min-h-screen border border-orange-100/50">
                {/* Flu Desen */}
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none -z-10" 
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ea580c' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='50' cy='50' r='20'/%3E%3Ccircle cx='150' cy='150' r='20'/%3E%3Ccircle cx='150' cy='50' r='10'/%3E%3Ccircle cx='50' cy='150' r='10'/%3E%3C/g%3E%3C/svg%3E")`,
                    filter: 'blur(20px)',
                    backgroundSize: '400px 400px'
                  }} 
                />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#ea580c 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="px-6 py-8 space-y-12 relative">
                  <div className="flex items-center justify-between">
                     <h2 className="text-[#1a1a1a] text-2xl font-black uppercase tracking-tighter">PREMIUM MENÜ KATALOĞU</h2>
                     <button onClick={onCloseMenu} className="p-4 bg-orange-50 text-[#ea580c] rounded-2xl hover:bg-orange-100 transition-colors">
                       <X className="w-6 h-6" />
                     </button>
                  </div>

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

                  <div className="py-20 text-center border-t border-orange-100">
                    <p className="text-slate-300 text-[9px] font-black uppercase tracking-[0.8em]">FETHIYE360 DİJİTAL MENÜ SİSTEMİ</p>
                  </div>
                </div>
              </div>
            ) : (
              /* STANDART KOYU LİSTE GÖRÜNÜMÜ */
              <MenuSection 
                products={products} 
                businessName={businessName} 
                onProductClick={(product) => setSelectedProduct(product)}
                onAddToCart={addToCart}
                cartItems={cart}
                theme="dark"
              />
            )}
          </div>

          {/* SAĞ TARAF: HAREKETLİ VE ORTAK SEPET */}
          <div className="lg:col-span-4 sticky top-32 animate-bounce-slow">
            <div className="bg-[#112240] rounded-[40px] border border-white/10 p-8 shadow-2xl shadow-black/50">
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
                            {(parseFloat(String(item.price || 0).replace(/[^0-9.-]+/g,"")) || 0) * item.quantity} TL
                          </p>
                       </div>
                       <div className="flex items-center gap-3 bg-[#0a192f] rounded-xl px-3 py-1.5 border border-white/10">
                          <button onClick={() => removeFromCart(item.cartItemId)} className="text-slate-500 hover:text-white"><Minus className="w-3 h-3" /></button>
                          <span className="text-white text-[10px] font-black w-4 text-center">{item.quantity}</span>
                          <button onClick={() => addOneMore(item.cartItemId)} className="text-[#64ffda] hover:scale-110 transition-transform"><Plus className="w-3 h-3" /></button>
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
                      className="w-full bg-[#64ffda] text-[#0a192f] py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-[#64ffda]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                    >
                      <WhatsappIcon className="w-5 h-5" />
                      Siparişi Tamamla
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
        theme={isFullMenuOpen ? "light" : "dark"}
      />
    </div>
  )
}
