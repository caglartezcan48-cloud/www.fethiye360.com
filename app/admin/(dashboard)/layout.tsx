import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/sidebar'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/giris')
  }

  // Admin kontrolu
  const { data: adminData } = await supabase
    .from('admin_users')
    .select('id, full_name, is_super_admin')
    .eq('id', user.id)
    .single()

  if (!adminData) {
    redirect('/admin/giris')
  }

  return (
    <div className="min-h-screen bg-[#0a192f] flex">
      <AdminSidebar user={{ ...user, ...adminData }} />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
