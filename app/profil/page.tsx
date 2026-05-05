'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { 
  Camera, 
  Grid, 
  MapPin, 
  Settings, 
  LogOut, 
  Plus, 
  Loader2, 
  Heart, 
  MessageSquare,
  User as UserIcon,
  Sparkles,
  Edit3,
  Image as ImageIcon
} from 'lucide-react'
import Image from 'next/image'

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/giris')
        return
      }
      setUser(user)

      // Profil bilgilerini getir
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profileData)

      // Kullanicinin paylasimlarini getir
      const { data: userPosts } = await supabase
        .from('user_posts')
        .select(`
          *,
          post_comments (id),
          post_likes (id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setPosts(userPosts || [])
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a192f] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-[#64ffda] animate-spin" />
      <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Profil Yükleniyor</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a192f] text-white selection:bg-[#64ffda]/30 pb-20">
      {/* Header Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-gradient-to-b from-[#64ffda]/10 to-transparent -z-10 blur-[100px]" />

      <main className="max-w-4xl mx-auto px-6 pt-12 md:pt-24">
        
        {/* Profile Info HD */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-20 mb-20 animate-in fade-in slide-in-from-top-10 duration-700">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#64ffda] to-blue-500 rounded-[50px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-[50px] overflow-hidden border-4 border-white/10 p-2 bg-[#112240]">
              <div className="relative w-full h-full rounded-[40px] overflow-hidden">
                <Image 
                  src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username}`} 
                  alt="Avatar" 
                  fill 
                  className="object-cover"
                />
              </div>
              <button className="absolute bottom-4 right-4 p-3 bg-[#64ffda] text-[#0a192f] rounded-2xl shadow-xl hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <h1 className="text-3xl font-black tracking-tighter uppercase">{profile?.username || 'kullanici'}</h1>
              <div className="flex items-center gap-3">
                <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm border border-white/5 transition-all">Profili Düzenle</button>
                <button onClick={handleLogout} className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-10">
              <div className="text-center md:text-left">
                <span className="block text-2xl font-black text-[#64ffda]">{posts.length}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gönderi</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-2xl font-black text-white">0</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Takipçi</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-2xl font-black text-white">0</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Takip</span>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="font-bold text-lg flex items-center gap-2 justify-center md:justify-start">
                {profile?.full_name} <Sparkles className="w-4 h-4 text-[#64ffda]" />
              </h2>
              <p className="text-slate-400 max-w-md mx-auto md:mx-0 leading-relaxed italic">
                {profile?.bio || 'Henüz bir biyografi eklenmemiş.'}
              </p>
            </div>
          </div>
        </section>

        {/* Tabs & Grid */}
        <div className="border-t border-white/5 pt-10">
          <div className="flex items-center justify-center gap-12 mb-10">
            <button className="flex items-center gap-2 text-[#64ffda] font-black text-xs uppercase tracking-[0.2em] relative py-2">
              <Grid className="w-4 h-4" /> Gönderiler
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#64ffda] rounded-full shadow-[0_0_10px_#64ffda]" />
            </button>
            <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-black text-xs uppercase tracking-[0.2em] py-2">
              <ImageIcon className="w-4 h-4" /> Etiketlenenler
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {/* Add New Post Card */}
            <button 
              onClick={() => router.push('/sosyal/yukle')}
              className="aspect-square bg-[#112240] rounded-2xl md:rounded-[40px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-[#64ffda] hover:border-[#64ffda]/30 transition-all group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-[#64ffda]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Yeni Fotoğraf</span>
            </button>

            {posts.map((post) => (
              <div 
                key={post.id} 
                className="group relative aspect-square bg-[#112240] rounded-2xl md:rounded-[40px] overflow-hidden border border-white/5 cursor-pointer"
              >
                <Image 
                  src={post.image_url} 
                  alt="Post" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-white font-black">
                    <Heart className="w-5 h-5 fill-white" /> {post.post_likes?.length || 0}
                  </div>
                  <div className="flex items-center gap-2 text-white font-black">
                    <MessageSquare className="w-5 h-5 fill-white" /> {post.post_comments?.length || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-24 animate-in fade-in duration-1000">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Henüz fotoğrafın yok</h3>
              <p className="text-slate-500">İlk Fethiye kareni paylaşmaya ne dersin?</p>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
