'use client'

import { useState } from 'react'
import { Sun, Thermometer, Pill, Clock, MapPin, ChevronRight, Plus } from 'lucide-react'

export function CityStats() {
  const [weather] = useState({ temp: 24, status: 'Güneşli' })
  const [pharmacies] = useState([
    { name: 'Fethiye Eczanesi', address: 'Atatürk Cad. No:45' },
    { name: 'Kordon Eczanesi', address: 'Kordon Boyu No:12' }
  ])

  return (
    <section className="py-6 bg-[#0a192f]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Hava Durumu Karti - Daha kucuk */}
          <div className="flex items-center justify-between bg-[#112240] rounded-2xl p-6 border border-slate-700/50">
            <div>
              <div className="flex items-center gap-2 text-[#64ffda] font-bold uppercase text-[10px] tracking-widest mb-1">
                <Thermometer className="w-3 h-3" />
                Fethiye'de Hava
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-white">{weather.temp}°</span>
                <span className="text-slate-400 text-sm font-medium">{weather.status}</span>
              </div>
            </div>
            <Sun className="w-12 h-12 text-yellow-500 opacity-50" />
          </div>

          {/* Nöbetçi Eczane Karti - Daha kompakt */}
          <div className="bg-[#112240] rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-[10px] tracking-widest">
                <Pill className="w-3 h-3" />
                Nöbetçi Eczaneler
              </div>
              <div className="text-[10px] text-slate-500">4 Mayıs</div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pharmacies.map((pharmacy, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-[#0a192f]/50 rounded-xl border border-slate-700/30">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-white font-bold text-xs truncate">{pharmacy.name}</div>
                    <div className="text-slate-500 text-[10px] truncate">{pharmacy.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
