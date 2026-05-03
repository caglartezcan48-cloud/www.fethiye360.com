import { createClient } from '@/lib/supabase/server'
import { Map, FolderOpen, Eye, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Istatistikleri cek
  const [toursRes, categoriesRes, statsRes] = await Promise.all([
    supabase.from('tours').select('id, name, view_count', { count: 'exact' }),
    supabase.from('categories').select('id', { count: 'exact' }),
    supabase.from('tour_stats').select('view_count').gte('view_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
  ])

  const tourCount = toursRes.count || 0
  const categoryCount = categoriesRes.count || 0
  const totalViews = toursRes.data?.reduce((sum, t) => sum + (t.view_count || 0), 0) || 0
  const weeklyViews = statsRes.data?.reduce((sum, s) => sum + (s.view_count || 0), 0) || 0

  const stats = [
    { label: 'Toplam Tur', value: tourCount, icon: Map, color: 'bg-blue-500/20 text-blue-400' },
    { label: 'Kategori', value: categoryCount, icon: FolderOpen, color: 'bg-purple-500/20 text-purple-400' },
    { label: 'Toplam Goruntulenme', value: totalViews, icon: Eye, color: 'bg-green-500/20 text-green-400' },
    { label: 'Bu Hafta', value: weeklyViews, icon: TrendingUp, color: 'bg-[#64ffda]/20 text-[#64ffda]' },
  ]

  // Son eklenen turlar
  const { data: recentTours } = await supabase
    .from('tours')
    .select('id, name, location, view_count, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      {/* Stats Grid */}
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
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Link
          href="/admin/turlar/ekle"
          className="bg-[#64ffda]/10 border border-[#64ffda]/30 rounded-xl p-6 hover:bg-[#64ffda]/20 transition-colors group"
        >
          <h3 className="text-lg font-semibold text-[#64ffda] mb-2">Yeni Tur Ekle</h3>
          <p className="text-slate-400 text-sm">360 derece sanal tur ekleyerek koleksiyonunuzu genisletin</p>
        </Link>

        <Link
          href="/admin/kategoriler"
          className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 hover:bg-purple-500/20 transition-colors group"
        >
          <h3 className="text-lg font-semibold text-purple-400 mb-2">Kategorileri Yonet</h3>
          <p className="text-slate-400 text-sm">Tur kategorilerini duzenleyin ve yeni kategoriler ekleyin</p>
        </Link>
      </div>

      {/* Recent Tours */}
      <div className="bg-[#112240] rounded-xl border border-slate-700/50">
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Son Eklenen Turlar</h2>
          <Link href="/admin/turlar" className="text-sm text-[#64ffda] hover:underline">
            Tumunu Gor
          </Link>
        </div>
        
        {recentTours && recentTours.length > 0 ? (
          <div className="divide-y divide-slate-700/50">
            {recentTours.map((tour) => (
              <div key={tour.id} className="p-4 flex items-center justify-between hover:bg-slate-700/20">
                <div>
                  <h3 className="text-white font-medium">{tour.name}</h3>
                  <p className="text-sm text-slate-400">{tour.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{tour.view_count || 0}</p>
                  <p className="text-xs text-slate-400">goruntulenme</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-slate-400">Henuz tur eklenmemis</p>
            <Link
              href="/admin/turlar/ekle"
              className="inline-block mt-4 px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-lg font-medium hover:bg-[#52e0c4] transition-colors"
            >
              Ilk Turu Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
