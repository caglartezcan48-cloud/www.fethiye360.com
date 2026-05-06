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
  Edit2,
  ExternalLink,
  Filter,
  ChevronRight,
  ArrowUpDown,
  Phone
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface UserProfile {
  id: string
  username: string
  full_name: string
  avatar_url: string
  bio: string
  is_public: boolean
  phone: string
  updated_at: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Düzenleme State'leri
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [editForm, setEditForm] = useState({
    full_name: '',
    username: '',
    bio: '',
    phone: ''
  })
  const [updating, setUpdating] = useState(false)

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
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (user: UserProfile) => {
    setEditingUser(user)
    setEditForm({
      full_name: user.full_name || '',
      username: user.username || '',
      bio: user.bio || '',
      phone: user.phone || ''
    })
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      setUpdating(true)
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: editForm.full_name,
          username: editForm.username,
          bio: editForm.bio,
          phone: editForm.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id)

      if (error) throw error

      toast.success('Kullanıcı başarıyla güncellendi')
      setEditingUser(null)
      fetchUsers()
    } catch (error: any) {
      toast.error('Güncelleme sırasında bir hata oluştu')
    } finally {
      setUpdating(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone?.includes(searchQuery)
  )

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#64ffda]/10 rounded-[24px] border border-[#64ffda]/20">
              <Users className="w-8 h-8 text-[#64ffda]" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Kullanıcı Yönetimi</h1>
              <div className="flex items-center gap-2 text-[#64ffda] text-[10px] font-black uppercase tracking-[0.3em]">
                <Shield className="w-3 h-3" /> Toplam {users.length} Kayıtlı Ziyaretçi
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#64ffda] transition-all" />
            <input
              type="text"
              placeholder="İsim veya kullanıcı adı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-96 bg-[#112240] border border-white/5 rounded-[20px] py-5 pl-14 pr-6 text-white focus:ring-2 focus:ring-[#64ffda]/50 transition-all outline-none text-sm font-medium shadow-2xl"
            />
          </div>
          <button className="p-5 bg-[#112240] border border-white/5 rounded-[20px] text-[#64ffda] hover:bg-[#1d3359] transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Users List View (Table-like) */}
      <div className="bg-[#112240]/40 backdrop-blur-3xl rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Profil / Kullanıcı</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Biyografi</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">İletişim (Telefon)</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  <div className="flex items-center gap-2">
                    Kayıt Tarihi <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-12 h-12 text-[#64ffda] animate-spin" />
                      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Veritabanı Okunuyor...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-32 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Users className="w-10 h-10 text-slate-700" />
                    </div>
                    <p className="text-slate-500 font-bold italic">Aradığınız kriterde bir kullanıcı bulunamadı.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 p-0.5 bg-[#0a192f] shrink-0">
                          {user.avatar_url ? (
                            <Image src={user.avatar_url} alt={user.username} fill className="object-cover rounded-xl" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#64ffda]/10 rounded-xl">
                              <UserIcon className="w-6 h-6 text-[#64ffda]" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-base group-hover:text-[#64ffda] transition-colors line-clamp-1">
                              {user.full_name || 'İsimsiz Kullanıcı'}
                            </span>
                            {user.is_public ? (
                              <Unlock className="w-3 h-3 text-[#64ffda]/50" />
                            ) : (
                              <Lock className="w-3 h-3 text-red-400/50" />
                            )}
                          </div>
                          <span className="text-slate-500 text-xs font-black uppercase tracking-widest mt-0.5">@{user.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.is_public ? 'bg-[#64ffda]/5 border-[#64ffda]/20 text-[#64ffda]' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
                          {user.is_public ? 'Halka Açık' : 'Gizli Profil'}
                        </div>
                        <p className="text-slate-500 text-sm italic line-clamp-1 max-w-[200px]">
                          {user.bio ? `"${user.bio}"` : '—'}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-white font-bold text-sm bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                        <Phone className="w-3.5 h-3.5 text-[#64ffda]" />
                        {user.phone || 'Girilmemiş'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-[#64ffda]" />
                        {new Date(user.created_at || user.updated_at).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditClick(user)}
                          className="h-10 px-4 bg-[#64ffda]/5 text-[#64ffda] border border-[#64ffda]/20 rounded-xl hover:bg-[#64ffda] hover:text-[#0a192f] transition-all font-black uppercase tracking-widest text-[10px]"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-2" /> Revize Et
                        </Button>
                        <button className="p-2.5 text-slate-500 hover:text-white bg-white/5 rounded-xl transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal (Dialog) */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="bg-[#112240] border-white/10 text-white rounded-[40px] max-w-lg shadow-2xl p-0 overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-white/[0.02]">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black flex items-center gap-4 tracking-tighter italic uppercase">
                <div className="p-3 bg-[#64ffda]/10 rounded-2xl">
                  <Edit2 className="w-6 h-6 text-[#64ffda]" />
                </div>
                Profil Revize
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Tam Ad Soyad</Label>
              <Input 
                value={editForm.full_name}
                onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                className="bg-[#0a192f] border-white/5 rounded-2xl h-16 px-6 focus:ring-2 focus:ring-[#64ffda] text-white font-medium"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Kullanıcı Adı</Label>
              <Input 
                value={editForm.username}
                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                className="bg-[#0a192f] border-white/5 rounded-2xl h-16 px-6 focus:ring-2 focus:ring-[#64ffda] text-white font-medium"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Telefon Numarası</Label>
              <Input 
                value={editForm.phone}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                className="bg-[#0a192f] border-white/5 rounded-2xl h-16 px-6 focus:ring-2 focus:ring-[#64ffda] text-white font-medium"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Biyografi</Label>
              <Textarea 
                value={editForm.bio}
                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                className="bg-[#0a192f] border-white/5 rounded-2xl min-h-[140px] p-6 focus:ring-2 focus:ring-[#64ffda] text-white resize-none text-sm leading-relaxed"
                placeholder="Kullanıcı hakkında bir şeyler yazın..."
              />
            </div>
          </div>

          <DialogFooter className="p-8 bg-white/[0.02] border-t border-white/5 gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setEditingUser(null)}
              className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 px-8 hover:bg-white/5 text-slate-400"
            >
              İptal
            </Button>
            <Button 
              onClick={handleUpdateUser}
              disabled={updating}
              className="bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 px-10 hover:bg-[#52e0c4] shadow-xl shadow-[#64ffda]/10 flex-1"
            >
              {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Güncellemeyi Onayla'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
