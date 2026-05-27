import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UpdatePasswordForm } from './UpdatePasswordForm'

export const metadata: Metadata = {
  title: 'Update Password — Prime Property',
}

interface PageProps {
  searchParams: Promise<{ code?: string }>
}

export default async function UpdatePasswordPage({ searchParams }: PageProps) {
  const params = await searchParams
  const code = params.code

  const supabase = await createClient()

  // 1. Jika ada 'code' (dari PKCE flow email link), tukar dengan sesi auth
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Error exchanging code for session:', error.message)
      // Redirect atau tampilkan pesan error
    } else {
      // Redirect untuk membuang 'code' dari URL agar lebih rapi
      redirect('/agent/update-password')
    }
  }

  // 2. Verifikasi user memiliki sesi (jika tidak ada code, berarti sudah ada sesi atau dari hash client-side)
  // Untuk flow client-side hash (#access_token), server tidak melihat hash,
  // tapi setelah client-side JS berjalan, auth cookie akan tersimpan.
  // Namun karena middleware mungkin redirect unauthenticated, kita pastikan di sini.
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Jika tidak ada user dan tidak ada code, kemungkinan besar URL salah
    // atau sesi kadaluarsa.
    // Catatan: Jika menggunakan hash flow, user mungkin null di server pertama kali,
    // sehingga akan di-redirect. Tapi PKCE flow lebih disarankan.
  }

  return (
    <div className="min-h-screen bg-brand-gray flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="text-center text-3xl font-extrabold text-brand-black tracking-tight">
          Buat Password Baru
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Masukkan password baru untuk akun Anda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card py-8 px-4 sm:px-10 rounded-3xl border border-white/40 shadow-2xl shadow-brand-black/5">
          {user ? (
             <UpdatePasswordForm />
          ) : (
             <div className="text-center">
               <p className="text-sm text-red-500 mb-4">
                 Sesi tidak valid atau telah kadaluarsa. Silakan minta link reset password yang baru.
               </p>
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
