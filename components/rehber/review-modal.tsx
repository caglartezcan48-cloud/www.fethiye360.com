'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Star, X, Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface ReviewModalProps {
  destinationId: string
  destinationTitle: string
  userId?: string
  onClose: () => void
  onSuccess?: (data: { rating: number, comment: string, visitNote: string }) => void
}

export const ReviewModal = ({ destinationId, destinationTitle, userId, onClose, onSuccess }: ReviewModalProps) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [visitNote, setVisitNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Lütfen bir puan verin.')
      return
    }

    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Lütfen giriş yapın.')
        return
      }

      // UUID ve Tablo Cozumleme
      let finalId = destinationId
      let tableType: 'business' | 'destination' = 'destination'

      // Eger bir UUID degilse, once isletmelerde sonra destinasyonlarda ara
      if (!destinationId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        const { data: busData } = await supabase
          .from('businesses')
          .select('id')
          .or(`slug.eq.${destinationId},title.ilike.${destinationId}`)
          .single()
        
        if (busData) {
          finalId = busData.id
          tableType = 'business'
        } else {
          const { data: destData } = await supabase
            .from('destinations')
            .select('id')
            .or(`slug.eq.${destinationId},title.ilike.${destinationId}`)
            .single()
          
          if (destData) {
            finalId = destData.id
            tableType = 'destination'
          }
        }
      } else {
        // Zaten UUID gelmisse, hangi tabloya ait oldugunu bul
        const { data: isBus } = await supabase.from('businesses').select('id').eq('id', destinationId).maybeSingle()
        if (isBus) {
          tableType = 'business'
        }
      }

      if (tableType === 'business') {
        const { error: reviewError } = await supabase.from('business_reviews').insert([{
          business_id: finalId,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0],
          comment: comment,
          rating: rating,
          visit_note: visitNote,
          is_approved: false
        }])
        if (reviewError) throw reviewError
      } else {
        const { error: reviewError } = await supabase.from('destination_comments').insert([{
          destination_id: finalId,
          user_id: user.id,
          comment: comment,
          rating: rating,
          visit_note: visitNote,
          is_approved: false
        }])
        if (reviewError) throw reviewError
      }

      if (onSuccess) {
        onSuccess({ rating, comment, visitNote })
      }

      toast.success('Deneyiminiz kaydedildi! ✨')
      setComment('')
      setVisitNote('')
      setRating(0)
      onClose()
    } catch (error: any) {
      console.error('Kayit hatasi:', error)
      toast.error(`Hata: ${error.message || 'Bir sorun oluştu.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center p-2 pt-2 md:pt-6">
      <div className="absolute inset-0 bg-[#0a192f]/98 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-sm:max-w-[320px] max-w-sm bg-[#112240] border border-white/10 rounded-[32px] shadow-2xl animate-in slide-in-from-top-10 duration-500 overflow-hidden flex flex-col h-[50vh] min-h-[380px]">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#64ffda]/5 blur-3xl -mr-12 -mt-12" />
        
        <header className="p-3 border-b border-white/5 relative z-10 text-center shrink-0">
            <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">ANINI ÖLÜMSÜZLEŞTİR</h3>
            <p className="text-[#64ffda] text-[7px] font-black uppercase tracking-[0.2em]">{destinationTitle}</p>
        </header>

        <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4 no-scrollbar">
          <form id="review-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-center">
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-all hover:scale-110 p-0.5 active:scale-90"
                  >
                    <Star className={`w-7 h-7 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/10'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">DENEYİMİN</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="Neler yaşadın?"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs min-h-[60px] focus:ring-2 focus:ring-[#64ffda] outline-none transition-all placeholder:text-slate-600 font-medium"
              />
            </div>

            <div className="space-y-1 pb-1">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">KİŞİSEL NOT</label>
                <textarea
                    value={visitNote}
                    onChange={(e) => setVisitNote(e.target.value)}
                    placeholder="O an ne hissettin?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs min-h-[60px] focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600 font-medium italic border-dashed"
                />
            </div>
          </form>
        </div>

        <div className="p-4 bg-[#1a2c4e] border-t border-[#64ffda]/20 shrink-0 relative z-10">
            <button
              form="review-form"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#64ffda] text-[#0a192f] rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:bg-white transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-3 h-3" /> KAYDET</>}
            </button>
        </div>
      </div>
    </div>
  )
}
