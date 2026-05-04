'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, CheckCircle2, AlertCircle, Database, Plus, FileText, Download } from 'lucide-react'

export default function BulkUploadPage() {
  const [data, setData] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  // CSV Dosyasini Okuma ve JSON'a Cevirme
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim())
      
      const result = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const obj: any = {}
        headers.forEach((header, index) => {
          obj[header] = values[index]
        })
        return obj
      }).filter(item => item.name) // Bos satirlari temizle

      setData(JSON.stringify(result, null, 2))
      setStatus('idle')
      setMessage('Dosya başarıyla okundu. Aşağıdaki verileri kontrol edip "Sisteme Aktar" butonuna basabilirsiniz.')
    }
    reader.readAsText(file)
  }

  const handleUpload = async () => {
    try {
      setStatus('loading')
      const jsonData = JSON.parse(data)

      if (!Array.isArray(jsonData)) throw new Error('Veri dizi formatında olmalıdır.')

      // Supabase toplu yukleme (Chunking gerekebilir binlerce veri icin ama simdilik direkt gonderiyoruz)
      const { error } = await supabase.from('businesses').insert(jsonData)

      if (error) throw error

      setStatus('success')
      setMessage(`${jsonData.length} işletme başarıyla yüklendi!`)
      setData('')
    } catch (err: any) {
      console.error(err)
      setStatus('error')
      setMessage(err.message || 'Hata oluştu.')
    }
  }

  const copyTemplate = () => {
    const template = [{ "name": "Örnek", "slug": "ornek", "address": "Adres", "phone": "0252", "category_id": "ID" }]
    setData(JSON.stringify(template, null, 2))
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Akıllı Toplu Yükleme</h1>
            <p className="text-muted-foreground text-sm">CSV dosyası veya JSON ile binlerce işletmeyi anında ekleyin.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={copyTemplate} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:scale-105">
            <Plus className="w-4 h-4" /> JSON Taslağı
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon: Dosya Yukleme ve Talimatlar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border-2 border-dashed border-primary/20 rounded-[40px] p-8 text-center hover:border-primary/50 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <FileText className="w-12 h-12 text-primary/40 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold mb-2">CSV Dosyası Yükle</h3>
            <p className="text-xs text-muted-foreground mb-6">Excel listenizi .csv olarak kaydedip buraya bırakın.</p>
            <label className="cursor-pointer bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold text-sm inline-block shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              Dosya Seç
              <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
            </label>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 rounded-[32px] p-6">
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-blue-600">
              <Download className="w-4 h-4" /> CSV Formatı Nasıl Olmalı?
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Dosyanızın ilk satırı şu başlıkları içermelidir:<br/>
              <code className="bg-blue-500/10 p-1 rounded mt-2 block text-blue-700">name, slug, address, phone, category_id</code>
            </p>
          </div>
        </div>

        {/* Sag Kolon: Veri Onizleme ve Onay */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-[40px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Veri Önizleme</span>
              {data && (
                <span className="text-[10px] bg-green-500/10 text-green-600 px-3 py-1 rounded-full font-bold">
                  {JSON.parse(data).length} İşletme Hazır
                </span>
              )}
            </div>
            
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="Dosya seçtiğinizde veriler buraya dolacak veya JSON yapıştırabilirsiniz..."
              className="w-full h-[400px] p-6 rounded-[32px] bg-muted/30 border-none focus:ring-2 focus:ring-primary font-mono text-[10px] leading-relaxed resize-none"
            />

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={status === 'loading' || !data}
                className="px-12 py-4 bg-primary text-primary-foreground rounded-[24px] font-bold shadow-2xl shadow-primary/30 flex items-center gap-3 disabled:opacity-50 hover:scale-105 transition-all active:scale-95"
              >
                {status === 'loading' ? <><Loader2 className="w-5 h-5 animate-spin" /> Aktarılıyor...</> : <><Database className="w-5 h-5" /> Sisteme Aktar</>}
              </button>
            </div>

            {status === 'success' && (
              <div className="mt-6 p-5 bg-green-500/10 border border-green-500/20 text-green-600 rounded-3xl flex items-center gap-4 animate-in slide-in-from-bottom-2">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-bold text-sm">{message}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="mt-6 p-5 bg-destructive/10 border border-destructive/20 text-destructive rounded-3xl flex items-center gap-4">
                <AlertCircle className="w-6 h-6" />
                <span className="font-bold text-sm">{message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { Loader2 } from 'lucide-react'
