'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { MessageSquare, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const supabase = createClient()

export default function MessageButton({ profileId, currentUserId }: { profileId: string, currentUserId?: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleMessage = async () => {
        if (!currentUserId) {
            toast.error('Mesaj göndermek için giriş yapmalısınız')
            router.push('/giris')
            return
        }

        try {
            setLoading(true)
            const { data: existingMember } = await supabase.rpc('get_existing_conversation', { user1: currentUserId, user2: profileId })

            if (existingMember && existingMember.length > 0) {
                router.push(`/mesajlar/${existingMember[0].conversation_id}`)
                return
            }

            const { data: newConv, error: convError } = await supabase.from('conversations').insert({}).select().single()
            if (convError) throw convError

            await supabase.from('conversation_members').insert([
                { conversation_id: newConv.id, user_id: currentUserId },
                { conversation_id: newConv.id, user_id: profileId }
            ])

            router.push(`/mesajlar/${newConv.id}`)
        } catch (error) {
            toast.error('Sohbet başlatılamadı')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button 
            onClick={handleMessage}
            disabled={loading}
            className="px-8 py-3 bg-white/5 text-white border border-white/10 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 shadow-xl"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><MessageSquare className="w-4 h-4" /> Mesaj Gönder</>}
        </button>
    )
}
