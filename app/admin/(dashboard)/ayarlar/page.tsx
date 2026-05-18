'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Check, Key, User, Palette, RefreshCw } from 'lucide-react'

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

  // Background color states
  const [selectedColor, setSelectedColor] = useState('#02111a')
  const [colorLoading, setColorLoading] = useState(false)
  const [colorMessage, setColorMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Button color states
  const [selectedBtnColor, setSelectedBtnColor] = useState('#64ffda')
  const [btnColorLoading, setBtnColorLoading] = useState(false)
  const [btnColorMessage, setBtnColorMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  // Load current theme settings on mount
  useEffect(() => {
    async function loadThemeSettings() {
      try {
        const { data } = await supabase
          .from('hero_banners')
          .select('alt_text, background_image')
          .in('alt_text', ['SYSTEM_BG_COLOR', 'SYSTEM_BTN_COLOR'])
        
        if (data) {
          const bgSetting = data.find(d => d.alt_text === 'SYSTEM_BG_COLOR')
          const btnSetting = data.find(d => d.alt_text === 'SYSTEM_BTN_COLOR')
          
          if (bgSetting?.background_image) {
            setSelectedColor(bgSetting.background_image)
          }
          if (btnSetting?.background_image) {
            setSelectedBtnColor(btnSetting.background_image)
          }
        }
      } catch (err) {
        console.error('Tema ayarları yüklenemedi:', err)
      }
    }
    loadThemeSettings()
  }, [supabase])

  // Save background color setting to database
  const handleColorChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setColorLoading(true)
    setColorMessage(null)

    if (!selectedColor.startsWith('#') || selectedColor.length !== 7) {
      setColorMessage({ type: 'error', text: 'Lütfen geçerli bir HEX kod girin (Örn: #02111a)' })
      setColorLoading(false)
      return
    }

    try {
      const { data: existing } = await supabase
        .from('hero_banners')
        .select('id')
        .eq('alt_text', 'SYSTEM_BG_COLOR')
        .maybeSingle()

      if (existing) {
        const { error } = await supabase
          .from('hero_banners')
          .update({ background_image: selectedColor })
          .eq('alt_text', 'SYSTEM_BG_COLOR')
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('hero_banners')
          .insert({
            id: '00000000-0000-0000-0000-000000000000',
            alt_text: 'SYSTEM_BG_COLOR',
            background_image: selectedColor,
            is_active: false,
            title: 'System Custom Background Color Settings',
            display_order: 999999,
            scroll_speed: 30,
            scroll_direction: 'left'
          })
        
        if (error) throw error
      }

      setColorMessage({ type: 'success', text: 'Zemin rengi başarıyla kaydedildi! Sayfayı yenileyerek görebilirsiniz.' })
      router.refresh()
    } catch (err: any) {
      setColorMessage({ type: 'error', text: 'Kaydedilirken hata oluştu: ' + err.message })
    } finally {
      setColorLoading(false)
    }
  }

  // Save button color setting to database
  const handleBtnColorChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setBtnColorLoading(true)
    setBtnColorMessage(null)

    if (!selectedBtnColor.startsWith('#') || selectedBtnColor.length !== 7) {
      setBtnColorMessage({ type: 'error', text: 'Lütfen geçerli bir HEX kod girin (Örn: #64ffda)' })
      setBtnColorLoading(false)
      return
    }

    try {
      const { data: existing } = await supabase
        .from('hero_banners')
        .select('id')
        .eq('alt_text', 'SYSTEM_BTN_COLOR')
        .maybeSingle()

      if (existing) {
        const { error } = await supabase
          .from('hero_banners')
          .update({ background_image: selectedBtnColor })
          .eq('alt_text', 'SYSTEM_BTN_COLOR')
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('hero_banners')
          .insert({
            id: '10000000-0000-0000-0000-000000000000',
            alt_text: 'SYSTEM_BTN_COLOR',
            background_image: selectedBtnColor,
            is_active: false,
            title: 'System Custom Button Color Settings',
            display_order: 999998,
            scroll_speed: 30,
            scroll_direction: 'left'
          })
        
        if (error) throw error
      }

      setBtnColorMessage({ type: 'success', text: 'Buton rengi başarıyla kaydedildi! Sayfayı yenileyerek görebilirsiniz.' })
      router.refresh()
    } catch (err: any) {
      setBtnColorMessage({ type: 'error', text: 'Kaydedilirken hata oluştu: ' + err.message })
    } finally {
      setBtnColorLoading(false)
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
        
        {/* ZEMİN RENGİ AYARI (BACKGROUND COLOR PICKER) */}
        <div className="bg-[#112240] rounded-2xl border border-slate-700/50 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#64ffda]/5 rounded-full blur-[80px] -z-10" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#64ffda]/10 flex items-center justify-center border border-[#64ffda]/20">
              <Palette className="w-6 h-6 text-[#64ffda]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Site Zemin Rengi Yönetimi</h2>
              <p className="text-sm text-slate-400">Sitenin genel arka plan rengini özelleştirin veya Fethiye konsept renklerini uygulayın.</p>
            </div>
          </div>

          <form onSubmit={handleColorChange} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Color Customizer */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-300 uppercase tracking-widest">Özel Renk Belirle</label>
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

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[11px] text-slate-400 leading-relaxed uppercase tracking-wider font-bold">
                    💡 <span className="text-[#64ffda]">Akıllı Kontrast Sistemi:</span> Seçtiğiniz renk aydınlık/açık bir renk ise (Örn: beyaz veya krem), sistem bunu otomatik tespit eder ve sitenin tüm yazılarını yüksek okunurluk için koyu renge çevirir!
                  </p>
                </div>
              </div>

              {/* Presets */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">Hazır Fethiye Konseptleri</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[160px] overflow-y-auto pr-2 no-scrollbar">
                  {FETHIYE_PRESETS.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setSelectedColor(preset.hex)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                        selectedColor.toLowerCase() === preset.hex.toLowerCase()
                          ? 'bg-[#64ffda]/10 border-[#64ffda] text-white shadow-md'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <span className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full inline-block border border-white/20" style={{ backgroundColor: preset.hex }} />
                        {preset.name}
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{preset.hex}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {colorMessage && (
              <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                colorMessage.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {colorMessage.type === 'success' && <Check className="w-4 h-4 flex-shrink-0" />}
                {colorMessage.text}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={colorLoading}
                className="flex-1 bg-[#64ffda] text-[#0a192f] font-black uppercase tracking-widest text-[11px] py-4 rounded-xl hover:bg-[#52e0c4] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#64ffda]/10"
              >
                {colorLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Zemin Güncelleniyor...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Zemin Rengini Canlıya Uygula
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

        {/* BUTON VE VURGU RENGİ AYARI (BUTTON COLOR PICKER) */}
        <div className="bg-[#112240] rounded-2xl border border-slate-700/50 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -z-10" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Palette className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Site Buton & Vurgu Rengi Yönetimi</h2>
              <p className="text-sm text-slate-400">Sitenin butonlarını, etiketlerini ve aktif vurgu öğelerinin rengini özelleştirin.</p>
            </div>
          </div>

          <form onSubmit={handleBtnColorChange} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Color Customizer */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-300 uppercase tracking-widest">Özel Renk Belirle</label>
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

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[11px] text-slate-400 leading-relaxed uppercase tracking-wider font-bold">
                    💡 <span className="text-indigo-400">Akıllı Buton Yazı Kontrastı:</span> Buton rengi olarak aydınlık bir renk seçtiğinizde buton üzerindeki yazılar otomatik olarak koyu renk olur; koyu renk seçtiğinizde ise yazılar beyaz kalır!
                  </p>
                </div>
              </div>

              {/* Presets */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">Hazır Buton Konseptleri</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[160px] overflow-y-auto pr-2 no-scrollbar">
                  {BUTTON_PRESETS.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setSelectedBtnColor(preset.hex)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                        selectedBtnColor.toLowerCase() === preset.hex.toLowerCase()
                          ? 'bg-indigo-500/10 border-indigo-400 text-white shadow-md'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <span className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full inline-block border border-white/20" style={{ backgroundColor: preset.hex }} />
                        {preset.name}
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{preset.hex}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {btnColorMessage && (
              <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                btnColorMessage.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {btnColorMessage.type === 'success' && <Check className="w-4 h-4 flex-shrink-0" />}
                {btnColorMessage.text}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={btnColorLoading}
                className="flex-1 bg-indigo-500 text-white font-black uppercase tracking-widest text-[11px] py-4 rounded-xl hover:bg-indigo-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10"
              >
                {btnColorLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Buton Rengi Güncelleniyor...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Buton Rengini Canlıya Uygula
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
