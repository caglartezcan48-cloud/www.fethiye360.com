import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Header } from '@/components/fethiye/header'
import { Hero } from '@/components/fethiye/hero'
import { ToursSection } from '@/components/fethiye/tours-section'
import { CityStats } from '@/components/fethiye/city-stats'
import { Footer } from '@/components/fethiye/footer'

// Lazy load non-critical sections below the fold for 100 PageSpeed score
const AboutSection = dynamic(() => import('@/components/fethiye/about-section').then(mod => mod.AboutSection), {
  loading: () => <div className="h-96" />
})

const MapSection = dynamic(() => import('@/components/fethiye/map-section').then(mod => mod.MapSection), {
  loading: () => <div className="h-96" />
})

const SocialSection = dynamic(() => import('@/components/fethiye/social-section').then(mod => mod.SocialSection), {
  loading: () => <div className="h-96" />
})

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-[101]">
        <CityStats />
      </div>
      <Header />
      <Hero />
      <ToursSection />
      
      <Suspense fallback={<div className="h-96" />}>
        <SocialSection />
      </Suspense>

      <Suspense fallback={<div className="h-96" />}>
        <MapSection />
      </Suspense>

      <Suspense fallback={<div className="h-96" />}>
        <AboutSection />
      </Suspense>

      <Footer />
    </main>
  )
}
