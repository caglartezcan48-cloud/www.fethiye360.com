import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function checkSchema() {
  const tables = ['notifications', 'businesses', 'destinations', 'tours', 'user_profiles']
  
  for (const table of tables) {
    console.log(`\n--- ${table} Tablosu Kontrol Ediliyor ---`)
    const { data, error } = await supabase.from(table).select('*').limit(1)
    
    if (error) {
      console.error(`[HATA] ${table}:`, error.message, error.code)
    } else {
      console.log(`[OK] ${table} mevcut.`)
      if (data && data.length > 0) {
        console.log(`Sütunlar:`, Object.keys(data[0]))
      } else {
        console.log(`Tablo boş.`)
      }
    }
  }
}

checkSchema()
