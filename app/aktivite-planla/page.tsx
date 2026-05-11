'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { 
  Sparkles, 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  User,
  ChevronRight, 
  CheckCircle2, 
  Share2, 
  Download,
  Clock,
  Navigation,
  Camera,
  Heart,
  Save,
  Trash2,
  Share
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { REGIONS, REGION_PLANS, BUCKET_LIST, DayPlan } from '@/lib/planner-data'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ActivityPlannerPage() {
  const [step, setStep] = useState(1)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [groupType, setGroupType] = useState('couple')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [plan, setPlan] = useState<DayPlan[]>([])
  const [bucketList, setBucketList] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const generatePlan = () => {
    if (!selectedRegion) return
    setLoading(true)
    // Simulate smart generation
    setTimeout(() => {
      setPlan(REGION_PLANS[selectedRegion] || REGION_PLANS['merkez'])
      setStep(3)
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1500)
  }

  const toggleBucketItem = (id: string) => {
    setBucketList(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const savePlan = async () => {
    if (!user) {
      toast.error('Planı kaydetmek için giriş yapmalısınız.')
      return
    }

    const { error } = await supabase.from('user_itineraries').insert([{
      user_id: user.id,
      title: `${REGIONS.find(r => r.id === selectedRegion)?.name} Tatilim`,
      region: selectedRegion,
      group_type: groupType,
      start_date: startDate,
      end_date: endDate,
      items: plan
    }])

    if (error) {
      toast.error('Plan kaydedilemedi.')
    } else {
      toast.success('Tatil planınız profilinize kaydedildi! 🚀')
    }
  }

  const sharePlan = () => {
    const text = `Fethiye Tatil Planım Hazır! 🌴\nBölge: ${selectedRegion}\nPlanı görmek için Fethiye360'ı ziyaret et!`
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
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl animate-in fade-in duration-700">
              <Sparkles className="w-4 h-4 text-[#64ffda]" />
              <span className="text-white text-xs font-black uppercase tracking-[0.3em]">Smart Planner</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
              Aktivite <span className="text-[#64ffda]">Planla</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium italic">
              Fethiye'deki tatilinizi saniyeler içinde kişiselleştirin. Size özel rotalar, lezzet durakları ve maceralar.
            </p>
          </div>

          {/* Wizard Steps */}
          {step === 1 && (
            <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
              <div className="text-center">
                <h2 className="text-3xl font-black text-white uppercase italic">1. Nerede Konaklıyorsunuz?</h2>
                <p className="text-slate-500 mt-2">Size en yakın aktiviteleri önerebilmemiz için bölge seçin.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {REGIONS.map((region) => (
                  <button 
                    key={region.id}
                    onClick={() => { setSelectedRegion(region.id); setStep(2); }}
                    className="group relative aspect-[4/5] rounded-[40px] overflow-hidden border border-white/10 hover:border-[#64ffda]/50 transition-all shadow-2xl"
                  >
                    <Image src={region.image} alt={region.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                      <span className="text-white font-black uppercase tracking-widest text-sm group-hover:text-[#64ffda] transition-colors">{region.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 p-12 rounded-[60px] space-y-12 animate-in slide-in-from-bottom-8 duration-700 shadow-2xl backdrop-blur-xl">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-white uppercase italic">2. Tatil Detaylarınız</h2>
                <p className="text-slate-500">Kiminle ve ne zaman tatile çıkıyorsunuz?</p>
              </div>

              <div className="space-y-8">
                {/* Group Type */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'single', label: 'Yalnızım', icon: User },
                    { id: 'couple', label: 'Çiftiz', icon: Heart },
                    { id: 'group', label: 'Grubuz', icon: Users },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setGroupType(item.id)}
                      className={`p-6 rounded-[32px] border transition-all flex flex-col items-center gap-3 ${
                        groupType === item.id 
                          ? 'bg-[#64ffda] border-[#64ffda] text-[#0a192f]' 
                          : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <item.icon className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Giriş</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white focus:ring-1 focus:ring-[#64ffda] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Çıkış</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white focus:ring-1 focus:ring-[#64ffda] outline-none"
                    />
                  </div>
                </div>

                <button 
                  onClick={generatePlan}
                  disabled={loading}
                  className="w-full py-6 bg-[#64ffda] text-[#0a192f] rounded-[32px] font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all shadow-xl shadow-[#64ffda]/20 flex items-center justify-center gap-3"
                >
                  {loading ? 'Planınız Hazırlanıyor...' : <><Sparkles className="w-4 h-4" /> Planımı Oluştur</>}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-20 animate-in fade-in duration-1000">
              {/* Plan Results */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-12">
                <div className="text-left space-y-2">
                  <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Size Özel <span className="text-[#64ffda]">Fethiye Tatili</span></h2>
                  <p className="text-slate-500 font-medium italic">Seçilen Bölge: {REGIONS.find(r => r.id === selectedRegion)?.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={savePlan} className="flex items-center gap-2 px-8 py-4 bg-white/5 text-white rounded-2xl border border-white/10 hover:bg-white/10 transition-all font-black uppercase text-[10px] tracking-widest">
                    <Save className="w-4 h-4 text-[#64ffda]" /> Kaydet
                  </button>
                  <button onClick={sharePlan} className="flex items-center gap-2 px-8 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest shadow-xl shadow-[#64ffda]/20">
                    <Share2 className="w-4 h-4" /> Paylaş
                  </button>
                </div>
              </div>

              {/* Timeline View */}
              <div className="space-y-24">
                {plan.map((day) => (
                  <div key={day.day} className="relative space-y-12">
                    <div className="sticky top-32 z-20 flex items-center gap-4">
                      <div className="px-8 py-3 bg-[#64ffda] text-[#0a192f] rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg">
                        GÜN {day.day}
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-[#64ffda]/50 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 gap-12 ml-4 border-l-2 border-[#64ffda]/10 pl-12 pb-12">
                      {day.activities.map((act, i) => (
                        <div key={i} className="group relative bg-white/5 border border-white/5 rounded-[48px] p-8 md:p-12 flex flex-col md:flex-row gap-10 hover:bg-white/10 transition-all duration-500">
                          <div className="relative w-full md:w-[300px] aspect-video md:aspect-square rounded-[32px] overflow-hidden shrink-0 shadow-2xl">
                            <Image src={act.image} alt={act.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[9px] text-white font-black uppercase tracking-widest">
                              {act.type}
                            </div>
                          </div>
                          <div className="space-y-6 py-4 flex-1">
                            <div className="flex items-center gap-2 text-[#64ffda] font-black uppercase tracking-[0.2em] text-[10px]">
                              <Clock className="w-3 h-3" /> {act.time}
                            </div>
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{act.title}</h3>
                            <p className="text-slate-400 text-lg leading-relaxed font-medium">{act.description}</p>
                            <div className="pt-4">
                              <button className="flex items-center gap-2 text-white/40 hover:text-[#64ffda] transition-colors text-[10px] font-black uppercase tracking-widest group/btn">
                                Detayları Gör <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bucket List Section */}
              <div className="pt-32 space-y-16 border-t border-white/5">
                <div className="text-center space-y-4">
                  <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Konum Bağımsız <span className="text-[#64ffda]">Fethiye Klasikleri</span></h2>
                  <p className="text-slate-500 font-medium italic">Fethiye'de yapmadan dönmemeniz gereken en popüler deneyimler.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {BUCKET_LIST.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => toggleBucketItem(item.id)}
                      className={`group relative p-8 rounded-[48px] border transition-all cursor-pointer ${
                        bucketList.includes(item.id) 
                          ? 'bg-[#64ffda]/10 border-[#64ffda] shadow-[0_0_30px_rgba(100,255,218,0.1)]' 
                          : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-white/5">
                          <Image src={item.image} alt={item.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h4 className={`font-bold text-lg leading-tight transition-colors ${
                            bucketList.includes(item.id) ? 'text-[#64ffda]' : 'text-white'
                          }`}>{item.title}</h4>
                          <div className="flex items-center gap-2">
                            {bucketList.includes(item.id) ? (
                              <span className="flex items-center gap-1 text-[9px] font-black text-[#64ffda] uppercase tracking-widest">
                                <CheckCircle2 className="w-3 h-3" /> YAPILDI
                              </span>
                            ) : (
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">YAPILMADI</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center pt-20">
                <button onClick={() => setStep(1)} className="text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                  Yeniden Planla
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  )
}
