'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Heart, 
  MessageSquare, 
  MapPin, 
  Loader2, 
  ThumbsDown, 
  Bookmark, 
  AlertTriangle, 
  Share2,
  Building2
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

interface PostCardProps {
  post: any
  currentUserId?: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [likesCount, setLikesCount] = useState(post.post_likes?.length || 0)
  const [isLiked, setIsLiked] = useState(post.post_likes?.some((l: any) => l.user_id === currentUserId) || false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [comments, setComments] = useState(post.post_comments || [])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const router = useRouter()
  
  const supabase = createClient()
  const handleLike = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!currentUserId) {
      toast.error('Beğenmek için giriş yapmalısınız')
      return
    }

    // Optimistic Update: Hemen arayüzü güncelle
    const wasLiked = isLiked
    const prevLikes = likes
    
    setIsLiked(!wasLiked)
    setLikesCount(prev => wasLiked ? Math.max(0, prev - 1) : prev + 1)

    try {
      if (wasLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', currentUserId)
      } else {
        await supabase
          .from('post_likes')
          .insert([{ post_id: post.id, user_id: currentUserId }])

        if (post.user_id !== currentUserId) {
          try {
            await supabase.from('notifications').insert({
              user_id: post.user_id,
              actor_id: currentUserId,
              type: 'like',
              post_id: post.id
            })
          } catch (e) {
            console.warn("Notification could not be sent:", e)
          }
        }
      }
    } catch (error) {
      // Hata durumunda eski haline getir
      setIsLiked(wasLiked)
      setLikes(prevLikes)
      toast.error('İşlem başarısız oldu')
    }
  }

  const handleReport = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentUserId) return toast.error('Giriş yapmalısınız')
    toast.success('Şikayetiniz alındı, adminler inceleyecektir.')
    await supabase.from('post_reports').insert([{ post_id: post.id, user_id: currentUserId, reason: 'Uygunsuz İçerik' }])
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(`${window.location.origin}/sosyal/post/${post.id}`)
    toast.success('Bağlantı kopyalandı!')
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !currentUserId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('post_comments')
      .insert([{ post_id: post.id, user_id: currentUserId, comment: newComment }])
      .select('*, user_profiles:user_id(username, avatar_url)')
      .single()

    if (!error) {
      setComments([data, ...comments])
      setNewComment('')

      // Bildirim Gonder (Eger kendi postu degilse)
      if (post.user_id !== currentUserId) {
        try {
          await supabase.from('notifications').insert({
            user_id: post.user_id,
            actor_id: currentUserId,
            type: 'comment',
            post_id: post.id
          })
        } catch (e) {
          console.warn("Notification could not be sent:", e)
        }
      }
    }
    setLoading(false)
  }

  return (
    <div className="bg-[#112240] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl transition-all hover:border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/profil/${post.user_profiles?.username}`} className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#64ffda] to-blue-500 p-[2px] hover:scale-105 transition-transform active:scale-95 shrink-0">
            <div className="w-full h-full bg-[#0a192f] rounded-[9px] overflow-hidden relative">
              <Image src={post.user_profiles?.avatar_url || ''} alt="Avatar" fill className="object-cover" />
            </div>
          </Link>
          <div className="min-w-0">
            <Link href={`/profil/${post.user_profiles?.username}`} className="text-white font-black text-[11px] uppercase tracking-widest hover:text-[#64ffda] transition-colors truncate block">
              {post.user_profiles?.username}
            </Link>
            <div className="flex items-center gap-1 text-[#64ffda] text-[9px] font-bold mt-0.5 truncate">
              {post.businesses ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); router.push(`/isletme/${post.businesses.slug}`); }}
                  className="flex items-center gap-1 hover:underline decoration-2 truncate"
                >
                  <Building2 className="w-2.5 h-2.5" /> {post.businesses.name}
                </button>
              ) : (
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="w-2.5 h-2.5" /> {post.location || 'Fethiye'}
                </div>
              )}
            </div>
          </div>
        </div>
        <button onClick={handleReport} className="p-1.5 text-slate-600 hover:text-red-500 transition-colors">
          <AlertTriangle className="w-4 h-4" />
        </button>
      </div>

      <div 
        className="relative aspect-square overflow-hidden cursor-pointer" 
        onDoubleClick={handleLike}
        onClick={() => router.push(`/sosyal/post/${post.id}`)}
      >
        <Image 
          src={post.image_url} 
          alt="Post" 
          fill 
          className="object-cover transition-transform duration-[2s] hover:scale-110" 
        />
      </div>

      {/* Actions & Caption */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className={`flex items-center gap-1.5 group ${isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}>
              <Heart className={`w-6 h-6 transition-transform group-active:scale-150 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-black text-[10px] uppercase">{likesCount}</span>
            </button>
            <button onClick={() => router.push(`/sosyal/post/${post.id}`)} className="flex items-center gap-1.5 text-slate-400 hover:text-[#64ffda]">
              <MessageSquare className="w-6 h-6" />
              <span className="font-black text-[10px] uppercase">{comments.length}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-1.5 text-slate-400 hover:text-white transition-all"><Share2 className="w-5 h-5" /></button>
            <button onClick={() => setIsSaved(!isSaved)} className={`p-1.5 transition-all ${isSaved ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`}>
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Caption - Compact */}
        <div className="mb-4">
          <p className="text-white text-[11px] leading-relaxed line-clamp-2">
            <Link href={`/profil/${post.user_profiles?.username}`} className="font-black mr-1 uppercase text-[#64ffda] tracking-widest hover:underline decoration-1">
              {post.user_profiles?.username}
            </Link>
            {post.caption}
          </p>
        </div>

        <form 
          onSubmit={(e) => {
            e.stopPropagation()
            handleComment(e)
          }} 
          className="relative mt-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <input 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Yorum..."
            className="w-full bg-[#0a192f] border border-white/5 rounded-xl py-2.5 px-4 text-white text-[10px] focus:ring-1 focus:ring-[#64ffda] outline-none"
          />
          <button type="submit" disabled={loading} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64ffda] font-black text-[9px] uppercase">
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Gönder'}
          </button>
        </form>
      </div>
    </div>
  )
}
