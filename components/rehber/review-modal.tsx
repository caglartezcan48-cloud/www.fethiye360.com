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
      console.log('Kayit baslatiliyor...', { destinationId, userId, rating })
      
      const { error: reviewError } = await supabase.from('destination_comments').insert([{
        destination_id: destinationId,
        user_id: userId,
        comment: comment,
        rating: rating,
        visit_note: visitNote,
        is_approved: false
      }])

      if (reviewError) {
          console.error('Yorum kayit hatasi:', reviewError)
          throw reviewError
      }

      toast.success('Harika! Deneyiminiz kaydedildi. ✨')
      
      if (onSuccess) {
        onSuccess({ rating, comment, visitNote })
      }
      
      setComment('')
      setVisitNote('')
      setRating(0)
      onClose()
    } catch (error: any) {
      console.error('Yakalanamayan hata:', error)
      toast.error(`Hata: ${error.message || 'Kayıt sırasında bir sorun oluştu.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0a192f]/98 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#112240] border border-white/10 rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col h-auto max-h-[90vh]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#64ffda]/5 blur-3xl -mr-16 -mt-16" />
        
        {/* Header - Sabit */}
        <header className="p-5 border-b border-white/5 relative z-10 text-center shrink-0">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">ANINI ÖLÜMSÜZLEŞTİR</h3>
            <p className="text-[#64ffda] text-[9px] font-black uppercase tracking-[0.2em]">{destinationTitle}</p>
        </header>

        {/* Form - Kaydirilabilir Orta Alan */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-8 no-scrollbar">
          <form id="review-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Rating */}
            <div className="space-y-3 text-center">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">BU YERİ NASIL BULDUN?</label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-all hover:scale-125 p-1"
                  >
                    <Star 
                      className={`w-8 h-8 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-800'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Public Review */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">DENEYİMİN (HERKESE AÇIK)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="Neler yaşadın? Tavsiyelerin neler?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm min-h-[100px] focus:ring-2 focus:ring-[#64ffda] outline-none transition-all placeholder:text-slate-800 font-medium"
              />
            </div>

            {/* Personal Note */}
            <div className="space-y-2 pb-4">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">ZAMANA NOT DÜŞ (KİŞİSEL)</label>
                <textarea
                    value={visitNote}
                    onChange={(e) => setVisitNote(e.target.value)}
                    placeholder="O an ne hissettin? Yanında kim vardı?"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm min-h-[100px] focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-800 font-medium italic border-dashed"
                />
            </div>
          </form>
        </div>

        {/* Footer - HER ZAMAN GORUNUR SABIT BUTON */}
        <div className="p-6 bg-[#112240] border-t border-white/10 shrink-0 relative z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <button
              form="review-form"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-[#64ffda]/20 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> DENEYİMİ KAYDET</>}
            </button>
        </div>
      </div>
    </div>
  )
}
