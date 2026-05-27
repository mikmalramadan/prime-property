'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updatePasswordAction, type UpdatePasswordState } from './actions'
import { toast } from '@/components/ui/Toast'
import Link from 'next/link'

export function UpdatePasswordForm() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState<UpdatePasswordState, FormData>(
    updatePasswordAction,
    null
  )

  useEffect(() => {
    if (state?.success) {
      toast('Password berhasil diperbarui!', 'success')
      router.push('/agent/dashboard')
    } else if (state?.error) {
      toast(state.error, 'error')
    }
  }, [state, router])

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Password Baru
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
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

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Konfirmasi Password Baru
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Ketik ulang password baru"
          className={`w-full px-4 py-3 rounded-xl border ${
            state?.fieldErrors?.confirmPassword ? 'border-brand-red' : 'border-gray-200'
          } text-sm text-brand-black bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all`}
        />
        {state?.fieldErrors?.confirmPassword && (
          <p className="mt-1.5 text-xs text-brand-red font-medium">
            {state.fieldErrors.confirmPassword[0]}
          </p>
        )}
      </div>

      <div className="pt-2">
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
              Menyimpan...
            </span>
          ) : (
            'Simpan Password Baru'
          )}
        </button>
      </div>
      
      <div className="text-center mt-4">
         <Link href="/agent/login" className="text-sm font-medium text-brand-gold hover:text-brand-gold/80 transition-colors">
            Kembali ke Halaman Login
         </Link>
      </div>
    </form>
  )
}
