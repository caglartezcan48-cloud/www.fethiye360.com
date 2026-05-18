'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePathname } from 'next/navigation'

export function ThemeHydrator() {
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    async function syncTheme() {
      try {
        const { data } = await supabase
          .from('hero_banners')
          .select('alt_text, background_image')
          .or(`alt_text.in.("SYSTEM_BG_COLOR","SYSTEM_BTN_COLOR","NAVBAR_BG_COLOR","NAVBAR_BTN_COLOR"),alt_text.eq.PAGE_BG_COLOR_${pathname},alt_text.eq.PAGE_BTN_COLOR_${pathname}`)
        
        let bgColor = '#02111a'
        let btnColor = '#64ffda'
        let navBgColor = '#0a192f'
        let navBtnColor = '#64ffda'
        
        if (data) {
          // 1. Global Defaults
          const globalBg = data.find(d => d.alt_text === 'SYSTEM_BG_COLOR')
          const globalBtn = data.find(d => d.alt_text === 'SYSTEM_BTN_COLOR')
          if (globalBg?.background_image) bgColor = globalBg.background_image
          if (globalBtn?.background_image) btnColor = globalBtn.background_image

          // 2. Page Specific Overrides
          const pageBg = data.find(d => d.alt_text === `PAGE_BG_COLOR_${pathname}`)
          const pageBtn = data.find(d => d.alt_text === `PAGE_BTN_COLOR_${pathname}`)
          if (pageBg?.background_image) bgColor = pageBg.background_image
          if (pageBtn?.background_image) btnColor = pageBtn.background_image

          // 3. Navbar Specific
          const navBg = data.find(d => d.alt_text === 'NAVBAR_BG_COLOR')
          const navBtn = data.find(d => d.alt_text === 'NAVBAR_BTN_COLOR')
          
          if (navBg?.background_image) {
            navBgColor = navBg.background_image
          } else {
            navBgColor = bgColor === '#ffffff' ? '#ffffff' : `color-mix(in srgb, ${bgColor} 90%, black 10%)`
          }
          
          if (navBtn?.background_image) {
            navBtnColor = navBtn.background_image
          } else {
            navBtnColor = btnColor
          }
        }
        
        const cleanHex = bgColor.replace('#', '')
        let fgColor = 'oklch(0.98 0 0)' // default light color
        let isLight = false

        if (cleanHex.length === 6) {
          const r = parseInt(cleanHex.substring(0, 2), 16)
          const g = parseInt(cleanHex.substring(2, 4), 16)
          const b = parseInt(cleanHex.substring(4, 6), 16)
          
          // YIQ Contrast Formula
          const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
          if (yiq >= 128) {
            fgColor = 'oklch(0.08 0.01 225)' // dark color for light background
            isLight = true
          }
        }

        // Calculate dynamic YIQ contrast for primary buttons
        const cleanBtnHex = btnColor.replace('#', '')
        let btnFgColor = 'oklch(0.11 0.038 225)' // default dark blue text
        
        if (cleanBtnHex.length === 6) {
          const r = parseInt(cleanBtnHex.substring(0, 2), 16)
          const g = parseInt(cleanBtnHex.substring(2, 4), 16)
          const b = parseInt(cleanBtnHex.substring(4, 6), 16)
          
          const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
          if (yiq < 128) {
            btnFgColor = 'oklch(0.98 0 0)' // white text for dark buttons
          }
        }

        // Calculate contrast for navbar background
        const cleanNavBgHex = navBgColor.replace('#', '')
        let navFgColor = 'oklch(0.98 0 0)' // light color
        let isNavLight = false
        if (cleanNavBgHex.length === 6) {
          const r = parseInt(cleanNavBgHex.substring(0, 2), 16)
          const g = parseInt(cleanNavBgHex.substring(2, 4), 16)
          const b = parseInt(cleanNavBgHex.substring(4, 6), 16)
          const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
          if (yiq >= 128) {
            navFgColor = 'oklch(0.08 0.01 225)' // dark color
            isNavLight = true
          }
        }

        // Calculate contrast for navbar button highlight color
        const cleanNavBtnHex = navBtnColor.replace('#', '')
        let navBtnFgColor = 'oklch(0.11 0.038 225)' // default dark blue
        if (cleanNavBtnHex.length === 6) {
          const r = parseInt(cleanNavBtnHex.substring(0, 2), 16)
          const g = parseInt(cleanNavBtnHex.substring(2, 4), 16)
          const b = parseInt(cleanNavBtnHex.substring(4, 6), 16)
          const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
          if (yiq < 128) {
            navBtnFgColor = 'oklch(0.98 0 0)' // white text
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
            --primary: ${btnColor} !important;
            --primary-foreground: ${btnFgColor} !important;
            --accent: ${btnColor} !important;
            --accent-foreground: ${btnFgColor} !important;
            --ring: ${btnColor} !important;
            --card: ${cardVal} !important;
            --card-foreground: ${fgColor} !important;
            --popover: ${popoverVal} !important;
            --popover-foreground: ${fgColor} !important;
            --secondary: ${secVal} !important;
            --secondary-foreground: ${fgColor} !important;
            --muted-foreground: ${mutVal} !important;
            --border: ${borderVal} !important;

            /* Navbar Specific Styles */
            --navbar-bg: ${navBgColor} !important;
            --navbar-fg: ${navFgColor} !important;
            --navbar-primary: ${navBtnColor} !important;
            --navbar-primary-foreground: ${navBtnFgColor} !important;
            --navbar-text: ${isNavLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'} !important;
            --navbar-text-hover: ${isNavLight ? '#000000' : '#ffffff'} !important;
            --navbar-border: ${isNavLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'} !important;
          }
        `;
      } catch (err) {
        console.error('Failed to sync client theme:', err)
      }
    }
    syncTheme()
  }, [pathname, supabase])

  return null
}
