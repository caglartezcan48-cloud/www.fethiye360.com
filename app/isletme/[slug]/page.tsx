import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import Image from 'next/image'
import Link from 'next/link'
import { MenuSection } from '@/components/isletme/menu-section'
import { 
  MapPin, 
  Phone, 
  Globe, 
  Instagram, 
  Star, 
  MessageCircle, 
  Navigation, 
  Share2, 
  Heart,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  Info,
  Sparkles,
  ArrowLeft
} from 'lucide-react'

async function getBusiness(slug: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data } = await supabase
    .from('businesses')
    .select('*, business_categories(name)')
    .eq('slug', slug)
    .single()

  return data
}

export default async function BusinessDetailPage({ params }: { params: { slug: string } }) {
  const business = await getBusiness(params.slug)

  if (!business) {
    notFound()
  }

  // Satis Odakli Sayfa Kontrolu (Restoran, Kafe vb.)
  const salesOrientedCategories = ['Yemek', 'Restoran', 'Kafe', 'Fast Food', 'Kahvaltı', 'Pide', 'Kebap', 'Pizza', 'Döner', 'Meyhane', 'Izgara', 'Pastane']
  const isSalesOriented = salesOrientedCategories.some(cat => 
    business.business_categories?.name?.includes(cat) || 
    salesOrientedCategories.includes(business.business_categories?.name)
  )

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // Urunleri ve Yorumlari cek
  const [productsRes, reviewsRes] = await Promise.all([
    supabase.from('business_products').select('*').eq('business_id', business.id),
    supabase.from('business_reviews').select('*').eq('business_id', business.id).eq('is_approved', true).order('created_at', { ascending: false })
  ])

  const products = productsRes.data || []
  const reviews = reviewsRes.data || []
  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '5.0'

  return (
    <main className="min-h-screen bg-[#0a192f] selection:bg-[#64ffda] selection:text-[#0a192f]">
      <Header />

      {/* Hero Section - Sales Focused */}
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <img 
          src={business.main_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=90"} 
          alt={business.name || 'İşletme'} 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="px-6 py-2 bg-[#64ffda] text-[#0a192f] rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#64ffda]/20">
                {business.business_categories?.name}
              </span>
              {business.is_featured && (
                <span className="px-6 py-2 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-[#64ffda]" /> Popüler Mekan
                </span>
              )}
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              {business.name}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/90">
              <div className="flex items-center gap-3 bg-[#0a192f]/40 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/5">
                <div className="flex text-amber-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm font-black tracking-widest">{avgRating} <span className="text-[10px] opacity-60">({reviews.length} YORUM)</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest bg-[#0a192f]/40 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/5">
                <MapPin className="w-4 h-4 text-[#64ffda]" />
                {business.address?.split(',')[0] || 'FETHİYE Merkez'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Back & Share */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
             <Link href="/isletmeler" className="p-4 bg-[#0a192f]/60 backdrop-blur-xl rounded-2xl text-white/70 hover:text-[#64ffda] border border-white/5 transition-all hover:scale-110">
                <ArrowLeft className="w-5 h-5" />
             </Link>
             <div className="flex gap-3">
                <button className="p-4 bg-[#0a192f]/60 backdrop-blur-xl rounded-2xl text-white/70 hover:text-[#64ffda] border border-white/5 transition-all hover:scale-110">
                    <Share2 className="w-5 h-5" />
                </button>
                <button className="p-4 bg-[#0a192f]/60 backdrop-blur-xl rounded-2xl text-white/70 hover:text-[#64ffda] border border-white/5 transition-all hover:scale-110">
                    <Heart className="w-5 h-5" />
                </button>
             </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Menu & Content */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Sales Focus: Marketing Header */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <h3 className="text-[10px] font-black text-[#64ffda] uppercase tracking-[0.4em] whitespace-nowrap">MEKAN HAKKINDA</h3>
                    <div className="h-px w-full bg-white/5" />
                </div>
                <p className="text-xl md:text-2xl text-white font-medium leading-relaxed italic opacity-95 first-letter:text-5xl first-letter:font-black first-letter:text-[#64ffda] first-letter:mr-3 first-letter:float-left">
                    {business.description || "Fethiye'nin kalbinde, eşsiz lezzetler ve unutulmaz anılar için kapılarımızı açıyoruz. Modern dokunuşlar ve geleneksel misafirperverliğimizle sizleri bekliyoruz."}
                </p>
            </div>

            {/* Menu Section (Conditional) */}
            {isSalesOriented && (
                <MenuSection 
                  products={products} 
                  businessName={business.name} 
                  whatsappNumber={business.whatsapp || business.phone} 
                />
            )}

            {/* Photo Gallery Wall */}
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <h3 className="text-[10px] font-black text-[#64ffda] uppercase tracking-[0.4em] whitespace-nowrap">MEKANDAN KARELER</h3>
                <div className="h-px w-full bg-white/5" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="relative aspect-square rounded-[32px] overflow-hidden group border border-white/5">
                    <img 
                      src={`https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&i=${i}`} 
                      alt="Galeri" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Review Section */}
            <div className="space-y-12">
                <div className="flex items-center gap-4">
                    <h3 className="text-[10px] font-black text-[#64ffda] uppercase tracking-[0.4em] whitespace-nowrap">MİSAFİR DENEYİMLERİ</h3>
                    <div className="h-px w-full bg-white/5" />
                </div>
                <div className="grid grid-cols-1 gap-6">
                    {reviews.map((r) => (
                        <div key={r.id} className="bg-white/5 p-10 rounded-[48px] border border-white/5 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda] font-black uppercase">
                                        {r.user_name?.[0] || 'G'}
                                    </div>
                                    <div>
                                        <h5 className="text-white font-black uppercase tracking-widest text-xs">{r.user_name}</h5>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{new Date(r.created_at).toLocaleDateString('tr-TR')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20 text-yellow-500 font-black text-xs">
                                    <Star className="w-3.5 h-3.5 fill-yellow-500" /> {r.rating}.0
                                </div>
                            </div>
                            <p className="text-slate-400 text-lg leading-relaxed italic">"{r.comment}"</p>
                            {r.reply && (
                                <div className="ml-8 p-6 bg-white/5 rounded-[32px] border-l-2 border-[#64ffda]/30">
                                    <span className="text-[#64ffda] text-[8px] font-black uppercase tracking-[0.3em] block mb-2">İŞLETME YANITI</span>
                                    <p className="text-slate-500 text-sm italic">{r.reply}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {reviews.length === 0 && (
                        <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10 text-slate-600 font-bold uppercase text-[10px] tracking-widest">
                            Henüz yorum yapılmamış. İlk yorumu sen yap!
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* Right Column: Contact & Sales Stats */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white/5 border border-white/10 rounded-[48px] p-10 space-y-10 sticky top-32 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#64ffda]/5 rounded-full blur-3xl" />
              
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter relative z-10">İletişim & Konum</h3>
              
              <div className="space-y-8 relative z-10">
                <div className="flex items-start gap-5">
                  <div className="p-4 bg-[#64ffda]/10 rounded-2xl border border-[#64ffda]/20">
                    <MapPin className="w-5 h-5 text-[#64ffda]" />
                  </div>
                  <div>
                    <p className="text-white font-black text-[10px] uppercase tracking-widest">Adres</p>
                    <p className="text-slate-400 text-sm mt-1 leading-relaxed font-medium">{business.address || 'Fethiye Merkez'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="p-4 bg-[#64ffda]/10 rounded-2xl border border-[#64ffda]/20">
                    <Phone className="w-5 h-5 text-[#64ffda]" />
                  </div>
                  <div>
                    <p className="text-white font-black text-[10px] uppercase tracking-widest">Telefon</p>
                    <p className="text-slate-400 text-sm mt-1 font-medium">{business.phone || '0(252) --- -- --'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="p-4 bg-[#64ffda]/10 rounded-2xl border border-[#64ffda]/20">
                    <Clock className="w-5 h-5 text-[#64ffda]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white font-black text-[10px] uppercase tracking-widest">Çalışma Saatleri</p>
                        <span className="text-[#64ffda] text-[8px] font-black uppercase bg-[#64ffda]/10 px-2 py-0.5 rounded-full">AÇIK</span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-slate-400 text-xs font-medium italic">
                            <span>Hafta İçi</span>
                            <span>09:00 - 22:00</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-xs font-medium italic">
                            <span>Hafta Sonu</span>
                            <span>10:00 - 23:00</span>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-white/5 space-y-4 relative z-10">
                <a 
                    href={`https://wa.me/${(business.whatsapp || business.phone)?.replace(/\s+/g, '')}`} 
                    target="_blank"
                    className="w-full py-5 bg-[#64ffda] text-[#0a192f] rounded-3xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#64ffda]/20"
                >
                    <MessageCircle className="w-5 h-5" /> WHATSAPP SİPARİŞ
                </a>
                <button className="w-full py-5 bg-white/5 text-white border border-white/10 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    <Navigation className="w-4 h-4 text-blue-400" /> YOL TARİFİ AL
                </button>
              </div>

              <div className="bg-gradient-to-br from-[#64ffda]/5 to-blue-500/5 p-6 rounded-[32px] border border-white/5 mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Popülerlik</span>
                      <span className="text-[#64ffda] text-[10px] font-black uppercase">Çok Yüksek 🔥</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-gradient-to-r from-[#64ffda] to-blue-500" />
                  </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Floating Order Bar - Mobile Only */}
      <div className="fixed bottom-6 left-6 right-6 z-[100] md:hidden">
          <a 
            href={`tel:${business.phone}`}
            className="w-full h-16 bg-[#64ffda] text-[#0a192f] rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-[#64ffda]/40 font-black uppercase tracking-widest text-xs"
          >
            <Phone className="w-5 h-5" /> HEMEN ARA / SİPARİŞ VER
          </a>
      </div>

      <Footer />
    </main>
  )
}
