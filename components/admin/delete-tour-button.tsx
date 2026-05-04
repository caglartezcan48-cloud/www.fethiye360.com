'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Loader2 } from 'lucide-react'

export default function DeleteTourButton({ 
  tourId, 
  tourName 
}: { 
  tourId: string
  tourName: string 
}) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)
    
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', tourId)

    if (!error) {
      router.refresh()
    }
    
    setLoading(false)
    setShowConfirm(false)
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#112240] rounded-xl p-6 max-w-md w-full mx-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Turu Sil</h3>
            <p className="text-slate-400 mb-6">
              <span className="text-white font-medium">{tourName}</span> turunu silmek istediginize emin misiniz? Bu islem geri alinamaz.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
                disabled={loading}
              >
                Iptal
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Siliniyor...
                  </>
                ) : (
                  'Evet, Sil'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
