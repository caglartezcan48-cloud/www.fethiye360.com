import { Instagram, Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer id="iletisim" className="py-16 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/images/fethiye360-logo.png" 
                alt="Fethiye360 - Fethiye'ye Dair Her Şey" 
                width={200} 
                height={75} 
                sizes="200px"
                className="h-16 w-auto object-contain"
                loading="lazy"
              />
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              {"Fethiye'nin"} guzelliklerini kesfedin. Gezi, yeme icme, alisveris,
              etkinlikler, konaklama ve daha fazlasi bir tik uzaginizda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2">
              <li>
                <a href="#rehber" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Gezi Rehberi
                </a>
              </li>
              <li>
                <a href="#harita" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Harita
                </a>
              </li>
              <li>
                <a href="#hakkinda" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Hakkında
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">İletişim</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Fethiye, Muğla, Türkiye</span>
              </li>
              <li>
                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="email-obfuscated">info</span>
                </div>
              </li>
              <li>
                <a
                  href="tel:+905438231556"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>+90 543 823 15 56</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/fethiye360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Instagram className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>@fethiye360</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 Fethiye360. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Gizlilik Politikası
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Kullanım Şartları
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
