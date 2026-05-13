'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { 
  Building2, 
  Package, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Plus, 
  Star,
  MessageSquare,
  Save,
  Loader2,
  Trash2,
  Tag,
  Upload,
  Camera,
  CornerDownRight,
  ChevronRight,
  Sparkles,
  MapPin,
  Globe,
  Phone
} from 'lucide-react'
import Image from 'next/image'

export default function BusinessPanel() {
  const [activeTab, setActiveTab] = useState<'general' | 'products' | 'photos' | 'reviews'>('general')
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [images, setImages] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: '', image_url: '' })
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({})
  
  const supabase = createClient()
  const router = useRouter()
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/isletme-giris')
        return
      }
      setUser(user)

      // 406 hatasini bypass etmek icin RPC (Fonksiyon) kullanalim
      const { data: businessData, error: bError } = await supabase
        .rpc('get_business_by_owner', { p_owner_id: user.id })
        .maybeSingle()
      
      if (businessData) {
        setBusiness(businessData)
        
        const [prod, img, rev] = await Promise.all([
          supabase.from('business_products').select('*').eq('business_id', businessData.id),
          supabase.from('business_images').select('*').eq('business_id', businessData.id),
          supabase.from('business_reviews').select('*').eq('business_id', businessData.id).order('created_at', { ascending: false })
        ])

        setProducts(prod.data || [])
        setImages(img.data || [])
        setReviews(rev.data || [])
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleUpdateGeneral = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    const { error } = await supabase
      .from('businesses')
      .update({
        description: business.description,
        phone: business.phone,
        address: business.address,
        location_lat: business.location_lat ? parseFloat(business.location_lat.toString()) : null,
        location_lng: business.location_lng ? parseFloat(business.location_lng.toString()) : null,
        website: business.website
      })
      .eq('id', business.id)

    if (!error) alert('Bilgiler güncellendi!')
    else console.error(error)
    setUpdating(false)
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price) return
    setUpdating(true)
    const { data, error } = await supabase
      .from('business_products')
      .insert([{
        business_id: business.id,
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        category: newProduct.category || 'Genel',
        image_url: newProduct.image_url || null
      }])
      .select()

    if (!error && data) {
      setProducts([...products, data[0]])
      setNewProduct({ name: '', price: '', description: '', category: '', image_url: '' })
    }
    setUpdating(false)
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    const { error } = await supabase.from('business_products').delete().eq('id', id)
    if (!error) setProducts(products.filter(p => p.id !== id))
  }

  const handleUploadImage = async (file: File) => {
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${business.id}_${Date.now()}.${fileExt}`
      const filePath = `businesses/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(filePath)

      const { data: newImg, error: dbError } = await supabase
        .from('business_images')
        .insert([{ business_id: business.id, image_url: publicUrl }])
        .select()

      if (!dbError && newImg) setImages([...images, newImg[0]])
    } catch (err) {
      console.error(err)
      alert('Yükleme başarısız')
    } finally {
      setUploading(false)
    }
  }

  const handleReply = async (reviewId: string) => {
    setUpdating(true)
    const { error } = await supabase
      .from('business_reviews')
      .update({ reply: replyText[reviewId] })
      .eq('id', reviewId)

    if (!error) {
      setReviews(reviews.map(r => r.id === reviewId ? { ...r, reply: replyText[reviewId] } : r))
    }
    setUpdating(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a192f] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-[#64ffda] animate-spin" />
      <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Yükleniyor...</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a192f] flex flex-col md:flex-row selection:bg-[#64ffda]/30">
      {/* Sidebar HD */}
      <aside className="w-full md:w-80 bg-[#112240] border-r border-white/5 p-8 flex flex-col justify-between sticky top-0 h-screen overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#64ffda]/5 rounded-full blur-[80px]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-12 p-2 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-12 h-12 bg-[#64ffda] rounded-xl flex items-center justify-center text-[#0a192f] font-black text-xl">
              {business.name[0]}
            </div>
            <div className="flex-1 truncate">
              <div className="text-white font-bold truncate">{business.name}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">İşletme Paneli</div>
            </div>
          </div>

          <nav className="space-y-3">
            {[
              { id: 'general', label: 'Genel Bilgiler', icon: Settings },
              { id: 'products', label: 'Menü / Ürünler', icon: Package },
              { id: 'photos', label: 'Fotoğraf Galerisi', icon: ImageIcon },
              { id: 'reviews', label: 'Müşteri Yorumları', icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 relative group overflow-hidden ${
                  activeTab === tab.id 
                    ? 'bg-[#64ffda] text-[#0a192f] shadow-[0_10px_30px_rgba(100,255,218,0.2)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <button 
          onClick={handleLogout} 
          className="relative z-10 flex items-center gap-4 px-6 py-4 text-red-400 font-bold hover:bg-red-500/10 rounded-2xl transition-all group mt-10 border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
          Sistemden Çıkış
        </button>
      </aside>

      {/* Content Area HD */}
      <main className="flex-1 p-6 md:p-16 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#64ffda]/5 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* TAB: General Info */}
          {activeTab === 'general' && (
            <div className="space-y-12">
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Genel Bilgiler</h2>
                  <p className="text-slate-400">İşletmenizin dijital kimliğini güncel tutun.</p>
                </div>
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                  <Settings className="w-6 h-6 text-slate-500" />
                </div>
              </header>

              <form onSubmit={handleUpdateGeneral} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">İşletme Açıklaması</label>
                  <textarea 
                    value={business.description || ''}
                    onChange={(e) => setBusiness({...business, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 text-white min-h-[150px] focus:ring-2 focus:ring-[#64ffda] focus:bg-white/10 transition-all outline-none"
                    placeholder="Misafirlerinize işletmenizi anlatın..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Phone className="w-3 h-3 text-[#64ffda]" /> İletişim Telefonu</label>
                  <input 
                    type="text"
                    value={business.phone || ''}
                    onChange={(e) => setBusiness({...business, phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
                    placeholder="0252 XXX XX XX"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Globe className="w-3 h-3 text-[#64ffda]" /> Web Sitesi</label>
                  <input 
                    type="text"
                    value={business.website || ''}
                    onChange={(e) => setBusiness({...business, website: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><MapPin className="w-3 h-3 text-[#64ffda]" /> Açık Adres</label>
                  <input 
                    type="text"
                    value={business.address || ''}
                    onChange={(e) => setBusiness({...business, address: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Enlem (Latitude)</label>
                  <input 
                    type="text"
                    value={business.location_lat || ''}
                    onChange={(e) => setBusiness({...business, location_lat: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Boylam (Longitude)</label>
                  <input 
                    type="text"
                    value={business.location_lng || ''}
                    onChange={(e) => setBusiness({...business, location_lng: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
                  />
                </div>

                <div className="md:col-span-2 pt-6">
                  <button 
                    type="submit"
                    disabled={updating}
                    className="w-full bg-[#64ffda] text-[#0a192f] py-5 rounded-[32px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-[#52e0c4] transition-all shadow-xl shadow-[#64ffda]/10"
                  >
                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> Değişiklikleri Kaydet</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: Products */}
          {activeTab === 'products' && (
            <div className="space-y-12">
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Menü & Ürünler</h2>
                  <p className="text-slate-400">Hizmetlerinizi veya ürünlerinizi listeleyin.</p>
                </div>
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                  <Package className="w-6 h-6 text-slate-500" />
                </div>
              </header>

              <form onSubmit={handleAddProduct} className="bg-white/5 p-10 rounded-[48px] border border-white/5 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#64ffda]/5 rounded-full blur-3xl" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ürün Adı *</label>
                    <input 
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full bg-[#0a192f] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
                      placeholder="Örn: Adana Kebap"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fiyat (TL) *</label>
                    <input 
                      required
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full bg-[#0a192f] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
                      placeholder="350"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kategori</label>
                    <input 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-[#0a192f] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
                      placeholder="Örn: Ana Yemekler"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Görsel URL</label>
                    <input 
                      value={newProduct.image_url}
                      onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                      className="w-full bg-[#0a192f] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ürün Açıklaması</label>
                    <textarea 
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full bg-[#0a192f] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none h-24 resize-none"
                      placeholder="Ürün içeriği hakkında kısa bilgi..."
                    />
                  </div>
                </div>
                <button type="submit" disabled={updating} className="w-full py-5 bg-[#64ffda] text-[#0a192f] rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-[#64ffda]/10 disabled:opacity-50">
                  {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  YENİ ÜRÜNÜ MENÜYE EKLE
                </button>
              </form>

              <div className="grid grid-cols-1 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="group bg-white/5 p-6 rounded-[32px] border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#64ffda] group-hover:scale-110 transition-transform">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-white font-bold">{p.name}</div>
                        <div className="text-slate-500 text-xs">{p.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-xl font-black text-[#64ffda]">{p.price} TL</div>
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-3 text-red-500/50 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Photos */}
          {activeTab === 'photos' && (
            <div className="space-y-12">
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Görsel Yönetimi</h2>
                  <p className="text-slate-400">İşletmenizin en güzel karelerini paylaşın.</p>
                </div>
                <button 
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-3 px-8 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Upload className="w-5 h-5" /> Fotoğraf Yükle</>}
                </button>
                <input 
                  type="file" 
                  ref={imageInputRef} 
                  onChange={(e) => e.target.files?.[0] && handleUploadImage(e.target.files[0])}
                  className="hidden" 
                  accept="image/*"
                />
              </header>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {images.map((img) => (
                  <div key={img.id} className="group relative aspect-square rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
                    <Image src={img.image_url} alt="Galeri" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                      <button className="p-4 bg-red-500 text-white rounded-2xl hover:scale-110 transition-transform">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {images.length === 0 && (
                  <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[48px] text-slate-500">
                    <Camera className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    Henüz fotoğraf yüklenmemiş.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-12">
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Müşteri Yorumları</h2>
                  <p className="text-slate-400">Misafirlerinizin deneyimlerini takip edin.</p>
                </div>
                <div className="px-6 py-3 bg-[#64ffda]/10 rounded-full border border-[#64ffda]/20 text-[#64ffda] font-black text-xs uppercase tracking-widest">
                  {reviews.length} Toplam
                </div>
              </header>

              <div className="space-y-8">
                {reviews.map((review) => (
                  <div key={review.id} className="group bg-white/5 p-10 rounded-[48px] border border-white/5 hover:border-white/10 transition-all duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#64ffda]/20 to-blue-500/20 flex items-center justify-center text-[#64ffda] font-black text-xl border border-white/5 shadow-lg">
                          {review.user_name[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-lg">{review.user_name}</h4>
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                            {new Date(review.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20 text-yellow-500 font-black text-sm">
                        <Star className="w-4 h-4 fill-yellow-500" /> {review.rating}.0
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-lg italic mb-8">
                      "{review.comment}"
                    </p>
                    
                    <div className="pt-8 border-t border-white/5">
                      {review.reply ? (
                        <div className="flex gap-6">
                          <div className="w-10 h-10 rounded-full bg-[#64ffda]/10 flex items-center justify-center shrink-0">
                            <CornerDownRight className="w-5 h-5 text-[#64ffda]" />
                          </div>
                          <div className="bg-white/5 p-6 rounded-[32px] flex-1 border border-[#64ffda]/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#64ffda]/5 rounded-full blur-2xl" />
                            <span className="text-[#64ffda] font-black text-[10px] uppercase tracking-[0.2em] block mb-3 relative z-10">Sizin Yanıtınız</span>
                            <p className="text-slate-400 text-sm leading-relaxed font-medium relative z-10">{review.reply}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row gap-4">
                          <textarea 
                            value={replyText[review.id] || ''}
                            onChange={(e) => setReplyText({...replyText, [review.id]: e.target.value})}
                            placeholder="Müşterinize yanıt verin..."
                            className="flex-1 bg-[#0a192f] border border-white/5 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-[#64ffda] outline-none min-h-[100px]"
                          />
                          <button 
                            onClick={() => handleReply(review.id)}
                            disabled={updating}
                            className="md:w-32 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center hover:bg-[#52e0c4] transition-all disabled:opacity-50 h-[100px] md:h-auto"
                          >
                            Yanıtla
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
