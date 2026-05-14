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
  viewMode?: 'list' | 'catalog'
  theme?: 'dark' | 'light' // Yeni: Tema seçeneği
}

export function MenuSection({ products, businessName, whatsappNumber, onProductClick, cartItems, viewMode = 'list', theme = 'dark' }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState('Tümü')
  const [searchQuery, setSearchQuery] = useState('')

  const defaultCategories = ['Tümü', 'Popüler', 'Ana Yemekler', 'Atıştırmalıklar', 'İçecekler']
  const categories = products.length > 0 
    ? ['Tümü', ...Array.from(new Set(products.map(p => p.category || 'Diğer'))).sort()]
    : defaultCategories
  
  const getProductQuantity = (productId: string) => {
    return cartItems?.find(item => item.id === productId)?.quantity || 0
  }

  return (
    <div className="space-y-2">
      {/* Kategori Navigasyonu ve Arama */}
      <div className={`sticky top-[80px] z-30 py-4 -mx-6 px-6 border-b flex items-center gap-4 transition-colors ${
        theme === 'light' ? 'bg-[#fdfaf5]/80 backdrop-blur-md border-orange-100' : 'bg-[#0a192f] border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]'
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
                
                <div className={viewMode === 'catalog' ? "grid grid-cols-2 md:grid-cols-3 gap-6" : "grid grid-cols-1 lg:grid-cols-2 gap-4"}>
                  {categoryProducts.map((product) => {
                    const quantity = getProductQuantity(product.id)
                    
                    return (
                      <div 
                        key={product.id}
                        onClick={() => onProductClick?.(product)}
                        className={viewMode === 'catalog' 
                          ? theme === 'light' 
                            ? "flex flex-col rounded-[32px] bg-white border border-orange-100 hover:border-orange-300 transition-all group cursor-pointer active:scale-[0.98] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-200/20" 
                            : "flex flex-col rounded-[32px] bg-[#112240] border border-white/5 hover:border-[#64ffda]/30 transition-all group cursor-pointer active:scale-[0.98] overflow-hidden shadow-2xl"
                          : theme === 'light'
                            ? "flex gap-4 p-4 rounded-2xl bg-white border border-orange-100 hover:border-orange-300 transition-all group cursor-pointer active:scale-[0.98] shadow-sm"
                            : "flex gap-4 p-4 rounded-2xl bg-[#112240] border border-white/5 hover:border-[#64ffda]/30 transition-all group cursor-pointer active:scale-[0.98]"
                        }
                      >
                        {/* Görsel */}
                        <div className={viewMode === 'catalog' 
                          ? theme === 'light' ? "w-full aspect-square overflow-hidden bg-orange-50/50 relative" : "w-full aspect-square overflow-hidden bg-white/5 relative"
                          : theme === 'light' ? "w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-orange-50/50" : "w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-white/5"
                        }>
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${theme === 'light' ? 'text-orange-200' : 'text-slate-500'}`}>
                              <Package className="w-8 h-8" />
                            </div>
                          )}
                          {viewMode === 'catalog' && (
                            <div className="absolute top-4 right-4 z-10">
                               <div className={`w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all shadow-sm ${
                                 theme === 'light' 
                                   ? 'bg-white/80 border-orange-100 text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white' 
                                   : 'bg-[#0a192f]/60 border-white/10 text-white group-hover:bg-[#64ffda] group-hover:text-[#0a192f]'
                               }`}>
                                  <Plus className="w-5 h-5" />
                               </div>
                            </div>
                          )}
                        </div>

                        {/* Detaylar */}
                        <div className={viewMode === 'catalog' ? "p-6 space-y-4" : "flex-1 flex flex-col justify-between py-1"}>
                          <div className="space-y-1">
                            <h4 className={viewMode === 'catalog' 
                              ? theme === 'light' ? "text-[#1a1a1a] font-black text-lg italic uppercase tracking-tighter group-hover:text-[#ea580c] transition-colors" : "text-white font-black text-lg italic uppercase tracking-tighter group-hover:text-[#64ffda] transition-colors"
                              : theme === 'light' ? "text-[#1a1a1a] font-bold text-sm group-hover:text-[#ea580c] transition-colors" : "text-white font-bold text-sm group-hover:text-[#64ffda] transition-colors"
                            }>
                              {product.name}
                            </h4>
                            {product.description && (
                              <p className="text-slate-400 text-[10px] md:text-xs mt-1 line-clamp-2 leading-relaxed font-medium">{product.description}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <span className={viewMode === 'catalog' 
                              ? theme === 'light' ? "text-[#ea580c] font-black text-xl italic tracking-tighter" : "text-[#64ffda] font-black text-xl italic tracking-tighter"
                              : theme === 'light' ? "text-[#ea580c] font-black text-sm" : "text-[#64ffda] font-black text-sm"
                            }>
                              {product.price} TL
                            </span>
                            
                            {quantity > 0 && (
                              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                                theme === 'light' ? 'bg-orange-100' : 'bg-[#64ffda]/10'
                              }`}>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                  theme === 'light' ? 'text-[#ea580c]' : 'text-[#64ffda]'
                                }`}>
                                  {quantity}
                                </span>
                              </div>
                            )}
                            
                            {viewMode !== 'catalog' && (
                              <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                                theme === 'light' 
                                  ? 'bg-orange-50 border-orange-100 text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white' 
                                  : 'bg-white/5 border-white/10 text-white group-hover:bg-[#64ffda] group-hover:text-[#0a192f]'
                              }`}>
                                <Plus className="w-4 h-4" />
                              </div>
                            )}
                          </div>
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
