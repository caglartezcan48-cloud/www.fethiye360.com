// import { createClient } from '@/lib/supabase/client'

export type LogType = 'ERROR' | 'SECURITY' | 'WARNING' | 'INFO'

interface LogData {
  type: LogType
  message: string
  details?: any
  path?: string
  userId?: string
}

export const logger = {
  async log({ type, message, details, path, userId }: LogData) {
    try {
      // Ortama gore dogru client'i sec
      let supabase;
      if (typeof window === 'undefined') {
        const { createClient: createServerClient } = await import('@/lib/supabase/server')
        supabase = await createServerClient()
      } else {
        const { createClient: createBrowserClient } = await import('@/lib/supabase/client')
        supabase = createBrowserClient()
      }
      
      const extendedDetails = {
        ...details,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-Side',
        environment: typeof window !== 'undefined' ? 'Client' : 'Server',
        timestamp: new Date().toISOString(),
      }

      await supabase
        .from('system_logs')
        .insert([{
          type,
          message,
          details: extendedDetails,
          path: path || (typeof window !== 'undefined' ? window.location.pathname : 'Server-Side Route'),
          user_id: userId || null
        }])
    } catch (err) {
      console.error('Logger failed:', err)
    }
  },

  error(message: string, details?: any, userId?: string) {
    return this.log({ type: 'ERROR', message, details, userId })
  },

  security(message: string, details?: any, userId?: string) {
    return this.log({ type: 'SECURITY', message, details, userId })
  },

  warn(message: string, details?: any, userId?: string) {
    return this.log({ type: 'WARNING', message, details, userId })
  }
}
