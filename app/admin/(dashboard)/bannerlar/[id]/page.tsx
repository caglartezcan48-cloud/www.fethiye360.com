import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BannerForm from '@/components/admin/banner-form'

interface EditBannerPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: banner, error } = await supabase
    .from('hero_banners')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !banner) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Banner Duzenle</h1>
        <p className="text-slate-400 text-sm mt-1">{banner.title}</p>
      </div>

      <BannerForm banner={banner} isEditing />
    </div>
  )
}
