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
      <Header />
      
      {/* Resimdeki o meşhur üst kısım (Hero ve Arama Motoru) daima burada */}
      <Hero />
      
      <div id="sonuclar" className="container mx-auto px-4 pb-20 -mt-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-[#112240]/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {query ? `"${query}" İçin Sonuçlar` : 'Tüm İşletmeler'}
            </h2>
            <p className="text-slate-400 text-sm">
              {businesses.length} işletme bulundu
            </p>
          </div>
          {query && (
            <Link href="/" className="px-6 py-2 bg-slate-800 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all">
              Aramayı Temizle
            </Link>
          )}
        </div>

        {businesses && businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Link 
                key={business.id}
                href={`/isletme/${business.slug}`}
                className="flex items-center gap-5 bg-[#112240] p-4 rounded-[32px] border border-slate-700/50 hover:border-[#64ffda]/30 transition-all group shadow-xl"
              >
                <div className="w-24 h-24 rounded-3xl bg-slate-800 overflow-hidden shrink-0">
                  <img src={business.main_image || "https://picsum.photos/400"} alt={business.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-white font-bold text-lg truncate group-hover:text-[#64ffda] transition-colors">{business.name}</div>
                  <div className="text-slate-400 text-xs flex items-center gap-1 mt-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{business.address || 'Fethiye'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#0a192f] text-[#64ffda] text-[10px] font-bold border border-[#64ffda]/10 uppercase tracking-wider">
                      {business.business_categories?.name}
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
          <div className="py-20 text-center bg-[#112240]/50 rounded-[40px] border border-dashed border-slate-700">
            <SearchIcon className="w-16 h-16 text-slate-700 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Eşleşen Sonuç Bulunamadı</h2>
            <p className="text-slate-400 max-w-sm mx-auto mb-8">Aradığınız kelimeye uygun bir işletme bulunamadı. Lütfen başka bir kelime deneyin.</p>
          </div>
        ) : null}
      </div>

      <Footer />
    </main>
  )
}
