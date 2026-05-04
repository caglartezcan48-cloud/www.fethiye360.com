import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/fethiye/header'
import { Hero } from '@/components/fethiye/hero'
import { Footer } from '@/components/fethiye/footer'
import { MapPin, Star, Building2, Search as SearchIcon } from 'lucide-react'
import Link from 'next/link'

export default async function DiscoveryPage({
  searchParams,
}: {
  searchParams: Promise<{ ara?: string }>
}) {
  const supabase = await createClient()
  const { ara } = await searchParams
  const query = ara ? decodeURIComponent(ara) : ''

  let businesses: any[] = []

  if (query) {
    // Arama Mantigi
    const { data: matchedCategories } = await supabase
      .from('business_categories')
      .select('id')
      .or(`name.ilike.%${query}%,name.ilike.%${query.replace('İ', 'i').replace('I', 'ı')}%`)

    const categoryIds = matchedCategories?.map(c => c.id) || []

    let dbQuery = supabase
      .from('businesses')
      .select(`
        *,
        business_categories (name)
      `)

    if (categoryIds.length > 0) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,category_id.in.(${categoryIds.join(',')})`)
    } else {
      dbQuery = dbQuery.ilike('name', `%${query}%`)
    }

    const { data } = await dbQuery.order('is_featured', { ascending: false })
    businesses = data || []
  }

  return (
    <main className="min-h-screen bg-[#0a192f]">
      {/* 1. Navigasyon */}
      <Header />
      
      {/* 2. Ana Sayfadaki Ust Kisim (Arama Motoru Dahil) */}
      <div className="relative">
        <Hero />
      </div>
      
      {/* 3. Sonuclar Bolumu */}
      <div className="container mx-auto px-4 pb-24 -mt-10 relative z-20">
        <div className="bg-[#112240]/90 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {query ? `"${query}" İçin Sonuçlar` : 'Tüm İşletmeler'}
              </h2>
              <p className="text-slate-400 text-sm">
                Toplam {businesses.length} kayıt bulundu
              </p>
            </div>
            {query && (
              <Link href="/" className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-bold transition-all border border-white/10">
                Aramayı Sıfırla
              </Link>
            )}
          </div>

          {businesses && businesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <Link 
                  key={business.id}
                  href={`/isletme/${business.slug}`}
                  className="flex items-center gap-5 bg-[#0a192f]/50 p-4 rounded-[32px] border border-white/5 hover:border-[#64ffda]/30 transition-all group"
                >
                  <div className="w-24 h-24 rounded-3xl bg-slate-800 overflow-hidden shrink-0 border border-white/5">
                    <img src={business.main_image || "https://picsum.photos/400"} alt={business.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-white font-bold text-lg truncate group-hover:text-[#64ffda] transition-colors">{business.name}</div>
                    <div className="text-slate-400 text-xs flex items-center gap-1.5 mt-1.5 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-[#64ffda]/50" />
                      <span className="truncate">{business.address || 'Fethiye, Muğla'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#64ffda]/10 text-[#64ffda] text-[10px] font-bold border border-[#64ffda]/20 uppercase tracking-widest">
                        {business.business_categories?.name || 'Genel'}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-yellow-500" />
                        {business.rating || '5.0'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon className="w-10 h-10 text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Eşleşen Kayıt Yok</h2>
              <p className="text-slate-500 max-w-sm mx-auto">Aradığınız kriterlere uygun bir işletme bulunamadı.</p>
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
    </main>
  )
}
