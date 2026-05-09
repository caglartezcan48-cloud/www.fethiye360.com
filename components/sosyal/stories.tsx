'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Plus, 
  Loader2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Circle
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

export function Stories() {
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUserStories, setSelectedUserStories] = useState<any[] | null>(null)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [user, setUser] = useState<any>(null)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchStories()
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const fetchStories = async () => {
    try {
      // Son 24 saatteki hikayeleri getir
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      
      const { data, error } = await supabase
        .from('user_stories')
        .select(`
          *,
          user_profiles(username, avatar_url)
        `)
        .gt('created_at', twentyFourHoursAgo)
        .eq('media_type', 'image')
        .order('created_at', { ascending: true })

      if (error) throw error

      // Hikayeleri kullanıcı bazlı grupla
      const grouped = data.reduce((acc: any, story: any) => {
        const userId = story.user_id
        if (!acc[userId]) {
          acc[userId] = {
            user: story.user_profiles,
            stories: []
          }
        }
        acc[userId].stories.push(story)
        return acc
      }, {})

      setStories(Object.values(grouped))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const openStory = (userStories: any[]) => {
    setSelectedUserStories(userStories)
    setCurrentStoryIndex(0)
  }

  const nextStory = () => {
    if (selectedUserStories && currentStoryIndex < selectedUserStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1)
    } else {
      setSelectedUserStories(null)
    }
  }

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1)
    }
  }

  // Otomatik ilerleme
  useEffect(() => {
    let timer: any
    if (selectedUserStories) {
      timer = setTimeout(() => {
        nextStory()
      }, 5000) // Her hikaye 5 saniye
    }
    return () => clearTimeout(timer)
  }, [selectedUserStories, currentStoryIndex])

  if (loading) return null

  return (
    <div className="flex items-center gap-4 py-6 px-2 overflow-x-auto no-scrollbar animate-in fade-in duration-1000">
      {/* Kendi Hikayeni Ekle */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <button 
          onClick={() => router.push('/sosyal/yukle?type=story')}
          className="relative w-16 h-16 md:w-20 md:h-20 rounded-full p-1 border-2 border-dashed border-slate-700 hover:border-[#64ffda] transition-all group"
        >
          <div className="w-full h-full bg-[#112240] rounded-full flex items-center justify-center overflow-hidden">
             <Plus className="w-8 h-8 text-slate-500 group-hover:text-[#64ffda] group-hover:scale-110 transition-all" />
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#64ffda] rounded-full border-4 border-[#0a192f] flex items-center justify-center">
            <Plus className="w-3 h-3 text-[#0a192f] stroke-[4]" />
          </div>
        </button>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Senin</span>
      </div>

      {/* Diger Hikayeler */}
      {stories.map((group: any) => (
        <div key={group.user.username} className="flex flex-col items-center gap-2 shrink-0">
          <button 
            onClick={() => openStory(group.stories)}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 animate-gradient-x"
          >
            <div className="w-full h-full bg-[#0a192f] rounded-full p-1">
              <div className="w-full h-full rounded-full overflow-hidden relative">
                <Image 
                  src={group.user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${group.user.username}`} 
                  alt={group.user.username} 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
          </button>
          <span className="text-[10px] font-black text-white uppercase tracking-widest truncate w-16 text-center">
            {group.user.username}
          </span>
        </div>
      ))}

      {/* Story Viewer Modal */}
      <Dialog open={!!selectedUserStories} onOpenChange={() => setSelectedUserStories(null)}>
        <DialogContent className="max-w-[100vw] h-screen p-0 border-none bg-black/95 backdrop-blur-3xl overflow-hidden flex flex-col items-center justify-center">
          {selectedUserStories && (
            <div className="relative w-full max-w-lg aspect-[9/16] bg-[#0a192f] rounded-none md:rounded-[40px] overflow-hidden shadow-2xl">
              {/* Progress Bars */}
              <div className="absolute top-4 left-4 right-4 flex gap-1 z-50">
                {selectedUserStories.map((_, idx) => (
                  <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-white transition-all duration-[5000ms] ease-linear ${idx < currentStoryIndex ? 'w-full' : idx === currentStoryIndex ? 'w-full' : 'w-0'}`}
                      style={{ transitionDuration: idx === currentStoryIndex ? '5000ms' : '0ms' }}
                    />
                  </div>
                ))}
              </div>

              {/* User Info */}
              <div className="absolute top-8 left-6 flex items-center gap-3 z-50">
                <div className="w-10 h-10 rounded-full border-2 border-[#64ffda] overflow-hidden relative">
                  <Image src={selectedUserStories[currentStoryIndex].user_profiles.avatar_url} alt="User" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-black text-xs uppercase tracking-widest">{selectedUserStories[currentStoryIndex].user_profiles.username}</h4>
                  <p className="text-white/60 text-[8px] font-bold uppercase flex items-center gap-1">
                    <Clock className="w-2 h-2" /> {new Date(selectedUserStories[currentStoryIndex].created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedUserStories(null)}
                className="absolute top-8 right-6 z-50 p-2 text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Navigation Buttons */}
              <button onClick={prevStory} className="absolute left-0 top-0 bottom-0 w-1/4 z-40" />
              <button onClick={nextStory} className="absolute right-0 top-0 bottom-0 w-1/4 z-40" />

              {/* Media Content */}
              <div className="relative w-full h-full">
                <Image 
                  src={selectedUserStories[currentStoryIndex].media_url} 
                  alt="Story" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
