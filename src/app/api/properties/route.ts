import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withAuth } from '@/lib/auth'
import { propertySchema } from '@/lib/validations/property'

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

// ---------------------------------------------------------------------------
// POST Handler (Create Property)
// ---------------------------------------------------------------------------

async function createPropertyHandler(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Server-side validation dengan Zod
    const result = propertySchema.safeParse(body)
    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message
        }
      })
      return NextResponse.json({ errors }, { status: 400 })
    }

    const supabase = await createClient()

    // Auth middleware withAuth passed 'superadmin', so we are guaranteed to have a session
    // We can get the user id directly from the session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Insert ke Supabase, set created_by = user.id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: insertedProperty, error: insertError } = await (supabase.from('properties') as any)
      .insert({
        ...result.data,
        created_by: session.user.id
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Insert ke audit_logs: action='create'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('audit_logs') as any).insert({
      property_id: insertedProperty.id,
      user_id: session.user.id,
      action: 'create',
      changed_fields: result.data
    })

    // Return properti baru
    return NextResponse.json({ data: insertedProperty }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan internal.' }, { status: 500 })
  }
}

export const POST = withAuth(createPropertyHandler, 'superadmin')
