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
          
          // Inject custom color tokens directly into document root
          const root = document.documentElement;
          root.style.setProperty('--background', bgColor, 'important');
          root.style.setProperty('--foreground', fgColor, 'important');
          
          const cardVal = isLight 
            ? `color-mix(in srgb, ${bgColor} 95%, black 5%)`
            : `color-mix(in srgb, ${bgColor} 92%, white 8%)`;
          root.style.setProperty('--card', cardVal, 'important');
          root.style.setProperty('--card-foreground', fgColor, 'important');
          
          const popoverVal = isLight
            ? `color-mix(in srgb, ${bgColor} 95%, black 5%)`
            : `color-mix(in srgb, ${bgColor} 92%, white 8%)`;
          root.style.setProperty('--popover', popoverVal, 'important');
          root.style.setProperty('--popover-foreground', fgColor, 'important');
          
          const secVal = isLight
            ? `color-mix(in srgb, ${bgColor} 90%, black 10%)`
            : `color-mix(in srgb, ${bgColor} 84%, white 16%)`;
          root.style.setProperty('--secondary', secVal, 'important');
          root.style.setProperty('--secondary-foreground', fgColor, 'important');
          
          const mutVal = isLight
            ? `color-mix(in srgb, ${fgColor} 60%, black 40%)`
            : `color-mix(in srgb, ${fgColor} 60%, white 40%)`;
          root.style.setProperty('--muted-foreground', mutVal, 'important');
          
          const borderVal = isLight
            ? `color-mix(in srgb, ${bgColor} 88%, black 12%)`
            : `color-mix(in srgb, ${bgColor} 84%, white 16%)`;
          root.style.setProperty('--border', borderVal, 'important');
        }
      } catch (err) {
        console.error('Failed to sync client theme:', err)
      }
    }
    syncTheme()
  }, [supabase])

  return null
}
