import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import Image from 'next/image'
import { 
  MapPin, 
  Phone, 
  Globe, 
  Instagram, 
  Star, 
  MessageCircle, 
  Navigation, 
  Share2, 
  Heart,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  Info
} from 'lucide-react'

async function getBusiness(slug: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data } = await supabase
    .from('businesses')
    .select('*, business_categories(name)')
    .eq('slug', slug)
    .single()

  return data
}

export default async function BusinessDetailPage({ params }: { params: { slug: string } }) {
  const business = await getBusiness(params.slug)

  if (!business) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <img 
          src={business.main_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=90"} 
          alt={business.name || 'İşletme'} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-20">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-4 py-1.5 bg-[#64ffda] text-[#0a192f] rounded-full text-[10px] font-black uppercase tracking-widest">
                {business.business_categories?.name}
              </span>
              {business.is_featured && (
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-[#64ffda]" /> Onaylı İşletme
                </span>
              )}
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
              {business.name}
            </h1>
            
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm font-bold">5.0 (24 Değerlendirme)</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4 text-[#64ffda]" />
                {business.address || 'Fethiye, Muğla'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Bar */}
      <section className="relative z-10 -mt-12 px-6">
        <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-4 shadow-2xl flex flex-wrap items-center justify-center gap-4">
          <a href={`tel:${business.phone}`} className="flex-1 min-w-[150px] flex items-center justify-center gap-3 py-4 bg-[#64ffda] text-[#0a192f] rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
            <Phone className="w-4 h-4" /> Hemen Ara
          </a>
          <a href={`https://wa.me/${business.phone}`} className="flex-1 min-w-[150px] flex items-center justify-center gap-3 py-4 bg-white/5 text-white border border-white/10 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
            <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
          </a>
          <button className="flex-1 min-w-[150px] flex items-center justify-center gap-3 py-4 bg-white/5 text-white border border-white/10 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
            <Navigation className="w-4 h-4 text-blue-400" /> Yol Tarifi
          </button>
          <div className="flex gap-2">
            <button className="p-4 bg-white/5 text-white border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-4 bg-white/5 text-white border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Left Column: Info & Description */}
          <div className="lg:col-span-2 space-y-16">
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                <Info className="text-[#64ffda]" /> İşletme Hakkında
              </h2>
              <div className="text-slate-400 text-lg leading-relaxed font-medium">
                {business.description || "Fethiye'nin en seçkin noktalarından biri olan bu işletme, misafirlerine unutulmaz bir deneyim sunmak için kapılarını açıyor. Modern tasarımı ve kaliteli hizmet anlayışıyla sektördeki yerini her geçen gün sağlamlaştırıyor."}
              </div>
            </div>

            {/* Gallery Placeholder */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                <ImageIcon className="text-[#64ffda]" /> Fotoğraf Galerisi
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="relative aspect-square rounded-[32px] overflow-hidden group border border-white/5">
                    <img 
                      src={`https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&i=${i}`} 
                      alt="Gallery" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Working Hours */}
          <div className="space-y-10">
            <div className="bg-white/5 border border-white/10 rounded-[48px] p-10 space-y-8 sticky top-32">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">İletişim Bilgileri</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#64ffda]/10 rounded-xl">
                    <MapPin className="w-5 h-5 text-[#64ffda]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Adres</p>
                    <p className="text-slate-400 text-xs mt-1">{business.address || 'Fethiye Merkez'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#64ffda]/10 rounded-xl">
                    <Phone className="w-5 h-5 text-[#64ffda]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Telefon</p>
                    <p className="text-slate-400 text-xs mt-1">{business.phone || '0(252) --- -- --'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#64ffda]/10 rounded-xl">
                    <Globe className="w-5 h-5 text-[#64ffda]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Web Sitesi</p>
                    <p className="text-slate-400 text-xs mt-1">www.fethiye360.com</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Çalışma Saatleri
                  </span>
                  <span className="text-[#64ffda] text-[10px] font-black uppercase">Şu An Açık</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-white font-medium">
                    <span>Hafta İçi</span>
                    <span>09:00 - 22:00</span>
                  </div>
                  <div className="flex justify-between text-white font-medium">
                    <span>Hafta Sonu</span>
                    <span>10:00 - 23:00</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-5 bg-white text-[#0a192f] rounded-3xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all flex items-center justify-center gap-3">
                <Instagram className="w-4 h-4" /> @fethiye360
              </button>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
