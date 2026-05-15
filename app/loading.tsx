export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a192f]">
      {/* Minimal Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#64ffda]/10 rounded-full blur-[80px]" />
      
      <div className="relative flex flex-col items-center gap-4">
        {/* Simple CSS Spinner */}
        <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#64ffda] to-blue-500 flex items-center justify-center shadow-xl shadow-[#64ffda]/20">
          <div className="w-12 h-12 bg-[#0a192f] rounded-[16px] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#64ffda] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-black text-white tracking-tighter uppercase italic">
            Fethiye<span className="text-[#64ffda]">360</span>
          </h2>
          <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#64ffda] w-1/3 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
