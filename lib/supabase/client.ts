import { createBrowserClient } from '@supabase/ssr'

let client: any = null

// Deployment Trigger: Vercel Build Retry
export function createClient() {
  if (client) return client

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        storageKey: 'fethiye360-auth-token',
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  )

  return client
}
