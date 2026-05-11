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
import { TransportationModal } from '@/components/rehber/transportation-modal'

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
      
      {/* Cinematic Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <Image src={dest.main_image} alt={dest.title} fill className="object-cover scale-105 animate-slow-zoom" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a192f]/40 to-[#0a192f]" />
        <div className="relative z-10 text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
            <Sparkles className="w-4 h-4 text-[#64ffda]" />
            <span className="text-white text-xs font-black uppercase tracking-[0.3em]">{dest.category}</span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase italic leading-none">{dest.title}</h1>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/30" />
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 space-y-24">
        {/* Description Section */}
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="w-16 h-1 bg-[#64ffda] mx-auto rounded-full" />
          <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed italic">"{dest.description}"</p>
        </div>

        {/* Dynamic History Section */}
        <div className="group bg-white/5 border border-white/5 p-10 md:p-16 rounded-[60px] md:rounded-[80px] hover:bg-white/10 transition-all duration-700">
          <div className="flex flex-col gap-8">
            <div className="w-16 h-16 bg-[#64ffda]/10 rounded-2xl flex items-center justify-center shrink-0">
              <History className="w-8 h-8 text-[#64ffda]" />
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter">{dest.title} <span className="text-[#64ffda]">Tarihi</span></h3>
              <p className="text-slate-400 leading-relaxed text-lg md:text-xl font-medium">{dest.history}</p>
            </div>
          </div>
        </div>

        {/* HD PHOTO WALL */}
        <DestinationGallery title={dest.title} gallery={dest.gallery} />

        {/* Transportation Modal Trigger */}
        <div className="flex flex-col items-center gap-6 py-10">
          <div className="w-px h-20 bg-gradient-to-b from-[#64ffda] to-transparent" />
          <TransportationModal transportation={dest.transportation} />
        </div>

        {/* Comments */}
        <DestinationComments destinationId={dest.id} title={dest.title} initialComments={comments || []} user={user} />
      </section>

      <Footer />
    </main>
  )
}
