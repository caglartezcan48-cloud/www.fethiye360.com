import { Header } from "@/components/fethiye/header"
import { Hero } from "@/components/fethiye/hero"
import { ToursSection } from "@/components/fethiye/tours-section"
import { MapSection } from "@/components/fethiye/map-section"
import { AboutSection } from "@/components/fethiye/about-section"
import { Footer } from "@/components/fethiye/footer"

export default function FethiyePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ToursSection />
      <MapSection />
      <AboutSection />
      <Footer />
    </main>
  )
}
