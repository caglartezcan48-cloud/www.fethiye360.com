import { createClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  try {
    // 1. Tablo erisimi kontrolu
    const { data: admins, error: aError } = await supabase.from('admin_users').select('count', { count: 'exact' })
    
    // 2. Mevcut oturum kontrolu
    const { data: { user } } = await supabase.auth.getUser()

    return NextResponse.json({ 
      table_status: aError ? `Hata: ${aError.message}` : 'Erisilebilir',
      total_admins: admins?.[0] || 0,
      current_user: user ? user.email : 'Oturum Acilmamis',
      user_id: user ? user.id : null
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
