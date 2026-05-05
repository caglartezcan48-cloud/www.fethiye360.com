'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // 1. Auth Kaydi
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username.toLowerCase().replace(/\s+/g, ''),
        }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (authData.user) {
      // 2. Profil Tablosuna Ekle (Trigger yoksa manuel)
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: authData.user.id,
          username: username.toLowerCase().replace(/\s+/g, ''),
          full_name: fullName,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        }])

      if (profileError) {
        console.error('Profil olusturulamadi:', profileError)
      }

      router.push('/profil')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#64ffda]/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#64ffda] to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_20px_50px_rgba(100,255,218,0.3)] rotate-3">
            <UserPlus className="w-10 h-10 text-[#0a192f]" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase">Fethiye360'a Katıl</h1>
          <p className="text-slate-400 font-medium">Fethiye maceralarını paylaşmaya hazır mısın?</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5 bg-white/5 p-8 rounded-[40px] border border-white/5 backdrop-blur-2xl shadow-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Kullanıcı Adı</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0a192f] border-none rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all"
                placeholder="fethiyeli48"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Ad Soyad</label>
            <div className="relative">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0a192f] border-none rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all"
                placeholder="Can Yılmaz"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">E-Posta</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a192f] border-none rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all"
                placeholder="mail@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a192f] border-none rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#64ffda] text-[#0a192f] py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#52e0c4] transition-all shadow-xl shadow-[#64ffda]/10 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Kayıt Ol <ArrowRight className="w-4 h-4" /></>}
          </button>

          <div className="text-center pt-4">
            <span className="text-slate-500 text-xs font-medium">Zaten üye misin? </span>
            <Link href="/giris" className="text-[#64ffda] text-xs font-black uppercase tracking-widest hover:underline">Giriş Yap</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
