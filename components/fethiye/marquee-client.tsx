'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Banner {
  id: string
  background_image: string
  link_url: string | null
  alt_text: string | null
  scroll_speed: number
  scroll_direction: string
}

interface MarqueeClientProps {
  banners: Banner[]
  isHero?: boolean
}

export function MarqueeClient({ banners, isHero = false }: MarqueeClientProps) {
  const [isPaused, setIsPaused] = useState(false)

  if (!banners || banners.length === 0) return null

  // Ortalama hizi hesapla (ilk banner'in hizini kullan veya varsayilan 30sn)
  const avgSpeed = banners[0]?.scroll_speed || 30
  
  // Akis yonunu belirle (ilk banner'dan al veya varsayilan left)
  const direction = banners[0]?.scroll_direction || 'left'

  // Banner'lari ciftleyerek sonsuz kaydirma efekti
  const duplicatedBanners = [...banners, ...banners]

  return (
    <section className={`relative bg-[#0a192f]/40 overflow-hidden ${
      isHero 
        ? 'pt-28 pb-12 md:pt-36 md:pb-16' 
        : 'py-8 md:py-12 border-y border-slate-800/40'
    }`}>
      {/* Gradient Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-[#0a192f] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-[#0a192f] to-transparent pointer-events-none" />

      
      {/* Marquee Container */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className={`flex gap-4 ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
          style={{ 
            animationDuration: `${avgSpeed}s`,
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {duplicatedBanners.map((banner, index) => (
            <BannerItem 
              key={`${banner.id}-${index}`} 
              banner={banner} 
            />
          ))}
        </div>
      </div>

      {/* Info Text */}
      <div className="text-center mt-4">
        <p className="text-xs text-slate-500">
          Reklam alanı - Duraklatmak icin ustune gelin
        </p>
      </div>
    </section>
  )
}

function BannerItem({ banner }: { banner: Banner }) {
  const imageContent = (
    <div className="relative h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px] w-[350px] sm:w-[500px] md:w-[700px] lg:w-[900px] flex-shrink-0 rounded-xl overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
      <Image
        src={banner.background_image}
        alt={banner.alt_text || 'Reklam'}
        fill
        sizes="(max-width: 640px) 350px, (max-width: 768px) 500px, (max-width: 1024px) 700px, 900px"
        className="object-cover"
        priority
      />
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
      
      {/* Link Indicator */}
      {banner.link_url && (
        <div className="absolute bottom-3 right-3 bg-white/90 text-[#0a192f] px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Detaylar
        </div>
      )}
    </div>
  )

  if (banner.link_url) {
    return (
      <Link 
        href={banner.link_url} 
        target={banner.link_url.startsWith('http') ? '_blank' : '_self'}
        rel={banner.link_url.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {imageContent}
      </Link>
    )
  }

  return imageContent
}
