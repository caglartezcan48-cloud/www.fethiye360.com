import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

async function checkColumns() {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Hata:', error)
  } else if (data && data.length > 0) {
    console.log('Businesses tablosu sütunları:', Object.keys(data[0]))
  } else {
    console.log('Tablo boş veya erişilemiyor.')
  }
}

checkColumns()
