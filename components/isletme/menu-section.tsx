'use client'

import { useState, useRef, useEffect } from 'react'
import { Package, Plus, Minus } from 'lucide-react'

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

  const categories = ['Tümü', ...Array.from(new Set(products.map(p => p.category || 'Diğer')))]
  
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
      {/* Kategori Navigasyonu - Sticky Yemeksepeti Style */}
      <div className="sticky top-[80px] z-30 bg-[#0a192f] py-4 -mx-6 px-6 overflow-x-auto no-scrollbar border-b border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#64ffda] text-[#0a192f]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Kategorilere Göre Gruplanmış Ürün Listesi */}
      <div className="space-y-12">
        {(activeCategory === 'Tümü' ? categories.filter(c => c !== 'Tümü') : [activeCategory]).map(category => {
          const categoryProducts = products.filter(p => (p.category || 'Diğer') === category)
          
          if (categoryProducts.length === 0) return null;

          return (
            <div key={category} className="space-y-6">
              <h2 className="text-2xl font-black text-white">{category}</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {categoryProducts.map((product) => {
                  const quantity = getProductQuantity(product.id)
                  
                  return (
                    <div 
                      key={product.id}
                      className="bg-[#112240] rounded-2xl p-4 flex gap-4 hover:bg-[#1a365d] transition-colors border border-white/5 relative group cursor-pointer"
                      onClick={() => onAddToCart?.(product)}
                    >
                      {/* Sol: Bilgiler */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="text-white font-bold text-base leading-tight group-hover:text-[#64ffda] transition-colors">{product.name}</h4>
                          <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">{product.description || 'Açıklama bulunmuyor.'}</p>
                        </div>
                        <div className="mt-4 font-black text-white">
                          {product.price} TL
                        </div>
                      </div>

                      {/* Sağ: Görsel ve Buton */}
                      <div className="w-28 h-28 shrink-0 relative rounded-xl overflow-hidden bg-white/5 border border-white/10">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <Package className="w-8 h-8" />
                          </div>
                        )}

                        {/* Miktar Kontrolü / Ekle Butonu */}
                        <div 
                          className="absolute bottom-1 right-1" 
                          onClick={(e) => e.stopPropagation()} // Kart tıklamasını engelle
                        >
                          {quantity > 0 ? (
                            <div className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
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
                              className="w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center text-[#0a192f] hover:bg-[#64ffda] transition-colors"
                            >
                              <Plus className="w-5 h-5" />
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
