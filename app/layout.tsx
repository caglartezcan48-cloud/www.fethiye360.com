import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SystemHealthProvider } from '@/components/providers/system-health-provider'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin", "latin-ext"],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Fethiye 360 | Şehir Rehberi ve İşletme Portalı',
  description: 'Fethiye\'nin en kapsamlı dijital rehberi. 360° sanal turlar, en iyi restoranlar, oteller, gezilecek yerler ve işletme rehberi.',
  keywords: 'Fethiye, Fethiye rehberi, Fethiye işletmeleri, Fethiye restoranlar, Fethiye oteller, Ölüdeniz, sanal tur, 360 derece, tatil rehberi, Likya yolu',
  generator: 'Fethiye360',
  metadataBase: new URL('https://www.fethiye360.com'),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://www.fethiye360.com',
    siteName: 'Fethiye 360',
    title: 'Fethiye 360 | Fethiye\'ye Dair Her Sey',
    description: 'Fethiye\'nin en kapsamli dijital rehberi. Gezi, yeme icme, alisveris, etkinlikler, konaklama ve daha fazlasi.',
    images: [
      {
        url: '/images/fethiye360-logo.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fethiye 360 | Sanal Tur Deneyimi',
    description: 'Fethiye\'nin en güzel noktalarını 360° sanal turlarla keşfedin.',
    images: ['/twitter-image.png'],
  },
  icons: {
    icon: '/images/fethiye360-logo.png',
    apple: '/images/fethiye360-logo.png',
  },
  manifest: '/manifest.json'
}

export const viewport: Viewport = {
  themeColor: '#0a192f',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className="bg-background">
      <head>
        {/* Next.js next/font handles font preconnects automatically */}
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SystemHealthProvider>
          {children}
          <Toaster position="top-center" richColors />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </SystemHealthProvider>
      </body>
    </html>
  )
}
