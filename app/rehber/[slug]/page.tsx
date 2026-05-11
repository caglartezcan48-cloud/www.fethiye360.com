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
      
      {/* CLEAN HERO - No Text Overlay */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <Image src={dest.main_image} alt={dest.title} fill className="object-cover scale-100" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-60" />
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-20 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-20 space-y-24">
        
        {/* Title & Category - Inside Content */}
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-[#64ffda]/30" />
            <span className="text-[#64ffda] text-[10px] font-black uppercase tracking-[0.5em]">{dest.category}</span>
            <span className="h-px w-8 bg-[#64ffda]/30" />
          </div>
          <h1 className="text-4xl md:text-6xl font-light text-white tracking-[0.1em] uppercase">
            {dest.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/40 text-[9px] font-bold uppercase tracking-[0.3em]">
            <MapPin className="w-3 h-3 text-[#64ffda]" /> FETHİYE / MUĞLA
          </div>
        </div>

        {/* Elite Description */}
        <div className="space-y-8">
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

        {/* MAP SECTION */}
        <div className="space-y-12">
          <div className="flex items-center gap-6">
            <h3 className="text-xs font-black text-[#64ffda] uppercase tracking-[0.4em] whitespace-nowrap">KONUM</h3>
            <div className="h-px w-full bg-white/5" />
          </div>
          <div className="w-full h-[400px] rounded-[40px] overflow-hidden border border-white/5 shadow-2xl relative grayscale hover:grayscale-0 transition-all duration-700">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(dest.title + ' Fethiye')}&output=embed`}
            />
          </div>
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
