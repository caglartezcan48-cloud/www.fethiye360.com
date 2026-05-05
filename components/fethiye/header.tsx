"use client"

import { useState } from "react"
import { Menu, X, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CityStats } from "./city-stats"

const navLinks = [
  { href: "#turlar", label: "Turlar" },
  { href: "#harita", label: "Harita" },
  { href: "#hakkinda", label: "Hakkında" },
  { href: "#iletisim", label: "İletişim" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <CityStats />
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Fethiye<span className="text-primary">360</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Turu Başlat
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menüyü aç/kapat"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
              Turu Başlat
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
