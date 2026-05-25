import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import { formatDate } from '@/lib/format'
import type { ProfileRow } from '@/types/database'
import { ToggleAdminStatus, CreateAdminForm } from './AdminActions'

export const metadata: Metadata = {
  title: 'Kelola Admin — Dashboard',
}

export default async function AdminPage() {
  await requireRole('superadmin')

  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const profiles = (data as ProfileRow[]) ?? []

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Kelola Admin</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola akun agent dan superadmin.
          </p>
        </div>
        <CreateAdminForm />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-gray/50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Dibuat
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    Belum ada admin terdaftar.
                  </td>
                </tr>
              )}
              {profiles.map((p) => (
                <tr key={p.id} className="hover:bg-brand-gold/5 transition-colors">
                  <td className="px-4 py-3 font-medium text-brand-black">{p.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        p.role === 'superadmin'
                          ? 'bg-brand-gold/10 text-brand-gold'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {p.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        p.is_active
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {p.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(p.created_at)}</td>
                  <td className="px-4 py-3 text-center">
                    <ToggleAdminStatus profileId={p.id} isActive={p.is_active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
