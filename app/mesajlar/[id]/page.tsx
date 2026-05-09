'use client'

import { useEffect, useState, useRef, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { 
  Send, 
  Loader2, 
  ArrowLeft,
  MoreVertical,
  Image as ImageIcon,
  Smile,
  Phone
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: conversationId } = use(params)
  const [messages, setMessages] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [otherUser, setOtherUser] = useState<any>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    initChat()
    
    // Gercek zamanli dinleyici (Realtime)
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/giris')
      setCurrentUser(user)

      // 1. Diger kullaniciyi bul
      const { data: otherMember } = await supabase
        .from('conversation_members')
        .select('user_profiles(*)')
        .eq('conversation_id', conversationId)
        .neq('user_id', user.id)
        .single()
      
      setOtherUser(otherMember?.user_profiles)

      // 2. Mesajlari cek
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      
      setMessages(msgs || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUser.id,
          content: newMessage
        })

      if (error) throw error
      
      // Sohbetin son mesaj saatini guncelle
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId)

      setNewMessage('')
    } catch (error) {
      toast.error('Mesaj gönderilemedi')
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a192f] flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-[#64ffda] animate-spin" />
    </div>
  )

  return (
    <div className="h-screen bg-[#0a192f] flex flex-col text-white selection:bg-[#64ffda]/30 overflow-hidden">
      
      {/* Chat Header */}
      <header className="shrink-0 bg-[#0a192f]/80 backdrop-blur-3xl border-b border-white/5 px-6 py-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/mesajlar')} className="p-2 -ml-2 text-slate-500 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 relative">
              <Image 
                src={otherUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.username}`} 
                alt="Avatar" fill className="object-cover" 
              />
            </div>
            <div>
              <h2 className="font-black text-sm uppercase tracking-widest leading-none mb-1">{otherUser?.username}</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#64ffda] rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-[#64ffda] uppercase tracking-[0.2em]">Çevrimiçi</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:text-[#64ffda] transition-all hidden md:block"><Phone className="w-5 h-5" /></button>

          <button className="p-2 text-slate-500 hover:text-white transition-all"><MoreVertical className="w-6 h-6" /></button>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed"
      >
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-24 h-24 rounded-[40px] overflow-hidden border-2 border-[#64ffda]/20 p-1 mb-4 shadow-2xl">
             <Image src={otherUser?.avatar_url || ''} alt="User" width={100} height={100} className="rounded-[32px] object-cover" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tighter mb-1">{otherUser?.full_name}</h3>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Sohbet Başlatıldı</p>
          <div className="mt-8 px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest border border-white/5">Bugün</div>
        </div>

        {messages.map((msg, idx) => {
          const isMe = msg.sender_id === currentUser.id
          return (
            <div 
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-${isMe ? 'right' : 'left'}-5 duration-500`}
            >
              <div className={`max-w-[80%] px-5 py-4 rounded-[24px] shadow-2xl relative ${isMe ? 'bg-[#64ffda] text-[#0a192f] rounded-tr-none' : 'bg-[#112240] text-white border border-white/5 rounded-tl-none'}`}>
                <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                <div className={`absolute top-0 w-4 h-4 ${isMe ? 'right-[-8px] bg-[#64ffda]' : 'left-[-8px] bg-[#112240]'}`} style={{ clipPath: isMe ? 'polygon(0 0, 0 100%, 100% 0)' : 'polygon(0 0, 100% 100%, 100% 0)' }} />
              </div>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2 px-1">
                {new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )
        })}
      </div>

      {/* Input Area */}
      <footer className="shrink-0 bg-[#0a192f] border-t border-white/5 p-6 md:p-8">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex-1 relative group">
            <button type="button" className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-[#64ffda] transition-colors"><Smile className="w-5 h-5" /></button>
            <input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mesajınızı buraya yazın..."
              className="w-full bg-white/5 border border-white/5 focus:border-[#64ffda]/30 rounded-2xl py-4 pl-14 pr-14 text-sm outline-none transition-all placeholder:text-slate-600"
            />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-[#64ffda] transition-colors"><ImageIcon className="w-5 h-5" /></button>
          </div>
          <button 
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="w-14 h-14 bg-[#64ffda] text-[#0a192f] rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-xl shadow-[#64ffda]/20 active:scale-90 disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </form>
      </footer>
    </div>
  )
}
