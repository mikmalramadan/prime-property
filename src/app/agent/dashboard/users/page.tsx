import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import { formatDate } from '@/lib/format'
import type { ProfileRow } from '@/types/database'
import { ToggleAdminStatus, ResetPasswordModal } from './AdminActions'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Kelola Admin — Dashboard',
}

export default async function AdminPage() {
  const { user } = await requireRole('superadmin')

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
        <Link
          href="/agent/dashboard/users/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-brand-black font-bold rounded-lg text-sm hover:bg-brand-gold/90 transition-all shadow-md shadow-brand-gold/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
          Tambah Admin
        </Link>
      </div>

      <div className="glass-card rounded-3xl border border-white/40 overflow-hidden shadow-2xl shadow-brand-black/5 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-200/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/50 backdrop-blur-sm">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/50 backdrop-blur-sm">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/50 backdrop-blur-sm">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/50 backdrop-blur-sm">
                  Dibuat
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/50 backdrop-blur-sm">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-400 font-medium">
                    Belum ada admin terdaftar.
                  </td>
                </tr>
              )}
              {profiles.map((p) => (
                <tr key={p.id} className="hover:bg-white/60 transition-colors duration-300">
                  <td className="px-6 py-4 font-bold text-brand-black">{p.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                        p.role === 'superadmin'
                          ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                          : 'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}
                    >
                      {p.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                        p.is_active
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-red-50 text-red-600 border border-red-200'
                      }`}
                    >
                      {p.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{formatDate(p.created_at)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {p.id === user.id ? (
                        <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-200">
                          Akun Anda
                        </span>
                      ) : (
                        <>
                          <ToggleAdminStatus profileId={p.id} email={p.email} isActive={p.is_active} />
                          <ResetPasswordModal profileId={p.id} email={p.email} />
                        </>
                      )}
                    </div>
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
