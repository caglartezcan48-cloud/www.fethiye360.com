'use client'

import { useEffect, useState } from 'react'
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
  Camera
} from 'lucide-react'

export default function BusinessPanel() {
  const [activeTab, setActiveTab] = useState<'general' | 'products' | 'photos'>('general')
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' })
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/isletme-giris')
        return
      }
      setUser(user)

      const { data: businessData } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single()
      
      if (businessData) {
        setBusiness(businessData)
        
        // Urunleri getir
        const { data: productData } = await supabase
          .from('business_products')
          .select('*')
          .eq('business_id', businessData.id)
        setProducts(productData || [])

        // Fotograflari getir
        const { data: imageData } = await supabase
          .from('business_images')
          .select('*')
          .eq('business_id', businessData.id)
        setImages(imageData || [])
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // Fotograf Yukleme Islemi
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    setUploading(true)
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${business.id}/${fileName}`

    // 1. Storage'a yukle
    const { error: uploadError } = await supabase.storage
      .from('business-images')
      .upload(filePath, file)

    if (uploadError) {
      alert('Yükleme hatası: ' + uploadError.message)
      setUploading(false)
      return
    }

    // 2. Public URL'i al
    const { data: { publicUrl } } = supabase.storage
      .from('business-images')
      .getPublicUrl(filePath)

    // 3. Veritabanina kaydet
    const { data, error: dbError } = await supabase
      .from('business_images')
      .insert([{ business_id: business.id, image_url: publicUrl }])
      .select()

    if (!dbError) {
      setImages([...images, data[0]])
    }
    setUploading(false)
  }

  const handleDeleteImage = async (id: string, url: string) => {
    if (!confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) return
    await supabase.from('business_images').delete().eq('id', id)
    setImages(images.filter(img => img.id !== id))
  }

  // Diger fonksiyonlar (Update, AddProduct vb. ayni kaliyor)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    await supabase.from('businesses').update({
      description: business.description,
      phone: business.phone,
      address: business.address
    }).eq('id', business.id)
    setUpdating(false)
    alert('Güncellendi!')
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    const { data, error } = await supabase.from('business_products').insert([{
      business_id: business.id, name: newProduct.name, price: parseFloat(newProduct.price)
    }]).select()
    if (!error) {
      setProducts([...products, data[0]])
      setNewProduct({ name: '', price: '', description: '' })
    }
    setUpdating(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="min-h-screen bg-[#0a192f] flex items-center justify-center"><Loader2 className="w-10 h-10 text-[#64ffda] animate-spin" /></div>

  return (
    <div className="min-h-screen bg-[#0a192f] flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-[#112240] border-r border-slate-700/50 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10 text-white font-bold"><Building2 className="text-[#64ffda]" /> {business.name}</div>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('general')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'general' ? 'bg-[#64ffda] text-[#0a192f]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Settings className="w-5" /> Bilgiler</button>
            <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-[#64ffda] text-[#0a192f]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Package className="w-5" /> Ürünler</button>
            <button onClick={() => setActiveTab('photos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'photos' ? 'bg-[#64ffda] text-[#0a192f]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><ImageIcon className="w-5" /> Galeri</button>
          </nav>
        </div>
        <button onClick={handleLogout} className="text-red-400 p-4 flex items-center gap-2"><LogOut className="w-5" /> Çıkış</button>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'general' && (
            <form onSubmit={handleUpdate} className="bg-[#112240] p-8 rounded-[40px] border border-slate-700/50 space-y-6">
              <h2 className="text-2xl font-bold text-white">İşletme Bilgileri</h2>
              <textarea value={business.description || ''} onChange={(e) => setBusiness({...business, description: e.target.value})} className="w-full bg-[#0a192f] border-none rounded-2xl p-4 text-white min-h-[150px]" />
              <div className="grid grid-cols-2 gap-4">
                <input value={business.phone || ''} onChange={(e) => setBusiness({...business, phone: e.target.value})} className="bg-[#0a192f] p-4 rounded-2xl text-white" placeholder="Telefon" />
                <input value={business.address || ''} onChange={(e) => setBusiness({...business, address: e.target.value})} className="bg-[#0a192f] p-4 rounded-2xl text-white" placeholder="Adres" />
              </div>
              <button type="submit" className="px-8 py-3 bg-[#64ffda] text-[#0a192f] rounded-xl font-bold">Kaydet</button>
            </form>
          )}

          {activeTab === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <form onSubmit={handleAddProduct} className="bg-[#112240] p-6 rounded-[32px] border border-slate-700/50 space-y-4 h-fit">
                <h3 className="text-white font-bold">Ürün Ekle</h3>
                <input value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#0a192f] p-3 rounded-xl text-white" placeholder="Ürün Adı" required />
                <input value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-[#0a192f] p-3 rounded-xl text-white" placeholder="Fiyat" required />
                <button type="submit" className="w-full py-3 bg-[#64ffda] text-[#0a192f] rounded-xl font-bold">Ekle</button>
              </form>
              <div className="md:col-span-2 space-y-3">
                {products.map(p => (
                  <div key={p.id} className="bg-[#112240] p-4 rounded-2xl border border-slate-700/50 flex justify-between items-center text-white">
                    <div><div className="font-bold">{p.name}</div><div className="text-[#64ffda] text-sm">{p.price} TL</div></div>
                    <button onClick={() => {}} className="text-slate-500 hover:text-red-500"><Trash2 className="w-5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-8">
              <header className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Fotoğraf Galerisi</h2>
                <label className="cursor-pointer px-6 py-3 bg-[#64ffda] text-[#0a192f] rounded-xl font-bold flex items-center gap-2">
                  {uploading ? <Loader2 className="w-5 animate-spin" /> : <><Upload className="w-5" /> Fotoğraf Yükle</>}
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                </label>
              </header>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-700/50 group">
                    <img src={img.image_url} alt="Galeri" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => handleDeleteImage(img.id, img.image_url)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {images.length === 0 && (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-700 rounded-3xl">
                    <Camera className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">Henüz fotoğraf yüklenmemiş.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
