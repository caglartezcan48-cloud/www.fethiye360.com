'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, CheckCircle2, AlertCircle, Database, Plus, FileText, Download, Loader2 } from 'lucide-react'

// Turkce Basliklar -> Veritabani Sutunlari Eslesmesi
const columnMap: { [key: string]: string } = {
  'İşletme Adı': 'name',
  'Şirket Ünvanı': 'company_title',
  'Kategori': 'category_name',
  'URL Uzantısı': 'slug',
  'Adres': 'address',
  'Telefon': 'phone',
  'Web Sitesi': 'website',
  'WhatsApp': 'whatsapp',
  'Açıklama': 'description',
  'Kapak Resmi URL': 'main_image',
  'Puan': 'rating',
  'Paket Servis (1/0)': 'has_delivery'
}

export default function BulkUploadPage() {
  const [data, setData] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      
      const delimiter = lines[0].includes(';') ? ';' : ','
      const headers = lines[0].split(delimiter).map(h => h.trim().replace(/[\uFEFF]/g, ''))
      
      const result = lines.slice(1).map(line => {
        const values = line.split(delimiter).map(v => v.trim())
        const obj: any = {}
        headers.forEach((header, index) => {
          const dbColumn = columnMap[header] || header
          obj[dbColumn] = values[index]
        })
        return obj
      }).filter(item => item.name)

      setData(JSON.stringify(result, null, 2))
      setStatus('idle')
      setMessage('Dosya başarıyla okundu. Kategoriler otomatik eşleştirilecek.')
    }
    reader.readAsText(file)
  }

  const downloadCSVTemplate = () => {
    const BOM = '\uFEFF'
    const headers = Object.keys(columnMap).join(';') + '\n'
    const sampleData = "Örnek Lezzet Durağı;Lezzet Gıda;Restoran;ornek-lezzet;Fethiye;02526140000;https://lezzet.com;905320000000;Harika bir yer;https://resim.jpg;5;1"
    const blob = new Blob([BOM + headers + sampleData], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fethiye360_isletme_sablonu.csv'
    a.click()
  }

  const handleUpload = async () => {
    try {
      setStatus('loading')
      const jsonData = JSON.parse(data)
      
      // 1. Benzersiz kategori isimlerini topla
      const categoryNames = Array.from(new Set(jsonData.map((item: any) => item.category_name).filter(Boolean))) as string[]
      
      // 2. Mevcut kategorileri cek veya yenilerini olustur
      const categoryMap: { [key: string]: string } = {}
      
      for (const catName of categoryNames) {
        // Ara
        let { data: existingCat } = await supabase
          .from('business_categories')
          .select('id')
          .ilike('name', catName)
          .single()
        
        if (existingCat) {
          categoryMap[catName.toLowerCase()] = existingCat.id
        } else {
          // Olustur
          const { data: newCat, error: catError } = await supabase
            .from('business_categories')
            .insert({ name: catName, slug: catName.toLowerCase().replace(/\s+/g, '-') })
            .select('id')
            .single()
          
          if (!catError && newCat) {
            categoryMap[catName.toLowerCase()] = newCat.id
          }
        }
      }

      // 3. Verileri veritabani formatina donustur
      const businessesToInsert = jsonData.map((item: any) => {
        const { category_name, has_delivery, ...rest } = item
        return {
          ...rest,
          category_id: categoryMap[category_name?.toLowerCase()] || null,
          slug: item.slug || item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          services: has_delivery === '1' ? ['Paket Servis'] : [],
          status: 'active',
          updated_at: new Date().toISOString()
        }
      })

      const { error } = await supabase.from('businesses').insert(businessesToInsert)
      if (error) throw error

      setStatus('success')
      setMessage(`${businessesToInsert.length} işletme ve kategorileri başarıyla kaydedildi!`)
      setData('')
    } catch (err: any) {
      console.error(err)
      setStatus('error')
      setMessage(err.message || 'Yükleme sırasında hata oluştu.')
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda]">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Toplu Kayıt Sistemi</h1>
            <p className="text-slate-400 text-sm">Türkçe şablon ile binlerce işletmeyi saniyeler içinde tanımlayın.</p>
          </div>
        </div>
        <button 
          onClick={downloadCSVTemplate}
          className="px-6 py-3 bg-[#64ffda] text-[#0a192f] rounded-2xl font-bold flex items-center gap-2 hover:bg-[#52e0c4] transition-all shadow-xl shadow-[#64ffda]/10"
        >
          <Download className="w-5 h-5" />
          Türkçe Şablonu İndir
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#112240] border-2 border-dashed border-slate-700 rounded-[40px] p-10 text-center hover:border-[#64ffda]/40 transition-all group">
            <FileText className="w-16 h-16 text-slate-700 mx-auto mb-6 group-hover:text-[#64ffda] transition-colors" />
            <h3 className="text-white font-bold mb-3">Excel Dosyanı Yükle</h3>
            <p className="text-xs text-slate-500 mb-8 leading-relaxed">İndirdiğin şablonu doldurduktan sonra buraya yükleyebilirsin.</p>
            <label className="cursor-pointer px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm block hover:bg-slate-700 transition-all">
              Dosya Seç
              <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
            </label>
          </div>

          <div className="bg-[#64ffda]/5 border border-[#64ffda]/10 rounded-[32px] p-6 space-y-4">
            <h4 className="text-[#64ffda] font-bold text-sm">Neden Türkçe Şablon?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Bu şablon sayesinde teknik terimlerle uğraşmadan, doğrudan Türkçe başlıklarla verilerinizi hazırlayabilirsiniz. Sistem verilerinizi otomatik olarak eşleştirir.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#112240] p-8 rounded-[40px] border border-slate-700/50">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-slate-500 font-bold text-xs uppercase tracking-widest">Yükleme Önizleme</h4>
              {data && <span className="text-[10px] bg-[#64ffda]/10 text-[#64ffda] px-3 py-1 rounded-full font-bold">{JSON.parse(data).length} İşletme Beklemede</span>}
            </div>

            <textarea
              readOnly
              value={data}
              placeholder="Dosya seçtiğinizde veriler burada görünecektir..."
              className="w-full h-[350px] bg-[#0a192f] border-none rounded-3xl p-6 text-slate-400 font-mono text-[10px] resize-none"
            />

            <button
              onClick={handleUpload}
              disabled={status === 'loading' || !data}
              className="w-full mt-8 py-5 bg-[#64ffda] text-[#0a192f] rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-[#64ffda]/10 disabled:opacity-50 transition-all hover:scale-[1.01]"
            >
              {status === 'loading' ? <><Loader2 className="w-6 h-6 animate-spin" /> Veriler Yazılıyor...</> : <><CheckCircle2 className="w-6 h-6" /> Kayıtları Tamamla</>}
            </button>

            {status === 'success' && <div className="mt-6 p-4 bg-green-500/10 text-green-500 rounded-2xl text-center text-sm font-bold">{message}</div>}
            {status === 'error' && <div className="mt-6 p-4 bg-red-500/10 text-red-500 rounded-2xl text-center text-sm font-bold">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
