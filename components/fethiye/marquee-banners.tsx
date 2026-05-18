import { createClient } from "@/lib/supabase/server"
import { MarqueeClient } from "./marquee-client"
import { Hero } from "./hero"

interface Banner {
  id: string
  background_image: string
  link_url: string | null
  alt_text: string | null
  scroll_speed: number
  scroll_direction: string
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

export async function MarqueeBanners() {
  const banners = await getActiveBanners()

  if (banners.length === 0) {
    return <Hero />
  }

  return <MarqueeClient banners={banners} isHero={true} />
}
