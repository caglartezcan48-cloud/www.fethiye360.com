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
  const [likes, setLikes] = useState(post.post_likes?.length || 0)
  const [isLiked, setIsLiked] = useState(post.post_likes?.some((l: any) => l.user_id === currentUserId))
  const [isDisliked, setIsDisliked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [comments, setComments] = useState(post.post_comments || [])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const router = useRouter()
  
  const supabase = createClient()
  const handleLike = async () => {
    if (!currentUserId) {
      toast.error('Beğenmek için giriş yapmalısınız')
      return
    }

    // Optimistic Update: Hemen arayüzü güncelle
    const wasLiked = isLiked
    const prevLikes = likes
    
    setIsLiked(!wasLiked)
    setLikes(prev => wasLiked 
      ? prev.filter((l: any) => l.user_id !== currentUserId)
      : [...prev, { user_id: currentUserId }]
    )

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
          await supabase.from('notifications').insert({
            user_id: post.user_id,
            actor_id: currentUserId,
            type: 'like',
            post_id: post.id
          })
        }
      }
    } catch (error) {
      // Hata durumunda eski haline getir
      setIsLiked(wasLiked)
      setLikes(prevLikes)
      toast.error('İşlem başarısız oldu')
    }
  }

  const handleReport = async () => {
    if (!currentUserId) return toast.error('Giriş yapmalısınız')
    toast.success('Şikayetiniz alındı, adminler inceleyecektir.')
    await supabase.from('post_reports').insert([{ post_id: post.id, user_id: currentUserId, reason: 'Uygunsuz İçerik' }])
  }

  const handleShare = () => {
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
      .select('*, user_profiles(username, avatar_url)')
      .single()

    if (!error) {
      setComments([data, ...comments])
      setNewComment('')

      // Bildirim Gonder (Eger kendi postu degilse)
      if (post.user_id !== currentUserId) {
        await supabase.from('notifications').insert({
          user_id: post.user_id,
          actor_id: currentUserId,
          type: 'comment',
          post_id: post.id
        })
      }
    }
    setLoading(false)
  }

  return (
    <div className="bg-[#112240] rounded-[48px] border border-white/5 overflow-hidden shadow-2xl transition-all hover:border-white/10">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/profil/${post.user_profiles?.username}`} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#64ffda] to-blue-500 p-[2px] hover:scale-105 transition-transform active:scale-95">
            <div className="w-full h-full bg-[#0a192f] rounded-[14px] overflow-hidden relative">
              <Image src={post.user_profiles?.avatar_url || ''} alt="Avatar" fill className="object-cover" />
            </div>
          </Link>
          <div>
            <Link href={`/profil/${post.user_profiles?.username}`} className="text-white font-black text-sm uppercase tracking-widest hover:text-[#64ffda] transition-colors">
              {post.user_profiles?.username}
            </Link>
            <div className="flex items-center gap-1 text-[#64ffda] text-[10px] font-bold mt-0.5">
              {post.businesses ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); router.push(`/isletme/${post.businesses.slug}`); }}
                  className="flex items-center gap-1 hover:underline decoration-2"
                >
                  <Building2 className="w-3 h-3" /> {post.businesses.name}
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {post.location || 'Fethiye'}
                </div>
              )}
            </div>
          </div>
        </div>
        <button onClick={handleReport} className="p-2 text-slate-600 hover:text-red-500 transition-colors flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Şikayet Et</span>
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

      {/* Actions */}
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={handleLike} className={`flex items-center gap-2 group ${isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}>
              <Heart className={`w-7 h-7 transition-transform group-active:scale-150 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-black text-xs uppercase">{likes}</span>
            </button>
            <button onClick={() => setIsDisliked(!isDisliked)} className={`flex items-center gap-2 group ${isDisliked ? 'text-blue-500' : 'text-slate-400 hover:text-blue-500'}`}>
              <ThumbsDown className={`w-7 h-7 transition-transform group-active:scale-150 ${isDisliked ? 'fill-current' : ''}`} />
            </button>
            <button onClick={() => router.push(`/sosyal/post/${post.id}`)} className="flex items-center gap-2 text-slate-400 hover:text-[#64ffda]">
              <MessageSquare className="w-7 h-7" />
              <span className="font-black text-xs uppercase">{comments.length}</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleShare} className="p-2 text-slate-400 hover:text-white transition-all"><Share2 className="w-6 h-6" /></button>
            <button onClick={() => setIsSaved(!isSaved)} className={`p-2 transition-all ${isSaved ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`}>
              <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="space-y-2">
          <p className="text-white text-sm leading-relaxed">
            <Link href={`/profil/${post.user_profiles?.username}`} className="font-black mr-2 uppercase text-[#64ffda] tracking-widest hover:underline decoration-2">
              {post.user_profiles?.username}
            </Link>
            {post.caption}
          </p>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleComment} className="relative mt-4">
          <input 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Yorumunuzu yazın..."
            className="w-full bg-[#0a192f] border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:ring-2 focus:ring-[#64ffda] outline-none"
          />
          <button type="submit" disabled={loading} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64ffda] font-black text-xs uppercase">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Paylaş'}
          </button>
        </form>
      </div>
    </div>
  )
}
