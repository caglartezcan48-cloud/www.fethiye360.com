'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'
import { Search, Home, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // 404 hatasini raporla
    logger.warn(`Sayfa Bulunamadı (404)`, {
      url: typeof window !== 'undefined' ? window.location.href : 'Bilinmeyen'
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <h1 className="text-[150px] font-black text-white/5 leading-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-[#64ffda]/10 rounded-full flex items-center justify-center border border-[#64ffda]/20">
              <Search className="w-10 h-10 text-[#64ffda]" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Sayfa <span className="text-[#64ffda]">Bulunamadı</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full bg-[#64ffda] text-[#0a192f] font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-[#52e0c4] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
          <button
            onClick={() => router.back()}
            className="w-full bg-white/5 text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-white/10 transition-all border border-white/5 flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Geri Git
          </button>
        </div>
      </div>
    </div>
  )
}
