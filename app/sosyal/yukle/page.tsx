'use client'

import { useState, useRef, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Camera, 
  X, 
  Loader2, 
  ArrowLeft, 
  Send, 
  MapPin,
  Sparkles,
  Clock,
  LayoutGrid,
  Building2,
  Search,
  Check
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

function UploadContent() {
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type') === 'story' ? 'story' : 'post'
  
  const [shareType, setShareType] = useState<'post' | 'story'>(initialType)
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Isletme Etiketleme State
  const [businesses, setBusinesses] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  
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

  const searchBusinesses = async (query: string) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setBusinesses([])
      return
    }
    setIsSearching(true)
    const { data } = await supabase
      .from('businesses')
      .select('id, name, slug')
      .ilike('name', `%${query}%`)
      .limit(5)
    setBusinesses(data || [])
    setIsSearching(false)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Giriş yapmalısınız')

      const fileExt = file.name.split('.').pop()
      const fileName = `${shareType}_${user.id}_${Date.now()}.${fileExt}`
      const filePath = `${shareType}s/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(filePath)

      if (shareType === 'post') {
        const { error: dbError } = await supabase
          .from('user_posts')
          .insert([{
            user_id: user.id,
            image_url: publicUrl,
            media_type: mediaType,
            caption: caption,
            location: location,
            business_id: selectedBusiness?.id || null,
            is_approved: true
          }])
        if (dbError) throw dbError
      } else {
        const { error: dbError } = await supabase
          .from('user_stories')
          .insert([{
            user_id: user.id,
            media_url: publicUrl,
            media_type: mediaType
          }])
        if (dbError) throw dbError
      }

      toast.success(`${shareType === 'post' ? 'Gönderi' : 'Hikaye'} başarıyla paylaşıldı! ✨`)
      router.push('/sosyal')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      toast.error('Paylaşım başarısız oldu')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a192f] p-6 relative overflow-hidden selection:bg-[#64ffda]/30">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#64ffda]/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-xl mx-auto pt-12 pb-20">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-bold uppercase tracking-widest text-xs">Vazgeç</span>
        </button>

        <header className="mb-12">
          <h1 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase italic">Ne Paylaşmak İstersin?</h1>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => setShareType('post')}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${shareType === 'post' ? 'bg-[#64ffda]/10 border-[#64ffda] text-[#64ffda]' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
            >
              <LayoutGrid className="w-8 h-8" />
              <span className="font-black uppercase tracking-widest text-[10px]">Normal Gönderi</span>
            </button>
            <button 
              type="button"
              onClick={() => setShareType('story')}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${shareType === 'story' ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
            >
              <Clock className="w-8 h-8" />
              <span className="font-black uppercase tracking-widest text-[10px]">24 Saatlilk Hikaye</span>
            </button>
          </div>
        </header>

        <form onSubmit={handleUpload} className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          
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
                  <Camera className="w-10 h-10 text-slate-500 group-hover:text-[#64ffda]" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Dosya Seç</p>
                  <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-black">Güzelliği Ölümsüzleştir</p>
                </div>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
          </div>

          {shareType === 'post' && (
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
                  <Building2 className="w-3 h-3 text-[#64ffda]" /> İşletme Etiketle (Opsiyonel)
                </label>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      value={selectedBusiness ? selectedBusiness.name : searchQuery}
                      onChange={(e) => !selectedBusiness && searchBusinesses(e.target.value)}
                      readOnly={!!selectedBusiness}
                      className="w-full bg-[#0a192f] border-none rounded-2xl p-5 pl-12 text-white focus:ring-2 focus:ring-[#64ffda] outline-none transition-all text-sm font-medium"
                      placeholder="İşletme ara... (Örn: Limon Cafe)"
                    />
                    {selectedBusiness && (
                      <button 
                        type="button"
                        onClick={() => { setSelectedBusiness(null); setSearchQuery(''); }}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {isSearching && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-[#112240] border border-white/5 rounded-2xl p-4 z-50 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-[#64ffda] animate-spin" />
                    </div>
                  )}

                  {!selectedBusiness && businesses.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-[#112240] border border-white/5 rounded-2xl overflow-hidden z-50 shadow-2xl">
                      {businesses.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => { setSelectedBusiness(b); setBusinesses([]); }}
                          className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors group"
                        >
                          <span className="text-sm font-medium text-white group-hover:text-[#64ffda]">{b.name}</span>
                          <Check className="w-4 h-4 text-[#64ffda] opacity-0 group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
          )}

          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-50 ${shareType === 'post' ? 'bg-[#64ffda] text-[#0a192f] hover:bg-[#52e0c4] shadow-[#64ffda]/20' : 'bg-purple-500 text-white hover:bg-purple-400 shadow-purple-500/20'}`}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Paylaşımı Yayınla <Send className="w-5 h-5" /></>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function UploadPostPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#64ffda] animate-spin" />
      </div>
    }>
      <UploadContent />
    </Suspense>
  )
}
