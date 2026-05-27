import { getCurrentProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { logoutAction } from '@/app/agent/logout/actions'

export default async function DeactivatedPage() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/agent/login')
  }

  // If they are active, they shouldn't be here
  if (profile.is_active) {
    redirect('/agent/dashboard')
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-brand-black relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-red/10 via-brand-black to-brand-black" />
      
      <div className="glass-dark p-10 sm:p-12 rounded-3xl text-center max-w-md w-full border border-white/10 shadow-2xl relative z-10 animate-scale-in">
        <div className="w-20 h-20 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-red/10">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Akun Dinonaktifkan</h1>
        
        <p className="text-gray-400 mb-8 leading-relaxed text-sm">
          Akses Anda ke portal internal telah dibekukan. Jika ini adalah kesalahan, silakan hubungi superadmin untuk pemulihan akses.
        </p>
        
        <form action={logoutAction}>
          <button type="submit" className="group relative w-full py-4 bg-brand-gold text-brand-black font-extrabold rounded-xl text-sm uppercase tracking-wide overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/40 hover:-translate-y-0.5">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative">Keluar Akun</span>
          </button>
        </form>
      </div>
    </div>
  )
}
