import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SystemHealthProvider } from "@/components/providers/system-health-provider";
import { DeferredProviders } from "@/components/providers/deferred-providers";
import './globals.css'

import { createClient } from "@/lib/supabase/server";
import { ThemeHydrator } from "@/components/fethiye/theme-hydrator";

const inter = Inter({ 
  subsets: ['latin', 'latin-ext'], 
  variable: '--font-inter',
  display: 'optional',
  weight: ['400', '500', '700', '900']
});

export const dynamic = 'force-dynamic';

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

function getContrastColor(hexColor: string): string {
  const cleanHex = hexColor.replace('#', '');
  if (cleanHex.length !== 6) return 'oklch(0.98 0 0)';
  
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  // YIQ Contrast formula
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? 'oklch(0.08 0.01 225)' : 'oklch(0.98 0 0)';
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let bgColor = '#02111a'; // default Ölüdeniz Deep Blue
  let fgColor = 'oklch(0.98 0 0)';
  let isLight = false;
  let btnColor = '#64ffda'; // default Ölüdeniz Turkuazı
  let btnFgColor = 'oklch(0.11 0.038 225)'; // default dark blue text

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('hero_banners')
      .select('alt_text, background_image')
      .in('alt_text', ['SYSTEM_BG_COLOR', 'SYSTEM_BTN_COLOR'])
    
    if (data) {
      const bgSetting = data.find(d => d.alt_text === 'SYSTEM_BG_COLOR')
      const btnSetting = data.find(d => d.alt_text === 'SYSTEM_BTN_COLOR')
      
      if (bgSetting?.background_image) {
        bgColor = bgSetting.background_image;
        fgColor = getContrastColor(bgColor);
        isLight = fgColor.includes('0.08');
      }
      
      if (btnSetting?.background_image) {
        btnColor = btnSetting.background_image;
        btnFgColor = getContrastColor(btnColor);
      }
    }
  } catch (err) {
    console.error("Failed to load custom background settings:", err);
  }

  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root, html, body, .dark, [data-theme='dark'] {
            --background: ${bgColor} !important;
            --foreground: ${fgColor} !important;
            --primary: ${btnColor} !important;
            --primary-foreground: ${btnFgColor} !important;
            --accent: ${btnColor} !important;
            --accent-foreground: ${btnFgColor} !important;
            --ring: ${btnColor} !important;
            --card: ${isLight ? 'color-mix(in srgb, ' + bgColor + ' 95%, black 5%)' : 'color-mix(in srgb, ' + bgColor + ' 92%, white 8%)'} !important;
            --card-foreground: ${fgColor} !important;
            --popover: ${isLight ? 'color-mix(in srgb, ' + bgColor + ' 95%, black 5%)' : 'color-mix(in srgb, ' + bgColor + ' 92%, white 8%)'} !important;
            --popover-foreground: ${fgColor} !important;
            --secondary: ${isLight ? 'color-mix(in srgb, ' + bgColor + ' 90%, black 10%)' : 'color-mix(in srgb, ' + bgColor + ' 84%, white 16%)'} !important;
            --secondary-foreground: ${fgColor} !important;
            --muted-foreground: ${isLight ? 'color-mix(in srgb, ' + fgColor + ' 60%, black 40%)' : 'color-mix(in srgb, ' + fgColor + ' 60%, white 40%)'} !important;
            --border: ${isLight ? 'color-mix(in srgb, ' + bgColor + ' 88%, black 12%)' : 'color-mix(in srgb, ' + bgColor + ' 84%, white 16%)'} !important;
          }
        `}} />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeHydrator />
        <SystemHealthProvider>
          {children}
          <DeferredProviders />
        </SystemHealthProvider>
      </body>
    </html>
  );
}
