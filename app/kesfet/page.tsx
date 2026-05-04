import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/fethiye/header'
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
  const query = ara || ''

  // Isletmeleri arayalim (Hem isimden hem kategoriden)
  let supabaseQuery = supabase
    .from('businesses')
    .select(`
      *,
      business_categories!inner (name)
    `)

  if (query) {
    // Isim veya Kategori ismi sorguyla eslesiyorsa getir
    supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,business_categories.name.ilike.%${query}%`)
  }

  const { data: businesses } = await supabaseQuery.order('is_featured', { ascending: false })

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />

      <div className="container mx-auto px-4 pt-32 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {query ? `"${query}" için sonuçlar` : 'Fethiye\'yi Keşfet'}
            </h1>
            <p className="text-slate-400">
              {businesses?.length || 0} işletme bulundu
            </p>
          </div>
        </div>

        {/* Results Grid */}
        {businesses && businesses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businesses.map((business) => (
              <Link
                key={business.id}
                href={`/isletme/${business.slug}`}
                className="group bg-[#112240] rounded-2xl border border-slate-700/50 overflow-hidden hover:border-[#64ffda]/50 transition-all hover:-translate-y-1 shadow-xl"
              >
                {/* Image Container */}
                <div className="relative h-48 bg-slate-800">
                  {business.main_image ? (
                    <img
                      src={business.main_image}
                      alt={business.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Building2 className="w-12 h-12" />
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#0a192f]/80 backdrop-blur-md border border-[#64ffda]/20 text-[#64ffda] text-xs font-medium">
                      {business.business_categories?.name}
                    </span>
                  </div>
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md text-yellow-500 text-xs font-bold">
                      <Star className="w-3 h-3 fill-yellow-500" />
                      {business.rating || '0.0'}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#64ffda] transition-colors line-clamp-1">
                    {business.name}
                  </h3>
                  <div className="flex items-start gap-2 text-slate-400 text-sm mb-4">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{business.address || 'Fethiye, Muğla'}</span>
                  </div>

                  <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
                    <span className="text-xs text-slate-500">İncele</span>
                    <div className="w-8 h-8 rounded-full bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda] group-hover:bg-[#64ffda] group-hover:text-[#0a192f] transition-all">
                      <SearchIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[#112240] rounded-3xl border border-slate-700/50 p-20 text-center">
            <SearchIcon className="w-16 h-16 text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Sonuç Bulunamadı</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Aradığınız kelimeye uygun bir işletme henüz eklenmemiş olabilir. Farklı bir kelime deneyebilir veya tüm kategorilere göz atabilirsiniz.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 bg-[#64ffda] text-[#0a192f] rounded-xl font-bold hover:bg-[#52e0c4] transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
