'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { 
  Camera, 
  Grid, 
  LogOut, 
  Plus, 
  Share2,
  Heart,
  MessageSquare,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Check,
  Calendar,
  Trash2,
  MapPin,
  ChevronRight
} from 'lucide-react'
import { PostGridSkeleton } from '@/components/sosyal/post-skeleton'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
// tensorflow ve nsfwjs lazy loaded - sadece ihtiyac duyuldugunda yuklenir
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BottomNav } from '@/components/sosyal/bottom-nav'
import { Header } from '@/components/fethiye/header'
import { PlanDetailModal } from '@/components/profil/plan-detail-modal'

const supabase = createClient()

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [counts, setCounts] = useState({ followers: 0, following: 0 })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState<'posts' | 'plans'>('posts')
  const [itineraries, setItineraries] = useState<any[]>([])
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  
  // Modal State'leri
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: ''
  })
  
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

      // 1. Profil ve Gizlilik Bilgisini Getir
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      
      if (!profileData && !profileError) {
        // Profil kaydı yok, otomatik oluştur
        const { data: newProfile } = await supabase
          .from('user_profiles')
          .insert([{
            id: user.id,
            username: user.email?.split('@')[0] || `user_${user.id.slice(0, 5)}`,
            full_name: user.user_metadata?.full_name || 'Yeni Kullanıcı',
            is_public: true
          }])
          .select()
          .single()
        
        setProfile(newProfile)
      } else {
        setProfile(profileData)
      }

      setEditForm({
        full_name: profileData?.full_name || profile?.full_name || 'Yeni Kullanıcı',
        bio: profileData?.bio || profile?.bio || ''
      })

      // 2. Gerçek Takipçi/Takip Sayılarını Getir
      const [followersCount, followingCount] = await Promise.all([
        supabase.from('user_follows').select('*', { count: 'exact', head: true }).eq('following_id', user.id),
        supabase.from('user_follows').select('*', { count: 'exact', head: true }).eq('follower_id', user.id)
      ])

      setCounts({
        followers: followersCount.count || 0,
        following: followingCount.count || 0
      })

      // 3. Paylasimlari Getir
      const { data: userPosts, error: postError } = await supabase
        .from('user_posts')
        .select('*')
        .eq('user_id', user.id)
        .eq('media_type', 'image')
        .order('created_at', { ascending: false })

      if (postError) throw postError

      if (userPosts && userPosts.length > 0) {
        // Her post için beğeni ve yorum sayılarını ayrı ayrı (veya toplu) alabiliriz
        // Performans için toplu alalım
        const postIds = userPosts.map(p => p.id)
        
        const [likesRes, commentsRes] = await Promise.all([
          supabase.from('post_likes').select('post_id').in('post_id', postIds),
          supabase.from('post_comments').select('post_id').in('post_id', postIds)
        ])

        const likesMap = (likesRes.data || []).reduce((acc: any, curr: any) => {
          if (!acc[curr.post_id]) acc[curr.post_id] = []
          acc[curr.post_id].push(curr)
          return acc
        }, {})

        const commentsMap = (commentsRes.data || []).reduce((acc: any, curr: any) => {
          acc[curr.post_id] = (acc[curr.post_id] || 0) + 1
          return acc
        }, {})

        const postsWithCounts = userPosts.map(post => ({
          ...post,
          post_likes: likesMap[post.id] || [],
          post_comments: { length: commentsMap[post.id] || 0 }
        }))

        setPosts(postsWithCounts)
      } else {
        setPosts([])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchItineraries = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_itineraries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setItineraries(data || [])
    } catch (error) {
      console.error('Planlar getirilemedi:', error)
    }
  }

  const deleteItinerary = async (id: string) => {
    if (!confirm('Bu planı silmek istediğine emin misin?')) return

    try {
      const { error } = await supabase
        .from('user_itineraries')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setItineraries(prev => prev.filter(item => item.id !== id))
      toast.success('Plan başarıyla silindi.')
    } catch (error) {
      toast.error('Plan silinemedi.')
    }
  }

  useEffect(() => {
    if (user) {
      fetchItineraries(user.id)
    }
  }, [user])

  const togglePrivacy = async () => {
    try {
      setUpdating(true)
      const newStatus = !profile.is_public
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_public: newStatus })
        .eq('id', user.id)

      if (error) throw error
      
      setProfile({ ...profile, is_public: newStatus })
      toast.success(newStatus ? 'Profiliniz artık herkese açık! ✨' : 'Profiliniz artık gizli. 🔒')
    } catch (error) {
      toast.error('Ayar değiştirilemedi')
    } finally {
      setUpdating(false)
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
      
      toast.success('Profil güncellendi')
      setIsEditModalOpen(false)
      fetchProfile()
    } catch (error) {
      toast.error('Hata oluştu')
    } finally {
      setUpdating(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUpdating(true)
      setIsAnalyzing(true)

      // AI Analizi - dynamic import (3MB+ tasarruf)
      const nsfwjs = await import('nsfwjs')
      const model = await nsfwjs.load()
      const img = new (window.Image as any)()
      img.src = URL.createObjectURL(file)
      await new Promise(r => img.onload = r)
      
      const predictions = await model.classify(img)
      const nsfwCategories = ['Porn', 'Hentai', 'Sexy']
      const highRisk = predictions.find(p => nsfwCategories.includes(p.className) && p.probability > 0.6)

      if (highRisk) {
        toast.error('Profil fotoğrafı güvenlik kontrolünden geçemedi. Uygunsuz içerik tespit edildi.')
        setUpdating(false)
        setIsAnalyzing(false)
        return
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      await supabase.storage.from('tour-images').upload(filePath, file)
      const { data: { publicUrl } } = supabase.storage.from('tour-images').getPublicUrl(filePath)

      await supabase.from('user_profiles').update({ avatar_url: publicUrl }).eq('id', user.id)

      toast.success('Profil fotoğrafı güncellendi! ✅')
      fetchProfile()
    } catch (error) {
      toast.error('İşlem sırasında bir hata oluştu.')
    } finally {
      setUpdating(false)
      setIsAnalyzing(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a192f] p-8 md:p-12 lg:p-24">
      <div className="max-w-6xl mx-auto space-y-12 animate-pulse">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-48 h-48 rounded-[64px] bg-white/5" />
          <div className="space-y-4 flex-1">
            <div className="w-64 h-8 bg-white/10 rounded-full" />
            <div className="w-32 h-4 bg-white/5 rounded-full" />
            <div className="flex gap-4"><div className="w-24 h-10 bg-white/5 rounded-xl" /><div className="w-24 h-10 bg-white/5 rounded-xl" /></div>
          </div>
        </div>
        <PostGridSkeleton />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a192f] text-white pb-20">
      <Header />
      <main className="max-w-4xl mx-auto px-6 pt-32 md:pt-40">
        
        {/* Profile Info Section */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16 mb-16 animate-in fade-in duration-700">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#64ffda] to-blue-500 rounded-[60px] blur-2xl opacity-10 group-hover:opacity-30 transition-all duration-500" />
            <div className="relative w-40 h-40 md:w-44 md:h-44 rounded-[56px] overflow-hidden border-4 border-white/5 p-1.5 bg-[#112240]">
              <div className="relative w-full h-full rounded-[44px] overflow-hidden">
                <Image 
                  src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || user?.id}`} 
                  alt="Avatar" fill className="object-cover"
                  unoptimized={true}
                />
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
                {profile?.is_public ? (
                  <div className="w-5 h-5 bg-[#64ffda] rounded-full flex items-center justify-center" title="Halka Açık Profil">
                    <Check className="w-3 h-3 text-[#0a192f] stroke-[4]" />
                  </div>
                ) : (
                  <Lock className="w-4 h-4 text-slate-500" title="Gizli Profil" />
                )}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button 
                  onClick={() => router.push('/sosyal/yukle')}
                  className="px-6 py-2.5 bg-[#64ffda] text-[#0a192f] hover:bg-[#52e0c4] rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-[#64ffda]/20"
                >
                  <Plus className="w-4 h-4" /> Paylaşım Yap
                </button>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-6 py-2.5 bg-white/5 text-white border border-white/10 hover:bg-white/10 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  Düzenle
                </button>
                <button 
                  onClick={togglePrivacy}
                  disabled={updating}
                  className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${profile?.is_public ? 'border-white/10 text-white hover:bg-white/5' : 'border-[#64ffda]/30 text-[#64ffda] bg-[#64ffda]/5'}`}
                >
                  {profile?.is_public ? <><Eye className="w-4 h-4" /> Herkese Açık</> : <><EyeOff className="w-4 h-4" /> Gizli Profil</>}
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/profil/${profile?.username}`)
                    toast.success('Profil bağlantısı kopyalandı! 🔗')
                  }}
                  className="px-4 py-2.5 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-[#64ffda]/10 hover:text-[#64ffda] transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                >
                  <Share2 className="w-4 h-4" /> Paylaş
                </button>
                <button onClick={handleLogout} className="px-4 py-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                  <LogOut className="w-4 h-4" /> Çıkış
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-12">
              <div className="text-center md:text-left">
                <span className="block text-2xl font-black text-[#64ffda]">{posts.length}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Gönderi</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-2xl font-black text-white">{counts.followers}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Takipçi</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-2xl font-black text-white">{counts.following}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Takip</span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-bold text-lg flex items-center gap-2 justify-center md:justify-start">
                {profile?.full_name} <Sparkles className="w-4 h-4 text-[#64ffda]" />
              </h2>
              <p className="text-slate-400 max-w-md mx-auto md:mx-0 leading-relaxed text-sm italic">
                {profile?.bio || 'Henüz bir biyografi eklenmemiş.'}
              </p>
            </div>
          </div>
        </section>

        {/* Tabs Grid */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex items-center justify-center gap-16 mb-12 font-black text-[10px] uppercase tracking-[0.3em]">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-3 relative py-3 transition-all ${activeTab === 'posts' ? 'text-[#64ffda]' : 'text-slate-500 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" /> Gönderiler
              {activeTab === 'posts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#64ffda] rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('plans')}
              className={`flex items-center gap-3 relative py-3 transition-all ${activeTab === 'plans' ? 'text-[#64ffda]' : 'text-slate-500 hover:text-white'}`}
            >
              <Calendar className="w-4 h-4" /> Planlarım
              {activeTab === 'plans' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#64ffda] rounded-full" />}
            </button>
          </div>

          {activeTab === 'posts' ? (
            <div className="grid grid-cols-3 gap-1 md:gap-6">
              <button onClick={() => router.push('/sosyal/yukle')} className="aspect-square bg-[#112240]/50 rounded-2xl md:rounded-[48px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-[#64ffda] transition-all group">
                <div className="w-14 h-14 rounded-[24px] bg-white/5 flex items-center justify-center group-hover:scale-110 transition-all">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">Yeni Paylaşım</span>
              </button>

              {posts.map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => router.push(`/sosyal/post/${post.id}`)}
                  className="group relative aspect-square bg-[#112240] rounded-2xl md:rounded-[48px] overflow-hidden cursor-pointer active:scale-95 transition-transform"
                >
                  <Image src={post.image_url} alt="Post" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-8">
                    <div className="flex flex-col items-center gap-1 text-white font-black"><Heart className="w-7 h-7 fill-[#64ffda] text-[#64ffda]" /> {post.post_likes?.length || 0}</div>
                    <div className="flex flex-col items-center gap-1 text-white font-black"><MessageSquare className="w-7 h-7 fill-white" /> {post.post_comments?.length || 0}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Yeni Plan Ekle Butonu */}
              <button 
                onClick={() => router.push('/aktivite-planla')}
                className="group h-full min-h-[250px] bg-[#112240]/50 rounded-[40px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-6 text-slate-500 hover:text-[#64ffda] hover:border-[#64ffda]/30 transition-all relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#64ffda]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all" />
                <div className="w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center group-hover:scale-110 transition-all group-hover:bg-[#64ffda]/10">
                  <Plus className="w-10 h-10" />
                </div>
                <div className="text-center space-y-1 relative z-10">
                  <span className="text-sm font-black uppercase tracking-[0.2em]">Yeni Plan Oluştur</span>
                  <p className="text-[10px] font-medium italic text-slate-600 group-hover:text-slate-400 transition-all">Fethiye'de gezeceğin yerleri seç</p>
                </div>
              </button>

              {itineraries.length === 0 ? (
                // Eger baska plan yoksa sadece "Henüz bir tatil planı..." mesajını göstermek yerine sadece butonu bıraktık
                null
              ) : (
                itineraries.map((plan) => (
                  <div key={plan.id} className={`group bg-white/5 border rounded-[40px] p-8 hover:bg-white/10 transition-all relative overflow-hidden ${plan.completed_activities?.length === plan.activities?.length ? 'ring-2 ring-[#64ffda]/30' : 'border-white/10'}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#64ffda]/5 blur-3xl -mr-16 -mt-16 group-hover:bg-[#64ffda]/10 transition-all" />
                    
                    {plan.completed_activities?.length === plan.activities?.length && (
                      <div className="absolute top-6 left-6 z-10">
                        <div className="bg-[#64ffda] text-[#0a192f] px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg shadow-[#64ffda]/20 animate-bounce">
                          Rota Tamamlandı ✨
                        </div>
                      </div>
                    )}
                    
                    <div className="relative space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight">{plan.title}</h3>
                          <div className="flex items-center gap-2 text-[#64ffda] text-[10px] font-black uppercase tracking-widest">
                            <MapPin className="w-3 h-3" /> {plan.region} • {plan.group_type === 'couple' ? 'Çift' : plan.group_type === 'single' ? 'Yalnız' : 'Grup'}
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteItinerary(plan.id)
                          }}
                          className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Progress Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {(() => {
                              const total = plan.activities?.length || 0
                              const completed = plan.completed_activities?.length || 0
                              const pct = total > 0 ? (completed / total) * 100 : 0
                              if (pct === 0) return 'Yolculuk Başladı! 🧭'
                              if (pct === 100) return 'Liste Tamamlandı! ✨'
                              if (pct >= 50) return 'Hedefe Az Kaldı! 🔥'
                              return 'Keşif Devam Ediyor... 🏃‍♂️'
                            })()}
                          </span>
                          <span className="text-[10px] font-bold text-[#64ffda]">
                            %{Math.round(((plan.completed_activities?.length || 0) / (plan.activities?.length || 1)) * 100)}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="h-full bg-gradient-to-r from-[#64ffda] to-blue-500 transition-all duration-1000"
                            style={{ width: `${((plan.completed_activities?.length || 0) / (plan.activities?.length || 1)) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 overflow-hidden">
                        {/* Bucket List Previews */}
                        {plan.activities && Array.isArray(plan.activities) && plan.activities.slice(0, 4).map((act: any, idx: number) => (
                          <div key={idx} className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                            <Image src={act.image} alt={act.title} fill className="object-cover" />
                            {plan.completed_activities?.some((ca: any) => (typeof ca === 'string' ? ca : ca.id) === act.id) && (
                              <div className="absolute inset-0 bg-[#64ffda]/40 flex items-center justify-center">
                                <Check className="w-6 h-6 text-[#0a192f] stroke-[4]" />
                              </div>
                            )}
                          </div>
                        ))}
                          {plan.activities?.length > 4 && (
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0">
                              +{plan.activities.length - 4}
                            </div>
                          )}
                        </div>

                        <div className="pt-4 flex items-center justify-between">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            {plan.completed_activities?.length || 0} / {plan.activities?.length || 0} TAMAMLANDI
                          </div>
                          <button 
                            onClick={() => setSelectedPlan(plan)} 
                            className="px-6 py-2 bg-[#64ffda] text-[#0a192f] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#64ffda]/10"
                          >
                            Görüntüle
                          </button>
                        </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-[10px] text-slate-500 font-medium italic">{new Date(plan.created_at).toLocaleDateString('tr-TR')}</span>
                        <button 
                          onClick={() => router.push(`/plan/${plan.id}`)}
                          className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest hover:text-[#64ffda] transition-all"
                        >
                          Detaylar <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="bg-[#112240] border-white/10 text-white rounded-[40px] max-w-md shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase flex items-center gap-3">Profili Düzenle</DialogTitle>
              <DialogDescription className="text-slate-400 text-xs font-medium">Profil bilgilerinizi buradan güncelleyebilirsiniz.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ad Soyad</Label>
                <Input value={editForm.full_name} onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} className="bg-[#0a192f] border-white/5 rounded-2xl h-14" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Biyografi</Label>
                <Textarea value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} className="bg-[#0a192f] border-white/5 rounded-2xl min-h-[120px]" />
              </div>
            </div>
            <DialogFooter className="gap-4">
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-14">İptal</Button>
              <Button onClick={handleUpdateProfile} disabled={updating} className="bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 flex-1">Güncelle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {selectedPlan && (
          <PlanDetailModal 
            isOpen={!!selectedPlan}
            onClose={() => setSelectedPlan(null)}
            plan={selectedPlan}
            onUpdate={() => user && fetchItineraries(user.id)}
          />
        )}
      </main>

      {/* Global Navigation */}
      <BottomNav />
    </div>
  )
}
