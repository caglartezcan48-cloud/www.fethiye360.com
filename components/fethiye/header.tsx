'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  Search, 
  User, 
  LogOut,
  Map,
  Compass,
  MessageSquare,
  Bell,
  Navigation,
  Sparkles,
  Camera
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CityStats } from './city-stats'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    
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
      <CityStats />
      
      <div className={`mx-auto transition-all duration-500 ${isScrolled ? 'max-w-7xl mt-4 px-4' : 'max-w-full mt-0 px-0'}`}>
        <nav className={`relative transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#0a192f]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] px-8 py-4 shadow-2xl' 
            : 'bg-[#0a192f]/40 backdrop-blur-md border-b border-white/5 px-12 py-6'
        }`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#64ffda] rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform shadow-lg shadow-[#64ffda]/20">
                <Navigation className="w-6 h-6 text-[#0a192f] -rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tighter leading-none italic">FETHİYE<span className="text-[#64ffda]">360</span></span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-10">
              <Link href="/kesfet" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">KEŞFET</Link>
              <Link href="/isletmeler" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">İŞLETMELER</Link>
              <Link href="/rehber" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">REHBER</Link>
              <Link href="/sosyal" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">SOSYAL</Link>
              <Link href="/aktivite-planla" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">AKTİVİTE PLANLA</Link>
              <Link href="/harita" className="text-[11px] font-black text-white/70 hover:text-[#64ffda] transition-colors tracking-[0.2em] uppercase">HARİTA</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="hidden md:flex p-3 bg-white/5 text-slate-400 hover:text-white rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                <Search className="w-5 h-5" />
              </button>
              
              {user ? (
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <Link href="/mesajlar" className="p-3 bg-white/5 text-slate-400 hover:text-[#64ffda] rounded-2xl relative group transition-all border border-white/5">
                    <MessageSquare className="w-5 h-5" />
                  </Link>
                  <Link href="/bildirimler" className="p-3 bg-white/5 text-slate-400 hover:text-[#64ffda] rounded-2xl relative group transition-all border border-white/5">
                    <Bell className="w-5 h-5" />
                  </Link>
                  <Link href="/profil" className="flex items-center gap-3 px-6 py-3 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black text-[10px] tracking-widest uppercase hover:scale-105 transition-all shadow-lg shadow-[#64ffda]/20">
                    <User className="w-4 h-4" /> PROFİLİM
                  </Link>
                  <button onClick={handleSignOut} className="p-3 bg-white/5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all border border-white/5">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link href="/giris" className="flex items-center gap-3 px-8 py-3 bg-white/5 text-white border border-white/10 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition-all">
                  <User className="w-4 h-4 text-[#64ffda]" /> GİRİŞ YAP
                </Link>
              )}

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3 bg-white/5 text-white rounded-2xl border border-white/5"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[90] bg-[#0a192f] pt-32 px-6 animate-in fade-in duration-300">
          <div className="flex flex-col gap-6">
            <Link href="/kesfet" className="text-3xl font-black text-white italic tracking-tighter">KEŞFET</Link>
            <Link href="/isletmeler" className="text-3xl font-black text-white italic tracking-tighter">İŞLETMELER</Link>
            <Link href="/rehber" className="text-3xl font-black text-white italic tracking-tighter">REHBER</Link>
            <Link href="/sosyal" className="text-3xl font-black text-white italic tracking-tighter">SOSYAL</Link>
            <Link href="/turlar" className="text-3xl font-black text-white italic tracking-tighter">TURLAR</Link>
            <Link href="/harita" className="text-3xl font-black text-white italic tracking-tighter">HARİTA</Link>
          </div>
        </div>
      )}
    </header>
  )
}
