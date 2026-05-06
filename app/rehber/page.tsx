import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { 
  MapPin, Star, Building2, Search as SearchIcon, 
  Utensils, Bed, Pill, Car, Camera, Coffee, 
  ShoppingBag, Waves, Briefcase, GraduationCap,
  Hammer, ChevronRight
} from 'lucide-react'
import Link from 'next/link'

// Kategori ikon eslestirme
const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('restoran') || n.includes('yemek')) return <Utensils className="w-6 h-6" />
  if (n.includes('otel') || n.includes('konaklama')) return <Bed className="w-6 h-6" />
  if (n.includes('eczane') || n.includes('saglik')) return <Pill className="w-6 h-6" />
  if (n.includes('oto') || n.includes('tamir')) return <Car className="w-6 h-6" />
  if (n.includes('gezi') || n.includes('tur')) return <Camera className="w-6 h-6" />
  if (n.includes('kafe') || n.includes('coffee')) return <Coffee className="w-6 h-6" />
  if (n.includes('market') || n.includes('alisveris')) return <ShoppingBag className="w-6 h-6" />
  if (n.includes('plaj') || n.includes('deniz')) return <Waves className="w-6 h-6" />
  if (n.includes('hizmet') || n.includes('profesyonel')) return <Briefcase className="w-6 h-6" />
  if (n.includes('egitim')) return <GraduationCap className="w-6 h-6" />
  if (n.includes('insaat') || n.includes('yapi')) return <Hammer className="w-6 h-6" />
  return <Building2 className="w-6 h-6" />
}

export default async function BusinessDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ ara?: string }>
}) {
  const supabase = await createClient()
  const { ara } = await searchParams
  const query = ara ? decodeURIComponent(ara) : ''

  let businesses: any[] = []
  let categories: any[] = []

  if (query) {
    const { data: matchedCategories } = await supabase
      .from('business_categories')
      .select('id')
      .or(`name.ilike.%${query}%,name.ilike.%${query.replace('İ', 'i').replace('I', 'ı')}%`)

    const categoryIds = matchedCategories?.map(c => c.id) || []

    let dbQuery = supabase
      .from('businesses')
      .select(`*, business_categories (name)`)

    if (categoryIds.length > 0) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,category_id.in.(${categoryIds.join(',')})`)
    } else {
      dbQuery = dbQuery.ilike('name', `%${query}%`)
    }

    const { data } = await dbQuery.order('is_featured', { ascending: false })
    businesses = data || []
  } else {
    const { data: catData } = await supabase
      .from('business_categories')
      .select(`*, businesses (count)`)
      .order('name')
    categories = catData || []
  }

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />
      
      <div className="pt-32 container mx-auto px-4 pb-24">
        <div className="bg-[#112240]/90 backdrop-blur-2xl rounded-[48px] border border-white/10 p-8 md:p-12 overflow-hidden relative shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#64ffda]/10 border border-[#64ffda]/20 mb-4">
                <span className="text-[#64ffda] text-[10px] font-bold uppercase tracking-widest">Şehir Rehberi</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                {query ? `"${query}" Sonuçları` : 'İşletme Rehberi'}
              </h1>
            </div>
            {query && (
              <Link href="/rehber" className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/10">
                Tüm Rehbere Dön
              </Link>
            )}
          </div>

          <div className="relative z-10">
            {query ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => (
                  <Link 
                    key={business.id}
                    href={`/isletme/${business.slug}`}
                    className="flex items-center gap-5 bg-white/5 p-4 rounded-[32px] border border-white/5 hover:border-[#64ffda]/40 hover:bg-white/10 transition-all group"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-slate-800 overflow-hidden shrink-0 border border-white/5 relative">
                      <img src={business.main_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"} alt={business.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-white font-bold truncate group-hover:text-[#64ffda] transition-colors">{business.name}</div>
                      <div className="text-slate-400 text-[10px] flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3 h-3 text-[#64ffda]/50" />
                        <span className="truncate">{business.address || 'Fethiye'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/rehber/${category.slug}`}
                    className="group relative p-6 bg-white/5 rounded-[40px] border border-white/5 hover:border-[#64ffda]/40 hover:bg-[#64ffda]/5 transition-all overflow-hidden"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#64ffda] mb-4 group-hover:scale-110 transition-all">
                      {getCategoryIcon(category.name)}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1 group-hover:text-[#64ffda] transition-colors">
                      {category.name}
                    </h3>
                    <span className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">
                      {category.businesses[0]?.count || 0} İşletme
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
