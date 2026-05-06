export function PostSkeleton() {
  return (
    <div className="bg-[#112240] rounded-[48px] border border-white/5 overflow-hidden shadow-2xl animate-pulse">
      {/* Header Skeleton */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5" />
          <div className="space-y-2">
            <div className="w-24 h-3 bg-white/10 rounded-full" />
            <div className="w-16 h-2 bg-white/5 rounded-full" />
          </div>
        </div>
      </div>

      {/* Media Skeleton */}
      <div className="aspect-square bg-white/5" />

      {/* Actions Skeleton */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-6">
          <div className="w-8 h-8 bg-white/5 rounded-full" />
          <div className="w-8 h-8 bg-white/5 rounded-full" />
          <div className="w-8 h-8 bg-white/5 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="w-full h-3 bg-white/10 rounded-full" />
          <div className="w-2/3 h-3 bg-white/5 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function PostGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="aspect-square bg-[#112240] rounded-2xl md:rounded-[48px] animate-pulse border border-white/5" />
      ))}
    </div>
  )
}
