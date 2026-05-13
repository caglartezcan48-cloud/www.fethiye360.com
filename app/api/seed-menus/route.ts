import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createAdminClient()

    // 1. Paket Servis olan isletmeleri bul
    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .select('id, name, services')
    
    if (bizError) throw bizError

    const deliveryBusinesses = businesses.filter(b => 
      b.services && Array.isArray(b.services) && b.services.includes('Paket Servis')
    )

    if (deliveryBusinesses.length === 0) {
      return NextResponse.json({ message: 'Paket servisi olan işletme bulunamadı.' })
    }

    // 2. Ornek menuler (Yemeksepeti tarzi)
    const dummyMenus = [
      {
        name: 'Klasik Burger Menü',
        price: 280,
        description: '150g anne köftesi, patates kızartması ve kutu içecek ile',
        category: 'Burgerler',
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80'
      },
      {
        name: 'Karışık Pizza (Büyük Boy)',
        price: 320,
        description: 'Sucuk, sosis, mantar, mısır, zeytin, ekstra mozzarella',
        category: 'Pizzalar',
        image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80'
      },
      {
        name: 'Tavuk Şiş Dürüm',
        price: 150,
        description: 'Lavaş arası özel soslu tavuk şiş, yeşillik, soğan',
        category: 'Dürümler',
        image_url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500&q=80'
      },
      {
        name: 'Çıtır Tavuk Kovası',
        price: 250,
        description: '10 parça çıtır tavuk, büyük boy patates, soğan halkası',
        category: 'Atıştırmalıklar',
        image_url: 'https://images.unsplash.com/photo-1626082896492-766af4eb65ed?w=500&q=80'
      },
      {
        name: 'Coca Cola Zero (330ml)',
        price: 45,
        description: 'Kutu içecek',
        category: 'İçecekler',
        image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80'
      }
    ]

    const productsToInsert = []

    for (const biz of deliveryBusinesses) {
      for (const menu of dummyMenus) {
        productsToInsert.push({
          business_id: biz.id,
          name: menu.name,
          price: menu.price,
          description: menu.description,
          category: menu.category,
          image_url: menu.image_url,
          updated_at: new Date().toISOString()
        })
      }
    }

    // 3. Ekle (once eski dummy urunleri temizle istersen? Hayir, direkt ekle)
    const { error: insertError } = await supabase
      .from('business_products')
      .insert(productsToInsert)

    if (insertError) throw insertError

    return NextResponse.json({ 
      success: true, 
      message: `${deliveryBusinesses.length} işletmeye toplam ${productsToInsert.length} menü eklendi.`,
      businesses: deliveryBusinesses.map(b => b.name)
    })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
