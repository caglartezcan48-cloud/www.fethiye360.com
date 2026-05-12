'use client'

import { useState } from 'react'
import { X, Star, Send, Loader2, Sparkles, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  destinationId: string
  destinationTitle: string
  userId: string
  onSuccess?: (data: { rating: number, comment: string, visitNote: string }) => void
}

const supabase = createClient()

export function ReviewModal({ isOpen, onClose, destinationId, destinationTitle, userId, onSuccess }: ReviewModalProps) {
  const [comment, setComment] = useState('')
  const [visitNote, setVisitNote] = useState('')
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error('Lütfen bir puan verin (1-5 yıldız)')
      return
    }

    if (!comment.trim()) {
      toast.error('Lütfen deneyiminizi kısaca yazın.')
      return
    }

    try {
      setIsSubmitting(true)
      
      // 1. Genel Yorumlara Ekle (Onay Bekler)
      const { error: reviewError } = await supabase.from('destination_comments').insert([{
        destination_id: destinationId,
        user_id: userId,
        comment: comment,
        rating: rating,
        visit_note: visitNote, // Eger tabloda varsa
        is_approved: false
      }])

      if (reviewError) throw reviewError

      toast.success('Harika! Deneyiminiz kaydedildi. ✨')
      
      if (onSuccess) {
        onSuccess({ rating, comment, visitNote })
      }
      
      setComment('')
      setVisitNote('')
      setRating(0)
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Kayıt sırasında bir hata oluştu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0a192f]/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#112240] border border-white/10 rounded-[48px] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#64ffda]/5 blur-3xl -mr-24 -mt-24" />
        
        <div className="relative space-y-8">
          <header className="text-center space-y-2">
            <div className="w-20 h-20 bg-[#64ffda]/10 rounded-[32px] flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-[#64ffda]" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">ANINI ÖLÜMSÜZLEŞTİR</h3>
            <p className="text-[#64ffda] text-[10px] font-black uppercase tracking-[0.2em]">{destinationTitle}</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="space-y-3 text-center">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">BU YERİ NASIL BULDUN?</label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-all hover:scale-125 p-1"
                  >
                    <Star 
                      className={`w-8 h-8 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Public Review */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">DENEYİMİN (HERKESE AÇIK)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="Neler yaşadın? Tavsiyelerin neler?"
                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-sm min-h-[100px] focus:ring-2 focus:ring-[#64ffda] outline-none transition-all placeholder:text-slate-700 font-medium"
              />
            </div>

            {/* Personal Note */}
            <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ZAMANA NOT DÜŞ (KİŞİSEL)</label>
                <textarea
                    value={visitNote}
                    onChange={(e) => setVisitNote(e.target.value)}
                    placeholder="O an ne hissettin? Yanında kim vardı? (Sadece sen göreceksin)"
                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-sm min-h-[80px] focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700 font-medium italic border-dashed"
                />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-[#64ffda] text-[#0a192f] rounded-[32px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-[#64ffda]/10 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> KAYDET VE GEZDİM OLARAK İŞARETLE</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
