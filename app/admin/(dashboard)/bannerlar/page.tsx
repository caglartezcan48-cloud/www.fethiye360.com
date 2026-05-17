import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Image as ImageIcon, Pencil, Eye, EyeOff, Calendar } from 'lucide-react'
import DeleteBannerButton from '@/components/admin/delete-banner-button'

export default async function BannersPage() {
  const supabase = await createClient()

  const { data: banners } = await supabase
    .from('hero_banners')
    .select('*')
    .order('display_order', { ascending: true })

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Banner Yonetimi</h1>
          <p className="text-slate-400 text-sm mt-1">Ana sayfa hero alanindaki reklam bannerlarini yonetin</p>
        </div>
        <Link
          href="/admin/bannerlar/ekle"
          className="flex items-center gap-2 px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-lg font-medium hover:bg-[#52e0c4] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Banner Ekle
        </Link>
      </div>

      {banners && banners.length > 0 ? (
        <div className="bg-[#112240] rounded-xl border border-slate-700/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/30">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-300">Banner</th>
                <th className="text-left p-4 text-sm font-medium text-slate-300">Baslik</th>
                <th className="text-center p-4 text-sm font-medium text-slate-300">Sira</th>
                <th className="text-center p-4 text-sm font-medium text-slate-300">Tarih Araligi</th>
                <th className="text-center p-4 text-sm font-medium text-slate-300">Durum</th>
                <th className="text-right p-4 text-sm font-medium text-slate-300">Islemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-slate-700/20">
                  <td className="p-4">
                    <div className="w-24 h-14 rounded-lg bg-slate-700 overflow-hidden">
                      {banner.background_image ? (
                        <img
                          src={banner.background_image}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <span className="text-white font-medium block">{banner.title}</span>
                      {banner.badge_text && (
                        <span className="text-xs text-[#64ffda]">{banner.badge_text}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700/50 text-white font-medium">
                      {banner.display_order}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-300 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {banner.start_date || banner.end_date
                          ? `${formatDate(banner.start_date)} - ${formatDate(banner.end_date)}`
                          : 'Surekli'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        banner.is_active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {banner.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {banner.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/bannerlar/${banner.id}`}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteBannerButton bannerId={banner.id} bannerTitle={banner.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Henuz banner yok</h3>
          <p className="text-slate-400 mb-6">Ilk reklam bannerinizi ekleyerek baslayin</p>
          <Link
            href="/admin/bannerlar/ekle"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-lg font-medium hover:bg-[#52e0c4] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Banner Ekle
          </Link>
        </div>
      )}
    </div>
  )
}
