'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function saveBusiness(businessData: any, id?: string) {
  const supabase = await createAdminClient()

  try {
    if (id) {
      // Guncelleme
      const { data, error } = await supabase
        .from('businesses')
        .update(businessData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      revalidatePath('/admin/isletmeler')
      return { success: true, data }
    } else {
      // Yeni Kayit
      const { data, error } = await supabase
        .from('businesses')
        .insert(businessData)
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
