import { createClient } from '@/lib/supabase/client'

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
    const supabase = createClient()
    
    // Tarayici ve IP bilgisini detaylara ekle
    const extendedDetails = {
      ...details,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
      timestamp: new Date().toISOString(),
    }

    try {
      const { error } = await supabase
        .from('system_logs')
        .insert([{
          type,
          message,
          details: extendedDetails,
          path: path || (typeof window !== 'undefined' ? window.location.pathname : null),
          user_id: userId || null
        }])

      if (error) console.error('Logging failed:', error)
    } catch (err) {
      console.error('Critical logger failure:', err)
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
