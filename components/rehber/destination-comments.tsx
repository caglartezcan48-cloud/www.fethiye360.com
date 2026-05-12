'use client'

import { useState } from 'react'
import { Send, Star } from "lucide-react"
import { createClient } from '@/lib/supabase/client'
import Image from "next/image"
import Link from 'next/link'
import { toast } from 'sonner'

interface CommentsProps {
  destinationId: string
  title: string
  initialComments: any[]
  user: any
}

export function DestinationComments({ destinationId, title, initialComments, user }: CommentsProps) {
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setIsSubmitting(true)
    const { error } = await supabase.from('destination_comments').insert([{
      destination_id: destinationId,
      user_id: user.id,
      comment: comment,
      is_approved: false
    }])

    if (error) {
      toast.error('Yorum gönderilemedi')
    } else {
      toast.success('Yorumunuz onay için gönderildi!')
      setComment('')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16 pt-20 border-t border-white/5">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Deneyimler</h2>
        <p className="text-slate-500 font-medium italic">Sizin gözünüzden {title}</p>
      </div>

      {user ? (
        <div className="bg-white/5 p-10 rounded-[50px] border border-white/10 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              placeholder="Deneyimlerinizi paylaşın..."
              className="w-full bg-transparent border-b border-white/10 py-4 text-xl text-white placeholder:text-slate-700 outline-none focus:border-[#64ffda] transition-all min-h-[100px] resize-none"
            />
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-600 italic uppercase font-bold tracking-widest">Yorumunuz onay sonrası yayınlanır</p>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-12 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center gap-2"
              >
                {isSubmitting ? 'GÖNDERİLİYOR...' : <><Send className="w-4 h-4" /> GÖNDER</>}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center py-10">
          <Link href="/giris" className="text-[#64ffda] font-black uppercase tracking-widest text-xs hover:underline underline-offset-8 transition-all">Yorum yapmak için giriş yapın</Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {initialComments.map((c) => (
          <div key={c.id} className="bg-white/5 p-10 rounded-[40px] border border-white/5 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 rounded-2xl overflow-hidden relative shrink-0 border-2 border-[#64ffda]/20">
              <Image src={c.user_profiles?.avatar_url || "/default-avatar.png"} alt="Avatar" fill className="object-cover" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <span className="text-white font-black uppercase tracking-widest text-xs">{c.user_profiles?.username}</span>
                  <div className="h-1 w-1 bg-slate-700 rounded-full" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{new Date(c.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
                {c.rating && (
                  <div className="flex items-center gap-1.5 bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20 text-yellow-500 font-black text-xs">
                    <Star className="w-3.5 h-3.5 fill-yellow-500" /> {c.rating}.0
                  </div>
                )}
              </div>
              <p className="text-slate-300 text-lg leading-relaxed italic">"{c.comment}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
