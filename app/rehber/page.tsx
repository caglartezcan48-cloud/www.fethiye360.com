import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { MapPin, Sparkles, ChevronRight, Camera } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function GuidePage() {
  const supabase = await createClient()
  
  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#64ffda]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
            <Sparkles className="w-4 h-4 text-[#64ffda]" />
            <span className="text-[#64ffda] text-[10px] font-black uppercase tracking-widest">Fethiye Gezi Rehberi</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
            Keşfedilmeyi <span className="text-[#64ffda]">Bekleyen</span> Dünyalar
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium italic">
            Fethiye'nin saklı cennetlerinden antik kentlerine kadar her köşesini HD görseller ve derinlemesine hikayelerle keşfedin.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {destinations?.map((dest) => (
            <Link 
              key={dest.id}
              href={`/rehber/${dest.slug}`}
              className="group relative flex flex-col space-y-6 animate-in fade-in duration-700"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[40px] border border-white/5 bg-white/5">
                <Image 
                  src={dest.main_image} 
                  alt={dest.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-60" />
                
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white text-[9px] font-black uppercase tracking-widest">
                  {dest.category}
                </div>
              </div>

              <div className="space-y-3 px-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-[#64ffda] transition-colors">
                    {dest.title}
                  </h3>
                  <div className="p-2 rounded-full bg-white/5 text-white opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-slate-500 text-sm line-clamp-2 italic font-medium">
                  {dest.description}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <MapPin className="w-3 h-3 text-[#64ffda]" /> Fethiye
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Camera className="w-3 h-3 text-[#64ffda]" /> HD Galeri
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {(!destinations || destinations.length === 0) && (
          <div className="text-center py-32 bg-white/5 rounded-[60px] border border-dashed border-white/10">
            <h2 className="text-2xl font-bold text-white mb-2 uppercase italic">Henüz Rehber Eklenmedi</h2>
            <p className="text-slate-500">Admin panelinden ilk gezi noktanızı ekleyebilirsiniz.</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
