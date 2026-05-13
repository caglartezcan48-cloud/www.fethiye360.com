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
  onAddToCart?: (product: Product) => void
  onRemoveFromCart?: (productId: string) => void
  cartItems?: { id: string, quantity: number }[]
}

export function MenuSection({ products, businessName, whatsappNumber, onAddToCart, onRemoveFromCart, cartItems }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState('Tümü')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['Tümü', ...Array.from(new Set(products.map(p => p.category || 'Diğer'))).sort()]
  
  const getProductQuantity = (productId: string) => {
    return cartItems?.find(item => item.id === productId)?.quantity || 0
  }

  if (products.length === 0) {
    return (
      <div className="py-32 text-center bg-[#112240] rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center">
        <Package className="w-16 h-16 text-slate-600 mb-6" />
        <h3 className="text-2xl font-black text-white mb-2">Menü Henüz Eklenmedi</h3>
        <p className="text-slate-400">Bu işletme henüz satışa sunduğu ürünleri sisteme yüklememiş.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Kategori Navigasyonu ve Arama - Sticky Yemeksepeti Style */}
      <div className="sticky top-[80px] z-30 bg-[#0a192f] py-4 -mx-6 px-6 border-b border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] flex items-center gap-4">
        {/* Arama Çubuğu */}
        <div className="relative shrink-0 w-48 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Menüde Ara" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#112240] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#64ffda] transition-colors placeholder:text-slate-500"
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
        {(activeCategory === 'Tümü' ? categories.filter(c => c !== 'Tümü') : [activeCategory]).map(category => {
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
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {categoryProducts.map((product) => {
                  const quantity = getProductQuantity(product.id)
                  
                  return (
                    <div 
                      key={product.id}
                      className="bg-[#112240] rounded-xl p-4 flex gap-4 hover:bg-[#1a365d] transition-colors border border-white/5 relative group cursor-pointer shadow-lg"
                      onClick={() => onAddToCart?.(product)}
                    >
                      {/* Sol: Bilgiler */}
                      <div className="flex-1 flex flex-col py-1 pr-2">
                        <h4 className="text-white font-bold text-[15px] leading-snug group-hover:text-[#64ffda] transition-colors">{product.name}</h4>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-bold text-[#64ffda]">{product.price} TL</span>
                          <span className="text-xs text-slate-500 line-through">{(product.price * 1.25).toFixed(0)} TL</span>
                        </div>
                        <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">{product.description || 'Açıklama bulunmuyor.'}</p>
                      </div>

                      {/* Sağ: Görsel ve Buton */}
                      <div className="w-[120px] h-[120px] shrink-0 relative rounded-xl overflow-hidden bg-white/5 border border-white/10 shadow-md">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-800">
                            <Package className="w-8 h-8" />
                          </div>
                        )}

                        {/* Miktar Kontrolü / Ekle Butonu */}
                        <div 
                          className="absolute -bottom-2 -right-2 p-2" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          {quantity > 0 ? (
                            <div className="flex items-center bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-slate-100 overflow-hidden">
                              <button 
                                onClick={() => onRemoveFromCart?.(product.id)}
                                className="w-8 h-8 flex items-center justify-center text-[#0a192f] hover:bg-slate-100 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-6 text-center text-[#0a192f] font-bold text-sm">
                                {quantity}
                              </span>
                              <button 
                                onClick={() => onAddToCart?.(product)}
                                className="w-8 h-8 flex items-center justify-center text-[#0a192f] hover:bg-slate-100 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => onAddToCart?.(product)}
                              className="w-10 h-10 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center text-[#0a192f] hover:scale-105 transition-transform border border-slate-100"
                            >
                              <Plus className="w-6 h-6 text-[#0a192f]" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
