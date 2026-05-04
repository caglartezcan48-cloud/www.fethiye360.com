import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { MapPin, Star, Building2, Search as SearchIcon, X } from 'lucide-react'
import { CityStats } from '@/components/fethiye/city-stats'
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
      {/* Header gizlenebilir veya kucultulebilir, biz simdilik X butonuna odaklanalim */}
      
      <div className="container mx-auto px-4 pt-8 pb-10">
        {/* Ust Kontrol Cubugu */}
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#0a192f]/90 backdrop-blur-md py-4 z-50 border-b border-slate-700/50">
          <div>
            <h1 className="text-xl font-bold text-white">
              {query ? `"${query}" Sonuçları` : 'Keşfet'}
            </h1>
            <p className="text-slate-500 text-xs">{businesses.length} işletme bulundu</p>
          </div>
          <Link 
            href="/" 
            className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white hover:bg-red-500 transition-all shadow-xl group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          </Link>
        </div>

        {/* Akilli Bilgi Kartlari */}
        {(query.toLowerCase().includes('ecz') || query.toLowerCase().includes('hav')) && (
          <div className="mb-8">
            <CityStats />
          </div>
        )}

        {businesses && businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map((business) => (
              <Link 
                key={business.id}
                href={`/isletme/${business.slug}`}
                className="flex items-center gap-4 bg-[#112240] p-4 rounded-3xl border border-slate-700/50 hover:border-[#64ffda]/30 transition-all group"
              >
                <div className="w-20 h-20 rounded-2xl bg-slate-800 overflow-hidden shrink-0">
                  <img src={business.main_image || "https://picsum.photos/200"} alt={business.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-white font-bold truncate group-hover:text-[#64ffda] transition-colors">{business.name}</div>
                  <div className="text-slate-400 text-[10px] flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{business.address || 'Fethiye'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-[#0a192f] text-[#64ffda] text-[9px] font-bold border border-[#64ffda]/10">
                      {business.business_categories?.name}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold">
                      <Star className="w-3 h-3 fill-yellow-500" />
                      {business.rating || '5.0'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-[#112240] rounded-3xl border border-dashed border-slate-700">
            <SearchIcon className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h2 className="text-white font-bold mb-2">Sonuç Bulunamadı</h2>
            <Link href="/" className="text-[#64ffda] text-sm hover:underline">Aramayı Temizle ve Dön</Link>
          </div>
        )}
      </div>

      {/* Mobilde Footer kafa karistirabilir, arama sayfasinda basit tutalim */}
    </main>
  )
}
