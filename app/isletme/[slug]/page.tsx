import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { MapPin, Phone, Globe, MessageCircle, Clock, Star, Building2, CheckCircle2, Share2, Heart, Info, Image as ImageIcon, MessageSquare, Tag, Plus } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const supabase = await createClient()
  const { slug } = await params
  
  // Kullanici oturumunu kontrol edelim
  const { data: { user } } = await supabase.auth.getUser()

  // Isletmeyi detaylariyla cekelim
  const { data: business } = await supabase
    .from('businesses')
    .select(`
      *,
      business_categories (name)
    `)
    .eq('slug', slug)
    .single()

  if (!business) {
    notFound()
  }

  // Yorumlari ve Urunleri cekelim
  const { data: reviews } = await supabase
    .from('business_reviews')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  const { data: products } = await supabase
    .from('business_products')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />
      
      <div className="pt-20">
        {/* Facebook Style Cover & Profile Header (Zaten yapmistik, buralari hizlica geciyorum) */}
        <div className="relative h-[250px] md:h-[350px] w-full bg-slate-800">
          <img 
            src={business.main_image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"} 
            alt="Kapak" className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="bg-[#112240] border-b border-slate-700/50">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col md:flex-row items-end md:items-center gap-6 pb-6">
              <div className="relative -mt-16 md:-mt-24 w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-[#112240] bg-[#0a192f] overflow-hidden shadow-2xl z-10">
                <img src={business.main_image} alt={business.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 pt-4 md:pt-0">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-4xl font-bold text-white">{business.name}</h1>
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-blue-500 fill-blue-500" />
                </div>
                <p className="text-slate-400 font-medium mb-2">{business.business_categories?.name} • Fethiye</p>
                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <span className="font-bold text-white">{reviews?.length || 0} <span className="font-normal text-slate-400">Yorum</span></span>
                  <span className="font-bold text-white">{products?.length || 0} <span className="font-normal text-slate-400">Ürün</span></span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" /> Mesaj Gönder
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar (Left) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#112240] rounded-2xl border border-slate-700/50 p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6">Künye</h3>
                <div className="space-y-4 text-slate-300">
                   <div className="flex items-start gap-3"><Info className="w-5 h-5 text-slate-500 shrink-0" /><span>{business.description}</span></div>
                   <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-slate-500 shrink-0" /><span>{business.address}</span></div>
                   <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-slate-500 shrink-0" /><span>{business.phone}</span></div>
                </div>
              </div>

              {/* URUNLER / VITRIN BÖLÜMÜ */}
              <div className="bg-[#112240] rounded-2xl border border-slate-700/50 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#64ffda]" />
                    Ürünlerimiz
                  </h3>
                </div>
                <div className="space-y-4">
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <div key={product.id} className="flex gap-4 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                        <div className="w-16 h-16 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                          <img src={product.image_url || 'https://picsum.photos/200'} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-bold text-sm">{product.name}</div>
                          <div className="text-slate-400 text-xs line-clamp-1">{product.description}</div>
                          <div className="text-[#64ffda] font-bold mt-1">{product.price} TL</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm text-center py-4 italic">Henüz ürün eklenmemiş.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline / Feed (Right) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* YORUM YAPMA FORMU (Sadece Kayitli Kullanicilara) */}
              <div className="bg-[#112240] rounded-2xl border border-slate-700/50 p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Değerlendirme Bırak
                </h3>
                
                {user ? (
                  <form action="/api/review" method="POST" className="space-y-4">
                    <input type="hidden" name="business_id" value={business.id} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input name="user_name" value={user.email?.split('@')[0]} readOnly className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 focus:outline-none" />
                      <select name="rating" className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#64ffda]" required>
                        <option value="5">⭐⭐⭐⭐⭐ (Mükemmel)</option>
                        <option value="4">⭐⭐⭐⭐ (Çok İyi)</option>
                        <option value="3">⭐⭐⭐ (Orta)</option>
                        <option value="2">⭐⭐ (Kötü)</option>
                        <option value="1">⭐ (Çok Kötü)</option>
                      </select>
                    </div>
                    <textarea name="comment" placeholder="Bu işletme hakkındaki deneyiminizi paylaşın..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white h-24 focus:outline-none focus:border-[#64ffda]" required></textarea>
                    <button type="submit" className="w-full bg-[#64ffda] text-[#0a192f] py-3 rounded-xl font-bold hover:bg-[#52e0c4] transition-all">
                      Değerlendirmeyi Gönder
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-slate-400 mb-4 text-sm">Yorum yapabilmek için üye girişi yapmanız gerekmektedir.</p>
                    <Link href="/login" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-colors">
                      Giriş Yap / Kayıt Ol
                    </Link>
                  </div>
                )}
              </div>

              {/* YORUMLAR LİSTESİ */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  Ziyaretçi Yorumları
                </h3>
                {reviews && reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-[#112240] rounded-2xl border border-slate-700/50 p-6 shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                            {review.user_name[0]}
                          </div>
                          <div>
                            <div className="text-white font-bold">{review.user_name}</div>
                            <div className="text-slate-500 text-xs">{new Date(review.created_at).toLocaleDateString('tr-TR')}</div>
                          </div>
                        </div>
                        <div className="flex text-yellow-500">
                          {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500" />)}
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#112240] rounded-2xl border border-slate-700/50 p-12 text-center">
                    <p className="text-slate-500">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
