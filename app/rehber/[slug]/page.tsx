import { createClient } from '@/lib/supabase/server'
import { Header } from "@/components/fethiye/header"
import { Footer } from "@/components/fethiye/footer"
import Image from "next/image"
import { 
  MapPin, 
  History, 
  Navigation, 
  Clock, 
  MessageSquare, 
  Send,
  Sparkles,
  ChevronRight,
  Info,
  Image as ImageIcon
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
    title: `${dest.meta_title || dest.title} | Fethiye360 Rehber`,
    description: dest.meta_description || dest.description,
    openGraph: {
      title: dest.title,
      description: dest.description,
      images: [dest.main_image]
    }
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
    <main className="min-h-screen bg-[#0a192f]">
      <Header />
      
      {/* Hero Section - Blog Style */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <Image 
          src={dest.main_image} 
          alt={dest.title} 
          fill 
          className="object-cover scale-105 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/20 via-[#0a192f]/60 to-[#0a192f]" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-20">
            <div className="max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#64ffda] text-[#0a192f] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#64ffda]/20">
                <Sparkles className="w-3 h-3" /> {dest.category}
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-2xl">
                {dest.title}
              </h1>
              <div className="flex items-center gap-6 text-slate-300 text-sm font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#64ffda]" /> Fethiye
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#64ffda]" /> {new Date(dest.created_at).toLocaleDateString('tr-TR')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                <Info className="w-8 h-8 text-[#64ffda]" /> Genel Bakış
              </h2>
              <div className="text-slate-400 text-lg leading-relaxed space-y-4 font-medium italic border-l-4 border-[#64ffda]/20 pl-8">
                {dest.description}
              </div>
            </div>

            <div className="space-y-6 bg-white/5 p-10 rounded-[40px] border border-white/5">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                <History className="w-8 h-8 text-[#64ffda]" /> Tarihçe
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {dest.history}
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                <Navigation className="w-8 h-8 text-[#64ffda]" /> Nasıl Gidilir?
              </h2>
              <p className="text-slate-300 leading-relaxed bg-white/5 p-10 rounded-[40px] border border-white/5 whitespace-pre-line">
                {dest.transportation}
              </p>
            </div>

            {/* Gallery Section - HD Grid */}
            {dest.gallery && dest.gallery.length > 0 && (
              <div className="space-y-6 pt-10">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                  <ImageIcon className="w-8 h-8 text-[#64ffda]" /> Fotoğraf <span className="text-[#64ffda]">Galerisi</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {dest.gallery.map((img: string, i: number) => (
                    <div 
                      key={i} 
                      className={`relative overflow-hidden rounded-[32px] border border-white/5 group transition-all duration-500 hover:border-[#64ffda]/50 ${
                        i === 0 ? 'md:col-span-2 md:row-span-2 h-96' : 'h-48'
                      }`}
                    >
                      <Image 
                        src={img} 
                        alt={`${dest.title} - ${i + 1}`} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="pt-20 space-y-10 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                  Deneyimler <span className="text-[#64ffda]">({comments?.length || 0})</span>
                </h2>
              </div>

              {user ? (
                <div className="bg-white/5 p-8 rounded-[32px] border border-white/10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#64ffda] flex items-center justify-center text-[#0a192f] font-black italic">
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <div className="text-white font-bold uppercase tracking-widest text-xs">Fikrini Paylaş</div>
                  </div>
                  <form action={async (formData: FormData) => {
                    'use server'
                    const comment = formData.get('comment') as string
                    const supabase = await createClient()
                    await supabase.from('destination_comments').insert([{
                      destination_id: dest.id,
                      user_id: user.id,
                      comment: comment,
                      is_approved: false // Admin onayı gereksin
                    }])
                  }} className="space-y-4">
                    <textarea 
                      name="comment"
                      required
                      placeholder="Burayı ziyaret ettiniz mi? Deneyimlerinizi yazın..."
                      className="w-full bg-[#0a192f] border border-white/10 rounded-2xl p-6 text-white focus:ring-1 focus:ring-[#64ffda] outline-none min-h-[150px]"
                    />
                    <button type="submit" className="px-10 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all flex items-center gap-2">
                      <Send className="w-4 h-4" /> Yorumu Gönder
                    </button>
                    <p className="text-[10px] text-slate-500 italic">Yorumunuz yönetici onayından sonra yayınlanacaktır.</p>
                  </form>
                </div>
              ) : (
                <div className="bg-white/5 p-12 rounded-[40px] border border-dashed border-white/10 text-center space-y-6">
                  <p className="text-slate-400 font-bold italic">Yorum yapabilmek için giriş yapmalısınız.</p>
                  <Link href="/giris" className="inline-block px-10 py-4 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all">Giriş Yap</Link>
                </div>
              )}

              <div className="space-y-6">
                {comments?.map((c) => (
                  <div key={c.id} className="bg-white/5 p-8 rounded-[32px] border border-white/5 flex gap-6">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                      <Image src={c.user_profiles?.avatar_url || "/default-avatar.png"} alt="Avatar" fill className="object-cover" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-black uppercase tracking-widest text-xs">{c.user_profiles?.username}</span>
                        <span className="text-[10px] text-slate-500 font-bold">{new Date(c.created_at).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{c.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#112240] to-[#0a192f] p-10 rounded-[40px] border border-white/5 space-y-8 sticky top-32">
              <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Hızlı Bilgiler</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#64ffda]/10 rounded-2xl">
                    <MapPin className="w-5 h-5 text-[#64ffda]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Konum</div>
                    <div className="text-white font-bold">{dest.title}, Fethiye</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#64ffda]/10 rounded-2xl">
                    <Sparkles className="w-5 h-5 text-[#64ffda]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kategori</div>
                    <div className="text-white font-bold">{dest.category}</div>
                  </div>
                </div>
              </div>

              <Link href="/sosyal/yukle" className="w-full py-5 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-[#64ffda]/10">
                <Sparkles className="w-4 h-4" /> Fotoğraf Paylaş
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
