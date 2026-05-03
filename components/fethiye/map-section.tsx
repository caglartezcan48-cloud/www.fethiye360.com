"use client"

import { useState } from "react"
import { MapPin, X } from "lucide-react"

const tourLocations = [
  { id: 1, name: "Ölüdeniz Plajı", x: 72, y: 65, category: "Plaj" },
  { id: 2, name: "Kayaköy", x: 45, y: 42, category: "Tarihi Yer" },
  { id: 3, name: "Saklıkent Kanyonu", x: 25, y: 30, category: "Doğa" },
  { id: 4, name: "Fethiye Merkez", x: 55, y: 55, category: "Şehir Merkezi" },
  { id: 5, name: "Kelebekler Vadisi", x: 68, y: 50, category: "Doğa" },
  { id: 6, name: "Kaya Mezarları", x: 52, y: 48, category: "Tarihi Yer" },
]

export function MapSection() {
  const [selectedLocation, setSelectedLocation] = useState<typeof tourLocations[0] | null>(null)

  return (
    <section id="harita" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Tur <span className="text-primary">Haritası</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Harita üzerindeki pinlere tıklayarak tur noktalarını keşfedin
          </p>
        </div>

        {/* Map Container */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative aspect-[16/10] bg-card rounded-2xl border border-border overflow-hidden">
            {/* Map Background - Stylized Fethiye map representation */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-card to-secondary/50">
              {/* Water representation */}
              <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/20 via-primary/10 to-transparent" />
              
              {/* Topographic lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,50 Q25,45 50,50 T100,45" stroke="currentColor" strokeWidth="0.3" fill="none" className="text-primary" />
                <path d="M0,60 Q30,55 60,60 T100,55" stroke="currentColor" strokeWidth="0.3" fill="none" className="text-primary" />
                <path d="M0,40 Q20,35 40,40 T80,35" stroke="currentColor" strokeWidth="0.3" fill="none" className="text-primary" />
                <path d="M0,70 Q35,65 70,70 T100,65" stroke="currentColor" strokeWidth="0.3" fill="none" className="text-primary" />
                <path d="M0,30 Q15,25 30,30 T60,25" stroke="currentColor" strokeWidth="0.3" fill="none" className="text-primary" />
              </svg>

              {/* Grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(100,255,218,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(100,255,218,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* Location Pins */}
            {tourLocations.map((location) => (
              <button
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${location.x}%`, top: `${location.y}%` }}
                onClick={() => setSelectedLocation(location)}
              >
                <div className="relative">
                  {/* Pulse animation */}
                  <div className="absolute inset-0 w-8 h-8 rounded-full bg-primary/30 animate-ping" />
                  
                  {/* Pin */}
                  <div className="relative w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 transition-transform group-hover:scale-125">
                    <MapPin className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>

                {/* Label */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-card border border-border rounded text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {location.name}
                </div>
              </button>
            ))}

            {/* Selected Location Popup */}
            {selectedLocation && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-primary/30 rounded-xl p-4 shadow-xl z-10 min-w-[200px]">
                <button
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedLocation(null)}
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="font-semibold text-foreground mb-1">{selectedLocation.name}</h3>
                <p className="text-sm text-primary mb-3">{selectedLocation.category}</p>
                <button
                  className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  onClick={() => {
                    alert(`${selectedLocation.name} sanal turu başlatılıyor...`)
                    setSelectedLocation(null)
                  }}
                >
                  Turu Başlat
                </button>
              </div>
            )}

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Kategoriler</p>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-xs text-foreground">Plaj</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-xs text-foreground">Tarihi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs text-foreground">Doğa</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-xs text-foreground">Şehir</span>
                </div>
              </div>
            </div>

            {/* Fethiye Label */}
            <div className="absolute top-4 right-4 text-right">
              <p className="text-xs text-muted-foreground">Bölge</p>
              <p className="text-lg font-bold text-primary">Fethiye</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
