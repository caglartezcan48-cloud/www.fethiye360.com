'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, X, MessageSquare, Star, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchReviews = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('business_reviews')
      .select(`
        *,
        businesses (name)
      `)
      .eq('is_approved', false)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Yorumlar yüklenirken hata oluştu')
    } else {
      setReviews(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleApprove = async (id: string, businessId: string) => {
    // 1. Yorumu onayla
    const { error: approveError } = await supabase
      .from('business_reviews')
      .update({ is_approved: true })
      .eq('id', id)

    if (approveError) {
      toast.error('Onaylama işlemi başarısız')
      return
    }

    // 2. İşletmenin yeni ortalama puanını hesapla
    const { data: allReviews, error: reviewsError } = await supabase
      .from('business_reviews')
      .select('rating')
      .eq('business_id', businessId)
      .eq('is_approved', true)

    if (!reviewsError && allReviews) {
      const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length
      const roundedRating = Math.round(avgRating * 10) / 10 // Örn: 4.7

      // 3. İşletme tablosunu güncelle
      await supabase
        .from('businesses')
        .update({ rating: roundedRating })
        .eq('id', businessId)
    }

    toast.success('Yorum onaylandı ve işletme puanı güncellendi')
    setReviews(reviews.filter(r => r.id !== id))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return

    const { error } = await supabase
      .from('business_reviews')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Silme işlemi başarısız')
    } else {
      toast.success('Yorum silindi')
      setReviews(reviews.filter(r => r.id !== id))
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Bekleyen Yorumlar</h1>
          <p className="text-slate-400">Onay bekleyen toplam {reviews.length} yorum var.</p>
        </div>
        <button 
          onClick={fetchReviews}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
        >
          <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-[#64ffda]" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {reviews.map((review) => (
            <div 
              key={review.id}
              className="bg-[#112240] p-8 rounded-[32px] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#64ffda]/30 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="px-3 py-1 rounded-full bg-[#64ffda]/10 text-[#64ffda] text-[10px] font-bold uppercase tracking-widest border border-[#64ffda]/20">
                    {review.businesses?.name}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    {review.rating}.0
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{review.user_name}</h3>
                <p className="text-slate-400 text-sm italic mb-2">"{review.comment}"</p>
                <div className="text-slate-600 text-[10px] uppercase font-medium">
                  {new Date(review.created_at).toLocaleString('tr-TR')}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleApprove(review.id, review.business_id)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#64ffda] text-[#0a192f] rounded-xl font-bold hover:bg-[#52e0c4] transition-all"
                >
                  <Check className="w-4 h-4" />
                  Onayla
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                >
                  <X className="w-4 h-4" />
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white/5 rounded-[40px] border border-dashed border-white/10">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-slate-700" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Tertemiz!</h2>
          <p className="text-slate-500">Şu an onay bekleyen herhangi bir yorum bulunmuyor.</p>
        </div>
      )}
    </div>
  )
}
