import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { MapPin, Star, Building2, Search as SearchIcon, ArrowLeft } from 'lucide-react'
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
      <Header />
      
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-[#64ffda] hover:text-[#0a192f] transition-all shadow-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {query ? `"${query}" Sonuçları` : 'Tüm İşletmeler'}
            </h1>
            <p className="text-slate-500 text-xs">{businesses.length} sonuç listeleniyor</p>
          </div>
        </div>

        {/* Akilli Bilgi Kartlari (Daha kucuk) */}
        {(query.toLowerCase().includes('ecz') || query.toLowerCase().includes('hav')) && (
          <div className="mb-8 scale-95 origin-left">
            <CityStats />
          </div>
        )}

        {businesses && businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map((business) => (
              <Link 
                key={business.id}
                href={`/isletme/${business.slug}`}
                className="flex items-center gap-4 bg-[#112240] p-3 rounded-2xl border border-slate-700/50 hover:border-[#64ffda]/30 transition-all group"
              >
                <div className="w-20 h-20 rounded-xl bg-slate-800 overflow-hidden shrink-0">
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
          <div className="py-20 text-center">
            <h2 className="text-white font-bold mb-4">Sonuç Bulunamadı</h2>
            <Link href="/" className="text-[#64ffda] text-sm hover:underline">Ana Sayfaya Dön</Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
