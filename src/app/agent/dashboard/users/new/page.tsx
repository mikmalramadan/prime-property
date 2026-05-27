'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createUserAction, type CreateUserState } from './actions'
import { toast } from '@/components/ui/Toast'

export default function CreateAdminPage() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState<CreateUserState, FormData>(
    createUserAction,
    null
  )

  useEffect(() => {
    if (state?.success) {
      toast('Akun admin berhasil dibuat!', 'success')
      router.push('/agent/dashboard/users')
    } else if (state?.error) {
      toast(state.error, 'error')
    }
  }, [state, router])

  return (
    <div className="min-h-screen bg-brand-gray flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="text-center text-3xl font-extrabold text-brand-black tracking-tight">
          Buat Akun Admin
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Hanya dapat diakses oleh Superadmin
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card py-8 px-4 sm:px-10 rounded-3xl border border-white/40 shadow-2xl shadow-brand-black/5">
          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nama Lengkap
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-xl border ${
                  state?.fieldErrors?.name ? 'border-brand-red' : 'border-gray-200'
                } text-sm text-brand-black bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all`}
              />
              {state?.fieldErrors?.name && (
                <p className="mt-1.5 text-xs text-brand-red font-medium">
                  {state.fieldErrors.name[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Alamat Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@primeproperty.id"
                className={`w-full px-4 py-3 rounded-xl border ${
                  state?.fieldErrors?.email ? 'border-brand-red' : 'border-gray-200'
                } text-sm text-brand-black bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all`}
              />
              {state?.fieldErrors?.email && (
                <p className="mt-1.5 text-xs text-brand-red font-medium">
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Minimal 6 karakter"
                className={`w-full px-4 py-3 rounded-xl border ${
                  state?.fieldErrors?.password ? 'border-brand-red' : 'border-gray-200'
                } text-sm text-brand-black bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all`}
              />
              {state?.fieldErrors?.password && (
                <p className="mt-1.5 text-xs text-brand-red font-medium">
                  {state.fieldErrors.password[0]}
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                type="submit"
                disabled={pending}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-gold/20 text-sm font-bold text-brand-black bg-brand-gold hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:opacity-50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {pending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-brand-black" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  'Buat Akun Admin'
                )}
              </button>
              
              <Link
                href="/agent/dashboard/users"
                className="w-full flex justify-center py-3.5 px-4 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all duration-200"
              >
                Batal & Kembali
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
