import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { MarqueeClient } from "./marquee-client"

interface Banner {
  id: string
  background_image: string
  link_url: string | null
  alt_text: string | null
  scroll_speed: number
  scroll_direction: string
  display_order: number
}

async function getActiveBanners(): Promise<Banner[]> {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data } = await supabase
    .from('hero_banners')
    .select('id, background_image, link_url, alt_text, scroll_speed, scroll_direction, display_order')
    .eq('is_active', true)
    .or(`start_date.is.null,start_date.lte.${now}`)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .not('background_image', 'is', null)
    .order('display_order', { ascending: true })

  return data || []
}

export async function Hero() {
  const banners = await getActiveBanners()

  // Banner yoksa varsayilan hero goster
  if (banners.length === 0) {
    return <DefaultHero />
  }

  // Banner varsa marquee goster
  return <MarqueeClient banners={banners} />
}

function DefaultHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640&q=40&fm=avif&fit=crop"
          alt="Fethiye"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 100vw"
          quality={50}
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-[#0a192f]/60 to-[#0a192f]" />
      </div>
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
            {"Fethiye'yi"}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64ffda] via-[#52e0c4] to-blue-400">
              360° Kesfet
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            {"Sehrin en guzel noktalarini sanal turla gez"}
          </p>
        </div>
      </div>
    </section>
  )
}
