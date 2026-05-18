'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Map,
  FolderOpen,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Building2,
  Users,
  MessageSquare,
  Camera,
  ShieldAlert,
  MapPin,
  Image,
} from 'lucide-react'

interface AdminUser {
  id: string
  email?: string
  full_name?: string | null
  is_super_admin?: boolean
}

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bannerlar', label: 'Banner Yonetimi', icon: Image },
  { href: '/admin/turlar', label: 'Turlar', icon: Map },
  { href: '/admin/kategoriler', label: 'Kategoriler', icon: FolderOpen },
  { href: '/admin/isletmeler', label: 'İşletmeler', icon: Building2 },
  { href: '/admin/kullanicilar', label: 'Kullanıcılar', icon: Users },
  { href: '/admin/yorumlar', label: 'Yorumlar', icon: MessageSquare },
  { href: '/admin/sosyal-onay', label: 'Sosyal Onay', icon: Camera },
  { href: '/admin/destinasyonlar', label: 'Destinasyonlar', icon: MapPin },
  { href: '/admin/istatistikler', label: 'Istatistikler', icon: BarChart3 },
  { href: '/admin/sistem-hatalari', label: 'Hata Uyarı Sistemi', icon: ShieldAlert },
  { href: '/admin/ayarlar', label: 'Ayarlar', icon: Settings },
]

export default function AdminSidebar({ user }: { user: AdminUser }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/giris')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#112240] border-r border-slate-700/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <Link href="/admin" className="block">
          <h1 className="text-xl font-bold text-white">
            Fethiye<span className="text-[#64ffda]">360</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Admin Paneli</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#64ffda]/10 text-[#64ffda]'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-slate-700/50 space-y-2">
        {/* View Site */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Siteyi Gor</span>
        </Link>

        {/* User Info */}
        <div className="px-4 py-3">
          <p className="text-sm text-white font-medium truncate">
            {user.full_name || user.email}
          </p>
          <p className="text-xs text-slate-400 truncate">{user.email}</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cikis Yap</span>
        </button>
      </div>
    </aside>
  )
}
