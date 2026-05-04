'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error'
    message: string
  }>({ type: 'idle', message: '' })

  const supabase = createClient()

  const createAdmin = async () => {
    setLoading(true)
    setStatus({ type: 'idle', message: '' })

    try {
      const email = 'admin@fethiye360.com'
      const password = 'AdminFethiye360!'

      // 1. Kullanıcıyı oluştur (veya giriş yapmayı dene)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Sistem Yöneticisi',
          }
        }
      })

      if (authError) {
        // Eğer kullanıcı zaten varsa giriş yapmayı deneyelim
        if (authError.message.includes('already registered')) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          })
          
          if (signInError) {
            throw new Error('Kullanıcı zaten var ama şifre uyuşmuyor veya yetki alınamadı.')
          }
        } else {
          throw authError
        }
      }

      // 2. Mevcut kullanıcıyı al
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Kullanıcı oturumu açılamadı.')

      // 3. admin_users tablosuna ekle
      const { error: adminError } = await supabase
        .from('admin_users')
        .upsert({
          id: user.id,
          full_name: 'Sistem Yöneticisi',
          is_super_admin: true
        })

      if (adminError) {
        console.error('Admin yetki hatası:', adminError)
        throw new Error('Kullanıcı oluşturuldu ama veritabanı yetkisi verilemedi (RLS engeli olabilir).')
      }

      setStatus({
        type: 'success',
        message: 'Admin hesabı başarıyla oluşturuldu ve yetkilendirildi!'
      })
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Bir hata oluştu.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center p-4 text-white">
      <div className="max-w-md w-full bg-[#112240] p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#64ffda]/10 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-[#64ffda]" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Admin Kurulumu</h1>
        <p className="text-slate-400 text-center mb-8 text-sm">
          Bu sayfa tek seferlik admin hesabı oluşturmak için tasarlanmıştır.
        </p>

        {status.type === 'idle' && (
          <div className="space-y-4">
            <div className="bg-[#0a192f] p-4 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-500 uppercase font-bold mb-2">Oluşturulacak Bilgiler:</p>
              <p className="text-sm"><strong>Email:</strong> admin@fethiye360.com</p>
              <p className="text-sm"><strong>Şifre:</strong> AdminFethiye360!</p>
            </div>
            
            <button
              onClick={createAdmin}
              disabled={loading}
              className="w-full bg-[#64ffda] text-[#0a192f] font-bold py-4 rounded-xl hover:bg-[#52e0c4] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                'Admin Hesabını Şimdi Oluştur'
              )}
            </button>
          </div>
        )}

        {status.type === 'success' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <p className="text-green-400 font-medium">{status.message}</p>
            <Link
              href="/admin/giris"
              className="block w-full bg-white text-[#0a192f] font-bold py-3 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Giriş Sayfasına Git
            </Link>
          </div>
        )}

        {status.type === 'error' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
            <p className="text-red-400 text-sm bg-red-400/10 p-4 rounded-lg border border-red-400/20">
              {status.message}
            </p>
            <button
              onClick={() => setStatus({ type: 'idle', message: '' })}
              className="text-[#64ffda] hover:underline text-sm"
            >
              Tekrar Dene
            </button>
          </div>
        )}
        
        <p className="text-[10px] text-slate-500 mt-8 text-center italic">
          * İşlem tamamlandıktan sonra bu sayfayı silmeyi unutmayın.
        </p>
      </div>
    </div>
  )
}
