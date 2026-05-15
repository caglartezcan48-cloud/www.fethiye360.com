/**
 * Fethiye360 - İçerik Moderasyon Servisi
 * +18 içerik kontrolü ve metin filtreleme
 */

import * as nsfwjs from 'nsfwjs'

// NSFW Model singleton
let nsfwModel: nsfwjs.NSFWJS | null = null

/**
 * NSFW modelini yükle (lazy loading)
 */
export async function loadNSFWModel(): Promise<nsfwjs.NSFWJS> {
  if (nsfwModel) return nsfwModel
  
  // TensorFlow.js ayarları
  if (typeof window !== 'undefined') {
    const tf = await import('@tensorflow/tfjs')
    await tf.ready()
    // WebGL backend kullan (daha hızlı)
    await tf.setBackend('webgl')
  }
  
  nsfwModel = await nsfwjs.load()
  return nsfwModel
}

/**
 * Görsel moderasyon sonucu
 */
export interface ImageModerationResult {
  isAppropriate: boolean
  confidence: number
  flaggedCategories: string[]
  details: {
    drawing: number
    hentai: number
    neutral: number
    porn: number
    sexy: number
  }
}

/**
 * Görseli +18 içerik için kontrol et
 */
export async function moderateImage(imageSource: HTMLImageElement | string): Promise<ImageModerationResult> {
  const model = await loadNSFWModel()
  
  let imgElement: HTMLImageElement
  
  if (typeof imageSource === 'string') {
    // URL veya base64'den image element oluştur
    imgElement = await createImageElement(imageSource)
  } else {
    imgElement = imageSource
  }
  
  const predictions = await model.classify(imgElement)
  
  // Sonuçları parse et
  const details = {
    drawing: 0,
    hentai: 0,
    neutral: 0,
    porn: 0,
    sexy: 0
  }
  
  predictions.forEach(pred => {
    const key = pred.className.toLowerCase() as keyof typeof details
    if (key in details) {
      details[key] = pred.probability
    }
  })
  
  // Eşik değerleri - çok katı
  const PORN_THRESHOLD = 0.3  // %30 üzeri engelle
  const HENTAI_THRESHOLD = 0.3
  const SEXY_THRESHOLD = 0.5  // %50 üzeri engelle
  
  const flaggedCategories: string[] = []
  
  if (details.porn > PORN_THRESHOLD) flaggedCategories.push('porn')
  if (details.hentai > HENTAI_THRESHOLD) flaggedCategories.push('hentai')
  if (details.sexy > SEXY_THRESHOLD) flaggedCategories.push('sexy')
  
  const isAppropriate = flaggedCategories.length === 0
  const confidence = isAppropriate 
    ? details.neutral + details.drawing
    : Math.max(details.porn, details.hentai, details.sexy)
  
  return {
    isAppropriate,
    confidence,
    flaggedCategories,
    details
  }
}

/**
 * URL'den image element oluştur
 */
function createImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Metin moderasyon sonucu
 */
export interface TextModerationResult {
  isAppropriate: boolean
  flaggedWords: string[]
  cleanedText: string
}

/**
 * Türkçe ve İngilizce uygunsuz kelimeler listesi
 * Not: Kısaltmalar ve varyasyonlar da dahil
 */
const INAPPROPRIATE_WORDS = [
  // Türkçe küfürler
  'amk', 'aq', 'amına', 'amina', 'amcık', 'amcik', 'orospu', 'oruspu', 'piç', 'pic', 
  'sikik', 'siktir', 'sikerim', 'sikeyim', 'sikim', 'yarrak', 'yarak', 'taşak', 'tasak',
  'göt', 'got', 'meme', 'kaltak', 'fahişe', 'fahise', 'pezevenk', 'ibne', 'puşt', 'pust',
  'gavat', 'bok', 'sik', 'am', 'döl', 'dol', 'seks', 'porno', 'çük', 'cuk',
  'ananı', 'anani', 'ananızı', 'annenizi', 'bacını', 'bacini',
  // İngilizce küfürler
  'fuck', 'shit', 'bitch', 'ass', 'dick', 'cock', 'pussy', 'cunt', 'whore',
  'slut', 'bastard', 'damn', 'nigger', 'faggot', 'motherfucker',
  // Yaygın kısaltmalar
  'wtf', 'stfu', 'gtfo',
  // +18 içerik terimleri
  'sex', 'xxx', 'adult', 'nude', 'naked', 'porn', 'erotic', 'erotik',
  // Irkçı/nefret söylemi
  'nazi', 'hitler', 'kkk', 'terroris'
]

