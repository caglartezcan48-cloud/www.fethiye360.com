'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Upload, Loader2, X, Image as ImageIcon } from 'lucide-react'
import { compressImage } from '@/lib/utils'
import Link from 'next/link'

interface Category {
  id: string
  name: string
}

interface Tour {
  id: string
  name: string
  slug: string
  description: string | null
  location: string | null
  category_id: string | null
  image_url: string | null
  panorama_url: string | null
  latitude: number | null
  longitude: number | null
  is_active: boolean
}

interface TourFormProps {
  categories: Category[]
  tour?: Tour
}

export default function TourForm({ categories, tour }: TourFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const panoramaInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: tour?.name || '',
    description: tour?.description || '',
    location: tour?.location || '',
    category_id: tour?.category_id || '',
    image_url: tour?.image_url || '',
    panorama_url: tour?.panorama_url || '',
    latitude: tour?.latitude?.toString() || '',
    longitude: tour?.longitude?.toString() || '',
    is_active: tour?.is_active ?? true,
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleUpload = async (file: File, type: 'image' | 'panorama') => {
    setUploading(true)
    setError(null)

    try {
      const compressedFile = await compressImage(file)
      const fileExt = file.name.split('.').pop()
      const fileName = `${type}_${Date.now()}.${fileExt}`
      const filePath = `${type}s/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(filePath, compressedFile)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(filePath)

      setForm(prev => ({
        ...prev,
        [type === 'image' ? 'image_url' : 'panorama_url']: publicUrl
      }))
    } catch (err) {
      setError('Dosya yuklenirken hata olustu')
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
      const tourData = {
        name: form.name,
        slug: generateSlug(form.name),
        description: form.description || null,
        location: form.location || null,
        category_id: form.category_id || null,
        image_url: form.image_url || null,
        panorama_url: form.panorama_url || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      }

      if (tour) {
        // Guncelle
        const { error } = await supabase
          .from('tours')
          .update(tourData)
          .eq('id', tour.id)

        if (error) throw error
      } else {
        // Yeni ekle
        const { error } = await supabase
          .from('tours')
          .insert(tourData)

        if (error) throw error
      }

      router.push('/admin/turlar')
      router.refresh()
    } catch (err) {
      setError('Tur kaydedilirken hata olustu')
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <Link
        href="/admin/turlar"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Turlara Don
      </Link>

      <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-6 space-y-6">
        {/* Temel Bilgiler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Tur Adi *</label>
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
              <option value="">Kategori Sec</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Konum</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Ornegin: Oludeniz, Fethiye"
            className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Aciklama</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors resize-none"
          />
        </div>

        {/* Koordinatlar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Enlem (Latitude)</label>
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              placeholder="36.5518"
              className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">Boylam (Longitude)</label>
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              placeholder="29.1153"
              className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#64ffda] transition-colors"
            />
          </div>
        </div>

        {/* Gorseller */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kapak Gorseli */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">Kapak Gorseli</label>
            <input
              type="file"
              ref={imageInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload(file, 'image')
              }}
              accept="image/*"
              className="hidden"
            />
            {form.image_url ? (
              <div className="relative rounded-lg overflow-hidden">
                <img src={form.image_url} alt="Kapak" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image_url: '' })}
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
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-sm">Gorsel Yukle</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* 360 Panorama */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">360° Panorama</label>
            <input
              type="file"
              ref={panoramaInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload(file, 'panorama')
              }}
              accept="image/*"
              className="hidden"
            />
            {form.panorama_url ? (
              <div className="relative rounded-lg overflow-hidden">
                <img src={form.panorama_url} alt="Panorama" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, panorama_url: '' })}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => panoramaInputRef.current?.click()}
                disabled={uploading}
                className="w-full h-40 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-[#64ffda] hover:text-[#64ffda] transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-8 h-8" />
                    <span className="text-sm">360° Gorsel Yukle</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Durum */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#64ffda]"></div>
          </label>
          <span className="text-slate-300">Tur Aktif</span>
        </div>

        {/* Hata Mesaji */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Butonlar */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 bg-[#64ffda] text-[#0a192f] font-semibold py-3 rounded-lg hover:bg-[#52e0c4] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Kaydediliyor...
              </>
            ) : tour ? (
              'Degisiklikleri Kaydet'
            ) : (
              'Turu Ekle'
            )}
          </button>
          <Link
            href="/admin/turlar"
            className="px-6 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-colors"
          >
            Iptal
          </Link>
        </div>
      </div>
    </form>
  )
}
