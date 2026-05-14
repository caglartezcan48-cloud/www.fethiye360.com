import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { MenuButtonTrigger } from '@/components/isletme/menu-button-trigger'
import Image from 'next/image'
import Link from 'next/link'
import { MenuSection } from '@/components/isletme/menu-section'
import { OrderLayout } from '@/components/isletme/order-layout'
import { BusinessActionButtons } from '@/components/isletme/business-action-buttons'
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
  ChevronLeft,
  ArrowLeft,
  ShoppingBag,
  List
} from 'lucide-react'

async function getBusiness(slug: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
      auth: {
        storageKey: 'fethiye360-auth-token',
        persistSession: true
      }
    }
  )

  const { data } = await supabase
    .from('businesses')
    .select('*, business_categories(name)')
    .eq('slug', slug)
    .single()

  return data
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const business = await getBusiness(slug)
  if (!business) return notFound()

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
      auth: {
        storageKey: 'fethiye360-auth-token',
        persistSession: true
      }
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

  // Satis Odakli Sayfa Kontrolu (Paket Servis bilgisine gore - case insensitive)
  const isSalesOriented = business.services?.some((s: string) => s.toLowerCase().includes('paket')) || false;

  return (
    <main className="min-h-screen bg-[#0a192f] selection:bg-[#64ffda] selection:text-[#0a192f]">
      <Header />

      {/* Hero Section */}
      {isSalesOriented ? (
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-8 mt-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-6">
            <span>Fethiye</span>
            <span className="text-slate-600">&gt;</span>
            <span>Restoran Liste</span>
            <span className="text-slate-600">&gt;</span>
            <span className="text-white">{business.name}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo / Square Image */}
            <a 
              href={business.main_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=90"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 cursor-pointer"
            >
              <img 
                src={business.main_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=90"} 
                alt={business.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </a>

            {/* Restoran Bilgileri */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <span>{business.business_categories?.name || 'Restoran'}</span>
                <span>•</span>
                <span className="text-[#64ffda]">Restoran Teslimatlı</span>
              </div>
              
              <div className="flex justify-between items-start">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  {business.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <a href="#yorumlar" className="flex items-center gap-1.5 cursor-pointer hover:bg-white/5 px-2 py-1 -ml-2 rounded-lg transition-colors">
                  <Star className="w-4 h-4 text-[#e0004d] fill-[#e0004d]" />
                  <span className="text-[#e0004d] font-bold">{avgRating}/5</span>
                  <span className="text-slate-400 text-xs">({reviews.length}+)</span>
                  <span className="text-white font-medium ml-1 underline decoration-white/30 underline-offset-4">Yorumları Gör</span>
                </a>
                
                <a href="#hakkinda" className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer hover:bg-white/5 px-2 py-1 rounded-lg transition-colors">
                  <Info className="w-4 h-4" />
                  <span className="underline decoration-white/30 underline-offset-4">Hakkında</span>
                </a>
              </div>
              
              {/* Yemeksepeti tarzı rozetler */}
              <div className="flex flex-wrap gap-3 pt-4">
                <MenuButtonTrigger 
                  products={products}
                  businessName={business.name}
                  whatsappNumber={business.whatsapp || business.phone}
                  className="flex items-center gap-2 bg-[#64ffda] text-[#0a192f] px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#64ffda]/20"
                  label="MENÜYÜ GÖR"
                />
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-white">
                  <Clock className="w-3.5 h-3.5 text-[#64ffda]" />
                  {business.services?.find((s: string) => s.startsWith('DELIVERY_TIME:'))?.split(':')[1] || '25-35 dk'}
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-white">
                  <Package className="w-3.5 h-3.5 text-[#64ffda]" />
                  {business.services?.find((s: string) => s.startsWith('MIN_ORDER:'))?.split(':')[1] || 'Min. 200 TL'}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
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
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-white/90">
                <MenuButtonTrigger 
                  products={products}
                  businessName={business.name}
                  whatsappNumber={business.whatsapp || business.phone}
                  className="flex items-center gap-3 bg-[#64ffda] text-[#0a192f] px-10 py-4 rounded-[32px] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl shadow-[#64ffda]/20"
                  label="MENÜ & KATALOG"
                />
                <div className="flex items-center gap-2 bg-[#0a192f]/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold">{avgRating} <span className="opacity-60 text-xs font-normal">({reviews.length}+)</span></span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Back & Actions */}
      {!isSalesOriented && (
        <div className="absolute top-24 left-8 right-8 flex justify-between items-center z-20">
             <Link href="/isletmeler" className="p-4 bg-[#0a192f]/60 backdrop-blur-xl rounded-2xl text-white/70 hover:text-[#64ffda] border border-white/5 transition-all hover:scale-110">
                <ArrowLeft className="w-5 h-5" />
             </Link>
             <div className="flex gap-3">
                <BusinessActionButtons title={business.name} />
             </div>
        </div>
      )}

      {/* Main Content Area */}
      <section className={`max-w-7xl mx-auto px-6 py-8 ${isSalesOriented ? 'border-t border-white/5' : 'md:py-24'}`}>
        {isSalesOriented ? (
          /* SALES ORIENTED LAYOUT (Order Panel) */
          <div className="space-y-16">
            <OrderLayout 
              products={products} 
              businessName={business.name} 
              whatsappNumber={business.whatsapp || business.phone}
            />
            
            {/* Sales Oriented için Hakkında ve Yorumlar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-8 border-t border-white/5">
              <div className="lg:col-span-8 space-y-16">
                <div id="hakkinda" className="space-y-6 scroll-mt-32">
                    <div className="flex items-center gap-4">
                        <h3 className="text-[10px] font-black text-[#64ffda] uppercase tracking-[0.4em] whitespace-nowrap">MEKAN HAKKINDA</h3>
                        <div className="h-px w-full bg-white/5" />
                    </div>
                    <p className="text-lg md:text-xl text-white font-medium leading-relaxed italic opacity-95">
                        {business.description || "Fethiye'nin kalbinde, eşsiz lezzetler ve unutulmaz anılar için kapılarımızı açıyoruz."}
                    </p>
                </div>

                <div id="yorumlar" className="space-y-8 scroll-mt-32">
                    <div className="flex items-center gap-4">
                        <h3 className="text-[10px] font-black text-[#64ffda] uppercase tracking-[0.4em] whitespace-nowrap">YORUMLAR</h3>
                        <div className="h-px w-full bg-white/5" />
                    </div>
                    {reviews.length > 0 ? (
                      <div className="grid gap-4">
                        {reviews.map((review: any) => (
                          <div key={review.id} className="bg-white/5 p-6 rounded-2xl border border-white/10">
                             <div className="flex items-center justify-between mb-4">
                               <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-[#64ffda]/10 rounded-full flex items-center justify-center font-bold text-[#64ffda]">
                                   {review.user_name ? review.user_name.charAt(0).toUpperCase() : 'A'}
                                 </div>
                                 <div>
                                   <p className="text-white font-bold text-sm">{review.user_name || 'Anonim'}</p>
                                   <div className="flex gap-1 mt-1">
                                     {Array.from({ length: 5 }).map((_, i) => (
                                       <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                                     ))}
                                   </div>
                                 </div>
                               </div>
                               <span className="text-xs text-slate-500">{new Date(review.created_at).toLocaleDateString('tr-TR')}</span>
                             </div>
                             <p className="text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10">
                        <p className="text-slate-400 text-sm italic">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STANDARD INFORMATIONAL LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-24">
              <div id="hakkinda" className="space-y-6 scroll-mt-32">
                  <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black text-[#64ffda] uppercase tracking-[0.4em] whitespace-nowrap">MEKAN HAKKINDA</h3>
                      <div className="h-px w-full bg-white/5" />
                  </div>
                  <p className="text-xl md:text-2xl text-white font-medium leading-relaxed italic opacity-95 first-letter:text-5xl first-letter:font-black first-letter:text-[#64ffda] first-letter:mr-3 first-letter:float-left">
                      {business.description || "Fethiye'nin kalbinde, eşsiz lezzetler ve unutulmaz anılar için kapılarımızı açıyoruz."}
                  </p>
              </div>

              <div className="space-y-12">
                <div className="flex items-center gap-4">
                  <h3 className="text-[10px] font-black text-[#64ffda] uppercase tracking-[0.4em] whitespace-nowrap">MEKANDAN KARELER</h3>
                  <div className="h-px w-full bg-white/5" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="relative aspect-square rounded-[32px] overflow-hidden group border border-white/5">
                      <img src={`https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&i=${i}`} alt="Galeri" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Yorumlar Bölümü */}
              <div id="yorumlar" className="space-y-8 scroll-mt-32">
                  <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black text-[#64ffda] uppercase tracking-[0.4em] whitespace-nowrap">YORUMLAR</h3>
                      <div className="h-px w-full bg-white/5" />
                  </div>
                  {reviews.length > 0 ? (
                    <div className="grid gap-4">
                      {reviews.map((review: any) => (
                        <div key={review.id} className="bg-white/5 p-6 rounded-2xl border border-white/10">
                           <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-[#64ffda]/10 rounded-full flex items-center justify-center font-bold text-[#64ffda]">
                                 {review.user_name ? review.user_name.charAt(0).toUpperCase() : 'A'}
                               </div>
                               <div>
                                 <p className="text-white font-bold text-sm">{review.user_name || 'Anonim'}</p>
                                 <div className="flex gap-1 mt-1">
                                   {Array.from({ length: 5 }).map((_, i) => (
                                     <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                                   ))}
                                 </div>
                               </div>
                             </div>
                             <span className="text-xs text-slate-500">{new Date(review.created_at).toLocaleDateString('tr-TR')}</span>
                           </div>
                           <p className="text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10">
                      <p className="text-slate-400 text-sm italic">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                    </div>
                  )}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-10">
              <div className="bg-white/5 border border-white/10 rounded-[48px] p-10 space-y-10 sticky top-32 overflow-hidden">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">İletişim</h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="p-4 bg-[#64ffda]/10 rounded-2xl border border-[#64ffda]/20"><MapPin className="w-5 h-5 text-[#64ffda]" /></div>
                    <div>
                      <p className="text-white font-black text-[10px] uppercase tracking-widest">Adres</p>
                      <p className="text-slate-400 text-sm mt-1">{business.address || 'Fethiye Merkez'}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-10 border-t border-white/5 space-y-4">
                  <a href={`tel:${business.phone}`} className="w-full py-5 bg-[#64ffda] text-[#0a192f] rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3">
                    <Phone className="w-5 h-5" /> HEMEN ARA
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Floating Order Bar - Mobile Only */}
      <div className="fixed bottom-6 left-6 right-6 z-[100] md:hidden">
          <a 
            href={isSalesOriented ? `https://wa.me/${(business.whatsapp || business.phone)?.replace(/\s+/g, '')}` : `tel:${business.phone}`}
            className="w-full h-16 bg-[#64ffda] text-[#0a192f] rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-[#64ffda]/40 font-black uppercase tracking-widest text-xs"
          >
            {isSalesOriented ? (
              <><MessageCircle className="w-5 h-5" /> ŞİMDİ SİPARİŞ VER</>
            ) : (
              <><Phone className="w-5 h-5" /> HEMEN ARA / İLETİŞİM</>
            )}
          </a>
      </div>

      {/* GLOBAL KATALOG OVERLAY (Sales Oriented olmayanlar için de çalışır) */}
      {/* Not: MenuButtonTrigger içinde zaten OrderLayout bulunuyor, bu yüzden burada ayrıca çağırmaya gerek yok */}

      <Footer />
    </main>
  )
}
