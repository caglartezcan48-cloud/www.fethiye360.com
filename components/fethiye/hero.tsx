"use client"

import { ArrowDown, Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "./search-bar"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* HD Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=90"
          alt="Fethiye Ölüdeniz Plajı"
          fill
          priority
          unoptimized={true}
          className="object-cover opacity-40 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-[#0a192f]/60 to-[#0a192f]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a192f_100%)] opacity-70" />
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#64ffda]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto">
          {/* HD Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 text-[#64ffda] animate-spin-slow" />
            <span className="text-[#64ffda] text-xs font-bold uppercase tracking-[0.2em]">Fethiye'nin Dijital Dünyası</span>
          </div>

          {/* Main Title - HD Styling */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Fethiye'yi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64ffda] via-[#52e0c4] to-blue-400 drop-shadow-[0_0_30px_rgba(100,255,218,0.3)]">
              360° Keşfet
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Şehrin en güzel noktalarını sanal turla gez. Plajlardan tarihi yerlere, 
            işletmelerden gizli kalmış köşelere kadar her yeri HD kalitede keşfet.
          </p>

          <div className="animate-in fade-in zoom-in-95 duration-1000 delay-300">
            <SearchBar />
          </div>

          {/* Hero Action Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-14 duration-1000 delay-400">
            <Link href="/kesfet">
              <Button className="bg-[#64ffda] text-[#0a192f] hover:bg-[#52e0c4] font-black uppercase tracking-widest text-xs px-10 h-14 rounded-2xl shadow-xl shadow-[#64ffda]/20 group">
                Hemen Keşfet
              </Button>
            </Link>
            <Link href="#rehber">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest text-xs px-10 h-14 rounded-2xl">
                Sanal Turlar
              </Button>
            </Link>
          </div>

          {/* Stats - HD Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
            {[
              { label: 'Sanal Tur', value: '12+', sub: 'HD Kalite' },
              { label: 'İşletme', value: '250+', sub: 'Kayıtlı' },
              { label: 'Görüntü', value: '360°', sub: 'İnteraktif' },
              { label: 'Hız', value: '0.1s', sub: 'Anlık Arama' },
            ].map((stat, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-[#64ffda]/30 transition-all cursor-default">
                <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#64ffda] transition-colors">{stat.value}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">{stat.label}</div>
                <div className="text-[9px] text-[#64ffda]/50 font-medium mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Keşfet</span>
        <ArrowDown className="w-5 h-5 text-[#64ffda]" />
      </div>
    </section>
  )
}
