'use client'

import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'

function CloudIcon() {
  return <svg className="w-3.5 h-3.5 text-[#64ffda]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19x3.5-3.5A5 5 0 0 0 13 7 7 7 0 0 0 2 13c0 3.6 2.8 6.6 6.5 7h9Z"/></svg>
}

function ThermoIcon() {
  return <svg className="w-3.5 h-3.5 text-[#64ffda]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 1 1 4 0Z"/></svg>
}

// Weather code to text mapping (extracted from lib/city-data for client-side use)
function getWeatherStatus(code: number) {
  if (code === 0) return 'Güneşli';
  if (code >= 1 && code <= 3) return 'Parçalı Bulutlu';
  if (code >= 45 && code <= 48) return 'Sisli';
  if (code >= 51 && code <= 67) return 'Yağmurlu';
  if (code >= 71 && code <= 77) return 'Karlı';
  if (code >= 80 && code <= 82) return 'Sağanak Yağış';
  if (code >= 95) return 'Fırtınalı';
  return 'Açık';
}

export function CityStats() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // Fetch city data on the client side to keep TTFB low for 100 PageSpeed score
    fetch('/api/city-stats')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('City stats fetch error:', err))
  }, [])

  const date = new Date().toLocaleDateString('tr-TR', { 
    day: 'numeric', 
    month: 'long', 
    weekday: 'long' 
  })

  // Get the first pharmacy name from the list
  const pharmacyName = data?.pharmacies?.[0]?.name || 'Yükleniyor...'
  const temp = data?.weather?.current?.temp || '24'
  const condition = getWeatherStatus(data?.weather?.current?.conditionCode || 0)

  return (
    <div className="bg-[#0a192f]/80 backdrop-blur-md border-b border-white/5 py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-8 whitespace-nowrap">
          {/* Left: Weather & Date */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-[#64ffda]" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{date}</span>
            </div>
            
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <div className="flex items-center gap-2">
                <CloudIcon />
                <span className="text-[10px] font-bold text-white uppercase">{condition}</span>
              </div>
              <div className="flex items-center gap-2">
                <ThermoIcon />
                <span className="text-[10px] font-bold text-[#64ffda]">{temp}°C</span>
              </div>
            </div>
          </div>

          {/* Center: Running Text / News */}
          <div className="hidden md:flex flex-1 max-w-xl overflow-hidden relative">
            <div className="animate-marquee whitespace-nowrap flex gap-12 text-[10px] font-medium text-slate-500 uppercase tracking-widest">
              <span>Fethiye 360° Dijital Şehir Rehberi'ne Hoş Geldiniz</span>
              <span>•</span>
              <span>Şu an Fethiye'de 12 noktada sanal tur aktif</span>
              <span>•</span>
              <span>Ölüdeniz'de hava durumu muhteşem</span>
              <span>•</span>
              <span>Yeni işletmeler rehbere eklendi</span>
            </div>
          </div>

          {/* Right: Pharmacy */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-tighter">Nöbetçi Eczane:</span>
            <span className="text-[10px] font-bold text-[#64ffda] uppercase">{pharmacyName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
