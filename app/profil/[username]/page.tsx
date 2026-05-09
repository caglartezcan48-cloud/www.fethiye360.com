import { createClient } from '@/lib/supabase/server'
import { 
  Grid, 
  Heart, 
  MessageSquare,
  Sparkles,
  Lock,
  ArrowLeft,
} from 'lucide-react'
import Image from 'next/image'
import { BottomNav } from '@/components/sosyal/bottom-nav'
import { Header } from '@/components/fethiye/header'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import FollowButton from './FollowButton' // Yeni oluşturacağımız client component
import MessageButton from './MessageButton' // Yeni oluşturacağımız client component
import ShareButton from './ShareButton' // Yeni oluşturacağımız client component

export const dynamic = 'force-dynamic'

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  // 1. Mevcut Oturumu Al
  const { data: { user: authUser } } = await supabase.auth.getUser()

  // 2. Hedef Profili Getir
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('username', username)
    .single()
  
  if (profileError || !profile) {
    redirect('/sosyal')
  }

  // Kendi profiline bakıyorsa yönlendir
  if (authUser?.id === profile.id) {
    redirect('/profil')
  }

  // 3. Takip Durumunu Kontrol Et
  let isFollowing = false
  if (authUser) {
    const { data: followData } = await supabase
      .from('user_follows')
      .select('*')
      .eq('follower_id', authUser.id)
      .eq('following_id', profile.id)
      .single()
    
    isFollowing = !!followData
  }

  // 4. Takipçi/Takip Sayılarını Getir
  const [followersCount, followingCount] = await Promise.all([
    supabase.from('user_follows').select('*', { count: 'exact', head: true }).eq('following_id', profile.id),
    supabase.from('user_follows').select('*', { count: 'exact', head: true }).eq('follower_id', profile.id)
  ])

  const counts = {
    followers: followersCount.count || 0,
    following: followingCount.count || 0
  }

  // 5. Paylasimlari Getir (Eger gizli degilse veya takip ediyorsa)
  let posts: any[] = []
  const canSeePosts = profile.is_public || (authUser && isFollowing)
  
  if (canSeePosts) {
    const { data: userPosts } = await supabase
      .from('user_posts')
      .select(`
        *,
        post_comments (id),
        post_likes (id)
      `)
      .eq('user_id', profile.id)
      .eq('media_type', 'image')
      .order('created_at', { ascending: false })

    posts = userPosts || []
  }

  return (
    <div className="min-h-screen bg-[#0a192f] text-white pb-20">
      <Header />
      <main className="max-w-4xl mx-auto px-6 pt-32 md:pt-40">
        
        {/* Back Button */}
        <Link href="/sosyal" className="mb-10 flex items-center gap-2 text-slate-500 hover:text-[#64ffda] transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Geri Dön
        </Link>

        {/* Profile Header */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16 mb-16 animate-in fade-in duration-700">
          <div className="relative">
            <div className="absolute inset-0 bg-[#64ffda]/10 rounded-[60px] blur-2xl" />
            <div className="relative w-40 h-40 md:w-44 md:h-44 rounded-[56px] overflow-hidden border-4 border-white/5 p-1.5 bg-[#112240]">
              <div className="relative w-full h-full rounded-[44px] overflow-hidden">
                <Image 
                  src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username}`} 
                  alt="Avatar" fill className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <h1 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-2">
                {profile?.username}
                {profile?.is_public ? (
                   <div className="w-5 h-5 bg-[#64ffda] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#0a192f] stroke-[4]" />
                  </div>
                ) : (
                  <Lock className="w-4 h-4 text-slate-500" />
                )}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <FollowButton 
                    profileId={profile.id} 
                    username={profile.username}
                    initialIsFollowing={isFollowing} 
                    currentUserId={authUser?.id} 
                />
                <MessageButton 
                    profileId={profile.id} 
                    currentUserId={authUser?.id} 
                />
                <ShareButton username={profile.username} />
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-12 text-sm font-bold">
              <div className="text-center md:text-left"><span className="block text-2xl font-black text-[#64ffda]">{posts.length}</span> Gönderi</div>
              <div className="text-center md:text-left"><span className="block text-2xl font-black text-white">{counts.followers}</span> Takipçi</div>
              <div className="text-center md:text-left"><span className="block text-2xl font-black text-white">{counts.following}</span> Takip</div>
            </div>

            <div className="space-y-2">
              <h2 className="font-bold text-lg flex items-center gap-2 justify-center md:justify-start">
                {profile?.full_name} <Sparkles className="w-4 h-4 text-[#64ffda]" />
              </h2>
              <p className="text-slate-400 max-w-md mx-auto md:mx-0 leading-relaxed italic">{profile?.bio || 'Bu kullanıcı henüz bir biyografi eklememiş.'}</p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="border-t border-white/5 pt-8">
          {canSeePosts ? (
            <>
              <div className="flex items-center justify-center gap-16 mb-12 font-black text-[10px] uppercase tracking-[0.3em]">
                <button className="flex items-center gap-3 text-[#64ffda] relative py-3">
                  <Grid className="w-4 h-4" /> Gönderiler
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#64ffda] rounded-full" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1 md:gap-6">
                {posts.map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/sosyal/post/${post.id}`}
                    className="group relative aspect-square bg-[#112240] rounded-2xl md:rounded-[48px] overflow-hidden cursor-pointer shadow-2xl transition-transform active:scale-95"
                  >
                    <Image src={post.image_url} alt="Post" fill className="object-cover group-hover:scale-110 transition-all duration-1000" />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-8">
                      <div className="flex flex-col items-center gap-1 text-white font-black"><Heart className="w-7 h-7 fill-[#64ffda] text-[#64ffda]" /> {post.post_likes?.length || 0}</div>
                      <div className="flex flex-col items-center gap-1 text-white font-black"><MessageSquare className="w-7 h-7 fill-white" /> {post.post_comments?.length || 0}</div>
                    </div>
                  </Link>
                ))}
              </div>

              {posts.length === 0 && (
                <div className="text-center py-32 text-slate-500 font-bold italic uppercase tracking-widest text-xs animate-pulse">
                  Henüz bir gönderi paylaşılmamış.
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-32 bg-[#112240]/30 rounded-[48px] border border-white/5 space-y-6">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                <Lock className="w-8 h-8 text-slate-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Bu Hesap Gizli</h3>
                <p className="text-slate-500 text-sm mt-2">Fotoğrafları görmek için bu kullanıcıyı takip etmelisin.</p>
              </div>
            </div>
          )}
        </div>

      </main>
      <BottomNav />
    </div>
  )
}

function Check({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
}
