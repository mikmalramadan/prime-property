'use client'

import { useState, useTransition, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { resetAdminPassword } from '@/app/agent/dashboard/users/actions'
import { toast } from '@/components/ui/Toast'

interface ResetPasswordModalProps {
  profileId: string
  email: string
}

export function ResetPasswordModal({ profileId, email }: ResetPasswordModalProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Ensure portal only renders on client
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleReset = () => {
    startTransition(async () => {
      try {
        const result = await resetAdminPassword(email)
        if (result.success) {
          setIsSuccess(true)
          toast('Email reset password berhasil dikirim.', 'success')
        }
      } catch (error) {
        if (error instanceof Error) {
          toast(error.message, 'error')
        } else {
          toast('Terjadi kesalahan saat memproses permintaan.', 'error')
        }
      }
    })
  }

  const handleClose = () => {
    if (!isPending) {
      setOpen(false)
      setIsSuccess(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Reset Password"
        className="p-1.5 rounded-lg text-gray-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-all border border-transparent hover:border-brand-gold/20"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
      </button>

      {/* Modal overlay */}
      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
          />

          {/* Modal Content */}
          <div className="relative glass-card rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in border border-white/20">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-brand-black text-center mb-2">
              Reset Password
            </h2>
            
            {!isSuccess ? (
              <>
                <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
                  Apakah Anda yakin ingin mereset password untuk admin <strong className="text-brand-black font-semibold">&ldquo;{email}&rdquo;</strong>? Link reset akan dikirimkan ke email tersebut.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isPending}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-50 hover:shadow-sm transition-all disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isPending}
                    className="flex-1 py-3 text-brand-black bg-brand-gold font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {isPending ? 'Mengirim...' : 'Kirim Email'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
                  Instruksi reset password telah berhasil dikirim ke alamat email <strong className="text-brand-black font-semibold">{email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3 text-brand-black bg-brand-gold font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Tutup
                </button>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
