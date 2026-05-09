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

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-12">
        
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
      <BottomNav />
    </div>
  )
}
