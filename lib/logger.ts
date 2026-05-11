export type LogType = 'ERROR' | 'SECURITY' | 'WARNING' | 'INFO'

interface LogData {
  type: LogType
  message: string
  details?: any
  path?: string
  userId?: string
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const logger = {
  async log({ type, message, details, path, userId }: LogData) {
    try {
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
