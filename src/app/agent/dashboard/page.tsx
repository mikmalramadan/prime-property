import { createClient } from '@/lib/supabase/server'
import { PropertyCard } from '@/components/ui/PropertyCard'
import type { PropertyRow } from '@/types/database'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard Ringkasan',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch basic stats
  const [
    { count: totalProperties },
    { count: inStock },
    { count: soldOut },
    { data: recentProperties },
  ] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'in_stock').is('deleted_at', null),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'sold_out').is('deleted_at', null),
    supabase.from('properties').select('*').is('deleted_at', null).order('created_at', { ascending: false }).limit(3),
  ])

  const recent = (recentProperties as PropertyRow[]) || []

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Dashboard Ringkasan</h1>
          <p className="text-gray-500 mt-1">Pantau statistik utama properti Anda.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Properti" 
          value={totalProperties ?? 0} 
          icon={
            <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
          }
        />
        <StatCard 
          title="Properti Tersedia" 
          value={inStock ?? 0} 
          icon={
            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard 
          title="Sold Out" 
          value={soldOut ?? 0} 
          icon={
            <svg className="w-6 h-6 text-brand-red" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
          }
        />
      </div>

      {/* Recent Properties */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-brand-black">Properti Terbaru</h2>
          <Link 
            href="/agent/dashboard/properties"
            className="text-sm font-semibold text-brand-gold hover:text-brand-black transition-colors"
          >
            Lihat Semua &rarr;
          </Link>
        </div>
        
        {recent.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-gray-500">Belum ada properti yang ditambahkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((p) => (
              <PropertyCard key={p.id} property={p} agentView={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-white/40 shadow-xl shadow-brand-black/5 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-extrabold text-brand-black">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shadow-inner">
          {icon}
        </div>
      </div>
    </div>
  )
}
