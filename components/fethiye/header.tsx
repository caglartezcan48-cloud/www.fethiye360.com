"use client"

import { useEffect, useState } from "react"
import { Menu, X, Compass, User, Building2, Bell, LogIn, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CityStats } from "./city-stats"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

const navLinks = [
  { href: "/kesfet", label: "Keşfet" },
  { href: "/sosyal", label: "Sosyal" },
  { href: "/#turlar", label: "Turlar" },
  { href: "/#harita", label: "Harita" },
]

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .single()
        setIsOwner(!!business)

        // Okunmamis bildirim sayisini getir
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false)
        
        setUnreadCount(count || 0)
      }
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a192f]/80 backdrop-blur-2xl border-b border-white/5">
      <CityStats />
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#64ffda] to-blue-500 flex items-center justify-center transition-all group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-[#64ffda]/20">
            <Compass className="w-5 h-5 text-[#0a192f]" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase italic">
            Fethiye<span className="text-[#64ffda]">360</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-400 hover:text-[#64ffda] transition-all font-bold text-sm uppercase tracking-widest"
            >
              {link.label}
            </Link>
          ))}
          
          <div className="h-6 w-[1px] bg-white/10 mx-2" />

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/mesajlar" className="relative p-2.5 text-slate-400 hover:text-[#64ffda] bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group">
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link href="/bildirimler" className="relative p-2.5 text-slate-400 hover:text-[#64ffda] bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0a192f] flex items-center justify-center text-[8px] font-black text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link href={isOwner ? "/isletme-paneli" : "/profil"}>
                <Button className="bg-[#64ffda] text-[#0a192f] hover:bg-[#52e0c4] font-black uppercase tracking-widest text-[10px] px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-[#64ffda]/10">
                  {isOwner ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  {isOwner ? "Panelim" : "Profilim"}
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/giris">
              <Button className="bg-white/5 text-white hover:bg-white/10 border border-white/10 font-black uppercase tracking-widest text-[10px] px-6 rounded-xl flex items-center gap-2">
                <LogIn className="w-4 h-4 text-[#64ffda]" />
                Giriş Yap
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 bg-white/5 rounded-xl border border-white/5"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a192f] border-b border-white/5 animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-400 hover:text-[#64ffda] transition-all font-bold text-lg py-2 border-b border-white/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link 
                href={isOwner ? "/isletme-paneli" : "/profil"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10"
              >
                <div className="w-10 h-10 bg-[#64ffda] rounded-xl flex items-center justify-center text-[#0a192f]">
                  {isOwner ? <Building2 /> : <User />}
                </div>
                <div className="font-black text-white uppercase tracking-widest text-sm">
                  {isOwner ? "İşletme Panelim" : "Kullanıcı Profilim"}
                </div>
              </Link>
            ) : (
              <Link href="/giris" onClick={() => setMobileMenuOpen(false)}>
                <Button className="bg-[#64ffda] text-[#0a192f] hover:bg-[#52e0c4] w-full py-6 rounded-2xl font-black uppercase tracking-widest">
                  Giriş Yap
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
