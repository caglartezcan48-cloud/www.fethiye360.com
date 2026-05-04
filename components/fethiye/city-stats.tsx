'use client'

import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Thermometer, Pill, Clock, MapPin, ChevronRight } from 'lucide-react'

export function CityStats() {
  const [weather, setWeather] = useState({ temp: 24, status: 'Güneşli', icon: 'sun' })
  const [pharmacies, setPharmacies] = useState([
    { name: 'Fethiye Eczanesi', address: 'Atatürk Cad. No:45', phone: '0252 614 00 00' },
    { name: 'Kordon Eczanesi', address: 'Kordon Boyu No:12', phone: '0252 612 11 22' }
  ])

  // Gercek bir projede burada OpenWeatherMap veya benzeri bir servisten veri cekilir
  // Simdilik şık bir statik gorunum ve yapi kuruyoruz

  return (
    <section className="py-12 bg-[#0a192f]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Hava Durumu Karti */}
          <div className="relative group overflow-hidden bg-gradient-to-br from-[#112240] to-[#0a192f] rounded-3xl p-8 border border-slate-700/50 hover:border-[#64ffda]/30 transition-all shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sun className="w-32 h-32 text-yellow-500" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[#64ffda] font-bold uppercase text-xs tracking-widest mb-6">
                <Thermometer className="w-4 h-4" />
                Fethiye'de Hava
              </div>
              
              <div className="flex items-end gap-4">
                <div className="text-6xl md:text-7xl font-bold text-white leading-none">
                  {weather.temp}°
                </div>
                <div className="pb-2">
                  <div className="text-xl font-bold text-white mb-1">{weather.status}</div>
                  <div className="text-slate-400 text-sm">Bugün Fethiye</div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-6 border-t border-slate-700/50 pt-6">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs uppercase font-bold tracking-tighter">Nem</span>
                  <span className="text-white font-medium">%45</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs uppercase font-bold tracking-tighter">Rüzgar</span>
                  <span className="text-white font-medium">12 km/s</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs uppercase font-bold tracking-tighter">Deniz</span>
                  <span className="text-white font-medium">21°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nöbetçi Eczane Karti */}
          <div className="relative group overflow-hidden bg-[#112240] rounded-3xl p-8 border border-slate-700/50 hover:border-red-500/30 transition-all shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs tracking-widest">
                <Pill className="w-4 h-4" />
                Nöbetçi Eczaneler
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Bugün: 4 Mayıs
              </div>
            </div>
            
            <div className="space-y-4">
              {pharmacies.map((pharmacy, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#0a192f]/50 rounded-2xl border border-slate-700/30 group/item hover:bg-red-500/5 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover/item:bg-red-500 group-hover/item:text-white transition-all">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{pharmacy.name}</div>
                      <div className="text-slate-400 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {pharmacy.address}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover/item:text-red-500 transition-colors" />
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 text-slate-400 text-xs font-medium hover:text-white transition-colors">
              Tüm Listeyi Gör
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
