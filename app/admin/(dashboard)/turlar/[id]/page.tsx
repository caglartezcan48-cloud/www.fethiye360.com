import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import TourForm from '@/components/admin/tour-form'

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [tourRes, categoriesRes] = await Promise.all([
    supabase.from('tours').select('*').eq('id', id).single(),
    supabase.from('categories').select('id, name').order('name'),
  ])

  if (!tourRes.data) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Turu Duzenle</h1>
      <TourForm 
        categories={categoriesRes.data || []} 
        tour={tourRes.data} 
      />
    </div>
  )
}
