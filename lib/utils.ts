import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Görsel sıkıştırma ve optimizasyon ayarları
 */
export interface ImageCompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
  maxFileSizeKB?: number
}

/**
 * HD kalitede görsel sıkıştırma
 * - WebP formatı ile daha küçük dosya boyutu
 * - 1920px max genişlik (Full HD)
 * - Otomatik kalite ayarlama (hedef: 500-800KB)
 */
export const compressImage = async (
  file: File, 
  options: ImageCompressionOptions = {}
): Promise<Blob> => {
  const {
    maxWidth = 3840, // 4K Ultra HD width
    maxHeight = 3840, // 4K Ultra HD height
    quality = 0.95, // Near-lossless premium visual sharpness
    format = 'webp',
    maxFileSizeKB = 3000 // Allow up to 3MB per image for extreme detail depth
  } = options

  if (!file.type.startsWith('image/')) return file
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = (event) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = event.target?.result as string
      
      img.onload = async () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // En-boy oranını koru, max boyutu aşma
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        if (ratio < 1) {
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d', { 
          alpha: format === 'png',
          willReadFrequently: false 
        })
        
        if (!ctx) {
          resolve(file)
          return
        }
        
        // Yüksek kaliteli rendering
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)
        
        // MIME type belirle
        const mimeType = format === 'webp' 
          ? 'image/webp' 
          : format === 'png' 
            ? 'image/png' 
            : 'image/jpeg'
        
        // Otomatik kalite ayarlama - hedef dosya boyutuna ulaşana kadar
        let currentQuality = quality
        let blob: Blob | null = null
        let attempts = 0
        const maxAttempts = 5
        
        while (attempts < maxAttempts) {
          blob = await new Promise<Blob | null>((res) => {
            canvas.toBlob((b) => res(b), mimeType, currentQuality)
          })
          
          if (!blob) break
          
          const sizeKB = blob.size / 1024
          
          // Hedef aralıkta mı?
          if (sizeKB <= maxFileSizeKB || currentQuality <= 0.5) {
            break
          }
          
          // Kaliteyi düşür
          currentQuality -= 0.1
          attempts++
        }
        
        resolve(blob || file)
      }
      
      img.onerror = () => reject(new Error('Görsel yüklenemedi'))
    }
    
    reader.onerror = () => reject(new Error('Dosya okunamadı'))
  })
}

/**
 * Eski fonksiyon imzası ile uyumluluk (backward compatibility)
 */
export const compressImageLegacy = (
  file: File, 
  maxWidth = 3840, 
  maxHeight = 3840, 
  quality = 0.95
): Promise<Blob> => {
  return compressImage(file, { maxWidth, maxHeight, quality, format: 'jpeg' })
}

/**
 * Toplu görsel sıkıştırma
 */
export const compressImages = async (
  files: File[], 
  options?: ImageCompressionOptions
): Promise<Blob[]> => {
  return Promise.all(files.map(file => compressImage(file, options)))
}
