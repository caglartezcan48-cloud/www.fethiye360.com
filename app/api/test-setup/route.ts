import { createClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  const { data: admins, error: aError } = await supabase.from('admin_users').select('*')
  if (aError) return NextResponse.json({ error: aError })

  return NextResponse.json({ admins })
}
