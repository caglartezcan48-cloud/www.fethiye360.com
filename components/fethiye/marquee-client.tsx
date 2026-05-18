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
    }, 5000) // Slaytlar her 5 saniyede bir döner

    return () => clearInterval(timer)
  }, [nextSlide, isPaused, banners.length])

  if (!banners || banners.length === 0) return null

  const renderSlideContent = (banner: Banner, isActive: boolean) => {
    // Başlık girilmiş mi ve varsayılan "Banner" kelimesinden farklı mı kontrolü
    const hasText = banner.title && banner.title !== 'Banner' && banner.title.trim() !== ''

    const content = (
      <div className="relative w-full h-full overflow-hidden flex items-center justify-start bg-[#0a192f]">
        {/* Background Image - Razor sharp, perfectly proportioned */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={banner.background_image}
            alt={banner.alt_text || banner.title || 'Fethiye360 Ad'}
            fill
            priority={isActive}
            unoptimized={true}
            className="object-contain w-full h-full"
          />
        </div>

        {/* Soft elegant gradient strictly on the left to guarantee high text contrast without darkening the banner */}
        {hasText && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f]/85 via-[#0a192f]/35 to-transparent z-10 pointer-events-none" />
        )}

        {/* Premium Left-Aligned Text (No crude dashboard boxes - direct clean typography) */}
        {hasText && (
          <div className="relative z-20 w-full h-full flex items-center justify-start px-6 sm:px-12 md:px-16 lg:px-24 select-none pointer-events-none">
            <div className={`max-w-[75%] sm:max-w-md md:max-w-lg text-left transition-all duration-500 delay-200 transform ${
              isActive ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
            } space-y-1.5 sm:space-y-2 md:space-y-3`}>
              {/* Badge/Category (Direct text, no borders/boxes) */}
              {banner.alt_text && (
                <span className="block text-[#64ffda] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] drop-shadow-sm">
                  {banner.alt_text}
                </span>
              )}

              {/* Title (Sleek bold typography directly on image) */}
              <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-tight drop-shadow-md">
                {banner.title}
              </h2>

              {/* Subtitle (Direct clean text description) */}
              {banner.subtitle && (
                <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-slate-300 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md drop-shadow">
                  {banner.subtitle}
                </p>
              )}

              {/* Button */}
              {banner.link_url && (
                <div className="pt-1.5 sm:pt-2 pointer-events-auto">
                  <span className="inline-flex items-center justify-center bg-[#64ffda] text-[#0a192f] hover:bg-[#52e0c4] font-black uppercase tracking-widest text-[8px] sm:text-[9px] md:text-[10px] px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-lg shadow-[#64ffda]/10 transition-transform active:scale-95">
                    Detayları Gör
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
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
    <section className={`relative w-full overflow-hidden bg-[#0a192f] group ${
      isHero 
        ? 'mt-[80px] md:mt-[88px] border-b border-slate-800/40' 
        : 'py-1 border-y border-slate-800/40'
    }`}>
      {/* Slides Container - Responsive Aspect Ratio (Optimized for perfect mobile height & zero squeeze) */}
      <div className="relative w-full aspect-[1.8/1] sm:aspect-[2.2/1] md:aspect-[2.4/1] lg:aspect-[2.6/1] xl:aspect-[2.8/1]">
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

      {/* Navigation Buttons (Hidden on mobile/apps, only visible on md+ screen hover) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full hidden md:flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-[#64ffda] hover:text-[#0a192f] hover:border-[#64ffda] active:scale-95 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Önceki Reklam"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full hidden md:flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-[#64ffda] hover:text-[#0a192f] hover:border-[#64ffda] active:scale-95 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Sonraki Reklam"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Pagination Indicators (Only if > 1 slide) */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
          {banners.map((_, index) => {
            const isActive = index === currentIndex
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'w-5 bg-[#64ffda]' 
                    : 'w-1.5 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Slayt ${index + 1}`}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}
