'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('Email veya sifre hatali')
        setLoading(false)
        return
      }

      if (data.user) {
        // Admin kontrolu
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', data.user.id)
          .single()

        if (adminError || !adminData) {
          await supabase.auth.signOut()
          setError('Bu hesap admin yetkisine sahip degil')
          setLoading(false)
          return
        }

        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('Bir hata olustu, tekrar deneyin')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-white">
              Fethiye<span className="text-[#64ffda]">360</span>
            </h1>
          </Link>
          <p className="text-slate-400 mt-2">Admin Paneli</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#112240] rounded-2xl p-8 shadow-xl border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Giris Yap
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Email Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fethiye360.com"
                  className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#64ffda] focus:ring-1 focus:ring-[#64ffda] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Sifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 pl-11 pr-11 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#64ffda] focus:ring-1 focus:ring-[#64ffda] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#64ffda] text-[#0a192f] font-semibold py-3 rounded-lg hover:bg-[#52e0c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Giris yapiliyor...
                </>
              ) : (
                'Giris Yap'
              )}
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-slate-400 hover:text-[#64ffda] transition-colors text-sm"
          >
            Ana Sayfaya Don
          </Link>
        </div>
      </div>
    </div>
  )
}
