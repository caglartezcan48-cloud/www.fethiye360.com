import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { MapPin, Sparkles, ChevronRight, Camera, Star } from 'lucide-react'
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
    <main className="min-h-screen bg-[#0a192f] selection:bg-[#64ffda] selection:text-[#0a192f]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=1920&q=90" 
          alt="Fethiye Rehber" 
          fill 
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/60 via-transparent to-[#0a192f]" />
        
        <div className="relative z-10 text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
            <Sparkles className="w-4 h-4 text-[#64ffda]" />
            <span className="text-white text-xs font-black uppercase tracking-[0.3em]">GEZİ REHBERİ</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
            EŞSİZ <span className="text-[#64ffda]">DENEYİMLER</span>
          </h1>
          <p className="text-white/60 text-lg font-medium italic tracking-wide">Fethiye'nin saklı cennetlerini keşfe çıkın</p>
        </div>
      </section>

      {/* Main Grid - Home Page Style */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations?.map((dest) => (
            <Link 
              key={dest.id}
              href={`/rehber/${dest.slug}`}
              className="group relative h-[500px] w-full rounded-[40px] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:shadow-[#64ffda]/10"
            >
              <Image 
                src={dest.main_image} 
                alt={dest.title} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110 brightness-90 group-hover:brightness-100"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-4 py-1 rounded-full bg-[#64ffda] text-[#0a192f] text-[9px] font-black uppercase tracking-widest">
                    {dest.category}
                  </span>
                  <div className="flex items-center gap-1 text-[#64ffda]">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[10px] font-bold">4.9</span>
                  </div>
                </div>
                
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter transform group-hover:translate-x-2 transition-transform duration-500">
                  {dest.title}
                </h3>
                
                <p className="text-slate-300 text-sm line-clamp-2 italic font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  {dest.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-white/40 text-[9px] font-black uppercase tracking-widest">
                      <MapPin className="w-3 h-3 text-[#64ffda]" /> Fethiye
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#64ffda] group-hover:text-[#0a192f] transition-all">
                    <ChevronRight className="w-5 h-5" />
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
