'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Upload, Loader2, X, Image as ImageIcon, Building2, MapPin, Phone, Globe, Clock, Star } from 'lucide-react'
import { compressImage } from '@/lib/utils'
import { saveBusiness } from '@/lib/actions/business'
import Link from 'next/link'

interface Category {
  id: string
  name: string
}

interface Business {
  id: string
  name: string
  slug: string
  description: string | null
  category_id: string | null
  address: string | null
  phone: string | null
  whatsapp: string | null
  website: string | null
  opening_hours: any
  location_lat: number | null
  location_lng: number | null
  is_featured: boolean
  main_image: string | null
  images: string[]
  services: string[]
}

interface BusinessFormProps {
  categories: Category[]
  business?: Business
}

export default function BusinessForm({ categories, business }: BusinessFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: business?.name || '',
    description: business?.description || '',
    category_id: business?.category_id || '',
    address: business?.address || '',
    phone: business?.phone || '',
    whatsapp: business?.whatsapp || '',
    website: business?.website || '',
    location_lat: business?.location_lat?.toString() || '',
    location_lng: business?.location_lng?.toString() || '',
    is_featured: business?.is_featured ?? false,
    main_image: business?.main_image || '',
    images: business?.images || [],
    services: business?.services?.join(', ') || '',
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    setError(null)

    try {
      const compressedFile = await compressImage(file)
      const fileExt = file.name.split('.').pop()
      const fileName = `business_${Date.now()}.${fileExt}`
      const filePath = `businesses/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('tour-images') // Mevcut bucket'ı kullanıyoruz
        .upload(filePath, compressedFile)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(filePath)

      setForm(prev => ({
        ...prev,
        main_image: publicUrl
      }))
    } catch (err) {
      setError('Dosya yüklenirken hata oluştu')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const businessData = {
        name: form.name,
        slug: generateSlug(form.name),
        description: form.description || null,
        category_id: form.category_id || null,
        address: form.address || null,
        phone: form.phone || null,
        whatsapp: form.whatsapp || null,
        website: form.website || null,
        location_lat: form.location_lat ? parseFloat(form.location_lat) : null,
        location_lng: form.location_lng ? parseFloat(form.location_lng) : null,
        is_featured: form.is_featured,
        main_image: form.main_image || null,
        services: form.services.split(',').map(s => s.trim()).filter(s => s !== ''),
        updated_at: new Date().toISOString(),
      }

      const result = await saveBusiness(businessData, business?.id)

      if (!result.success) {
        throw new Error(result.error)
      }

      router.push('/admin/isletmeler')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'İşletme kaydedilirken hata oluştu')
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl pb-12">
      <Link
        href="/admin/isletmeler"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        İşletmelere Dön
      </Link>

      <div className="space-y-6">
        {/* Temel Bilgiler */}
        <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#64ffda]" /> Temel Bilgiler
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2">İşletme Adı *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Kategori</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors"
              >
                <option value="">Kategori Seç</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Açıklama</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors resize-none"
              placeholder="İşletme hakkında kısa bilgi..."
            />
          </div>
        </div>

        {/* İletişim & Konum */}
        <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#64ffda]" /> İletişim & Konum
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Adres</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Telefon</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2">WhatsApp</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="905XXXXXXXXX"
                className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Web Sitesi</label>
              <input
                type="text"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://..."
                className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Harita Enlem (Latitude)</label>
              <input
                type="text"
                value={form.location_lat}
                onChange={(e) => setForm({ ...form, location_lat: e.target.value })}
                placeholder="Örn: 36.6234"
                className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Harita Boylam (Longitude)</label>
              <input
                type="text"
                value={form.location_lng}
                onChange={(e) => setForm({ ...form, location_lng: e.target.value })}
                placeholder="Örn: 29.1164"
                className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Görsel & Özellikler */}
        <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#64ffda]" /> Görsel & Özellikler
          </h2>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Ana Görsel</label>
            <input
              type="file"
              ref={imageInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload(file)
              }}
              accept="image/*"
              className="hidden"
            />
            {form.main_image ? (
              <div className="relative rounded-lg overflow-hidden w-full max-w-md">
                <img src={form.main_image} alt="Kapak" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, main_image: '' })}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploading}
                className="w-full h-40 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-[#64ffda] hover:text-[#64ffda] transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-8 h-8" />
                    <span className="text-sm">Görsel Yükle</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Hizmetler / Etiketler (Virgülle ayırın)</label>
            <input
              type="text"
              value={form.services}
              onChange={(e) => setForm({ ...form, services: e.target.value })}
              placeholder="Otopark, Kredi Kartı, WiFi..."
              className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#64ffda]"></div>
            </label>
            <span className="text-slate-300">Öne Çıkan İşletme</span>
          </div>
        </div>

        {/* Butonlar */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 bg-[#64ffda] text-[#0a192f] font-semibold py-4 rounded-lg hover:bg-[#52e0c4] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Kaydediliyor...
              </>
            ) : business ? (
              'Değişiklikleri Kaydet'
            ) : (
              'İşletmeyi Ekle'
            )}
          </button>
          <Link
            href="/admin/isletmeler"
            className="px-8 py-4 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-colors flex items-center"
          >
            İptal
          </Link>
        </div>
      </div>
    </form>
  )
}
