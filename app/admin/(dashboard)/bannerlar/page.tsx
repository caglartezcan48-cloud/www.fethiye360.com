import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Eye, EyeOff, Calendar, ArrowLeft, ArrowRight, Gauge } from 'lucide-react'
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
          <h1 className="text-2xl font-bold text-white">Reklam Afisleri</h1>
          <p className="text-slate-400 text-sm mt-1">Ana sayfada akan reklam bannerlarini yonetin</p>
        </div>
        <Link
          href="/admin/bannerlar/ekle"
          className="flex items-center gap-2 px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-lg font-medium hover:bg-[#52e0c4] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Reklam Ekle
        </Link>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <p className="text-blue-300 text-sm">
          Reklamlar ana sayfada saga-sola akarak gosterilir. Birden fazla reklam ekleyebilir, akis hizi ve yonunu ayarlayabilirsiniz.
        </p>
      </div>

      {banners && banners.length > 0 ? (
        <div className="grid gap-4">
          {banners.map((banner) => (
            <div 
              key={banner.id} 
              className="bg-[#112240] rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Banner Image */}
                <div className="relative w-full sm:w-64 h-40 sm:h-auto flex-shrink-0 bg-slate-800">
                  {banner.background_image ? (
                    <Image
                      src={banner.background_image}
                      alt={banner.alt_text || banner.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      Gorsel yok
                    </div>
                  )}
                </div>

                {/* Banner Info */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-medium text-lg">{banner.title || 'Isimsiz Reklam'}</h3>
                      {banner.link_url && (
                        <p className="text-slate-500 text-sm truncate max-w-xs">{banner.link_url}</p>
                      )}
                    </div>
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
                  </div>

                  {/* Settings Row */}
                  <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-1 text-slate-400">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-700/50 text-white text-xs font-medium">
                        {banner.display_order}
                      </span>
                      <span>Sira</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                      <Gauge className="w-4 h-4" />
                      <span>{banner.scroll_speed || 30}sn</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                      {banner.scroll_direction === 'right' ? (
                        <ArrowRight className="w-4 h-4" />
                      ) : (
                        <ArrowLeft className="w-4 h-4" />
                      )}
                      <span>{banner.scroll_direction === 'right' ? 'Saga' : 'Sola'}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {banner.start_date || banner.end_date
                          ? `${formatDate(banner.start_date)} - ${formatDate(banner.end_date)}`
                          : 'Surekli'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/50">
                    <Link
                      href={`/admin/bannerlar/${banner.id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors text-sm"
                    >
                      <Pencil className="w-4 h-4" />
                      Duzenle
                    </Link>
                    <DeleteBannerButton bannerId={banner.id} bannerTitle={banner.title} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Henuz reklam yok</h3>
          <p className="text-slate-400 mb-6">Ilk reklam afisinizi ekleyerek baslayin</p>
          <Link
            href="/admin/bannerlar/ekle"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-lg font-medium hover:bg-[#52e0c4] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Reklam Ekle
          </Link>
        </div>
      )}
    </div>
  )
}
