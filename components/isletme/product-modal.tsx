'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Minus, ShoppingBag, MessageSquare, Flame } from 'lucide-react'
import Image from 'next/image'

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

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
      setNote('')
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen || !product) return null

  const handleAdd = () => {
    onAddToCart(product, quantity, note)
    onClose()
  }

  const isPopular = product.price > 150

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative w-full sm:max-w-lg max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300 ${
        theme === 'dark' 
          ? 'bg-[#111827] sm:rounded-3xl rounded-t-3xl' 
          : 'bg-white sm:rounded-3xl rounded-t-3xl'
      }`}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-20 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className={`relative w-full aspect-[4/3] ${
          theme === 'dark' ? 'bg-[#0a0f1a]' : 'bg-slate-100'
        }`}>
          {product.image_url ? (
            <Image 
              src={product.image_url} 
              alt={product.name} 
              fill 
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 512px"
              priority
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <ShoppingBag className={`w-16 h-16 mb-2 ${
                theme === 'dark' ? 'text-white/10' : 'text-slate-200'
              }`} />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent`} />
          
          {/* Popular Badge */}
          {isPopular && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/90 backdrop-blur-sm rounded-full">
              <Flame className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white uppercase tracking-wide">Populer</span>
            </div>
          )}

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {product.name}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xl font-bold text-cyan-400">
                {product.price} TL
              </span>
              {product.category && (
                <span className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-medium text-white/80">
                  {product.category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[50vh]">
          {/* Description */}
          {product.description && (
            <div className={`p-4 rounded-2xl ${
              theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'
            }`}>
              <p className={`text-sm leading-relaxed ${
                theme === 'dark' ? 'text-white/60' : 'text-slate-600'
              }`}>
                {product.description}
              </p>
            </div>
          )}

          {/* Note Input */}
          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
              theme === 'dark' ? 'text-white/40' : 'text-slate-400'
            }`}>
              <MessageSquare className={`w-4 h-4 ${
                theme === 'dark' ? 'text-cyan-400' : 'text-emerald-500'
              }`} />
              Siparis Notu
            </label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Orn: Bol acili, sogansiz olsun..."
              className={`w-full border rounded-2xl p-4 text-sm resize-none transition-all ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20'
              }`}
              rows={3}
            />
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4">
            {/* Quantity Selector */}
            <div className={`flex items-center gap-1 p-1.5 rounded-xl ${
              theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'
            }`}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                  theme === 'dark' 
                    ? 'bg-white/5 hover:bg-white/10 text-white/60' 
                    : 'bg-white hover:bg-slate-50 text-slate-500 shadow-sm'
                }`}
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className={`w-12 text-center font-bold text-lg ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                  theme === 'dark' 
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/25' 
                    : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25'
                }`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAdd}
              className={`flex-1 h-14 rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/25' 
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              }`}
            >
              <span>Sepete Ekle</span>
              <span className="w-px h-4 bg-white/20" />
              <span className="font-bold">{product.price * quantity} TL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
