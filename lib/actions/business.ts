'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function saveBusiness(businessData: any, id?: string) {
  const supabase = await createAdminClient()

  try {
    if (id) {
      // Guncelleme
      const { password, ...updateData } = businessData

      if (password && updateData.owner_id) {
        await supabase.auth.admin.updateUserById(updateData.owner_id, { password })
      }

      const { data, error } = await supabase
        .from('businesses')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      revalidatePath('/admin/isletmeler')
      return { success: true, data }
    } else {
      // Yeni Kayit
      
      // 1. Standart Auth Kullanicisi Olustur (Eger owner_id yoksa)
      let ownerId = businessData.owner_id
      const { password, ...insertData } = businessData
      
      if (!ownerId && insertData.slug) {
        const generatedEmail = `${insertData.slug}@${'fethiye360.com'}`
        const standardPassword = password || '123456'
        
        // Kullaniciyi yarat
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: generatedEmail,
          password: standardPassword,
          email_confirm: true,
        })
        
        if (!authError && authData?.user) {
          ownerId = authData.user.id
        } else if (authError?.message?.includes('already registered')) {
          // Eger e-posta zaten varsa, o kullaniciyi bul (opsiyonel, simdilik bos gecelim)
          const { data: existingUser } = await supabase.from('users').select('id').eq('email', generatedEmail).single() // Note: Supabase admin doesn't expose a simple get user by email without listing all users, so we just log it or ignore
        }
      }

      const finalBusinessData = {
        ...insertData,
        owner_id: ownerId
      }

      // 2. Isletmeyi Kaydet
      const { data, error } = await supabase
        .from('businesses')
        .insert(finalBusinessData)
        .select()
        .single()
      
      if (error) throw error
      revalidatePath('/admin/isletmeler')
      return { success: true, data }
    }
  } catch (err: any) {
    console.error('Business Action Error:', err)
    return { success: false, error: err.message }
  }
}

export async function bulkSaveBusinesses(businessesData: any[]) {
  const supabase = await createAdminClient()
  
  try {
    const businessesToInsert = []
    
    for (const item of businessesData) {
      let ownerId = item.owner_id
      
      // 1. Kullanici Olustur
      if (!ownerId && item.slug) {
        const generatedEmail = `${item.slug}@${'fethiye360.com'}`
        const standardPassword = '123456'
        
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: generatedEmail,
          password: standardPassword,
          email_confirm: true,
        })
        
        if (!authError && authData?.user) {
          ownerId = authData.user.id
        }
      }
      
      businessesToInsert.push({
        ...item,
        owner_id: ownerId
      })
    }
    
    // 2. Isletmeleri Toplu Ekle
    const { data, error } = await supabase
      .from('businesses')
      .insert(businessesToInsert)
      .select()
      
    if (error) throw error
    revalidatePath('/admin/isletmeler')
    return { success: true, count: data.length }
    
  } catch (err: any) {
    console.error('Bulk Business Action Error:', err)
    return { success: false, error: err.message }
  }
}
