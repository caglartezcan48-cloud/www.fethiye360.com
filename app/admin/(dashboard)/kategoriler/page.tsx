'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Loader2, FolderOpen, X, Check } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  tours_count?: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', icon: '' })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const supabase = createClient()

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        icon,
        tours:tours(count)
      `)
      .order('name')

    if (data) {
      setCategories(data.map(cat => ({
        ...cat,
        tours_count: cat.tours?.[0]?.count || 0
      })))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const handleSave = async () => {
    if (!formData.name.trim()) return
    setSaving(true)

    try {
      if (editingId) {
        await supabase
          .from('categories')
          .update({ 
            name: formData.name, 
            slug: generateSlug(formData.name),
            icon: formData.icon || null 
          })
          .eq('id', editingId)
      } else {
        await supabase
          .from('categories')
          .insert({ 
            name: formData.name, 
            slug: generateSlug(formData.name),
            icon: formData.icon || null 
          })
      }

      await fetchCategories()
      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', icon: '' })
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id)
    setFormData({ name: cat.name, icon: cat.icon || '' })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id)
    await fetchCategories()
    setDeleteId(null)
  }

  const iconOptions = [
    { value: 'waves', label: 'Dalga (Plaj)' },
    { value: 'landmark', label: 'Anit (Tarihi)' },
    { value: 'trees', label: 'Agac (Doga)' },
    { value: 'building', label: 'Bina (Sehir)' },
    { value: 'mountain', label: 'Dag' },
    { value: 'camera', label: 'Kamera' },
    { value: 'sun', label: 'Gunes' },
    { value: 'ship', label: 'Gemi' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Kategoriler</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({ name: '', icon: '' })
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-lg font-medium hover:bg-[#52e0c4] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Kategori
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#64ffda] animate-spin" />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-[#112240] rounded-xl border border-slate-700/50 p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#64ffda]/10 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-[#64ffda]" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{cat.name}</h3>
                  <p className="text-sm text-slate-400">{cat.tours_count} tur</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(cat.id)}
                  className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#112240] rounded-xl border border-slate-700/50 p-12 text-center">
          <FolderOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Kategori yok</h3>
          <p className="text-slate-400 mb-6">Ilk kategorinizi ekleyerek baslayın</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#112240] rounded-xl p-6 max-w-md w-full mx-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {editingId ? 'Kategori Duzenle' : 'Yeni Kategori'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Kategori Adi</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors"
                  placeholder="Ornegin: Plaj"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Ikon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full bg-[#0a192f] border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-colors"
                >
                  <option value="">Ikon Sec</option>
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-colors"
              >
                Iptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name.trim()}
                className="flex-1 px-4 py-3 rounded-lg bg-[#64ffda] text-[#0a192f] font-medium hover:bg-[#52e0c4] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#112240] rounded-xl p-6 max-w-md w-full mx-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Kategoriyi Sil</h3>
            <p className="text-slate-400 mb-6">
              Bu kategoriyi silmek istediginize emin misiniz? Kategoriye ait turlar silinmeyecek, sadece kategorisiz kalacak.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
              >
                Iptal
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
