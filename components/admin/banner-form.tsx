'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

interface BannerFormProps {
  banner?: {
    id: string
    title: string
    subtitle: string | null
    badge_text: string | null
    button_text: string | null
    button_url: string | null
    secondary_button_text: string | null
    secondary_button_url: string | null
    background_image: string | null
    is_active: boolean
    display_order: number
    start_date: string | null
    end_date: string | null
  }
  isEditing?: boolean
}

export default function BannerForm({ banner, isEditing = false }: BannerFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    badge_text: banner?.badge_text || '',
    button_text: banner?.button_text || '',
    button_url: banner?.button_url || '',
    secondary_button_text: banner?.secondary_button_text || '',
    secondary_button_url: banner?.secondary_button_url || '',
    background_image: banner?.background_image || '',
    is_active: banner?.is_active ?? true,
    display_order: banner?.display_order ?? 1,
    start_date: banner?.start_date ? new Date(banner.start_date).toISOString().slice(0, 16) : '',
    end_date: banner?.end_date ? new Date(banner.end_date).toISOString().slice(0, 16) : '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const submitData = {
      title: formData.title,
      subtitle: formData.subtitle || null,
      badge_text: formData.badge_text || null,
      button_text: formData.button_text || null,
      button_url: formData.button_url || null,
      secondary_button_text: formData.secondary_button_text || null,
      secondary_button_url: formData.secondary_button_url || null,
      background_image: formData.background_image || null,
      is_active: formData.is_active,
      display_order: Number(formData.display_order),
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    let result
    if (isEditing && banner) {
      result = await supabase
        .from('hero_banners')
        .update(submitData)
        .eq('id', banner.id)
    } else {
      result = await supabase
        .from('hero_banners')
        .insert(submitData)
    }

    if (result.error) {
      setError(result.error.message)
      setIsSubmitting(false)
    } else {
      router.push('/admin/bannerlar')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Preview */}
      <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Onizleme</h2>
        <div className="relative h-48 rounded-lg overflow-hidden bg-slate-800">
          {formData.background_image ? (
            <img
              src={formData.background_image}
              alt="Banner onizleme"
              className="w-full h-full object-cover opacity-40"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
              <ImageIcon className="w-12 h-12" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a192f]/80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            {formData.badge_text && (
              <span className="inline-flex px-3 py-1 rounded-full bg-white/10 text-[#64ffda] text-xs mb-2">
                {formData.badge_text}
              </span>
            )}
            <h3 className="text-2xl font-bold text-white">{formData.title || 'Banner Basligi'}</h3>
            {formData.subtitle && (
              <p className="text-slate-300 text-sm mt-2 max-w-md">{formData.subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Temel Bilgiler */}
      <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Temel Bilgiler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Baslik <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
              placeholder="Ornegin: Fethiye'yi 360° Kesfet"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">Alt Baslik</label>
            <textarea
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors resize-none"
              placeholder="Banner aciklama metni"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Rozet Metni</label>
            <input
              type="text"
              name="badge_text"
              value={formData.badge_text}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
              placeholder="Ornegin: Yeni Kampanya"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Arka Plan Gorseli URL</label>
            <input
              type="url"
              name="background_image"
              value={formData.background_image}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      {/* Butonlar */}
      <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Butonlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Ana Buton Metni</label>
            <input
              type="text"
              name="button_text"
              value={formData.button_text}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
              placeholder="Ornegin: Hemen Kesfet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Ana Buton URL</label>
            <input
              type="text"
              name="button_url"
              value={formData.button_url}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
              placeholder="/kesfet veya https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Ikincil Buton Metni</label>
            <input
              type="text"
              name="secondary_button_text"
              value={formData.secondary_button_text}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
              placeholder="Ornegin: Daha Fazla Bilgi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Ikincil Buton URL</label>
            <input
              type="text"
              name="secondary_button_url"
              value={formData.secondary_button_url}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
              placeholder="#rehber veya https://..."
            />
          </div>
        </div>
      </div>

      {/* Yayin Ayarlari */}
      <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Yayin Ayarlari</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Gosterim Sirasi</label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              min={1}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1">Dusuk sayi once gosterilir</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Baslangic Tarihi</label>
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Bitis Tarihi</label>
            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-[#64ffda] focus:ring-[#64ffda] focus:ring-offset-0"
            />
            <span className="text-white font-medium">Aktif</span>
            <span className="text-slate-500 text-sm">Banner sitede gorunur olacak</span>
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/bannerlar"
          className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Geri Don
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 bg-[#64ffda] text-[#0a192f] rounded-lg font-medium hover:bg-[#52e0c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {isSubmitting ? 'Kaydediliyor...' : isEditing ? 'Guncelle' : 'Kaydet'}
        </button>
      </div>
    </form>
  )
}
