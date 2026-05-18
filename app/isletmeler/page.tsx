'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { 
  Search, 
  Utensils, 
  Hammer, 
  Waves, 
  HeartPulse, 
  Gift, 
  Hotel, 
  Compass, 
  Music, 
  Briefcase, 
  Car, 
  Home, 
  ChevronRight, 
  PhoneCall, 
  Zap, 
  ShieldCheck,
  MapPin,
  Star,
  CheckCircle2,
  Image as ImageIcon,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'

// Hizmet Gruplari (Hubs) ve Bagli Kategoriler
const SERVICE_HUBS = [
  { 
    id: 'food', 
    title: 'ACIKTIN MI?', 
    subtitle: 'Yemek, Restoran, Kafe & Tüm Lezzetler', 
    icon: Utensils, 
    color: 'from-orange-500/40 to-red-600/40',
    borderColor: 'border-orange-500/50',
    hoverBg: 'hover:bg-orange-500/10',
    categories: ['Yemek', 'Restoran', 'Kafe', 'Pastane', 'Fast Food', 'Kahvaltı', 'Pide', 'Kebap', 'Pizza', 'Döner', 'Meyhane', 'Izgara']
  },
  { 
    id: 'stay', 
    title: 'KONAKLAMA', 
    subtitle: 'Otel, Motel, Pansiyon, Villa & Apart', 
    icon: Hotel, 
    color: 'from-blue-500/40 to-cyan-600/40',
    borderColor: 'border-blue-500/50',
    hoverBg: 'hover:bg-blue-500/10',
    categories: ['Otel', 'Motel', 'Pansiyon', 'Villa', 'Apart', 'Konaklama', 'Tatil Evleri']
  },
  { 
    id: 'masters', 
    title: 'USTA BUL', 
    subtitle: 'Ev & Araba İçin Tüm Ustalar', 
    icon: Hammer, 
    color: 'from-amber-400/40 to-orange-600/40',
    borderColor: 'border-amber-400/50',
    hoverBg: 'hover:bg-amber-400/10',
    subHubs: [
      { id: 'home_masters', title: 'EV USTALARI', icon: Home, color: 'bg-blue-500', categories: ['Elektrikçi', 'Tesisatçı', 'Boyacı', 'Mobilyacı', 'Anahtarcı', 'Klimacı', 'Panjur', 'Demirci', 'Marangoz'] },
      { id: 'car_masters', title: 'ARABA TAMİR', icon: Car, color: 'bg-orange-500', categories: ['Oto Tamir', 'Lastikçi', 'Oto Elektrik', 'Kaportacı', 'Rot Balans', 'Egzoz', 'Yıkama'] }
    ],
    categories: ['Usta', 'Tamir', 'Tesisat', 'Elektrik', 'Boya', 'Mobilya', 'Anahtar', 'Lastik', 'Kaporta', 'Servis']
  },
  { 
    id: 'emergency', 
    title: 'ACİL DURUM', 
    subtitle: 'Yol Yardım & Sağlık', 
    icon: PhoneCall, 
    color: 'from-red-600/40 to-rose-800/40',
    borderColor: 'border-red-600/50',
    hoverBg: 'hover:bg-red-600/10',
    categories: ['Yol Yardım', 'Çekici', 'Eczane', 'Hastane', 'Veteriner', 'Doktor', 'Klinik']
  },
  { 
    id: 'sea', 
    title: 'MAVİ DÜNYA', 
    subtitle: 'Tekne Turu, Marina & Yat Servis', 
    icon: Waves, 
    color: 'from-cyan-400/40 to-blue-600/40',
    borderColor: 'border-cyan-400/50',
    hoverBg: 'hover:bg-cyan-400/10',
    categories: ['Tekne', 'Marina', 'Yat', 'Dalış', 'Su Sporları', 'Kaptan', 'Balık Avı']
  },
  { 
    id: 'activity', 
    title: 'AKTİVİTE & TUR', 
    subtitle: 'Macera & Deneyim', 
    icon: Compass, 
    color: 'from-emerald-400/40 to-teal-600/40',
    borderColor: 'border-emerald-400/50',
    hoverBg: 'hover:bg-emerald-400/10',
    categories: ['Tur', 'Paraşüt', 'Safari', 'At Binme', 'Rafting', 'Kanyon', 'Gezi']
  },
  { 
    id: 'gift', 
    title: 'HEDİYE & ÇİÇEK', 
    subtitle: 'Çiçekçiler & Hediyelik Eşyalar', 
    icon: Gift, 
    color: 'from-pink-500/40 to-fuchsia-600/40',
    borderColor: 'border-pink-500/50',
    hoverBg: 'hover:bg-pink-500/10',
    categories: ['Çiçek', 'Hediye', 'Kuyumcu', 'Butik', 'Takı', 'Gümüş', 'Antika', 'Kuaför', 'Bayan Kuaför', 'Berber', 'Güzellik']
  },
  { 
    id: 'night', 
    title: 'GECE HAYATI', 
    subtitle: 'Tüm Barlar & Gece Mekanları', 
    icon: Music, 
    color: 'from-violet-600/40 to-purple-800/40',
    borderColor: 'border-violet-600/50',
    hoverBg: 'hover:bg-violet-600/10',
    categories: ['Bar', 'Club', 'Gece', 'Eğlence', 'Canlı Müzik', 'Pub', 'Beach Club', 'Disco']
  },
  { 
    id: 'pro', 
    title: 'PROFESYONEL', 
    subtitle: 'Emlak, Avukat & Danışman', 
    icon: Briefcase, 
    color: 'from-slate-400/40 to-slate-600/40',
    borderColor: 'border-slate-400/50',
    hoverBg: 'hover:bg-slate-400/10',
    categories: ['Emlak', 'Avukat', 'Tercüman', 'Muhasebe', 'Sigorta', 'Mühendis', 'Mimarlık']
  }
]

