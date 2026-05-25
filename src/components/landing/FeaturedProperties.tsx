import { createClient } from '@/lib/supabase/server'
import { PropertyCard } from '@/components/ui/PropertyCard'
import type { PropertyRow } from '@/types/database'

/**
 * Featured Properties — Server Component.
 * Fetches 6 in-stock, non-deleted properties from Supabase.
 * Falls back to placeholder cards if Supabase isn't configured yet.
 */
export async function FeaturedProperties() {
  let properties: PropertyRow[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'in_stock')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(6)

    if (data) {
      properties = data as PropertyRow[]
    }
  } catch {
    // Supabase not configured or no data — use placeholder
  }

  // Show placeholder cards if no real data yet
  if (properties.length === 0) {
    properties = PLACEHOLDER_PROPERTIES
  }

  return (
    <section id="properti-unggulan" className="py-20 sm:py-28 bg-brand-gray/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-black">
            Properti{' '}
            <span className="text-brand-gold">Unggulan</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Koleksi properti pilihan terbaik kami yang siap untuk Anda.
          </p>
        </div>

        {/* Property grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Placeholder data for development (before Supabase has real entries)
// ---------------------------------------------------------------------------
const PLACEHOLDER_PROPERTIES: PropertyRow[] = [
  {
    id: 'placeholder-1',
    nama_property: 'Aston Villas',
    group_name: 'Mentari',
    lebar: 6,
    panjang: 15,
    hadap: ['Utara'],
    tipe: 'Villa',
    tingkat: 2,
    price: 1850000000,
    carport: true,
    status: 'in_stock',
    siap: 'siap_huni',
    maps_link: null,
    kawasan: ['Krakatau', 'Pancing'],
    unit: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    deleted_at: null,
  },
  {
    id: 'placeholder-2',
    nama_property: 'Banyan Tree (Blok A)',
    group_name: 'Permai 123',
    lebar: 4.5,
    panjang: 21.5,
    hadap: ['Timur', 'Selatan'],
    tipe: 'Ruko',
    tingkat: 3.5,
    price: 2350000000,
    carport: false,
    status: 'in_stock',
    siap: 'siap_kosong',
    maps_link: null,
    kawasan: ['Cemara Asri'],
    unit: 'Ready Siap huni',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    deleted_at: null,
  },
  {
    id: 'placeholder-3',
    nama_property: 'Grand Orchid Residence',
    group_name: 'Project Ville',
    lebar: 5,
    panjang: 18,
    hadap: ['Barat'],
    tipe: 'Villa',
    tingkat: 2.5,
    price: 1350000000,
    carport: true,
    status: 'in_stock',
    siap: 'siap_huni_renovasi',
    maps_link: null,
    kawasan: ['Helvetia', 'Tembung'],
    unit: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    deleted_at: null,
  },
  {
    id: 'placeholder-4',
    nama_property: 'Sakura Heights',
    group_name: null,
    lebar: 4.25,
    panjang: 17.8,
    hadap: ['Utara', 'Barat'],
    tipe: 'Ruko',
    tingkat: 2,
    price: 980000000,
    carport: false,
    status: 'in_stock',
    siap: 'siap_huni',
    maps_link: null,
    kawasan: ['Pancing'],
    unit: 'Gate siap',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    deleted_at: null,
  },
  {
    id: 'placeholder-5',
    nama_property: 'Palm Valley Estate',
    group_name: 'Mentari',
    lebar: 7,
    panjang: 20,
    hadap: ['Selatan'],
    tipe: 'Villa',
    tingkat: 2,
    price: 2750000000,
    carport: true,
    status: 'in_stock',
    siap: 'siap_huni',
    maps_link: null,
    kawasan: ['Krakatau'],
    unit: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    deleted_at: null,
  },
  {
    id: 'placeholder-6',
    nama_property: 'Diamond Corner Shop',
    group_name: 'Permai 123',
    lebar: 5.5,
    panjang: 12,
    hadap: ['Timur'],
    tipe: 'Ruko',
    tingkat: 3,
    price: 1550000000,
    carport: true,
    status: 'in_stock',
    siap: 'siap_kosong',
    maps_link: null,
    kawasan: ['Cemara Asri', 'Kuala'],
    unit: 'Lapangan',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    deleted_at: null,
  },
]
