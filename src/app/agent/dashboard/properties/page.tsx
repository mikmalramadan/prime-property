import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Properti — Dashboard',
}

/**
 * Properties listing placeholder — will be built in Phase 3.
 */
export default function PropertiesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Properti</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola listing properti Prime Property.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-brand-black mb-2">
          Tabel Properti
        </h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Fitur tabel listing, filter, dan pencarian properti akan segera tersedia.
        </p>
      </div>
    </div>
  )
}
