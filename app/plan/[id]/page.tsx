'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { 
  Sparkles, 
  MapPin, 
  Share2, 
  Calendar,
  ChevronLeft,
  Navigation,
  CheckCircle2,
  Users,
  Heart,
  User
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

export default function SharedPlanPage() {
  const { id } = useParams()
  const router = useRouter()
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchPlan()
  }, [id])

  const fetchPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('user_itineraries')
        .select(`
          *,
          user_profiles:user_id (username, avatar_url)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setPlan(data)
    } catch (error) {
      console.error('Plan getirilemedi:', error)
      toast.error('Plan bulunamadı.')
    } finally {
      setLoading(false)
    }
  }

  const sharePlan = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Bağlantı kopyalandı! 🔗')
  }

  const getTransportTip = () => {
    if (!plan) return ""
    const allActivities = plan.activities.flatMap((d: any) => d.activities)
    const locations = allActivities.map((a: any) => a.location)
    const hasFarPlaces = locations.some(l => ['Faralya', 'Seydikemer', 'Antalya', 'Yaka'].includes(l))
    
    if (hasFarPlaces) return "Seçtiğiniz bazı noktalar merkeze uzak (Faralya, Seydikemer vb.). Bu rota için araç kiralamanızı veya şahsi aracınızı kullanmanızı öneririz."
    if (plan.region === 'merkez') return "Rotanızdaki yerlerin çoğu merkeze yakın. Dolmuş ve sahil yolu yürüyüş parkurlarını kullanarak rahatça gezebilirsiniz."
    return "Fethiye genelinde dolmuş seferleri oldukça düzenlidir, ancak daha fazla özgürlük için motosiklet veya araç kiralama iyi bir seçenek olabilir."
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-[#64ffda]/20 border-t-[#64ffda] rounded-full animate-spin" />
        <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Plan Yükleniyor...</p>
      </div>
    </div>
  )

  if (!plan) return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-black text-white uppercase italic">Plan Bulunamadı</h1>
        <button onClick={() => router.push('/')} className="px-8 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase text-xs tracking-widest">Ana Sayfaya Dön</button>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#64ffda]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <section className="relative pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Plan Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/5 pb-12">
            <div className="space-y-6">
              <button onClick={() => router.back()} className="flex items-center gap-2 text-[#64ffda] text-[10px] font-black uppercase tracking-widest hover:underline">
                <ChevronLeft className="w-4 h-4" /> Geri Dön
              </button>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[#64ffda] text-[10px] font-black uppercase tracking-widest">
                    Paylaşılan Rota
                  </div>
                  <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> Doğrulanmış Plan
                  </div>
                </div>
                <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
                  {plan.title}
                </h1>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10">
                      <Image 
                        src={plan.user_profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${plan.user_profiles?.username}`} 
                        alt="Avatar" fill className="object-cover"
                      />
                    </div>
                    <span className="text-white text-xs font-black uppercase tracking-widest">{plan.user_profiles?.username} tarafından</span>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                    <Calendar className="w-4 h-4" /> {new Date(plan.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button 
                onClick={sharePlan}
                className="flex-1 md:flex-none px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
              >
                <Share2 className="w-4 h-4" /> Paylaş
              </button>
              <button 
                onClick={() => router.push('/aktivite-planla')}
                className="flex-1 md:flex-none px-8 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#64ffda]/20 flex items-center justify-center gap-3"
              >
                <Sparkles className="w-4 h-4" /> Kendi Planını Yap
              </button>
            </div>
          </div>

          {/* Plan Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] flex items-center gap-6">
              <div className="w-14 h-14 bg-[#64ffda]/10 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#64ffda]" />
              </div>
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Bölge</p>
                <p className="text-white font-black uppercase italic">{plan.region}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] flex items-center gap-6">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                {plan.group_type === 'couple' ? <Heart className="w-6 h-6 text-blue-500" /> : plan.group_type === 'single' ? <User className="w-6 h-6 text-blue-500" /> : <Users className="w-6 h-6 text-blue-500" />}
              </div>
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Grup Tipi</p>
                <p className="text-white font-black uppercase italic">
                  {plan.group_type === 'couple' ? 'Çift' : plan.group_type === 'single' ? 'Yalnız' : 'Grup'}
                </p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] flex items-center gap-6">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                <Navigation className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Toplam Nokta</p>
                <p className="text-white font-black uppercase italic">
                  {plan.activities.reduce((acc: number, curr: any) => acc + curr.activities.length, 0)} Durak
                </p>
              </div>
            </div>
          </div>

          {/* Smart Tips Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="bg-white/5 border border-[#64ffda]/20 p-8 rounded-[40px] space-y-4">
              <div className="flex items-center gap-3 text-[#64ffda]">
                <Navigation className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Ulaşım İpucu</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{getTransportTip()}</p>
            </div>
            <div className="bg-white/5 border border-blue-500/20 p-8 rounded-[40px] space-y-4">
              <div className="flex items-center gap-3 text-blue-400">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Gastronomi Tavsiyesi</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Bu rota üzerindeki duraklarda acıktığınızda yerel balık pazarlarını veya sahil restoranlarını deneyebilirsiniz. 
                Fethiye360 işletmeler rehberine göz atmayı unutmayın!
              </p>
            </div>
          </div>

          {/* Itinerary Steps */}
          <div className="space-y-24">
            {plan.activities.map((day: any) => (
              <div key={day.day} className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="px-8 py-2 bg-[#64ffda] text-[#0a192f] rounded-full font-black uppercase tracking-widest text-[10px]">GÜN {day.day}</div>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {day.activities.map((act: any, i: number) => (
                    <div key={i} className="group bg-white/5 border border-white/5 rounded-[40px] overflow-hidden hover:bg-white/10 transition-all border-b-4 border-b-[#64ffda]/20">
                      <div className="relative h-64 w-full">
                        <Image src={act.image} alt={act.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[8px] text-white font-black uppercase tracking-widest">
                          {act.category}
                        </div>
                      </div>
                      <div className="p-8 space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[#64ffda] text-[9px] font-black uppercase tracking-widest">
                            <MapPin className="w-3 h-3" /> {act.location}
                          </div>
                          <h4 className="text-2xl font-black text-white uppercase italic leading-tight tracking-tighter">{act.title}</h4>
                          <p className="text-slate-400 text-sm leading-relaxed font-medium">"{act.description}"</p>
                        </div>

                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.title + ' Fethiye')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-[#64ffda] transition-all group/btn"
                        >
                          Yol Tarifi Al <Navigation className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
