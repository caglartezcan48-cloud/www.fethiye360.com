'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Banner {
  id: string
  background_image: string
  link_url: string | null
  alt_text: string | null
  title?: string | null
  subtitle?: string | null
  scroll_speed?: number
  scroll_direction?: string
}

interface MarqueeClientProps {
  banners: Banner[]
  isHero?: boolean
}

export function MarqueeClient({ banners, isHero = false }: MarqueeClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  // Autoplay
  useEffect(() => {
    if (isPaused || banners.length <= 1) return

    const timer = setInterval(() => {
      nextSlide()
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [nextSlide, isPaused, banners.length])

  if (!banners || banners.length === 0) return null

  const renderSlideContent = (banner: Banner, isActive: boolean) => {
    const content = (
      <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] min-h-[450px] overflow-hidden flex items-center justify-center">
        {/* Background Image with Ken Burns animation */}
        <div className={`absolute inset-0 transition-transform duration-[10000ms] ease-out ${
          isActive ? 'scale-110' : 'scale-100'
        }`}>
          <Image
            src={banner.background_image}
            alt={banner.alt_text || banner.title || 'Fethiye360'}
            fill
            priority={isActive}
            sizes="100vw"
            quality={85}
            className="object-cover"
          />
        </div>

        {/* Dark Overlays for premium look */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/80 via-[#0a192f]/45 to-[#0a192f]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0a192f_95%)] opacity-85" />

        {/* Floating details / text overlay */}
        <div className="relative z-10 container mx-auto px-6 text-center select-none">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            {/* Sliding Badge */}
            {banner.alt_text && (
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-700 delay-300 transform ${
                isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <span className="text-[#64ffda] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">{banner.alt_text}</span>
              </div>
            )}

            {/* Sliding Title */}
            <h2 className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight transition-all duration-700 delay-500 transform ${
              isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}>
              {banner.title || "Fethiye'yi Keşfet"}
            </h2>

            {/* Sliding Subtitle */}
            {banner.subtitle && (
              <p className={`text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-700 transform ${
                isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}>
                {banner.subtitle}
              </p>
            )}

            {/* Button */}
            {banner.link_url && (
              <div className={`transition-all duration-700 delay-900 transform ${
                isActive ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
              }`}>
                <span className="inline-flex items-center justify-center bg-[#64ffda] text-[#0a192f] hover:bg-[#52e0c4] font-black uppercase tracking-widest text-xs px-8 h-12 rounded-xl shadow-lg shadow-[#64ffda]/10 transition-transform active:scale-95">
                  Detayları Gör
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    )

    if (banner.link_url) {
      return (
        <Link href={banner.link_url} className="block w-full h-full">
          {content}
        </Link>
      )
    }

    return <div className="w-full h-full">{content}</div>
  }

  return (
    <div 
      className="relative w-full overflow-hidden bg-[#0a192f] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] min-h-[450px]">
        {banners.map((banner, index) => {
          const isActive = index === currentIndex
          return (
            <div 
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {renderSlideContent(banner, isActive)}
            </div>
          )
        })}
      </div>

      {/* Navigation Buttons (Only if > 1 slide) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-[#64ffda] hover:text-[#0a192f] hover:border-[#64ffda] active:scale-95 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Önceki Reklam"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-[#64ffda] hover:text-[#0a192f] hover:border-[#64ffda] active:scale-95 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Sonraki Reklam"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Pagination Indicators (Only if > 1 slide) */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
          {banners.map((_, index) => {
            const isActive = index === currentIndex
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'w-8 bg-[#64ffda]' 
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Slayt ${index + 1}`}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
