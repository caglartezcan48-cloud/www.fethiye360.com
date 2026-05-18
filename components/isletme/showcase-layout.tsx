'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BusinessActionButtons } from './business-action-buttons'
import { 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  MessageCircle, 
  Clock,
  Sparkles,
  ArrowLeft,
  X,
  Plus,
  Send,
  Loader2,
  CheckCircle2,
  Instagram,
  ChevronRight,
  Maximize2
} from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  description: string | null
  image_url: string | null
  category: string | null
}

interface Review {
  id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
}

interface Business {
  id: string
  name: string
  slug: string
  description: string | null
  category_id: string | null
  address: string | null
  phone: string | null
  whatsapp: string | null
  website: string | null
  opening_hours: any
  main_image: string | null
  images: string[]
  services: string[]
}

interface ShowcaseLayoutProps {
  business: Business
  products: Product[]
  reviews: Review[]
  avgRating: string
}

export function ShowcaseLayout({ business, products, reviews, avgRating }: ShowcaseLayoutProps) {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'hakkinda' | 'katalog' | 'galeri' | 'yorumlar'>('hakkinda')
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  
  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)

  // Calisiyor mu durumu (Simple Opening Hours Calculator)
  const getOpenStatus = () => {
    try {
      const now = new Date()
      const day = now.getDay() // 0 = Pazar, 1 = Pazartesi ... 6 = Cumartesi
      const currentHour = now.getHours()
      const currentMin = now.getMinutes()
      const currentTime = currentHour * 60 + currentMin

      // Default opening hours if not defined: 09:00 - 22:00
      let openHour = 9
      let openMin = 0
      let closeHour = 22
      let closeMin = 0

      if (business.opening_hours) {
        // dynamic parsing if schema exists, otherwise use default
      }

      const openTime = openHour * 60 + openMin
      const closeTime = closeHour * 60 + closeMin

      if (currentTime >= openTime && currentTime < closeTime) {
        return { label: 'Şu An Açık', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
      }
      return { label: 'Şu An Kapalı', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' }
    } catch {
      return { label: 'Açık', color: 'bg-[#64ffda]/10 text-[#64ffda] border-[#64ffda]/20' }
    }
  }

  const status = getOpenStatus()

  // Yorum Gonderme
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewName.trim() || !reviewComment.trim()) return

    setReviewSubmitting(true)
    setReviewError(null)

    try {
      const { data, error } = await supabase
        .from('business_reviews')
        .insert({
          business_id: business.id,
          user_name: reviewName,
          rating: reviewRating,
          comment: reviewComment,
          is_approved: true // Otomatik onay veya onay bekliyor durumuna gore
        })
        .select()

      if (error) throw error

      if (data && data[0]) {
        setLocalReviews(prev => [data[0] as Review, ...prev])
      }

      setReviewSuccess(true)
      setTimeout(() => {
        setIsReviewModalOpen(false)
        setReviewSuccess(false)
        setReviewName('')
        setReviewComment('')
        setReviewRating(5)
      }, 2000)
    } catch (err: any) {
      setReviewError(err.message || 'Yorum gönderilirken bir hata oluştu')
    } finally {
      setReviewSubmitting(false)
    }
  }

  return (
    <div className="w-full pb-20">
      {/* Cinematic Banner Header */}
      <section className="relative h-[35vh] sm:h-[45vh] md:h-[50vh] w-full overflow-hidden bg-slate-950">
        {business.main_image ? (
          <Image 
            src={business.main_image} 
            alt={business.name} 
            fill
            priority
            unoptimized
            className="object-cover opacity-85"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0a192f] to-[#112240]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/40 to-transparent" />
        
        {/* Navigation Action Buttons */}
        <div className="absolute top-28 left-6 sm:left-12 z-10 flex items-center gap-3">
          <Link 
            href="/isletmeler" 
            className="p-3 bg-[#0a192f]/60 backdrop-blur-md rounded-2xl text-white/80 hover:text-white hover:bg-[#64ffda] hover:text-[#0a192f] border border-white/10 hover:border-[#64ffda] transition-all duration-300"
            aria-label="Geri Dön"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        <div className="absolute top-28 right-6 sm:right-12 z-10">
          <BusinessActionButtons title={business.name} />
        </div>

        {/* Brand Details Container */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-start p-6 sm:p-12 z-10">
          <div className="max-w-4xl space-y-4 text-left">
            {/* Category Tag */}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#64ffda] text-[#0a192f] rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-[#64ffda]/10">
              <Sparkles className="w-3.5 h-3.5" />
              {Array.isArray(business.category_id) ? 'Hizmet' : 'İşletme'}
            </span>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-md leading-tight">
              {business.name}
            </h1>

            {/* Live Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-white font-bold text-sm">{avgRating}</span>
                <span className="text-white/40 text-xs font-semibold">({localReviews.length} Yorum)</span>
              </div>

              <span className={`px-3.5 py-1 rounded-xl text-xs font-bold border border-white/5 backdrop-blur-md ${status.color}`}>
                {status.label}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT SIDE: Showcase Interactive Tabs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Selectors */}
            <div className="flex border-b border-white/10 gap-6 overflow-x-auto pb-px select-none scrollbar-none">
              <button
                onClick={() => setActiveTab('hakkinda')}
                className={`pb-4 text-sm font-black tracking-widest uppercase border-b-2 transition-all duration-300 ${
                  activeTab === 'hakkinda' 
                    ? 'border-[#64ffda] text-[#64ffda]' 
                    : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                Hakkında
              </button>

              {products.length > 0 && (
                <button
                  onClick={() => setActiveTab('katalog')}
                  className={`pb-4 text-sm font-black tracking-widest uppercase border-b-2 transition-all duration-300 ${
                    activeTab === 'katalog' 
                      ? 'border-[#64ffda] text-[#64ffda]' 
                      : 'border-transparent text-white/50 hover:text-white/80'
                  }`}
                >
                  Katalog & Fiyatlar ({products.length})
                </button>
              )}

              {business.images && business.images.length > 0 && (
                <button
                  onClick={() => setActiveTab('galeri')}
                  className={`pb-4 text-sm font-black tracking-widest uppercase border-b-2 transition-all duration-300 ${
                    activeTab === 'galeri' 
                      ? 'border-[#64ffda] text-[#64ffda]' 
                      : 'border-transparent text-white/50 hover:text-white/80'
                  }`}
                >
                  Galeri ({business.images.length})
                </button>
              )}

              <button
                onClick={() => setActiveTab('yorumlar')}
                className={`pb-4 text-sm font-black tracking-widest uppercase border-b-2 transition-all duration-300 ${
                  activeTab === 'yorumlar' 
                    ? 'border-[#64ffda] text-[#64ffda]' 
                    : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                Yorumlar ({localReviews.length})
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="min-h-[300px]">
              {/* TAB 1: ABOUT */}
              {activeTab === 'hakkinda' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Biography */}
                  {business.description && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white tracking-wide">İşletme Hakkında</h3>
                      <p className="text-white/70 text-base leading-relaxed whitespace-pre-line">
                        {business.description}
                      </p>
                    </div>
                  )}

                  {/* Services / Tags Grid */}
                  {business.services && business.services.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white tracking-wide">Sunulan Hizmetler & Özellikler</h3>
                      <div className="flex flex-wrap gap-2.5">
                        {business.services.map((service, index) => (
                          <div 
                            key={index}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:border-[#64ffda]/30 hover:text-white transition-all duration-300 text-sm"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64ffda]" />
                            {service}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Standard About features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <Star className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold">{avgRating} Yıldız</p>
                        <p className="text-xs text-white/40">Müşteri Puanı</p>
                      </div>
                    </div>

                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold">{localReviews.length} Yorum</p>
                        <p className="text-xs text-white/40">Kullanıcı Değerlendirmesi</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CATALOG & PRICES */}
              {activeTab === 'katalog' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-300">
                  {products.map((product) => (
                    <div 
                      key={product.id}
                      className="group flex flex-col bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5"
                    >
                      {/* Product Image */}
                      {product.image_url ? (
                        <div className="relative w-full aspect-[16/10] overflow-hidden">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {product.category && (
                            <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-slate-950/70 border border-white/10 backdrop-blur-md rounded-md text-[9px] font-bold uppercase tracking-wider text-[#64ffda]">
                              {product.category}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="w-full aspect-[16/10] bg-[#0a192f] border-b border-white/5 flex items-center justify-center text-white/20">
                          Görsel Yok
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <h4 className="text-base font-bold text-white group-hover:text-[#64ffda] transition-colors">{product.name}</h4>
                          {product.description && (
                            <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{product.description}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-xs text-white/40">Fiyat</span>
                          <span className="text-lg font-black text-[#64ffda]">{product.price} TL</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: GALLERY GRID */}
              {activeTab === 'galeri' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-in fade-in duration-300">
                  {business.images.map((image, index) => (
                    <div 
                      key={index}
                      onClick={() => setLightboxImage(image)}
                      className="relative aspect-square rounded-xl overflow-hidden border border-white/5 cursor-zoom-in group bg-[#0a192f]"
                    >
                      <Image 
                        src={image} 
                        alt={`${business.name} Galeri ${index + 1}`} 
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: REVIEWS LIST */}
              {activeTab === 'yorumlar' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Reviews Summary bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="text-center sm:text-left space-y-1">
                      <p className="text-5xl font-black text-white">{avgRating}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.round(parseFloat(avgRating)) ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-xs text-white/40 font-semibold">{localReviews.length} Doğrulanmış Değerlendirme</p>
                    </div>

                    <button 
                      onClick={() => setIsReviewModalOpen(true)}
                      className="flex items-center gap-2 bg-[#64ffda] text-[#0a192f] hover:bg-[#52e0c4] px-6 h-12 rounded-xl font-black uppercase tracking-widest text-xs transition-transform active:scale-95 shadow-lg shadow-[#64ffda]/10"
                    >
                      <Plus className="w-4 h-4" /> Yorum Yap
                    </button>
                  </div>

                  {/* Reviews List */}
                  {localReviews.length > 0 ? (
                    <div className="space-y-4">
                      {localReviews.map((review) => (
                        <div key={review.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold select-none">
                                {review.user_name?.charAt(0).toUpperCase() || 'A'}
                              </div>
                              <div>
                                <p className="text-white font-semibold text-sm">{review.user_name || 'Anonim'}</p>
                                <div className="flex items-center gap-0.5 mt-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-white/30 font-semibold">
                              {new Date(review.created_at).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                          <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
                      <MessageCircle className="w-12 h-12 text-white/10 mx-auto mb-3" />
                      <p className="text-white/40 text-sm">Henüz değerlendirme yapılmamış. İlk yorumu siz yapın!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Sticky Action Sidebar Card */}
          <div className="sticky top-32 space-y-6">
            <div className="bg-[#112240] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white tracking-wide border-b border-white/5 pb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#64ffda]" /> İletişim & Rezervasyon
              </h3>
              
              {/* Phone call CTA */}
              {business.phone && (
                <div className="space-y-2">
                  <a 
                    href={`tel:${business.phone}`} 
                    className="w-full py-4 bg-gradient-to-r from-[#64ffda] to-[#52e0c4] text-[#0a0f1a] rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-[#64ffda]/10"
                  >
                    <Phone className="w-4 h-4 fill-current" />
                    Hemen Ara
                  </a>
                  <p className="text-[10px] text-center text-white/40">Doğrudan sesli arama yapmak için dokunun</p>
                </div>
              )}

              {/* WhatsApp Rezervasyon CTA */}
              {business.whatsapp && (
                <a 
                  href={`https://wa.me/${business.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-emerald-500/10"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  WhatsApp Rezervasyon
                </a>
              )}

              {/* Web site CTA */}
              {business.website && (
                <a 
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-300"
                >
                  <Globe className="w-4 h-4" />
                  Web Sitesini Ziyaret Et
                </a>
              )}

              {/* Verified Info Details */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                {business.address && (
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 mt-0.5">
                      <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1">Adres</p>
                      <p className="text-white/80 text-xs leading-relaxed font-semibold">{business.address}</p>
                    </div>
                  </div>
                )}

                {business.phone && (
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 mt-0.5">
                      <Phone className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1">Telefon</p>
                      <p className="text-white/80 text-xs font-semibold">{business.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* LIGHTBOX FOR GALLERY */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-5xl w-full h-[80vh]">
            <Image 
              src={lightboxImage} 
              alt="Galeri Büyütülmüş" 
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* WRITE A REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#112240] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            {/* Close */}
            <button 
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white border border-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white tracking-wide">Değerlendirme Yaz</h3>
              <p className="text-sm text-white/40">Fikirleriniz bizim ve işletme için çok değerlidir.</p>
            </div>

            {reviewSuccess ? (
              <div className="py-8 text-center space-y-3 animate-in zoom-in duration-300">
                <CheckCircle2 className="w-16 h-16 text-[#64ffda] mx-auto" />
                <p className="text-lg font-black text-white">Yorumunuz Başarıyla İletildi!</p>
                <p className="text-sm text-white/40">Yorumunuz hemen yayınlanacaktır.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300">Adınız Soyadınız *</label>
                  <input 
                    type="text" 
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    required
                    placeholder="Örn: Ahmet Yılmaz"
                    className="w-full bg-[#0a192f] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors"
                  />
                </div>

                {/* Rating selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">Puanınız *</label>
                  <div className="flex items-center gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-white hover:scale-110 active:scale-95 transition-transform"
                      >
                        <Star 
                          className={`w-8 h-8 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300">Yorumunuz *</label>
                  <textarea 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    rows={4}
                    placeholder="İşletmenin hizmeti, kalitesi ve deneyiminiz hakkında yazın..."
                    className="w-full bg-[#0a192f] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors resize-none"
                  />
                </div>

                {reviewError && (
                  <p className="text-rose-400 text-xs">{reviewError}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full py-4 bg-[#64ffda] text-[#0a0f1a] font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-[#52e0c4] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {reviewSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Gönder
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
