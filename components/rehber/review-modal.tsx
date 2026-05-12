'use client'

import { useState } from 'react'
import { X, Star, Send, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  destinationId: string
  destinationTitle: string
  userId: string
}

const supabase = createClient()

export function ReviewModal({ isOpen, onClose, destinationId, destinationTitle, userId }: ReviewModalProps) {
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) {
      toast.error('Lütfen bir yorum yazın.')
      return
    }

    try {
      setIsSubmitting(true)
      const { error } = await supabase.from('destination_comments').insert([{
        destination_id: destinationId,
        user_id: userId,
        comment: comment,
        rating: rating,
        is_approved: false // Admin onayı beklesin
      }])

      if (error) throw error

      toast.success('Deneyiminiz paylaşıldı! Onaylandıktan sonra rehberde görünecek. ✨')
      setComment('')
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Yorum gönderilirken bir hata oluştu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0a192f]/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#112240] border border-white/10 rounded-[48px] p-10 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#64ffda]/5 blur-3xl -mr-24 -mt-24" />
        
        <div className="relative space-y-8">
          <header className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">DENEYİMİNİ PAYLAŞ</h3>
              <p className="text-[#64ffda] text-[10px] font-black uppercase tracking-[0.2em]">{destinationTitle}</p>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Puanın</label>
              <div className="flex items-center gap-3 bg-white/5 w-fit p-4 rounded-3xl border border-white/5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-all hover:scale-125"
                  >
                    <Star 
                      className={`w-6 h-6 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Yorumun</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Bu yer hakkında ne düşünüyorsun? Neler yaşadın?"
                className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 text-white min-h-[150px] focus:ring-2 focus:ring-[#64ffda] outline-none transition-all placeholder:text-slate-700 font-medium italic"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-[#64ffda] text-[#0a192f] rounded-[32px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#52e0c4] transition-all shadow-xl shadow-[#64ffda]/10 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> DENEYİMİ GÖNDER</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
