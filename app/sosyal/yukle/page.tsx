'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { 
  Camera, 
  Upload, 
  X, 
  Loader2, 
  ArrowLeft, 
  Send, 
  Image as ImageIcon,
  MapPin,
  Sparkles,
  Video
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

export default function UploadPostPage() {
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setMediaType(selectedFile.type.startsWith('video') ? 'video' : 'image')
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Giriş yapmalısınız')

      // 1. Dosyayi Storage'a Yükle
      const fileExt = file.name.split('.').pop()
      const fileName = `post_${user.id}_${Date.now()}.${fileExt}`
      const filePath = `posts/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(filePath)

      // 2. Veritabanına Kaydet
      const { error: dbError } = await supabase
        .from('user_posts')
        .insert([{
          user_id: user.id,
          image_url: publicUrl, // URL alanı hala image_url ama video da tutabilir
          media_type: mediaType,
          caption: caption,
          location: location,
        }])

      if (dbError) throw dbError

      toast.success('Paylaşımınız başarıyla yayınlandı! ✨')
      router.push('/profil')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      toast.error('Yükleme başarısız oldu')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a192f] p-6 relative overflow-hidden selection:bg-[#64ffda]/30">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#64ffda]/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-xl mx-auto pt-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-bold uppercase tracking-widest text-xs">Vazgeç</span>
        </button>

        <header className="mb-12">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic flex items-center gap-4">
            Yeni Paylaşım
            <div className="p-3 bg-[#64ffda]/10 rounded-2xl">
              {mediaType === 'video' ? <Video className="w-8 h-8 text-[#64ffda]" /> : <Camera className="w-8 h-8 text-[#64ffda]" />}
            </div>
          </h1>
          <p className="text-slate-400 font-medium">Fethiye'nin anlarını fotoğraf veya video ile ölümsüzleştir.</p>
        </header>

        <form onSubmit={handleUpload} className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          
          {/* Media Upload Area */}
          <div 
            onClick={() => !preview && fileInputRef.current?.click()}
            className={`relative aspect-square rounded-[48px] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer ${
              preview 
                ? 'border-transparent shadow-2xl' 
                : 'border-white/10 bg-white/5 hover:border-[#64ffda]/40 hover:bg-[#64ffda]/5 group'
            }`}
          >
            {preview ? (
              <>
                {mediaType === 'video' ? (
                  <video src={preview} className="w-full h-full object-cover" autoPlay muted loop />
                ) : (
                  <Image src={preview} alt="Önizleme" fill className="object-cover" />
                )}
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}
                  className="absolute top-6 right-6 p-4 bg-red-500 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform z-10"
                >
                  <X className="w-6 h-6" />
                </button>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto group-hover:scale-110 transition-all group-hover:bg-[#64ffda]/10 border border-white/5 group-hover:border-[#64ffda]/20">
                  <div className="relative">
                    <Camera className="w-10 h-10 text-slate-500 group-hover:text-[#64ffda] transition-colors" />
                    <Video className="w-6 h-6 text-[#64ffda] absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Dosya Seç</p>
                  <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-black">Fotoğraf veya Video</p>
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              className="hidden" 
              accept="image/*,video/*"
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-6 bg-white/5 p-8 rounded-[40px] border border-white/5 backdrop-blur-xl">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-[#64ffda]" /> Açıklama
              </label>
              <textarea 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-[#0a192f] border-none rounded-2xl p-5 text-white focus:ring-2 focus:ring-[#64ffda] outline-none min-h-[140px] transition-all text-sm leading-relaxed"
                placeholder="Bu anı anlatacak bir şeyler yaz..."
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <MapPin className="w-3 h-3 text-[#64ffda]" /> Konum
              </label>
              <input 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#0a192f] border-none rounded-2xl p-5 text-white focus:ring-2 focus:ring-[#64ffda] outline-none transition-all text-sm font-medium"
                placeholder="Örn: Kabak Koyu"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-[#64ffda] text-[#0a192f] py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-[#52e0c4] transition-all shadow-xl shadow-[#64ffda]/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Paylaşımı Yayınla <Send className="w-5 h-5" /></>}
          </button>
        </form>
      </div>
    </div>
  )
}
