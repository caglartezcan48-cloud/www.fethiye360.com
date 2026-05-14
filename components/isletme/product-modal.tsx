'use client'

import { useState } from 'react'
import { X, Plus, Minus, ShoppingBag, MessageSquare } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  description: string | null
  category?: string
  image_url?: string
}

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: Product, quantity: number, note: string) => void
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')

  if (!isOpen || !product) return null

  const handleAdd = () => {
    onAddToCart(product, quantity, note)
    setQuantity(1)
    setNote('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-xl bg-[#112240] rounded-t-[40px] md:rounded-[48px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full duration-500">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative w-full aspect-video md:aspect-[16/9] bg-[#0a192f]">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
              <ShoppingBag className="w-16 h-16 mb-2 opacity-20" />
              <span className="text-xs font-bold uppercase tracking-widest opacity-20">Görsel Yok</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#112240] via-transparent to-transparent" />
        </div>

        <div className="px-8 pb-10 -mt-8 relative z-10 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white italic tracking-tight uppercase leading-tight">
              {product.name}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-[#64ffda] text-2xl font-black italic tracking-tighter">
                {product.price} <span className="text-xs opacity-60">TL</span>
              </span>
              {product.category && (
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-white/5">
                  {product.category}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
              <p className="text-slate-400 text-sm leading-relaxed italic">
                "{product.description}"
              </p>
            </div>
          )}

          {/* Note Area */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <MessageSquare className="w-3 h-3 text-[#64ffda]" /> İşletmeye Notunuz
            </label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn: Bol acılı olsun, domates istemiyorum..."
              className="w-full bg-[#0a192f] border border-white/5 rounded-3xl p-6 text-white text-sm focus:ring-2 focus:ring-[#64ffda] outline-none transition-all h-28 resize-none placeholder:text-slate-600"
            />
          </div>

          {/* Controls & Add to Cart */}
          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-5 bg-[#0a192f] rounded-3xl p-2 border border-white/5 shadow-inner">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-white font-black text-xl w-6 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-2xl bg-[#64ffda] flex items-center justify-center text-[#0a192f] hover:scale-105 active:scale-90 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={handleAdd}
              className="flex-1 h-16 bg-[#64ffda] text-[#0a192f] rounded-[32px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-[#64ffda]/20"
            >
              SEPETE EKLE 
              <div className="w-px h-4 bg-[#0a192f]/20 mx-1" />
              {product.price * quantity} TL
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
