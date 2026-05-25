'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { signIn, type LoginFormState } from './actions'

export function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/agent/dashboard'

  const [state, formAction, pending] = useActionState<LoginFormState, FormData>(
    signIn,
    null,
  )

  return (
    <div className="min-h-dvh flex items-center justify-center bg-brand-black px-4 py-12">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-black to-brand-gold/5" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Image
              src="/logo.png"
              alt="Prime Property Logo"
              width={48}
              height={48}
              className="drop-shadow-lg"
            />
            <span className="text-2xl font-bold text-white tracking-tight">
              Prime<span className="text-brand-gold">Property</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Portal Internal Agent
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-1">
            Masuk
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Masukkan kredensial Anda untuk mengakses dashboard.
          </p>

          <form action={formAction} className="space-y-5">
            {/* Hidden next field for post-login redirect */}
            <input type="hidden" name="next" value={next} />

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="agent@primeproperty.id"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all text-sm"
              />
            </div>

            {/* Error message */}
            {state?.error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-brand-red/10 border border-brand-red/20 text-brand-red text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span>{state.error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3.5 bg-brand-gold text-brand-black font-bold rounded-lg text-sm hover:bg-brand-gold/90 transition-all duration-200 shadow-lg shadow-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memproses...
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-600 text-xs mt-8">
          Tidak punya akun? Hubungi superadmin untuk pembuatan akun.
        </p>
      </div>
    </div>
  )
}
