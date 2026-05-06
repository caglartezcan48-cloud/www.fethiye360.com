'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Loader2, 
  ArrowLeft,
  Clock,
  ChevronRight
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { BottomNav } from '@/components/sosyal/bottom-nav'
import { toast } from 'sonner'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/giris')
        return
      }

      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          actor:user_profiles!actor_id(username, avatar_url),
          post:user_posts(image_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotifications(data || [])

      // Okundu olarak isaretle
      if (data && data.length > 0) {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', user.id)
          .eq('is_read', false)
      }
    } catch (error) {
      console.error(error)
      toast.error('Bildirimler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const getNotificationText = (type: string) => {
    switch (type) {
      case 'like': return 'gönderini beğendi'
      case 'comment': return 'gönderine yorum yaptı'
      case 'follow': return 'seni takip etmeye başladı'
      default: return 'bir eylem gerçekleştirdi'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-red-500 fill-red-500" />
      case 'comment': return <MessageSquare className="w-4 h-4 text-blue-500 fill-blue-500" />
      case 'follow': return <UserPlus className="w-4 h-4 text-[#64ffda]" />
      default: return <Bell className="w-4 h-4 text-slate-400" />
    }
  }

  return (
    <div className="min-h-screen bg-[#0a192f] text-white selection:bg-[#64ffda]/30 pb-20">
      <main className="max-w-2xl mx-auto px-6 pt-12 md:pt-24">
        
        <button onClick={() => router.back()} className="mb-10 flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Geri Dön
        </button>

        <header className="mb-12">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic flex items-center gap-4">
            Bildirimler
            <div className="p-2 bg-[#64ffda]/10 rounded-xl">
              <Bell className="w-6 h-6 text-[#64ffda]" />
            </div>
          </h1>
          <p className="text-slate-400 font-medium tracking-wide">Sen yokken neler oldu?</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#64ffda] animate-spin" />
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Veriler Alınıyor</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[48px] border border-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-slate-700" />
            </div>
            <p className="text-slate-500 font-bold italic">Henüz bir bildirim yok.</p>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                className={`group flex items-center gap-4 p-5 rounded-[32px] border transition-all ${notif.is_read ? 'bg-white/5 border-white/5 opacity-80' : 'bg-[#64ffda]/5 border-[#64ffda]/20 ring-1 ring-[#64ffda]/10'}`}
              >
                {/* User Avatar */}
                <Link href={`/profil/${notif.actor?.username}`} className="relative shrink-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 p-0.5 bg-[#0a192f]">
                    <Image 
                      src={notif.actor?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notif.actor?.username}`} 
                      alt="Avatar" fill className="object-cover rounded-[14px]" 
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-1.5 bg-[#0a192f] rounded-lg border border-white/10">
                    {getNotificationIcon(notif.type)}
                  </div>
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">
                    <Link href={`/profil/${notif.actor?.username}`} className="font-black text-white hover:text-[#64ffda] transition-colors mr-1">
                      {notif.actor?.username}
                    </Link>
                    <span className="text-slate-400 font-medium">{getNotificationText(notif.type)}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                      {new Date(notif.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Post Preview (if applicable) */}
                {notif.post?.image_url && (
                  <Link href="/sosyal" className="shrink-0 w-14 h-14 rounded-2xl overflow-hidden border border-white/10 hover:scale-105 transition-transform active:scale-95">
                    <Image src={notif.post.image_url} alt="Post" fill className="object-cover" />
                  </Link>
                )}

                {!notif.is_read && (
                   <div className="w-2 h-2 bg-[#64ffda] rounded-full shadow-[0_0_10px_#64ffda] animate-pulse" />
                )}
                
                <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-[#64ffda] transition-colors" />
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
