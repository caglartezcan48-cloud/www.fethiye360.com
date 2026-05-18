'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ALL_ACTIVITIES } from '@/lib/planner-data'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { Compass, Loader2 } from 'lucide-react'
import { TourCard } from '@/components/fethiye/tour-card'
import { useRouter } from 'next/navigation'

export default function GuidePage() {
  const [activeCategory, setActiveCategory] = useState("Tümü")
  const [destinations, setDestinations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  // Dynamic Page Copy States
  const [pageTitle, setPageTitle] = useState("FETHİYE\'Yİ KEŞFET")
  const [pageSubtitle, setPageSubtitle] = useState("Tarihi mekanlardan turkuaz koylara kadar Fethiye'nin görülmesi gereken tüm noktalarını keşfedin.")
  const [pageTitleColor, setPageTitleColor] = useState("#ffffff")
  const [pageTitleSize, setPageTitleSize] = useState("text-5xl md:text-8xl")
  const [pageSubtitleColor, setPageSubtitleColor] = useState("#94a3b8")
  const [pageSubtitleSize, setPageSubtitleSize] = useState("text-base")

  const categories = ["Tümü", "Plaj", "Tarihi Yer", "Doğa", "Kültürel"]

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    setLoading(true)
    const { data: dbData } = await supabase.from('destinations').select('*').eq('is_active', true)
    
    const merged = ALL_ACTIVITIES.map(activity => {
      const dbMatch = dbData?.find(d => d.slug === activity.id || d.title.toLowerCase() === activity.title.toLowerCase())
      
      let uiCategory = "Doğa"
      if (activity.category === 'tarih') uiCategory = "Tarihi Yer"
      if (activity.category === 'sosyal') uiCategory = "Kültürel"
      if (activity.id.includes('plaj') || activity.id.includes('koyu') || activity.id === 'oludeniz' || activity.id === 'belcekiz' || activity.id === 'kumburnu') uiCategory = "Plaj"

      return {
        id: dbMatch?.id || activity.id,
        slug: activity.id,
        title: activity.title,
        category: uiCategory,
        main_image: dbMatch?.main_image || activity.image,
      }
    })

    setDestinations(merged)
    
    // Fetch dynamic page titles & colors
    try {
      const { data: textData } = await supabase
        .from('hero_banners')
        .select('title, background_image, link_url, scroll_direction')
        .eq('alt_text', 'TEXT_GUIDE')
        .maybeSingle()
      
      if (textData) {
        if (textData.title) setPageTitle(textData.title)
        if (textData.background_image) setPageSubtitle(textData.background_image)
        
        if (textData.link_url) {
          const [color, size] = textData.link_url.split('|')
          setPageTitleColor(color || '#ffffff')
          setPageTitleSize(size || 'text-5xl md:text-8xl')
        }
        if (textData.scroll_direction) {
          const [color, size] = textData.scroll_direction.split('|')
          setPageSubtitleColor(color || '#94a3b8')
          setPageSubtitleSize(size || 'text-base')
        }
      }
    } catch (err) {
      console.error('Rehber başlığı yüklenemedi:', err)
    }

    setLoading(false)
  }

  const filteredTours = activeCategory === "Tümü" 
    ? destinations 
    : destinations.filter(dest => dest.category === activeCategory)

  return (
    <main className="min-h-screen bg-[#0a192f] selection:bg-[#64ffda] selection:text-[#0a192f]">
      <Header />
      
      {/* Hero Section - Matching Home Style */}
      <section className="relative pt-24 pb-8 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#64ffda]/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/5 border border-white/10 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Compass className="w-4 h-4 text-[#64ffda]" />
            <span className="text-[#64ffda] text-[10px] font-black uppercase tracking-[0.3em]">GEZİ REHBERİ</span>
          </div>
          <h1 className={`font-black tracking-tighter uppercase italic leading-none animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 ${pageTitleSize}`} style={{ color: pageTitleColor }}>
            {pageTitle}
          </h1>
          <p className={`max-w-2xl mx-auto font-medium italic animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 ${pageSubtitleSize}`} style={{ color: pageSubtitleColor }}>
            {pageSubtitle}
          </p>

          {/* Category Filters - Same as Home */}
          <div className="flex flex-wrap justify-center gap-3 pt-8 animate-in fade-in duration-1000 delay-300">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === category 
                  ? 'bg-[#64ffda] text-[#0a192f] shadow-lg shadow-[#64ffda]/20' 
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-[#64ffda] animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">İçerik Hazırlanıyor...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-1000">
            {filteredTours.map((dest) => (
              <TourCard
                key={dest.id}
                title={dest.title}
                location="Fethiye / Muğla"
                category={dest.category}
                image={dest.main_image}
                onStartTour={() => router.push(`/rehber/${dest.slug}`)}
              />
            ))}
          </div>
        )}

        {!loading && filteredTours.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
            <p className="text-slate-500 font-bold italic text-sm">Bu kategoride henüz bir yer bulunamadı.</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
