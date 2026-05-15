'use client'

import { useState, useRef, useEffect } from 'react'
import { Package, Plus, Minus, Search, Flame, ChefHat } from 'lucide-react'
import Image from 'next/image'

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

export function MenuSection({ products, businessName, onProductClick, cartItems, onAddToCart, theme = 'dark' }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState('Tümü')
  const [searchQuery, setSearchQuery] = useState('')
  const [quickAddProduct, setQuickAddProduct] = useState<string | null>(null)
  const [quickNote, setQuickNote] = useState('')
  const [quickQuantity, setQuickQuantity] = useState(1)
  const categoryRef = useRef<HTMLDivElement>(null)

  const categories = products.length > 0 
    ? ['Tümü', ...Array.from(new Set(products.map(p => p.category || 'Diger'))).sort()]
    : ['Tümü']
  
  const getProductQuantity = (productId: string) => {
    return cartItems?.find(item => item.id === productId)?.quantity || 0
  }

  const filteredProducts = products.filter(p => 
    (activeCategory === 'Tümü' || (p.category || 'Diger') === activeCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedProducts = categories.filter(c => c !== 'Tümü').reduce((acc, category) => {
    const categoryProducts = filteredProducts.filter(p => (p.category || 'Diger') === category)
    if (categoryProducts.length > 0) {
      acc[category] = categoryProducts
    }
    return acc
  }, {} as Record<string, Product[]>)

  return (
    <div className="space-y-6">
      {/* Search & Categories Header */}
      <div className="sticky top-16 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-[#0a0f1a]/95 backdrop-blur-xl border-b border-white/5">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Menu&apos;de ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        {/* Categories */}
        <div ref={categoryRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const count = cat === 'Tümü' 
              ? products.length 
              : products.filter(p => (p.category || 'Diger') === cat).length
            const isActive = activeCategory === cat

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {cat}
                <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Products List */}
      {products.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
            <ChefHat className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Menu Yukleniyor</h3>
          <p className="text-white/40 text-sm">Lezzetli urunler cok yakininda...</p>
        </div>
      ) : activeCategory === 'Tümü' ? (
        // Grouped by category
        <div className="space-y-10">
          {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
            <div key={category} id={`category-${category}`} className="scroll-mt-40">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-lg font-semibold text-white">{category}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                <span className="text-xs text-white/30 font-medium">{categoryProducts.length} urun</span>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    quantity={getProductQuantity(product.id)}
                    onClick={() => onProductClick?.(product)}
                    onQuickAdd={() => {
                      setQuickAddProduct(product.id)
                      setQuickNote('')
                      setQuickQuantity(1)
                    }}
                    isQuickAddOpen={quickAddProduct === product.id}
                    quickNote={quickNote}
                    setQuickNote={setQuickNote}
                    quickQuantity={quickQuantity}
                    setQuickQuantity={setQuickQuantity}
                    onConfirmAdd={() => {
                      onAddToCart?.(product, quickQuantity, quickNote)
                      setQuickAddProduct(null)
                    }}
                    onCancelAdd={() => setQuickAddProduct(null)}
                    theme={theme}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Single category
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              quantity={getProductQuantity(product.id)}
              onClick={() => onProductClick?.(product)}
              onQuickAdd={() => {
                setQuickAddProduct(product.id)
                setQuickNote('')
                setQuickQuantity(1)
              }}
              isQuickAddOpen={quickAddProduct === product.id}
              quickNote={quickNote}
              setQuickNote={setQuickNote}
              quickQuantity={quickQuantity}
              setQuickQuantity={setQuickQuantity}
              onConfirmAdd={() => {
                onAddToCart?.(product, quickQuantity, quickNote)
                setQuickAddProduct(null)
              }}
              onCancelAdd={() => setQuickAddProduct(null)}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Product Card Component
interface ProductCardProps {
  product: Product
  quantity: number
  onClick: () => void
  onQuickAdd: () => void
  isQuickAddOpen: boolean
  quickNote: string
  setQuickNote: (note: string) => void
  quickQuantity: number
  setQuickQuantity: (qty: number) => void
  onConfirmAdd: () => void
  onCancelAdd: () => void
  theme: 'dark' | 'light'
}

function ProductCard({ 
  product, 
  quantity, 
  onClick, 
  onQuickAdd, 
  isQuickAddOpen, 
  quickNote, 
  setQuickNote, 
  quickQuantity, 
  setQuickQuantity, 
  onConfirmAdd, 
  onCancelAdd
}: ProductCardProps) {
  const isPopular = product.price > 150

  return (
    <div className="relative group">
      <div 
        onClick={onClick}
        className="flex gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] bg-[#0f172a] border border-white/[0.06] hover:border-cyan-500/20 hover:bg-[#131c2e]"
      >
        {/* Product Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-[#1e293b]">
          {product.image_url ? (
            <Image 
              src={product.image_url} 
              alt={product.name} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="112px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-8 h-8 text-white/10" />
            </div>
          )}
          
          {/* Popular Badge */}
          {isPopular && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-amber-500/90 backdrop-blur-sm rounded-lg">
              <Flame className="w-3 h-3 text-white" />
              <span className="text-[10px] font-bold text-white uppercase">Populer</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
          <div>
            <h3 className="font-semibold text-base truncate pr-8 text-white">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-xs mt-1 line-clamp-2 text-slate-400">
                {product.description}
              </p>
            )}
          </div>
          
          <div className="flex items-end justify-between mt-2">
            <span className="text-lg font-bold text-cyan-400">
              {product.price} <span className="text-xs text-cyan-400/60">TL</span>
            </span>
          </div>
        </div>

        {/* Quantity Badge */}
        {quantity > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <span className="text-[10px] font-bold text-white">{quantity}</span>
          </div>
        )}
      </div>

      {/* Add Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onQuickAdd()
        }}
        className="absolute bottom-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90 bg-cyan-500 hover:bg-cyan-400 text-white shadow-cyan-500/30"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Quick Add Popup */}
      {isQuickAddOpen && (
        <div 
          className="absolute bottom-16 right-0 z-50 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-72 p-4 rounded-2xl shadow-2xl border bg-[#131c2e] border-white/10">
            {/* Note Input */}
            <div className="mb-4">
              <label className="text-[10px] font-semibold uppercase tracking-wider mb-2 block text-slate-400">
                Siparis Notu (Opsiyonel)
              </label>
              <textarea
                autoFocus
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder="Orn: Sogansiz, az acili..."
                className="w-full p-3 rounded-xl text-sm resize-none border transition-all bg-[#0f172a] border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none"
                rows={2}
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">Adet</span>
              <div className="flex items-center gap-3 px-2 py-1 rounded-xl bg-[#0f172a]">
                <button 
                  onClick={() => setQuickQuantity(Math.max(1, quickQuantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 text-slate-400"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold text-white">{quickQuantity}</span>
                <button 
                  onClick={() => setQuickQuantity(quickQuantity + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 text-cyan-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={onCancelAdd}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors bg-white/5 text-slate-400 hover:bg-white/10"
              >
                Iptal
              </button>
              <button
                onClick={onConfirmAdd}
                className="flex-[2] py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-cyan-500 hover:bg-cyan-400 text-white"
              >
                <span>Ekle</span>
                <span className="opacity-60">({product.price * quickQuantity} TL)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
