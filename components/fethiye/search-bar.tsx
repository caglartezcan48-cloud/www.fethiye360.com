'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Loader2, Store, Tag, ArrowRight } from 'lucide-react'

function SearchBarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get('ara') || ''
  
  const [query, setQuery] = useState(urlQuery)
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // URL'deki arama değiştiğinde inputu güncelle
  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  // Disari tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Anlık arama tetikleyicisi
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2 && query !== urlQuery) {
        setIsSearching(true)
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
          const data = await res.json()
          setResults(data.results || [])
          setIsOpen(true)
        } catch (error) {
          console.error('Search error:', error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query, urlQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    // Sosyal kesif yerine isletmeler rehberine yonlendir (isletmeler sayfası 'q' parametresini okuyor)
    router.push(`/isletmeler?q=${encodeURIComponent(query.trim())}`)
    setIsOpen(false)
  }

  const navigateTo = (path: string) => {
    router.push(path)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-8" ref={menuRef}>
      {/* HD Search Input Container */}
      <form 
        onSubmit={handleSearch}
        className="relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#64ffda] to-blue-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
        <div className="relative flex items-center">
          <div className="absolute left-5 text-slate-400 group-focus-within:text-[#64ffda] transition-colors">
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder="Fethiye'de ne arıyorsunuz? (Örn: Kasap, Otel, Eczane...)"
            className="w-full bg-[#112240]/90 backdrop-blur-xl border border-white/10 rounded-2xl py-6 pl-14 pr-32 text-white text-lg placeholder:text-slate-500 focus:outline-none focus:border-[#64ffda]/50 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          />
          <button
            type="submit"
            className="absolute right-3 bg-[#64ffda] text-[#0a192f] px-8 py-3.5 rounded-xl font-bold hover:bg-[#52e0c4] hover:scale-105 transition-all shadow-lg active:scale-95"
          >
            ARA
          </button>
        </div>
      </form>

      {/* Instant Results Dropdown - HD Design */}
      {isOpen && (results.length > 0 || isSearching) && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#112240]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.7)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {results.map((result, index) => (
              <button
                key={index}
                onClick={() => {
                  let url = '';
                  switch(result.type) {
                    case 'category': url = `/kesfet/${result.slug}`; break;
                    case 'profile': url = `/profil/${result.slug}`; break;
                    case 'post': url = `/sosyal/post/${result.slug}`; break;
                    default: url = `/isletme/${result.slug}`;
                  }
                  navigateTo(url);
                }}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors group/item"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center 
                    ${result.type === 'category' ? 'bg-blue-500/10 text-blue-400' : 
                      result.type === 'profile' ? 'bg-purple-500/10 text-purple-400' :
                      result.type === 'post' ? 'bg-orange-500/10 text-orange-400' :
                      'bg-[#64ffda]/10 text-[#64ffda]'}`}>
                    {result.type === 'category' ? <Tag className="w-5 h-5" /> : 
                     result.type === 'profile' ? <Search className="w-5 h-5" /> :
                     result.type === 'post' ? <ArrowRight className="w-5 h-5" /> :
                     <Store className="w-5 h-5" />}
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold group-hover/item:text-[#64ffda] transition-colors line-clamp-1">{result.name}</div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-widest flex items-center gap-2">
                      <span>{
                        result.type === 'category' ? 'Kategori' : 
                        result.type === 'profile' ? 'Profil' :
                        result.type === 'post' ? 'Gönderi' : 'İşletme'
                      }</span>
                      {result.subtitle && <span className="normal-case tracking-normal text-slate-600">• {result.subtitle}</span>}
                      {result.category_name && <span className="normal-case tracking-normal text-slate-600">• {result.category_name}</span>}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover/item:text-[#64ffda] group-hover/item:translate-x-1 transition-all" />
              </button>
            ))}
            
            {results.length === 0 && !isSearching && (
              <div className="p-12 text-center space-y-3">
                <Search className="w-10 h-10 text-slate-700 mx-auto opacity-20" />
                <div className="text-slate-500 text-sm italic">Aradığınız kriterde sonuç bulunamadı...</div>
              </div>
            )}
          </div>
          
          <div className="bg-white/5 p-3 px-6 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Hızlı Sonuçlar</span>
            <span className="text-[10px] text-[#64ffda] font-bold">FETHİYE 360°</span>
          </div>
        </div>
      )}

      {/* Quick Tags */}
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {['Restoran', 'Otel', 'Kasap', 'Eczane', 'Plaj'].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              setQuery(tag)
              navigateTo(`/isletmeler?q=${encodeURIComponent(tag)}`)
            }}
            className="text-xs text-slate-400 hover:text-[#64ffda] bg-white/5 hover:bg-[#64ffda]/10 px-4 py-1.5 rounded-full border border-white/5 hover:border-[#64ffda]/30 transition-all"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SearchBar() {
  return (
    <Suspense fallback={<div className="h-20" />}>
      <SearchBarContent />
    </Suspense>
  )
}
