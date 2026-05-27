'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { formatDateTime } from '@/lib/format'
import type { AuditLogRow } from '@/types/database'

interface AuditDrawerProps {
  log: AuditLogRow | null
  propertyName: string
  userEmail: string
  onClose: () => void
}

const actionLabels: Record<string, { label: string; color: string }> = {
  create: { label: 'Buat', color: 'bg-emerald-100 text-emerald-700' },
  update: { label: 'Edit', color: 'bg-blue-100 text-blue-700' },
  delete: { label: 'Hapus', color: 'bg-red-100 text-red-700' },
}

export function AuditDrawer({ log, propertyName, userEmail, onClose }: AuditDrawerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (log) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [log, onClose])

  if (!mounted || !log) return null

  const act = actionLabels[log.action] ?? {
    label: log.action,
    color: 'bg-gray-100 text-gray-700',
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl animate-slide-in-right flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-brand-black pr-4">Detail Audit Log</h2>
            <p className="text-sm text-gray-500 mt-0.5">{formatDateTime(log.created_at)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-brand-black hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50">
          
          {/* Info Grid */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Aksi</p>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${act.color}`}>
                {act.label}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Properti</p>
              <p className="text-sm font-medium text-brand-black">{propertyName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Diubah Oleh</p>
              <p className="text-sm font-medium text-brand-black">{userEmail}</p>
            </div>
          </div>

          {/* Changed Fields JSON */}
          <div>
            <h3 className="text-sm font-bold text-brand-black mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
              </svg>
              Detail Perubahan Data
            </h3>
            
            {log.changed_fields ? (
              <div className="bg-brand-black rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center px-4 py-2 bg-white/5 border-b border-white/5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">JSON Payload</span>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-gray-300 leading-relaxed">
                    {JSON.stringify(log.changed_fields, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 p-6 rounded-xl text-center">
                <p className="text-sm text-gray-500">Tidak ada detail perubahan tercatat.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>,
    document.body
  )
}
