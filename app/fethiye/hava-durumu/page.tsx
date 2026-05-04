import { Header } from '@/components/fethiye/header'
import { Hero } from '@/components/fethiye/hero'
import { Footer } from '@/components/fethiye/footer'
import { Sun, Cloud, CloudRain, Thermometer, Wind, Droplets, X } from 'lucide-react'
import Link from 'next/link'

export default function WeatherPage() {
  const forecast = [
    { day: 'Pzt', temp: 24, icon: <Sun className="w-5 h-5 text-yellow-500" /> },
    { day: 'Sal', temp: 22, icon: <Cloud className="w-5 h-5 text-slate-400" /> },
    { day: 'Çar', temp: 21, icon: <CloudRain className="w-5 h-5 text-blue-400" /> },
    { day: 'Per', temp: 25, icon: <Sun className="w-5 h-5 text-yellow-500" /> },
    { day: 'Cum', temp: 26, icon: <Sun className="w-5 h-5 text-yellow-500" /> },
  ]

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />
      <Hero />
      
      <div className="container mx-auto px-4 pb-20 -mt-20 relative z-20 flex justify-center">
        <div className="w-full max-w-md bg-[#112240]/90 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-10 pt-4">
              <p className="text-[#64ffda] font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Fethiye Hava Durumu</p>
              <div className="flex items-center justify-center gap-6">
                <Sun className="w-16 h-16 text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]" />
                <div className="text-7xl font-bold text-white tracking-tighter">24°</div>
              </div>
              <p className="text-slate-400 text-sm mt-2 font-medium">Güneşli ve Açık</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-10">
              <div className="bg-white/5 rounded-3xl p-4 border border-white/5 flex items-center gap-3">
                <Droplets className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-slate-500 text-[9px] uppercase font-bold">Nem</p>
                  <p className="text-white font-bold text-sm">%45</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-3xl p-4 border border-white/5 flex items-center gap-3">
                <Wind className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-slate-500 text-[9px] uppercase font-bold">Rüzgar</p>
                  <p className="text-white font-bold text-sm">12 km/s</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-[32px] p-6 border border-white/5">
              <div className="flex justify-between">
                {forecast.map((f, i) => (
                  <div key={i} className="text-center">
                    <p className="text-slate-500 text-[10px] font-bold mb-3">{f.day}</p>
                    <div className="mb-2 flex justify-center">{f.icon}</div>
                    <p className="text-white font-bold text-sm">{f.temp}°</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
