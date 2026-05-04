'use client'

import { useState } from 'react'
import { Sun, Pill, MapPin, Plus } from 'lucide-react'

export function CityStats() {
  const [weather] = useState({ temp: 24, status: 'Güneşli' })
  const [pharmacies] = useState([
    { name: 'Fethiye Ecz.', address: 'Atatürk Cad.' },
    { name: 'Kordon Ecz.', address: 'Kordon Boyu' }
  ])

  return (
    <div className="bg-[#112240]/50 backdrop-blur-sm border-b border-slate-700/30 py-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Hava Durumu - Slim */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-500" />
              <span className="text-white font-bold text-sm">{weather.temp}°C</span>
              <span className="text-slate-400 text-xs">{weather.status}</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-700" />
            <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Fethiye
            </div>
          </div>

          {/* Eczaneler - Slim */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-[10px] tracking-widest">
              <Pill className="w-3 h-3" />
              Nöbetçi Eczaneler:
            </div>
            <div className="flex gap-4">
              {pharmacies.map((pharmacy, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-white text-xs font-medium">{pharmacy.name}</span>
                  <span className="text-slate-500 text-[10px] flex items-center gap-1">
                    <MapPin className="w-2 h-2" />
                    {pharmacy.address}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
