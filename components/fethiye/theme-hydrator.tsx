'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ThemeHydrator() {
  const supabase = createClient()

  useEffect(() => {
    async function syncTheme() {
      try {
        const { data } = await supabase
          .from('hero_banners')
          .select('background_image')
          .eq('alt_text', 'SYSTEM_BG_COLOR')
          .maybeSingle()
        
        if (data?.background_image) {
          const bgColor = data.background_image;
          
          // Calculate dynamic YIQ contrast
          const cleanHex = bgColor.replace('#', '');
          let fgColor = 'oklch(0.98 0 0)';
          let isLight = false;
          
          if (cleanHex.length === 6) {
            const r = parseInt(cleanHex.substring(0, 2), 16);
            const g = parseInt(cleanHex.substring(2, 4), 16);
            const b = parseInt(cleanHex.substring(4, 6), 16);
            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            if (yiq >= 128) {
              fgColor = 'oklch(0.08 0.01 225)';
              isLight = true;
            }
          }
          
          const cardVal = isLight 
            ? `color-mix(in srgb, ${bgColor} 95%, black 5%)`
            : `color-mix(in srgb, ${bgColor} 92%, white 8%)`;
          
          const popoverVal = isLight
            ? `color-mix(in srgb, ${bgColor} 95%, black 5%)`
            : `color-mix(in srgb, ${bgColor} 92%, white 8%)`;
          
          const secVal = isLight
            ? `color-mix(in srgb, ${bgColor} 90%, black 10%)`
            : `color-mix(in srgb, ${bgColor} 84%, white 16%)`;
          
          const mutVal = isLight
            ? `color-mix(in srgb, ${fgColor} 60%, black 40%)`
            : `color-mix(in srgb, ${fgColor} 60%, white 40%)`;
          
          const borderVal = isLight
            ? `color-mix(in srgb, ${bgColor} 88%, black 12%)`
            : `color-mix(in srgb, ${bgColor} 84%, white 16%)`;

          // Inject custom color tokens directly into a global style block in the head
          let styleEl = document.getElementById('dynamic-theme-style') as HTMLStyleElement;
          if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'dynamic-theme-style';
            document.head.appendChild(styleEl);
          }
          
          styleEl.innerHTML = `
            :root, html, body, .dark, [data-theme='dark'] {
              --background: ${bgColor} !important;
              --foreground: ${fgColor} !important;
              --card: ${cardVal} !important;
              --card-foreground: ${fgColor} !important;
              --popover: ${popoverVal} !important;
              --popover-foreground: ${fgColor} !important;
              --secondary: ${secVal} !important;
              --secondary-foreground: ${fgColor} !important;
              --muted-foreground: ${mutVal} !important;
              --border: ${borderVal} !important;
            }
          `;
        }
      } catch (err) {
        console.error('Failed to sync client theme:', err)
      }
    }
    syncTheme()
  }, [supabase])

  return null
}
