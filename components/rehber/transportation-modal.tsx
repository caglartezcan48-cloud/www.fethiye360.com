'use client'

import { useState } from 'react'
import { Navigation, X, MapPin } from "lucide-react"

interface Props {
  transportation: string
}

export function TransportationModal({ transportation }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  if (!transportation) return null

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 rounded-full hover:bg-[#64ffda] hover:border-[#64ffda] transition-all duration-500 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#64ffda] to-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        <Navigation className="relative z-10 w-5 h-5 text-[#64ffda] group-hover:text-[#0a192f] transition-colors" />
        <span className="relative z-10 text-white group-hover:text-[#0a192f] font-black uppercase tracking-widest text-[10px] transition-colors">Nasıl Gidilir?</span>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[1000] bg-[#0a192f]/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-[#112240] border border-white/10 p-12 rounded-[60px] max-w-xl w-full relative shadow-2xl animate-in zoom-in-95 duration-500"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 p-3 bg-white/5 text-white rounded-2xl hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-8 text-center">
              <div className="w-20 h-20 bg-[#64ffda]/10 rounded-[32px] flex items-center justify-center mx-auto">
                <MapPin className="w-10 h-10 text-[#64ffda]" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Ulaşım <span className="text-[#64ffda]">Rehberi</span></h3>
                <p className="text-slate-400 text-lg leading-relaxed italic">
                  {transportation}
                </p>
              </div>

              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">İyi Yolculuklar Dileriz</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
