import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { MapPin, Phone, Globe, Star, Clock, CheckCircle2, Package, Image as ImageIcon, MessageSquare, Send, CornerDownRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { ReviewForm } from '@/components/fethiye/review-form'

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const supabase = await createClient()
  const { slug } = await params

  // 1. Isletme bilgilerini getir
  const { data: business } = await supabase
    .from('businesses')
    .select('*, business_categories(name)')
    .eq('slug', slug)
    .single()

  if (!business) notFound()

  // 2. Isletme urunlerini getir
  const { data: products } = await supabase
    .from('business_products')
    .select('*')
    .eq('business_id', business.id)

  // 3. Isletme fotograflarini getir
  const { data: images } = await supabase
    .from('business_images')
    .select('*')
    .eq('business_id', business.id)

  // 4. Yorumlari getir
  const { data: reviews } = await supabase
    .from('business_reviews')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={business.main_image || "https://picsum.photos/1200/800"} alt={business.name} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{business.name}</h1>
            <div className="flex items-center gap-4 text-[#64ffda] font-bold uppercase tracking-widest text-xs">
              <Star className="w-4 h-4 fill-[#64ffda]" />
              {business.rating || '5.0'} • {reviews?.length || 0} Değerlendirme
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-16">
            {/* Hakkında */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-slate-500">İşletme Hakkında</h2>
              <p className="text-slate-300 leading-relaxed text-lg">{business.description}</p>
            </section>

            {/* Galeri */}
            {images && images.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-widest text-slate-500">Fotoğraf Galerisi</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="aspect-square rounded-2xl overflow-hidden border border-slate-700/50 hover:border-[#64ffda]/30 transition-all">
                      <img src={img.image_url} alt="Galeri" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Ürünler */}
            {products && products.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-widest text-slate-500">Menü & Ürünler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="bg-[#112240] p-6 rounded-3xl border border-slate-700/50 flex justify-between items-center group">
                      <div>
                        <h4 className="text-white font-bold">{p.name}</h4>
                        <p className="text-slate-500 text-[10px] mt-1">{p.description || 'Özel seçim'}</p>
                      </div>
                      <div className="text-xl font-bold text-[#64ffda]">{p.price} TL</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Yorumlar */}
            <section id="yorumlar">
              <h2 className="text-xl font-bold text-white mb-10 uppercase tracking-widest text-slate-500">Yorumlar & Değerlendirmeler</h2>
              
              {/* Yorum Formu (Client Component) */}
              <div className="mb-12">
                <ReviewForm businessId={business.id} />
              </div>

              <div className="space-y-6">
                {reviews?.map((review) => (
                  <div key={review.id} className="bg-[#112240] p-8 rounded-[32px] border border-slate-700/50 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda] font-bold">
                          {review.user_name[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-white font-bold">{review.user_name}</h4>
                          <p className="text-slate-500 text-xs">{new Date(review.created_at).toLocaleDateString('tr-TR')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        {review.rating}.0
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed italic">"{review.comment}"</p>
                    
                    {/* İşletme Sahibi Yanıtı */}
                    {review.reply && (
                      <div className="mt-6 pt-6 border-t border-slate-700/50 flex gap-4">
                        <CornerDownRight className="w-5 h-5 text-[#64ffda] shrink-0 mt-1" />
                        <div className="bg-[#0a192f] p-5 rounded-2xl flex-1 border border-[#64ffda]/10">
                          <span className="text-[#64ffda] font-bold text-xs uppercase tracking-widest block mb-2">İşletme Sahibinin Yanıtı</span>
                          <p className="text-slate-400 text-sm leading-relaxed">{review.reply}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {reviews?.length === 0 && (
                  <div className="py-12 text-center border border-dashed border-slate-700 rounded-[40px]">
                    <MessageSquare className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-500">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* İletişim Kolonu */}
          <div className="space-y-6">
            <div className="bg-[#112240] rounded-[40px] p-8 border border-slate-700/50 sticky top-24">
              <h3 className="text-white font-bold mb-8 text-xl">İletişim</h3>
              <div className="space-y-4">
                <a href={`tel:${business.phone}`} className="flex items-center gap-4 p-4 bg-[#0a192f] rounded-2xl border border-slate-700/30 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all"><Phone className="w-5 h-5" /></div>
                  <div className="text-white font-bold truncate">{business.phone || '0252 ...'}</div>
                </a>
                <button className="w-full py-4 bg-[#64ffda] hover:bg-[#52e0c4] text-[#0a192f] rounded-2xl font-bold transition-all shadow-xl shadow-[#64ffda]/10 uppercase tracking-widest text-xs">Yol Tarifi Al</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
