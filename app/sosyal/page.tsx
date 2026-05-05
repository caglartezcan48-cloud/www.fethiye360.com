'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PostCard } from '@/components/sosyal/post-card'
import { 
  Loader2, 
  Sparkles, 
  Camera, 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Image as ImageIcon 
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SocialFeedPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      // Kullaniciyi al
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // Tum gonderileri getir (SADECE ONAYLI OLANLAR)
      const { data, error } = await supabase
        .from('user_posts')
        .select(`
          *,
          user_profiles (username, avatar_url),
          post_comments (
            *,
            user_profiles (username, avatar_url)
          ),
          post_likes (user_id)
        `)
        .eq('is_approved', true) // Filtre eklendi
        .order('created_at', { ascending: false })

      if (!error) setPosts(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#0a192f] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-[#64ffda] animate-spin" />
      <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Fethiye Dünyası Yükleniyor</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a192f] pb-20">
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-screen pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#64ffda]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Navbar Social HD */}
      <header className="sticky top-0 z-50 bg-[#0a192f]/80 backdrop-blur-2xl border-b border-white/5 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-[#64ffda]/10 transition-all border border-white/5">
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-[#64ffda]" />
            </div>
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-black text-white tracking-tighter uppercase italic flex items-center gap-2">
              Fethiye <Sparkles className="w-4 h-4 text-[#64ffda] animate-pulse" /> Sosyal
            </h1>
          </div>
          <Link href="/sosyal/yukle" className="p-3 bg-[#64ffda] text-[#0a192f] rounded-xl hover:scale-110 transition-transform shadow-lg shadow-[#64ffda]/20">
            <Camera className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-8 space-y-12">
        
        {/* Stories Style Highlight (Static for now) */}
        <section className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {['Turlar', 'Restoranlar', 'Plajlar', 'Gece Hayatı', 'Doğa'].map((category) => (
            <div key={category} className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 p-1 flex items-center justify-center group cursor-pointer hover:border-[#64ffda] transition-all">
                <div className="w-full h-full bg-[#112240] rounded-2xl flex items-center justify-center text-[#64ffda] group-hover:scale-90 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{category}</span>
            </div>
          ))}
        </section>

        {/* Feed Posts */}
        <div className="space-y-10">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              currentUserId={user?.id} 
            />
          ))}

          {posts.length === 0 && (
            <div className="text-center py-32 bg-white/5 rounded-[60px] border border-dashed border-white/10">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-slate-700" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tighter uppercase italic">Henüz Paylaşım Yok</h2>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">Sessizliği bozmaya ne dersin? Fethiye'den bir kare paylaşan ilk kişi sen ol.</p>
              <Link 
                href="/sosyal/yukle"
                className="inline-flex items-center gap-3 px-10 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-[#64ffda]/10"
              >
                <Camera className="w-4 h-4" /> Fotoğraf Yükle
              </Link>
            </div>
          )}
        </div>

        {/* Floating Profile Button for Mobile */}
        {user && (
          <Link 
            href="/profil" 
            className="fixed bottom-8 right-8 w-16 h-16 bg-[#112240] border border-[#64ffda]/30 rounded-full flex items-center justify-center shadow-2xl z-50 group hover:scale-110 transition-transform backdrop-blur-xl"
          >
            <Users className="w-6 h-6 text-[#64ffda] group-hover:animate-bounce" />
          </Link>
        )}
      </main>
    </div>
  )
}