import { Suspense } from 'react'

function BusinessesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentHubId = searchParams.get('hub')
  const currentSubHubId = searchParams.get('sub')
  const searchQuery = searchParams.get('q') || ''
  const currentFilter = searchParams.get('filter')

  const [businesses, setBusinesses] = useState<any[]>([])
  const [hubCounts, setHubCounts] = useState<{ [key: string]: number }>({})
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState(searchQuery)

  // Dynamic Page Copy States
  const [pageTitle, setPageTitle] = useState("FETHİYE İŞLETMELERİ")
  const [pageSubtitle, setPageSubtitle] = useState("Fethiye'deki tüm işletmeleri keşfedin, en iyi hizmetlere anında ulaşın.")
  const [pageTitleColor, setPageTitleColor] = useState("#ffffff")
  const [pageSubtitleColor, setPageSubtitleColor] = useState("#94a3b8")

  const supabase = createClient()

  useEffect(() => {
    fetchBusinesses()
  }, [currentHubId, currentSubHubId, searchQuery, currentFilter])

  const fetchBusinesses = async () => {
    setLoading(true)
    // Tum isletmeleri ve kategorilerini cek
    let { data: allData, error } = await supabase
      .from('businesses')
      .select(`*, business_categories(name)`)
      .order('is_featured', { ascending: false })

    if (allData) {
      // Sayıları hesapla
      const counts: { [key: string]: number } = {}
      SERVICE_HUBS.forEach(hub => {
        const targetKeywords = (hub.categories || []).map(k => k.toLowerCase())
        const count = (allData || []).filter(biz => {
          const bizCat = biz.business_categories?.name?.toLowerCase() || ''
          const bizName = biz.name?.toLowerCase() || ''
          return targetKeywords.some(key => bizCat.includes(key) || bizName.includes(key))
        }).length
        counts[hub.id] = count
      })
      setHubCounts(counts)

      let filtered = allData
      
      // Paket Servis Filtresi (Yemek Siparişi Ver Butonu İçin)
      if (currentFilter === 'delivery') {
        filtered = allData.filter(biz => 
          biz.services && Array.isArray(biz.services) && biz.services.includes('Paket Servis')
        )
      }
      // Hub filtresi (Frontend tarafında daha esnek filtreleme)
      else if (currentHubId) {
        const hub = SERVICE_HUBS.find(h => h.id === currentHubId)
        if (hub) {
          let targetKeywords = (hub.categories || []).map(k => k.toLowerCase())
          
          if (currentSubHubId && hub.subHubs) {
            const sub = hub.subHubs.find(s => s.id === currentSubHubId)
            if (sub) targetKeywords = sub.categories.map(k => k.toLowerCase())
          }

          filtered = allData.filter(biz => {
            const bizCat = biz.business_categories?.name?.toLowerCase() || ''
            const bizName = biz.name?.toLowerCase() || ''
            // Kategori ismi veya isletme ismi anahtar kelimelerden birini iceriyor mu?
            return targetKeywords.some(key => bizCat.includes(key) || bizName.includes(key))
          })
        }
      }

      // Arama sorgusu filtresi (Türkçe karakter normalizasyonu ile)
      if (searchQuery) {
        const normalize = (text: string) => 
          text?.toLowerCase()
            .replace(/i/g, 'i').replace(/ı/g, 'i')
            .replace(/ğ/g, 'g').replace(/ü/g, 'u')
            .replace(/ş/g, 's').replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .trim() || ''

        const q = normalize(searchQuery)
        filtered = filtered.filter(biz => 
          normalize(biz.name).includes(q) || 
          normalize(biz.business_categories?.name).includes(q)
        )
      }

      setBusinesses(filtered)

      // Fetch dynamic page titles & colors
      try {
        const { data: textData } = await supabase
          .from('hero_banners')
          .select('title, background_image, link_url, scroll_direction')
          .eq('alt_text', 'TEXT_BUSINESSES')
          .maybeSingle()
        
        if (textData) {
          if (textData.title) setPageTitle(textData.title)
          if (textData.background_image) setPageSubtitle(textData.background_image)
          if (textData.link_url) setPageTitleColor(textData.link_url)
          if (textData.scroll_direction) setPageSubtitleColor(textData.scroll_direction)
        }
      } catch (err) {
        console.error('İşletmeler başlığı yüklenemedi:', err)
      }
    }
    setLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchInput) params.set('q', searchInput)
    else params.delete('q')
    router.push(`/isletmeler?${params.toString()}`)
  }

  const selectHub = (id: string | null) => {
    const params = new URLSearchParams()
    if (id) params.set('hub', id)
    router.push(`/isletmeler${id ? `?${params.toString()}` : ''}`)
  }

  const selectSubHub = (subId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sub', subId)
    router.push(`/isletmeler?${params.toString()}`)
  }

  const activeHub = SERVICE_HUBS.find(h => h.id === currentHubId)

  return (
    <main className="min-h-screen bg-[#0a192f] selection:bg-[#64ffda] selection:text-[#0a192f]">
      <Header />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#64ffda]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <section className="relative pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Page Dynamic Header (Only on landing view) */}
          {!currentHubId && !searchQuery && !currentFilter && (
            <div className="text-center max-w-3xl mx-auto mb-8 animate-in fade-in duration-700">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-tight" style={{ color: pageTitleColor }}>
                {pageTitle}
              </h1>
              <p className="mt-4 text-lg max-w-2xl mx-auto font-medium" style={{ color: pageSubtitleColor }}>
                {pageSubtitle}
              </p>
            </div>
          )}

          {/* Hero & Search */}
          <div className="text-center max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={activeHub ? `${activeHub.title} içinde ara...` : "Fethiye'de ne arıyorsun? (Tesisatçı, Restoran, Çekici...)"}
                className="w-full bg-white/5 border border-white/10 rounded-[32px] px-8 py-6 text-white outline-none focus:ring-2 focus:ring-[#64ffda]/50 transition-all backdrop-blur-xl group-hover:bg-white/10"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-[#64ffda] text-[#0a192f] rounded-2xl shadow-lg shadow-[#64ffda]/20 hover:scale-105 transition-all">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Service Hub Grid */}
          {!currentHubId && !searchQuery && !currentFilter && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {SERVICE_HUBS.map((hub) => (
                <button
                  key={hub.id}
                  onClick={() => selectHub(hub.id)}
                  className={`group relative p-8 rounded-[48px] border-2 bg-gradient-to-br ${hub.color} ${hub.borderColor} ${hub.hoverBg} transition-all text-left overflow-hidden shadow-2xl backdrop-blur-md`}
                >
                  <div className="relative z-10 space-y-4">
                    <div className="w-16 h-16 bg-white/20 rounded-[24px] flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-inner">
                      <hub.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter drop-shadow-md">{hub.title}</h3>
                      <p className="text-white/70 text-sm font-medium">{hub.subtitle}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px] font-black text-[#64ffda] bg-[#64ffda]/10 px-3 py-1 rounded-full border border-[#64ffda]/20 tracking-widest uppercase italic">
                          {hubCounts[hub.id] || 0} KAYITLI İŞLETME
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <hub.icon className="w-32 h-32 -mr-8 -mt-8 rotate-12" />
                  </div>
                  <ChevronRight className="absolute right-8 bottom-8 w-6 h-6 text-white/40 group-hover:text-white group-hover:translate-x-2 transition-all" />
                </button>
              ))}
            </div>
          )}

          {/* Active Hub / Results View */}
          {(currentHubId || searchQuery || currentFilter === 'delivery') && (
            <div className="space-y-12 animate-in fade-in duration-700">
              {/* Back & Breadcrumbs */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      if (currentFilter) {
                        router.push('/isletmeler')
                      } else {
                        selectHub(null)
                      }
                    }} 
                    className="p-3 bg-white/5 rounded-2xl text-white hover:bg-white/10 border border-white/10"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                      {searchQuery 
                        ? `"${searchQuery}" Sonuçları` 
                        : currentFilter === 'delivery' 
                          ? 'Paket Servis Yapan İşletmeler' 
                          : activeHub?.title}
                    </h2>
                    <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mt-1">
                      {businesses.length} İşletme Bulundu
                    </p>
                  </div>
                </div>

                {/* Usta Bul - Renkli Dashboard */}
                {activeHub?.id === 'masters' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mx-auto py-4">
                    {activeHub.subHubs?.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => selectSubHub(sub.id)}
                        className={`group relative p-4 px-6 rounded-[24px] border-2 transition-all flex flex-row items-center justify-start gap-4 shadow-xl ${
                          currentSubHubId === sub.id 
                            ? 'bg-[#64ffda] border-[#64ffda] text-[#0a192f] scale-102' 
                            : `bg-white/5 border-white/10 text-white hover:border-white/30 ${sub.id === 'home_masters' ? 'hover:bg-blue-500/20' : 'hover:bg-orange-500/20'}`
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${currentSubHubId === sub.id ? 'bg-white/20' : sub.color + ' shadow-lg'}`}>
                          <sub.icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black uppercase italic tracking-tighter">{sub.title}</span>
                        
                        {currentSubHubId === sub.id && (
                          <div className="absolute top-1/2 -translate-y-1/2 -right-2 bg-white text-[#0a192f] p-1 rounded-full shadow-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    ))}
                    
                    {currentSubHubId && (
                      <button 
                        onClick={() => selectSubHub('')}
                        className="sm:col-span-2 text-center text-[#64ffda] text-[10px] font-black uppercase tracking-widest hover:underline pt-2"
                      >
                        TÜM USTALARI GÖSTER
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Results Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-white/5 rounded-[32px] animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {businesses.map((business) => (
                    <Link 
                      key={business.id}
                      href={`/isletme/${business.slug}`}
                      className="group relative bg-white/5 rounded-[48px] overflow-hidden border border-white/10 hover:border-[#64ffda]/50 transition-all shadow-2xl flex flex-col"
                    >
                      {/* Cover Image - Sadece resim varsa goster */}
                      {business.main_image && (
                        <div className="relative h-64 w-full overflow-hidden">
                          <Image 
                            src={business.main_image} 
                            alt={business.name || 'İşletme'} 
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-90" 
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent" />
                          
                          {/* Logo Overlay - Sadece logo varsa goster */}
                          {business.logo && (
                            <div className="absolute -bottom-6 left-8 w-20 h-20 bg-[#0a192f] rounded-[24px] p-1 border-2 border-white/10 shadow-2xl group-hover:scale-110 transition-transform overflow-hidden">
                              <div className="relative w-full h-full rounded-[20px] overflow-hidden bg-white/5 flex items-center justify-center">
                                <Image src={business.logo} alt="Logo" fill className="object-cover" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Business Info */}
                      <div className="p-10 pt-12 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-[#64ffda] uppercase tracking-[0.2em] px-3 py-1 bg-[#64ffda]/10 rounded-full border border-[#64ffda]/20">
                            {business.business_categories?.name}
                          </span>
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-[10px] font-black">4.9</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-[#64ffda] transition-colors leading-tight">
                            {business.name}
                          </h4>
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mt-1 italic">
                            <MapPin className="w-3 h-3 text-[#64ffda]" />
                            {business.address || 'Fethiye'}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-black text-white/50 uppercase tracking-widest">
                            <Clock className="w-3 h-3 text-[#64ffda]" /> ŞU AN AÇIK
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#64ffda] group-hover:text-[#0a192f] transition-all">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {businesses.length === 0 && !loading && (
                <div className="text-center py-24 bg-white/5 rounded-[60px] border border-dashed border-white/10">
                  <Zap className="w-12 h-12 text-[#64ffda]/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2 uppercase italic">Sonuç Bulunamadı</h3>
                  <p className="text-slate-500">Aramanı değiştirebilir veya diğer hizmetlere bakabilirsin.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function BusinessesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a192f] flex items-center justify-center text-white font-black uppercase italic tracking-widest animate-pulse">Yükleniyor...</div>}>
      <BusinessesContent />
    </Suspense>
  )
}
