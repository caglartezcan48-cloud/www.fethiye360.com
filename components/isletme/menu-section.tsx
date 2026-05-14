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
  viewMode?: 'list' | 'catalog' // Yeni: Görünüm modu seçeneği
}

export function MenuSection({ products, businessName, whatsappNumber, onProductClick, cartItems, viewMode = 'list' }: MenuSectionProps) {
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
    <div className="space-y-8">
      {/* Kategori Navigasyonu ve Arama - Sticky Yemeksepeti Style */}
      <div className="sticky top-[80px] z-30 bg-[#0a192f] py-4 -mx-6 px-6 border-b border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] flex items-center gap-4">
        {/* Arama Çubuğu */}
        <div className="relative shrink-0 w-28 md:w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#112240] border border-white/10 rounded-full py-2 pl-9 pr-3 text-xs md:text-sm text-white focus:outline-none focus:border-[#64ffda] transition-colors placeholder:text-slate-500"
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
                  className={`px-5 py-3 text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 border-b-2 ${
                    activeCategory === cat
                      ? 'border-[#64ffda] text-[#64ffda]'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {cat} <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeCategory === cat ? 'bg-[#64ffda]/10 text-[#64ffda]' : 'bg-white/5 text-slate-500'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Kategorilere Göre Gruplanmış Ürün Listesi */}
      <div className="space-y-12">
        {products.length === 0 ? (
          <div className="py-32 text-center bg-[#112240] rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center">
            <Package className="w-16 h-16 text-slate-600 mb-6" />
            <h3 className="text-2xl font-black text-white mb-2">İçerik Yükleniyor...</h3>
            <p className="text-slate-400">Bu işletme henüz satışa sunduğu ürünleri sisteme yüklememiş veya menü güncelleniyor.</p>
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
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  {category}
                  <span className="text-sm font-medium text-slate-500 bg-white/5 px-3 py-1 rounded-full">{categoryProducts.length} Ürün</span>
                </h2>
                
                <div className={viewMode === 'catalog' ? "grid grid-cols-2 md:grid-cols-3 gap-6" : "grid grid-cols-1 lg:grid-cols-2 gap-4"}>
                  {categoryProducts.map((product) => {
                    const quantity = getProductQuantity(product.id)
                    
                    return (
                      <div 
                        key={product.id}
                        onClick={() => onProductClick?.(product)}
                        className={viewMode === 'catalog' 
                          ? "flex flex-col rounded-[32px] bg-[#112240] border border-white/5 hover:border-[#64ffda]/30 transition-all group cursor-pointer active:scale-[0.98] overflow-hidden shadow-2xl" 
                          : "flex gap-4 p-4 rounded-2xl bg-[#112240] border border-white/5 hover:border-[#64ffda]/30 transition-all group cursor-pointer active:scale-[0.98]"
                        }
                      >
                        {/* Görsel */}
                        <div className={viewMode === 'catalog' ? "w-full aspect-square overflow-hidden bg-white/5 relative" : "w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-white/5"}>
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              <Package className="w-8 h-8" />
                            </div>
                          )}
                          {viewMode === 'catalog' && (
                            <div className="absolute top-4 right-4 z-10">
                               <div className="w-10 h-10 rounded-full bg-[#0a192f]/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:bg-[#64ffda] group-hover:text-[#0a192f] transition-all">
                                  <Plus className="w-5 h-5" />
                               </div>
                            </div>
                          )}
                        </div>

                        {/* Detaylar */}
                        <div className={viewMode === 'catalog' ? "p-6 space-y-4" : "flex-1 flex flex-col justify-between py-1"}>
                          <div className="space-y-1">
                            <h4 className={viewMode === 'catalog' ? "text-white font-black text-lg leading-tight group-hover:text-[#64ffda] transition-colors italic uppercase tracking-tighter" : "text-white font-bold text-sm leading-tight group-hover:text-[#64ffda] transition-colors"}>
                              {product.name}
                            </h4>
                            {product.description && (
                              <p className="text-slate-400 text-[10px] md:text-xs mt-1 line-clamp-2 leading-relaxed font-medium">{product.description}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <span className={viewMode === 'catalog' ? "text-[#64ffda] font-black text-xl italic tracking-tighter" : "text-[#64ffda] font-black text-sm"}>
                              {product.price} TL
                            </span>
                            
                            {quantity > 0 && (
                              <div className="flex items-center gap-1.5 bg-[#64ffda]/10 px-2.5 py-1 rounded-lg">
                                <span className="text-[10px] font-black text-[#64ffda] uppercase tracking-widest">
                                  {quantity}
                                </span>
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
