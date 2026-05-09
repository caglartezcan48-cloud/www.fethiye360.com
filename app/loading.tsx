import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a192f] transition-opacity duration-300">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#64ffda]/10 rounded-full blur-[100px] animate-pulse" />
      
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated Logo Placeholder */}
        <div className="w-20 h-20 rounded-[32px] bg-gradient-to-br from-[#64ffda] to-blue-500 flex items-center justify-center animate-bounce shadow-2xl shadow-[#64ffda]/20">
          <div className="w-16 h-16 bg-[#0a192f] rounded-[24px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#64ffda] animate-spin" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-black text-white tracking-tighter uppercase italic animate-pulse">
            Fethiye<span className="text-[#64ffda]">360</span>
          </h2>
          <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#64ffda] w-1/2 animate-[loading_1.5s_infinite_ease-in-out]" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}
