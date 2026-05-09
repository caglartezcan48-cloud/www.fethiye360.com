'use client'

import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ShareButton({ username }: { username: string }) {
    return (
        <button 
            onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                toast.success('Profil bağlantısı kopyalandı! 🔗')
            }}
            className="px-6 py-3 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-[#64ffda]/10 hover:text-[#64ffda] transition-all shadow-xl flex items-center gap-2 font-black text-xs uppercase tracking-widest"
        >
            <Share2 className="w-4 h-4" /> Paylaş
        </button>
    )
}
