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
  X,
  Check,
  AlertCircle
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
  updated_at: string
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
    bio: ''
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
      bio: user.bio || ''
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
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id)

      if (error) {
        if (error.code === '23505') {
          toast.error('Bu kullanıcı adı zaten alınmış')
        } else {
          throw error
        }
        return
      }

      toast.success('Kullanıcı başarıyla güncellendi')
      setEditingUser(null)
      fetchUsers() // Listeyi tazele
    } catch (error: any) {
      toast.error('Güncelleme sırasında bir hata oluştu')
      console.error(error)
    } finally {
      setUpdating(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <div className="p-3 bg-[#64ffda]/10 rounded-2xl">
              <Users className="w-8 h-8 text-[#64ffda]" />
            </div>
            Kullanıcı Yönetimi
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Site ziyaretçilerini listeleyin ve bilgilerini revize edin.</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#64ffda] transition-colors" />
          <input
            type="text"
            placeholder="İsim veya kullanıcı adı ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 bg-[#112240] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
          />
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-[#64ffda] animate-spin" />
          <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Veriler Alınıyor...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div 
              key={user.id}
              className="bg-[#112240]/50 border border-white/5 rounded-[32px] p-6 hover:border-[#64ffda]/30 transition-all group relative overflow-hidden"
            >
              <div className="flex items-start gap-4 relative z-10">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-[#64ffda]/50 transition-colors bg-[#0a192f]">
                    {user.avatar_url ? (
                      <Image src={user.avatar_url} alt={user.username} fill className="object-cover" />
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
                  Güncelleme: {new Date(user.updated_at).toLocaleDateString('tr-TR')}
                </div>
                
                {user.bio && (
                  <div className="text-slate-300 text-sm line-clamp-2 italic px-2">
                    "{user.bio}"
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <button 
                  onClick={() => handleEditClick(user)}
                  className="flex items-center gap-2 text-xs font-black text-[#64ffda] uppercase tracking-[0.2em] hover:bg-[#64ffda]/10 p-2 rounded-lg transition-all"
                >
                  <Edit2 className="w-4 h-4" /> Revize Et
                </button>
                
                <button className="p-2 text-slate-500 hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="bg-[#112240] border-white/10 text-white max-w-lg rounded-[32px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <Edit2 className="w-6 h-6 text-[#64ffda]" />
              Kullanıcıyı Revize Et
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Ad Soyad</Label>
              <Input 
                value={editForm.full_name}
                onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                className="bg-[#0a192f] border-white/5 rounded-xl h-12 focus:ring-[#64ffda]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Kullanıcı Adı (@)</Label>
              <Input 
                value={editForm.username}
                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                className="bg-[#0a192f] border-white/5 rounded-xl h-12 focus:ring-[#64ffda]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Biyografi / Hakkında</Label>
              <Textarea 
                value={editForm.bio}
                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                className="bg-[#0a192f] border-white/5 rounded-xl min-h-[100px] focus:ring-[#64ffda]"
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setEditingUser(null)}
              className="rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/5"
            >
              İptal
            </Button>
            <Button 
              onClick={handleUpdateUser}
              disabled={updating}
              className="bg-[#64ffda] text-[#0a192f] rounded-xl font-black uppercase tracking-widest text-xs px-8 hover:bg-[#52e0c4]"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Değişiklikleri Kaydet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
