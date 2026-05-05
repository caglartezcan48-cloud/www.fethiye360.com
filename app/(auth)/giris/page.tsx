'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogIn, Mail, Lock, Loader2, ArrowRight, Sparkles, Building2, User } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function UnifiedLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

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
      
      // 1. Isletme sahibi mi?
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', data.user.id)
        .single()

      if (business) {
        router.push('/isletme-paneli')
        return
      }

      // 2. Admin mi? (Opsiyonel: E-posta kontrolü veya metadata)
      if (email === 'admin@fethiye360.com') { // Ornek admin kontrolü
        router.push('/admin')
        return
      }

      // 3. Varsayilan: Ziyaretçi Profiline git
      router.push('/profil')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background HD Glows */}
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

        <form onSubmit={handleLogin} className="space-y-5 bg-[#112240]/50 backdrop-blur-3xl p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-32 h-32 text-[#64ffda]" />
          </div>

          <div className="space-y-2 relative z-10">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">E-Posta Adresiniz</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a192f] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
                placeholder="mail@example.com"
              />
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Şifreniz</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a192f] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-xs font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#64ffda] text-[#0a192f] py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#52e0c4] transition-all shadow-xl shadow-[#64ffda]/10 active:scale-95 disabled:opacity-50 relative z-10"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Giriş Yap <ArrowRight className="w-4 h-4" /></>}
          </button>

          <div className="flex flex-col gap-4 pt-6 text-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-white/5"></div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">veya</span>
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Link href="/kayit" className="text-slate-400 text-xs font-medium hover:text-[#64ffda] transition-colors">
                Ziyaretçi olarak <span className="text-[#64ffda] font-black uppercase tracking-widest ml-1">Kayıt Ol</span>
              </Link>
              <Link href="/isletme-basvuru" className="text-slate-400 text-xs font-medium hover:text-[#64ffda] transition-colors">
                İşletmenizi <span className="text-[#64ffda] font-black uppercase tracking-widest ml-1">Eklemek İster Misiniz?</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
