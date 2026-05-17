import { Button } from "@/components/ui/button"
import { SearchBar } from "./search-bar"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

interface HeroBanner {
  id: string
  title: string
  subtitle: string | null
  badge_text: string | null
  button_text: string | null
  button_url: string | null
  secondary_button_text: string | null
  secondary_button_url: string | null
  background_image: string | null
}

async function getActiveBanner(): Promise<HeroBanner | null> {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data } = await supabase
    .from('hero_banners')
    .select('*')
    .eq('is_active', true)
    .or(`start_date.is.null,start_date.lte.${now}`)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .order('display_order', { ascending: true })
    .limit(1)
    .single()

  return data
}

// Varsayilan banner bilgileri
const defaultBanner: HeroBanner = {
  id: 'default',
  title: "Fethiye'yi 360° Keşfet",
  subtitle: "Şehrin en güzel noktalarını sanal turla gez. Plajlardan tarihi yerlere, işletmelerden gizli kalmış köşelere kadar her yeri HD kalitede keşfet.",
  badge_text: "Fethiye'nin Dijital Dünyası",
  button_text: "Hemen Keşfet",
  button_url: "/kesfet",
  secondary_button_text: "Sanal Turlar",
  secondary_button_url: "#rehber",
  background_image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640&q=40&fm=avif&fit=crop"
}

export async function Hero() {
  const banner = await getActiveBanner() || defaultBanner

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* HD Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={banner.background_image || defaultBanner.background_image!}
          alt="Fethiye Ölüdeniz Plajı"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 100vw"
          quality={50}
          className="object-cover opacity-40"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSIRMxQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECABEhMf/aAAwDAQACEQMRAD8AzrR9s6hd6Ra3UskUKyxLIEJJIDDOMj96qfxK+X/K2lKU5Y6jLAHuf//Z"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-[#0a192f]/60 to-[#0a192f]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a192f_100%)] opacity-70" />
      </div>

      {/* Decorative Glows - GPU accelerated */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#64ffda]/8 rounded-full blur-3xl opacity-50" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl opacity-50" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto">
          {/* HD Badge */}
          {banner.badge_text && (
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md animate-in fade-in duration-300">
              <svg className="w-4 h-4 text-[#64ffda]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              <span className="text-[#64ffda] text-xs font-bold uppercase tracking-[0.2em]">{banner.badge_text}</span>
            </div>
          )}

          {/* Main Title - HD Styling */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter animate-in fade-in duration-500">
            {banner.title.includes('360°') ? (
              <>
                {banner.title.split('360°')[0]}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64ffda] via-[#52e0c4] to-blue-400 drop-shadow-[0_0_30px_rgba(100,255,218,0.3)]">
                  360° {banner.title.split('360°')[1] || 'Keşfet'}
                </span>
              </>
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64ffda] via-[#52e0c4] to-blue-400 drop-shadow-[0_0_30px_rgba(100,255,218,0.3)]">
                {banner.title}
              </span>
            )}
          </h1>

          {/* Subtitle */}
          {banner.subtitle && (
            <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              {banner.subtitle}
            </p>
          )}

          <div className="animate-in fade-in zoom-in-95 duration-1000 delay-300">
            <SearchBar />
          </div>

          {/* Hero Action Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-14 duration-1000 delay-400">
            {banner.button_text && banner.button_url && (
              <Link href={banner.button_url}>
                <Button className="bg-[#64ffda] text-[#0a192f] hover:bg-[#52e0c4] font-black uppercase tracking-widest text-xs px-10 h-14 rounded-2xl shadow-xl shadow-[#64ffda]/20 group">
                  {banner.button_text}
                </Button>
              </Link>
            )}
            {banner.secondary_button_text && banner.secondary_button_url && (
              <Link href={banner.secondary_button_url}>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest text-xs px-10 h-14 rounded-2xl">
                  {banner.secondary_button_text}
                </Button>
              </Link>
            )}
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
        <svg className="w-5 h-5 text-[#64ffda]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
      </div>
    </section>
  )
}
