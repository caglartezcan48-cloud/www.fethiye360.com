'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, CheckCircle2, AlertCircle, Database } from 'lucide-react'

export default function BulkUploadPage() {
  const [data, setData] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleUpload = async () => {
    try {
      setStatus('loading')
      const jsonData = JSON.parse(data)

      if (!Array.isArray(jsonData)) {
        throw new Error('Veri bir dizi (array) formatında olmalıdır.')
      }

      const { error } = await supabase
        .from('businesses')
        .insert(jsonData)

      if (error) throw error

      setStatus('success')
      setMessage(`${jsonData.length} işletme başarıyla yüklendi!`)
      setData('')
    } catch (err: any) {
      console.error(err)
      setStatus('error')
      setMessage(err.message || 'Yükleme sırasında bir hata oluştu.')
    }
  }

  const copyTemplate = () => {
    const template = [
      {
        "name": "İşletme Adı Girin",
        "slug": "isletme-adi-girin",
        "address": "Adres Bilgisi",
        "phone": "0252 ...",
        "category_id": "KATEGORI_UUID_BURAYA"
      }
    ]
    setData(JSON.stringify(template, null, 2))
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Toplu İşletme Yükle</h1>
            <p className="text-muted-foreground text-sm">JSON formatında verileri sisteme aktarın.</p>
          </div>
        </div>
        <button 
          onClick={copyTemplate}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-xs font-bold hover:bg-secondary/80 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Örnek Taslağı Getir
        </button>
      </div>

      <div className="bg-card border rounded-3xl p-8 shadow-sm">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">JSON Verisi</label>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder='[{"name": "Örnek Restoran", "slug": "ornek-restoran", "category_id": "..."}, ...]'
            className="w-full h-64 p-4 rounded-2xl bg-muted/50 border-none focus:ring-2 focus:ring-primary font-mono text-xs"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            * Verilerin veritabanı şemasına uygun olduğundan emin olun.
          </div>
          <button
            onClick={handleUpload}
            disabled={status === 'loading' || !data}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            {status === 'loading' ? 'Yükleniyor...' : (
              <>
                <Upload className="w-4 h-4" />
                Sisteme Aktar
              </>
            )}
          </button>
        </div>

        {status === 'success' && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            {message}
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {message}
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
          <h3 className="font-bold text-sm mb-2 text-blue-600">İpucu: JSON Formatı</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Excel verilerinizi "Excel to JSON" araçlarıyla dönüştürüp buraya yapıştırabilirsiniz. Her işletmenin mutlaka benzersiz bir "slug"ı olmalıdır.
          </p>
        </div>
        <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
          <h3 className="font-bold text-sm mb-2 text-amber-600">Önemli</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Yükleme yapmadan önce kategori ID'lerinin doğruluğunu kontrol edin. Yanlış ID'ler yüklemenin başarısız olmasına sebep olabilir.
          </p>
        </div>
      </div>
    </div>
  )
}
