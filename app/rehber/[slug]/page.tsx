import { createClient } from '@/lib/supabase/server'
import { Header } from "@/components/fethiye/header"
import { Footer } from "@/components/fethiye/footer"
import Image from "next/image"
import { 
  MapPin, 
  History, 
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
  const { slug } = await params
  if (!slug) notFound()

  const supabase = await createClient()
  const { data: dest, error } = await supabase.from('destinations').select('*').eq('slug', slug).single()

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
      
      {/* ELITE HERO - Magazine Style */}
      <section className="relative h-[70vh] w-full flex flex-col items-center justify-center overflow-hidden">
        <Image src={dest.main_image} alt={dest.title} fill className="object-cover scale-100 brightness-75" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent" />
        
        <div className="relative z-10 text-center space-y-8 px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="h-px w-8 bg-[#64ffda]/50" />
            <span className="text-[#64ffda] text-[10px] font-black uppercase tracking-[0.5em]">{dest.category}</span>
            <span className="h-px w-8 bg-[#64ffda]/50" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light text-white tracking-[0.1em] uppercase leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {dest.title}
          </h1>

          <div className="flex items-center justify-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <MapPin className="w-3 h-3" /> FETHİYE / MUĞLA
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20">
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-24 space-y-24">
        {/* Elite Description */}
        <div className="space-y-12">
          <div className="flex justify-center">
            <Sparkles className="w-6 h-6 text-[#64ffda]/20" />
          </div>
          <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed text-center italic opacity-80">
            "{dest.description}"
          </p>
        </div>

        {/* Minimal History Section */}
        <div className="space-y-12">
          <div className="flex items-center gap-6">
            <h3 className="text-xs font-black text-[#64ffda] uppercase tracking-[0.4em] whitespace-nowrap">HİKAYESİ</h3>
            <div className="h-px w-full bg-white/5" />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-wide uppercase italic">
              Zamanın Ötesinde <span className="text-[#64ffda]/60">{dest.title}</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg font-light first-letter:text-5xl first-letter:font-black first-letter:text-[#64ffda] first-letter:mr-3 first-letter:float-left">
              {dest.history}
            </p>
          </div>
        </div>

        {/* PHOTO WALL */}
        <div className="space-y-12">
          <div className="flex items-center gap-6">
            <h3 className="text-xs font-black text-[#64ffda] uppercase tracking-[0.4em] whitespace-nowrap">GALERİ</h3>
            <div className="h-px w-full bg-white/5" />
          </div>
          <DestinationGallery title={dest.title} gallery={dest.gallery} />
        </div>

        {/* Elite Comments Area */}
        <div className="space-y-12 pt-12">
          <div className="flex items-center gap-6">
            <h3 className="text-xs font-black text-[#64ffda] uppercase tracking-[0.4em] whitespace-nowrap">DENEYİMLER</h3>
            <div className="h-px w-full bg-white/5" />
          </div>
          <DestinationComments destinationId={dest.id} title={dest.title} initialComments={comments || []} user={user} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
