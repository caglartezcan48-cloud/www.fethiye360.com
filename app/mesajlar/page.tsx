'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { 
  MessageSquare, 
  Search, 
  Loader2, 
  ArrowLeft,
  ChevronRight,
  Clock,
  User
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { BottomNav } from '@/components/sosyal/bottom-nav'
import { toast } from 'sonner'

export default function MessagesListPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/giris')
        return
      }

      // 1. Dahil oldugum sohbetleri ve diger uyeyi getir
      const { data, error } = await supabase
        .from('conversation_members')
        .select(`
          conversation_id,
          conversations (
            id,
            last_message_at,
            messages (
              content,
              created_at,
              sender_id
            )
          )
        `)
        .eq('user_id', user.id)
        .order('conversations(last_message_at)', { ascending: false })

      if (error) throw error

      // 2. Her sohbet icin diger kullanici bilgisini cek
      const conversationsWithOthers = await Promise.all(
        data.map(async (item: any) => {
          const { data: otherMember } = await supabase
            .from('conversation_members')
            .select('user_profiles(*)')
            .eq('conversation_id', item.conversation_id)
            .neq('user_id', user.id)
            .single()
          
          // En son mesajı bul
          const lastMsg = item.conversations.messages?.sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0]

          return {
            id: item.conversation_id,
            otherUser: otherMember?.user_profiles,
            lastMessage: lastMsg
          }
        })
      )

      setConversations(conversationsWithOthers)
    } catch (error) {
      console.error(error)
      toast.error('Sohbetler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const filteredConversations = conversations.filter(conv => 
    conv.otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0a192f] text-white selection:bg-[#64ffda]/30">
      <main className="max-w-2xl mx-auto px-6 pt-12 md:pt-24 pb-20">
        
        <button onClick={() => router.push('/sosyal')} className="mb-10 flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sosyal Dünyaya Dön
        </button>

        <header className="mb-12">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic flex items-center gap-4">
            Mesajlar
            <div className="p-3 bg-[#64ffda]/10 rounded-2xl border border-[#64ffda]/20">
              <MessageSquare className="w-6 h-6 text-[#64ffda]" />
            </div>
          </h1>
          <p className="text-slate-400 font-medium tracking-wide">Özel görüşmelerin ve planların burada.</p>
        </header>

        {/* Search Bar */}
        <div className="relative mb-8 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#64ffda] transition-colors" />
          <input 
            type="text" 
            placeholder="Sohbetlerde ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 focus:border-[#64ffda]/30 rounded-[24px] py-5 pl-14 pr-6 text-sm outline-none transition-all placeholder:text-slate-600 font-medium"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#64ffda] animate-spin" />
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Sohbetler Getiriliyor</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[48px] border border-white/5 border-dashed">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-slate-700" />
            </div>
            <p className="text-slate-500 font-bold italic">Henüz bir mesajlaşma başlatılmamış.</p>
            <p className="text-slate-600 text-xs mt-2 uppercase tracking-widest font-black">Arkadaşlarının profilinden mesaj gönder!</p>
          </div>
        ) : (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {filteredConversations.map((conv) => (
              <Link 
                key={conv.id}
                href={`/mesajlar/${conv.id}`}
                className="group flex items-center gap-5 p-5 bg-white/5 border border-white/5 rounded-[32px] hover:bg-[#64ffda]/5 hover:border-[#64ffda]/20 transition-all active:scale-[0.98]"
              >
                {/* User Avatar */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 p-0.5 bg-[#0a192f] group-hover:border-[#64ffda]/30 transition-colors">
                    <Image 
                      src={conv.otherUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.otherUser?.username}`} 
                      alt="Avatar" fill className="object-cover rounded-[14px]" 
                    />
                  </div>
                  {/* Status Indicator */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0a192f] rounded-full flex items-center justify-center border border-white/5">
                    <div className="w-2.5 h-2.5 bg-[#64ffda] rounded-full shadow-[0_0_8px_#64ffda]" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-black text-white group-hover:text-[#64ffda] transition-colors truncate">
                      {conv.otherUser?.full_name || conv.otherUser?.username}
                    </h3>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                      {conv.lastMessage ? new Date(conv.lastMessage.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium truncate italic pr-4">
                    {conv.lastMessage?.content || 'Sohbet başladı...'}
                  </p>
                </div>

                <div className="shrink-0">
                  <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-[#64ffda] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
