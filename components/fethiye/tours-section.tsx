"use client"

import { useState } from "react"
import { TourCard } from "./tour-card"
import { Button } from "@/components/ui/button"

const categories = ["Tümü", "Plaj", "Tarihi Yer", "Doğa", "Şehir Merkezi"]

const tours = [
  {
    id: 1,
    title: "Ölüdeniz Plajı",
    location: "Ölüdeniz, Fethiye",
    category: "Plaj",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
  {
    id: 2,
    title: "Kayaköy Hayalet Şehir",
    location: "Kayaköy, Fethiye",
    category: "Tarihi Yer",
    image: "https://images.unsplash.com/photo-1599423423923-4c5deb70679e?w=800&q=80",
  },
  {
    id: 3,
    title: "Saklıkent Kanyonu",
    location: "Saklıkent, Fethiye",
    category: "Doğa",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  },
  {
    id: 4,
    title: "Fethiye Balık Pazarı",
    location: "Merkez, Fethiye",
    category: "Şehir Merkezi",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  },
  {
    id: 5,
    title: "Kelebekler Vadisi",
    location: "Faralya, Fethiye",
    category: "Doğa",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  {
    id: 6,
    title: "Likya Antik Kaya Mezarları",
    location: "Merkez, Fethiye",
    category: "Tarihi Yer",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
]

export function ToursSection() {
  const [activeCategory, setActiveCategory] = useState("Tümü")

  const filteredTours = activeCategory === "Tümü" 
    ? tours 
    : tours.filter(tour => tour.category === activeCategory)

  return (
    <section id="turlar" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Sanal <span className="text-primary">Turlar</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {"Fethiye'nin"} eşsiz güzelliklerini 360° sanal turlarla keşfedin. 
            Her köşeyi dilediğiniz gibi gezin.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <TourCard
              key={tour.id}
              title={tour.title}
              location={tour.location}
              category={tour.category}
              image={tour.image}
              onStartTour={() => alert(`${tour.title} sanal turu başlatılıyor...`)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
