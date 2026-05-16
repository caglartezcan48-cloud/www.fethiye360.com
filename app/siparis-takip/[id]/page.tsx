'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/fethiye/header'
import { Footer } from '@/components/fethiye/footer'
import { 
  CheckCircle2, 
  Clock, 
  Bike, 
  Package, 
  ChefHat, 
  MapPin, 
  Phone,
  MessageCircle,
  ChevronRight,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

const supabase = createClient()

type OrderStatus = 'pending' | 'preparing' | 'on_the_way' | 'completed' | 'cancelled'

interface Order {
  id: string
  status: OrderStatus
  customer_name: string
  total_amount: number
  items: any[]
  payment_method: string
  created_at: string
  businesses: {
    name: string
    phone: string
    address: string
  }
}

export default function OrderTrackingPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('business_orders')
        .select('*, businesses(name, phone, address)')
        .eq('id', id)
        .single()

      if (!error && data) {
        setOrder(data)
      }
      setLoading(false)
    }

    fetchOrder()

    // Realtime subscription for status updates
    const channel = supabase
      .channel(`order-${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'business_orders', filter: `id=eq.${id}` },
        (payload) => {
          setOrder(prev => prev ? { ...prev, status: payload.new.status } : null)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-[#64ffda] animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sipariş Bilgileri Yükleniyor...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">Sipariş Bulunamadı</h1>
        <p className="text-slate-400 mb-8 max-w-xs mx-auto">Girdiğiniz sipariş numarası geçerli değil veya silinmiş olabilir.</p>
        <Link href="/" className="px-8 py-3 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest text-xs">Anasayfaya Dön</Link>
      </div>
    )
  }

  const steps = [
    { id: 'pending', label: 'Sipariş Alındı', icon: Package, description: 'İşletme siparişinizi onayladı.' },
    { id: 'preparing', label: 'Hazırlanıyor', icon: ChefHat, description: 'Şefiniz siparişinizi özenle hazırlıyor.' },
    { id: 'on_the_way', label: 'Yola Çıktı', icon: Bike, description: 'Kuryemiz kapınıza doğru yola çıktı.' },
    { id: 'completed', label: 'Teslim Edildi', icon: CheckCircle2, description: 'Afiyet olsun! Siparişiniz teslim edildi.' },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === order.status)
  const isCancelled = order.status === 'cancelled'

  return (
    <main className="min-h-screen bg-[#0a192f] selection:bg-[#64ffda]/30">
      <Header />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-[#64ffda] text-[10px] font-black uppercase tracking-[0.3em] mb-4 hover:gap-4 transition-all">
                <ArrowLeft className="w-3 h-3" /> Geri Dön
              </Link>
              <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">
                SİPARİŞ <span className="text-[#64ffda]">TAKİBİ</span>
              </h1>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Sipariş No: #{order.id.slice(0, 8)}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Tahmini Teslimat</p>
              <p className="text-white font-black text-2xl italic tracking-tighter">25-35 DK</p>
            </div>
          </div>

          {isCancelled ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-[40px] p-10 text-center mb-12">
               <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <X className="w-8 h-8 text-red-500" />
               </div>
               <h3 className="text-xl font-black text-white uppercase italic mb-2">Sipariş İptal Edildi</h3>
               <p className="text-slate-400 text-sm italic">Maalesef siparişiniz işletme tarafından iptal edildi. Bilgi için işletme ile iletişime geçebilirsiniz.</p>
            </div>
          ) : (
            /* Progress Stepper */
            <div className="bg-[#112240] border border-white/5 rounded-[48px] p-8 md:p-12 mb-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#64ffda]/5 rounded-full blur-[80px] -z-10" />
              
              <div className="relative space-y-12">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = index <= currentStepIndex
                  const isCurrent = index === currentStepIndex
                  const isLast = index === steps.length - 1

                  return (
                    <div key={step.id} className="relative flex items-start gap-6 group">
                      {/* Line */}
                      {!isLast && (
                        <div className={`absolute left-7 top-14 w-[2px] h-12 transition-colors duration-1000 ${
                          index < currentStepIndex ? 'bg-[#64ffda]' : 'bg-white/5'
                        }`} />
                      )}

                      {/* Icon Circle */}
                      <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                        isActive 
                          ? 'bg-[#64ffda] border-[#64ffda] text-[#0a192f] shadow-[0_0_20px_rgba(100,255,218,0.3)]' 
                          : 'bg-[#0a192f] border-white/10 text-slate-600'
                      } ${isCurrent ? 'scale-110' : ''}`}>
                        <Icon className={`w-6 h-6 ${isCurrent ? 'animate-pulse' : ''}`} />
                        {isActive && index < currentStepIndex && (
                          <div className="absolute -right-1 -top-1 w-5 h-5 bg-[#0a192f] border border-[#64ffda] rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-[#64ffda]" />
                          </div>
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 pt-1">
                        <h3 className={`font-black uppercase tracking-widest text-sm mb-1 transition-colors duration-500 ${
                          isActive ? 'text-white' : 'text-slate-600'
                        }`}>
                          {step.label}
                        </h3>
                        <p className={`text-[10px] font-medium leading-relaxed italic transition-colors duration-500 ${
                          isActive ? 'text-slate-400' : 'text-slate-700'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Order Details & Business Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Info */}
            <div className="bg-[#112240] border border-white/5 rounded-[40px] p-8 space-y-6">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">İŞLETME BİLGİLERİ</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#64ffda]/10 rounded-2xl flex items-center justify-center text-[#64ffda] font-black text-xl">
                  {order.businesses.name[0]}
                </div>
                <div>
                  <p className="text-white font-black uppercase italic">{order.businesses.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Fethiye / Merkez</p>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/5">
                <a href={`tel:${order.businesses.phone}`} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 group">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#64ffda]" />
                    <span className="text-xs text-white font-bold uppercase tracking-widest">İşletmeyi Ara</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </a>
                <button className="w-full flex items-center justify-center gap-3 p-4 bg-[#25D366]/10 text-[#25D366] rounded-2xl border border-[#25D366]/20 font-black uppercase tracking-widest text-[10px] hover:bg-[#25D366]/20 transition-all">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Destek
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-[#112240] border border-white/5 rounded-[40px] p-8 space-y-6">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">SİPARİŞ ÖZETİ</h4>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-[#64ffda] bg-[#64ffda]/10 w-6 h-6 rounded flex items-center justify-center">{item.quantity}x</span>
                      <span className="text-xs text-white font-bold uppercase truncate max-w-[120px]">{item.name}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-black italic">{item.price * item.quantity} TL</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Toplam Ödeme</p>
                  <p className="text-white font-bold text-xs uppercase tracking-widest mt-1">{order.payment_method}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#64ffda] text-3xl font-black italic tracking-tighter">{order.total_amount} TL</p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Footer */}
          <p className="text-center text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] mt-12">
            Sorun mu yaşıyorsunuz? <Link href="/destek" className="text-[#64ffda] hover:underline">Yardım Alın</Link>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