// Kelime varyasyonları için regex pattern oluştur
function createWordPattern(word: string): RegExp {
  // Türkçe karakterleri ve olası yazım varyasyonlarını kapsayan pattern
  const escaped = word
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/a/gi, '[aáàâäã@4]')
    .replace(/e/gi, '[eéèêë3]')
    .replace(/i/gi, '[iíìîï1!ı]')
    .replace(/o/gi, '[oóòôöõ0]')
    .replace(/u/gi, '[uúùûü]')
    .replace(/s/gi, '[sş$5]')
    .replace(/c/gi, '[cç]')
    .replace(/g/gi, '[gğ]')
  
  return new RegExp(`\\b${escaped}\\b`, 'gi')
}

/**
 * Metni uygunsuz içerik için kontrol et
 */
export function moderateText(text: string): TextModerationResult {
  if (!text || text.trim().length === 0) {
    return {
      isAppropriate: true,
      flaggedWords: [],
      cleanedText: ''
    }
  }
  
  const flaggedWords: string[] = []
  let cleanedText = text
  
  // Normalize et (küçük harf, boşluklar temizle)
  const normalizedText = text.toLowerCase()
  
  for (const word of INAPPROPRIATE_WORDS) {
    const pattern = createWordPattern(word)
    
    if (pattern.test(normalizedText)) {
      flaggedWords.push(word)
      // Kelimeyi yıldızla
      cleanedText = cleanedText.replace(pattern, (match) => '*'.repeat(match.length))
    }
  }
  
  // Tekrarlayan karakterleri kontrol et (fuuuuck, shiiit gibi)
  const repeatedPattern = /(.)\1{3,}/g
  const hasRepeatedChars = repeatedPattern.test(normalizedText)
  
  // Link/URL kontrolü (spam önleme)
  const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi
  const hasUrls = urlPattern.test(text)
  
  return {
    isAppropriate: flaggedWords.length === 0 && !hasUrls,
    flaggedWords: hasUrls ? [...flaggedWords, 'url'] : flaggedWords,
    cleanedText
  }
}

/**
 * Hem görsel hem metin moderasyonu - toplu kontrol
 */
export interface ContentModerationResult {
  isAppropriate: boolean
  imageResult?: ImageModerationResult
  textResult?: TextModerationResult
  message: string
}

export async function moderateContent(options: {
  image?: HTMLImageElement | string
  text?: string
}): Promise<ContentModerationResult> {
  const results: ContentModerationResult = {
    isAppropriate: true,
    message: ''
  }
  
  // Görsel kontrolü
  if (options.image) {
    try {
      results.imageResult = await moderateImage(options.image)
      if (!results.imageResult.isAppropriate) {
        results.isAppropriate = false
        results.message = 'Bu görsel uygunsuz içerik barındırıyor ve yüklenemiyor.'
      }
    } catch (error) {
      console.error('Görsel moderasyon hatası:', error)
      // Hata durumunda devam et ama logla
    }
  }
  
  // Metin kontrolü
  if (options.text) {
    results.textResult = moderateText(options.text)
    if (!results.textResult.isAppropriate) {
      results.isAppropriate = false
      if (results.textResult.flaggedWords.includes('url')) {
        results.message = 'Metin içinde link paylaşımı yasaktır.'
      } else {
        results.message = 'Metin uygunsuz kelimeler içeriyor.'
      }
    }
  }
  
  if (results.isAppropriate) {
    results.message = 'İçerik onaylandı.'
  }
  
  return results
}

/**
 * Dosya tipi kontrolü
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  return validTypes.includes(file.type)
}

/**
 * Dosya boyutu kontrolü (max 10MB)
 */
export function isValidFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxBytes
}
