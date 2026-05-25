'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useMemo, useTransition } from 'react'

/**
 * Debounced URL search-param sync for property filters.
 *
 * All filter state lives in the URL so it's shareable and
 * survives page refreshes. The hook reads from searchParams
 * and writes back via router.replace (no history push).
 */

export type FilterValues = {
  search:    string
  kawasan:   string[]
  hadap:     string[]
  tipe:      string       // '' | 'Ruko' | 'Villa'
  status:    string       // '' | 'in_stock' | 'sold_out'
  siap:      string[]
  carport:   string       // '' | 'true' | 'false'
  lebarMin:  string
  hargaMax:  string
  sort:      string       // 'nama' | 'price' | 'created_at' | 'status'
  order:     string       // 'asc' | 'desc'
  page:      string
  perPage:   string
}

const DEFAULTS: FilterValues = {
  search:   '',
  kawasan:  [],
  hadap:    [],
  tipe:     '',
  status:   '',
  siap:     [],
  carport:  '',
  lebarMin: '',
  hargaMax: '',
  sort:     'created_at',
  order:    'desc',
  page:     '1',
  perPage:  '50',
}

export function usePropertyFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Read current filter values from URL
  const filters: FilterValues = useMemo(() => ({
    search:   searchParams.get('search')   ?? DEFAULTS.search,
    kawasan:  searchParams.getAll('kawasan'),
    hadap:    searchParams.getAll('hadap'),
    tipe:     searchParams.get('tipe')     ?? DEFAULTS.tipe,
    status:   searchParams.get('status')   ?? DEFAULTS.status,
    siap:     searchParams.getAll('siap'),
    carport:  searchParams.get('carport')  ?? DEFAULTS.carport,
    lebarMin: searchParams.get('lebarMin') ?? DEFAULTS.lebarMin,
    hargaMax: searchParams.get('hargaMax') ?? DEFAULTS.hargaMax,
    sort:     searchParams.get('sort')     ?? DEFAULTS.sort,
    order:    searchParams.get('order')    ?? DEFAULTS.order,
    page:     searchParams.get('page')     ?? DEFAULTS.page,
    perPage:  searchParams.get('perPage')  ?? DEFAULTS.perPage,
  }), [searchParams])

  // Write filter changes to URL
  const setFilters = useCallback(
    (patch: Partial<FilterValues>) => {
      const params = new URLSearchParams()

      const merged = { ...filters, ...patch }

      // Reset page to 1 when any filter (not pagination) changes
      const isPaginationChange = 'page' in patch || 'perPage' in patch
      if (!isPaginationChange) {
        merged.page = '1'
      }

      // Serialize to URL params
      if (merged.search)   params.set('search', merged.search)
      merged.kawasan.forEach((k) => params.append('kawasan', k))
      merged.hadap.forEach((h) => params.append('hadap', h))
      if (merged.tipe)     params.set('tipe', merged.tipe)
      if (merged.status)   params.set('status', merged.status)
      merged.siap.forEach((s) => params.append('siap', s))
      if (merged.carport)  params.set('carport', merged.carport)
      if (merged.lebarMin) params.set('lebarMin', merged.lebarMin)
      if (merged.hargaMax) params.set('hargaMax', merged.hargaMax)
      if (merged.sort !== DEFAULTS.sort)   params.set('sort', merged.sort)
      if (merged.order !== DEFAULTS.order) params.set('order', merged.order)
      if (merged.page !== '1')             params.set('page', merged.page)
      if (merged.perPage !== DEFAULTS.perPage) params.set('perPage', merged.perPage)

      const qs = params.toString()
      startTransition(() => {
        router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
      })
    },
    [filters, pathname, router, startTransition],
  )

  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false })
    })
  }, [pathname, router, startTransition])

  // Count active filters (excluding sort/order/page/perPage)
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.search)              count++
    if (filters.kawasan.length > 0)  count++
    if (filters.hadap.length > 0)    count++
    if (filters.tipe)                count++
    if (filters.status)              count++
    if (filters.siap.length > 0)     count++
    if (filters.carport)             count++
    if (filters.lebarMin)            count++
    if (filters.hargaMax)            count++
    return count
  }, [filters])

  return {
    filters,
    setFilters,
    resetFilters,
    activeFilterCount,
    isPending,
    DEFAULTS,
  }
}
