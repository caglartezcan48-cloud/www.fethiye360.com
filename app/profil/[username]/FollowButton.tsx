'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { UserPlus, UserMinus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const supabase = createClient()

export default function FollowButton({ 
    profileId, 
    username, 
    initialIsFollowing, 
    currentUserId 
}: { 
    profileId: string, 
    username: string, 
    initialIsFollowing: boolean, 
    currentUserId?: string 
}) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleFollow = async () => {
        if (!currentUserId) {
            toast.error('Takip etmek için giriş yapmalısınız')
            router.push('/giris')
            return
        }

        try {
            setLoading(true)
            if (isFollowing) {
                await supabase.from('user_follows').delete().eq('follower_id', currentUserId).eq('following_id', profileId)
                setIsFollowing(false)
                toast.success(`${username} takibi bırakıldı`)
            } else {
                await supabase.from('user_follows').insert({ follower_id: currentUserId, following_id: profileId })
                await supabase.from('notifications').insert({ user_id: profileId, actor_id: currentUserId, type: 'follow' })
                setIsFollowing(true)
                toast.success(`${username} takip ediliyor! ✨`)
            }
            router.refresh()
        } catch (error) {
            toast.error('İşlem başarısız oldu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button 
            onClick={handleFollow}
            disabled={loading}
            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl ${
                isFollowing 
                ? 'bg-white/5 text-white border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20' 
                : 'bg-[#64ffda] text-[#0a192f] hover:bg-[#52e0c4] shadow-[#64ffda]/10'
            }`}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isFollowing ? <><UserMinus className="w-4 h-4" /> Takibi Bırak</> : <><UserPlus className="w-4 h-4" /> Takip Et</>}
        </button>
    )
}

