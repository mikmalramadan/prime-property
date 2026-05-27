import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withAuth } from '@/lib/auth'
import type { AuditLogRow } from '@/types/database'

async function getAuditLogsHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const perPage = Math.max(1, parseInt(searchParams.get('perPage') ?? '25', 10))
  
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const supabase = await createClient()

  // Ambil log
  const { data: logsData, count, error: logsError } = await supabase
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (logsError) {
    return NextResponse.json({ error: logsError.message }, { status: 500 })
  }

  const logs = (logsData as AuditLogRow[]) ?? []
  
  // Ambil referensi user (email) dan properti (nama)
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (profiles ?? []).map((p: any) => [p.id, p.email])
  )
  const propertyMap = new Map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (properties ?? []).map((p: any) => [p.id, p.nama_property])
  )

  // Format respons agar lebih mudah digunakan di frontend
  const formattedLogs = logs.map(log => ({
    ...log,
    user_email: log.user_id ? profileMap.get(log.user_id) : null,
    property_name: log.property_id ? propertyMap.get(log.property_id) : null
  }))

  return NextResponse.json({
    data: formattedLogs,
    meta: {
      total: count ?? 0,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / perPage))
    }
  }, { status: 200 })
}

// Hanya superadmin yang boleh melihat log audit
export const GET = withAuth(getAuditLogsHandler, 'superadmin')
