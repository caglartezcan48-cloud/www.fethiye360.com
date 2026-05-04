import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { MapPin, Phone, Globe, Star, Clock, CheckCircle2, Package, Image as ImageIcon } from 'lucide-react'
import { notFound } from 'next/navigation'

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

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />
      
      {/* Hero Section / Cover */}
      <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <img 
          src={business.main_image || "https://picsum.photos/1200/800"} 
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-black/20" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto">
            <span className="px-4 py-1.5 rounded-full bg-[#64ffda] text-[#0a192f] text-xs font-bold uppercase tracking-widest mb-4 inline-block">
              {business.business_categories?.name}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">{business.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-300">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-white">{business.rating || '5.0'}</span>
                <span className="text-xs">(24 Yorum)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#64ffda]" />
                <span>{business.address || 'Fethiye, Muğla'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Sol Kolon: Detaylar ve Ürünler */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Hakkında */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <CheckCircle2 className="text-[#64ffda] w-6 h-6" />
                İşletme Hakkında
              </h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                {business.description || 'Fethiye\'nin en seçkin işletmelerinden biri olan mekanımızda sizleri ağırlamaktan mutluluk duyarız.'}
              </p>
            </section>

            {/* Ürünler ve Hizmetler */}
            {products && products.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <Package className="text-[#64ffda] w-6 h-6" />
                  Ürünler & Fiyatlar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="bg-[#112240] p-6 rounded-3xl border border-slate-700/50 flex justify-between items-center group hover:border-[#64ffda]/30 transition-all">
                      <div>
                        <h4 className="text-white font-bold mb-1">{p.name}</h4>
                        <p className="text-slate-500 text-xs">{p.description || 'Özel seçim ürünümüz'}</p>
                      </div>
                      <div className="text-xl font-bold text-[#64ffda]">{p.price} TL</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Foto Galeri */}
            {images && images.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <ImageIcon className="text-[#64ffda] w-6 h-6" />
                  Fotoğraf Galerisi
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="aspect-square rounded-3xl overflow-hidden border border-slate-700/50 group cursor-pointer">
                      <img 
                        src={img.image_url} 
                        alt="Galeri" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sağ Kolon: İletişim ve Bilgi */}
          <div className="space-y-6">
            <div className="bg-[#112240] rounded-[40px] p-8 border border-slate-700/50 sticky top-24">
              <h3 className="text-white font-bold mb-8 text-xl">İletişim Bilgileri</h3>
              
              <div className="space-y-6">
                <a href={`tel:${business.phone}`} className="flex items-center gap-4 text-slate-300 hover:text-[#64ffda] transition-colors p-4 bg-[#0a192f] rounded-2xl border border-slate-700/30">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Telefon</div>
                    <div className="font-bold">{business.phone || '0252 614 00 00'}</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-slate-300 p-4 bg-[#0a192f] rounded-2xl border border-slate-700/30">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Web Sitesi</div>
                    <div className="font-bold truncate max-w-[150px]">{business.website || 'isletme.com'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-300 p-4 bg-[#0a192f] rounded-2xl border border-slate-700/30">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Durum</div>
                    <div className="font-bold text-green-500">Şu An Açık</div>
                  </div>
                </div>

                <button className="w-full py-4 bg-[#64ffda] hover:bg-[#52e0c4] text-[#0a192f] rounded-2xl font-bold flex items-center justify-center gap-2 transition-all mt-4">
                  Yol Tarifi Al
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}
