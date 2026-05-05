import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();

  // Paralel olarak kategorileri ve isletmeleri ara
  const [categoriesRes, businessesRes] = await Promise.all([
    supabase
      .from('business_categories')
      .select('id, name, slug')
      .ilike('name', `%${query}%`)
      .limit(5),
    supabase
      .from('businesses')
      .select('id, name, slug, category_id')
      .ilike('name', `%${query}%`)
      .limit(5)
  ]);

  const results = [
    ...(categoriesRes.data?.map(c => ({ ...c, type: 'category' })) || []),
    ...(businessesRes.data?.map(b => ({ ...b, type: 'business' })) || [])
  ];

  return NextResponse.json({ results });
}
