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
  Navigation,
  MapPin,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'

// Hizmet Gruplari (Hubs) ve Bagli Kategoriler
const SERVICE_HUBS = [
  { 
    id: 'food', 
    title: 'ACIKTIN MI?', 
    subtitle: 'Restoran, Kafe & Lezzet', 
    icon: Utensils, 
    color: 'from-orange-500/40 to-red-600/40',
    borderColor: 'border-orange-500/50',
    hoverBg: 'hover:bg-orange-500/10',
    categories: ['Restoran', 'Kafe', 'Pastane', 'Fast Food', 'Kahvaltı']
  },
  { 
    id: 'stay', 
    title: 'KONAKLAMA', 
    subtitle: 'Otel, Villa & Pansiyon', 
    icon: Hotel, 
    color: 'from-blue-500/40 to-cyan-600/40',
    borderColor: 'border-blue-500/50',
    hoverBg: 'hover:bg-blue-500/10',
    categories: ['Otel', 'Villa', 'Pansiyon', 'Apart']
  },
  { 
    id: 'masters', 
    title: 'USTA BUL', 
    subtitle: 'Ev & Araba Tamiri', 
    icon: Hammer, 
    color: 'from-amber-400/40 to-orange-600/40',
    borderColor: 'border-amber-400/50',
    hoverBg: 'hover:bg-amber-400/10',
    subHubs: [
      { id: 'home_masters', title: 'EV USTALARI', icon: Home, categories: ['Elektrikçi', 'Tesisatçı', 'Boyacı', 'Mobilyacı', 'Anahtarcı'] },
      { id: 'car_masters', title: 'ARABA TAMİR', icon: Car, categories: ['Oto Tamir', 'Lastikçi', 'Oto Elektrik', 'Kaportacı'] }
    ]
  },
  { 
    id: 'emergency', 
    title: 'ACİL DURUM', 
    subtitle: 'Yol Yardım & Sağlık', 
    icon: PhoneCall, 
    color: 'from-red-600/40 to-rose-800/40',
    borderColor: 'border-red-600/50',
    hoverBg: 'hover:bg-red-600/10',
    categories: ['Yol Yardım', 'Çekici', 'Eczane', 'Hastane', 'Veteriner']
  },
  { 
    id: 'sea', 
    title: 'MAVİ DÜNYA', 
    subtitle: 'Tekne Turu & Marina', 
    icon: Waves, 
    color: 'from-cyan-400/40 to-blue-600/40',
    borderColor: 'border-cyan-400/50',
    hoverBg: 'hover:bg-cyan-400/10',
    categories: ['Tekne Turu', 'Marina', 'Yat Servis', 'Dalış Okulu']
  },
  { 
    id: 'activity', 
    title: 'AKTİVİTE & TUR', 
    subtitle: 'Macera & Deneyim', 
    icon: Compass, 
    color: 'from-emerald-400/40 to-teal-600/40',
    borderColor: 'border-emerald-400/50',
    hoverBg: 'hover:bg-emerald-400/10',
    categories: ['Tur Şirketi', 'Yamaç Paraşütü', 'Safari', 'At Binme']
  },
  { 
    id: 'gift', 
    title: 'HEDİYE & ÇİÇEK', 
    subtitle: 'Özel Gün & Anılar', 
    icon: Gift, 
    color: 'from-pink-500/40 to-fuchsia-600/40',
    borderColor: 'border-pink-500/50',
    hoverBg: 'hover:bg-pink-500/10',
    categories: ['Çiçekçi', 'Hediyelik Eşya', 'Kuyumcu', 'Butik']
  },
  { 
    id: 'night', 
    title: 'GECE HAYATI', 
    subtitle: 'Bar, Club & Canlı Müzik', 
    icon: Music, 
    color: 'from-violet-600/40 to-purple-800/40',
    borderColor: 'border-violet-600/50',
    hoverBg: 'hover:bg-violet-600/10',
    categories: ['Bar', 'Gece Kulübü', 'Beach Club', 'Canlı Müzik']
  },
  { 
    id: 'pro', 
    title: 'PROFESYONEL', 
    subtitle: 'Emlak, Avukat & Danışman', 
    icon: Briefcase, 
    color: 'from-slate-400/40 to-slate-600/40',
    borderColor: 'border-slate-400/50',
    hoverBg: 'hover:bg-slate-400/10',
    categories: ['Emlak', 'Avukat', 'Tercüman', 'Muhasebe']
  }
]

