import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/sosyal/post-card'
import { 
  ArrowLeft,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { BottomNav } from '@/components/sosyal/bottom-nav'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('user_posts')
    .select('caption, user_profiles(username)')
    .eq('id', id)
    .single()
  
  return {
    title: `${post?.user_profiles?.username || 'Kullanıcı'} - Fethiye360 Sosyal`,
    description: post?.caption || 'Fethiye360 Sosyal Paylaşımı',
    openGraph: {
      title: `${post?.user_profiles?.username || 'Kullanıcı'} Paylaşımı`,
      description: post?.caption || 'Fethiye\'den yeni bir kare!',
    }
  }
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: post, error } = await supabase
    .from('user_posts')
    .select(`
      *,
      user_profiles (username, avatar_url),
      post_comments (
        *,
        user_profiles (username, avatar_url)
      ),
      post_likes (user_id),
      businesses (id, name, slug)
    `)
    .eq('id', id)
    .single()

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex flex-col items-center justify-center gap-4 text-center p-6">
        <h1 className="text-2xl font-bold text-white">Gönderi Bulunamadı</h1>
        <p className="text-slate-400">Bu gönderi silinmiş veya erişilemiyor olabilir.</p>
        <Link href="/sosyal" className="px-8 py-3 bg-[#64ffda] text-[#0a192f] rounded-xl font-bold mt-4 transition-all hover:scale-105 active:scale-95">
          Sosyal Akışa Dön
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a192f] pb-20">
      <header className="sticky top-0 z-50 bg-[#0a192f]/80 backdrop-blur-2xl border-b border-white/5 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href="/sosyal" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#64ffda]/10 transition-all border border-white/5">
            <ArrowLeft className="w-5 h-5 text-slate-400 hover:text-[#64ffda]" />
          </Link>
          <h1 className="text-xl font-black text-white tracking-tighter uppercase italic flex items-center gap-2">
            Gönderi <Sparkles className="w-4 h-4 text-[#64ffda]" />
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-8">
        <PostCard post={post} currentUserId={user?.id} />
      </main>

      <BottomNav />
    </div>
  )
}
