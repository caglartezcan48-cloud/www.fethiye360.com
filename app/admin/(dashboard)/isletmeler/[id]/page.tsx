import { createClient } from '@/lib/supabase/server'
import BusinessForm from '@/components/admin/business-form'
import { notFound } from 'next/navigation'

export default async function EditBusinessPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  // Isletmeyi cekelim
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!business) {
    notFound()
  }

  // Kategorileri cekelim
  const { data: categories } = await supabase
    .from('business_categories')
    .select('id, name')
    .order('name')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">İşletmeyi Düzenle</h1>
        <p className="text-slate-400 mt-1">{business.name} bilgilerini güncelliyorsunuz</p>
      </div>

      <BusinessForm categories={categories || []} business={business} />
    </div>
  )
}
