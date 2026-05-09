import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

const envPath = path.resolve(process.cwd(), '.env.local')
const envConfig = dotenv.parse(fs.readFileSync(envPath))

const supabase = createClient(
  envConfig.NEXT_PUBLIC_SUPABASE_URL,
  envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkSchema() {
  const tables = ['user_stories', 'notifications', 'post_comments', 'post_likes', 'user_posts', 'businesses']
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1)
    if (error) {
      console.log(`Table ${table} error:`, error.message, error.code)
    } else if (data && data.length > 0) {
      console.log(`Table ${table} columns:`, Object.keys(data[0]))
    } else {
      console.log(`Table ${table}: Empty or exists but no data`)
    }
  }
}

checkSchema()
