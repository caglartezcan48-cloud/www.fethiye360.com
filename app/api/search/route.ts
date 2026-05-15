import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();

  // Karakter normalizasyonu için alternatifli arama
  // Örn: 'kuafor' araması için hem 'kuaför' hem 'kuafor' kontrolü
  const turkishReplace = (text: string) => {
    return text
      .replace(/i/g, '[iıİI]')
      .replace(/ı/g, '[iıİI]')
      .replace(/g/g, '[gğGĞ]')
      .replace(/u/g, '[uüUÜ]')
      .replace(/s/g, '[sşSŞ]')
      .replace(/o/g, '[oöOÖ]')
      .replace(/c/g, '[cçCÇ]');
  };

  // Paralel olarak kategorileri ve isletmeleri ara
  const [categoriesRes, businessesRes] = await Promise.all([
    supabase
      .from('business_categories')
      .select('id, name, slug')
      .or(`name.ilike.%${query}%,slug.ilike.%${query}%`)
      .limit(5),
    supabase
      .from('businesses')
      .select(`
        id, 
        name, 
        slug, 
        category_id,
        business_categories!inner(name)
      `)
      .or(`name.ilike.%${query}%,business_categories.name.ilike.%${query}%`)
      .limit(8)
  ]);

  const results = [
    ...(categoriesRes.data?.map(c => ({ ...c, type: 'category' })) || []),
    ...(businessesRes.data?.map(b => ({ 
      ...b, 
      type: 'business',
      category_name: (b as any).business_categories?.name 
    })) || [])
  ];

  return NextResponse.json({ results });
}

