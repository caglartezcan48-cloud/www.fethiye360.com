import { Header } from '@/components/fethiye/header'
import { Hero } from '@/components/fethiye/hero'
import { Footer } from '@/components/fethiye/footer'
import { Pill, Phone, MapPin, Navigation } from 'lucide-react'
import { getPharmacyData } from '@/lib/pharmacy-data'

export default async function PharmaciesPage() {
  const pharmacies = await getPharmacyData();

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />
      <Hero />
      
      <div className="container mx-auto px-4 pb-20 -mt-20 relative z-20 flex justify-center">
        <div className="w-full max-w-md bg-[#112240]/90 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="mb-8 pt-4">
              <div className="flex items-center gap-3 mb-2">
                <Pill className="text-red-500 w-6 h-6" />
                <h1 className="text-xl font-bold text-white uppercase tracking-tighter">Nöbetçi Eczaneler</h1>
              </div>
              <p className="text-slate-500 text-xs">Bugün Fethiye genelinde {pharmacies?.length || 0} eczane nöbetçi</p>
            </div>

            <div className="space-y-3">
              {pharmacies && pharmacies.length > 0 ? (
                pharmacies.map((p: any, i: number) => (
                  <div key={i} className="bg-white/5 rounded-3xl p-4 border border-white/5 hover:border-red-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-bold text-sm group-hover:text-red-400 transition-colors">{p.name}</h3>
                        <div className="flex items-center gap-1 text-slate-500 text-[10px] mt-1">
                          <MapPin className="w-3 h-3" />
                          {p.address}
                        </div>
                      </div>
                      <a href={`tel:${p.phone.replace(/\s/g, '')}`} className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all">
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' ' + p.address + ' Fethiye')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <Navigation className="w-3 h-3" />
                      YOL TARİFİ AL
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-500">
                  Nöbetçi eczane bilgisi şu an alınamıyor.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
