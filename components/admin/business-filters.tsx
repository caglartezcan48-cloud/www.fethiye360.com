'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'

interface Category {
  id: string
  name: string
}

export function BusinessFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || ''
  const currentSearch = searchParams.get('q') || ''

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/admin/isletmeler?${params.toString()}`)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="İşletme adı ile ara..."
          defaultValue={currentSearch}
          onChange={(e) => {
            const val = e.target.value
            const timeout = setTimeout(() => updateFilters('q', val), 500)
            return () => clearTimeout(timeout)
          }}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-[#64ffda] transition-colors"
        />
      </div>

      <div className="relative min-w-[200px]">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <select
          value={currentCategory}
          onChange={(e) => updateFilters('category', e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-[#64ffda] transition-colors appearance-none cursor-pointer"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {(currentCategory || currentSearch) && (
        <button
          onClick={() => router.push('/admin/isletmeler')}
          className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
          Temizle
        </button>
      )}
    </div>
  )
}
