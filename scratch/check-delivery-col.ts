import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function checkBusinessColumns() {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .limit(1)
  
  if (data && data.length > 0) {
    console.log('Kolonlar:', Object.keys(data[0]))
  } else {
    console.error('Hata veya veri yok:', error)
  }
}

checkBusinessColumns()
