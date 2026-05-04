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
  Tag
} from 'lucide-react'

export default function BusinessPanel() {
  const [activeTab, setActiveTab] = useState<'general' | 'products' | 'photos'>('general')
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  
  // Yeni urun formu
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' })
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
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
      }
      setLoading(false)
    }
    checkUser()
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    await supabase
      .from('businesses')
      .update({
        description: business.description,
        phone: business.phone,
        address: business.address,
        website: business.website
      })
      .eq('id', business.id)
    setUpdating(false)
    alert('Bilgiler güncellendi!')
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    const { data, error } = await supabase
      .from('business_products')
      .insert([{
        business_id: business.id,
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description
      }])
      .select()

    if (!error) {
      setProducts([...products, data[0]])
      setNewProduct({ name: '', price: '', description: '' })
    }
    setUpdating(false)
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    await supabase.from('business_products').delete().eq('id', id)
    setProducts(products.filter(p => p.id !== id))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#64ffda] animate-spin" />
    </div>
  )

  if (!business) return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center p-6 text-center">
      <div>
        <Building2 className="w-16 h-16 text-slate-700 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">İşletme Bulunamadı</h1>
        <p className="text-slate-400 mb-8">Henüz hesabınıza tanımlı bir işletme yok.</p>
        <button onClick={handleLogout} className="text-[#64ffda] hover:underline">Çıkış Yap</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a192f] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#112240] border-r border-slate-700/50 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda]">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-white font-bold truncate">{business.name}</span>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'general' ? 'bg-[#64ffda] text-[#0a192f]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Settings className="w-5 h-5" />
              Genel Bilgiler
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-[#64ffda] text-[#0a192f]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Package className="w-5 h-5" />
              Ürünler & Hizmetler
            </button>
            <button 
              onClick={() => setActiveTab('photos')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'photos' ? 'bg-[#64ffda] text-[#0a192f]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <ImageIcon className="w-5 h-5" />
              Fotoğraf Galerisi
            </button>
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Çıkış Yap
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          {/* TAB: General Information */}
          {activeTab === 'general' && (
            <>
              <header className="mb-10">
                <h2 className="text-3xl font-bold text-white mb-2">Genel Bilgiler</h2>
                <p className="text-slate-400 text-sm">İşletme profilinizi güncelleyin.</p>
              </header>

              <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#112240] p-8 rounded-[40px] border border-slate-700/50">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 tracking-widest">Açıklama</label>
                  <textarea 
                    value={business.description || ''}
                    onChange={(e) => setBusiness({...business, description: e.target.value})}
                    className="w-full bg-[#0a192f] border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda] min-h-[150px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 tracking-widest">Telefon</label>
                  <input 
                    type="text"
                    value={business.phone || ''}
                    onChange={(e) => setBusiness({...business, phone: e.target.value})}
                    className="w-full bg-[#0a192f] border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 tracking-widest">Adres</label>
                  <input 
                    type="text"
                    value={business.address || ''}
                    onChange={(e) => setBusiness({...business, address: e.target.value})}
                    className="w-full bg-[#0a192f] border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda]"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" disabled={updating} className="px-10 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-bold flex items-center gap-2">
                    <Save className="w-5 h-5" /> Kaydet
                  </button>
                </div>
              </form>
            </>
          )}

          {/* TAB: Products & Services */}
          {activeTab === 'products' && (
            <>
              <header className="mb-10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Ürünler & Hizmetler</h2>
                  <p className="text-slate-400 text-sm">Müşterilerinize sunduğunuz ürünleri yönetin.</p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Add Product Form */}
                <div className="md:col-span-1 bg-[#112240] p-6 rounded-[32px] border border-slate-700/50 h-fit sticky top-6">
                  <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#64ffda]" /> Yeni Ürün Ekle
                  </h3>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <input 
                      placeholder="Ürün Adı"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full bg-[#0a192f] border-none rounded-xl p-3 text-white text-sm"
                      required
                    />
                    <input 
                      placeholder="Fiyat (TL)"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full bg-[#0a192f] border-none rounded-xl p-3 text-white text-sm"
                      required
                    />
                    <textarea 
                      placeholder="Kısa Açıklama"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full bg-[#0a192f] border-none rounded-xl p-3 text-white text-sm min-h-[100px]"
                    />
                    <button type="submit" disabled={updating} className="w-full py-3 bg-[#64ffda] text-[#0a192f] rounded-xl font-bold text-sm transition-all">
                      Ekle
                    </button>
                  </form>
                </div>

                {/* Product List */}
                <div className="md:col-span-2 space-y-4">
                  {products.length === 0 ? (
                    <div className="p-12 text-center bg-[#112240]/50 rounded-[32px] border border-dashed border-slate-700">
                      <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                      <p className="text-slate-500">Henüz ürün eklenmemiş.</p>
                    </div>
                  ) : (
                    products.map((product) => (
                      <div key={product.id} className="bg-[#112240] p-5 rounded-3xl border border-slate-700/50 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda]">
                            <Tag className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold">{product.name}</h4>
                            <p className="text-[#64ffda] text-sm font-bold">{product.price} TL</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-3 text-slate-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB: Photos (Coming Soon) */}
          {activeTab === 'photos' && (
            <div className="py-20 text-center">
              <ImageIcon className="w-16 h-16 text-slate-700 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Fotoğraf Galerisi</h2>
              <p className="text-slate-400">Çok yakında burada resim yükleyebileceksiniz.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
