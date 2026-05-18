'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save, ArrowLeft, Upload, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface BannerFormProps {
  banner?: {
    id: string
    title: string
    subtitle: string | null
    background_image: string | null
    is_active: boolean
    display_order: number
    scroll_speed: number
    scroll_direction: string
    link_url: string | null
    alt_text: string | null
    start_date: string | null
    end_date: string | null
  }
  isEditing?: boolean
}

export default function BannerForm({ banner, isEditing = false }: BannerFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    background_image: banner?.background_image || '',
    is_active: banner?.is_active ?? true,
    display_order: banner?.display_order ?? 1,
    scroll_speed: banner?.scroll_speed ?? 30,
    scroll_direction: banner?.scroll_direction || 'left',
    link_url: banner?.link_url || '',
    alt_text: banner?.alt_text || '',
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Yukleme basarisiz')
      }

      setFormData(prev => ({
        ...prev,
        background_image: result.url
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yukleme sirasinda hata olustu')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, background_image: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.background_image) {
      setError('Lutfen bir gorsel yukleyin')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const submitData = {
      title: formData.title || 'Banner',
      subtitle: formData.subtitle || null,
      background_image: formData.background_image,
      is_active: formData.is_active,
      display_order: Number(formData.display_order),
      scroll_speed: Number(formData.scroll_speed),
      scroll_direction: formData.scroll_direction,
      link_url: formData.link_url || null,
      alt_text: formData.alt_text || formData.title || null,
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

      {/* Gorsel Yukleme */}
      <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Reklam Gorseli</h2>
        
        {formData.background_image ? (
          <div className="relative">
            <div className="relative h-48 rounded-lg overflow-hidden bg-slate-800">
              <Image
                src={formData.background_image}
                alt="Banner onizleme"
                fill
                className="object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-2 bg-red-500/80 rounded-full text-white hover:bg-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-xs text-slate-500 mt-2 truncate">{formData.background_image}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-[#64ffda] transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-[#64ffda] animate-spin" />
                  <span className="text-slate-400 mt-2">Yukleniyor...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-10 h-10 text-slate-500" />
                  <span className="text-slate-400 mt-2">Gorsel yuklemek icin tiklayin</span>
                  <span className="text-slate-500 text-xs mt-1">JPEG, PNG, WebP, GIF, AVIF - Max 5MB</span>
                </div>
              )}
            </label>

            <div className="flex items-center gap-4 my-2">
              <div className="h-[1px] flex-1 bg-slate-700/50"></div>
              <span className="text-slate-500 text-xs uppercase font-semibold tracking-wider">VEYA GÖRSEL URL'Sİ YAPIŞTIRIN</span>
              <div className="h-[1px] flex-1 bg-slate-700/50"></div>
            </div>

            <div>
              <input
                type="text"
                placeholder="https://example.com/resim.jpg"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors text-sm"
                value={formData.background_image}
                onChange={(e) => setFormData(prev => ({ ...prev, background_image: e.target.value }))}
              />
              <p className="text-xs text-slate-500 mt-1">
                İnternetteki herhangi bir görselin adresini (linkini) buraya doğrudan yapıştırabilirsiniz.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Temel Bilgiler */}
      <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Reklam Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Reklam Adi (Dahili kullanim)
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
              placeholder="Ornegin: Yaz Kampanyasi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tiklaninca Gidilecek URL</label>
            <input
              type="url"
              name="link_url"
              value={formData.link_url}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
              placeholder="https://example.com veya /sayfa"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">Alt Metin (SEO icin)</label>
            <input
              type="text"
              name="alt_text"
              value={formData.alt_text}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
              placeholder="Gorsel aciklamasi"
            />
          </div>
        </div>
      </div>

      {/* Akis Ayarlari */}
      <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Akis Ayarlari</h2>
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Akis Hizi (saniye)</label>
            <input
              type="number"
              name="scroll_speed"
              value={formData.scroll_speed}
              onChange={handleChange}
              min={5}
              max={120}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1">5-120 arasi (dusuk = hizli)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Akis Yonu</label>
            <select
              name="scroll_direction"
              value={formData.scroll_direction}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#64ffda] transition-colors"
            >
              <option value="left">Sola dogru</option>
              <option value="right">Saga dogru</option>
            </select>
          </div>
        </div>
      </div>

      {/* Yayin Ayarlari */}
      <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Yayin Ayarlari</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <span className="text-slate-500 text-sm">Reklam sitede gorunur olacak</span>
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
          disabled={isSubmitting || isUploading}
          className="flex items-center gap-2 px-6 py-3 bg-[#64ffda] text-[#0a192f] rounded-lg font-medium hover:bg-[#52e0c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {isSubmitting ? 'Kaydediliyor...' : isEditing ? 'Guncelle' : 'Kaydet'}
        </button>
      </div>
    </form>
  )
}
