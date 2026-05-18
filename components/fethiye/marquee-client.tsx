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
      <div className="relative w-full h-full overflow-hidden flex items-center justify-start bg-slate-950">
        {/* Background Image - Razor sharp, no zoom distortion */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={banner.background_image}
            alt={banner.alt_text || banner.title || 'Fethiye360 Ad'}
            fill
            priority={isActive}
            sizes="100vw"
            quality={100}
            className="object-cover"
          />
        </div>

        {/* Dynamic Dark Overlay - Only if custom text overlay is active */}
        {hasText && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />
        )}

        {/* Premium Left-Aligned Content Card (Plus Level) */}
        {hasText && (
          <div className="relative z-20 w-full h-full flex items-center justify-start px-6 sm:px-12 md:px-20 lg:px-28 select-none pointer-events-none">
            <div className={`max-w-[80%] sm:max-w-md md:max-w-lg bg-slate-950/75 backdrop-blur-md border border-white/10 p-3 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl text-left transition-all duration-500 delay-200 transform ${
              isActive ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
            }`}>
              {/* Badge */}
              {banner.alt_text && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:py-1 rounded bg-white/5 border border-white/10 mb-1.5 sm:mb-2">
                  <span className="text-[#64ffda] text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em]">{banner.alt_text}</span>
                </div>
              )}

              {/* Title */}
              <h2 className="text-sm sm:text-lg md:text-2xl font-black text-white leading-tight">
                {banner.title}
              </h2>

              {/* Subtitle */}
              {banner.subtitle && (
                <p className="text-[10px] sm:text-xs md:text-sm text-slate-300 mt-1 leading-relaxed line-clamp-2">
                  {banner.subtitle}
                </p>
              )}

              {/* Button */}
              {banner.link_url && (
                <div className="mt-2.5 sm:mt-3 pointer-events-auto">
                  <span className="inline-flex items-center justify-center bg-[#64ffda] text-[#0a192f] hover:bg-[#52e0c4] font-black uppercase tracking-widest text-[8px] sm:text-[9px] px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg shadow-md transition-transform active:scale-95">
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
    <section className={`relative w-full overflow-hidden bg-slate-950 group ${
      isHero 
        ? 'mt-[80px] md:mt-[88px] border-b border-slate-800/40' 
        : 'py-1 border-y border-slate-800/40'
    }`}>
      {/* Slides Container - Responsive Aspect Ratio (Aspect-Ratio is pixel-perfect for no blurs) */}
      <div className="relative w-full aspect-[2.6/1] sm:aspect-[3.4/1] md:aspect-[4.4/1] lg:aspect-[5.2/1] xl:aspect-[6/1]">
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
