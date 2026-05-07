'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Check, 
  X, 
  Loader2, 
  AlertCircle, 
  Image as ImageIcon, 
  User, 
  Calendar,
  ExternalLink,
  ShieldCheck,
  Trash2
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

export default function SocialModerationPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  const supabase = createClient()

  const fetchPendingPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('user_posts')
      .select('*, user_profiles(username, full_name, avatar_url)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Fetch pending posts error:", error)
      toast.error(`Paylaşımlar yüklenirken hata: ${error.message}`)
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPendingPosts()
  }, [])

  const handleApprove = async (postId: string) => {
    setActionLoading(postId)
    const { error } = await supabase
      .from('user_posts')
      .update({ is_approved: true })
      .eq('id', postId)

    if (!error) {
      toast.success('Paylaşım onaylandı ve yayına alındı!')
      setPosts(posts.filter(p => p.id !== postId))
    } else {
      toast.error('Bir hata oluştu')
    }
    setActionLoading(null)
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Bu paylaşımı silmek istediğinize emin misiniz?')) return
    
    setActionLoading(postId)
    const { error } = await supabase
      .from('user_posts')
      .delete()
      .eq('id', postId)

    if (!error) {
      toast.success('Paylaşım silindi.')
      setPosts(posts.filter(p => p.id !== postId))
    } else {
      toast.error('Silme işlemi başarısız')
    }
    setActionLoading(null)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 text-[#64ffda] animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#64ffda]" /> Sosyal Moderasyon
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Onay bekleyen kullanıcı paylaşımlarını denetleyin.</p>
        </div>
        <div className="bg-[#64ffda]/10 px-6 py-3 rounded-2xl border border-[#64ffda]/20 text-[#64ffda] font-black text-xs uppercase tracking-widest">
          {posts.length} Bekleyen Paylaşım
        </div>
      </div>

      {/* DEBUG ALANI: Veritabanından Gelen Ham Veri */}
      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-8 overflow-auto max-h-60">
        <p className="text-red-400 font-bold mb-2">Hata Ayıklama (Gelen Veri Sayısı: {posts.length})</p>
        <pre className="text-xs text-red-300">{JSON.stringify(posts, null, 2)}</pre>
      </div>

      {posts.length === 0 ? (
        <div className="bg-[#112240] rounded-[40px] border border-white/5 p-20 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-slate-700" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Tertemiz!</h3>
          <p className="text-slate-500">Onay bekleyen herhangi bir sosyal paylaşım bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-[#112240] rounded-[40px] border border-white/5 overflow-hidden flex flex-col group hover:border-[#64ffda]/30 transition-all shadow-2xl">
              {/* Preview Image */}
              <div className="relative aspect-square">
                <Image src={post.image_url} alt="Post Content" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20">
                      <Image src={post.user_profiles?.avatar_url || ''} alt="User" width={40} height={40} />
                    </div>
                    <div>
                      <p className="text-white font-black text-xs uppercase tracking-widest">{post.user_profiles?.username}</p>
                      <p className="text-slate-400 text-[10px] font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content & Actions */}
              <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="bg-[#0a192f] p-4 rounded-2xl border border-white/5 italic text-slate-300 text-sm leading-relaxed">
                    "{post.caption || 'Açıklama yok'}"
                  </div>
                  {post.location && (
                    <p className="text-[#64ffda] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      📍 {post.location}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleApprove(post.id)}
                    disabled={!!actionLoading}
                    className="flex-1 bg-[#64ffda] text-[#0a192f] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-[#52e0c4] transition-all disabled:opacity-50"
                  >
                    {actionLoading === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Onayla</>}
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={!!actionLoading}
                    className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 transition-all border border-red-500/20 hover:text-white"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
