'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogIn, Mail, Lock, Loader2, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function UnifiedLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      toast.error('Google ile giriş başarısız oldu')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError('E-posta veya şifre hatalı')
      setLoading(false)
      return
    }

    if (data.user) {
      // AKILLI YONLENDIRME MANTIGI
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', data.user.id)
        .single()

      if (business) {
        router.push('/isletme-paneli')
        return
      }

      if (email === 'admin@fethiye360.com') {
        router.push('/admin')
        return
      }

      router.push('/profil')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#64ffda]/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-2xl relative group">
            <div className="absolute inset-0 bg-[#64ffda]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <LogIn className="w-10 h-10 text-[#64ffda] relative z-10" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">Hoş Geldiniz</h1>
          <p className="text-slate-400 font-medium">İşletme veya Ziyaretçi hesabı ile giriş yapın</p>
        </div>

        <div className="space-y-6 bg-[#112240]/50 backdrop-blur-3xl p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
          <button 
            onClick={handleGoogleLogin}
            type="button"
            className="w-full bg-white text-[#0a192f] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile Devam Et
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black"><span className="bg-[#112240] px-4 text-slate-500">Veya</span></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">E-Posta Adresiniz</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a192f] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
                  placeholder="mail@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Şifreniz</label>
              <div className="relative group/pass">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/pass:text-[#64ffda] transition-colors" />
                <input 
                  required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a192f] border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#64ffda] transition-colors p-1">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-xs font-bold text-center animate-shake">{error}</div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#64ffda] text-[#0a192f] py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#52e0c4] transition-all shadow-xl shadow-[#64ffda]/10 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Giriş Yap <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="flex flex-col gap-2 pt-4 text-center">
            <Link href="/kayit" className="text-slate-400 text-xs font-medium hover:text-[#64ffda] transition-colors">
              Hesabınız yok mu? <span className="text-[#64ffda] font-black uppercase tracking-widest ml-1">Kayıt Ol</span>
            </Link>
            <Link href="/isletme-basvuru" className="text-slate-400 text-xs font-medium hover:text-[#64ffda] transition-colors">
              İşletmenizi <span className="text-[#64ffda] font-black uppercase tracking-widest ml-1">Eklemek İster Misiniz?</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
