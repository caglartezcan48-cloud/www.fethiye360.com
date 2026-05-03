import { createClient } from '@/lib/supabase/server'
import { Eye, TrendingUp, Calendar, MapPin } from 'lucide-react'

export default async function StatisticsPage() {
  const supabase = await createClient()

  // Son 30 gunluk istatistikler
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const today = new Date().toISOString().split('T')[0]

  const [toursRes, last30DaysRes, last7DaysRes, todayRes] = await Promise.all([
    supabase.from('tours').select('id, name, view_count, location').order('view_count', { ascending: false }).limit(10),
    supabase.from('tour_stats').select('view_count').gte('view_date', thirtyDaysAgo),
    supabase.from('tour_stats').select('view_count').gte('view_date', sevenDaysAgo),
    supabase.from('tour_stats').select('view_count').eq('view_date', today),
  ])

  const totalViews = toursRes.data?.reduce((sum, t) => sum + (t.view_count || 0), 0) || 0
  const last30DaysViews = last30DaysRes.data?.reduce((sum, s) => sum + (s.view_count || 0), 0) || 0
  const last7DaysViews = last7DaysRes.data?.reduce((sum, s) => sum + (s.view_count || 0), 0) || 0
  const todayViews = todayRes.data?.reduce((sum, s) => sum + (s.view_count || 0), 0) || 0

  // Kategori bazli istatistikler
  const { data: categoryStats } = await supabase
    .from('tours')
    .select(`
      view_count,
      categories (name)
    `)

  const categoryViewCounts: Record<string, number> = {}
  categoryStats?.forEach(tour => {
    const catName = tour.categories?.name || 'Kategorisiz'
    categoryViewCounts[catName] = (categoryViewCounts[catName] || 0) + (tour.view_count || 0)
  })

  const stats = [
    { label: 'Toplam Goruntulenme', value: totalViews, icon: Eye, color: 'bg-blue-500/20 text-blue-400' },
    { label: 'Son 30 Gun', value: last30DaysViews, icon: Calendar, color: 'bg-purple-500/20 text-purple-400' },
    { label: 'Son 7 Gun', value: last7DaysViews, icon: TrendingUp, color: 'bg-green-500/20 text-green-400' },
    { label: 'Bugun', value: todayViews, icon: Eye, color: 'bg-[#64ffda]/20 text-[#64ffda]' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Istatistikler</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-[#112240] rounded-xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value.toLocaleString('tr-TR')}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* En Populer Turlar */}
        <div className="bg-[#112240] rounded-xl border border-slate-700/50">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white">En Populer Turlar</h2>
          </div>
          <div className="divide-y divide-slate-700/50">
            {toursRes.data && toursRes.data.length > 0 ? (
              toursRes.data.map((tour, index) => (
                <div key={tour.id} className="p-4 flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < 3 ? 'bg-[#64ffda]/20 text-[#64ffda]' : 'bg-slate-700/50 text-slate-400'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{tour.name}</h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {tour.location || 'Konum yok'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{(tour.view_count || 0).toLocaleString('tr-TR')}</p>
                    <p className="text-xs text-slate-400">goruntulenme</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">
                Henuz veri yok
              </div>
            )}
          </div>
        </div>

        {/* Kategori Bazli */}
        <div className="bg-[#112240] rounded-xl border border-slate-700/50">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white">Kategori Bazli Goruntulenme</h2>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(categoryViewCounts).length > 0 ? (
              Object.entries(categoryViewCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => {
                  const percentage = totalViews > 0 ? (count / totalViews) * 100 : 0
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300">{category}</span>
                        <span className="text-white font-medium">{count.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#64ffda] rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })
            ) : (
              <div className="text-center text-slate-400 py-8">
                Henuz veri yok
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
