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
    const q = query.toLowerCase().trim()
    
    let targetUrl = `/kesfet?ara=${encodeURIComponent(q)}`
    
    // Akilli Tahmin: Turkce karakter ve harf hatalarina karsi esnek kontrol
    if (q.includes('hav') || q.includes('durum')) {
      targetUrl = '/fethiye/hava-durumu'
    } else if (q.includes('ecz') || q.includes('ezc') || q.includes('nobet') || q.includes('nöbet')) {
      targetUrl = '/fethiye/nobetci-ezcaneler'
    }

    router.push(targetUrl)
    setTimeout(() => setIsSearching(false), 1000)
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
          placeholder="Fethiye'de ne arıyorsunuz? (Örn: Kasap, Otel, Eczane...)"
          className="w-full bg-[#112240]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl py-5 pl-12 pr-32 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#64ffda] focus:ring-1 focus:ring-[#64ffda]/50 transition-all shadow-2xl"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute right-2 bg-[#64ffda] text-[#0a192f] px-6 py-3 rounded-xl font-semibold hover:bg-[#52e0c4] transition-colors disabled:opacity-50"
        >
          {isSearching ? 'Aranıyor...' : 'Ara'}
        </button>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {['Restoran', 'Otel', 'Kasap', 'Tamirci', 'Eczane'].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              setQuery(tag)
              router.push(`/kesfet?ara=${encodeURIComponent(tag)}`)
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
