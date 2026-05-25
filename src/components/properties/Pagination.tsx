'use client'

import { usePropertyFilters } from '@/lib/hooks/usePropertyFilters'

interface PaginationProps {
  totalCount: number
}

export function Pagination({ totalCount }: PaginationProps) {
  const { filters, setFilters } = usePropertyFilters()

  const page    = Number(filters.page) || 1
  const perPage = Number(filters.perPage) || 50
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))

  const from = (page - 1) * perPage + 1
  const to   = Math.min(page * perPage, totalCount)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Info */}
      <div className="text-sm text-gray-500">
        Menampilkan {from}–{to} dari {totalCount} properti
      </div>

      <div className="flex items-center gap-4">
        {/* Per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Per halaman:</span>
          <select
            value={perPage}
            onChange={(e) => setFilters({ perPage: e.target.value, page: '1' })}
            className="px-2 py-1 rounded-lg border border-gray-200 text-sm text-brand-black bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setFilters({ page: String(page - 1) })}
            disabled={page <= 1}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          <span className="px-3 py-1.5 text-sm font-medium text-brand-black">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setFilters({ page: String(page + 1) })}
            disabled={page >= totalPages}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
