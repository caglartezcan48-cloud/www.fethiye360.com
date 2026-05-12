'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { useRouter } from 'next/navigation'
import { 
  Sparkles, 
  MapPin, 
  Users, 
  User,
  ChevronRight, 
  CheckCircle2, 
  Share2, 
  Zap,
  Coffee,
  Waves,
  History,
  Navigation,
  Heart
} from 'lucide-react'
import Image from 'next/image'
import { ALL_ACTIVITIES, REGIONS } from '@/lib/planner-data'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ActivityPlannerPage() {
  const [step, setStep] = useState(1)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState('merkez')
  const [groupType, setGroupType] = useState('couple')
  const [finalPlan, setFinalPlan] = useState<any[]>([])
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const categories = [
    { id: 'all', label: 'HEPSİ', icon: Sparkles },
    { id: 'doga', label: 'DOĞA & MANZARA', icon: Waves },
    { id: 'tarih', label: 'TARİH & ANTİK', icon: History },
    { id: 'deneyim', label: 'AKTİVİTE & DENEYİM', icon: Zap },
    { id: 'sosyal', label: 'MERKEZ & SOSYAL', icon: Coffee },
    { id: 'yakin', label: 'YAKIN YERLER', icon: Navigation },
  ]

  const filteredActivities = activeTab === 'all' 
    ? ALL_ACTIVITIES 
    : ALL_ACTIVITIES.filter(a => a.category === activeTab)

  const toggleActivity = (id: string) => {
    setSelectedActivities(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedActivities(ALL_ACTIVITIES.map(a => a.id))
    setActiveTab('all')
  }

  const generatePlan = () => {
    if (selectedActivities.length === 0) {
      toast.error('Lütfen en az bir yer seçin.')
      return
    }
    setLoading(true)
    
    // Coğrafi Kümelendirme Haritası
    const clusterMap: { [key: string]: number } = {
      'Merkez': 1, 'Merkez Liman': 1, 'Fethiye': 1, 'Çalış': 1,
      'Ölüdeniz': 2, 'Babadağ': 2,
      'Kayaköy': 3,
      'Faralya': 4,
      'Seydikemer': 5, 'Yaka': 5,
      'Göcek': 6, 'Yanıklar': 6,
      'Antalya': 7, 'Kaş': 7, 'Kalkan': 7
    }

    // Akıllı Gruplama: Kümelere göre sırala ki yakın yerler aynı güne denk gelsin
    const selectedData = ALL_ACTIVITIES
      .filter(a => selectedActivities.includes(a.id))
      .sort((a, b) => {
        const clusterA = clusterMap[a.location] || 99
        const clusterB = clusterMap[b.location] || 99
        return clusterA - clusterB
      })

    const days = []
    const itemsPerDay = 3
    
    for (let i = 0; i < selectedData.length; i += itemsPerDay) {
      days.push({
        day: (i / itemsPerDay) + 1,
        activities: selectedData.slice(i, i + itemsPerDay)
      })
    }

    setTimeout(() => {
      setFinalPlan(days)
      setStep(2)
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 800)
  }

  const getTransportTip = () => {
    const locations = ALL_ACTIVITIES.filter(a => selectedActivities.includes(a.id)).map(a => a.location)
    const hasFarPlaces = locations.some(l => ['Faralya', 'Seydikemer', 'Antalya', 'Yaka'].includes(l))
    
    if (hasFarPlaces) return "Seçtiğiniz bazı noktalar merkeze uzak (Faralya, Seydikemer vb.). Bu rota için araç kiralamanızı veya şahsi aracınızı kullanmanızı öneririz."
    return "Fethiye genelinde dolmuş seferleri oldukça düzenlidir, ancak daha fazla özgürlük için motosiklet veya araç kiralama iyi bir seçenek olabilir."
  }

  const savePlan = async () => {
    if (!user) {
      toast.error('Planı kaydetmek için giriş yapmalısınız.')
      return
    }

    try {
      setIsSaving(true)
      const { error } = await supabase
        .from('user_itineraries')
        .insert([{
          user_id: user.id,
          title: `Fethiye Rotam (${new Date().toLocaleDateString('tr-TR')})`,
          activities: finalPlan,
          region: 'Genel',
          group_type: 'Genel'
        }])

      if (error) throw error

      setIsSaved(true)
      toast.success('Rotanız başarıyla profilinize kaydedildi! 🌴')
    } catch (error) {
      console.error(error)
      toast.error('Rota kaydedilirken bir hata oluştu.')
    } finally {
      setIsSaving(false)
    }
  }

  const shareWhatsApp = () => {
    const text = `Fethiye360 ile harika bir rota oluşturdum! 🌴\n\nSenin için ideal yerleri keşfet: ${window.location.origin}/aktivite-planla`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <main className="min-h-screen bg-[#0a192f] selection:bg-[#64ffda] selection:text-[#0a192f]">
      <Header />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#64ffda]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <section className="relative pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* STEP 1: SELECTION */}
          {step === 1 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Görmek İstediğin Yerleri Seç</h2>
                  <p className="text-slate-500 font-medium">Fethiye'nin tüm hazineleri burada. Gitmek istediklerini işaretle.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-6 py-3 bg-white/5 rounded-full border border-white/10 text-[#64ffda] font-black text-xs tracking-widest uppercase">
                    {selectedActivities.length} SEÇİLDİ
                  </div>
                  <button 
                    onClick={generatePlan}
                    disabled={selectedActivities.length === 0 || loading}
                    className="px-10 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-[#64ffda]/20 disabled:opacity-50 disabled:scale-100"
                  >
                    {loading ? 'Hazırlanıyor...' : 'ROTAMI OLUŞTUR'} <ChevronRight className="inline-block ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => cat.id === 'all' ? selectAll() : setActiveTab(cat.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full border whitespace-nowrap transition-all text-[10px] font-black tracking-widest uppercase ${
                      activeTab === cat.id 
                        ? 'bg-[#64ffda] border-[#64ffda] text-[#0a192f]' 
                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" /> {cat.label}
                  </button>
                ))}
              </div>

              {/* Activities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredActivities.map((activity) => (
                  <div 
                    key={activity.id}
                    onClick={() => toggleActivity(activity.id)}
                    className={`group relative h-[320px] rounded-[40px] overflow-hidden border transition-all cursor-pointer ${
                      selectedActivities.includes(activity.id) 
                        ? 'border-[#64ffda] ring-4 ring-[#64ffda]/20 scale-95' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <Image src={activity.image} alt={activity.title} fill className={`object-cover transition-transform duration-700 group-hover:scale-110 ${selectedActivities.includes(activity.id) ? 'brightness-100' : 'brightness-50 group-hover:brightness-75'}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute top-4 left-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedActivities.includes(activity.id) 
                          ? 'bg-[#64ffda] border-[#64ffda] text-[#0a192f]' 
                          : 'bg-black/20 border-white/30 text-transparent'
                      }`}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </div>

                    {activity.isPopular && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500 rounded-full text-[8px] font-black text-[#0a192f] uppercase tracking-widest shadow-lg">
                        POPÜLER
                      </div>
                    )}

                    <div className="absolute bottom-6 left-6 right-6 space-y-1">
                      <div className="flex items-center gap-2 text-[#64ffda] text-[8px] font-black uppercase tracking-[0.2em]">
                        <MapPin className="w-3 h-3" /> {activity.location}
                      </div>
                      <h3 className="text-xl font-black text-white uppercase italic leading-tight tracking-tighter">{activity.title}</h3>
                      <p className="text-slate-400 text-[10px] line-clamp-1 font-medium italic">"{activity.description}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: RESULT */}
          {step === 2 && (
            <div className="space-y-16 animate-in fade-in duration-1000">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-12">
                <div className="text-left space-y-2">
                  <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Senin <span className="text-[#64ffda]">Fethiye Rotan</span></h2>
                  <p className="text-slate-500 font-medium italic">Seçtiğin {selectedActivities.length} özel nokta için en ideal sıralama.</p>
                </div>
                <div className="flex items-center gap-4">
                  {!isSaved ? (
                    <button 
                      onClick={savePlan}
                      disabled={isSaving}
                      className="px-8 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
                    >
                      {isSaving ? 'Kaydediliyor...' : <><CheckCircle2 className="w-4 h-4" /> Rotayı Kaydet</>}
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="px-8 py-4 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Kaydedildi
                    </button>
                  )}
                  <button onClick={shareWhatsApp} className="px-6 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Paylaş
                  </button>
                  <button onClick={() => {setStep(1); setIsSaved(false);}} className="px-6 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10">Yeni Rota</button>
                </div>
              </div>

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
                    <Coffee className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Gastronomi Tavsiyesi</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Bu rota üzerindeki duraklarda acıktığınızda yerel balık pazarlarını veya sahil restoranlarını deneyebilirsiniz. 
                    <button onClick={() => router.push('/isletmeler')} className="text-[#64ffda] ml-1 hover:underline">Restoranları Keşfet →</button>
                  </p>
                </div>
              </div>

              <div className="space-y-24">
                {finalPlan.map((day) => (
                  <div key={day.day} className="space-y-10">
                    <div className="flex items-center gap-4">
                      <div className="px-8 py-2 bg-[#64ffda] text-[#0a192f] rounded-full font-black uppercase tracking-widest text-[10px]">GÜN {day.day}</div>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {day.activities.map((act: any, i: number) => (
                        <div key={i} className="group bg-white/5 border border-white/5 rounded-[40px] overflow-hidden hover:bg-white/10 transition-all border-b-4 border-b-[#64ffda]/20">
                          <div className="relative h-56 w-full">
                            <Image src={act.image} alt={act.title} fill className="object-cover" />
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
          )}

        </div>
      </section>

      <Footer />
    </main>
  )
}
