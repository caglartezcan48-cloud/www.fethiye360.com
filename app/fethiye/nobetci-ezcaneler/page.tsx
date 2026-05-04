import { Pill, Phone, MapPin, Navigation, X } from 'lucide-react'
import Link from 'next/link'

export default function PharmaciesPage() {
  const pharmacies = [
    { name: 'Likya Eczanesi', address: 'Tuzla Mah.', phone: '0252 614 10 20', distance: '1.2 km' },
    { name: 'Kordon Eczanesi', address: 'Cumhuriyet Mah.', phone: '0252 612 11 22', distance: '2.5 km' },
    { name: 'Merkez Eczanesi', address: 'Atatürk Cad.', phone: '0252 614 00 00', distance: '3.1 km' },
  ]

  return (
    <main className="min-h-screen bg-[#0a192f] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-md bg-[#112240]/80 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl relative z-10 overflow-hidden">
        {/* Kapat Butonu */}
        <Link href="/" className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-red-500 transition-all z-20">
          <X className="w-5 h-5" />
        </Link>

        <div className="p-8">
          <div className="mb-8 pt-4">
            <div className="flex items-center gap-3 mb-2">
              <Pill className="text-red-500 w-6 h-6" />
              <h1 className="text-xl font-bold text-white uppercase tracking-tighter">Nöbetçi Eczaneler</h1>
            </div>
            <p className="text-slate-500 text-xs">Bugün Fethiye genelinde 3 eczane nöbetçi</p>
          </div>

          <div className="space-y-3 mb-6">
            {pharmacies.map((p, i) => (
              <div key={i} className="bg-white/5 rounded-3xl p-4 border border-white/5 hover:border-red-500/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-sm group-hover:text-red-400 transition-colors">{p.name}</h3>
                    <div className="flex items-center gap-1 text-slate-500 text-[10px] mt-1">
                      <MapPin className="w-3 h-3" />
                      {p.address} • {p.distance}
                    </div>
                  </div>
                  <a href={`tel:${p.phone}`} className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all">
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
                <button className="w-full py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all">
                  <Navigation className="w-3 h-3" />
                  YOL TARİFİ AL
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-slate-600 text-[9px] uppercase font-bold tracking-widest">Acil Durum: 112</p>
          </div>
        </div>
      </div>
    </main>
  )
}
