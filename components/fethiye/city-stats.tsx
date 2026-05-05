'use client'

import { useState, useEffect } from 'react'
import { Sun, Pill, MapPin, Thermometer } from 'lucide-react'

export function CityStats() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/city-stats')
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error('City stats fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !data) return (
    <div className="bg-[#112240]/50 backdrop-blur-sm border-b border-slate-700/30 py-2 h-10 animate-pulse" />
  )

  const { weather, pharmacies } = data

  return (
    <div className="bg-[#112240]/50 backdrop-blur-sm border-b border-slate-700/30 py-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Hava ve Deniz - Slim */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-500" />
              <span className="text-white font-bold text-sm">{weather?.current?.temp}°C</span>
              <span className="text-slate-400 text-[10px] hidden sm:inline">Hava</span>
            </div>
            
            <div className="flex items-center gap-2 border-l border-slate-700 pl-6">
              <Thermometer className="w-4 h-4 text-blue-400" />
              <span className="text-white font-bold text-sm">{weather?.current?.seaTemp}°C</span>
              <span className="text-slate-400 text-[10px] hidden sm:inline">Deniz</span>
            </div>

            <div className="h-4 w-[1px] bg-slate-700 hidden md:block" />
            <div className="hidden md:flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Fethiye
            </div>
          </div>

          {/* Eczaneler - Slim */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-[10px] tracking-widest">
              <Pill className="w-3 h-3" />
              <span className="hidden sm:inline">Nöbetçi Eczaneler:</span>
              <span className="sm:hidden">Nöbetçi:</span>
            </div>
            <div className="flex gap-4 overflow-hidden">
              {pharmacies?.slice(0, 2).map((pharmacy: any, i: number) => (
                <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-white text-xs font-medium">{pharmacy.name}</span>
                  <span className="text-slate-500 text-[10px] hidden lg:flex items-center gap-1">
                    <MapPin className="w-2 h-2" />
                    {pharmacy.address.length > 20 ? pharmacy.address.substring(0, 20) + '...' : pharmacy.address}
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
