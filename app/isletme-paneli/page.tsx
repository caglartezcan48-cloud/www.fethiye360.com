'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { 
  Building2, 
  Package, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Plus, 
  Star,
  MessageSquare,
  Save,
  Loader2
} from 'lucide-react'

export default function BusinessPanel() {
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/isletme-giris')
        return
      }
      setUser(user)

      // Kullanicinin isletmesini getirelim
      const { data: businessData } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single()
      
      setBusiness(businessData)
      setLoading(false)
    }
    checkUser()
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    const { error } = await supabase
      .from('businesses')
      .update({
        description: business.description,
        phone: business.phone,
        address: business.address,
        website: business.website
      })
      .eq('id', business.id)

    setUpdating(false)
    if (!error) alert('Bilgiler güncellendi!')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#64ffda] animate-spin" />
    </div>
  )

  if (!business) return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center p-6 text-center">
      <div>
        <Building2 className="w-16 h-16 text-slate-700 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">İşletme Bulunamadı</h1>
        <p className="text-slate-400 mb-8">Henüz hesabınıza tanımlı bir işletme yok.</p>
        <button onClick={handleLogout} className="text-[#64ffda] hover:underline">Çıkış Yap</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a192f] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#112240] border-r border-slate-700/50 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda]">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-white font-bold truncate">{business.name}</span>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#64ffda] text-[#0a192f] rounded-xl font-bold transition-all">
              <Settings className="w-5 h-5" />
              Genel Bilgiler
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <Package className="w-5 h-5" />
              Ürünler & Hizmetler
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <ImageIcon className="w-5 h-5" />
              Fotoğraf Galerisi
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <MessageSquare className="w-5 h-5" />
              Yorumlar
            </button>
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Çıkış Yap
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Genel Bilgiler</h2>
              <p className="text-slate-400 text-sm">İşletmenizin profilini buradan güncelleyebilirsiniz.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20 text-xs font-bold">
              <Star className="w-4 h-4 fill-yellow-500" />
              Puan: {business.rating || '5.0'}
            </div>
          </header>

          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#112240] p-8 rounded-[40px] border border-slate-700/50">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 tracking-widest">İşletme Açıklaması</label>
              <textarea 
                value={business.description || ''}
                onChange={(e) => setBusiness({...business, description: e.target.value})}
                className="w-full bg-[#0a192f] border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda] min-h-[150px]"
                placeholder="İşletmenizi tanıtan bir yazı yazın..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 tracking-widest">Telefon</label>
              <input 
                type="text"
                value={business.phone || ''}
                onChange={(e) => setBusiness({...business, phone: e.target.value})}
                className="w-full bg-[#0a192f] border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda]"
                placeholder="0252 614 ..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 tracking-widest">Adres</label>
              <input 
                type="text"
                value={business.address || ''}
                onChange={(e) => setBusiness({...business, address: e.target.value})}
                className="w-full bg-[#0a192f] border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda]"
                placeholder="Fethiye, Muğla"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button 
                type="submit"
                disabled={updating}
                className="px-10 py-4 bg-[#64ffda] hover:bg-[#52e0c4] text-[#0a192f] rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-[#64ffda]/10"
              >
                {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <Save className="w-5 h-5" />
                    Bilgileri Kaydet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
