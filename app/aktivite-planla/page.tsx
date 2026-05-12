'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  Heart,
  CheckCircle
} from 'lucide-react'
import Image from 'next/image'
import { ALL_ACTIVITIES, REGIONS } from '@/lib/planner-data'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ReviewModal } from '@/components/rehber/review-modal'

const supabase = createClient()

export default function ActivityPlannerPage() {
  const [step, setStep] = useState(1)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState('merkez')
  const [groupType, setGroupType] = useState('couple')
  const [finalPlan, setFinalPlan] = useState<any[]>([])
  const [completedActivities, setCompletedActivities] = useState<string[]>([])
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [destinations, setDestinations] = useState<any[]>([])
  const [reviewTarget, setReviewTarget] = useState<{ id: string, title: string } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      setUser(authUser)

      const { data: dbData } = await supabase.from('destinations').select('*').eq('is_active', true)
      
      const merged = ALL_ACTIVITIES.map(activity => {
        const dbMatch = dbData?.find(d => d.slug === activity.id || d.title.toLowerCase() === activity.title.toLowerCase())
        return {
          ...activity,
          image: dbMatch?.main_image || activity.image
        }
      })
      setDestinations(merged)
    }
    fetchData()
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
    ? destinations 
    : destinations.filter(a => a.category === activeTab)

  const toggleActivity = (id: string) => {
    setSelectedActivities(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleComplete = (id: string) => {
    setCompletedActivities(prev => 
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
    
    const selectedData = destinations.filter(a => selectedActivities.includes(a.id))

    setTimeout(() => {
      setFinalPlan(selectedData)
      setStep(2)
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 800)
  }

  const savePlan = async () => {
    if (!user) {
      toast.info('Listenizi profilinize kaydetmek için lütfen giriş yapın.', { position: 'top-center' })
      setTimeout(() => router.push('/giris?returnTo=/aktivite-planla'), 1500)
      return
    }

    try {
      setIsSaving(true)
      const { error } = await supabase
        .from('user_itineraries')
        .insert([{
          user_id: user.id,
          title: `Fethiye Gezi Listem 🌴`,
          activities: finalPlan,
          type: 'bucket_list'
        }])

      if (error) throw error

      setIsSaved(true)
      toast.success('Listeniz profilinize eklendi! Gezdikçe işaretlemeyi unutmayın. ✅')
    } catch (error) {
      console.error(error)
      toast.error('Liste kaydedilirken bir hata oluştu.')
    } finally {
      setIsSaving(false)
    }
  }

  const shareWhatsApp = () => {
    if (!user) {
      toast.info('Listenizi paylaşmak için lütfen giriş yapın.', { position: 'top-center' })
      setTimeout(() => router.push('/giris?returnTo=/aktivite-planla'), 1500)
      return
    }
    const listText = finalPlan.map((act: any, i: number) => `${i+1}. ${act.title}`).join('\n')
    const text = `Fethiye'de gezeceğim yerleri belirledim! 🌴 İşte listem:\n\n${listText}\n\nSen de kendi listeni oluştur: ${window.location.origin}/aktivite-planla`
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
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Gezilecek Yerler Listeni Oluştur</h2>
                  <p className="text-slate-500 font-medium">Fethiye'de görmek istediğin yerleri seç, listeni oluştur.</p>
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
                    {loading ? 'Hazırlanıyor...' : 'LİSTEMİ OLUŞTUR'} <ChevronRight className="inline-block ml-2 w-4 h-4" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredActivities.map((activity) => (
                  <div 
                    key={activity.id}
                    onClick={() => toggleActivity(activity.id)}
                    className={`group relative bg-slate-900/50 rounded-[32px] overflow-hidden border transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                      selectedActivities.includes(activity.id) 
                        ? 'border-[#64ffda] ring-4 ring-[#64ffda]/20 shadow-2xl shadow-[#64ffda]/10' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={activity.image} 
                        alt={activity.title} 
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                          selectedActivities.includes(activity.id) ? 'brightness-100' : 'brightness-75 group-hover:brightness-90'
                        }`} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                      
                      <div className="absolute top-4 left-4 z-20">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedActivities.includes(activity.id) 
                            ? 'bg-[#64ffda] border-[#64ffda] text-[#0a192f]' 
                            : 'bg-black/40 border-white/30 text-white/40'
                        }`}>
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4">
                        <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[8px] font-black text-white uppercase tracking-widest">
                          {activity.category === 'tarih' ? 'TARİH' : activity.category === 'doga' ? 'DOĞA' : activity.category === 'deneyim' ? 'AKTİVİTE' : 'KÜLTÜREL'}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-white uppercase italic leading-tight tracking-tighter group-hover:text-[#64ffda] transition-colors">
                          {activity.title}
                        </h3>
                        <Link 
                          href={`/rehber/${activity.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#64ffda] opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        >
                          <Sparkles className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        <MapPin className="w-3 h-3 text-[#64ffda]" /> {activity.location}
                      </div>
                      <p className="text-slate-500 text-[10px] line-clamp-1 italic">"{activity.description}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: RESULT (BUCKET LIST) */}
          {step === 2 && (
            <div className="space-y-16 animate-in fade-in duration-1000">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-12">
                <div className="text-left space-y-2">
                  <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Fethiye <span className="text-[#64ffda]">Gezi Listem</span> 🌴</h2>
                  <p className="text-slate-500 font-medium italic">Gezdiğin yerleri işaretlemeyi ve listeni paylaşmayı unutma.</p>
                </div>
                <div className="flex items-center gap-4">
                  {!isSaved ? (
                    <button 
                      onClick={savePlan}
                      disabled={isSaving}
                      className="px-8 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
                    >
                      {isSaving ? 'Kaydediliyor...' : <><CheckCircle2 className="w-4 h-4" /> Profilime Kaydet</>}
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
                    <Share2 className="w-4 h-4" /> WhatsApp
                  </button>
                  <button onClick={() => {setStep(1); setIsSaved(false);}} className="px-6 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10">Yeni Liste</button>
                </div>
              </div>

              {/* Bucket List Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {finalPlan.map((act: any, i: number) => (
                  <div 
                    key={i} 
                    className={`group bg-slate-900/50 border rounded-[40px] overflow-hidden transition-all duration-500 ${
                      completedActivities.includes(act.id) 
                        ? 'border-emerald-500/50 opacity-60 scale-[0.98]' 
                        : 'border-white/5 hover:border-[#64ffda]/30'
                    }`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img 
                        src={act.image} 
                        alt={act.title} 
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                          completedActivities.includes(act.id) ? 'grayscale' : ''
                        }`} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                      
                      {/* Completion Checkmark Overlay */}
                      {completedActivities.includes(act.id) && (
                        <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[2px] flex items-center justify-center">
                          <div className="bg-emerald-500 text-white p-4 rounded-full shadow-2xl scale-125 animate-in zoom-in-50 duration-300">
                            <CheckCircle className="w-8 h-8" />
                          </div>
                        </div>
                      )}

                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[8px] text-white font-black uppercase tracking-widest">
                        {act.category}
                      </div>
                    </div>
                    
                    <div className="p-8 space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[#64ffda] text-[9px] font-black uppercase tracking-widest">
                          <MapPin className="w-3 h-3" /> {act.location}
                        </div>
                        <h4 className={`text-2xl font-black uppercase italic leading-tight tracking-tighter transition-all ${
                          completedActivities.includes(act.id) ? 'text-slate-500 line-through' : 'text-white'
                        }`}>
                          {act.title}
                        </h4>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-white/5 pt-6">
                        <button 
                          onClick={() => toggleComplete(act.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            completedActivities.includes(act.id)
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                          }`}
                        >
                          {completedActivities.includes(act.id) ? <><CheckCircle className="w-3 h-3" /> GEZDİM!</> : 'GEZDİM Mİ?'}
                        </button>
                        
                        {completedActivities.includes(act.id) && (
                          <button 
                            onClick={() => setReviewTarget({ id: act.id, title: act.title })}
                            className="flex items-center gap-2 px-4 py-2 bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#64ffda] hover:text-[#0a192f] transition-all"
                          >
                            <Sparkles className="w-3 h-3" /> Yorum Yap
                          </button>
                        )}

                        <Link 
                          href={`/rehber/${act.id}`}
                          className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#64ffda] hover:underline"
                        >
                          İncele →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reviewTarget && user && (
            <ReviewModal 
              isOpen={!!reviewTarget}
              onClose={() => setReviewTarget(null)}
              destinationId={reviewTarget.id}
              destinationTitle={reviewTarget.title}
              userId={user.id}
            />
          )}

        </div>
      </section>

      <Footer />
    </main>
  )
}
