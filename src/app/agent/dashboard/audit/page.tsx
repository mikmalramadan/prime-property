import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import { formatDate } from '@/lib/format'
import type { AuditLogRow, ProfileRow, PropertyRow } from '@/types/database'

export const metadata: Metadata = {
  title: 'Audit Log — Dashboard',
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AuditLogPage({ searchParams }: PageProps) {
  await requireRole('superadmin')

  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const perPage = 25

  const supabase = await createClient()

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, count } = await supabase
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  const logs = (data as AuditLogRow[]) ?? []
  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))

  // Fetch referenced profiles and properties for display names
  const userIds = [...new Set(logs.map((l) => l.user_id).filter(Boolean))] as string[]
  const propertyIds = [...new Set(logs.map((l) => l.property_id).filter(Boolean))] as string[]

  const [{ data: profiles }, { data: properties }] = await Promise.all([
    userIds.length > 0
      ? supabase.from('profiles').select('id, email').in('id', userIds)
      : Promise.resolve({ data: [] }),
    propertyIds.length > 0
      ? supabase.from('properties').select('id, nama_property').in('id', propertyIds)
      : Promise.resolve({ data: [] }),
  ])

  const profileMap = new Map(
    ((profiles as Pick<ProfileRow, 'id' | 'email'>[]) ?? []).map((p) => [p.id, p.email]),
  )
  const propertyMap = new Map(
    ((properties as Pick<PropertyRow, 'id' | 'nama_property'>[]) ?? []).map((p) => [
      p.id,
      p.nama_property,
    ]),
  )

  const actionLabels: Record<string, { label: string; color: string }> = {
    create: { label: 'Buat', color: 'bg-emerald-100 text-emerald-700' },
    update: { label: 'Edit', color: 'bg-blue-100 text-blue-700' },
    delete: { label: 'Hapus', color: 'bg-red-100 text-red-700' },
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-black">Audit Log</h1>
        <p className="text-gray-500 text-sm mt-1">
          Riwayat perubahan data properti oleh agent.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
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
                  Oleh
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Detail Perubahan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    Belum ada log audit.
                  </td>
                </tr>
              )}
              {logs.map((log) => {
                const act = actionLabels[log.action] ?? {
                  label: log.action,
                  color: 'bg-gray-100 text-gray-700',
                }
                return (
                  <tr key={log.id} className="hover:bg-brand-gold/5 transition-colors">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${act.color}`}
                      >
                        {act.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-black font-medium">
                      {log.property_id
                        ? propertyMap.get(log.property_id) ?? log.property_id
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {log.user_id ? profileMap.get(log.user_id) ?? log.user_id : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {log.changed_fields ? (
                        <details className="group">
                          <summary className="cursor-pointer text-xs text-brand-gold font-medium hover:underline">
                            Lihat detail
                          </summary>
                          <pre className="mt-2 text-xs bg-brand-gray p-3 rounded-lg overflow-x-auto max-w-md text-gray-600">
                            {JSON.stringify(log.changed_fields, null, 2)}
                          </pre>
                        </details>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Menampilkan {from + 1}–{Math.min(from + perPage, totalCount)} dari {totalCount} entri
          </p>
          <div className="flex items-center gap-1">
            {page > 1 && (
              <a
                href={`?page=${page - 1}`}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                ←
              </a>
            )}
            <span className="px-3 py-1.5 text-sm font-medium text-brand-black">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <a
                href={`?page=${page + 1}`}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
