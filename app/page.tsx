import { Header } from '@/components/fethiye/header'
import { MarqueeBanners } from '@/components/fethiye/marquee-banners'
import { ToursSection } from '@/components/fethiye/tours-section'
import { CityStats } from '@/components/fethiye/city-stats'
import { Footer } from '@/components/fethiye/footer'
import { AboutSection } from '@/components/fethiye/about-section'
import { MapSection } from '@/components/fethiye/map-section'
import { SocialSection } from '@/components/fethiye/social-section'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-[101]">
        <CityStats />
      </div>
      <Header />
      <MarqueeBanners />
      <ToursSection />
      <SocialSection />
      <MapSection />
      <AboutSection />
      <Footer />
    </main>
  )
}
