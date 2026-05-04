import { createClient } from '@/lib/supabase/server'
import TourForm from '@/components/admin/tour-form'

export default async function AddTourPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Yeni Tur Ekle</h1>
      <TourForm categories={categories || []} />
    </div>
  )
}
