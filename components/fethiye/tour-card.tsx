"use client"

import { MapPin, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface TourCardProps {
  title: string
  location: string
  category: string
  image: string
  priority?: boolean
  onStartTour?: () => void
}

export function TourCard({ title, location, category, image, priority, onStartTour }: TourCardProps) {
  const categoryColors: Record<string, string> = {
    "Plaj": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Tarihi Yer": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "Doğa": "bg-green-500/20 text-green-400 border-green-500/30",
    "Şehir Merkezi": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  }

  return (
    <div 
      className="group relative bg-card rounded-xl overflow-hidden border border-border transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Image Container */}
      <div 
        className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-slate-800"
        onClick={onStartTour}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          quality={50}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* 360 Badge */}
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center">
          <span className="text-xs font-bold text-primary-foreground">360°</span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="outline" className={`${categoryColors[category] || "bg-muted"}`}>
            {category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 
          className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors cursor-pointer"
          onClick={onStartTour}
        >
          {title}
        </h3>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        <Button 
          className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 transition-all duration-300 group/btn"
          onClick={onStartTour}
        >
          <Play className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" />
          Sayfayı Keşfet
        </Button>
      </div>
    </div>
  )
}
