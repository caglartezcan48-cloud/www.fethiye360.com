export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { 
  Sparkles, 
  Camera, 
  Flame, 
  Clock,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { DiscoveryCard } from '@/components/sosyal/discovery-card'
import { PostGridSkeleton } from '@/components/sosyal/post-skeleton'

export default async function DiscoveryPage({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string }>
}) {
  const supabase = await createClient()
  const { filtre = 'yeni' } = await searchParams
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('user_posts')
    .select(`
      *,
      user_profiles (username, avatar_url)
    `)
    .eq('is_approved', true)
  // Filtreleme Mantigi (DB Seviyesi)
  query = query.eq('media_type', 'image')
  
  if (filtre === 'yeni' || filtre === 'populer') {
    query = query.order('created_at', { ascending: false })
  } else if (filtre === 'fotograflar') {
    query = query.order('created_at', { ascending: false })
  }

  const { data: posts, error } = await query.limit(100)
  if (error) {
    console.error("Fetch social posts error:", error)
  }

  // Filtreleme Mantigi (Memory Seviyesi)
  let processedPosts = posts || []
  if (filtre === 'populer') {
    processedPosts = [...processedPosts].sort((a, b) => (b.post_likes?.length || 0) - (a.post_likes?.length || 0))
  }
  
  const displayedPosts = processedPosts.slice(0, 50)

  const filterItems = [
    { id: 'yeni', label: 'En Yeni', icon: Clock },
    { id: 'populer', label: 'Trendler', icon: Flame },
    { id: 'fotograflar', label: 'Fotoğraflar', icon: Camera },
  ]

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 text-[#64ffda] font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Sparkles className="w-4 h-4" /> Fethiye'yi Keşfet
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-tight">
              Sosyal <span className="text-[#64ffda]">Keşif</span>
            </h1>
            <p className="text-slate-400 mt-4 text-lg max-w-2xl font-medium">
            Fethiye'nin dört bir yanından kullanıcı paylaşımları ve anlık kareler.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap gap-3 mb-10 pb-4 border-b border-white/5">
            {filterItems.map((item) => {
              const Icon = item.icon
              const isActive = filtre === item.id
              return (
                <Link
                  key={item.id}
                  href={`/kesfet?filtre=${item.id}`}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
                    isActive 
                      ? 'bg-[#64ffda] text-[#0a192f] border-[#64ffda]' 
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Grid View - Instagram Style */}
          {displayedPosts && displayedPosts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
              {displayedPosts.map((post: any, index: number) => {
                // Görsel Plan Ayarı: Bazı öğeler dikey veya yatay olarak daha geniş olsun
                const isVertical = index % 7 === 1 || index % 7 === 5
                const isHorizontal = index % 7 === 3
                
                return (
                  <div 
                    key={post.id} 
                    className={`relative rounded-3xl overflow-hidden group ${
                      isVertical ? 'row-span-2' : ''
                    } ${
                      isHorizontal ? 'col-span-2' : ''
                    }`}
                  >
                    <DiscoveryCard post={post} aspectRatio="h-full" />
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-32 text-center bg-white/5 rounded-[48px] border border-white/5 border-dashed">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Camera className="w-10 h-10 text-slate-700" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Henüz Paylaşım Yok</h2>
              <p className="text-slate-500 italic">Bu kategoride henüz bir paylaşım yapılmamış.</p>
              <Link href="/sosyal/yukle" className="inline-flex items-center gap-2 text-[#64ffda] mt-6 font-bold hover:underline">
                İlk paylaşımı sen yap <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
