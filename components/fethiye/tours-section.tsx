"use client"

import { useState, useEffect } from "react"
import { TourCard } from "./tour-card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Compass } from "lucide-react"
import { useRouter } from "next/navigation"

export function ToursSection() {
  const [activeCategory, setActiveCategory] = useState("Tümü")
  const [destinations, setDestinations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  const categories = ["Tümü", "Plaj", "Tarihi Yer", "Doğa", "Kültürel"]

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    setLoading(true)
    const { data } = await supabase.from('destinations').select('*').eq('is_active', true)
    setDestinations(data || [])
    setLoading(false)
  }

  const filteredTours = activeCategory === "Tümü" 
    ? destinations 
    : destinations.filter(dest => dest.category === activeCategory)

  if (loading) return (
    <div className="py-32 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-[#64ffda] animate-spin" />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Rehber Yükleniyor...</p>
    </div>
  )

  return (
    <section id="turlar" className="py-32 bg-background relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#64ffda]/5 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/5 border border-white/10 rounded-full">
            <Compass className="w-4 h-4 text-[#64ffda]" />
            <span className="text-[#64ffda] text-[10px] font-black uppercase tracking-widest">Gezi Rehberi</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase italic">
            Fethiye'yi <span className="text-[#64ffda]">Karış Karış</span> Gez
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-medium">
            Tarihi mekanlardan turkuaz koylara kadar Fethiye'nin görülmesi gereken tüm noktalarını 
            fotoğraflar, tarihçe ve ulaşım detaylarıyla keşfedin.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
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

        {/* Tours Grid */}
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((dest) => (
              <TourCard
                key={dest.id}
                title={dest.title}
                location="Fethiye"
                category={dest.category}
                image={dest.main_image}
                onStartTour={() => router.push(`/rehber/${dest.slug}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
            <p className="text-slate-500 font-bold italic text-sm">Bu kategoride henüz bir yer eklenmemiş.</p>
          </div>
        )}
      </div>
    </section>
  )
}
