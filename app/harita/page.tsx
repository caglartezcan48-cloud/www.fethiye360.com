import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { MapPin, Navigation, Sparkles, Compass } from 'lucide-react'

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#0a192f] selection:bg-[#64ffda] selection:text-[#0a192f]">
      <Header />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#64ffda]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <section className="relative pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
              <Sparkles className="w-4 h-4 text-[#64ffda]" />
              <span className="text-white text-xs font-black uppercase tracking-[0.3em]">İnteraktif Fethiye</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
              DİJİTAL <span className="text-[#64ffda]">HARİTA</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium italic">
              Fethiye'nin tüm hazinelerini, işletmelerini ve gizli koylarını harita üzerinde keşfedin.
            </p>
          </div>

          {/* Interactive Map Placeholder / Coming Soon */}
          <div className="relative w-full h-[600px] bg-white/5 border border-white/10 rounded-[60px] overflow-hidden group shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center space-y-8 p-12">
            <div className="relative">
              <div className="absolute inset-0 bg-[#64ffda]/20 rounded-full blur-[60px] animate-pulse" />
              <div className="relative w-32 h-32 bg-[#64ffda] rounded-[40px] flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-700 shadow-2xl shadow-[#64ffda]/40">
                <Compass className="w-16 h-16 text-[#0a192f] animate-spin-slow" />
              </div>
            </div>
            
            <div className="text-center space-y-4 max-w-md">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Harita Modülü Hazırlanıyor</h3>
              <p className="text-slate-500 font-medium">Google Maps API entegrasyonu ve 360° sanal tur noktaları çok yakında burada olacak.</p>
              
              <div className="pt-8 flex flex-wrap justify-center gap-4">
                <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] text-white font-black uppercase tracking-widest">
                   50+ Destinasyon
                </div>
                <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] text-white font-black uppercase tracking-widest">
                   100+ İşletme
                </div>
                <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] text-white font-black uppercase tracking-widest">
                   Canlı Konum
                </div>
              </div>
            </div>

            {/* Simulated Map Grid Background */}
            <div className="absolute inset-0 -z-10 opacity-20" 
                 style={{ backgroundImage: 'radial-gradient(#64ffda 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} 
            />
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
