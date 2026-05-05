import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { MapPin, Star, Building2, Search as SearchIcon, ArrowLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CategoryDiscoveryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const supabase = await createClient()
  const { slug } = await params

  // Kategoriyi bulalim
  const { data: category } = await supabase
    .from('business_categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) {
    notFound()
  }

  // Bu kategoriye ait isletmeleri cekelim
  const { data: businesses } = await supabase
    .from('businesses')
    .select(`
      *,
      business_categories (name)
    `)
    .eq('category_id', category.id)
    .order('is_featured', { ascending: false })

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />

      <div className="container mx-auto px-4 pt-32 pb-24">
        {/* Breadcrumb / Back Navigation */}
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">
          <Link href="/" className="hover:text-[#64ffda] transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/kesfet" className="hover:text-[#64ffda] transition-colors">Keşfet</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#64ffda]">{category.name}</span>
        </div>

        {/* Category Header HD */}
        <div className="relative mb-16 p-10 md:p-16 bg-white/5 rounded-[48px] border border-white/10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#64ffda]/5 rounded-full blur-[120px] -mr-48 -mt-48" />
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter">
              {category.name}
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
              Fethiye'deki en iyi {category.name.toLowerCase()} listesini keşfedin,
              gerçek kullanıcı yorumlarını okuyun ve rotanızı oluşturun.
            </p>
          </div>
        </div>

        {/* Results Grid - HD Style */}
        <div className="relative z-10">
          {businesses && businesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {businesses.map((business) => (
                <Link
                  key={business.id}
                  href={`/isletme/${business.slug}`}
                  className="group relative flex flex-col bg-white/5 rounded-[40px] border border-white/5 overflow-hidden hover:border-[#64ffda]/40 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 shadow-xl"
                >
                  <div className="relative h-60 bg-slate-800 overflow-hidden">
                    <img
                      src={business.main_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"}
                      alt={business.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {business.is_featured && (
                      <div className="absolute top-5 left-5">
                        <span className="px-4 py-1.5 rounded-full bg-[#64ffda] text-[#0a192f] text-[10px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(100,255,218,0.3)]">
                          Öne Çıkan
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-7">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#64ffda] transition-colors line-clamp-1">
                      {business.name}
                    </h3>
                    <div className="flex items-start gap-2 text-slate-500 text-sm mb-6">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#64ffda]/50" />
                      <span className="line-clamp-1">{business.address || 'Fethiye, Muğla'}</span>
                    </div>

                    <div className="pt-5 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-yellow-500 font-bold">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <span className="text-sm">{business.rating || '5.0'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#64ffda] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                        İncele <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 rounded-[48px] border border-white/5 p-24 text-center">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                <Building2 className="w-10 h-10 text-slate-600" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tighter">Henüz Kayıt Yok</h2>
              <p className="text-slate-500 mb-10 max-w-md mx-auto text-lg leading-relaxed">
                Bu kategoride henüz bir işletme kaydı bulunmuyor. Ekibimiz en iyi yerleri sizin için eklemeye devam ediyor!
              </p>
              <Link
                href="/kesfet"
                className="inline-flex items-center px-12 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest hover:bg-[#52e0c4] hover:scale-105 transition-all shadow-lg"
              >
                Tüm Kategorilere Dön
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
