import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { MapPin, Star, Building2, Search as SearchIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CategoryDiscoveryPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()

  // Once kategoriyi bulalim
  const { data: category } = await supabase
    .from('business_categories')
    .select('*')
    .eq('slug', params.slug)
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

      <div className="container mx-auto px-4 pt-32 pb-20">
        {/* Breadcrumb / Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-[#64ffda] mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Ana Sayfaya Dön
        </Link>

        {/* Category Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {category.name}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Fethiye'deki en iyi {category.name.toLowerCase()} listesini keşfedin,
            puanlarını inceleyin ve rotanızı oluşturun.
          </p>
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
                  {business.is_featured && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-[#64ffda] text-[#0a192f] text-xs font-bold shadow-lg">
                        ÖNE ÇIKAN
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#64ffda] transition-colors line-clamp-1">
                    {business.name}
                  </h3>
                  <div className="flex items-start gap-2 text-slate-400 text-sm mb-4">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{business.address || 'Fethiye, Muğla'}</span>
                  </div>

                  <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                      <Star className="w-4 h-4 fill-yellow-500" />
                      {business.rating || '0.0'}
                    </div>
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
            <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Henüz İşletme Yok</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Bu kategoride henüz bir işletme kaydı bulunmuyor. Yakında eklenecektir!
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
