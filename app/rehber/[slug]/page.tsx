import { createClient } from '@/lib/supabase/server'
import { Header } from "@/components/fethiye/header"
import { Footer } from "@/components/fethiye/footer"
import Image from "next/image"
import { 
  MapPin, 
  History, 
  Navigation, 
  MessageSquare, 
  Send,
  Sparkles,
  Image as ImageIcon,
  ChevronDown
} from "lucide-react"
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: dest } = await supabase.from('destinations').select('*').eq('slug', slug).single()
  if (!dest) return {}
  return {
    title: `${dest.title} | Fethiye360 Rehber`,
    description: dest.description,
  }
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: dest, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !dest) notFound()

  const { data: comments } = await supabase
    .from('destination_comments')
    .select('*, user_profiles(username, avatar_url)')
    .eq('destination_id', dest.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-[#0a192f] selection:bg-[#64ffda] selection:text-[#0a192f]">
      <Header />
      
      {/* Cinematic Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <Image 
          src={dest.main_image} 
          alt={dest.title} 
          fill 
          className="object-cover scale-105 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a192f]/40 to-[#0a192f]" />
        
        <div className="relative z-10 text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 text-[#64ffda]" />
            <span className="text-white text-xs font-black uppercase tracking-[0.3em]">{dest.category}</span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase italic leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {dest.title}
          </h1>
          <div className="flex items-center justify-center gap-8 text-white/60 text-sm font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#64ffda]" /> FETHİYE</div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/30" />
        </div>
      </section>

      {/* Elegant Content Grid */}
      <section className="max-w-6xl mx-auto px-6 py-32 space-y-32">
        
        {/* Description Section */}
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="w-20 h-1 bg-[#64ffda] mx-auto rounded-full" />
          <p className="text-2xl md:text-3xl text-slate-300 font-medium leading-relaxed italic">
            "{dest.description}"
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group bg-white/5 border border-white/5 p-12 rounded-[60px] hover:bg-white/10 transition-all duration-500">
            <div className="w-16 h-16 bg-[#64ffda]/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <History className="w-8 h-8 text-[#64ffda]" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic mb-6">Tarihçe</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{dest.history}</p>
          </div>

          <div className="group bg-white/5 border border-white/5 p-12 rounded-[60px] hover:bg-white/10 transition-all duration-500">
            <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Navigation className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic mb-6">Ulaşım</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{dest.transportation}</p>
          </div>
        </div>

        {/* HD PHOTO WALL - 10 IMAGES */}
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              Görsel <span className="text-[#64ffda]">Ziyafeti</span>
            </h2>
            <div className="hidden md:flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
              <ImageIcon className="w-4 h-4" /> HD KALİTE
            </div>
          </div>
          
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {dest.gallery && dest.gallery.map((img: string, i: number) => (
              <div key={i} className="relative group overflow-hidden rounded-[40px] border border-white/5 bg-white/5 break-inside-avoid">
                <img 
                  src={img} 
                  alt={`${dest.title} HD - ${i + 1}`} 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <span className="text-white/50 text-[10px] font-black tracking-widest uppercase">Fethiye360 Premium HD</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refined Comments */}
        <div className="max-w-4xl mx-auto space-y-16 pt-20 border-t border-white/5">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Deneyimler</h2>
            <p className="text-slate-500 font-medium italic">Sizin gözünüzden {dest.title}</p>
          </div>

          {user ? (
            <div className="bg-white/5 p-10 rounded-[50px] border border-white/10 space-y-8">
              <form action={async (formData: FormData) => {
                'use server'
                const comment = formData.get('comment') as string
                const supabase = await createClient()
                await supabase.from('destination_comments').insert([{
                  destination_id: dest.id,
                  user_id: user.id,
                  comment: comment,
                  is_approved: false
                }])
              }} className="space-y-6">
                <textarea 
                  name="comment"
                  required
                  placeholder="Deneyimlerinizi paylaşın..."
                  className="w-full bg-transparent border-b border-white/10 py-4 text-xl text-white placeholder:text-slate-700 outline-none focus:border-[#64ffda] transition-all min-h-[100px] resize-none"
                />
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-600 italic uppercase font-bold tracking-widest">Yorumunuz onay sonrası yayınlanır</p>
                  <button type="submit" className="px-12 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center gap-2">
                    <Send className="w-4 h-4" /> GÖNDER
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-10">
              <Link href="/giris" className="text-[#64ffda] font-black uppercase tracking-widest text-xs hover:underline underline-offset-8 transition-all">Yorum yapmak için giriş yapın</Link>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {comments?.map((c) => (
              <div key={c.id} className="bg-white/5 p-10 rounded-[40px] border border-white/5 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-16 h-16 rounded-2xl overflow-hidden relative shrink-0 border-2 border-[#64ffda]/20">
                  <Image src={c.user_profiles?.avatar_url || "/default-avatar.png"} alt="Avatar" fill className="object-cover" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-white font-black uppercase tracking-widest text-xs">{c.user_profiles?.username}</span>
                    <div className="h-1 w-1 bg-slate-700 rounded-full" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{new Date(c.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed italic">"{c.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
