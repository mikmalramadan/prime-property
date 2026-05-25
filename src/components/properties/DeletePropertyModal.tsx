'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProperty } from '@/app/agent/dashboard/properties/actions'
import { toast } from '@/components/ui/Toast'

interface DeletePropertyModalProps {
  propertyId: string
  propertyName: string
}

export function DeletePropertyButton({ propertyId, propertyName }: DeletePropertyModalProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProperty(propertyId)
      if (result.error) {
        toast(result.error, 'error')
      } else {
        toast(`Properti "${propertyName}" berhasil dihapus.`, 'success')
        router.push('/agent/dashboard/properties')
      }
      setOpen(false)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-brand-red/30 text-brand-red font-semibold rounded-lg text-sm hover:bg-red-50 transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        Hapus
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isPending && setOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-brand-red" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>

            <h2 className="text-lg font-bold text-brand-black text-center mb-2">
              Hapus Properti
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Yakin hapus properti <strong className="text-brand-black">&ldquo;{propertyName}&rdquo;</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-2.5 bg-brand-red text-white font-bold rounded-lg text-sm hover:bg-brand-red/90 transition-colors disabled:opacity-50"
              >
                {isPending ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
