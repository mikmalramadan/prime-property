'use client'

import { useState, useTransition, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { toggleAdminStatus } from '@/app/agent/dashboard/users/actions'
import { toast } from '@/components/ui/Toast'

interface ToggleStatusModalProps {
  profileId: string
  email: string
  isActive: boolean
}

export function ToggleStatusModal({ profileId, email, isActive }: ToggleStatusModalProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)

  // Ensure portal only renders on client
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleAdminStatus(profileId, isActive)
        toast(
          isActive ? 'Admin berhasil dinonaktifkan.' : 'Admin berhasil diaktifkan kembali.',
          isActive ? 'error' : 'success'
        )
      } catch (error) {
        if (error instanceof Error) {
          toast(error.message, 'error')
        } else {
          toast('Terjadi kesalahan saat memproses permintaan.', 'error')
        }
      } finally {
        setOpen(false)
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          isActive
            ? 'text-brand-red bg-red-50 hover:bg-red-100 hover:shadow-sm'
            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:shadow-sm'
        }`}
      >
        {isActive ? 'Nonaktifkan' : 'Aktifkan'}
      </button>

      {/* Modal overlay */}
      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 sm:backdrop-blur-sm transition-opacity"
            onClick={() => !isPending && setOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative glass-card rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in border border-white/20">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner ${
              isActive ? 'bg-red-100 text-brand-red border border-red-200' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
            }`}>
              {isActive ? (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            <h2 className="text-xl font-bold text-brand-black text-center mb-2">
              {isActive ? 'Konfirmasi Penonaktifan' : 'Konfirmasi Pengaktifan'}
            </h2>
            
            <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
              {isActive ? (
                <>Apakah Anda yakin ingin menonaktifkan admin <strong className="text-brand-black font-semibold">&ldquo;{email}&rdquo;</strong>? Pengguna ini tidak akan bisa lagi mengakses portal internal.</>
              ) : (
                <>Apakah Anda yakin ingin mengaktifkan kembali admin <strong className="text-brand-black font-semibold">&ldquo;{email}&rdquo;</strong>? Pengguna ini akan diberikan kembali akses ke portal internal.</>
              )}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-50 hover:shadow-sm transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleToggle}
                disabled={isPending}
                className={`flex-1 py-3 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 ${
                  isActive ? 'bg-brand-red hover:bg-red-700 shadow-brand-red/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                }`}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  isActive ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
