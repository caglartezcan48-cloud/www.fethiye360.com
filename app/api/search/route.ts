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
  const [categoriesRes, businessesRes, postsRes, profilesRes] = await Promise.all([
    // 1. Kategoriler
    supabase
      .from('business_categories')
      .select('id, name, slug')
      .or(`name.ilike.%${q}%,slug.ilike.%${q}%`)
      .limit(3),
    
    // 2. İşletmeler (En önemli sonuçlar)
    supabase
      .from('businesses')
      .select(`
        id, 
        name, 
        slug, 
        image_url,
        business_categories!inner(name)
      `)
      .or(`name.ilike.%${q}%,business_categories.name.ilike.%${q}%`)
      .limit(10),

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
      .limit(3)
  ]);

  // Sonuçları birleştir ve tiplerini ekle
  const results: any[] = [];

  // Kategoriler
  categoriesRes.data?.forEach(c => {
    results.push({ ...c, type: 'category', priority: 2 });
  });

  // İşletmeler (Öncelikli)
  businessesRes.data?.forEach(b => {
    results.push({ 
      ...b, 
      type: 'business', 
      category_name: (b as any).business_categories?.name,
      priority: 1 
    });
  });

  // Profiller
  profilesRes.data?.forEach(p => {
    results.push({ 
      id: p.id,
      name: p.full_name || p.username,
      slug: p.username,
      image_url: p.avatar_url,
      type: 'profile',
      priority: 3
    });
  });

  // Gönderiler
  postsRes.data?.forEach(post => {
    results.push({
      id: post.id,
      name: post.content?.substring(0, 40) + '...',
      slug: post.id,
      image_url: post.image_url,
      type: 'post',
      subtitle: `@${(post as any).profiles?.username} paylaşımı`,
      priority: 4
    });
  });

  // Önceliğe göre sırala (1 en yüksek)
  results.sort((a, b) => a.priority - b.priority);

  return NextResponse.json({ results: results.slice(0, 15) });
}

