import { createClient } from '@/lib/supabase/server'
import BusinessForm from '@/components/admin/business-form'

export default async function AddBusinessPage() {
  const supabase = await createClient()

  // Kategorileri çekelim
  const { data: categories } = await supabase
    .from('business_categories')
    .select('id, name')
    .order('name')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Yeni İşletme Ekle</h1>
        <p className="text-slate-400 mt-1">Fethiye rehberine yeni bir değer ekleyin</p>
      </div>

      <BusinessForm categories={categories || []} />
    </div>
  )
}
