import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/isletme-paneli/'], // Yonetim panellerini gizle
    },
    sitemap: 'https://www.fethiye360.com/sitemap.xml',
  }
}
