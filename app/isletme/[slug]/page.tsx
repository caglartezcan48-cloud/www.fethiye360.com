import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { MenuButtonTrigger } from '@/components/isletme/menu-button-trigger'
import Image from 'next/image'
import Link from 'next/link'
import { OrderLayout } from '@/components/isletme/order-layout'
import { BusinessActionButtons } from '@/components/isletme/business-action-buttons'
import { 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  MessageCircle, 
  Clock,
  Package,
  Sparkles,
  ArrowLeft,
  Info,
  ChevronRight,
  Bike,
  Users
} from 'lucide-react'

export default async function BusinessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
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
    }
  )

  try {
    // 1. Isletme Bilgisini Cek
    const { data: business, error: bError } = await supabase
      .from('businesses')
      .select('*, business_categories(name)')
      .eq('slug', slug)
      .single()

    if (bError || !business) {
      console.error('Business fetch error:', bError)
      return notFound()
    }

    // 2. Urunleri ve Yorumlari cek
    const [productsRes, reviewsRes] = await Promise.all([
      supabase.from('business_products').select('*').eq('business_id', business.id),
      supabase.from('business_reviews').select('*').eq('business_id', business.id).eq('is_approved', true).order('created_at', { ascending: false })
    ])

    const products = productsRes.data || []
    const reviews = reviewsRes.data || []
    const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '5.0'

    // Satis Odakli Sayfa Kontrolu
    const isSalesOriented = Array.isArray(business.services) && business.services.some((s: string) => s?.toLowerCase().includes('paket'));

    // Guvenli kategori ismi
    const categoryName = Array.isArray(business.business_categories) 
      ? business.business_categories[0]?.name 
      : (business.business_categories as any)?.name || 'Isletme';

    return (
      <main className="min-h-screen bg-[#0a0f1a] selection:bg-cyan-500/30 selection:text-white">
        <Header />

        {isSalesOriented ? (
          /* PAKET SERVIS ISLETMELER - PREMIUM SIPARIS SAYFASI */
          <div className="pt-24">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <nav className="flex items-center gap-2 text-sm text-white/40">
                <Link href="/" className="hover:text-white transition-colors">Anasayfa</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/isletmeler" className="hover:text-white transition-colors">Isletmeler</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{business.name}</span>
              </nav>
            </div>

            {/* Order Layout */}
            <OrderLayout 
              products={products} 
              businessName={business.name} 
              whatsappNumber={business.whatsapp || business.phone}
              businessImage={business.main_image}
              description={business.description}
              avgRating={avgRating}
              reviewCount={reviews.length}
            />

            {/* Reviews Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Degerlendirmeler</h2>
                    <p className="text-sm text-white/40">{reviews.length} yorum</p>
                  </div>
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map((review: any) => (
                      <div key={review.id} className="p-5 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                              {review.user_name?.charAt(0) || 'A'}
                            </div>
                            <div>
                              <p className="text-white font-medium">{review.user_name || 'Anonim'}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-white/30">
                            {new Date(review.created_at).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
                    <MessageCircle className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">Henuz yorum yapilmamis</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          /* TANITIM ISLETMELERI - SHOWCASE SAYFASI */
          <>
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
              <Image 
                src={business.main_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80"} 
                alt={business.name} 
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/50 to-transparent" />
              
              {/* Back Button */}
              <Link 
                href="/isletmeler" 
                className="absolute top-28 left-6 p-3 bg-white/10 backdrop-blur-md rounded-xl text-white/70 hover:text-white hover:bg-white/20 border border-white/10 transition-all z-10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              {/* Share Button */}
              <div className="absolute top-28 right-6 z-10">
                <BusinessActionButtons title={business.name} />
              </div>
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-8 pb-16 z-10">
                <div className="space-y-6 max-w-3xl">
                  <span className="inline-block px-4 py-2 bg-cyan-500 text-[#0a0f1a] rounded-full text-xs font-bold uppercase tracking-wider">
                    {categoryName}
                  </span>
                  
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
                    {business.name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-white font-semibold">{avgRating}</span>
                      <span className="text-white/50 text-sm">({reviews.length})</span>
                    </div>
                    
                    {products.length > 0 && (
                      <MenuButtonTrigger 
                        products={products}
                        businessName={business.name}
                        whatsappNumber={business.whatsapp || business.phone}
                        className="flex items-center gap-2 bg-white text-[#0a0f1a] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/90 transition-all shadow-lg"
                        label="Menu & Katalog"
                      />
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Info Section */}
            <section className="max-w-7xl mx-auto px-6 py-16">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                  {/* About */}
                  <div>
                    <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">Hakkinda</h2>
                    <p className="text-lg text-white/80 leading-relaxed">
                      {business.description || "Fethiye'nin kalbinde, essiz lezzetler ve unutulmaz anilar icin kapilarimizi aciyoruz."}
                    </p>
                  </div>

                  {/* Reviews */}
                  <div>
                    <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-6">Degerlendirmeler</h2>
                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.slice(0, 3).map((review: any) => (
                          <div key={review.id} className="p-5 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                  {review.user_name?.charAt(0) || 'A'}
                                </div>
                                <div>
                                  <p className="text-white font-medium">{review.user_name || 'Anonim'}</p>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs text-white/30">
                                {new Date(review.created_at).toLocaleDateString('tr-TR')}
                              </span>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/40 text-sm">Henuz yorum yapilmamis.</p>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div>
                  <div className="sticky top-32 bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
                    <h3 className="text-xl font-semibold text-white">Iletisim</h3>
                    
                    {business.address && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-cyan-500/10 rounded-xl">
                          <MapPin className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Adres</p>
                          <p className="text-white/80 text-sm">{business.address}</p>
                        </div>
                      </div>
                    )}

                    {business.phone && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-cyan-500/10 rounded-xl">
                          <Phone className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Telefon</p>
                          <p className="text-white/80 text-sm">{business.phone}</p>
                        </div>
                      </div>
                    )}

                    <div className="pt-6 border-t border-white/5">
                      <a 
                        href={`tel:${business.phone}`} 
                        className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-[#0a0f1a] rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all"
                      >
                        <Phone className="w-5 h-5" />
                        Hemen Ara
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        <Footer />
      </main>
    )
  } catch (err) {
    console.error('Fatal page error:', err)
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex flex-col items-center justify-center p-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Bir Hata Olustu</h1>
        <p className="text-white/40 mb-8">Sayfa yuklenirken bir sorun yasandi. Lutfen biraz sonra tekrar deneyin.</p>
        <Link href="/" className="px-8 py-3 bg-cyan-500 text-[#0a0f1a] rounded-xl font-semibold">Anasayfaya Don</Link>
      </div>
    )
  }
}
