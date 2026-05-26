'use client'

import { useActionState, useState } from 'react'
import { createAdmin, type CreateAdminState } from './actions'
import { toast } from '@/components/ui/Toast'
import { ToggleStatusModal } from '@/components/admin/ToggleStatusModal'
import { ResetPasswordModal } from '@/components/admin/ResetPasswordModal'

export { ToggleStatusModal as ToggleAdminStatus, ResetPasswordModal }

// ---------------------------------------------------------------------------
// Create admin form (modal-like inline form)
// ---------------------------------------------------------------------------

export function CreateAdminForm() {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState<CreateAdminState, FormData>(
    createAdmin,
    null,
  )

  if (state?.success) {
    toast('Admin berhasil ditambahkan.', 'success')
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-brand-black font-bold rounded-lg text-sm hover:bg-brand-gold/90 transition-all shadow-md shadow-brand-gold/20"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
        </svg>
        Tambah Admin
      </button>
    )
  }

  return (
    <form action={formAction} className="flex items-end gap-3 bg-white border border-gray-200 rounded-xl p-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="agent@primeproperty.id"
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
        <select
          name="role"
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-brand-black bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
        >
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </div>

      {state?.error && (
        <p className="text-xs text-brand-red">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 bg-brand-gold text-brand-black font-bold rounded-lg text-sm hover:bg-brand-gold/90 disabled:opacity-50"
      >
        {pending ? '...' : 'Tambah'}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-sm hover:bg-gray-50"
      >
        Batal
      </button>
    </form>
  )
}
