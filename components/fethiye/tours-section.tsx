import { TourCard } from "./tour-card"
import { createClient } from "@/lib/supabase/server"
import { Compass } from "lucide-react"
import { ALL_ACTIVITIES } from "@/lib/planner-data"
import { ToursCategoryFilter } from "./tours-category-filter"

async function getDestinations() {
  const supabase = await createClient()
  const { data: dbData } = await supabase
    .from('destinations')
    .select('id, slug, title, main_image')
    .eq('is_active', true)

  // Planner verilerini ana kaynak olarak kullan, DB verileriyle zenginleştir
  const merged = ALL_ACTIVITIES.map(activity => {
    const dbMatch = dbData?.find(d => d.slug === activity.id || d.title.toLowerCase() === activity.title.toLowerCase())
    
    // Kategori eşleme (Planner'dan UI kategorilerine)
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

  return merged
}

export async function ToursSection() {
  const destinations = await getDestinations()

  return (
    <section id="rehber" className="py-16 bg-background relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#64ffda]/5 rounded-full blur-3xl -z-10" aria-hidden="true" />
      
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/5 border border-white/10 rounded-full">
            <Compass className="w-4 h-4 text-[#64ffda]" />
            <span className="text-[#64ffda] text-[10px] font-black uppercase tracking-widest">Gezi Rehberi</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase italic">
            Fethiye&apos;yi <span className="text-[#64ffda]">Karış Karış</span> Gez
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-medium">
            Tarihi mekanlardan turkuaz koylara kadar Fethiye&apos;nin görülmesi gereken tüm noktalarını 
            fotoğraflar, tarihçe ve ulaşım detaylarıyla keşfedin.
          </p>
        </div>

        {/* Interactive Filter + Grid */}
        <ToursCategoryFilter destinations={destinations} />
      </div>
    </section>
  )
}
