import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Camera, ArrowRight, Heart, MessageSquare } from 'lucide-react'

export async function SocialSection() {
  const supabase = await createClient()

  // Son 4 onayli paylasimi getir
  const { data: posts } = await supabase
    .from('user_posts')
    .select(`
      id,
      image_url,
      caption,
      user_profiles (username, avatar_url),
      post_likes (id),
      post_comments (id)
    `)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(4)

  if (!posts || posts.length === 0) return null

  return (
    <section className="py-24 relative overflow-hidden bg-[#0a192f]">
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#64ffda]/5 rounded-full blur-3xl -z-10" aria-hidden="true" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#64ffda] font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Sparkles className="w-4 h-4" /> Sosyal Dünyada Fethiye
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
              Fethiye'den <br /><span className="text-[#64ffda]">Canlı Kareler</span>
            </h2>
          </div>
          <Link 
            href="/sosyal" 
            className="group flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] hover:bg-[#64ffda] hover:text-[#0a192f] transition-all"
          >
            Tüm Akışı Gör <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {posts.map((post) => (
            <Link 
              key={post.id}
              href={`/sosyal/post/${post.id}`}
              className="group relative aspect-[4/5] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl"
            >
              <Image 
                src={post.image_url} 
                alt={post.caption || 'Fethiye'} 
                fill 
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-[#64ffda]/50 overflow-hidden relative">
                    <Image src={post.user_profiles?.avatar_url || ''} alt="Avatar" fill sizes="32px" className="object-cover" />
                  </div>
                  <span className="text-white text-xs font-bold tracking-tight">@{post.user_profiles?.username}</span>
                </div>
                
                <div className="flex items-center gap-4 text-white font-black text-xs">
                  <div className="flex items-center gap-1.5"><Heart className="w-4 h-4 fill-[#64ffda] text-[#64ffda]" /> {post.post_likes?.length || 0}</div>
                  <div className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4 fill-white" /> {post.post_comments?.length || 0}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Action */}
        <div className="mt-12 md:hidden">
          <Link 
            href="/sosyal/yukle"
            className="w-full py-5 bg-[#64ffda] text-[#0a192f] rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-[#64ffda]/20"
          >
            <Camera className="w-5 h-5" /> Kendi Kareni Paylaş
          </Link>
        </div>
      </div>
    </section>
  )
}