import { Suspense } from 'react'

function BusinessesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentHubId = searchParams.get('hub')
  const currentSubHubId = searchParams.get('sub')
  const searchQuery = searchParams.get('q') || ''

  const [businesses, setBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState(searchQuery)

  const supabase = createClient()

  useEffect(() => {
    fetchBusinesses()
  }, [currentHubId, currentSubHubId, searchQuery])

  const fetchBusinesses = async () => {
    setLoading(true)
    let query = supabase.from('businesses').select(`*, business_categories(name)`)

    // Hub filtresi
    if (currentHubId) {
      const hub = SERVICE_HUBS.find(h => h.id === currentHubId)
      if (hub) {
        let targetCategories = hub.categories || []
        
        if (currentSubHubId && hub.subHubs) {
          const sub = hub.subHubs.find(s => s.id === currentSubHubId)
          if (sub) targetCategories = sub.categories
        }

        if (targetCategories.length > 0) {
          // Kategorileri isimlerine gore (buyuk/kucuk harf duyarsiz) bul
          const orFilter = targetCategories.map(cat => `name.ilike.%${cat}%`).join(',')
          const { data: cats } = await supabase.from('business_categories').select('id').or(orFilter)
          
          if (cats && cats.length > 0) {
            query = query.in('category_id', cats.map(c => c.id))
          }
        }
      }
    }

    // Arama filtresi
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`)
    }

    const { data } = await query.order('is_featured', { ascending: false })
    setBusinesses(data || [])
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
          
          {/* Hero & Search */}
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
              HİZMET <span className="text-[#64ffda]">MERKEZİ</span>
            </h1>
            <p className="text-slate-400 font-medium italic">Fethiye'de ihtiyacınız olan her şey tek bir noktada.</p>
            
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
          {!currentHubId && !searchQuery && (
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
          {(currentHubId || searchQuery) && (
            <div className="space-y-12 animate-in fade-in duration-700">
              {/* Back & Breadcrumbs */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div className="flex items-center gap-4">
                  <button onClick={() => selectHub(null)} className="p-3 bg-white/5 rounded-2xl text-white hover:bg-white/10 border border-white/10">
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                      {searchQuery ? `"${searchQuery}" Sonuçları` : activeHub?.title}
                    </h2>
                    <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mt-1">
                      {businesses.length} İşletme Bulundu
                    </p>
                  </div>
                </div>

                {/* SubHubs for "Usta Bul" */}
                {activeHub?.subHubs && (
                  <div className="flex items-center gap-3">
                    {activeHub.subHubs.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => selectSubHub(sub.id)}
                        className={`px-6 py-3 rounded-full border transition-all text-[10px] font-black tracking-widest uppercase flex items-center gap-2 ${
                          currentSubHubId === sub.id 
                            ? 'bg-[#64ffda] border-[#64ffda] text-[#0a192f]' 
                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <sub.icon className="w-4 h-4" /> {sub.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Results Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-white/5 rounded-[32px] animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.map((business) => (
                    <Link 
                      key={business.id}
                      href={`/isletme/${business.slug}`}
                      className="group flex items-center gap-6 bg-white/5 p-6 rounded-[40px] border border-white/5 hover:border-[#64ffda]/40 hover:bg-white/10 transition-all relative overflow-hidden"
                    >
                      {business.is_featured && (
                        <div className="absolute top-0 right-0 px-4 py-1 bg-[#64ffda] text-[#0a192f] text-[8px] font-black uppercase tracking-widest rounded-bl-2xl">
                          Öne Çıkan
                        </div>
                      )}
                      
                      <div className="w-24 h-24 rounded-[28px] overflow-hidden shrink-0 border border-white/10 relative">
                        <img 
                          src={business.main_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"} 
                          alt={business.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-[#64ffda] uppercase tracking-widest px-2 py-0.5 bg-[#64ffda]/10 rounded-full border border-[#64ffda]/20">
                            {business.business_categories?.name}
                          </span>
                        </div>
                        <h4 className="text-xl font-black text-white truncate uppercase italic tracking-tighter group-hover:text-[#64ffda] transition-colors">
                          {business.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-medium">
                          <MapPin className="w-3 h-3 text-[#64ffda]/50" />
                          <span className="truncate">{business.address || 'Fethiye'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#64ffda]">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-[10px] font-bold">4.9 (24 Yorum)</span>
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
