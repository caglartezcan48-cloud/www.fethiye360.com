import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function checkSchema() {
  // Isletmeler tablosundaki kolonlari listele
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .limit(1)
  
  if (data && data.length > 0) {
    console.log('Mevcut Kolonlar:', Object.keys(data[0]))
  } else {
    console.log('Tablo boş veya hata oluştu:', error)
  }
}

checkSchema()
