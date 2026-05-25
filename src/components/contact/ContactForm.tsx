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
        <label htmlFor="nama" className="block text-sm font-medium text-brand-black mb-1.5">
          Nama Lengkap <span className="text-brand-red">*</span>
        </label>
        <input
          id="nama"
          name="nama"
          type="text"
          required
          placeholder="Masukkan nama lengkap"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-brand-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all text-sm"
        />
        {state?.errors?.nama && (
          <p className="mt-1 text-xs text-brand-red">{state.errors.nama}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand-black mb-1.5">
          Email <span className="text-brand-red">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="contoh@email.com"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-brand-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all text-sm"
        />
        {state?.errors?.email && (
          <p className="mt-1 text-xs text-brand-red">{state.errors.email}</p>
        )}
      </div>

      {/* Nomor HP */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-brand-black mb-1.5">
          Nomor HP <span className="text-brand-red">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="08xxxxxxxxxx"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-brand-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all text-sm"
        />
        {state?.errors?.phone && (
          <p className="mt-1 text-xs text-brand-red">{state.errors.phone}</p>
        )}
      </div>

      {/* Pesan */}
      <div>
        <label htmlFor="pesan" className="block text-sm font-medium text-brand-black mb-1.5">
          Pesan <span className="text-brand-red">*</span>
        </label>
        <textarea
          id="pesan"
          name="pesan"
          required
          rows={5}
          placeholder="Tulis pesan Anda di sini..."
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-brand-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all text-sm resize-none"
        />
        {state?.errors?.pesan && (
          <p className="mt-1 text-xs text-brand-red">{state.errors.pesan}</p>
        )}
      </div>

      {/* Server-level error */}
      {state?.errors?.server && (
        <div className="p-3 rounded-lg bg-red-50 text-brand-red text-sm">
          {state.errors.server}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="w-full py-3.5 bg-brand-gold text-brand-black font-bold rounded-lg text-sm hover:bg-brand-gold/90 transition-all duration-200 shadow-md shadow-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Mengirim...' : 'Kirim Pesan'}
      </button>
    </form>
  )
}
