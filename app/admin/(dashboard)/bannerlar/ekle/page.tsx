import BannerForm from '@/components/admin/banner-form'

export default function AddBannerPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Yeni Banner Ekle</h1>
        <p className="text-slate-400 text-sm mt-1">Ana sayfa hero alanina yeni bir reklam banneri ekleyin</p>
      </div>

      <BannerForm />
    </div>
  )
}
