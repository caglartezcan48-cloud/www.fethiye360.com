'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { UserPlus, Phone, Lock, Loader2, ArrowRight, User } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Telefon numarasını hayalet e-postaya dönüştür (Ücretsiz kalmak için)
    const virtualEmail = `${phone.replace(/\s+/g, '')}@fethiye360.com`

    try {
      // 1. Auth Kaydı
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: virtualEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username.toLowerCase(),
            phone: phone
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
              phone: phone,
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
              is_public: true
            }
          ])

        if (profileError) throw profileError

        toast.success('Kayıt başarılı! Şimdi giriş yapabilirsiniz.')
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
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">Kayıt Ol</h1>
          <p className="text-slate-400 font-medium">Hızlıca katılın, Fethiye'yi keşfedin</p>
        </div>

        <div className="space-y-6 bg-[#112240]/50 backdrop-blur-3xl p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Telefon Numaranız</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0a192f] border border-white/5 rounded-2xl py-4 pl-11 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none text-sm font-bold"
                  placeholder="05XX XXX XX XX"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kullanıcı Adı</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    required type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#0a192f] border border-white/5 rounded-2xl py-4 pl-11 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none text-sm"
                    placeholder="kullanici_adi"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ad Soyad</label>
                <input 
                  required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0a192f] border border-white/5 rounded-2xl py-4 px-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none text-sm"
                  placeholder="Ali Yılmaz"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Şifre Belirleyin</label>
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Hemen Kayıt Ol <ArrowRight className="w-4 h-4" /></>}
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
