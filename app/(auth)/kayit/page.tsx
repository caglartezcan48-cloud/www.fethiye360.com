'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { UserPlus, Mail, Lock, Loader2, ArrowRight, User, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      toast.error('Google ile kayıt başarısız oldu')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Auth Kaydı
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username.toLowerCase(),
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // 2. Profil Tablosuna Ekle
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: authData.user.id,
              username: username.toLowerCase(),
              full_name: fullName,
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
              is_public: true
            }
          ])

        if (profileError) throw profileError

        toast.success('Kayıt başarılı! Giriş yapabilirsiniz.')
        router.push('/giris')
      }
    } catch (err: any) {
      setError(err.message)
      toast.error('Kayıt işlemi başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#64ffda]/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-2xl relative group">
            <div className="absolute inset-0 bg-[#64ffda]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <UserPlus className="w-10 h-10 text-[#64ffda] relative z-10" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">Yeni Hesap</h1>
          <p className="text-slate-400 font-medium">Fethiye 360 Dünyasına Katılın</p>
        </div>

        <div className="space-y-6 bg-[#112240]/50 backdrop-blur-3xl p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
          
          <button 
            onClick={handleGoogleSignup}
            type="button"
            className="w-full bg-white text-[#0a192f] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile Hızlı Kayıt
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black"><span className="bg-[#112240] px-4 text-slate-500">Veya Formu Doldurun</span></div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kullanıcı Adı</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    required type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#0a192f] border border-white/5 rounded-2xl py-4 pl-11 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none text-sm"
                    placeholder="fethiye_asigi"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ad Soyad</label>
                <input 
                  required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0a192f] border border-white/5 rounded-2xl py-4 px-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none text-sm"
                  placeholder="Can Yılmaz"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-Posta</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a192f] border border-white/5 rounded-2xl py-4 pl-11 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none text-sm"
                  placeholder="mail@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a192f] border border-white/5 rounded-2xl py-4 pl-11 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-[10px] font-bold text-center italic">{error}</div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#64ffda] text-[#0a192f] py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#52e0c4] transition-all shadow-xl shadow-[#64ffda]/10 active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Hesap Oluştur <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="pt-4 text-center">
            <Link href="/giris" className="text-slate-400 text-xs font-medium hover:text-[#64ffda] transition-colors">
              Zaten hesabınız var mı? <span className="text-[#64ffda] font-black uppercase tracking-widest ml-1">Giriş Yap</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
