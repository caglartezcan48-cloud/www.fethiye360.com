'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Users, 
  Search, 
  Mail, 
  Calendar, 
  User as UserIcon, 
  Loader2, 
  Shield, 
  MoreHorizontal,
  ExternalLink,
  MapPin
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  username: string
  full_name: string
  avatar_url: string
  bio: string
  updated_at: string
  // created_at profiles tablosunda yoksa updated_at kullanılır veya profil olusturma tarihi
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error: any) {
      toast.error('Kullanıcılar yüklenirken bir hata oluştu')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <div className="p-3 bg-[#64ffda]/10 rounded-2xl">
              <Users className="w-8 h-8 text-[#64ffda]" />
            </div>
            Kullanıcı Yönetimi
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Siteye kayıtlı tüm ziyaretçileri görüntüleyin ve yönetin.</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#64ffda] transition-colors" />
          <input
            type="text"
            placeholder="Kullanıcı ara (Ad veya Kullanıcı Adı)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 bg-[#112240] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
          />
        </div>
      </div>

      {/* Users Grid/Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-[#64ffda] animate-spin" />
          <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Kullanıcılar Yükleniyor...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-20 bg-[#112240]/50 rounded-[40px] border border-white/5">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium text-lg">Kullanıcı bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div 
              key={user.id}
              className="bg-[#112240]/50 border border-white/5 rounded-[32px] p-6 hover:border-[#64ffda]/30 transition-all group relative overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <Shield className="w-24 h-24 text-[#64ffda]" />
              </div>

              <div className="flex items-start gap-4 relative z-10">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-[#64ffda]/50 transition-colors bg-[#0a192f]">
                    {user.avatar_url ? (
                      <Image 
                        src={user.avatar_url} 
                        alt={user.username}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#64ffda]/10">
                        <UserIcon className="w-8 h-8 text-[#64ffda]" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#64ffda] rounded-lg flex items-center justify-center border-2 border-[#0a192f]">
                    <Shield className="w-3 h-3 text-[#0a192f]" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#64ffda] transition-colors truncate">
                    {user.full_name || 'İsimsiz Kullanıcı'}
                  </h3>
                  <p className="text-slate-400 text-sm font-medium">@{user.username}</p>
                </div>
              </div>

              <div className="mt-8 space-y-3 relative z-10">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-widest bg-white/5 p-3 rounded-xl">
                  <Calendar className="w-4 h-4 text-[#64ffda]" />
                  Son Güncelleme: {new Date(user.updated_at).toLocaleDateString('tr-TR')}
                </div>
                
                {user.bio && (
                  <div className="text-slate-300 text-sm line-clamp-2 italic px-2">
                    "{user.bio}"
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <button 
                  onClick={() => toast.info('Detay sayfası yakında eklenecek')}
                  className="flex items-center gap-2 text-xs font-black text-[#64ffda] uppercase tracking-[0.2em] hover:opacity-80 transition-opacity"
                >
                  Profili Gör <ExternalLink className="w-4 h-4" />
                </button>
                
                <div className="flex gap-2">
                   {/* Buraya Silme veya Düzenleme butonları eklenebilir */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
