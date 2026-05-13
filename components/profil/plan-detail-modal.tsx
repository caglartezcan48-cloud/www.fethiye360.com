'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, CheckCircle, Sparkles, Share2, Trash2, Loader2, Navigation } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ReviewModal } from '@/components/rehber/review-modal'

interface PlanDetailModalProps {
  isOpen: boolean
  onClose: () => void
  plan: any
  onUpdate: () => void
}

const supabase = createClient()

export function PlanDetailModal({ isOpen, onClose, plan, onUpdate }: PlanDetailModalProps) {
  const [completedActivities, setCompletedActivities] = useState<any[]>(plan?.completed_activities || [])
  const [reviewTarget, setReviewTarget] = useState<{ id: string, title: string } | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (plan?.completed_activities) {
      setCompletedActivities(plan.completed_activities)
    }
  }, [plan])

  const completedIds = Array.isArray(completedActivities) 
    ? completedActivities.map(a => typeof a === 'string' ? a : a.id)
    : []

  if (!isOpen || !plan) return null

  const handleCheckInSuccess = async (data: { rating: number, comment: string, visitNote: string }) => {
    if (!reviewTarget) return

    const newActivity = {
      id: reviewTarget.id,
      note: data.visitNote,
      rating: data.rating,
      visited_at: new Date().toISOString()
    }

    const newCompletedActivities = [...completedActivities.filter(a => (typeof a === 'string' ? a : a.id) !== reviewTarget.id), newActivity]
    
    setCompletedActivities(newCompletedActivities)
    
    try {
      setIsUpdating(true)
      const { error } = await supabase
        .from('user_itineraries')
        .update({ completed_activities: newCompletedActivities })
        .eq('id', plan.id)

      if (error) throw error
      onUpdate()
      setReviewTarget(null)
      // Kullanici istegi: Gezi kaydedildikten sonra modal kapansin
      setTimeout(() => {
        onClose()
      }, 500)
    } catch (error) {
      toast.error('İlerleme kaydedilemedi')
    } finally {
      setIsUpdating(false)
    }
  }

  const toggleComplete = async (activityId: string, activityTitle: string, dbId?: string) => {
    let targetDbId = dbId

    // Eger dbId eksikse (eski planlar), veritabanindan bulalim
    if (!targetDbId) {
      const { data: destData } = await supabase
        .from('destinations')
        .select('id')
        .or(`slug.eq.${activityId},title.ilike.${activityTitle}`)
        .single()
      
      targetDbId = destData?.id
    }

    if (completedIds.includes(activityId)) {
      // Zaten gezilmisse, listeden cikar (Notu siler)
      if (!confirm('Bu yerin gezi notlarını ve işaretini kaldırmak istediğine emin misin?')) return
      
      const newCompletedActivities = completedActivities.filter(a => (typeof a === 'string' ? a : a.id) !== activityId)
      setCompletedActivities(newCompletedActivities)
      
      try {
        setIsUpdating(true)
        await supabase.from('user_itineraries').update({ completed_activities: newCompletedActivities }).eq('id', plan.id)
        onUpdate()
      } catch (error) {
        toast.error('Guncellenemedi')
      } finally {
        setIsUpdating(false)
      }
    } else {
      // Gezilmemisse, yorum modalini ac (Zorunlu)
      if (!targetDbId) {
        toast.error('Bu yer veritabanında bulunamadı, yorum yapılamaz.')
        return
      }
      setReviewTarget({ id: targetDbId, title: activityTitle })
    }
  }

  const shareWhatsApp = () => {
    const listText = plan.activities.map((act: any, i: number) => `${i+1}. ${act.title}`).join('\n')
    const text = `Fethiye Gezi Listem! 🌴\n\n${listText}\n\nSen de kendi listeni oluştur: ${window.location.origin}/aktivite-planla`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0a192f]/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-[#112240] border border-white/10 rounded-[48px] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <header className="p-8 md:p-12 border-b border-white/5 flex items-start justify-between bg-white/5 relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#64ffda]/5 blur-3xl -mr-32 -mt-32" />
            <div className="relative space-y-2">
                <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">{plan.title}</h3>
                <div className="flex items-center gap-4 text-slate-400 text-xs font-black uppercase tracking-widest">
                    <span className="flex items-center gap-2 text-[#64ffda]"><Navigation className="w-3 h-3" /> FETHİYE</span>
                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                    <span>{plan.activities?.length || 0} YER SEÇİLDİ</span>
                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                    <span className="text-emerald-500">{completedIds.length} TAMAMLANDI</span>
                </div>
            </div>
            <div className="flex items-center gap-3 relative z-10">
                <button onClick={shareWhatsApp} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white border border-white/5">
                    <Share2 className="w-5 h-5" />
                </button>
                <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-slate-400">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 no-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plan.activities?.map((act: any) => (
                    <div 
                        key={act.id} 
                        className={`group bg-white/5 border rounded-[32px] overflow-hidden transition-all duration-500 ${
                            completedIds.includes(act.id) 
                            ? 'border-emerald-500/50 opacity-60 grayscale' 
                            : 'border-white/5 hover:border-[#64ffda]/30'
                        }`}
                    >
                        <div className="relative aspect-video overflow-hidden">
                            <Image src={act.image} alt={act.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-60" />
                            
                            {completedIds.includes(act.id) && (
                                <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] flex items-center justify-center">
                                    <CheckCircle className="w-12 h-12 text-white drop-shadow-2xl animate-in zoom-in duration-300" />
                                </div>
                            )}
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[#64ffda] text-[10px] font-black uppercase tracking-widest">
                                    <MapPin className="w-3 h-3" /> {act.location}
                                </div>
                                <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">{act.title}</h4>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <button 
                                    onClick={() => toggleComplete(act.id, act.title, act.dbId)}
                                    disabled={isUpdating}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        completedIds.includes(act.id)
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-white/5 text-slate-400 hover:bg-[#64ffda] hover:text-[#0a192f] border border-white/10'
                                    }`}
                                >
                                    {completedIds.includes(act.id) ? 'GEZDİM!' : 'GEZDİM Mİ?'}
                                </button>

                                {completedIds.includes(act.id) && (
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[8px] text-slate-500 font-bold uppercase">ZİYARET NOTU VAR ✅</span>
                                        <button 
                                            onClick={() => setReviewTarget({ id: act.dbId || act.id, title: act.title })}
                                            className="text-[#64ffda] hover:scale-105 transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-1"
                                        >
                                            <Sparkles className="w-3 h-3" /> Notu Düzenle
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {reviewTarget && (
            <ReviewModal 
                isOpen={!!reviewTarget}
                onClose={() => setReviewTarget(null)}
                destinationId={reviewTarget.id}
                destinationTitle={reviewTarget.title}
                userId={plan.user_id}
                onSuccess={handleCheckInSuccess}
            />
        )}
      </div>
    </div>
  )
}
