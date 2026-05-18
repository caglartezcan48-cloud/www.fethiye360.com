import { createClient } from "@/lib/supabase/server"
import { MarqueeClient } from "./marquee-client"
import { Hero } from "./hero"

interface Banner {
  id: string
  background_image: string
  link_url: string | null
  alt_text: string | null
  title?: string | null
  subtitle?: string | null
  scroll_speed: number
  scroll_direction: string
  start_date?: string | null
  end_date?: string | null
}

async function getActiveBanners(): Promise<Banner[]> {
  const supabase = await createClient()

  // Aktif olan tüm banner'ları ve tüm sütunlarını çekiyoruz
  const { data, error } = await supabase
    .from('hero_banners')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Banner listesi yüklenirken hata oluştu:', error)
    return []
  }

  const now = new Date()

  // Tarih filtrelemesini JS tarafında %100 kararlı ve hatasız şekilde yapıyoruz
  return (data || []).filter(banner => {
    // Görsel yoksa gösterme
    if (!banner.background_image) return false

    const startDate = banner.start_date ? new Date(banner.start_date) : null
    const endDate = banner.end_date ? new Date(banner.end_date) : null

    // Başlangıç tarihi gelmediyse henüz gösterme
    if (startDate && startDate > now) return false

    // Bitiş tarihi geçtiyse gösterme
    if (endDate && endDate < now) return false

    return true
  })
}

export async function MarqueeBanners() {
  const banners = await getActiveBanners()

  if (banners.length === 0) {
    return <Hero />
  }

  return <MarqueeClient banners={banners} isHero={true} />
}
