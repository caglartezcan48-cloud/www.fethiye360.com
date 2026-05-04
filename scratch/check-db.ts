import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// .env.local dosyasini manuel oku
const envPath = path.resolve(process.cwd(), '.env.local')
const envConfig = dotenv.parse(fs.readFileSync(envPath))

const supabase = createClient(
  envConfig.NEXT_PUBLIC_SUPABASE_URL,
  envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function check() {
  console.log('--- ISLETMELER ---')
  const { data: businesses } = await supabase.from('businesses').select('name, category_id')
  console.log(businesses)

  console.log('\n--- KATEGORILER ---')
  const { data: categories } = await supabase.from('business_categories').select('id, name')
  console.log(categories)
}

check()
