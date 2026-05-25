'use client'

import { useActionState } from 'react'
import { submitContact, type ContactFormState } from '@/app/(public)/kontak/actions'
import { useEffect, useRef } from 'react'
import { toast } from '@/components/ui/Toast'

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactFormState, FormData>(
    submitContact,
    null,
  )
  const formRef = useRef<HTMLFormElement>(null)

  // Show toast on success and reset form
  useEffect(() => {
    if (state?.success) {
      toast('Pesan terkirim, tim kami akan menghubungi Anda.', 'success')
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {/* Nama */}
      <div>
        <label htmlFor="nama" className="block text-sm font-semibold text-brand-black mb-2">
          Nama Lengkap <span className="text-brand-red">*</span>
        </label>
        <input
          id="nama"
          name="nama"
          type="text"
          required
          placeholder="Masukkan nama lengkap"
          className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-brand-black placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-gold/20 focus:border-brand-gold transition-all duration-300 text-sm"
        />
        {state?.errors?.nama && (
          <p className="mt-1.5 text-xs font-medium text-brand-red">{state.errors.nama}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-brand-black mb-2">
          Email <span className="text-brand-red">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="contoh@email.com"
          className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-brand-black placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-gold/20 focus:border-brand-gold transition-all duration-300 text-sm"
        />
        {state?.errors?.email && (
          <p className="mt-1.5 text-xs font-medium text-brand-red">{state.errors.email}</p>
        )}
      </div>

      {/* Nomor HP */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-brand-black mb-2">
          Nomor HP <span className="text-brand-red">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="08xxxxxxxxxx"
          className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-brand-black placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-gold/20 focus:border-brand-gold transition-all duration-300 text-sm"
        />
        {state?.errors?.phone && (
          <p className="mt-1.5 text-xs font-medium text-brand-red">{state.errors.phone}</p>
        )}
      </div>

      {/* Pesan */}
      <div>
        <label htmlFor="pesan" className="block text-sm font-semibold text-brand-black mb-2">
          Pesan <span className="text-brand-red">*</span>
        </label>
        <textarea
          id="pesan"
          name="pesan"
          required
          rows={5}
          placeholder="Tulis pesan Anda di sini..."
          className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-brand-black placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-gold/20 focus:border-brand-gold transition-all duration-300 text-sm resize-none"
        />
        {state?.errors?.pesan && (
          <p className="mt-1.5 text-xs font-medium text-brand-red">{state.errors.pesan}</p>
        )}
      </div>

      {/* Server-level error */}
      {state?.errors?.server && (
        <div className="p-4 rounded-xl bg-red-50 text-brand-red text-sm font-medium border border-red-100">
          {state.errors.server}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="group relative w-full py-4 bg-brand-gold text-brand-black font-extrabold rounded-xl text-sm uppercase tracking-wide overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/40 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        <span className="relative">{pending ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}</span>
      </button>
    </form>
  )
}
