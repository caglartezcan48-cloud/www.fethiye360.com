import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Building2, Pencil, Trash2, Star, CheckCircle2, Database } from 'lucide-react'

export default async function BusinessesPage() {
  const supabase = await createClient()

  const { data: businesses } = await supabase
    .from('businesses')
    .select(`
      id,
      name,
      slug,
      rating,
      is_featured,
      created_at,
      business_categories (name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">İşletmeler</h1>
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

      {businesses && businesses.length > 0 ? (
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
                      <span className="text-slate-500 text-xs text-xs font-medium">Standart</span>
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
      ) : (
        <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Henüz işletme yok</h3>
          <p className="text-slate-400 mb-6">İlk işletmenizi ekleyerek rehberi oluşturmaya başlayın</p>
          <Link
            href="/admin/isletmeler/ekle"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-lg font-medium hover:bg-[#52e0c4] transition-colors"
          >
            <Plus className="w-5 h-5" />
            İlk İşletmeyi Ekle
          </Link>
        </div>
      )}
    </div>
  )
}
