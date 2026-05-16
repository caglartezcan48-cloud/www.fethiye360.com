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

const supabase = createClient()

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)

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
              <Link href="/kesfet" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">KESFET</Link>
              <Link href="/isletmeler" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">ISLETMELER</Link>
              <Link href="/rehber" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">REHBER</Link>
              <Link href="/sosyal" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">SOSYAL</Link>
              <Link href="/aktivite-planla" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">AKTIVITE PLANLA</Link>
              <Link href="/harita" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">HARITA</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="hidden md:flex p-3 bg-white/5 text-slate-400 hover:text-white rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                <SearchIcon />
              </button>
              
              {user ? (
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <Link href="/mesajlar" className="p-3 bg-white/5 text-slate-400 hover:text-[#64ffda] rounded-2xl relative group transition-all border border-white/5">
                    <MessageIcon />
                  </Link>
                  <Link href="/bildirimler" className="p-3 bg-white/5 text-slate-400 hover:text-[#64ffda] rounded-2xl relative group transition-all border border-white/5">
                    <BellIcon />
                  </Link>
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
            <Link href="/kesfet" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-white italic tracking-tighter">KESFET</Link>
            <Link href="/isletmeler" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-white italic tracking-tighter">ISLETMELER</Link>
            <Link href="/rehber" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-white italic tracking-tighter">REHBER</Link>
            <Link href="/sosyal" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-white italic tracking-tighter">SOSYAL</Link>
            <Link href="/aktivite-planla" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-white italic tracking-tighter">AKTIVITE PLANLA</Link>
            <Link href="/harita" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-white italic tracking-tighter">HARITA</Link>
          </div>
        </div>
      )}
    </header>
  )
}
