import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();
  const q = query.trim();

  // Paralel olarak tüm tabloları ara
  const [categoriesRes, businessesRes, postsRes, profilesRes, productsRes] = await Promise.all([
    // 1. Kategoriler
    supabase
      .from('business_categories')
      .select('id, name, slug')
      .or(`name.ilike.%${q}%,slug.ilike.%${q}%`)
      .limit(3),
    
    // 2. İşletmeler (Kayıtlı İşletmeler)
    supabase
      .from('businesses')
      .select(`
        id, 
        name, 
        slug, 
        main_image,
        business_categories!inner(name)
      `)
      .or(`name.ilike.%${q}%,business_categories.name.ilike.%${q}%`)
      .limit(6),

    // 3. Sosyal Gönderiler
    supabase
      .from('posts')
      .select('id, content, image_url, profiles!inner(full_name, username)')
      .ilike('content', `%${q}%`)
      .limit(3),

    // 4. Kullanıcı Profilleri
    supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .or(`username.ilike.%${q}%,full_name.ilike.%${q}%`)
      .limit(3),

    // 5. Ürünler & Hizmetler (Yeni!)
    supabase
      .from('business_products')
      .select(`
        id,
        name,
        price,
        image_url,
        businesses (
          name,
          slug
        )
      `)
      .ilike('name', `%${q}%`)
      .limit(6)
  ]);

  // Sonuçları birleştir ve tiplerini ekle
  const results: any[] = [];

  // 1. İşletmeler (En Yüksek Öncelikli)
  businessesRes.data?.forEach(b => {
    results.push({ 
      id: b.id,
      name: b.name,
      slug: b.slug,
      image_url: b.main_image,
      type: 'business', 
      category_name: (b as any).business_categories?.name,
      priority: 1 
    });
  });

  // 2. Ürünler & Hizmetler
  productsRes.data?.forEach(p => {
    const parent = (p as any).businesses;
    if (parent) {
      results.push({
        id: p.id,
        name: p.name,
        slug: parent.slug, // Clicking goes to parent business page
        image_url: p.image_url,
        type: 'product',
        subtitle: `${parent.name} • ${p.price} TL`,
        priority: 2
      });
    }
  });

  // 3. Kategoriler
  categoriesRes.data?.forEach(c => {
    results.push({ ...c, type: 'category', priority: 3 });
  });

  // 4. Profiller
  profilesRes.data?.forEach(p => {
    results.push({ 
      id: p.id,
      name: p.full_name || p.username,
      slug: p.username,
      image_url: p.avatar_url,
      type: 'profile',
      priority: 4
    });
  });

  // 5. Gönderiler
  postsRes.data?.forEach(post => {
    results.push({
      id: post.id,
      name: post.content?.substring(0, 40) + '...',
      slug: post.id,
      image_url: post.image_url,
      type: 'post',
      subtitle: `@${(post as any).profiles?.username} paylaşımı`,
      priority: 5
    });
  });

  // Önceliğe göre sırala (1 en yüksek)
  results.sort((a, b) => a.priority - b.priority);

  return NextResponse.json({ results: results.slice(0, 15) });
}
