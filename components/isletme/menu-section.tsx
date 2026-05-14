'use client'

import { useState, useRef, useEffect } from 'react'
import { Package, Plus, Minus, Search } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  description: string | null
  category?: string
  image_url?: string
}

interface MenuSectionProps {
  products: Product[]
  businessName: string
  whatsappNumber?: string
  onProductClick?: (product: Product) => void
  cartItems?: { id: string, quantity: number }[]
  onAddToCart?: (product: Product, quantity?: number, note?: string) => void
  viewMode?: 'list' | 'catalog'
  theme?: 'dark' | 'light'
}

export function MenuSection({ products, businessName, whatsappNumber, onProductClick, cartItems, onAddToCart, viewMode = 'list', theme = 'dark' }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState('Tümü')
  const [searchQuery, setSearchQuery] = useState('')
  const [noteProduct, setNoteProduct] = useState<string | null>(null)
  const [quickNote, setQuickNote] = useState('')
  const [quickQuantity, setQuickQuantity] = useState(1)

  const defaultCategories = ['Tümü', 'Popüler', 'Ana Yemekler', 'Atıştırmalıklar', 'İçecekler']
  const categories = products.length > 0 
    ? ['Tümü', ...Array.from(new Set(products.map(p => p.category || 'Diğer'))).sort()]
    : defaultCategories
  
  const getProductQuantity = (productId: string) => {
    return cartItems?.find(item => item.id === productId)?.quantity || 0
  }

  return (
    <div className="space-y-2">
      {/* Kategori Navigasyonu ve Arama - SABİT VE OKUNABİLİR */}
      <div className={`sticky top-0 z-40 py-6 -mx-6 px-6 border-b flex items-center gap-4 shadow-sm ${
        theme === 'light' ? 'bg-[#fdfaf5] border-orange-100' : 'bg-[#0a192f] border-white/10'
      }`}>
        {/* Arama Çubuğu */}
        <div className="relative shrink-0 w-28 md:w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border rounded-full py-2 pl-9 pr-3 text-xs md:text-sm transition-colors placeholder:text-slate-400 shadow-sm outline-none ${
              theme === 'light' ? 'bg-white border-orange-100 text-[#1a1a1a] focus:border-[#ea580c]' : 'bg-[#112240] border-white/10 text-white focus:border-[#64ffda]'
            }`}
          />
        </div>

        {/* Kategoriler */}
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            {categories.map((cat) => {
              const count = cat === 'Tümü' 
                ? products.length 
                : products.filter(p => (p.category || 'Diğer') === cat).length;
                
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    // Seçilen kategoriye yumuşak kaydırma
                    if (cat !== 'Tümü') {
                      const el = document.getElementById(`category-${cat}`);
                      if (el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - 150;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }
                  }}
                  className={`px-5 py-3 text-sm font-black transition-all whitespace-nowrap flex items-center gap-2 border-b-2 uppercase tracking-widest ${
                    activeCategory === cat
                      ? theme === 'light' ? 'border-[#ea580c] text-[#ea580c]' : 'border-[#64ffda] text-[#64ffda]'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {cat} <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    activeCategory === cat 
                      ? theme === 'light' ? 'bg-orange-100 text-[#ea580c]' : 'bg-[#64ffda]/10 text-[#64ffda]' 
                      : theme === 'light' ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-slate-500'
                  }`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Kategorilere Göre Gruplanmış Ürün Listesi */}
      <div className="space-y-12">
        {products.length === 0 ? (
          <div className={`py-32 text-center rounded-[40px] border border-dashed flex flex-col items-center justify-center ${
            theme === 'light' ? 'bg-white border-orange-200' : 'bg-[#112240] border-white/10'
          }`}>
            <Package className={`w-16 h-16 mb-6 ${theme === 'light' ? 'text-orange-200' : 'text-slate-600'}`} />
            <h3 className={`text-2xl font-black mb-2 uppercase italic ${theme === 'light' ? 'text-[#1a1a1a]' : 'text-white'}`}>İçerik Yükleniyor...</h3>
            <p className="text-slate-400 max-w-xs mx-auto">Bu işletme henüz satışa sunduğu ürünleri sisteme yüklememiş veya menü güncelleniyor.</p>
          </div>
        ) : (
          (activeCategory === 'Tümü' ? categories.filter(c => c !== 'Tümü') : [activeCategory]).map(category => {
            const categoryProducts = products.filter(p => 
              (p.category || 'Diğer') === category && 
              p.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category} id={`category-${category}`} className="space-y-6 pt-4 scroll-mt-[150px]">
                <h2 className={`text-2xl font-black flex items-center gap-3 italic uppercase tracking-tighter ${theme === 'light' ? 'text-[#1a1a1a]' : 'text-white'}`}>
                  {category}
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                    theme === 'light' ? 'bg-slate-100 text-slate-400' : 'bg-white/5 text-slate-500'
                  }`}>{categoryProducts.length} Ürün</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryProducts.map((product) => {
                    const quantity = getProductQuantity(product.id)
                    
                    return (
                      <div 
                        key={product.id}
                        onClick={() => onProductClick?.(product)}
                        className={`flex gap-4 p-4 rounded-[32px] bg-white border border-orange-100 hover:border-orange-300 transition-all group cursor-pointer active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-orange-200/20 ${
                          theme === 'dark' ? 'bg-[#112240] border-white/5 hover:border-[#64ffda]/30' : ''
                        }`}
                      >
                        {/* Görsel - Solda */}
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden shrink-0 bg-orange-50/50 relative">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${theme === 'light' ? 'text-orange-200' : 'text-slate-500'}`}>
                              <Package className="w-8 h-8" />
                            </div>
                          )}
                          {/* Badge (Örn: Popüler) */}
                          {product.price > 200 && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest">
                              Popüler
                            </div>
                          )}
                        </div>

                        {/* Detaylar - Sağda */}
                        <div className="flex-1 flex flex-col justify-between py-1 relative">
                          <div className="space-y-1">
                            <h4 className={`font-black text-base md:text-lg italic uppercase tracking-tighter transition-colors ${
                              theme === 'light' ? 'text-[#1a1a1a] group-hover:text-[#ea580c]' : 'text-white group-hover:text-[#64ffda]'
                            }`}>
                              {product.name}
                            </h4>
                            {product.description && (
                              <p className="text-slate-400 text-[10px] md:text-xs mt-1 line-clamp-2 leading-relaxed font-medium">{product.description}</p>
                            )}
                          </div>
                          
                          <div className="flex items-end justify-between">
                            <span className={`font-black text-xl md:text-2xl italic tracking-tighter ${
                              theme === 'light' ? 'text-[#1a1a1a]' : 'text-[#64ffda]'
                            }`}>
                              {product.price} <span className="text-[10px] opacity-60">TL</span>
                            </span>
                            
                            {/* Orange Plus Button - Bottom Right */}
                            <div 
                              onClick={(e) => {
                                e.stopPropagation()
                                setNoteProduct(product.id)
                                setQuickNote('')
                                setQuickQuantity(1)
                              }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all shadow-lg cursor-pointer hover:scale-110 active:scale-90 ${
                              theme === 'light' ? 'bg-[#ea580c] shadow-orange-200' : 'bg-[#64ffda] text-[#0a192f] shadow-[#64ffda]/20'
                            }`}>
                              <Plus className="w-5 h-5" />
                            </div>

                            {/* Quick Note Bubble (Baloncuk) */}
                            {noteProduct === product.id && (
                              <div 
                                className="absolute bottom-12 right-0 z-50 animate-in zoom-in slide-in-from-bottom-4 duration-300"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="bg-white border-2 border-orange-100 rounded-[24px] p-4 shadow-2xl shadow-orange-200/40 w-64 space-y-3 relative after:content-[''] after:absolute after:top-full after:right-4 after:border-8 after:border-transparent after:border-t-white">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-[#ea580c]">Sipariş Notunuz</p>
                                  <textarea 
                                    autoFocus
                                    value={quickNote}
                                    onChange={(e) => setQuickNote(e.target.value)}
                                    placeholder="Örn: Soğansız olsun..."
                                    className="w-full bg-orange-50/50 border-none rounded-xl p-3 text-xs focus:ring-1 focus:ring-orange-200 min-h-[60px] resize-none outline-none text-slate-800"
                                  />
                                  <div className="flex items-center justify-between py-2 border-t border-orange-50">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Adet</p>
                                    <div className="flex items-center gap-4 bg-orange-50/50 rounded-xl px-3 py-1">
                                      <button 
                                        onClick={() => setQuickQuantity(Math.max(1, quickQuantity - 1))}
                                        className="text-[#ea580c] hover:scale-125 transition-transform"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </button>
                                      <span className="text-xs font-black text-[#1a1a1a] w-4 text-center">{quickQuantity}</span>
                                      <button 
                                        onClick={() => setQuickQuantity(quickQuantity + 1)}
                                        className="text-[#ea580c] hover:scale-125 transition-transform"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => setNoteProduct(null)}
                                      className="flex-1 py-2 rounded-xl text-[10px] font-bold text-slate-400 hover:bg-slate-50 transition-colors"
                                    >
                                      VAZGEÇ
                                    </button>
                                    <button 
                                      onClick={() => {
                                        onAddToCart?.(product, quickQuantity, quickNote)
                                        setNoteProduct(null)
                                      }}
                                      className="flex-[2] py-2 bg-[#ea580c] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                                    >
                                      <span>EKLE</span>
                                      <span className="opacity-50 text-[8px] font-bold">
                                        {(product.price || 0) * quickQuantity} TL
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {quantity > 0 && (
                            <div className={`absolute -top-1 -right-1 flex items-center gap-1.5 px-2 py-0.5 rounded-full border-2 border-white shadow-sm ${
                              theme === 'light' ? 'bg-[#ea580c] text-white' : 'bg-[#64ffda] text-[#0a192f]'
                            }`}>
                              <span className="text-[9px] font-black">{quantity}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
