'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { 
  Sparkles, 
  MapPin, 
  Users, 
  User,
  ChevronRight, 
  CheckCircle2, 
  Share2, 
  Clock,
  Heart,
  Save,
  Plus,
  Trash2,
  Calendar,
  X,
  Compass,
  Zap,
  Coffee,
  Gem
} from 'lucide-react'
import Image from 'next/image'
import { ALL_ACTIVITIES, REGIONS, ActivityItem } from '@/lib/planner-data'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ActivityPlannerPage() {
  const [step, setStep] = useState(1)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState('merkez')
  const [groupType, setGroupType] = useState('couple')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [finalPlan, setFinalPlan] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const toggleActivity = (id: string) => {
    setSelectedActivities(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const generatePlan = () => {
    if (selectedActivities.length === 0) {
      toast.error('Lütfen en az bir aktivite seçin.')
      return
    }
    setLoading(true)
    
    // Smart grouping logic
    const selectedData = ALL_ACTIVITIES.filter(a => selectedActivities.includes(a.id))
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
      setStep(3)
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1200)
  }

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'adrenalin': return <Zap className="w-4 h-4" />
      case 'lezzet': return <Coffee className="w-4 h-4" />
      case 'kultur': return <Gem className="w-4 h-4" />
      case 'huzur': return <Compass className="w-4 h-4" />
      default: return <Sparkles className="w-4 h-4" />
    }
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
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
              <Sparkles className="w-4 h-4 text-[#64ffda]" />
              <span className="text-white text-xs font-black uppercase tracking-[0.3em]">Bana Özel Fethiye</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
              Tatilini <span className="text-[#64ffda]">Tasarla</span>
            </h1>
          </div>

          {/* STEP 1: ACTIVITY SELECTION */}
          {step === 1 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-8">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">1. Deneyimlerini Seç</h2>
                  <p className="text-slate-500 mt-2 font-medium">Fethiye'de yapmak istediklerini işaretle, senin için planlayalım.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-6 py-3 bg-white/5 rounded-full border border-white/10 text-[#64ffda] font-black text-xs tracking-widest uppercase">
                    {selectedActivities.length} SEÇİLDİ
                  </div>
                  <button 
                    onClick={() => setStep(2)}
                    disabled={selectedActivities.length === 0}
                    className="px-10 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-[#64ffda]/20 disabled:opacity-50 disabled:scale-100"
                  >
                    Devam Et <ChevronRight className="inline-block ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ALL_ACTIVITIES.map((activity) => (
                  <div 
                    key={activity.id}
                    onClick={() => toggleActivity(activity.id)}
                    className={`group relative h-[350px] rounded-[40px] overflow-hidden border transition-all cursor-pointer ${
                      selectedActivities.includes(activity.id) 
                        ? 'border-[#64ffda] ring-4 ring-[#64ffda]/20' 
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

                    <div className="absolute bottom-6 left-6 right-6 space-y-2">
                      <div className="flex items-center gap-2 text-[#64ffda] text-[9px] font-black uppercase tracking-widest">
                        {getCategoryIcon(activity.category)} {activity.category}
                      </div>
                      <h3 className="text-xl font-black text-white uppercase italic leading-tight">{activity.title}</h3>
                      <p className="text-slate-400 text-xs line-clamp-1">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: REGION & DETAILS */}
          {step === 2 && (
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center">
                <button onClick={() => setStep(1)} className="text-[#64ffda] text-[10px] font-black uppercase tracking-widest mb-4 hover:underline">← Seçime Geri Dön</button>
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">2. Son Dokunuşlar</h2>
                <p className="text-slate-500">Konaklama ve grup detaylarını belirle.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/5 border border-white/10 p-12 rounded-[60px] backdrop-blur-xl">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#64ffda] uppercase tracking-widest ml-2">Nerede Kalıyorsunuz?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {REGIONS.map(r => (
                        <button 
                          key={r.id}
                          onClick={() => setSelectedRegion(r.id)}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            selectedRegion === r.id ? 'bg-[#64ffda] border-[#64ffda] text-[#0a192f]' : 'bg-white/5 border-white/5 text-white hover:border-white/20'
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-tighter">{r.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8 border-l border-white/5 md:pl-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#64ffda] uppercase tracking-widest ml-2">Grup Tipi</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'single', label: 'Yalnız', icon: User },
                        { id: 'couple', label: 'Çift', icon: Heart },
                        { id: 'group', label: 'Grup', icon: Users },
                      ].map(g => (
                        <button 
                          key={g.id}
                          onClick={() => setGroupType(g.id)}
                          className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                            groupType === g.id ? 'bg-[#64ffda] border-[#64ffda] text-[#0a192f]' : 'bg-white/5 border-white/5 text-white hover:border-white/20'
                          }`}
                        >
                          <g.icon className="w-4 h-4" />
                          <span className="text-[9px] font-black uppercase tracking-tighter">{g.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <button 
                      onClick={generatePlan}
                      disabled={loading}
                      className="w-full py-6 bg-[#64ffda] text-[#0a192f] rounded-[32px] font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-2xl shadow-[#64ffda]/30 flex items-center justify-center gap-3"
                    >
                      {loading ? 'Planlanıyor...' : 'TATİLİMİ OLUŞTUR'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FINAL PLAN */}
          {step === 3 && (
            <div className="space-y-16 animate-in fade-in duration-1000">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-12">
                <div className="text-left space-y-2">
                  <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">İşte Senin <span className="text-[#64ffda]">Fethiye Planın</span></h2>
                  <p className="text-slate-500 font-medium italic">Seçtiğin deneyimlere göre optimize edilmiş rota.</p>
                </div>
                <button onClick={() => setStep(1)} className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10">Yeni Plan Yap</button>
              </div>

              <div className="space-y-24">
                {finalPlan.map((day) => (
                  <div key={day.day} className="space-y-10">
                    <div className="flex items-center gap-4">
                      <div className="px-8 py-2 bg-[#64ffda] text-[#0a192f] rounded-full font-black uppercase tracking-widest text-[10px]">GÜN {day.day}</div>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {day.activities.map((act: any, i: number) => (
                        <div key={i} className="group bg-white/5 border border-white/5 rounded-[40px] overflow-hidden hover:bg-white/10 transition-all">
                          <div className="relative h-48 w-full">
                            <Image src={act.image} alt={act.title} fill className="object-cover" />
                          </div>
                          <div className="p-8 space-y-4">
                            <div className="flex items-center gap-2 text-[#64ffda] text-[9px] font-black uppercase tracking-widest">
                              <MapPin className="w-3 h-3" /> {act.location}
                            </div>
                            <h4 className="text-xl font-black text-white uppercase italic leading-tight">{act.title}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">{act.description}</p>
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
