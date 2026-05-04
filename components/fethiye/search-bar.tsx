'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    
    // Basit bir arama mantığı: Yazılan kelimeye göre kategori sayfasına yönlendir
    const q = query.toLowerCase().trim()
    
    // Akıllı yönlendirme kuralları
    if (q.includes('restoran') || q.includes('yemek') || q.includes('cafe') || q.includes('kahve')) {
      router.push('/kesfet/restoran-cafe')
    } else if (q.includes('otel') || q.includes('pansiyon') || q.includes('konaklama')) {
      router.push('/kesfet/otel-pansiyon')
    } else if (q.includes('tamir') || q.includes('servis') || q.includes('usta')) {
      router.push('/kesfet/tamirhane-servis')
    } else if (q.includes('kasap') || q.includes('et')) {
      router.push('/kesfet/kasap-sarkuteri')
    } else if (q.includes('cicek') || q.includes('hediye')) {
      router.push('/kesfet/cicekciler')
    } else if (q.includes('eczane') || q.includes('saglik') || q.includes('ilac')) {
      router.push('/kesfet/eczaneler')
    } else {
      // Eşleşme yoksa genel arama sayfasına (ileride yapılacak) veya genel keşfet sayfasına gönder
      router.push(`/kesfet?ara=${encodeURIComponent(q)}`)
    }
  }

  return (
    <form 
      onSubmit={handleSearch}
      className="relative w-full max-w-2xl mx-auto mt-8 group"
    >
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 group-focus-within:text-[#64ffda] transition-colors">
          {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Fethiye'de ne arıyorsunuz? (Örn: Restoran, Otel, Kasap...)"
          className="w-full bg-[#112240]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl py-5 pl-12 pr-32 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#64ffda] focus:ring-1 focus:ring-[#64ffda]/50 transition-all shadow-2xl"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute right-2 bg-[#64ffda] text-[#0a192f] px-6 py-3 rounded-xl font-semibold hover:bg-[#52e0c4] transition-colors disabled:opacity-50"
        >
          Ara
        </button>
      </div>
      
      {/* Popüler Aramalar - Küçük İpuçları */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {['Restoran', 'Otel', 'Kasap', 'Tamirci', 'Eczane'].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              setQuery(tag)
              // Küçük bir gecikmeyle aramayı tetikle
              setTimeout(() => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100)
            }}
            className="text-xs text-slate-400 hover:text-[#64ffda] bg-slate-800/40 hover:bg-[#64ffda]/10 px-3 py-1 rounded-full border border-slate-700/50 transition-all"
          >
            {tag}
          </button>
        ))}
      </div>
    </form>
  )
}
