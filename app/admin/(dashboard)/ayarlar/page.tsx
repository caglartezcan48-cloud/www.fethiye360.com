'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Check, Key, User } from 'lucide-react'

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Yeni sifreler eslesmıyor' })
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Sifre en az 6 karakter olmali' })
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        setMessage({ type: 'error', text: 'Sifre degistirilemedi: ' + error.message })
      } else {
        setMessage({ type: 'success', text: 'Sifre basariyla degistirildi' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch {
      setMessage({ type: 'error', text: 'Bir hata olustu' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Ayarlar</h1>

      <div className="max-w-2xl space-y-6">
        {/* Hesap Bilgileri */}
        <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#64ffda]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#64ffda]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Hesap Bilgileri</h2>
              <p className="text-sm text-slate-400">Hesap bilgilerinizi goruntueleyin</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email</label>
              <p className="text-white">Supabase&apos;den yuklenecek</p>
            </div>
          </div>
        </div>

        {/* Sifre Degistir */}
        <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Sifre Degistir</h2>
              <p className="text-sm text-slate-400">Hesap sifrenizi guncelleyin</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Mevcut Sifre</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Yeni Sifre</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Yeni Sifre (Tekrar)</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors"
                required
                minLength={6}
              />
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                  : 'bg-red-500/10 border border-red-500/50 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#64ffda] text-[#0a192f] font-semibold py-3 rounded-lg hover:bg-[#52e0c4] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Sifreyi Degistir
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
