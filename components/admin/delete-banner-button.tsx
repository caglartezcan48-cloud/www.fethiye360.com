'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

interface DeleteBannerButtonProps {
  bannerId: string
  bannerTitle: string
}

export default function DeleteBannerButton({ bannerId, bannerTitle }: DeleteBannerButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm(`"${bannerTitle}" bannerini silmek istediginize emin misiniz?`)) {
      return
    }

    setIsDeleting(true)
    const { error } = await supabase.from('hero_banners').delete().eq('id', bannerId)

    if (error) {
      alert('Banner silinemedi: ' + error.message)
      setIsDeleting(false)
    } else {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
