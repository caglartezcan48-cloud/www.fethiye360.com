'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Star, Send, Loader2, CheckCircle2 } from 'lucide-react'

export function ReviewForm({ businessId }: { businessId: string }) {
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('business_reviews')
      .insert([
        { 
          business_id: businessId, 
          user_name: name, 
          comment, 
          rating 
        }
      ])

    setLoading(false)
    if (!error) {
      setSuccess(true)
      setName('')
      setComment('')
      setTimeout(() => setSuccess(false), 5000)
    }
  }

  if (success) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-[32px] text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-white font-bold text-xl mb-2">Yorumunuz Alındı!</h3>
        <p className="text-slate-400">Deneyiminizi paylaştığınız için teşekkür ederiz.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#112240] p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <MessageSquare className="w-32 h-32 text-[#64ffda]" />
      </div>

      <h3 className="text-white font-bold text-xl mb-8 flex items-center gap-2">
        Deneyiminizi Paylaşın
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-1 transition-transform hover:scale-125"
            >
              <Star 
                className={`w-8 h-8 ${
                  (hover || rating) >= star ? 'text-yellow-500 fill-yellow-500' : 'text-slate-700'
                } transition-colors`} 
              />
            </button>
          ))}
          <span className="ml-4 text-slate-500 text-sm font-bold uppercase tracking-widest">
            {rating}.0 PUAN
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 tracking-widest">Adınız Soyadınız</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a192f] border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all"
              placeholder="Ahmet Yılmaz"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 tracking-widest">Yorumunuz</label>
            <textarea 
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-[#0a192f] border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all min-h-[120px]"
              placeholder="İşletme hakkındaki düşüncelerinizi yazın..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#64ffda] hover:bg-[#52e0c4] text-[#0a192f] py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] shadow-xl shadow-[#64ffda]/10"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
            <>
              Yorumu Yayınla
              <Send className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}

import { MessageSquare } from 'lucide-react'
