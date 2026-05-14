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
  theme?: 'dark' | 'light'
}

export function ProductModal({ product, isOpen, onClose, onAddToCart, theme = 'dark' }: ProductModalProps) {
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
      <div className={`relative w-full max-w-xl rounded-t-[40px] md:rounded-[48px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full duration-500 ${
        theme === 'light' ? 'bg-white' : 'bg-[#112240]'
      }`}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className={`relative w-full aspect-video md:aspect-[16/9] ${theme === 'light' ? 'bg-orange-50' : 'bg-[#0a192f]'}`}>
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex flex-col items-center justify-center ${theme === 'light' ? 'text-orange-200' : 'text-slate-700'}`}>
              <ShoppingBag className={`w-16 h-16 mb-2 ${theme === 'light' ? 'opacity-40' : 'opacity-20'}`} />
              <span className="text-xs font-bold uppercase tracking-widest opacity-40">Görsel Yok</span>
            </div>
          )}
          <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${
            theme === 'light' ? 'from-white' : 'from-[#112240]'
          }`} />
        </div>

        <div className="px-8 pb-10 -mt-8 relative z-10 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h2 className={`text-3xl font-black italic tracking-tight uppercase leading-tight ${
              theme === 'light' ? 'text-[#1a1a1a]' : 'text-white'
            }`}>
              {product.name}
            </h2>
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-black italic tracking-tighter ${
                theme === 'light' ? 'text-[#ea580c]' : 'text-[#64ffda]'
              }`}>
                {product.price} <span className="text-xs opacity-60">TL</span>
              </span>
              {product.category && (
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  theme === 'light' ? 'bg-orange-50 text-[#ea580c] border-orange-100' : 'bg-white/5 text-slate-500 border-white/5'
                }`}>
                  {product.category}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className={`rounded-3xl p-6 border ${
              theme === 'light' ? 'bg-orange-50/50 border-orange-50' : 'bg-white/5 border-white/5'
            }`}>
              <p className={`text-sm leading-relaxed italic ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                "{product.description}"
              </p>
            </div>
          )}

          {/* Note Area */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <MessageSquare className={`w-3 h-3 ${theme === 'light' ? 'text-[#ea580c]' : 'text-[#64ffda]'}`} /> İşletmeye Notunuz
            </label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn: Bol acılı olsun, domates istemiyorum..."
              className={`w-full border rounded-3xl p-6 text-sm outline-none transition-all h-28 resize-none placeholder:text-slate-400 ${
                theme === 'light' 
                  ? 'bg-slate-50 border-slate-100 text-[#1a1a1a] focus:ring-2 focus:ring-orange-200' 
                  : 'bg-[#0a192f] border-white/5 text-white focus:ring-2 focus:ring-[#64ffda]'
              }`}
            />
          </div>

          {/* Controls & Add to Cart */}
          <div className="flex items-center gap-6 pt-4">
            <div className={`flex items-center gap-5 rounded-3xl p-2 border shadow-inner ${
              theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-[#0a192f] border-white/5'
            }`}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                  theme === 'light' 
                    ? 'bg-white border border-slate-100 text-slate-400 hover:text-[#ea580c]' 
                    : 'bg-white/5 text-white hover:bg-white/10'
                } active:scale-90`}
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className={`font-black text-xl w-6 text-center ${theme === 'light' ? 'text-[#1a1a1a]' : 'text-white'}`}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                  theme === 'light' 
                    ? 'bg-[#ea580c] text-white shadow-orange-200' 
                    : 'bg-[#64ffda] text-[#0a192f]'
                } hover:scale-105 active:scale-90`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={handleAdd}
              className={`flex-1 h-16 rounded-[32px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl ${
                theme === 'light' 
                  ? 'bg-[#ea580c] text-white shadow-orange-300/30' 
                  : 'bg-[#64ffda] text-[#0a192f] shadow-[#64ffda]/20'
              }`}
            >
              SEPETE EKLE 
              <div className={`w-px h-4 mx-1 ${theme === 'light' ? 'bg-white/20' : 'bg-[#0a192f]/20'}`} />
              {product.price * quantity} TL
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
