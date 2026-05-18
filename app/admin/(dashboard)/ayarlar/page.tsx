'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Check, Key, Palette, RefreshCw } from 'lucide-react'

// Signature Fethiye Presets for Background
const FETHIYE_PRESETS = [
  { name: '🌊 Ölüdeniz Mavisi', hex: '#02111a', desc: 'Asil derin deniz mavisi' },
  { name: '🏝️ Kumburnu Turkuazı', hex: '#082830', desc: 'Canlı turkuaz lagün tonu' },
  { name: '🌲 Günlüklü Yeşili', hex: '#041c10', desc: 'Eşsiz yeşil koy esintisi' },
  { name: '🦋 Kelebekler Vadisi', hex: '#030f25', desc: 'Gizemli derin çivit/indigo' },
  { name: '🌅 Çalış Günbatımı', hex: '#241804', desc: 'Sıcak altın günbatımı bakırı' },
  { name: '🐚 Saf Beyaz Plaj', hex: '#ffffff', desc: 'Ultra-aydınlık premium beyaz' },
  { name: '💎 Krem Platin', hex: '#f8f9fa', desc: 'Zarif kum platin açık krem' },
]

// Premium Presets for Buttons & Highlights
const BUTTON_PRESETS = [
  { name: '🏖️ Ölüdeniz Turkuazı', hex: '#64ffda', desc: 'Klasik parlak turkuaz' },
  { name: '🌟 Çalış Altını', hex: '#e5a93b', desc: 'Lüks altın sarısı' },
  { name: '🌸 Begonvil Pembesi', hex: '#e11d48', desc: 'Akdeniz begonvili' },
  { name: '🍇 Karadut Moru', hex: '#7c3aed', desc: 'Derin karadut moru' },
  { name: '🍊 Turunç Turuncusu', hex: '#ea580c', desc: 'Fethiye turunç tonu' },
  { name: '🌊 Akdeniz Mavisi', hex: '#0066cc', desc: 'Göz alıcı deniz mavisi' },
  { name: '🌲 Likya Yeşili', hex: '#10b981', desc: 'Doğal orman yeşili' },
]

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Selected configuration targets
  const [selectedTarget, setSelectedTarget] = useState('global')
  const [themeSettings, setThemeSettings] = useState<Record<string, string>>({})

  // Main picker states
  const [selectedColor, setSelectedColor] = useState('#02111a')
  const [selectedBtnColor, setSelectedBtnColor] = useState('#64ffda')
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  // Target page configuration options
  const PAGE_OPTIONS = [
    { id: 'global', name: '🌍 Genel (Site-Geneli Varsayılan)', path: 'global' },
    { id: 'navbar', name: '⚓ Üst Menü (Navbar)', path: 'navbar' },
    { id: 'anasayfa', name: '🏠 Anasayfa (/)', path: '/' },
    { id: 'isletmeler', name: '🏢 İşletmeler (/isletmeler)', path: '/isletmeler' },
    { id: 'rehber', name: '📖 Rehber (/rehber)', path: '/rehber' },
    { id: 'sosyal', name: '💬 Sosyal Paylaşım (/sosyal)', path: '/sosyal' },
    { id: 'planla', name: '📅 Aktivite Planlama (/aktivite-planla)', path: '/aktivite-planla' },
    { id: 'mesajlar', name: '✉️ Mesajlar (/mesajlar)', path: '/mesajlar' },
    { id: 'bildirimler', name: '🔔 Bildirimler (/bildirimler)', path: '/bildirimler' },
    { id: 'profil', name: '👤 Kullanıcı Profili (/profil)', path: '/profil' },
  ]

  // Load all theme configurations from database on mount
  useEffect(() => {
    async function loadThemeSettings() {
      try {
        const { data } = await supabase
          .from('hero_banners')
          .select('alt_text, background_image')
          .or('alt_text.like.SYSTEM_%,alt_text.like.PAGE_%,alt_text.like.NAVBAR_%')
        
        if (data) {
          const settings: Record<string, string> = {}
          data.forEach(item => {
            if (item.alt_text) {
              settings[item.alt_text] = item.background_image || ''
            }
          })
          setThemeSettings(settings)
          
          // Set inputs to global values initially
          setSelectedColor(settings['SYSTEM_BG_COLOR'] || '#02111a')
          setSelectedBtnColor(settings['SYSTEM_BTN_COLOR'] || '#64ffda')
        }
      } catch (err) {
        console.error('Tema ayarları yüklenemedi:', err)
      }
    }
    loadThemeSettings()
  }, [supabase])

  // Handle targeting target updates
  const handleTargetChange = (targetId: string) => {
    setSelectedTarget(targetId)
    const target = PAGE_OPTIONS.find(o => o.id === targetId)
    if (!target) return

    let bgKey = ''
    let btnKey = ''
    let defaultBg = '#02111a'
    let defaultBtn = '#64ffda'

    if (target.id === 'global') {
      bgKey = 'SYSTEM_BG_COLOR'
      btnKey = 'SYSTEM_BTN_COLOR'
    } else if (target.id === 'navbar') {
      bgKey = 'NAVBAR_BG_COLOR'
      btnKey = 'NAVBAR_BTN_COLOR'
      defaultBg = '#0a192f'
    } else {
      bgKey = `PAGE_BG_COLOR_${target.path}`
      btnKey = `PAGE_BTN_COLOR_${target.path}`
    }

    setSelectedColor(themeSettings[bgKey] || defaultBg)
    setSelectedBtnColor(themeSettings[btnKey] || defaultBtn)
  }

  // Save selected target theme configurations to Supabase
  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveLoading(true)
    setSaveMessage(null)

    if (!selectedColor.startsWith('#') || selectedColor.length !== 7 ||
        !selectedBtnColor.startsWith('#') || selectedBtnColor.length !== 7) {
      setSaveMessage({ type: 'error', text: 'Lütfen geçerli HEX renk kodları girin (Örn: #02111a)' })
      setSaveLoading(false)
      return
    }

    const target = PAGE_OPTIONS.find(o => o.id === selectedTarget)
    if (!target) {
      setSaveLoading(false)
      return
    }

    let bgKey = ''
    let btnKey = ''

    if (target.id === 'global') {
      bgKey = 'SYSTEM_BG_COLOR'
      btnKey = 'SYSTEM_BTN_COLOR'
    } else if (target.id === 'navbar') {
      bgKey = 'NAVBAR_BG_COLOR'
      btnKey = 'NAVBAR_BTN_COLOR'
    } else {
      bgKey = `PAGE_BG_COLOR_${target.path}`
      btnKey = `PAGE_BTN_COLOR_${target.path}`
    }

    try {
      // 1. Upsert Background Color row
      const { data: existingBg } = await supabase
        .from('hero_banners')
        .select('id')
        .eq('alt_text', bgKey)
        .maybeSingle()

      if (existingBg) {
        const { error } = await supabase
          .from('hero_banners')
          .update({ background_image: selectedColor })
          .eq('alt_text', bgKey)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('hero_banners')
          .insert({
            alt_text: bgKey,
            background_image: selectedColor,
            is_active: false,
            title: `Custom Background for ${target.name}`,
            display_order: 999999,
            scroll_speed: 30,
            scroll_direction: 'left'
          })
        if (error) throw error
      }

      // 2. Upsert Button Color row
      const { data: existingBtn } = await supabase
        .from('hero_banners')
        .select('id')
        .eq('alt_text', btnKey)
        .maybeSingle()

      if (existingBtn) {
        const { error } = await supabase
          .from('hero_banners')
          .update({ background_image: selectedBtnColor })
          .eq('alt_text', btnKey)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('hero_banners')
          .insert({
            alt_text: btnKey,
            background_image: selectedBtnColor,
            is_active: false,
            title: `Custom Button for ${target.name}`,
            display_order: 999998,
            scroll_speed: 30,
            scroll_direction: 'left'
          })
        if (error) throw error
      }

      // Sync local state
      const updated = { ...themeSettings }
      updated[bgKey] = selectedColor
      updated[btnKey] = selectedBtnColor
      setThemeSettings(updated)

      setSaveMessage({ type: 'success', text: `"${target.name}" tasarımı başarıyla kaydedildi! Sitede anında uygulandı.` })
      router.refresh()
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: 'Kaydedilirken hata oluştu: ' + err.message })
    } finally {
      setSaveLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordMessage(null)

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor' })
      setPasswordLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalı' })
      setPasswordLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        setPasswordMessage({ type: 'error', text: 'Şifre değiştirilemedi: ' + error.message })
      } else {
        setPasswordMessage({ type: 'success', text: 'Şifre başarıyla değiştirildi' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'Bir hata oluştu' })
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Sistem Ayarları</h1>

      <div className="max-w-4xl space-y-8">
        
        {/* UNIFIED SAYFA-BAZLI VE NAVBAR RENK ÖZELLEŞTİRME PANELİ */}
        <div className="bg-[#112240] rounded-2xl border border-slate-700/50 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#64ffda]/5 rounded-full blur-[80px] -z-10" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#64ffda]/10 flex items-center justify-center border border-[#64ffda]/20">
              <Palette className="w-6 h-6 text-[#64ffda]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Sayfa & Menü Özel Tasarım Paneli</h2>
              <p className="text-sm text-slate-400">Genel siteyi, dilediğiniz özel sayfayı veya üst menüyü (navbar) ayrı renk kodları ile özelleştirin.</p>
            </div>
          </div>

          <form onSubmit={handleSaveTheme} className="space-y-6">
            
            {/* Target Area Selector */}
            <div className="bg-[#0a192f]/50 p-5 rounded-2xl border border-white/5 space-y-3">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-widest">Özelleştirilecek Sayfa veya Alanı Seçin</label>
              <select
                value={selectedTarget}
                onChange={(e) => handleTargetChange(e.target.value)}
                className="w-full h-14 bg-[#0a192f] border border-slate-600 rounded-xl px-4 text-white text-sm font-bold tracking-wide focus:outline-none focus:border-[#64ffda] transition-all cursor-pointer"
              >
                {PAGE_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id} className="bg-[#112240] text-white text-xs py-2 font-bold uppercase tracking-wider">
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              
              {/* ZEMİN RENGİ CUSTOMIZER */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-[#64ffda] uppercase tracking-wider mb-1">1. Seçilen Alanın Zemin Rengi</h3>
                  <p className="text-[11px] text-slate-400">İlgili sayfa veya alanın zemin (arka plan) rengini belirleyin.</p>
                </div>

                <div className="flex gap-4">
                  <div className="relative w-16 h-14 rounded-xl overflow-hidden border border-slate-600/80 shadow-md">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer bg-transparent scale-150"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full h-14 bg-[#0a192f] border border-slate-600 rounded-xl px-4 text-white text-base font-mono uppercase tracking-widest focus:outline-none focus:border-[#64ffda] transition-all"
                      placeholder="#02111a"
                      maxLength={7}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Zemin Hazır Paletleri</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-2 no-scrollbar">
                    {FETHIYE_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setSelectedColor(preset.hex)}
                        className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                          selectedColor.toLowerCase() === preset.hex.toLowerCase()
                            ? 'bg-[#64ffda]/10 border-[#64ffda] text-white shadow-md'
                            : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
                        }`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full inline-block border border-white/20" style={{ backgroundColor: preset.hex }} />
                          {preset.name}
                        </span>
                        <span className="text-[8px] text-slate-500 font-bold uppercase mt-0.5 tracking-widest">{preset.hex}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* BUTON VE VURGU RENGİ CUSTOMIZER */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-1">2. Seçilen Alanın Buton & Vurgu Rengi</h3>
                  <p className="text-[11px] text-slate-400">Butonlar, etiketler ve aktif vurgu öğelerinin rengini belirleyin.</p>
                </div>

                <div className="flex gap-4">
                  <div className="relative w-16 h-14 rounded-xl overflow-hidden border border-slate-600/80 shadow-md">
                    <input
                      type="color"
                      value={selectedBtnColor}
                      onChange={(e) => setSelectedBtnColor(e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer bg-transparent scale-150"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={selectedBtnColor}
                      onChange={(e) => setSelectedBtnColor(e.target.value)}
                      className="w-full h-14 bg-[#0a192f] border border-slate-600 rounded-xl px-4 text-white text-base font-mono uppercase tracking-widest focus:outline-none focus:border-indigo-400 transition-all"
                      placeholder="#64ffda"
                      maxLength={7}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Buton Hazır Paletleri</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-2 no-scrollbar">
                    {BUTTON_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setSelectedBtnColor(preset.hex)}
                        className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                          selectedBtnColor.toLowerCase() === preset.hex.toLowerCase()
                            ? 'bg-indigo-500/10 border-indigo-400 text-white shadow-md'
                            : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
                        }`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full inline-block border border-white/20" style={{ backgroundColor: preset.hex }} />
                          {preset.name}
                        </span>
                        <span className="text-[8px] text-slate-500 font-bold uppercase mt-0.5 tracking-widest">{preset.hex}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[11px] text-slate-400 leading-relaxed uppercase tracking-wider font-bold">
                💡 <span className="text-[#64ffda]">Zeki Kontrast Entegrasyonu:</span> Zemin veya buton renkleri aydınlık/açık tonlara ulaştığında, sistem tüm yazıları yüksek okunurluk için otomatik olarak yüksek kontrastlı koyu renklere kaydırır!
              </p>
            </div>

            {saveMessage && (
              <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                saveMessage.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {saveMessage.type === 'success' && <Check className="w-4 h-4 flex-shrink-0" />}
                {saveMessage.text}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saveLoading}
                className="flex-1 bg-[#64ffda] text-[#0a192f] font-black uppercase tracking-widest text-[11px] py-4 rounded-xl hover:bg-[#52e0c4] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#64ffda]/10"
              >
                {saveLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Tasarım Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Seçili Alanın Renklerini Canlıya Uygula
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 border border-white/10 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all flex items-center justify-center"
                title="Sayfayı Yenile"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* ŞİFRE DEĞİŞTİR */}
        <div className="bg-[#112240] rounded-2xl border border-slate-700/50 p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Key className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Yönetici Şifresini Değiştir</h2>
              <p className="text-sm text-slate-400">Yönetim paneli giriş şifrenizi güvenle güncelleyin.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Mevcut Şifre</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#0a192f] border border-slate-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Yeni Şifre</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0a192f] border border-slate-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-all"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Yeni Şifre (Tekrar)</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0a192f] border border-slate-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#64ffda] transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {passwordMessage && (
              <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                passwordMessage.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {passwordMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-purple-500 text-white font-black uppercase tracking-widest text-[11px] py-4 rounded-xl hover:bg-purple-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/10"
            >
              {passwordLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Şifreyi Değiştir ve Kaydet
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
