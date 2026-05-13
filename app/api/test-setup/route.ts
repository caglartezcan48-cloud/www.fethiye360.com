import { createClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data } = await supabase.from('businesses').select('*').limit(1)
  
  if (data && data.length > 0) {
    return NextResponse.json({ columns: Object.keys(data[0]) })
  }
  return NextResponse.json({ error: 'Veri bulunamadı' })
}
