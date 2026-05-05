import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/fethiye/header'
import { Hero } from '@/components/fethiye/hero'
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

export default async function DiscoveryPage({
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
  } else {
    // Arama yoksa tum kategorileri ve isletme sayılarını getir
    const { data: catData } = await supabase
      .from('business_categories')
      .select(`
        *,
        businesses (count)
      `)
      .order('name')
    categories = catData || []
  }

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />
      
      {/* Hero Section */}
      <div className="relative">
        <Hero />
      </div>
      
      <div className="container mx-auto px-4 pb-24 -mt-16 relative z-20">
        <div className="bg-[#112240]/90 backdrop-blur-2xl rounded-[48px] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.7)] p-8 md:p-12 overflow-hidden relative">
          {/* Decorative Gradient Background inside the container */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#64ffda]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#64ffda]/10 border border-[#64ffda]/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#64ffda]" />
                <span className="text-[#64ffda] text-[10px] font-bold uppercase tracking-widest">Şehir Rehberi</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                {query ? `"${query}" Sonuçları` : 'Kategorilere Göz At'}
              </h1>
              <p className="text-slate-400 mt-3 text-lg">
                {query ? `${businesses.length} kayıt bulundu` : 'Fethiye\'nin tüm zenginliklerini keşfedin'}
              </p>
            </div>
            {query && (
              <Link href="/kesfet" className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-sm font-bold transition-all border border-white/10 flex items-center gap-2 group">
                <SearchIcon className="w-4 h-4 text-[#64ffda]" />
                Tüm Kategorilere Dön
              </Link>
            )}
          </div>

          {/* CONTENT SECTION */}
          <div className="relative z-10">
            {query ? (
              // SEARCH RESULTS VIEW
              businesses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.map((business) => (
                    <Link 
                      key={business.id}
                      href={`/isletme/${business.slug}`}
                      className="flex items-center gap-5 bg-white/5 p-4 rounded-[32px] border border-white/5 hover:border-[#64ffda]/40 hover:bg-white/10 transition-all group"
                    >
                      <div className="w-24 h-24 rounded-3xl bg-slate-800 overflow-hidden shrink-0 border border-white/5 relative">
                        <img src={business.main_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"} alt={business.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-white font-bold text-lg truncate group-hover:text-[#64ffda] transition-colors">{business.name}</div>
                        <div className="text-slate-400 text-xs flex items-center gap-1.5 mt-2 mb-4">
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
              ) : (
                <div className="py-32 text-center">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                    <SearchIcon className="w-10 h-10 text-slate-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Eşleşen Kayıt Yok</h2>
                  <p className="text-slate-500 max-w-sm mx-auto text-lg">Aradığınız kriterlere uygun bir işletme bulunamadı. Lütfen farklı bir anahtar kelime deneyin.</p>
                </div>
              )
            ) : (
              // CATEGORY GRID VIEW (Rehber Modu)
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/kesfet/${category.slug}`}
                    className="group relative p-6 md:p-8 bg-white/5 rounded-[40px] border border-white/5 hover:border-[#64ffda]/40 hover:bg-[#64ffda]/5 transition-all overflow-hidden"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#64ffda]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-[#64ffda] mb-6 group-hover:scale-110 group-hover:bg-[#64ffda]/10 transition-all">
                        {getCategoryIcon(category.name)}
                      </div>
                      <h3 className="text-white font-bold text-xl mb-2 group-hover:text-[#64ffda] transition-colors">
                        {category.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                          {category.businesses[0]?.count || 0} İşletme
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-[#64ffda] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
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
