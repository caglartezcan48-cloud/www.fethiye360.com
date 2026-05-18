"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { usePathname } from 'next/navigation'

const supabase = createClient()

function SearchIcon() {
  return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
}

function UserIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}

function MenuIcon() {
  return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
}

function XIcon() {
  return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
}

function LogOutIcon() {
  return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
}

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Expandable Search States
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  
  const searchRef = useRef<HTMLDivElement>(null)

  // Click away to close search box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false)
        setSearchQuery('')
        setSearchResults([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Live query search fetcher
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setSearching(true)
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`)
          const data = await res.json()
          setSearchResults(data.results || [])
        } catch (error) {
          console.error(error)
        } finally {
          setSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500">
      <div className={`mx-auto transition-all duration-500 ${isScrolled ? 'max-w-7xl mt-4 px-4' : 'max-w-full mt-0 px-0'}`}>
        <nav className={`relative transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#0a192f]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] px-8 py-4 shadow-2xl' 
            : 'bg-[#0a192f]/40 backdrop-blur-md border-b border-white/5 px-12 py-6'
        }`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <Image 
                src="/images/fethiye360-logo.png" 
                alt="Fethiye360 Logo" 
                width={180}
                height={56}
                priority
                sizes="180px"
                className="h-14 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-sm"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-10">
              {[
                { href: '/isletmeler', label: 'ISLETMELER' },
                { href: '/rehber', label: 'REHBER' },
                { href: '/sosyal', label: 'SOSYAL' },
                { href: '/aktivite-planla', label: 'AKTIVITE PLANLA' }
              ].map((item) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + '/')
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`relative py-2 text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                      active ? 'text-[#64ffda] drop-shadow-[0_0_8px_rgba(100,255,218,0.5)]' : 'text-white/70 hover:text-[#64ffda]'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#64ffda] to-transparent rounded-full shadow-[0_0_8px_#64ffda] animate-in fade-in duration-300" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-4">
              
              {/* Expandable Search Input Container */}
              <div className="relative flex items-center" ref={searchRef}>
                {isSearchExpanded ? (
                  <div className="flex items-center bg-[#0a192f]/90 border border-white/10 rounded-2xl px-4 py-2 w-60 sm:w-80 transition-all duration-300 animate-in fade-in zoom-in-95">
                    <span className="text-slate-400 mr-2.5 flex items-center">
                      {searching ? (
                        <svg className="w-4 h-4 animate-spin text-[#64ffda]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="30" strokeDashoffset="10"/></svg>
                      ) : (
                        <SearchIcon />
                      )}
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Fethiye'de ara..."
                      className="w-full bg-transparent border-none text-white text-xs placeholder:text-slate-500 focus:outline-none"
                      autoFocus
                    />
                    <button 
                      onClick={() => {
                        setIsSearchExpanded(false)
                        setSearchQuery('')
                        setSearchResults([])
                      }}
                      className="text-slate-400 hover:text-white ml-2 flex items-center"
                    >
                      <XIcon />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsSearchExpanded(true)}
                    className="p-3 bg-white/5 text-slate-400 hover:text-[#64ffda] hover:bg-white/10 hover:border-[#64ffda]/30 rounded-2xl transition-all duration-300 border border-white/10 flex items-center active:scale-95 shadow-md"
                    title="Ara"
                  >
                    <SearchIcon />
                  </button>
                )}

                {/* Floating Results Box (No Background Darkening!) */}
                {isSearchExpanded && searchQuery.trim().length >= 2 && (searchResults.length > 0 || searching) && (
                  <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-[#112240]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden max-h-[320px] overflow-y-auto z-[200] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2">
                      {searchResults.map((result: any, index: number) => (
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
                            setIsSearchExpanded(false)
                            setSearchQuery('')
                            setSearchResults([])
                            window.location.href = url
                          }}
                          className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 rounded-xl transition-colors group/item"
                        >
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-[#64ffda]/10 text-[#64ffda] shrink-0 border border-white/5">
                                {result.image_url ? (
                                  <img src={result.image_url} alt={result.name} className="w-full h-full object-cover" />
                                ) : result.type === 'profile' ? (
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                ) : (
                                  <SearchIcon />
                                )}
                              </div>
                              <div className="text-left">
                                <div className="text-white font-semibold text-xs group-hover/item:text-[#64ffda] transition-colors line-clamp-1">{result.name}</div>
                                <div className="text-slate-500 text-[9px] uppercase tracking-widest flex items-center gap-1.5 flex-wrap">
                                  <span>{
                                    result.type === 'category' ? 'Kategori' : 
                                    result.type === 'post' ? 'Gönderi' : 
                                    result.type === 'profile' ? 'Kullanıcı Profili' :
                                    result.type === 'product' ? 'Ürün / Hizmet' : 'İşletme'
                                  }</span>
                                  {result.category_name && <span className="normal-case tracking-normal text-slate-600">• {result.category_name}</span>}
                                  {result.subtitle && <span className="normal-case tracking-normal text-slate-400">• {result.subtitle}</span>}
                                </div>
                              </div>
                          </div>
                          <svg className="w-3.5 h-3.5 text-slate-600 group-hover/item:text-[#64ffda] group-hover/item:translate-x-1 transition-all animate-out duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                      ))}
                      
                      {searchResults.length === 0 && !searching && (
                        <div className="p-8 text-center text-slate-500 text-xs italic">
                          Sonuç bulunamadı...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Profile / Authenticated states */}
              {user ? (
                <div className="flex items-center gap-3">
                  <Link 
                    href="/profil" 
                    className="relative flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all duration-300 active:scale-95 group/btn overflow-hidden border border-[#64ffda]/30 bg-gradient-to-r from-[#64ffda] to-[#52e0c4] text-[#0a192f] shadow-[0_4px_20px_rgba(100,255,218,0.2)] hover:shadow-[0_4px_30px_rgba(100,255,218,0.4)]"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    <UserIcon /> PROFILIM
                  </Link>
                  <button 
                    onClick={handleSignOut} 
                    className="p-3 bg-white/5 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all duration-300 border border-white/5 hover:border-red-500/20 flex items-center active:scale-95 shadow-md"
                    title="Çıkış Yap"
                  >
                    <LogOutIcon />
                  </button>
                </div>
              ) : (
                <Link 
                  href="/giris" 
                  className="relative flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all duration-300 active:scale-95 group/btn overflow-hidden border border-white/10 hover:border-[#64ffda]/30 bg-white/5 hover:bg-white/10 text-white shadow-lg"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                  <UserIcon /> GİRİŞ YAP
                </Link>
              )}

              {/* Mobile Drawer Trigger */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3 bg-white/5 text-white rounded-2xl border border-white/5 flex items-center"
              >
                {isMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[90] bg-[#0a192f] pt-32 px-6 animate-in fade-in duration-300">
          <div className="flex flex-col gap-6">
            <Link href="/isletmeler" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-white italic tracking-tighter">ISLETMELER</Link>
            <Link href="/rehber" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-white italic tracking-tighter">REHBER</Link>
            <Link href="/sosyal" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-white italic tracking-tighter">SOSYAL</Link>
            <Link href="/aktivite-planla" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-white italic tracking-tighter">AKTIVITE PLANLA</Link>
          </div>
        </div>
      )}
    </header>
  )
}
