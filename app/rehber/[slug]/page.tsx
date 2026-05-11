import { createClient } from '@/lib/supabase/server'
import { Header } from "@/components/fethiye/header"
import { Footer } from "@/components/fethiye/footer"
import Image from "next/image"
import { 
  MapPin, 
  History, 
  Navigation, 
  Sparkles,
  ChevronDown
} from "lucide-react"
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DestinationGallery } from '@/components/rehber/destination-gallery'
import { DestinationComments } from '@/components/rehber/destination-comments'

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
  // 1. Parametreyi güvenle bekle
  const { slug } = await params
  if (!slug) notFound()

  const supabase = await createClient()
  
  // 2. Verileri sunucuda çek
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
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase italic leading-none">
            {dest.title}
          </h1>
          <div className="flex items-center justify-center gap-8 text-white/60 text-sm font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#64ffda]" /> FETHİYE</div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/30" />
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-6 py-32 space-y-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="w-20 h-1 bg-[#64ffda] mx-auto rounded-full" />
          <p className="text-2xl md:text-3xl text-slate-300 font-medium leading-relaxed italic">
            "{dest.description}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group bg-white/5 border border-white/5 p-12 rounded-[60px] hover:bg-white/10 transition-all duration-500">
            <History className="w-12 h-12 text-[#64ffda] mb-8" />
            <h3 className="text-2xl font-black text-white uppercase italic mb-6">Tarihçe</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{dest.history}</p>
          </div>

          <div className="group bg-white/5 border border-white/5 p-12 rounded-[60px] hover:bg-white/10 transition-all duration-500">
            <Navigation className="w-12 h-12 text-blue-400 mb-8" />
            <h3 className="text-2xl font-black text-white uppercase italic mb-6">Ulaşım</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{dest.transportation}</p>
          </div>
        </div>

        {/* Client-Side Gallery (Interactive Lightbox) */}
        <DestinationGallery title={dest.title} gallery={dest.gallery} />

        {/* Client-Side Comments Area */}
        <DestinationComments 
          destinationId={dest.id} 
          title={dest.title} 
          initialComments={comments || []}
          user={user}
        />
      </section>

      <Footer />
    </main>
  )
}
