import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, MapPin, Eye, Pencil, Trash2 } from 'lucide-react'
import DeleteTourButton from '@/components/admin/delete-tour-button'

export default async function ToursPage() {
  const supabase = await createClient()

  const { data: tours } = await supabase
    .from('tours')
    .select(`
      id,
      name,
      slug,
      location,
      image_url,
      view_count,
      is_active,
      created_at,
      categories (name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Turlar</h1>
        <Link
          href="/admin/turlar/ekle"
          className="flex items-center gap-2 px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-lg font-medium hover:bg-[#52e0c4] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Tur Ekle
        </Link>
      </div>

      {tours && tours.length > 0 ? (
        <div className="bg-[#112240] rounded-xl border border-slate-700/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/30">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-300">Tur</th>
                <th className="text-left p-4 text-sm font-medium text-slate-300">Kategori</th>
                <th className="text-left p-4 text-sm font-medium text-slate-300">Konum</th>
                <th className="text-center p-4 text-sm font-medium text-slate-300">Goruntulenme</th>
                <th className="text-center p-4 text-sm font-medium text-slate-300">Durum</th>
                <th className="text-right p-4 text-sm font-medium text-slate-300">Islemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {tours.map((tour) => (
                <tr key={tour.id} className="hover:bg-slate-700/20">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-700 overflow-hidden">
                        {tour.image_url ? (
                          <img
                            src={tour.image_url}
                            alt={tour.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <MapPin className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <span className="text-white font-medium">{tour.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">
                    {tour.categories?.name || '-'}
                  </td>
                  <td className="p-4 text-slate-300">{tour.location || '-'}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-300">
                      <Eye className="w-4 h-4" />
                      {tour.view_count || 0}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        tour.is_active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {tour.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/turlar/${tour.id}`}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteTourButton tourId={tour.id} tourName={tour.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-12 text-center">
          <MapPin className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Henuz tur yok</h3>
          <p className="text-slate-400 mb-6">Ilk sanal turunuzu ekleyerek baslayın</p>
          <Link
            href="/admin/turlar/ekle"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-lg font-medium hover:bg-[#52e0c4] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Tur Ekle
          </Link>
        </div>
      )}
    </div>
  )
}
