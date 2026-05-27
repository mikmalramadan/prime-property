import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth'
import { AuditTableClient } from '@/components/audit/AuditTableClient'

export const metadata: Metadata = {
  title: 'Audit Log — Dashboard',
}

export default async function AuditLogPage() {
  await requireRole('superadmin')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-black">Audit Log</h1>
        <p className="text-gray-500 text-sm mt-1">
          Riwayat perubahan data properti oleh agent.
        </p>
      </div>

      <AuditTableClient />
    </div>
  )
}

