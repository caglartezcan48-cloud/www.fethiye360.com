import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { Pill, Phone, MapPin, Navigation, Clock, Search, Navigation2 } from 'lucide-react'

export default function PharmaciesPage() {
  const pharmacies = [
    { name: 'Likya Eczanesi', address: 'Tuzla Mah. İnönü Bulvarı No:67', phone: '0252 614 10 20', distance: '1.2 km' },
    { name: 'Kordon Eczanesi', address: 'Cumhuriyet Mah. Kordon Boyu No:12', phone: '0252 612 11 22', distance: '2.5 km' },
    { name: 'Fethiye Merkez Eczanesi', address: 'Atatürk Cad. No:45', phone: '0252 614 00 00', distance: '3.1 km' },
    { name: 'Ölüdeniz Eczanesi', address: 'Ölüdeniz Mah. Çarşı Cad.', phone: '0252 617 01 02', distance: '12.5 km' },
  ]

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Pill className="text-red-500 w-10 h-10" />
              Nöbetçi Eczaneler
            </h1>
            <p className="text-slate-400">Bugün: 4 Mayıs, Fethiye genelindeki nöbetçi eczaneler listesi</p>
          </div>
          
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-red-600/20 transition-all transform hover:scale-[1.02]">
            <Navigation2 className="w-5 h-5" />
            En Yakın Eczaneyi Bul
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Pharmacy List */}
          <div className="lg:col-span-8 space-y-4">
            {pharmacies.map((p, i) => (
              <div key={i} className="bg-[#112240] rounded-2xl border border-slate-700/50 p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-red-500/30 transition-all group">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shrink-0">
                    <Pill className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      {p.address}
                    </div>
                    <div className="flex gap-3">
                      <span className="px-3 py-1 rounded-lg bg-[#0a192f] text-slate-400 text-xs font-medium border border-slate-700">
                        {p.distance} Uzaklıkta
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
                        Şu An Açık
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a href={`tel:${p.phone}`} className="flex-1 md:flex-none px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <Phone className="w-4 h-4" />
                    Ara
                  </a>
                  <button className="flex-1 md:flex-none px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <Navigation className="w-4 h-4" />
                    Yol Tarifi
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-8">
              <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Nöbet Saatleri
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Nöbetçi eczaneler hafta içi saat 19:00'dan, hafta sonu ise tüm gün boyunca hizmet vermektedir. Acil durumlarda lütfen telefonla teyit ediniz.
              </p>
            </div>
            
            <div className="bg-[#112240] border border-slate-700/50 rounded-3xl p-8">
              <h3 className="text-white font-bold mb-6">Fethiye Acil Numaralar</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-[#0a192f] rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-sm">Ambulans</span>
                  <span className="text-red-500 font-bold">112</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#0a192f] rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-sm">Polis İmdat</span>
                  <span className="text-white font-bold">155</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#0a192f] rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-sm">İtfaiye</span>
                  <span className="text-white font-bold">110</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
