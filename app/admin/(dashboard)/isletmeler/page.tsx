import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Building2, Pencil, Trash2, Star, CheckCircle2, Database, ChevronLeft, ChevronRight } from 'lucide-react'
import { BusinessFilters } from '@/components/admin/business-filters'

const PAGE_SIZE = 50

export default async function BusinessesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ category?: string, q?: string, page?: string }> 
}) {
  const supabase = await createClient()
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  
  // Kategorileri ve her kategorideki isletme sayisini cek
  const { data: categoryStats } = await supabase
    .from('business_categories')
    .select('id, name, businesses(count)')
    .order('name')

  // Isletmeleri sorgula
  let query = supabase
    .from('businesses')
    .select(`
      id,
      name,
      slug,
      rating,
      is_featured,
      created_at,
      business_categories (id, name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  // Filtreleri uygula
  if (params.category) {
    query = query.eq('category_id', params.category)
  }
  
  if (params.q) {
    query = query.ilike('name', `%${params.q}%`)
  }

  // Sayfalama uygula
  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data: businesses, count } = await query.range(from, to)

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">İşletme Yönetimi</h1>
          <p className="text-slate-500 text-sm mt-1">Sistemde toplam <span className="text-[#64ffda] font-bold">{count || 0}</span> işletme kayıtlı.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/isletmeler/toplu-yukle"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <Database className="w-4 h-4" />
            Toplu İşletme Yükle
          </Link>
          <Link
            href="/admin/isletmeler/ekle"
            className="flex items-center gap-2 px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-lg font-medium hover:bg-[#52e0c4] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni İşletme Ekle
          </Link>
        </div>
      </div>

      {/* Kategori İstatistikleri */}
      <div className="bg-[#112240]/50 p-6 rounded-2xl border border-slate-700/30">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Kategori Dağılımı</h3>
        <div className="flex flex-wrap gap-2">
          {categoryStats?.map((cat: any) => {
            const bizCount = cat.businesses?.[0]?.count || 0
            if (bizCount === 0) return null
            
            const isActive = params.category === cat.id

            return (
              <Link 
                key={cat.id}
                href={`/admin/isletmeler?category=${cat.id}`}
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-full transition-all hover:scale-105 active:scale-95 ${
                  isActive 
                    ? 'bg-[#64ffda]/10 border-[#64ffda] text-[#64ffda]' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span className="text-xs font-medium">{cat.name}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border ${
                  isActive 
                    ? 'bg-[#64ffda] text-[#0a192f] border-transparent' 
                    : 'bg-[#64ffda]/10 text-[#64ffda] border-[#64ffda]/20'
                }`}>
                  {bizCount}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      <BusinessFilters categories={categoryStats?.map(c => ({ id: c.id, name: c.name })) || []} />

      {businesses && businesses.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-[#112240] rounded-xl border border-slate-700/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700/30">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-slate-300">İşletme</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-300">Kategori</th>
                  <th className="text-center p-4 text-sm font-medium text-slate-300">Puan</th>
                  <th className="text-center p-4 text-sm font-medium text-slate-300">Durum</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-300">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {businesses.map((business) => (
                  <tr key={business.id} className="hover:bg-slate-700/20">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-[#64ffda]">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <span className="text-white font-medium">{business.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">
                      {business.business_categories?.name || '-'}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        {business.rating || 0}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {business.is_featured ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#64ffda]/20 text-[#64ffda] text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Öne Çıkan
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs font-medium">Standart</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/isletmeler/${business.id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sayfalama Kontrolleri */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-4">
              <Link
                href={`/admin/isletmeler?page=${currentPage - 1}${params.category ? `&category=${params.category}` : ''}${params.q ? `&q=${params.q}` : ''}`}
                className={`p-2 rounded-lg border border-slate-700 text-white transition-colors ${currentPage <= 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-slate-800'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              
              <span className="text-slate-400 text-sm font-medium">
                Sayfa <span className="text-white">{currentPage}</span> / {totalPages}
              </span>

              <Link
                href={`/admin/isletmeler?page=${currentPage + 1}${params.category ? `&category=${params.category}` : ''}${params.q ? `&q=${params.q}` : ''}`}
                className={`p-2 rounded-lg border border-slate-700 text-white transition-colors ${currentPage >= totalPages ? 'opacity-30 pointer-events-none' : 'hover:bg-slate-800'}`}
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {(params.category || params.q) ? 'Sonuç bulunamadı' : 'Henüz işletme yok'}
          </h3>
          <p className="text-slate-400 mb-6">
            {(params.category || params.q) 
              ? 'Filtreleri değiştirerek tekrar deneyebilirsiniz.' 
              : 'İlk işletmenizi ekleyerek rehberi oluşturmaya başlayın'}
          </p>
          {!params.category && !params.q ? (
            <Link
              href="/admin/isletmeler/ekle"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-lg font-medium hover:bg-[#52e0c4] transition-colors"
            >
              <Plus className="w-5 h-5" />
              İlk İşletmeyi Ekle
            </Link>
          ) : (
            <Link
              href="/admin/isletmeler"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
              Filtreleri Temizle
            </Link>
          )}
        </div>
      )}
    </div>
  )
}


