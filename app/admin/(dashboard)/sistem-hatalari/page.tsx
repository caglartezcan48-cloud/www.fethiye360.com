'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  Clock, 
  User, 
  Globe, 
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  RefreshCcw,
  Bug
} from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'ERROR' | 'SECURITY' | 'WARNING'>('ALL')
  const [selectedLog, setSelectedLog] = useState<any>(null)
  const supabase = createClient()

  const fetchLogs = async () => {
    setLoading(true)
    let query = supabase
      .from('system_logs')
      .select('*, user_profiles:user_id(username, avatar_url)')
      .order('created_at', { ascending: false })

    if (filter !== 'ALL') {
      query = query.eq('type', filter)
    }

    const { data } = await query.limit(100)
    setLogs(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchLogs()
  }, [filter])

  const resolveLog = async (id: string) => {
    await supabase.from('system_logs').update({ is_resolved: true }).eq('id', id)
    fetchLogs()
  }

  const deleteLog = async (id: string) => {
    if (confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      await supabase.from('system_logs').delete().eq('id', id)
      fetchLogs()
    }
  }

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'ERROR': return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case 'SECURITY': return <ShieldAlert className="w-5 h-5 text-red-500" />
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default: return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
            <Bug className="w-10 h-10 text-[#64ffda]" />
            Hata Uyarı <span className="text-[#64ffda]">Sistemi</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Site sağlığı ve güvenlik girişimleri anlık raporlanıyor.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchLogs}
            className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all border border-white/5"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
            {['ALL', 'ERROR', 'SECURITY', 'WARNING'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-[#64ffda] text-[#0a192f]' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f === 'ALL' ? 'Tümü' : f === 'SECURITY' ? 'Güvenlik' : f === 'ERROR' ? 'Hata' : 'Uyarı'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Log List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white/5 rounded-[40px] border border-white/5">
              <RefreshCcw className="w-10 h-10 text-[#64ffda] animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[40px] border border-white/5 text-center">
              <CheckCircle2 className="w-16 h-16 text-[#64ffda] mb-4 opacity-20" />
              <h3 className="text-white font-bold">Harika! Hiç hata yok.</h3>
              <p className="text-slate-500 text-sm">Sisteminiz şu an tertemiz görünüyor.</p>
            </div>
          ) : (
            logs.map((log) => (
              <div 
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className={`group relative bg-white/5 border border-white/5 p-5 rounded-[32px] cursor-pointer transition-all hover:bg-white/10 hover:border-white/10 ${
                  selectedLog?.id === log.id ? 'ring-2 ring-[#64ffda] bg-white/10' : ''
                } ${log.is_resolved ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${
                      log.type === 'SECURITY' ? 'bg-red-500/10' : 
                      log.type === 'ERROR' ? 'bg-orange-500/10' : 'bg-blue-500/10'
                    }`}>
                      {getLogIcon(log.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          log.type === 'SECURITY' ? 'bg-red-500 text-white' : 
                          log.type === 'ERROR' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                        }`}>
                          {log.type}
                        </span>
                        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(log.created_at), 'HH:mm - dd MMM', { locale: tr })}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-sm leading-tight">{log.message}</h3>
                      <p className="text-slate-500 text-xs truncate max-w-md italic">{log.path || 'Bilinmeyen Sayfa'}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          {selectedLog ? (
            <div className="sticky top-24 bg-[#112240] border border-white/10 p-8 rounded-[40px] shadow-2xl space-y-6 animate-in slide-in-from-right duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-black uppercase tracking-widest text-xs">Rapor Detayı</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => resolveLog(selectedLog.id)}
                    className="p-2 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"
                    title="Çözüldü Olarak İşaretle"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteLog(selectedLog.id)}
                    className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    title="Kaydı Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kullanıcı Bilgisi</label>
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                    {selectedLog.user_profiles ? (
                      <>
                        <div className="w-8 h-8 rounded-lg bg-[#64ffda] overflow-hidden">
                          <img src={selectedLog.user_profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-white font-bold text-xs">{selectedLog.user_profiles.username}</span>
                      </>
                    ) : (
                      <>
                        <User className="w-5 h-5 text-slate-500" />
                        <span className="text-slate-500 font-bold text-xs italic">Anonim Kullanıcı</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Teknik Detaylar</label>
                  <div className="bg-[#0a192f] p-4 rounded-2xl border border-white/5 overflow-x-auto">
                    <pre className="text-[10px] text-[#64ffda] font-mono leading-relaxed">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">IP Adresi</span>
                    <span className="text-white font-mono">{selectedLog.details?.ip || 'Gizli'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Zaman Damgası</span>
                    <span className="text-white">{format(new Date(selectedLog.created_at), 'dd MMMM yyyy HH:mm:ss', { locale: tr })}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="sticky top-24 bg-white/5 border border-dashed border-white/10 p-12 rounded-[40px] text-center space-y-4">
              <Search className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-slate-500 text-xs font-medium italic">Detaylarını görmek için <br />listeden bir rapor seçin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
