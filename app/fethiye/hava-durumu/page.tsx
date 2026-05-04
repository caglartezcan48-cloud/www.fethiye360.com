import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { Sun, Cloud, CloudRain, Thermometer, Wind, Droplets, Sunrise, Sunset } from 'lucide-react'

export default function WeatherPage() {
  const forecast = [
    { day: 'Pazartesi', temp: 24, status: 'Güneşli', icon: <Sun className="w-8 h-8 text-yellow-500" /> },
    { day: 'Salı', temp: 22, status: 'Parçalı Bulutlu', icon: <Cloud className="w-8 h-8 text-slate-400" /> },
    { day: 'Çarşamba', temp: 21, status: 'Hafif Yağmurlu', icon: <CloudRain className="w-8 h-8 text-blue-400" /> },
    { day: 'Perşembe', temp: 25, status: 'Güneşli', icon: <Sun className="w-8 h-8 text-yellow-500" /> },
    { day: 'Cuma', temp: 26, status: 'Açık', icon: <Sun className="w-8 h-8 text-yellow-500" /> },
  ]

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-bold text-white mb-8">Fethiye Hava Durumu</h1>
        
        {/* Main Card */}
        <div className="bg-[#112240] rounded-3xl border border-slate-700/50 p-8 md:p-12 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Sun className="w-64 h-64 text-yellow-500" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-8xl md:text-9xl font-bold text-white mb-4">24°</div>
              <div className="text-2xl text-[#64ffda] font-medium mb-8">Güneşli • Fethiye, Muğla</div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">Nem</div>
                    <div className="text-white font-bold">%45</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">Rüzgar</div>
                    <div className="text-white font-bold">12 km/s</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0a192f]/50 rounded-2xl p-8 border border-slate-700/30">
              <h3 className="text-white font-bold mb-6">Günün Detayları</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 flex items-center gap-2"><Sunrise className="w-4 h-4" /> Gün Doğumu</span>
                  <span className="text-white font-bold">06:12</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 flex items-center gap-2"><Sunset className="w-4 h-4" /> Gün Batımı</span>
                  <span className="text-white font-bold">19:45</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 flex items-center gap-2"><Thermometer className="w-4 h-4" /> En Yüksek</span>
                  <span className="text-white font-bold text-red-400">26°</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 flex items-center gap-2"><Thermometer className="w-4 h-4" /> En Düşük</span>
                  <span className="text-white font-bold text-blue-400">18°</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Day Forecast */}
        <h2 className="text-2xl font-bold text-white mb-6">5 Günlük Tahmin</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {forecast.map((f, i) => (
            <div key={i} className="bg-[#112240] rounded-2xl border border-slate-700/50 p-6 text-center hover:border-[#64ffda]/30 transition-all">
              <div className="text-slate-500 text-xs font-bold uppercase mb-4">{f.day}</div>
              <div className="mb-4 flex justify-center">{f.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">{f.temp}°</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-tighter">{f.status}</div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
