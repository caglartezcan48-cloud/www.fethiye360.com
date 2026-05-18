import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load env variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function run() {
  console.log('Checking site_settings table...')
  const { data, error } = await supabase.from('site_settings').select('*').limit(1)
  if (error) {
    console.log('site_settings table does not exist or error:', error.message)
  } else {
    console.log('site_settings table exists! Data:', data)
  }

  console.log('Checking system_settings table...')
  const { data: data2, error: error2 } = await supabase.from('system_settings').select('*').limit(1)
  if (error2) {
    console.log('system_settings table does not exist or error:', error2.message)
  } else {
    console.log('system_settings table exists! Data:', data2)
  }
}

run()
