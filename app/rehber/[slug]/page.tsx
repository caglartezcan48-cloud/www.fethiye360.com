import { createClient } from '@/lib/supabase/server'
import { Header } from "@/components/fethiye/header"
import { Footer } from "@/components/fethiye/footer"
import Image from "next/image"
import { 
  MapPin, 
  History, 
  Sparkles,
  ChevronDown,
  ArrowLeft,
  Share2,
  Bookmark
} from "lucide-react"
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DestinationGallery } from '@/components/rehber/destination-gallery'
import { DestinationComments } from '@/components/rehber/destination-comments'
import { ALL_ACTIVITIES } from '@/lib/planner-data'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: dest } = await supabase.from('destinations').select('*').eq('slug', slug).single()
  if (!dest) return {}

  const enrichedData = ALL_ACTIVITIES.find(a => 
    a.id === slug || 
    a.id.replace(/-/g, '') === slug.replace(/-/g, '') ||
    (dest && a.title.toLowerCase() === dest.title.toLowerCase())
  )

  return {
    title: `${dest.title} | Fethiye360 Rehber`,
    description: enrichedData?.description || dest.description,
  }
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params
  if (!slug) notFound()

  const supabase = await createClient()
  const { data: dbDest, error } = await supabase.from('destinations').select('*').eq('slug', slug).single()

  // Planner verisinden daha zengin açıklamayı çek
  const enrichedData = ALL_ACTIVITIES.find(a => 
    a.id === slug || 
    a.id.replace(/-/g, '') === slug.replace(/-/g, '') ||
    a.title.toLowerCase() === dbDest?.title?.toLowerCase()
  )

  // Ne DB'de ne de Planner'da yoksa 404
  if (!dbDest && !enrichedData) notFound()

  // Veri önceliği: Veritabanı (Admin Paneli) > Enriched (Statik Dosya)
  const dest = {
    id: dbDest?.id || enrichedData?.id || 'temp-id',
    title: dbDest?.title || enrichedData?.title || 'İsimsiz Konum',
    description: dbDest?.description && dbDest.description.length > 50 ? dbDest.description : (enrichedData?.description || ''),
    history: dbDest?.history && dbDest.history.length > 100 ? dbDest.history : (enrichedData?.description || ''),
    main_image: dbDest?.main_image || enrichedData?.image || 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=600&q=75&fm=webp&fit=crop',
    category: dbDest?.category || enrichedData?.category || 'Genel',
    gallery: dbDest?.gallery || [],
  }

  const displayDescription = dest.description
  const displayHistory = dest.history

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
      
      <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <Image 
          src={dest.main_image} 
          alt={dest.title}
          fill
          sizes="100vw"
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/20 to-[#0a192f]/60" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 mt-12">
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-6 bg-[#64ffda]/50" />
              <span className="text-[#64ffda] text-[10px] font-black uppercase tracking-[0.4em]">{dest.category}</span>
              <span className="h-px w-6 bg-[#64ffda]/50" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-2xl">
              {dest.title}
            </h1>
            <div className="flex items-center justify-center gap-2 text-[#64ffda] text-[10px] font-black uppercase tracking-[0.2em] bg-[#0a192f]/40 backdrop-blur-md px-4 py-2 rounded-full w-fit mx-auto">
              <MapPin className="w-3 h-3" /> FETHİYE / MUĞLA
            </div>
          </div>
        </div>

        {/* Navigation Overlay */}
        <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
          <Link 
            href="/rehber"
            className="group flex items-center gap-3 text-white/70 hover:text-[#64ffda] transition-all"
          >
            <div className="p-3 bg-[#0a192f]/60 backdrop-blur-xl rounded-2xl group-hover:scale-110 transition-all border border-white/5">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Rehbere Dön</span>
          </Link>
          
          <div className="flex gap-3">
            <button className="p-4 bg-[#0a192f]/60 backdrop-blur-xl rounded-2xl text-white/70 hover:text-[#64ffda] border border-white/5 transition-all hover:scale-110">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-4 bg-[#0a192f]/60 backdrop-blur-xl rounded-2xl text-white/70 hover:text-[#64ffda] border border-white/5 transition-all hover:scale-110">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        
        {/* Spot Description - Only first sentence */}
        <div className="max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl text-white font-medium leading-relaxed text-center italic opacity-95">
            {displayDescription.split('.')[0]}.
          </p>
          <div className="w-12 h-1 bg-[#64ffda] mx-auto mt-6 rounded-full opacity-50" />
        </div>

        {/* Detailed Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-4">
          <div className="md:col-span-12 space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-[10px] font-black text-[#64ffda] uppercase tracking-[0.4em] whitespace-nowrap">BÖLGE HAKKINDA</h3>
              <div className="h-px w-full bg-white/5" />
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-400 leading-relaxed text-lg font-light first-letter:text-5xl first-letter:font-black first-letter:text-[#64ffda] first-letter:mr-3 first-letter:float-left">
                {displayHistory}
              </p>
            </div>
          </div>
        </div>

        {/* PHOTO WALL */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <h3 className="text-[10px] font-black text-[#64ffda] uppercase tracking-[0.4em] whitespace-nowrap">GALERİ</h3>
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
          <div className="w-full h-[250px] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl relative grayscale hover:grayscale-0 transition-all duration-700">
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
