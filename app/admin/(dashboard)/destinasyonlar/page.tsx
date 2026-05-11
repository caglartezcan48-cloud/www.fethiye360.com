'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Plus, 
  MapPin, 
  Image as ImageIcon, 
  Trash2, 
  Edit3, 
  Globe, 
  History, 
  Navigation,
  Loader2,
  Sparkles,
  Link as LinkIcon,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Gallery management state
  const [galleryItems, setGalleryItems] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Tarihi Yer',
    main_image: '',
    description: '',
    history: '',
    transportation: '',
    meta_title: '',
    meta_description: ''
  })

  const supabase = createClient()

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    setLoading(true)
    const { data } = await supabase.from('destinations').select('*').order('created_at', { ascending: false })
    setDestinations(data || [])
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const slug = formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    const payload = { ...formData, slug, gallery: galleryItems }

    if (editingId) {
      const { error } = await supabase.from('destinations').update(payload).eq('id', editingId)
      if (!error) toast.success('Güncellendi! ✅')
    } else {
      const { error } = await supabase.from('destinations').insert([payload])
      if (!error) toast.success('Eklendi! 🚀')
    }

    closeModal()
    fetchDestinations()
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setGalleryItems([])
    setFormData({
      title: '', slug: '', category: 'Tarihi Yer', main_image: '',
      description: '', history: '', transportation: '',
      meta_title: '', meta_description: ''
    })
  }

  const addGalleryItem = () => {
    setGalleryItems([...galleryItems, ''])
  }

  const removeGalleryItem = (index: number) => {
    const newItems = galleryItems.filter((_, i) => i !== index)
    setGalleryItems(newItems)
  }

  const updateGalleryItem = (index: number, value: string) => {
    const newItems = [...galleryItems]
    newItems[index] = value
    setGalleryItems(newItems)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bu yeri silmek istediğinize emin misiniz?')) {
      const { error } = await supabase.from('destinations').delete().eq('id', id)
      if (!error) {
        toast.success('Silindi')
        fetchDestinations()
      }
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
            <Sparkles className="w-10 h-10 text-[#64ffda]" />
            Gezi <span className="text-[#64ffda]">Rehberi</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Tarihi ve turistik yerleri yönetin, blog yazılarını güncelleyin.</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setIsModalOpen(true); }}
          className="flex items-center gap-3 px-8 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-[#64ffda]/20"
        >
          <Plus className="w-4 h-4" /> Yeni Yer Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <div key={dest.id} className="group bg-[#112240] border border-white/5 rounded-[32px] overflow-hidden hover:border-[#64ffda]/30 transition-all flex flex-col">
            <div className="relative h-48 w-full overflow-hidden">
              <Image src={dest.main_image} alt={dest.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 px-3 py-1 bg-[#64ffda] text-[#0a192f] text-[9px] font-black uppercase rounded-full tracking-widest">
                {dest.category}
              </div>
            </div>
            <div className="p-6 space-y-4 flex-1">
              <h3 className="text-white text-xl font-bold">{dest.title}</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">
                {dest.gallery?.length || 0} Fotoğraf
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setEditingId(dest.id)
                      setFormData(dest)
                      setGalleryItems(dest.gallery || [])
                      setIsModalOpen(true)
                    }}
                    className="p-3 bg-white/5 text-slate-400 hover:text-[#64ffda] hover:bg-[#64ffda]/10 rounded-xl transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(dest.id)}
                    className="p-3 bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Link href={`/rehber/${dest.slug}`} target="_blank" className="text-[10px] font-black text-[#64ffda] uppercase tracking-widest hover:underline">
                  Sayfayı Gör
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Edit/Add */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a192f]/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#112240] border border-white/10 rounded-[40px] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <form onSubmit={handleSave} className="p-10 space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                  {editingId ? 'Yeri Güncelle' : 'Yeni Yer Ekle'}
                </h2>
                <button type="button" onClick={closeModal} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Sol Kolon - Temel Bilgiler */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-[#64ffda] uppercase tracking-widest border-b border-white/5 pb-2">Temel Bilgiler</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Başlık</label>
                      <input 
                        required
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-[#0a192f] border border-white/10 rounded-2xl p-4 text-white focus:ring-1 focus:ring-[#64ffda] outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kategori</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-[#0a192f] border border-white/10 rounded-2xl p-4 text-white focus:ring-1 focus:ring-[#64ffda] outline-none appearance-none"
                      >
                        <option>Tarihi Yer</option>
                        <option>Plaj</option>
                        <option>Doğa</option>
                        <option>Kültürel</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ana Görsel URL</label>
                    <input 
                      required
                      value={formData.main_image}
                      onChange={e => setFormData({...formData, main_image: e.target.value})}
                      className="w-full bg-[#0a192f] border border-white/10 rounded-2xl p-4 text-white focus:ring-1 focus:ring-[#64ffda] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kısa Açıklama</label>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full bg-[#0a192f] border border-white/10 rounded-2xl p-4 text-white focus:ring-1 focus:ring-[#64ffda] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><History className="w-3 h-3"/> Tarihçe</label>
                    <textarea 
                      value={formData.history}
                      onChange={e => setFormData({...formData, history: e.target.value})}
                      rows={4}
                      className="w-full bg-[#0a192f] border border-white/10 rounded-2xl p-4 text-white focus:ring-1 focus:ring-[#64ffda] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Navigation className="w-3 h-3"/> Ulaşım</label>
                    <textarea 
                      value={formData.transportation}
                      onChange={e => setFormData({...formData, transportation: e.target.value})}
                      rows={4}
                      className="w-full bg-[#0a192f] border border-white/10 rounded-2xl p-4 text-white focus:ring-1 focus:ring-[#64ffda] outline-none"
                    />
                  </div>
                </div>

                {/* Sağ Kolon - Galeri Yönetimi */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <h3 className="text-sm font-black text-[#64ffda] uppercase tracking-widest">Fotoğraf Galerisi (HD)</h3>
                    <button 
                      type="button"
                      onClick={addGalleryItem}
                      className="flex items-center gap-2 text-[#64ffda] text-[10px] font-black uppercase hover:underline"
                    >
                      <Plus className="w-3 h-3" /> Yeni Fotoğraf Ekle
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {galleryItems.map((item, index) => (
                      <div key={index} className="group bg-[#0a192f] p-4 rounded-2xl border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-[#64ffda] bg-[#64ffda]/10 px-3 py-1 rounded-full uppercase tracking-widest">
                            Sıra No: {index + 1}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => removeGalleryItem(index)}
                            className="p-1.5 text-slate-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden shrink-0 border border-white/5">
                            {item ? <img src={item} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-slate-800" /></div>}
                          </div>
                          <div className="flex-1 space-y-1">
                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Görsel URL</label>
                            <div className="flex items-center gap-2">
                              <LinkIcon className="w-3 h-3 text-slate-700" />
                              <input 
                                value={item}
                                onChange={e => updateGalleryItem(index, e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-white text-xs outline-none focus:text-[#64ffda]"
                                placeholder="https://unsplash.com/..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {galleryItems.length === 0 && (
                      <div className="text-center py-10 bg-white/5 rounded-[32px] border border-dashed border-white/10">
                        <p className="text-slate-500 text-[10px] font-bold italic uppercase">Henüz fotoğraf eklenmemiş.</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 space-y-4 border-t border-white/5">
                    <h3 className="text-sm font-black text-[#64ffda] uppercase tracking-widest">SEO Ayarları</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <input 
                        placeholder="SEO Başlığı"
                        value={formData.meta_title}
                        onChange={e => setFormData({...formData, meta_title: e.target.value})}
                        className="w-full bg-[#0a192f] border border-white/10 rounded-2xl p-4 text-white text-xs outline-none focus:ring-1 focus:ring-[#64ffda]"
                      />
                      <input 
                        placeholder="SEO Açıklaması"
                        value={formData.meta_description}
                        onChange={e => setFormData({...formData, meta_description: e.target.value})}
                        className="w-full bg-[#0a192f] border border-white/10 rounded-2xl p-4 text-white text-xs outline-none focus:ring-1 focus:ring-[#64ffda]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-8 border-t border-white/5">
                <button type="button" onClick={closeModal} className="px-8 py-4 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/5 transition-all">İptal</button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-12 py-4 bg-[#64ffda] text-[#0a192f] font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all flex items-center gap-2 shadow-2xl shadow-[#64ffda]/30"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Değişiklikleri Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
