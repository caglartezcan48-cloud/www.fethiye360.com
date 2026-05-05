'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Heart, MessageSquare, Send, MapPin, MoreHorizontal, Loader2, Sparkles, CornerDownRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface PostCardProps {
  post: any
  currentUserId?: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [likes, setLikes] = useState(post.post_likes?.length || 0)
  const [isLiked, setIsLiked] = useState(post.post_likes?.some((l: any) => l.user_id === currentUserId))
  const [comments, setComments] = useState(post.post_comments || [])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [showComments, setShowComments] = useState(false)
  
  const supabase = createClient()

  const handleLike = async () => {
    if (!currentUserId) return alert('Beğenmek için giriş yapmalısınız')
    
    if (isLiked) {
      setLikes(prev => prev - 1)
      setIsLiked(false)
      await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', currentUserId)
    } else {
      setLikes(prev => prev + 1)
      setIsLiked(true)
      await supabase.from('post_likes').insert([{ post_id: post.id, user_id: currentUserId }])
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !currentUserId) return
    
    setLoading(true)
    const { data, error } = await supabase
      .from('post_comments')
      .insert([{
        post_id: post.id,
        user_id: currentUserId,
        comment: newComment
      }])
      .select(`
        *,
        user_profiles (username, avatar_url)
      `)
      .single()

    if (!error && data) {
      setComments([data, ...comments])
      setNewComment('')
    }
    setLoading(false)
  }

  return (
    <div className="bg-[#112240] rounded-[48px] border border-white/5 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Post Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white/10 p-0.5 bg-gradient-to-br from-[#64ffda] to-blue-500">
            <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[#0a192f]">
              <Image 
                src={post.user_profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_profiles?.username}`} 
                alt="Avatar" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest">{post.user_profiles?.username}</h4>
            {post.location && (
              <div className="flex items-center gap-1 text-[#64ffda] text-[10px] font-bold">
                <MapPin className="w-3 h-3" /> {post.location}
              </div>
            )}
          </div>
        </div>
        <button className="p-2 text-slate-500 hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Image HD */}
      <div 
        className="relative aspect-square cursor-pointer group"
        onDoubleClick={handleLike}
      >
        <Image 
          src={post.image_url} 
          alt="Fethiye Post" 
          fill 
          className="object-cover transition-transform duration-[2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        
        {/* Like Overlay Effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Heart className={`w-24 h-24 text-white fill-white transition-all duration-500 scale-0 ${isLiked ? 'animate-ping opacity-0' : ''}`} />
        </div>
      </div>

      {/* Post Actions */}
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 group transition-all ${isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
            >
              <Heart className={`w-7 h-7 transition-transform group-active:scale-150 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-black text-xs uppercase tracking-widest">{likes} Beğeni</span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-slate-400 hover:text-[#64ffda] group transition-all"
            >
              <MessageSquare className="w-7 h-7 group-hover:scale-110 transition-transform" />
              <span className="font-black text-xs uppercase tracking-widest">{comments.length} Yorum</span>
            </button>
          </div>
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Send className="w-6 h-6" />
          </button>
        </div>

        {/* Caption */}
        <div className="space-y-2">
          <p className="text-white text-sm leading-relaxed">
            <span className="font-black mr-2 uppercase tracking-widest text-[#64ffda]">{post.user_profiles?.username}</span>
            {post.caption}
          </p>
          <span className="text-slate-600 text-[10px] uppercase font-black tracking-widest">
            {new Date(post.created_at).toLocaleDateString('tr-TR')}
          </span>
        </div>

        {/* Comment Input */}
        <form onSubmit={handleComment} className="relative mt-6">
          <input 
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Yorum ekle..."
            className="w-full bg-[#0a192f] border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:ring-2 focus:ring-[#64ffda] outline-none transition-all placeholder:text-slate-700"
          />
          <button 
            type="submit"
            disabled={!newComment.trim() || loading}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64ffda] font-black text-xs uppercase tracking-widest disabled:opacity-30"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Paylaş'}
          </button>
        </form>

        {/* Comments List (Expandable) */}
        {showComments && comments.length > 0 && (
          <div className="pt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            {comments.map((comment: any) => (
              <div key={comment.id} className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded-lg bg-white/5 overflow-hidden shrink-0">
                  <Image 
                    src={comment.user_profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_profiles?.username}`} 
                    alt="Avatar" 
                    width={32} 
                    height={32}
                  />
                </div>
                <div className="flex-1 bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#64ffda] text-[10px] font-black uppercase tracking-widest">{comment.user_profiles?.username}</span>
                    <span className="text-slate-600 text-[8px] font-black uppercase">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-300 text-xs font-medium">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
