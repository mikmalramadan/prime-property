import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withAuth } from '@/lib/auth'

async function getPropertiesHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  // 1. Parsing Params
  const search = searchParams.get('search') ?? ''
  const kawasan = searchParams.getAll('kawasan')
  const hadap = searchParams.getAll('hadap')
  const siap = searchParams.getAll('siap')
  const tipe = searchParams.get('tipe') ?? ''
  const status = searchParams.get('status') ?? ''
  const carport = searchParams.get('carport') ?? ''
  const hargaMax = searchParams.get('hargaMax') ?? ''
  const lebarMin = searchParams.get('lebarMin') ?? ''
  
  const sort = searchParams.get('sort') ?? 'created_at'
  const order = searchParams.get('order') ?? 'desc'
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const perPage = Math.max(1, parseInt(searchParams.get('perPage') ?? '50', 10))

  const supabase = await createClient()

  // Base query: Exclude soft-deleted items (deleted_at IS NULL)
  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)

  // 2. Apply Filters & Full-Text Search
  if (search) {
    // Note: PostgREST array column partial search (ilike) is limited.
    // We search across `nama_property` and `group_name`. Kawasan is
    // handled effectively by the dedicated `overlaps` filter below.
    query = query.or(
      `nama_property.ilike.%${search}%,group_name.ilike.%${search}%`
    )
  }

  if (kawasan.length > 0) {
    query = query.overlaps('kawasan', kawasan)
  }
  if (hadap.length > 0) {
    query = query.overlaps('hadap', hadap)
  }
  if (siap.length > 0) {
    query = query.in('siap', siap)
  }
  if (tipe) {
    query = query.eq('tipe', tipe)
  }
  if (status) {
    query = query.eq('status', status)
  }
  if (carport === 'true') {
    query = query.eq('carport', true)
  } else if (carport === 'false') {
    query = query.eq('carport', false)
  }
  if (lebarMin) {
    query = query.gte('lebar', Number(lebarMin))
  }
  if (hargaMax) {
    query = query.lte('price', Number(hargaMax))
  }

  // 3. Sorting
  const allowedSorts = ['nama_property', 'price', 'created_at', 'status']
  const sortField = allowedSorts.includes(sort) ? sort : 'created_at'
  query = query.order(sortField, { ascending: order === 'asc' })

  // 4. Pagination
  const from = (page - 1) * perPage
  const to = from + perPage - 1
  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    meta: {
      totalCount: count ?? 0,
      page,
      perPage,
      totalPages: Math.ceil((count ?? 0) / perPage)
    }
  })
}

// 5. Auth Middleware Wajib
// Gunakan HOC withAuth dari rekayasa sebelumnya (memastikan session aktif & mengecek block status).
export const GET = withAuth(getPropertiesHandler)
