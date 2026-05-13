import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function checkAdmins() {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
  
  if (error) {
    console.error('Sorgu hatası:', error)
  } else {
    console.log('Kayıtlı Admin Sayısı:', data.length)
    console.log('Admin Listesi:', data.map(a => a.full_name || a.id))
  }
}

checkAdmins()
