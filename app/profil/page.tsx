'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { 
  Camera, 
  Grid, 
  MapPin, 
  Settings, 
  LogOut, 
  Plus, 
  Loader2, 
  Heart, 
  MessageSquare,
  User as UserIcon,
  Sparkles,
  Edit3,
  Image as ImageIcon,
  Check,
  X,
  Upload
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

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  
  // Modal State'leri
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: ''
  })
  
  const supabase = createClient()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/giris')
        return
      }
      setUser(user)

      // Profil bilgilerini getir
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profileData)
      setEditForm({
        full_name: profileData?.full_name || '',
        bio: profileData?.bio || ''
      })

      // Kullanicinin paylasimlarini getir
      const { data: userPosts } = await supabase
        .from('user_posts')
        .select(`
          *,
          post_comments (id),
          post_likes (id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setPosts(userPosts || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true)
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: editForm.full_name,
          bio: editForm.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error
      
      toast.success('Profiliniz başarıyla güncellendi ✨')
      setIsEditModalOpen(false)
      fetchProfile()
    } catch (error: any) {
      toast.error('Güncelleme yapılamadı')
    } finally {
      setUpdating(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUpdating(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      toast.success('Profil fotoğrafınız güncellendi! 📸')
      fetchProfile()
    } catch (error: any) {
      toast.error('Fotoğraf yüklenirken bir hata oluştu')
    } finally {
      setUpdating(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a192f] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-[#64ffda] animate-spin" />
      <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Profil Yükleniyor</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a192f] text-white selection:bg-[#64ffda]/30 pb-20 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-screen pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#64ffda]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-12 md:pt-20">
        
        {/* Profile Info Section */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16 mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#64ffda] to-blue-500 rounded-[60px] blur-2xl opacity-10 group-hover:opacity-30 transition-all duration-500" />
            <div className="relative w-40 h-40 md:w-44 md:h-44 rounded-[56px] overflow-hidden border-4 border-white/5 p-1.5 bg-[#112240] ring-1 ring-white/10">
              <div className="relative w-full h-full rounded-[44px] overflow-hidden bg-[#0a192f]">
                <Image 
                  src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username}`} 
                  alt="Avatar" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {updating && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#64ffda] animate-spin" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 right-2 p-3 bg-[#64ffda] text-[#0a192f] rounded-2xl shadow-2xl scale-0 group-hover:scale-100 transition-all duration-300">
                <Camera className="w-5 h-5" />
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <h1 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-2">
                {profile?.username}
                <div className="w-5 h-5 bg-[#64ffda] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#0a192f] stroke-[4]" />
                </div>
              </h1>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-6 py-2.5 bg-[#64ffda] text-[#0a192f] hover:bg-[#52e0c4] rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                >
                  Profili Düzenle
                </button>
                <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-12">
              <div className="text-center md:text-left group cursor-default">
                <span className="block text-2xl font-black text-[#64ffda] group-hover:scale-110 transition-transform">{posts.length}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Gönderi</span>
              </div>
              <div className="text-center md:text-left group cursor-default">
                <span className="block text-2xl font-black text-white group-hover:scale-110 transition-transform">1.2K</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Takipçi</span>
              </div>
              <div className="text-center md:text-left group cursor-default">
                <span className="block text-2xl font-black text-white group-hover:scale-110 transition-transform">482</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Takip</span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-bold text-lg flex items-center gap-2 justify-center md:justify-start text-white">
                {profile?.full_name || 'İsimsiz Gezgin'} 
                <Sparkles className="w-4 h-4 text-[#64ffda] animate-pulse" />
              </h2>
              <p className="text-slate-400 max-w-md mx-auto md:mx-0 leading-relaxed text-sm">
                {profile?.bio || 'Henüz bir biyografi eklenmemiş. Kendinden bahsetmeye ne dersin?'}
              </p>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex items-center justify-center gap-16 mb-12">
            <button className="flex items-center gap-3 text-[#64ffda] font-black text-[10px] uppercase tracking-[0.3em] relative py-3 group">
              <Grid className="w-4 h-4" /> Gönderiler
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#64ffda] rounded-full shadow-[0_0_15px_#64ffda]" />
            </button>
            <button className="flex items-center gap-3 text-slate-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.3em] py-3 group">
              <ImageIcon className="w-4 h-4 group-hover:scale-110 transition-transform" /> Kaydedilenler
            </button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-3 gap-1 md:gap-6">
            {/* New Post Button */}
            <button 
              onClick={() => router.push('/sosyal/yukle')}
              className="aspect-square bg-[#112240]/50 rounded-2xl md:rounded-[48px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-[#64ffda] hover:border-[#64ffda]/40 transition-all group relative overflow-hidden active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#64ffda]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-[24px] md:rounded-[32px] bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 transition-all duration-500">
                <Plus className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">Paylaşım Yap</span>
            </button>

            {posts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => router.push('/sosyal')}
                className="group relative aspect-square bg-[#112240] rounded-2xl md:rounded-[48px] overflow-hidden border border-white/5 cursor-pointer shadow-2xl active:scale-95 transition-transform"
              >
                <Image 
                  src={post.image_url} 
                  alt="Post" 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-8 backdrop-blur-[2px]">
                  <div className="flex flex-col items-center gap-1 text-white font-black scale-90 group-hover:scale-100 transition-transform">
                    <Heart className="w-7 h-7 fill-[#64ffda] text-[#64ffda]" />
                    <span className="text-xs uppercase tracking-tighter">{post.post_likes?.length || 0}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-white font-black scale-90 group-hover:scale-100 transition-transform">
                    <MessageSquare className="w-7 h-7 fill-white text-white" />
                    <span className="text-xs uppercase tracking-tighter">{post.post_comments?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-32 animate-in fade-in duration-1000">
              <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-white/5">
                <ImageIcon className="w-10 h-10 text-slate-700" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter">Henüz Bir Paylaşım Yok</h3>
              <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
                Fethiye'nin güzelliklerini ilk paylaşan sen olmaya ne dersin?
              </p>
            </div>
          )}
        </div>

        {/* Edit Profile Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="bg-[#112240] border-white/10 text-white rounded-[40px] max-w-md shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
                <div className="p-2 bg-[#64ffda]/10 rounded-xl">
                  <Edit3 className="w-5 h-5 text-[#64ffda]" />
                </div>
                Profili Düzenle
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ad Soyad</Label>
                <Input 
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                  className="bg-[#0a192f] border-white/5 rounded-2xl h-14 focus:ring-[#64ffda] text-white"
                  placeholder="Adınız Soyadınız"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Biyografi</Label>
                <Textarea 
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  className="bg-[#0a192f] border-white/5 rounded-2xl min-h-[120px] focus:ring-[#64ffda] text-white resize-none"
                  placeholder="Kendinizden bahsedin..."
                />
              </div>
            </div>

            <DialogFooter className="sm:justify-between gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 hover:bg-white/5"
              >
                İptal
              </Button>
              <Button 
                onClick={handleUpdateProfile}
                disabled={updating}
                className="bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 px-8 hover:bg-[#52e0c4] shadow-xl shadow-[#64ffda]/10 flex-1"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Güncelle'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  )
}
