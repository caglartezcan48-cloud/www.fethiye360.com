"use client"

import { Sparkles, MonitorSmartphone, ImageIcon } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Tamamen Ücretsiz",
    description: "Tüm sanal turlar ücretsiz olarak sunulmaktadır. Kayıt veya ödeme gerekmez.",
  },
  {
    icon: ImageIcon,
    title: "HD Kalite",
    description: "Yüksek çözünürlüklü 360° görüntülerle gerçekçi bir deneyim yaşayın.",
  },
  {
    icon: MonitorSmartphone,
    title: "Mobil Uyumlu",
    description: "Tüm cihazlardan erişim. Telefon, tablet veya bilgisayardan gezin.",
  },
]

export function AboutSection() {
  return (
    <section id="hakkinda" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Fethiye 360 <span className="text-primary">Nedir?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              {"Fethiye 360, Türkiye'nin en güzel tatil destinasyonlarından biri olan Fethiye'yi "}
              360 derece sanal turlarla keşfetmenizi sağlayan interaktif bir platformdur.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Plajlardan tarihi mekanlara, doğa harikalarından şehir merkezine kadar 
              {"Fethiye'nin"} tüm güzelliklerini evinizden veya mobil cihazınızdan deneyimleyin. 
              Tatil planı yaparken veya sadece merak ettiğiniz yerleri keşfetmek için ideal bir araç.
            </p>
            
            {/* Stats inline */}
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold text-primary">6+</div>
                <div className="text-sm text-muted-foreground">Tur Noktası</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Ziyaretçi</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">%100</div>
                <div className="text-sm text-muted-foreground">Ücretsiz</div>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-card border border-border rounded-xl transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
