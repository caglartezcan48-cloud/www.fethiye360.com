'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Building2, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function BusinessLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setLoading(true)
    setError('')

    // Kullanici adini otomatik olarak slug (email formati) sekline cevir
    const formattedEmail = email.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '@fethiye360.com'

    const { error } = await supabase.auth.signInWithPassword({
      email: formattedEmail,
      password,
    })

    if (error) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.')
      setLoading(false)
    } else {
      router.push('/isletme-paneli')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-3xl bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda] mx-auto mb-6">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">İşletme Paneli</h1>
          <p className="text-slate-400">İşletmenizi yönetmek için giriş yapın</p>
        </div>

        <div className="bg-[#112240] rounded-[32px] p-8 border border-slate-700/50 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Kullanıcı Adı (İşletme Adı)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a192f] border-none rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all"
                  placeholder="Örn: Burgerci"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a192f] border-none rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#64ffda] hover:bg-[#52e0c4] text-[#0a192f] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Giriş Yap
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Henüz kaydınız yok mu? <Link href="/iletisim" className="text-[#64ffda] hover:underline font-medium">Bize ulaşın</Link>
        </p>
      </div>
    </div>
  )
}
