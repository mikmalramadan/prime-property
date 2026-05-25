'use client'

import { useEffect, useState, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Toast context — lightweight, no external dep
// ---------------------------------------------------------------------------

interface ToastMessage {
  id: number
  text: string
  type: 'success' | 'error' | 'info'
}

let toastId = 0
let addToastFn: ((text: string, type: ToastMessage['type']) => void) | null = null

/** Imperative toast trigger — call from anywhere (client-side only). */
export function toast(text: string, type: ToastMessage['type'] = 'success') {
  addToastFn?.(text, type)
}

// ---------------------------------------------------------------------------
// Provider component — mount once in a layout
// ---------------------------------------------------------------------------

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((text: string, type: ToastMessage['type']) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, text, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  useEffect(() => {
    addToastFn = addToast
    return () => {
      addToastFn = null
    }
  }, [addToast])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            pointer-events-auto px-5 py-3 rounded-lg shadow-lg text-sm font-medium
            animate-slide-up backdrop-blur-sm
            ${t.type === 'success' ? 'bg-emerald-600 text-white' : ''}
            ${t.type === 'error'   ? 'bg-brand-red text-white' : ''}
            ${t.type === 'info'    ? 'bg-brand-black text-white' : ''}
          `}
        >
          {t.text}
        </div>
      ))}
    </div>
  )
}
