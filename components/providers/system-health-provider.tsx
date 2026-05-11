'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/client'

export function SystemHealthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  useEffect(() => {
    // 1. Global Hatalari Yakala
    const handleError = (event: ErrorEvent) => {
      logger.error(`Arayüz Hatası: ${event.message}`, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      })
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      logger.error(`Promise Hatası: ${event.reason?.message || 'Bilinmeyen Hata'}`, {
        reason: event.reason?.stack || event.reason
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    // 2. Şüpheli Hareketleri İzle (Security sensor)
    // Örn: Console'u çok kurcalayanlar veya gizli sayfaları arayanlar
    const checkSecurity = () => {
      // Basit bir bot/hacking tarama denemesi (Ornek olarak)
      if (window.location.search.includes('script') || window.location.search.includes('select%20')) {
        logger.security('Şüpheli URL parametresi tespit edildi (SQL/JS Injection Denemesi)', {
          url: window.location.href
        })
      }
    }

    checkSecurity()

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  return <>{children}</>
}
