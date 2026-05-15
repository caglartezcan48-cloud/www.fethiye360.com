"use client"

import { useState, useCallback, useMemo } from "react"
import { TourCard } from "./tour-card"
import { useRouter } from "next/navigation"

interface Destination {
  id: string
  slug: string
  title: string
  category: string
  main_image: string
}

interface ToursCategoryFilterProps {
  destinations: Destination[]
}

const categories = ["Tümü", "Plaj", "Tarihi Yer", "Doğa", "Kültürel"]

export function ToursCategoryFilter({ destinations }: ToursCategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState("Tümü")
  const router = useRouter()

  const filteredTours = useMemo(() => {
    return activeCategory === "Tümü" 
      ? destinations 
      : destinations.filter(dest => dest.category === activeCategory)
  }, [activeCategory, destinations])

  const handleStartTour = useCallback((slug: string) => {
    router.push(`/rehber/${slug}`)
  }, [router])

  return (
    <>
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
              onStartTour={() => handleStartTour(dest.slug)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
          <p className="text-slate-500 font-bold italic text-sm">Bu kategoride henüz bir yer eklenmemiş.</p>
        </div>
      )}
    </>
  )
}
