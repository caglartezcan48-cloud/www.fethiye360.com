'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Compass, 
  PlusSquare, 
  MessageCircle, 
  User,
  Bell
} from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/sosyal', icon: Home, label: 'Akış' },
    { href: '/kesfet', icon: Compass, label: 'Keşfet' },
    { href: '/sosyal/yukle', icon: PlusSquare, label: 'Paylaş', special: true },
    { href: '/bildirimler', icon: Bell, label: 'Bildirimler' },
    { href: '/profil', icon: User, label: 'Profil' }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-8 md:pb-10 pointer-events-none">
      <nav className="max-w-lg mx-auto bg-[#0a192f]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-2 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto ring-1 ring-white/5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`relative flex flex-col items-center p-3 rounded-2xl transition-all duration-300 group ${isActive ? 'text-[#64ffda]' : 'text-slate-500 hover:text-white'}`}
            >
              {item.special ? (
                <div className="w-12 h-12 bg-gradient-to-br from-[#64ffda] to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-[#64ffda]/20 group-hover:scale-110 group-active:scale-95 transition-all -translate-y-2 border-4 border-[#0a192f]">
                  <Icon className="w-6 h-6 text-[#0a192f]" />
                </div>
              ) : (
                <>
                  <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-[#64ffda] rounded-full shadow-[0_0_8px_#64ffda]" />
                  )}
                </>
              )}
              {/* Tooltip for desktop if needed */}
              <span className="sr-only">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
