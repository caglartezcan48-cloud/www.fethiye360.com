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
  Phone,
  Edit3,
  QrCode,
  Download,
  ExternalLink,
  Database,
  CheckCircle2,
  ShoppingCart,
  Clock,
  Check,
  X,
  CreditCard,
  Banknote,
  Search
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { moderateImage, moderateText, isValidImageType, isValidFileSize } from '@/lib/moderation'
import { compressImage } from '@/lib/utils'

export default function BusinessPanel() {
  const [activeTab, setActiveTab] = useState<'general' | 'products' | 'orders' | 'photos' | 'reviews' | 'qr'>('orders')
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [images, setImages] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: '', image_url: '' })
  const [bulkText, setBulkText] = useState('')
  const [showBulkMode, setShowBulkMode] = useState(false)
  const [bulkPreview, setBulkPreview] = useState<any[]>([])
  const [gallery, setGallery] = useState<any[]>([])
  const [showGalleryModal, setShowGalleryModal] = useState<{ isOpen: boolean, target: 'new' | 'edit' }>({ isOpen: false, target: 'new' })
  const [uploading, setUploading] = useState(false)
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({})
  
  const supabase = createClient()
  const router = useRouter()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const productImageInputRef = useRef<HTMLInputElement>(null)
  const editProductImageInputRef = useRef<HTMLInputElement>(null)

  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editingCategoryName, setEditingCategoryName] = useState<{old: string, new: string} | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/isletme-giris')
        return
      }
      setUser(user)

      // 1. İşletme Bilgilerini Çek
      const { data: biz, error: bizError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single()

      if (bizError || !biz) {
        setLoading(false)
        return
      }
      setBusiness(biz)

      // 2. Ürünleri Çek
      const { data: prodData } = await supabase
        .from('business_products')
        .select('*')
        .eq('business_id', biz.id)
        .order('category', { ascending: true })

      if (prodData) setProducts(prodData)

      // 3. Galeriyi Çek
      const { data: galleryData } = await supabase
        .from('business_images')
        .select('*')
        .eq('business_id', biz.id)
        .order('created_at', { ascending: false })

      if (galleryData) setGallery(galleryData)

      // 4. Yorumları Çek
      const { data: revData } = await supabase
        .from('business_reviews')
        .select('*')
        .eq('business_id', biz.id)
        .order('created_at', { ascending: false })

      if (revData) setReviews(revData)
      
      // 5. Siparişleri Çek (Örnek tablo: business_orders)
      const { data: orderData } = await supabase
        .from('business_orders')
        .select('*')
        .eq('business_id', biz.id)
        .order('created_at', { ascending: false })

      if (orderData) setOrders(orderData)

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
        website: business.website,
        services: business.services || []
      })
      .eq('id', business.id)

    if (!error) {
      toast.success('Bilgiler güncellendi!')
    } else {
      console.error(error)
      toast.error('Hata: ' + error.message)
    }
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

    if (!error && data && data.length > 0) {
      setProducts([...products, data[0]])
      // Kategori silinmesin (Sticky Category) - İşletme sahibi arka arkaya ürün eklerken kolaylık sağlar
      setNewProduct({ ...newProduct, name: '', price: '', description: '', image_url: '' })
      toast.success('Ürün eklendi!')
    } else {
      toast.error('Ürün eklenemedi: ' + (error?.message || 'Bilinmeyen hata'))
    }
    setUpdating(false)
  }

  const downloadProductTemplate = () => {
    const BOM = '\uFEFF'
    const headers = ['Ürün Adı', 'Fiyat', 'Kategori', 'Açıklama'].join(';') + '\n'
    const sampleData = "Adana Kebap;350;Ana Yemekler;Zırh kıyması ile özel hazırlanmış\nAyran;45;İçecekler;Ev yapımı taze ayran"
    const blob = new Blob([BOM + headers + sampleData], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${business.name}_menu_sablonu.csv`
    a.click()
  }

  const handleProductFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUpdating(true)

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        if (lines.length <= 1) throw new Error('Dosya boş veya geçersiz.')

        const delimiter = lines[0].includes(';') ? ';' : ','
        const result = lines.slice(1).map(line => {
          const values = line.split(delimiter).map(v => v.trim())
          return {
            business_id: business.id,
            name: values[0],
            price: parseFloat(values[1]?.replace(',', '.') || '0'),
            category: values[2] || 'Genel',
            description: values[3] || '',
            image_url: null
          }
        }).filter(p => p.name && p.price > 0)

        if (result.length === 0) throw new Error('Yüklenecek geçerli ürün bulunamadı.')
        
        setBulkPreview(result)
        toast.info(`${result.length} ürün hazır. Lütfen kontrol edip onaylayın.`)
      } catch (err: any) {
        toast.error('Dosya okuma hatası: ' + err.message)
      } finally {
        setUpdating(false)
      }
    }
    reader.readAsText(file)
  }

  const handleConfirmBulkUpload = async () => {
    if (bulkPreview.length === 0) return
    setUpdating(true)
    try {
      const { data, error } = await supabase
        .from('business_products')
        .insert(bulkPreview)
        .select()

      if (!error && data) {
        setProducts([...products, ...data])
        setBulkPreview([])
        setShowBulkMode(false)
        toast.success(`${data.length} ürün başarıyla menüye eklendi!`)
      } else {
        throw error
      }
    } catch (err: any) {
      toast.error('Kayıt hatası: ' + err.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct || !editingProduct.name || !editingProduct.price) return
    setUpdating(true)
    const { error } = await supabase
      .from('business_products')
      .update({
        name: editingProduct.name,
        price: parseFloat(editingProduct.price),
        description: editingProduct.description,
        category: editingProduct.category,
        image_url: editingProduct.image_url
      })
      .eq('id', editingProduct.id)

    if (!error) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p))
      setEditingProduct(null)
      toast.success('Ürün güncellendi!')
    } else {
      toast.error('Güncelleme hatası: ' + error.message)
    }
    setUpdating(false)
  }

  const handleRenameCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategoryName || !editingCategoryName.new) return
    
    setUpdating(true)
    const { error } = await supabase
      .from('business_products')
      .update({ category: editingCategoryName.new })
      .eq('business_id', business.id)
      .eq('category', editingCategoryName.old)
      
    if (!error) {
      setProducts(products.map(p => (p.category || 'Genel') === editingCategoryName.old ? { ...p, category: editingCategoryName.new } : p))
      setEditingCategoryName(null)
      toast.success('Kategori güncellendi!')
    } else {
      toast.error('Kategori güncellenirken hata oluştu: ' + error.message)
    }
    setUpdating(false)
  }

  const handleProductImageUpload = async (file: File, isEditing: boolean = false) => {
    setUploading(true)
    try {
      // 1. Dosya tipi ve boyut kontrolü
      if (!isValidImageType(file)) {
        toast.error('Geçersiz dosya tipi. Sadece JPEG, PNG, WebP veya GIF yükleyebilirsiniz.')
        return
      }
      if (!isValidFileSize(file, 10)) {
        toast.error('Dosya boyutu çok büyük. Maksimum 10MB yükleyebilirsiniz.')
        return
      }

      // 2. Görseli HD kalitede sıkıştır (WebP, max 800KB)
      toast.info('Görsel işleniyor...')
      const compressedBlob = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85,
        format: 'webp',
        maxFileSizeKB: 800
      })

      // 3. +18 içerik kontrolü
      const imageUrl = URL.createObjectURL(compressedBlob)
      const moderationResult = await moderateImage(imageUrl)
      URL.revokeObjectURL(imageUrl)

      if (!moderationResult.isAppropriate) {
        toast.error('Bu görsel uygunsuz içerik barındırıyor ve yüklenemiyor.')
        return
      }

      // 4. Supabase'e yükle
      const fileName = `product_${business.id}_${Date.now()}.webp`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(filePath, compressedBlob, { contentType: 'image/webp' })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(filePath)

      if (isEditing) {
        setEditingProduct({ ...editingProduct, image_url: publicUrl })
      } else {
        setNewProduct(prev => ({ ...prev, image_url: publicUrl }))
      }
      
      toast.success('Görsel başarıyla yüklendi!')
    } catch (err: any) {
      console.error(err)
      toast.error('Görsel yüklenemedi: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    const { error } = await supabase.from('business_products').delete().eq('id', id)
    if (!error) {
      setProducts(products.filter(p => p.id !== id))
      toast.success('Ürün silindi!')
    } else {
      toast.error('Silinirken hata oluştu: ' + error.message)
    }
  }

  const handleUploadImage = async (file: File) => {
    setUploading(true)
    try {
      // 1. Dosya tipi ve boyut kontrolü
      if (!isValidImageType(file)) {
        toast.error('Geçersiz dosya tipi. Sadece JPEG, PNG, WebP veya GIF yükleyebilirsiniz.')
        return
      }
      if (!isValidFileSize(file, 10)) {
        toast.error('Dosya boyutu çok büyük. Maksimum 10MB yükleyebilirsiniz.')
        return
      }

      // 2. Görseli HD kalitede sıkıştır (WebP, max 800KB)
      toast.info('Görsel işleniyor...')
      const compressedBlob = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85,
        format: 'webp',
        maxFileSizeKB: 800
      })

      // 3. +18 içerik kontrolü
      const imageUrl = URL.createObjectURL(compressedBlob)
      const moderationResult = await moderateImage(imageUrl)
      URL.revokeObjectURL(imageUrl)

      if (!moderationResult.isAppropriate) {
        toast.error('Bu görsel uygunsuz içerik barındırıyor ve yüklenemiyor.')
        return
      }

      // 4. Supabase'e yükle
      const fileName = `${business.id}_${Date.now()}.webp`
      const filePath = `businesses/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(filePath, compressedBlob, { contentType: 'image/webp' })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(filePath)

      const { data: newImg, error: dbError } = await supabase
        .from('business_images')
        .insert([{ business_id: business.id, image_url: publicUrl }])
        .select()

      if (!dbError && newImg) {
        setImages([...images, newImg[0]])
        setGallery([...gallery, newImg[0]])
        toast.success('Fotoğraf başarıyla yüklendi!')
      }
    } catch (err: any) {
      console.error(err)
      toast.error('Yükleme başarısız: ' + err.message)
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
      toast.success('Yanıt gönderildi!')
    } else {
      toast.error('Yanıt gönderilemedi: ' + error.message)
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
              { id: 'orders', label: 'Gelen Siparişler', icon: ShoppingCart },
              { id: 'products', label: 'Menü / Ürünler', icon: Package },
              { id: 'qr', label: 'QR Menü', icon: QrCode },
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
          
          {/* TAB: Orders (Sales Command Center) */}
          {activeTab === 'orders' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-5xl font-black text-white mb-2 tracking-tighter italic uppercase leading-none">
                    SATIŞ <span className="text-[#64ffda]">MERKEZİ</span>
                  </h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Anlık Sipariş Yönetimi</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda]">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-black text-xl leading-none italic">{orders.length}</p>
                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-1">Toplam Sipariş</p>
                      </div>
                   </div>
                   <div className="bg-[#64ffda] rounded-2xl p-4 flex items-center gap-4 shadow-xl shadow-[#64ffda]/10">
                      <div className="w-10 h-10 rounded-xl bg-[#0a192f]/20 flex items-center justify-center text-[#0a192f]">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[#0a192f] font-black text-xl leading-none italic">
                          {orders.reduce((acc, curr) => acc + (curr.total_amount || 0), 0)} TL
                        </p>
                        <p className="text-[#0a192f]/60 text-[8px] font-black uppercase tracking-widest mt-1">Toplam Ciro</p>
                      </div>
                   </div>
                </div>
              </header>

              {/* Order List / Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.length > 0 ? orders.map((order) => (
                  <div 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="group bg-[#112240] border border-white/5 rounded-[32px] p-6 hover:border-[#64ffda]/30 transition-all cursor-pointer relative overflow-hidden shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full animate-pulse ${
                            order.status === 'pending' ? 'bg-amber-500' : 
                            order.status === 'preparing' ? 'bg-blue-500' : 
                            order.status === 'completed' ? 'bg-[#64ffda]' : 'bg-red-500'
                          }`} />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">
                            #{order.id.slice(0, 6)}
                          </span>
                       </div>
                       <span className="text-slate-500 text-[10px] font-bold">
                         {new Date(order.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>

                    <div className="space-y-1 mb-6">
                       <h4 className="text-white font-black uppercase tracking-tight text-lg group-hover:text-[#64ffda] transition-colors truncate">
                         {order.customer_name || 'Anonim Müşteri'}
                       </h4>
                       <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                         <CreditCard className="w-3 h-3" /> {order.payment_method || 'Nakit'}
                       </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                       <div>
                          <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Tutar</p>
                          <p className="text-[#64ffda] font-black italic text-xl tracking-tighter">{order.total_amount} TL</p>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-[#64ffda] group-hover:text-[#0a192f] transition-all">
                          <ChevronRight className="w-5 h-5" />
                       </div>
                    </div>

                    {/* BG Glow */}
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#64ffda]/5 rounded-full blur-2xl group-hover:bg-[#64ffda]/10 transition-all" />
                  </div>
                )) : (
                  <div className="col-span-full py-24 bg-white/5 rounded-[48px] border-2 border-dashed border-white/5 text-center space-y-6">
                     <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                        <ShoppingCart className="w-10 h-10 text-white" />
                     </div>
                     <div className="space-y-2">
                        <p className="text-white font-black uppercase tracking-widest text-xs">Henüz Sipariş Yok</p>
                        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">Menünüzü paylaşın ve ilk siparişi bekleyin!</p>
                     </div>
                  </div>
                )}
              </div>

              {/* Order Detail Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 z-[200] bg-[#0a192f]/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
                   <div className="bg-[#112240] w-full max-w-2xl rounded-[48px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                      <div className="p-10 border-b border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-3xl bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda] shadow-lg shadow-[#64ffda]/5">
                               <Package className="w-7 h-7" />
                            </div>
                            <div>
                               <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Sipariş Detayı</h3>
                               <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Müşteri Bilgileri ve İçerik</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => setSelectedOrder(null)}
                           className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all border border-white/5"
                         >
                            <X className="w-6 h-6" />
                         </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
                         {/* Customer Info */}
                         <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-1">
                               <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Müşteri</p>
                               <p className="text-white font-black uppercase italic">{selectedOrder.customer_name}</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-1">
                               <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Ödeme</p>
                               <p className="text-[#64ffda] font-black uppercase italic">{selectedOrder.payment_method}</p>
                            </div>
                         </div>

                         {/* Items List */}
                         <div className="space-y-6">
                            <h5 className="text-[10px] font-black text-white uppercase tracking-[0.4em] ml-2">SİPARİŞ İÇERİĞİ</h5>
                            <div className="space-y-3">
                               {selectedOrder.items?.map((item: any, idx: number) => (
                                 <div key={idx} className="bg-white/5 p-5 rounded-2xl flex items-center justify-between border border-white/5">
                                    <div className="flex items-center gap-4">
                                       <div className="w-8 h-8 rounded-lg bg-[#0a192f] flex items-center justify-center text-[#64ffda] font-black text-xs">
                                          {item.quantity}x
                                       </div>
                                       <div>
                                          <p className="text-white text-sm font-black uppercase tracking-tight">{item.name}</p>
                                          {item.note && <p className="text-slate-500 text-[10px] italic">"{item.note}"</p>}
                                       </div>
                                    </div>
                                    <p className="text-white font-black italic">{item.price * item.quantity} TL</p>
                                 </div>
                               ))}
                            </div>
                         </div>

                         {/* Total */}
                         <div className="bg-[#64ffda]/5 p-8 rounded-[32px] border border-[#64ffda]/10 flex items-center justify-between">
                            <span className="text-slate-400 font-black uppercase tracking-widest text-xs">TOPLAM TUTAR</span>
                            <span className="text-[#64ffda] text-4xl font-black italic tracking-tighter">{selectedOrder.total_amount} TL</span>
                         </div>
                      </div>

                      {/* Actions */}
                      <div className="p-8 bg-black/20 grid grid-cols-2 gap-4">
                         <button 
                           onClick={() => setSelectedOrder(null)}
                           className="py-5 bg-white/5 rounded-3xl text-slate-400 font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all"
                         >
                           Kapat
                         </button>
                         
                         {selectedOrder.status === 'pending' && (
                           <button 
                             onClick={async () => {
                               const { error } = await supabase.from('business_orders').update({ status: 'preparing' }).eq('id', selectedOrder.id)
                               if (!error) {
                                 setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: 'preparing' } : o))
                                 setSelectedOrder(null)
                                 toast.success('Sipariş hazırlanıyor aşamasına alındı!')
                               }
                             }}
                             className="py-5 bg-[#64ffda] text-[#0a192f] rounded-3xl font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] transition-all shadow-xl shadow-[#64ffda]/10"
                           >
                             SİPARİŞİ ONAYLA
                           </button>
                         )}

                         {selectedOrder.status === 'preparing' && (
                           <button 
                             onClick={async () => {
                               const { error } = await supabase.from('business_orders').update({ status: 'on_the_way' }).eq('id', selectedOrder.id)
                               if (!error) {
                                 setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: 'on_the_way' } : o))
                                 setSelectedOrder(null)
                                 toast.success('Sipariş yola çıktı!')
                               }
                             }}
                             className="py-5 bg-blue-500 text-white rounded-3xl font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] transition-all shadow-xl shadow-blue-500/10"
                           >
                             YOLA ÇIKAR
                           </button>
                         )}

                         {selectedOrder.status === 'on_the_way' && (
                           <button 
                             onClick={async () => {
                               const { error } = await supabase.from('business_orders').update({ status: 'completed' }).eq('id', selectedOrder.id)
                               if (!error) {
                                 setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: 'completed' } : o))
                                 setSelectedOrder(null)
                                 toast.success('Sipariş başarıyla teslim edildi!')
                               }
                             }}
                             className="py-5 bg-[#64ffda] text-[#0a192f] rounded-3xl font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] transition-all shadow-xl shadow-[#64ffda]/10"
                           >
                             TESLİM EDİLDİ
                           </button>
                         )}
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}

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
              <header className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Menü & Ürünler</h2>
                  <p className="text-slate-400">Hizmetlerinizi veya ürünlerinizi listeleyin.</p>
                </div>
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                  <Package className="w-6 h-6 text-slate-500" />
                </div>
              </header>

              {/* Gallery Selector Modal */}
              {showGalleryModal.isOpen && (
                <div className="fixed inset-0 bg-[#0a192f]/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                  <div className="bg-[#112240] w-full max-w-2xl p-8 rounded-[40px] border border-[#64ffda]/20 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-white">Galeriden Seç</h3>
                      <button onClick={() => setShowGalleryModal({ isOpen: false, target: 'new' })} className="text-slate-400">Kapat</button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 h-[300px] overflow-y-auto">
                      {gallery.map((img) => (
                        <button 
                          key={img.id} 
                          onClick={() => {
                            if (showGalleryModal.target === 'new') setNewProduct({...newProduct, image_url: img.image_url})
                            else setEditingProduct({...editingProduct, image_url: img.image_url})
                            setShowGalleryModal({ isOpen: false, target: 'new' })
                          }}
                          className="aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#64ffda]"
                        >
                          <img src={img.image_url} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Category Management */}
              <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 space-y-6">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#64ffda]" /> Menü Başlıkları Yönetimi
                </h3>
                <div className="flex flex-wrap gap-3">
                  {Array.from(new Set(products.filter(Boolean).map(p => p?.category || 'Genel'))).sort().map((cat: any) => (
                    <button 
                      key={cat}
                      onClick={() => setEditingCategoryName({ old: cat, new: cat })}
                      className="px-4 py-2 bg-[#0a192f] border border-white/10 rounded-xl text-sm font-bold text-slate-300 hover:border-[#64ffda]/50 hover:text-[#64ffda] transition-all flex items-center gap-2"
                    >
                      {cat} <Edit3 className="w-3 h-3 opacity-50" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Rename Category Modal */}
              {editingCategoryName && (
                <div className="fixed inset-0 bg-[#0a192f]/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                  <form onSubmit={handleRenameCategory} className="bg-[#112240] w-full max-w-md p-8 rounded-[40px] border border-[#64ffda]/20 shadow-2xl space-y-6">
                    <h3 className="text-2xl font-black text-white">Başlığı Düzenle</h3>
                    <input 
                      required
                      value={editingCategoryName.new} 
                      onChange={(e) => setEditingCategoryName({...editingCategoryName, new: e.target.value})} 
                      className="w-full bg-[#0a192f] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda]" 
                    />
                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setEditingCategoryName(null)} className="flex-1 py-4 border border-white/10 rounded-2xl text-slate-400 font-bold hover:bg-white/5">İptal</button>
                      <button type="submit" disabled={updating} className="flex-1 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest">Kaydet</button>
                    </div>
                  </form>
                </div>
              )}

<div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-[#64ffda]/10 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-[#64ffda]" />
                   </div>
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Yeni Ürün Ekle</h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowBulkMode(!showBulkMode)}
                  className="px-6 py-2 bg-[#64ffda]/10 border border-[#64ffda]/20 rounded-xl text-[10px] font-black text-[#64ffda] uppercase tracking-widest hover:bg-[#64ffda]/20 transition-all flex items-center gap-2"
                >
                  <Database className="w-3 h-3" />
                  {showBulkMode ? 'Tekli Ürün Ekle' : 'Toplu Excel Yükle'}
                </button>
              </div>

              {showBulkMode ? (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                  {bulkPreview.length === 0 ? (
                    <div className="bg-white/5 p-12 rounded-[48px] border-2 border-dashed border-[#64ffda]/20 text-center space-y-8">
                      <div className="space-y-2">
                        <div className="w-20 h-20 bg-[#64ffda]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <Upload className="w-10 h-10 text-[#64ffda]" />
                        </div>
                        <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Excel ile Menü Yükle</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                          Yüzlerce ürünü saniyeler içinde yüklemek için hazırladığımız şablonu kullanın.
                        </p>
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                        <button 
                          onClick={downloadProductTemplate}
                          className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                        >
                          <Download className="w-4 h-4 text-[#64ffda]" /> Şablonu İndir
                        </button>
                        
                        <label className="cursor-pointer px-10 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#64ffda]/20 flex items-center gap-3">
                          <Plus className="w-4 h-4" /> Dosya Seç ve Yükle
                          <input 
                            type="file" 
                            className="hidden" 
                            accept=".csv" 
                            onChange={handleProductFileUpload} 
                            disabled={updating}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#112240] p-8 rounded-[40px] border border-[#64ffda]/20 space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Yükleme Önizlemesi ({bulkPreview.length} Ürün)</h4>
                        <button onClick={() => setBulkPreview([])} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest">İptal Et</button>
                      </div>
                      
                      <div className="max-h-[300px] overflow-y-auto no-scrollbar rounded-2xl border border-white/5">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#0a192f] text-slate-500 font-black uppercase tracking-widest sticky top-0">
                            <tr>
                              <th className="px-6 py-4">Ürün Adı</th>
                              <th className="px-6 py-4">Fiyat</th>
                              <th className="px-6 py-4">Kategori</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {bulkPreview.map((p, i) => (
                              <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-white font-bold">{p.name}</td>
                                <td className="px-6 py-4 text-[#64ffda] font-black">{p.price} TL</td>
                                <td className="px-6 py-4 text-slate-400">{p.category}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <button 
                        onClick={handleConfirmBulkUpload}
                        disabled={updating}
                        className="w-full py-5 bg-[#64ffda] text-[#0a192f] rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-[#64ffda]/20 flex items-center justify-center gap-3"
                      >
                        {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> KAYITLARI ONAYLA VE MENÜYE EKLE</>}
                      </button>
                    </div>
                  )}

                  {updating && bulkPreview.length === 0 && (
                    <div className="flex items-center justify-center gap-3 text-[#64ffda] font-bold text-xs uppercase tracking-widest animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin" /> Dosya İşleniyor...
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleAddProduct} className="bg-white/5 p-10 rounded-[48px] border border-white/5 space-y-8 relative overflow-hidden">
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
                    <div className="flex flex-wrap gap-2 mb-2">
                      {Array.from(new Set([
                        'Ana Yemekler', 'Atıştırmalıklar', 'İçecekler', 'Tatlılar', 'Popüler',
                        ...products.filter(Boolean).map(p => p?.category || 'Genel')
                      ])).sort().map((cat: any) => (
                        <button 
                          key={cat} 
                          type="button" 
                          onClick={() => setNewProduct({...newProduct, category: cat})}
                          className={`px-3 py-1 border text-[10px] font-bold rounded-lg transition-colors ${
                            newProduct.category === cat 
                              ? 'bg-[#64ffda]/10 border-[#64ffda] text-[#64ffda]' 
                              : 'bg-[#0a192f] border-white/10 text-slate-400 hover:border-[#64ffda]/50 hover:text-[#64ffda]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <input 
                      required
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-[#0a192f] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda] transition-all outline-none"
                      placeholder="Farklı bir başlık eklemek için buraya yazın..."
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ürün Görseli</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="file"
                        ref={productImageInputRef}
                        onChange={(e) => e.target.files?.[0] && handleProductImageUpload(e.target.files[0])}
                        className="hidden"
                        accept="image/*"
                      />
                      {newProduct.image_url ? (
                        <div className="relative w-full h-14 bg-white/5 rounded-2xl flex items-center justify-between px-4 border border-white/10 overflow-hidden">
                          <span className="text-[10px] font-bold text-[#64ffda] truncate">Görsel Atandı</span>
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                            <img src={newProduct.image_url} className="w-full h-full object-cover" />
                          </div>
                          <button type="button" onClick={() => setNewProduct({...newProduct, image_url: ''})} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40">
                             <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            type="button"
                            onClick={() => productImageInputRef.current?.click()}
                            disabled={uploading}
                            className="bg-[#0a192f] border border-dashed border-white/20 rounded-2xl py-3 text-slate-400 hover:text-[#64ffda] hover:border-[#64ffda]/50 transition-all flex items-center justify-center gap-2 text-[10px] font-bold"
                          >
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-4 h-4" /> YENİ YÜKLE</>}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setShowGalleryModal({ isOpen: true, target: 'new' })}
                            className="bg-[#64ffda]/5 border border-[#64ffda]/20 rounded-2xl py-3 text-[#64ffda] hover:bg-[#64ffda]/10 transition-all flex items-center justify-center gap-2 text-[10px] font-bold"
                          >
                            <ImageIcon className="w-4 h-4" /> GALERİDEN SEÇ
                          </button>
                        </div>
                      )}
                    </div>
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
                <button type="submit" disabled={updating || uploading} className="w-full py-5 bg-[#64ffda] text-[#0a192f] rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-[#64ffda]/10 disabled:opacity-50">
                  {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  YENİ ÜRÜNÜ MENÜYE EKLE
                </button>
              </form>
            )}

            {editingProduct && (
                <div className="fixed inset-0 bg-[#0a192f]/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                  <form onSubmit={handleUpdateProduct} className="bg-[#112240] w-full max-w-2xl p-8 rounded-[40px] border border-[#64ffda]/20 shadow-2xl space-y-6">
                    <h3 className="text-2xl font-black text-white">Ürünü Düzenle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Ürün Adı</label>
                        <input value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-[#0a192f] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Fiyat (TL)</label>
                        <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full bg-[#0a192f] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Kategori</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {Array.from(new Set([
                            'Ana Yemekler', 'Atıştırmalıklar', 'İçecekler', 'Tatlılar', 'Popüler',
                            ...products.filter(Boolean).map(p => p?.category || 'Genel')
                          ])).sort().map((cat: any) => (
                            <button 
                              key={cat} 
                              type="button" 
                              onClick={() => setEditingProduct({...editingProduct, category: cat})}
                              className={`px-3 py-1 border text-[10px] font-bold rounded-lg transition-colors ${
                                editingProduct.category === cat 
                                  ? 'bg-[#64ffda]/10 border-[#64ffda] text-[#64ffda]' 
                                  : 'bg-[#0a192f] border-white/10 text-slate-400 hover:border-[#64ffda]/50 hover:text-[#64ffda]'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        <input 
                          required
                          value={editingProduct.category} 
                          onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} 
                          className="w-full bg-[#0a192f] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#64ffda]" 
                          placeholder="Farklı bir başlık yazın..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Ürün Görseli</label>
                        <input type="file" ref={editProductImageInputRef} onChange={(e) => e.target.files?.[0] && handleProductImageUpload(e.target.files[0], true)} className="hidden" accept="image/*" />
                        
                        {editingProduct.image_url ? (
                          <div className="relative w-full h-14 bg-[#0a192f] rounded-2xl flex items-center justify-between px-4 border border-white/5">
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                              <img src={editingProduct.image_url} className="w-full h-full object-cover" />
                            </div>
                            <button type="button" onClick={() => setEditingProduct({...editingProduct, image_url: ''})} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 transition-colors">
                               <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => editProductImageInputRef.current?.click()} className="py-4 bg-[#0a192f] border border-white/5 rounded-2xl text-slate-400 font-bold flex items-center gap-2 justify-center hover:bg-white/5 text-[10px] uppercase">
                              <Upload className="w-4 h-4" /> Yeni Yükle
                            </button>
                            <button type="button" onClick={() => setShowGalleryModal({ isOpen: true, target: 'edit' })} className="py-4 bg-[#64ffda]/5 border border-[#64ffda]/20 rounded-2xl text-[#64ffda] font-bold flex items-center gap-2 justify-center hover:bg-[#64ffda]/10 text-[10px] uppercase">
                              <ImageIcon className="w-4 h-4" /> Galeriden Seç
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 py-4 border border-white/10 rounded-2xl text-slate-400 font-bold hover:bg-white/5">İptal</button>
                      <button type="submit" disabled={updating} className="flex-1 py-4 bg-[#64ffda] text-[#0a192f] rounded-2xl font-black uppercase tracking-widest">Kaydet</button>
                    </div>
                  </form>
                </div>
              )}

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
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-black text-[#64ffda]">{p.price} TL</div>
                      <div className="flex items-center bg-[#0a192f] rounded-xl overflow-hidden border border-white/5">
                        <button onClick={() => setEditingProduct(p)} className="p-3 text-slate-400 hover:text-white transition-colors hover:bg-white/5 border-r border-white/5">
                          <Settings className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-3 text-red-500/50 hover:text-red-500 transition-colors hover:bg-red-500/10">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: QR Menu */}
          {activeTab === 'qr' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-black text-white mb-2 tracking-tighter italic uppercase">QR Menü Yönetimi</h2>
                  <p className="text-slate-400">Masalarınıza koymak için işletmenize özel QR kod oluşturun.</p>
                </div>
                <div className="w-16 h-16 bg-[#64ffda]/10 rounded-full flex items-center justify-center border border-[#64ffda]/20 shadow-[0_0_30px_rgba(100,255,218,0.1)]">
                  <QrCode className="w-8 h-8 text-[#64ffda]" />
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 space-y-6">
                    <h3 className="text-xl font-black text-white flex items-center gap-3 italic uppercase">
                      <Sparkles className="w-5 h-5 text-[#64ffda]" /> QR Menü Avantajları
                    </h3>
                    <ul className="space-y-4">
                      {[
                        'Baskı maliyetinden tasarruf edin.',
                        'Menünüzü anında güncelleyin.',
                        'WhatsApp üzerinden masadan sipariş alın.',
                        'Hijyenik ve modern bir deneyim sunun.'
                      ].map((text, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                          <div className="w-1.5 h-1.5 bg-[#64ffda] rounded-full shadow-[0_0_10px_#64ffda]" />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Menü Bağlantınız</p>
                    <div className="flex items-center gap-3 bg-[#0a192f] p-4 rounded-2xl border border-white/5 group">
                      <input 
                        readOnly
                        value={`https://fethiye360.com/isletme/${business.slug}`}
                        className="flex-1 bg-transparent text-slate-300 text-sm font-medium outline-none"
                      />
                      <a 
                        href={`/isletme/${business.slug}`} 
                        target="_blank" 
                        className="text-[#64ffda] hover:scale-110 transition-transform"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-8">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-[#64ffda]/20 rounded-[48px] blur-[40px] group-hover:blur-[60px] transition-all opacity-50" />
                    <div className="relative bg-white p-10 rounded-[48px] shadow-2xl overflow-hidden">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://fethiye360.com/isletme/${business.slug}&bgcolor=ffffff&color=0a192f&margin=1`}
                        alt="QR Code"
                        className="w-48 h-48 md:w-64 md:h-64"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-full gap-4">
                    <button 
                      onClick={() => {
                        const url = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=https://fethiye360.com/isletme/${business.slug}&bgcolor=ffffff&color=0a192f&margin=1`
                        window.open(url, '_blank')
                      }}
                      className="w-full py-5 bg-[#64ffda] text-[#0a192f] rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-[#64ffda]/20 flex items-center justify-center gap-3"
                    >
                      <Download className="w-5 h-5" /> QR KODU YÜKSEK KALİTE İNDİR
                    </button>
                    <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      Bu kodu masalarınıza bastırıp koyabilirsiniz.
                    </p>
                  </div>
                </div>
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
      {/* Image Library Modal */}
      {showGalleryModal.isOpen && (
        <div className="fixed inset-0 z-[200] bg-[#0a192f]/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#112240] w-full max-w-4xl max-h-[80vh] rounded-[40px] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda]">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">İşletme Görsel Kütüphanesi</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Kullanmak istediğiniz görsele tıklayın</p>
                </div>
              </div>
              <button 
                onClick={() => setShowGalleryModal({ isOpen: false, target: 'new' })}
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              {gallery.length === 0 ? (
                <div className="text-center py-20">
                  <Camera className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Henüz galeride fotoğraf yok.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {gallery.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => {
                        if (showGalleryModal.target === 'new') {
                          setNewProduct({ ...newProduct, image_url: img.image_url })
                        } else {
                          setEditingProduct({ ...editingProduct, image_url: img.image_url })
                        }
                        setShowGalleryModal({ isOpen: false, target: 'new' })
                        toast.success('Görsel seçildi!')
                      }}
                      className="aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#64ffda] transition-all group relative"
                    >
                      <Image 
                        src={img.image_url} 
                        alt="Gallery" 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-[#64ffda]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Plus className="w-8 h-8 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 bg-black/20 text-center">
              <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">Profil sayfanızdan yeni fotoğraflar ekleyebilirsiniz</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
