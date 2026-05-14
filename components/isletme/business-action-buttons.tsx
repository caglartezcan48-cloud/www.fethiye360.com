'use client'

import { Share2, Heart } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

export function BusinessActionButtons({ title }: { title: string }) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${title} | Fethiye 360`,
          text: `${title} Fethiye 360'ta! Hemen incele.`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Bağlantı kopyalandı!')
      }
    } catch (error) {
      console.error('Share failed', error)
    }
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    if (!isFavorite) {
      toast.success('Favorilere eklendi!')
    } else {
      toast.info('Favorilerden çıkarıldı.')
    }
  }

  return (
    <>
      <button 
        onClick={handleShare}
        className="p-4 bg-[#0a192f]/60 backdrop-blur-xl rounded-2xl text-white/70 hover:text-[#64ffda] border border-white/5 transition-all hover:scale-110"
      >
        <Share2 className="w-5 h-5" />
      </button>
      <button 
        onClick={handleFavorite}
        className={`p-4 bg-[#0a192f]/60 backdrop-blur-xl rounded-2xl border border-white/5 transition-all hover:scale-110 ${isFavorite ? 'text-red-500 hover:text-red-400' : 'text-white/70 hover:text-[#64ffda]'}`}
      >
        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
      </button>
    </>
  )
}
