import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function checkColumns() {
  const { data, error } = await supabase.from('businesses').select('*').limit(1)
  if (error) {
    console.error('Hata:', error)
    return
  }
  if (data && data.length > 0) {
    console.log('Sütunlar:', Object.keys(data[0]))
  } else {
    console.log('Tablo boş veya veri yok.')
  }
}

checkColumns()
