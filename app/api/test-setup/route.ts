import { createClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  // 1. Restoran kategorisini bul
  const { data: cat } = await supabase
    .from('business_categories')
    .select('id')
    .ilike('name', 'Restoran')
    .single()
  
  if (!cat) return NextResponse.json({ error: 'Kategori bulunamadı' })

  // 2. Örnek İşletme Ekle
  const { data: biz, error: bError } = await supabase
    .from('businesses')
    .insert({
      name: 'Örnek Lezzet Durağı (TEST)',
      slug: 'ornek-lezzet-duragi-test',
      category_id: cat.id,
      description: 'Fethiye’nin kalbinde, eşsiz lezzetler ve unutulmaz anılar için kapılarımızı açıyoruz. Modern dokunuşlar ve geleneksel misafirperverliğimizle sizleri bekliyoruz.',
      address: 'Cumhuriyet Mah. Çarşı Cad. No:48, Fethiye',
      phone: '0532 123 45 67',
      whatsapp: '905321234567',
      website: 'https://fethiye360.com',
      main_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=90',
      is_featured: true,
      rating: 5
    })
    .select()
    .single()

  if (bError) return NextResponse.json({ error: bError })

  // 3. Örnek Ürünler Ekle
  const products = [
    { business_id: biz.id, name: 'Özel Karışık Kebap', price: 450, description: 'Zırh kıyması, kuşbaşı, kanat ve özel garnitürler ile.' },
    { business_id: biz.id, name: 'Fethiye Pizzası', price: 280, description: 'Yerel otlar, tulum peyniri ve özel domates sosu.' },
    { business_id: biz.id, name: 'Şefin Spesiyali', price: 320, description: 'Közlenmiş patlıcan yatağında kuzu incik.' },
    { business_id: biz.id, name: 'Magnolia (Çilekli)', price: 120, description: 'Ev yapımı krema ve taze Çilek ile.' },
    { business_id: biz.id, name: 'Türk Kahvesi', price: 60, description: 'Geleneksel yöntemle kumda pişirilmiş.' }
  ]

  await supabase.from('business_products').insert(products)

  return NextResponse.json({ success: true, slug: biz.slug })
}
