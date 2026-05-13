import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function check() {
  const { data, error } = await supabase.from('business_products').select('*').limit(1)
  console.log('Columns:', data ? Object.keys(data[0]) : 'No data or error')
  if (error) console.error(error)
}

check()
