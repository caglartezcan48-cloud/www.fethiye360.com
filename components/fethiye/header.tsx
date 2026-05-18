"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

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

function MessageIcon() {
  return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
}

function BellIcon() {
  return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
}

function LogOutIcon() {
  return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Search Overlay States
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

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

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-10">
              <Link href="/isletmeler" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">ISLETMELER</Link>
              <Link href="/rehber" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">REHBER</Link>
              <Link href="/sosyal" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">SOSYAL</Link>
              <Link href="/aktivite-planla" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">AKTIVITE PLANLA</Link>
              <Link href="/harita" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">HARITA</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex p-3 bg-white/5 text-slate-400 hover:text-[#64ffda] hover:bg-white/10 rounded-2xl transition-all border border-white/5"
              >
                <SearchIcon />
              </button>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/profil" className="flex items-center gap-3 px-6 py-3 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black text-[10px] tracking-widest uppercase hover:scale-105 transition-all shadow-lg shadow-[#64ffda]/20">
                    <UserIcon /> PROFILIM
                  </Link>
                  <button onClick={handleSignOut} className="p-3 bg-white/5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all border border-white/5">
                    <LogOutIcon />
                  </button>
                </div>
              ) : (
                <Link href="/giris" className="flex items-center gap-3 px-8 py-3 bg-white/5 text-white border border-white/10 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition-all">
                  <UserIcon /> GIRIS YAP
                </Link>
              )}

              <button 
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden p-3 bg-white/5 text-white rounded-2xl border border-white/5 mr-1"
              >
                <SearchIcon />
              </button>

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3 bg-white/5 text-white rounded-2xl border border-white/5"
              >
                {isMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[90] bg-[#0a192f] pt-32 px-6 animate-in fade-in duration-300">
          <div className="flex flex-col gap-6">
            <Link href="/isletmeler" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-white italic tracking-tighter">ISLETMELER</Link>
            <Link href="/rehber" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-white italic tracking-tighter">REHBER</Link>
            <Link href="/sosyal" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-white italic tracking-tighter">SOSYAL</Link>
            <Link href="/aktivite-planla" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-white italic tracking-tighter">AKTIVITE PLANLA</Link>
            <Link href="/harita" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-white italic tracking-tighter">HARITA</Link>
          </div>
        </div>
      )}

      {/* Interactive Search Overlay Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[200] bg-[#0a0f1a]/95 backdrop-blur-2xl flex items-start justify-center pt-24 px-4 sm:px-6 animate-in fade-in duration-300">
          <div className="w-full max-w-3xl relative space-y-6">
            
            {/* Close Button */}
            <button 
              onClick={() => {
                setIsSearchOpen(false)
                setSearchQuery('')
                setSearchResults([])
              }}
              className="absolute -top-14 right-0 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white border border-white/5 transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            {/* Glowing Search Box */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#64ffda] to-blue-500 rounded-2xl blur opacity-25 group-focus-within:opacity-55 transition duration-500"></div>
              <div className="relative flex items-center">
                <div className="absolute left-5 text-slate-400 group-focus-within:text-[#64ffda] transition-colors">
                  {searching ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
                  ) : (
                    <SearchIcon />
                  )}
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Fethiye'de ne arıyorsunuz? (Örn: Kasap, Otel, Eczane...)"
                  className="w-full bg-[#112240]/90 backdrop-blur-xl border border-white/10 rounded-2xl py-6 pl-14 pr-12 text-white text-lg placeholder:text-slate-500 focus:outline-none focus:border-[#64ffda]/50 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Results Dropdown */}
            {searchQuery.trim().length >= 2 && (searchResults.length > 0 || searching) && (
              <div className="bg-[#112240]/95 border border-white/10 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.7)] overflow-hidden max-h-[60vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
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
                        setIsSearchOpen(false)
                        setSearchQuery('')
                        setSearchResults([])
                        window.location.href = url
                      }}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors group/item"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-[#64ffda]/10 text-[#64ffda]`}>
                          <SearchIcon />
                        </div>
                        <div className="text-left">
                          <div className="text-white font-semibold group-hover/item:text-[#64ffda] transition-colors line-clamp-1">{result.name}</div>
                          <div className="text-slate-500 text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <span>{result.type === 'category' ? 'Kategori' : result.type === 'post' ? 'Gönderi' : 'İşletme'}</span>
                            {result.subtitle && <span className="normal-case tracking-normal text-slate-600">• {result.subtitle}</span>}
                            {result.category_name && <span className="normal-case tracking-normal text-slate-600">• {result.category_name}</span>}
                          </div>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-slate-600 group-hover/item:text-[#64ffda] group-hover/item:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  ))}
                  
                  {searchResults.length === 0 && !searching && (
                    <div className="p-12 text-center">
                      <p className="text-slate-500 text-sm italic">Aradığınız kriterde sonuç bulunamadı...</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </header>
  )
}
