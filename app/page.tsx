/**
 * Fethiye360 - Elite Destination Portal
 * Version: 1.1.3 - Performance Optimization Update
 */
import { Header } from "@/components/fethiye/header"
import { Hero } from "@/components/fethiye/hero"
import { SocialSection } from "@/components/fethiye/social-section"
import { CityStats } from "@/components/fethiye/city-stats"
import { Suspense } from "react"
import dynamic from 'next/dynamic'

// Lazy load below-the-fold components
const ToursSection = dynamic(() => import("@/components/fethiye/tours-section").then(mod => mod.ToursSection), {
  loading: () => <ToursSectionSkeleton />
})
const MapSection = dynamic(() => import("@/components/fethiye/map-section").then(mod => mod.MapSection), {
  loading: () => <SectionSkeleton />
})
const AboutSection = dynamic(() => import("@/components/fethiye/about-section").then(mod => mod.AboutSection), {
  loading: () => <SectionSkeleton />
})
const Footer = dynamic(() => import("@/components/fethiye/footer").then(mod => mod.Footer))

// Skeleton Components
function ToursSectionSkeleton() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="h-8 w-32 bg-white/5 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-12 w-96 bg-white/5 rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="h-4 w-64 bg-white/5 rounded mx-auto animate-pulse" />
        </div>
        <div className="flex justify-center gap-3 mb-16">
          {[1,2,3,4,5].map(i => <div key={i} className="h-10 w-24 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white/5 rounded-xl aspect-[4/3] animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionSkeleton() {
  return <div className="py-20 bg-background"><div className="container mx-auto px-4 h-64 bg-white/5 rounded-2xl animate-pulse" /></div>
}

export default function FethiyePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-[101]">
        <Suspense fallback={<div className="bg-[#112240]/50 backdrop-blur-sm border-b border-slate-700/30 py-2 h-10" />}>
          <CityStats />
        </Suspense>
      </div>
      <Header />
      <Hero />
      <Suspense fallback={<SectionSkeleton />}>
        <SocialSection />
      </Suspense>
      <ToursSection />
      <MapSection />
      <AboutSection />
      <Footer />
    </main>
  )
}
