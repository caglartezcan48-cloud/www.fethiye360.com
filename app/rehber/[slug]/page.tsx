'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from "@/components/fethiye/header"
import { Footer } from "@/components/fethiye/footer"
import Image from "next/image"
import { 
  MapPin, 
  History, 
  Navigation, 
  MessageSquare, 
  Send,
  Sparkles,
  Image as ImageIcon,
  ChevronDown,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Link from 'next/link'

export default function DestinationDetailPage({ params }: { params: { slug: string } }) {
  const [dest, setDest] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageIndex, setImageIndex] = useState(0)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    const { data: destination } = await supabase
      .from('destinations')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (destination) {
      setDest(destination)
      const { data: commentData } = await supabase
        .from('destination_comments')
        .select('*, user_profiles(username, avatar_url)')
        .eq('destination_id', destination.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
      setComments(commentData || [])
    }
    setLoading(false)
  }

  const openLightbox = (img: string, index: number) => {
    setSelectedImage(img)
    setImageIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextIdx = (imageIndex + 1) % dest.gallery.length
    setSelectedImage(dest.gallery[nextIdx])
    setImageIndex(nextIdx)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const prevIdx = (imageIndex - 1 + dest.gallery.length) % dest.gallery.length
    setSelectedImage(dest.gallery[prevIdx])
    setImageIndex(prevIdx)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-[#64ffda]/20 border-t-[#64ffda] rounded-full animate-spin" />
    </div>
  )

  if (!dest) return null

  return (
    <main className="min-h-screen bg-[#0a192f] selection:bg-[#64ffda] selection:text-[#0a192f]">
      <Header />
      
      {/* Cinematic Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <Image 
          src={dest.main_image} 
          alt={dest.title} 
          fill 
          className="object-cover scale-105 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a192f]/40 to-[#0a192f]" />
        
        <div className="relative z-10 text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 text-[#64ffda]" />
            <span className="text-white text-xs font-black uppercase tracking-[0.3em]">{dest.category}</span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase italic leading-none">
            {dest.title}
          </h1>
          <div className="flex items-center justify-center gap-8 text-white/60 text-sm font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#64ffda]" /> FETHİYE</div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/30" />
        </div>
      </section>

      {/* Elegant Content Grid */}
      <section className="max-w-6xl mx-auto px-6 py-32 space-y-32">
        
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="w-20 h-1 bg-[#64ffda] mx-auto rounded-full" />
          <p className="text-2xl md:text-3xl text-slate-300 font-medium leading-relaxed italic">
            "{dest.description}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group bg-white/5 border border-white/5 p-12 rounded-[60px] hover:bg-white/10 transition-all duration-500">
            <History className="w-12 h-12 text-[#64ffda] mb-8" />
            <h3 className="text-2xl font-black text-white uppercase italic mb-6">Tarihçe</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{dest.history}</p>
          </div>

          <div className="group bg-white/5 border border-white/5 p-12 rounded-[60px] hover:bg-white/10 transition-all duration-500">
            <Navigation className="w-12 h-12 text-blue-400 mb-8" />
            <h3 className="text-2xl font-black text-white uppercase italic mb-6">Ulaşım</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{dest.transportation}</p>
          </div>
        </div>

        {/* PHOTO WALL WITH LIGHTBOX */}
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              Görsel <span className="text-[#64ffda]">Ziyafeti</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase italic">Resme tıklayarak büyütebilirsiniz</p>
          </div>
          
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {dest.gallery && dest.gallery.map((img: string, i: number) => (
              <div 
                key={i} 
                onClick={() => openLightbox(img, i)}
                className="relative group overflow-hidden rounded-[40px] border border-white/5 bg-white/5 break-inside-avoid cursor-zoom-in"
              >
                <img 
                  src={img} 
                  alt={`${dest.title} - ${i + 1}`} 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#64ffda]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-10 h-10 text-white drop-shadow-2xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments... */}
        <div className="max-w-4xl mx-auto space-y-16 pt-20 border-t border-white/5">
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter text-center">Deneyimler</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {comments?.map((c) => (
              <div key={c.id} className="bg-white/5 p-10 rounded-[40px] border border-white/5 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-16 h-16 rounded-2xl overflow-hidden relative shrink-0">
                  <Image src={c.user_profiles?.avatar_url || "/default-avatar.png"} alt="Avatar" fill className="object-cover" />
                </div>
                <div className="space-y-4">
                  <span className="text-white font-black uppercase tracking-widest text-xs">{c.user_profiles?.username}</span>
                  <p className="text-slate-300 text-lg leading-relaxed italic">"{c.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[999] bg-[#0a192f]/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          <button 
            onClick={closeLightbox}
            className="absolute top-8 right-8 p-4 bg-white/5 text-white rounded-full hover:bg-white/10 transition-all z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button 
            onClick={prevImage}
            className="absolute left-8 p-4 text-white/50 hover:text-[#64ffda] transition-all"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <button 
            onClick={nextImage}
            className="absolute right-8 p-4 text-white/50 hover:text-[#64ffda] transition-all"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          <div className="relative w-full max-w-6xl aspect-[16/9] animate-in zoom-in-95 duration-500">
            <img 
              src={selectedImage} 
              alt="Full view" 
              className="w-full h-full object-contain rounded-3xl"
            />
            <div className="absolute -bottom-12 left-0 right-0 text-center">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                Fotoğraf {imageIndex + 1} / {dest.gallery.length}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
