'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Hatayi veritabanina raporla
    logger.error(`Sistem Hatası: ${error.message}`, {
      digest: error.digest,
      stack: error.stack
    })
  }, [error])

  return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#112240] border border-white/5 rounded-[40px] p-12 text-center space-y-8 shadow-2xl">
        <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-10 h-10 text-orange-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Bir Şeyler <span className="text-orange-500">Yanlış Gitti</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Sistem bu hatayı otomatik olarak admin panelimize raporladı. Ekibimiz ilgileniyor.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-[#64ffda] text-[#0a192f] font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-[#52e0c4] transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="w-full bg-white/5 text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-white/10 transition-all border border-white/5 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
        </div>

        <p className="text-[10px] text-slate-600 font-mono italic">
          Hata Kodu: {error.digest || 'Sistem Hatası'}
        </p>
      </div>
    </div>
  )
}
