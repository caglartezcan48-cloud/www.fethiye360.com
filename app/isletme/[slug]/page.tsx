import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { MenuButtonTrigger } from '@/components/isletme/menu-button-trigger'
import Image from 'next/image'
import Link from 'next/link'
import { OrderLayout } from '@/components/isletme/order-layout'
import { ShowcaseLayout } from '@/components/isletme/showcase-layout'
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
              businessId={business.id}
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
          <ShowcaseLayout 
            business={business} 
            products={products} 
            reviews={reviews} 
            avgRating={avgRating} 
          />
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
