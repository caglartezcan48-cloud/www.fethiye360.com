'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageSquare, Play, Copy } from 'lucide-react'

interface DiscoveryCardProps {
  post: any
  aspectRatio?: string
}

export function DiscoveryCard({ post, aspectRatio = "aspect-square" }: DiscoveryCardProps) {
  return (
    <Link 
      href={`/sosyal/post/${post.id}`}
      className={`group relative ${aspectRatio} bg-[#112240] rounded-2xl overflow-hidden border border-white/5 cursor-pointer active:scale-95 transition-all shadow-xl`}
    >
      {/* Media */}
      <Image 
        src={post.image_url} 
        alt={post.caption || 'Fethiye'} 
        fill 
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />



      {/* Overlay on Hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-1 text-white font-black text-sm">
          <Heart className="w-5 h-5 fill-[#64ffda] text-[#64ffda]" />
          {post.post_likes?.length || 0}
        </div>
        <div className="flex flex-col items-center gap-1 text-white font-black text-sm">
          <MessageSquare className="w-5 h-5 fill-white text-white" />
          {post.post_comments?.length || 0}
        </div>
      </div>

      {/* Info on Bottom (Mobile always visible or hover) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full overflow-hidden relative border border-[#64ffda]/30">
            <Image src={post.user_profiles?.avatar_url || ''} alt="Avatar" fill sizes="20px" className="object-cover" />
          </div>
          <span className="text-[10px] text-white font-bold truncate">@{post.user_profiles?.username}</span>
        </div>
      </div>
    </Link>
  )
}
