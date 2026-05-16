"use client"

import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/react'

export function DeferredProviders() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    // Delay loading of non-critical providers to clear the main thread for LCP
    const timer = setTimeout(() => {
      setMounted(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  return (
    <>
      <Toaster position="top-center" richColors />
      {process.env.NODE_ENV === 'production' && <Analytics />}
    </>
  )
}
