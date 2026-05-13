'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Package, 
  Filter, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShoppingBag,
  Building2,
  Tag,
  DollarSign
} from 'lucide-react'

interface Business {
  id: string
  name: string
}

interface Product {
  id: string
  business_id: string
  name: string
  price: number
  description: string | null
  category: string | null
  image_url: string | null
  businesses?: { name: string }
}

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedBusiness, setSelectedBusiness] = useState<string>('all')
  const [seeding, setSeeding] = useState(false)
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    business_id: '',
    name: '',
    price: '',
    description: '',
    category: '',
    image_url: ''
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [productsRes, businessesRes] = await Promise.all([
        supabase.from('business_products').select('*, businesses(name)').order('created_at', { ascending: false }),
        supabase.from('businesses').select('id, name').order('name')
      ])

      if (productsRes.error) throw productsRes.error
      if (businessesRes.error) throw businessesRes.error

      setProducts(productsRes.data || [])
      setBusinesses(businessesRes.data || [])
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('loading')

    try {
      if (!formData.business_id || !formData.name || !formData.price) {
        throw new Error('Lütfen zorunlu alanları doldurun.')
      }

      const productData = {
        business_id: formData.business_id,
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description || null,
        category: formData.category || null,
        image_url: formData.image_url || null,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase.from('business_products').insert(productData)
      
      if (error) throw error

      setFormStatus('success')
      setMessage('Ürün başarıyla eklendi!')
      setFormData({ business_id: '', name: '', price: '', description: '', category: '', image_url: '' })
      fetchData()
      setTimeout(() => {
        setIsFormOpen(false)
        setFormStatus('idle')
      }, 2000)
    } catch (err: any) {
      setFormStatus('error')
      setMessage(err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    
    try {
      const { error } = await supabase.from('business_products').delete().eq('id', id)
      if (error) throw error
      fetchData()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleSeedMenus = async () => {
    if (!confirm('Paket servisi olan işletmelere örnek (dummy) menüler yüklenecek. Onaylıyor musunuz?')) return
    
    setSeeding(true)
    try {
      const res = await fetch('/api/seed-menus')
      const data = await res.json()
      
      if (data.success) {
        alert(data.message)
        fetchData()
      } else {
        alert('Hata: ' + data.error)
      }
    } catch (err: any) {
      alert('Yükleme sırasında hata oluştu.')
    } finally {
      setSeeding(false)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.businesses?.name?.toLowerCase().includes(search.toLowerCase())
    const matchesBusiness = selectedBusiness === 'all' || p.business_id === selectedBusiness
    return matchesSearch && matchesBusiness
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda] shadow-2xl shadow-[#64ffda]/5">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">Ürün Yönetimi</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">İşletme Menülerini Buradan Yönetin</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSeedMenus}
            disabled={seeding}
            className="flex items-center gap-2 px-6 py-4 bg-yellow-500/10 text-yellow-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-yellow-500/20 transition-all border border-yellow-500/20 disabled:opacity-50"
          >
            {seeding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Package className="w-5 h-5" />}
            Örnek Menüleri Yükle
          </button>

          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-3 px-8 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#64ffda]/10"
          >
            <Plus className="w-5 h-5" />
            Yeni Ürün Ekle
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#64ffda] transition-colors" />
          <input 
            type="text"
            placeholder="Ürün veya işletme ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-[#112240] border border-slate-700/50 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:border-[#64ffda]/50 transition-all font-medium text-sm"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select 
            value={selectedBusiness}
            onChange={(e) => setSelectedBusiness(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-[#112240] border border-slate-700/50 rounded-2xl text-white appearance-none focus:outline-none focus:border-[#64ffda]/50 transition-all font-medium text-sm"
          >
            <option value="all">Tüm İşletmeler</option>
            {businesses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#112240] border border-slate-700/50 rounded-[40px] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0a192f]/50 border-b border-slate-700/50">
              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ürün Bilgisi</th>
              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">İşletme</th>
              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Kategori</th>
              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Fiyat</th>
              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-20 text-center">
                  <Loader2 className="w-10 h-10 text-[#64ffda] animate-spin mx-auto mb-4 opacity-50" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Ürünler Yükleniyor...</p>
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-20 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Ürün Bulunamadı</p>
                </td>
              </tr>
            ) : filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0a192f] border border-slate-700/50 overflow-hidden flex items-center justify-center shrink-0">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-slate-700" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm tracking-tight">{p.name}</p>
                      <p className="text-slate-500 text-[10px] font-medium line-clamp-1 max-w-[200px] mt-0.5 italic">
                        {p.description || 'Açıklama girilmemiş'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/10">
                    {p.businesses?.name}
                  </span>
                </td>
                <td className="p-6">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider italic">
                    {p.category || 'Genel'}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <span className="text-[#64ffda] font-black text-lg italic tracking-tighter">
                    {p.price} <span className="text-[10px] opacity-60">TL</span>
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-3 bg-white/5 text-slate-400 hover:text-[#64ffda] hover:bg-[#64ffda]/10 rounded-xl transition-all">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="p-3 bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Yeni Ürün Formu */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0a192f]/80 backdrop-blur-md" onClick={() => setIsFormOpen(false)} />
          
          <div className="relative w-full max-w-xl bg-[#112240] border border-slate-700/50 rounded-[48px] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda]">
                  <Plus className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Yeni Ürün</h2>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <Trash2 className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <Building2 className="w-3 h-3" /> İşletme Seçin
                </label>
                <select 
                  required
                  value={formData.business_id}
                  onChange={(e) => setFormData({ ...formData, business_id: e.target.value })}
                  className="w-full px-6 py-4 bg-[#0a192f] border border-slate-700/50 rounded-2xl text-white focus:border-[#64ffda]/50 outline-none transition-all font-medium text-sm"
                >
                  <option value="">İşletme seçiniz...</option>
                  {businesses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    <Package className="w-3 h-3" /> Ürün Adı
                  </label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn: Adana Kebap"
                    className="w-full px-6 py-4 bg-[#0a192f] border border-slate-700/50 rounded-2xl text-white focus:border-[#64ffda]/50 outline-none transition-all font-medium text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    <DollarSign className="w-3 h-3" /> Fiyat (TL)
                  </label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Örn: 350.00"
                    className="w-full px-6 py-4 bg-[#0a192f] border border-slate-700/50 rounded-2xl text-white focus:border-[#64ffda]/50 outline-none transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    <Tag className="w-3 h-3" /> Kategori
                  </label>
                  <input 
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Örn: Ana Yemekler"
                    className="w-full px-6 py-4 bg-[#0a192f] border border-slate-700/50 rounded-2xl text-white focus:border-[#64ffda]/50 outline-none transition-all font-medium text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    <Search className="w-3 h-3" /> Görsel URL
                  </label>
                  <input 
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-6 py-4 bg-[#0a192f] border border-slate-700/50 rounded-2xl text-white focus:border-[#64ffda]/50 outline-none transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <Edit3 className="w-3 h-3" /> Ürün Açıklaması
                </label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ürün içeriği ve detayları..."
                  className="w-full px-6 py-4 bg-[#0a192f] border border-slate-700/50 rounded-2xl text-white focus:border-[#64ffda]/50 outline-none transition-all font-medium text-sm h-24 resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={formStatus === 'loading'}
                className="w-full py-5 bg-[#64ffda] text-[#0a192f] rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-[#64ffda]/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {formStatus === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                {formStatus === 'loading' ? 'KAYDEDİLİYOR...' : 'ÜRÜNÜ SİSTEME EKLE'}
              </button>

              {formStatus === 'success' && (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 text-green-500 rounded-2xl border border-green-500/10 font-bold text-xs justify-center animate-in slide-in-from-top-2">
                  <CheckCircle2 className="w-4 h-4" /> {message}
                </div>
              )}
              {formStatus === 'error' && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/10 font-bold text-xs justify-center animate-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4" /> {message}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
