'use client'

import { useState } from 'react'
import { Package, ShoppingCart, MessageCircle, ChevronRight, Tag } from 'lucide-react'

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
  cartItems?: { id: string, quantity: number }[]
}

export function MenuSection({ products, businessName, whatsappNumber, onAddToCart, cartItems }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState('Tümü')

  const categories = ['Tümü', ...Array.from(new Set(products.map(p => p.category || 'Diğer')))]
  
  const filteredProducts = activeCategory === 'Tümü' 
    ? products 
    : products.filter(p => (p.category || 'Diğer') === activeCategory)

  const getProductQuantity = (productId: string) => {
    return cartItems?.find(item => item.id === productId)?.quantity || 0
  }

  if (products.length === 0) return null

  return (
    <div className="space-y-12">
      {/* Kategori Navigasyonu - Sticky */}
      <div className="sticky top-20 z-30 bg-[#0a192f]/80 backdrop-blur-md py-4 -mx-6 px-6 overflow-x-auto no-scrollbar border-b border-white/5">
        <div className="flex items-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeCategory === cat
                  ? 'bg-[#64ffda] text-[#0a192f] border-[#64ffda]'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProducts.map((product) => {
          const quantity = getProductQuantity(product.id)
          
          return (
            <div 
              key={product.id}
              className="group bg-white/5 border border-white/5 rounded-[32px] p-6 hover:border-[#64ffda]/30 transition-all duration-500 flex flex-col justify-between"
            >
              <div className="flex gap-6">
                {product.image_url ? (
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/5">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 text-slate-700">
                    <Package className="w-8 h-8" />
                  </div>
                )}
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="text-lg font-black text-white uppercase italic tracking-tighter leading-tight">{product.name}</h4>
                    <span className="text-[#64ffda] font-black text-lg">{product.price} <span className="text-[10px] opacity-70">TL</span></span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{product.description || 'Bu ürün için henüz bir açıklama girilmemiş.'}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${quantity > 0 ? 'bg-[#64ffda] animate-pulse' : 'bg-slate-700'}`} />
                  <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">
                    {quantity > 0 ? `${quantity} Adet Eklendi` : 'Şu an Mevcut'}
                  </span>
                </div>
                
                <button 
                  onClick={() => onAddToCart?.(product)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest group/btn border ${
                    quantity > 0 
                    ? 'bg-[#64ffda] text-[#0a192f] border-[#64ffda]' 
                    : 'bg-white/5 text-white hover:bg-[#64ffda] hover:text-[#0a192f] border-white/5'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  {quantity > 0 ? 'ADET EKLE' : 'SEPETE EKLE'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center bg-white/5 rounded-[40px] border border-dashed border-white/10">
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Bu kategoride henüz ürün bulunmuyor.</p>
        </div>
      )}
    </div>
  )
}
