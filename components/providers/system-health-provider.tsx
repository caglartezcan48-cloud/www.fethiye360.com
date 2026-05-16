'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

export function SystemHealthProvider({ children }: { children: React.ReactNode }) {
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

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  return <>{children}</>
}
