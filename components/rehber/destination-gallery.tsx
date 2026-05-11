'use client'

import { useState } from 'react'
import { 
  X, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight,
  Image as ImageIcon
} from "lucide-react"

interface GalleryProps {
  title: string
  gallery: string[]
}

export function DestinationGallery({ title, gallery }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageIndex, setImageIndex] = useState(0)

  if (!gallery || gallery.length === 0) return null

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
    const nextIdx = (imageIndex + 1) % gallery.length
    setSelectedImage(gallery[nextIdx])
    setImageIndex(nextIdx)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const prevIdx = (imageIndex - 1 + gallery.length) % gallery.length
    setSelectedImage(gallery[prevIdx])
    setImageIndex(prevIdx)
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
          Görsel <span className="text-[#64ffda]">Ziyafeti</span>
        </h2>
        <div className="hidden md:flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
          <ImageIcon className="w-4 h-4" /> HD KALİTE
        </div>
      </div>
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {gallery.map((img, i) => (
          <div 
            key={i} 
            onClick={() => openLightbox(img, i)}
            className="relative group overflow-hidden rounded-[40px] border border-white/5 bg-white/5 break-inside-avoid cursor-zoom-in"
          >
            <img 
              src={img} 
              alt={`${title} HD - ${i + 1}`} 
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <Maximize2 className="w-10 h-10 text-[#64ffda] drop-shadow-2xl scale-50 group-hover:scale-100 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[999] bg-[#0a192f]/95 backdrop-blur-3xl flex items-center justify-center p-4"
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

          <div className="relative max-w-7xl max-h-[90vh] flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Full view" 
              className="max-w-full max-h-[90vh] object-contain rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}
