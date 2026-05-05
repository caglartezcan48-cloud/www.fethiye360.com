import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = 'https://www.fethiye360.com'

  // 1. Statik Sayfalar
  const staticPages = [
    '',
    '/kesfet',
    '/fethiye/hava-durumu',
    '/fethiye/nobetci-ezcaneler',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // 2. Dinamik Kategoriler
  const { data: categories } = await supabase
    .from('business_categories')
    .select('slug')

  const categoryPages = (categories || []).map((cat) => ({
    url: `${baseUrl}/kesfet/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // 3. Dinamik Isletmeler
  const { data: businesses } = await supabase
    .from('businesses')
    .select('slug, updated_at')

  const businessPages = (businesses || []).map((biz) => ({
    url: `${baseUrl}/isletme/${biz.slug}`,
    lastModified: new Date(biz.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...categoryPages, ...businessPages]
}
