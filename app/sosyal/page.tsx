import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/sosyal/post-card'
import { Stories } from '@/components/sosyal/stories'
import { 
  ImageIcon,
  ArrowLeft,
  Sparkles,
  Camera,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { BottomNav } from '@/components/sosyal/bottom-nav'
import { Header } from '@/components/fethiye/header'

export const dynamic = 'force-dynamic'

export default async function SocialFeedPage() {
  const supabase = await createClient()

  // Kullaniciyi al
  const { data: { user } } = await supabase.auth.getUser()

  // Tum gonderileri getir (SADECE ONAYLI OLANLAR)
  const { data: userPosts, error: postError } = await supabase
    .from('user_posts')
    .select(`
      *,
      user_profiles (username, avatar_url)
    `)
    .eq('is_approved', true)
    .eq('media_type', 'image')
    .order('created_at', { ascending: false })

  let posts = userPosts || []

  if (userPosts && userPosts.length > 0) {
    const postIds = userPosts.map(p => p.id)
    const [likesRes, commentsRes] = await Promise.all([
      supabase.from('post_likes').select('post_id, user_id').in('post_id', postIds),
      supabase.from('post_comments').select('post_id').in('post_id', postIds)
    ])

    const likesMap = (likesRes.data || []).reduce((acc: any, curr: any) => {
      if (!acc[curr.post_id]) acc[curr.post_id] = []
      acc[curr.post_id].push(curr)
      return acc
    }, {})

    const commentsMap = (commentsRes.data || []).reduce((acc: any, curr: any) => {
      acc[curr.post_id] = (acc[curr.post_id] || 0) + 1
      return acc
    }, {})

    posts = userPosts.map(post => ({
      ...post,
      post_likes: likesMap[post.id] || [],
      post_comments: { length: commentsMap[post.id] || 0 }
    }))
  }

  if (postError) {
    console.error("Fetch social posts error:", postError)
  }

  return (
    <div className="min-h-screen bg-[#0a192f] pb-20">
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-screen pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#64ffda]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <Header />

      <main className="max-w-7xl mx-auto px-4 pt-28 space-y-12">
        
        {/* Stories System */}
        <div className="max-w-xl mx-auto">
          <Stories />
        </div>

        {/* Feed Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {posts?.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              currentUserId={user?.id} 
            />
          ))}

          {(!posts || posts.length === 0) && (
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

        {/* Floating Quick Action Stack */}
        {user && (
          <div className="fixed bottom-24 right-6 sm:right-8 z-50 flex flex-col gap-4">
            <Link 
              href="/sosyal/yukle" 
              className="w-14 h-14 bg-gradient-to-r from-[#64ffda] to-[#52e0c4] text-[#0a192f] rounded-full flex items-center justify-center shadow-[0_4px_25px_rgba(100,255,218,0.35)] hover:shadow-[0_4px_30px_rgba(100,255,218,0.55)] hover:scale-110 active:scale-95 transition-all duration-300 animate-pulse"
              title="Fotoğraf Paylaş"
            >
              <Camera className="w-5.5 h-5.5" />
            </Link>
            <Link 
              href="/profil" 
              className="w-14 h-14 bg-[#112240]/90 border border-[#64ffda]/30 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 backdrop-blur-xl group"
              title="Profilim"
            >
              <Users className="w-5.5 h-5.5 text-[#64ffda] group-hover:animate-bounce" />
            </Link>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
