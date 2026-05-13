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
}

export function MenuSection({ products, businessName, whatsappNumber }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState('Tümü')

  // Gruplandirma islemi (Kategori varsa)
  const categories = ['Tümü', ...Array.from(new Set(products.map(p => p.category || 'Diğer')))]
  
  const filteredProducts = activeCategory === 'Tümü' 
    ? products 
    : products.filter(p => (p.category || 'Diğer') === activeCategory)

  const handleOrder = (product: Product) => {
    if (!whatsappNumber) return
    const text = `Merhaba ${businessName}, web sitenizden "${product.name}" (${product.price} TL) ürünü hakkında bilgi almak/sipariş vermek istiyorum.`
    window.open(`https://wa.me/${whatsappNumber.replace(/\s+/g, '')}?text=${encodeURIComponent(text)}`, '_blank')
  }

  if (products.length === 0) return null

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <h3 className="text-[10px] font-black text-[#64ffda] uppercase tracking-[0.4em] whitespace-nowrap">MENÜ & LEZZETLER</h3>
        <div className="h-px w-full bg-white/5" />
      </div>

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
        {filteredProducts.map((product) => (
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
                <div className="flex items-center gap-2 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                   <Tag className="w-3 h-3" /> {product.category || 'Genel'}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#64ffda] rounded-full animate-pulse" />
                <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Şu an Mevcut</span>
              </div>
              <button 
                onClick={() => handleOrder(product)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-[#64ffda] text-white hover:text-[#0a192f] rounded-xl transition-all font-black text-[9px] uppercase tracking-widest group/btn border border-white/5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-green-500 group-hover/btn:text-[#0a192f]" />
                SİPARİŞ VER
                <ChevronRight className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-all -translate-x-2 group-hover/btn:translate-x-0" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center bg-white/5 rounded-[40px] border border-dashed border-white/10">
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Bu kategoride henüz ürün bulunmuyor.</p>
        </div>
      )}
    </div>
  )
}
