import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SystemHealthProvider } from "@/components/providers/system-health-provider";
import { DeferredProviders } from "@/components/providers/deferred-providers";
import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'latin-ext'], 
  variable: '--font-inter',
  display: 'optional',
  weight: ['400', '500', '700', '900']
});

export const viewport: Viewport = {
  themeColor: "#0a192f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Fethiye 360° | Şehri HD Kalitede Keşfet',
  description: 'Fethiye\'nin en kapsamli dijital rehberi. Gezi, yeme icme, alisveris, etkinlikler, konaklama ve daha fazlasi.',
  metadataBase: new URL('https://www.fethiye360.com'),
  openGraph: {
    title: 'Fethiye 360° | Şehri HD Kalitede Keşfet',
    description: 'Fethiye\'nin en kapsamli dijital rehberi. Gezi, yeme icme, alisveris, etkinlikler, konaklama ve daha fazlasi.',
    images: [
      {
        url: '/images/fethiye360-logo.png',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SystemHealthProvider>
          {children}
          <DeferredProviders />
        </SystemHealthProvider>
      </body>
    </html>
  );
}
