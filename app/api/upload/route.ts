import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadi' }, { status: 400 })
    }

    // Dosya tipi kontrolu - sadece gorseller
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Sadece gorsel dosyalar yuklenebilir (JPEG, PNG, WebP, GIF, AVIF)' }, { status: 400 })
    }

    // Dosya boyutu kontrolu - max 5MB
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Dosya boyutu 5MB\'dan buyuk olamaz' }, { status: 400 })
    }

    // Benzersiz dosya adi olustur
    const timestamp = Date.now()
    const fileName = `banners/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const blob = await put(fileName, file, {
      access: 'public',
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Yukleme basarisiz' }, { status: 500 })
  }
}
