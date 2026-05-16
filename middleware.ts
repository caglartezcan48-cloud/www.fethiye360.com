import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match only routes that need auth/session updates:
     */
    '/((?:admin|profil|giris|api/auth).*)',
  ],
}
