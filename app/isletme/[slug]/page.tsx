import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { 
  MapPin, Phone, Globe, Star, Clock, 
  CheckCircle2, Package, Image as ImageIcon, 
  MessageSquare, Send, CornerDownRight, 
  ChevronRight, Sparkles, Navigation 
} from 'lucide-react'
import { notFound } from 'next/navigation'
import { ReviewForm } from '@/components/fethiye/review-form'
import Image from 'next/image'
import { Metadata } from 'next'

// --- 1. Dinamik SEO (Metadata) ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const supabase = await createClient()
  const { slug } = await params
  
  const { data: business } = await supabase
    .from('businesses')
    .select('name, description, main_image')
    .eq('slug', slug)
    .single()

  if (!business) return { title: 'İşletme Bulunamadı - Fethiye 360°' }

  const title = `${business.name} | Fethiye 360° İşletme Rehberi`
  const description = business.description?.slice(0, 160) || 'Fethiye\'nin en iyi işletmelerini keşfedin.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [business.main_image || '/hero-bg.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [business.main_image || '/hero-bg.jpg'],
    },
  }
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const supabase = await createClient()
  const { slug } = await params

  const { data: business } = await supabase
    .from('businesses')
    .select('*, business_categories(name)')
    .eq('slug', slug)
    .single()

  if (!business) notFound()

  const { data: products } = await supabase
    .from('business_products')
    .select('*')
    .eq('business_id', business.id)

  const { data: images } = await supabase
    .from('business_images')
    .select('*')
    .eq('business_id', business.id)

  // 4. Sadece Onaylı Yorumlari getir
  const { data: reviews } = await supabase
    .from('business_reviews')
    .select('*')
    .eq('business_id', business.id)
    .eq('is_approved', true) // Sadece onaylıları göster
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-[#0a192f] selection:bg-[#64ffda]/30">
      <Header />
      
      {/* HD Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <Image 
          src={business.main_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"} 
          alt={business.name} 
          fill
          priority
          className="object-cover opacity-50 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a192f_100%)] opacity-60" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 relative z-10">
          <div className="container mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#64ffda]/10 border border-[#64ffda]/20 mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#64ffda]" />
              <span className="text-[#64ffda] text-[10px] font-bold uppercase tracking-widest">
                {business.business_categories?.name || 'Kategori'}
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none max-w-4xl drop-shadow-2xl">
              {business.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5">
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                  <Star className="w-5 h-5 fill-yellow-500" />
                  <span className="text-lg">{business.rating || '5.0'}</span>
                </div>
                <div className="w-[1px] h-4 bg-white/10 mx-2" />
                <div className="text-slate-400 text-sm font-medium">{reviews?.length || 0} Yorum</div>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm font-medium bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5">
                <MapPin className="w-4 h-4 text-[#64ffda]" />
                {business.address || 'Fethiye, Muğla'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative">
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#64ffda]/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          <div className="lg:col-span-2 space-y-24">
            {/* Hakkında */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1.5 h-8 bg-[#64ffda] rounded-full" />
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">İşletme Hakkında</h2>
              </div>
              <div className="p-8 md:p-12 rounded-[48px] bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#64ffda]/5 rounded-full blur-3xl" />
                <p className="text-slate-300 leading-relaxed text-xl md:text-2xl font-medium tracking-tight italic">
                  "{business.description}"
                </p>
              </div>
            </section>

            {/* Galeri - HD Grid */}
            {images && images.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Fotoğraf Galerisi</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {images.map((img, i) => (
                    <div key={img.id} className="group relative aspect-square rounded-[32px] overflow-hidden border border-white/5 hover:border-[#64ffda]/40 transition-all duration-500 shadow-2xl">
                      <Image 
                        src={img.image_url} 
                        alt={`${business.name} Galeri ${i+1}`} 
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                        <ImageIcon className="w-6 h-6 text-[#64ffda]" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Ürünler - HD Cards */}
            {products && products.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1.5 h-8 bg-yellow-500 rounded-full" />
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Menü & Popüler Ürünler</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map((p) => (
                    <div key={p.id} className="group relative bg-white/5 p-8 rounded-[40px] border border-white/5 hover:border-white/20 transition-all duration-500 backdrop-blur-xl">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Package className="w-4 h-4 text-[#64ffda]" />
                            <h4 className="text-white font-bold text-xl group-hover:text-[#64ffda] transition-colors">{p.name}</h4>
                          </div>
                          <p className="text-slate-500 text-sm leading-relaxed">{p.description || 'İşletmenin özel seçimi olan bu ürünü mutlaka deneyin.'}</p>
                        </div>
                        <div className="text-2xl font-black text-[#64ffda] bg-[#64ffda]/10 px-5 py-2 rounded-2xl border border-[#64ffda]/20 group-hover:scale-110 transition-transform">
                          {p.price}<span className="text-xs ml-1 font-bold">TL</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Yorumlar - Modern Flow */}
            <section id="yorumlar" className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-[#64ffda] rounded-full" />
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Misafir Yorumları</h2>
                </div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  {reviews?.length || 0} Toplam
                </div>
              </div>
              
              <div className="mb-16">
                <ReviewForm businessId={business.id} />
              </div>

              <div className="space-y-8">
                {reviews?.map((review) => (
                  <div key={review.id} className="group relative bg-white/5 p-10 rounded-[48px] border border-white/5 hover:border-white/10 transition-all duration-500 backdrop-blur-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#64ffda]/20 to-blue-500/20 flex items-center justify-center text-[#64ffda] font-black text-xl shadow-lg border border-white/5">
                          {review.user_name[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-lg group-hover:text-[#64ffda] transition-colors">{review.user_name}</h4>
                          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">{new Date(review.created_at).toLocaleDateString('tr-TR')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20 text-yellow-500 font-black text-sm">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        {review.rating}.0
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-lg italic relative z-10">
                      "{review.comment}"
                    </p>
                    
                    {review.reply && (
                      <div className="mt-8 pt-8 border-t border-white/5 flex gap-6">
                        <div className="w-10 h-10 rounded-full bg-[#64ffda]/10 flex items-center justify-center shrink-0">
                          <CornerDownRight className="w-5 h-5 text-[#64ffda]" />
                        </div>
                        <div className="bg-white/5 p-6 rounded-[32px] flex-1 border border-[#64ffda]/10 relative">
                          <span className="text-[#64ffda] font-black text-[10px] uppercase tracking-[0.2em] block mb-3">İşletme Sahibinin Yanıtı</span>
                          <p className="text-slate-400 text-sm leading-relaxed font-medium">{review.reply}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* İletişim Kolonu - HD Card */}
          <div className="space-y-8">
            <div className="bg-[#112240]/90 backdrop-blur-2xl rounded-[48px] p-10 border border-white/10 sticky top-32 shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#64ffda]/10 rounded-full blur-[60px] -mr-16 -mt-16" />
              
              <h3 className="text-white font-black mb-10 text-2xl tracking-tighter uppercase">İletişim & Randevu</h3>
              <div className="space-y-6">
                <a href={`tel:${business.phone}`} className="flex items-center gap-5 p-5 bg-white/5 rounded-[32px] border border-white/5 group hover:bg-[#64ffda]/10 hover:border-[#64ffda]/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-[#0a192f] transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Telefon</div>
                    <div className="text-white font-black text-lg group-hover:text-[#64ffda] transition-colors">{business.phone || '0252 ...'}</div>
                  </div>
                </a>
                
                <a 
                  href={
                    business.location_lat && business.location_lng 
                      ? `https://www.google.com/maps/dir/?api=1&destination=${business.location_lat},${business.location_lng}`
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name + ' ' + (business.address || 'Fethiye'))}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full group py-5 bg-[#64ffda] hover:bg-[#52e0c4] text-[#0a192f] rounded-[32px] font-black transition-all shadow-[0_20px_40px_rgba(100,255,218,0.2)] uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 active:scale-95 no-underline"
                >
                  <Navigation className="w-4 h-4" />
                  Yol Tarifi Al
                </a>
              </div>

              {/* Business Info Items */}
              <div className="mt-12 space-y-6 pt-12 border-t border-white/5">
                <div className="flex items-center gap-4 text-slate-400">
                  <Clock className="w-5 h-5 text-[#64ffda]" />
                  <span className="text-sm font-medium">09:00 - 22:00</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-[#64ffda]" />
                  <span className="text-sm font-medium">Doğrulanmış İşletme</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
