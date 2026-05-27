'use client'

import { useState, useEffect } from 'react'
import { formatDateTime } from '@/lib/format'
import dynamic from 'next/dynamic'
import type { AuditLogRow } from '@/types/database'

const AuditDrawer = dynamic(
  () => import('./AuditDrawer').then((mod) => mod.AuditDrawer),
  { ssr: false }
)

// Extended type from API response
interface EnrichedAuditLog extends AuditLogRow {
  user_email: string | null
  property_name: string | null
}

const actionLabels: Record<string, { label: string; color: string }> = {
  create: { label: 'Buat', color: 'bg-emerald-100 text-emerald-700' },
  update: { label: 'Edit', color: 'bg-blue-100 text-blue-700' },
  delete: { label: 'Hapus', color: 'bg-red-100 text-red-700' },
}

export function AuditTableClient() {
  const [logs, setLogs] = useState<EnrichedAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 })
  const [selectedLog, setSelectedLog] = useState<EnrichedAuditLog | null>(null)

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/audit-log?page=${page}&perPage=25`)
        if (!res.ok) {
          throw new Error('Gagal memuat audit log.')
        }
        const json = await res.json()
        setLogs(json.data)
        setMeta(json.meta)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [page])

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-brand-gray/50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Properti
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Diubah Oleh
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Detail Perubahan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-brand-gold" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Memuat data...
                    </span>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-brand-red font-medium">
                    {error}
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    Belum ada log audit.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const act = actionLabels[log.action] ?? {
                    label: log.action,
                    color: 'bg-gray-100 text-gray-700',
                  }
                  const propertyName = log.property_name || log.property_id || '—'
                  const userEmail = log.user_email || log.user_id || '—'

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-brand-gold/5 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {formatDateTime(log.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${act.color}`}
                        >
                          {act.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-brand-black font-medium group-hover:text-brand-gold transition-colors">
                        {propertyName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {userEmail}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="text-xs text-brand-gold font-medium hover:underline inline-flex items-center gap-1"
                        >
                          Lihat detail
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!loading && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Menampilkan total {meta.total} entri
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <span className="px-3 py-1.5 text-sm font-medium text-brand-black">
              {page} / {meta.totalPages}
            </span>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      )}

      {selectedLog && (
        <AuditDrawer
          log={selectedLog}
          propertyName={selectedLog.property_name || selectedLog.property_id || '—'}
          userEmail={selectedLog.user_email || selectedLog.user_id || '—'}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </>
  )
}
