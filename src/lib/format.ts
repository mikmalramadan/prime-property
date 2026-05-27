/**
 * Formatting utilities — Bahasa Indonesia locale
 *
 * All display formatting lives here to ensure consistency across
 * landing page, dashboard, and property cards.
 */

// ---------------------------------------------------------------------------
// Currency
// ---------------------------------------------------------------------------

/**
 * Format a price (integer rupiah) to Indonesian display format.
 * @example formatRupiah(1350000000) → "Rp 1.350.000.000"
 */
export function formatRupiah(price: number): string {
  return `Rp ${price.toLocaleString('id-ID')}`
}

// ---------------------------------------------------------------------------
// Date
// ---------------------------------------------------------------------------

const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
] as const

/**
 * Format an ISO timestamp to Indonesian date.
 * @example formatDate('2026-05-24T10:00:00Z') → "24 Mei 2026"
 */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  const day = d.getDate()
  const month = BULAN[d.getMonth()]
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

/**
 * Format an ISO timestamp to short date.
 * @example formatDateShort('2026-05-24T10:00:00Z') → "24/05/2026"
 */
export function formatDateShort(iso: string): string {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Format an ISO timestamp to Indonesian date and time (WIB / Asia/Jakarta).
 * @example formatDateTime('2026-05-24T10:00:00Z') → "24 Mei 2026, 17:00 WIB"
 */
export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).replace('AM', '').replace('PM', '').trim() + ' WIB' // Fallback if timeZoneName is weird, but usually id-ID gives 'WIB'
}

// ---------------------------------------------------------------------------
// Dimensions
// ---------------------------------------------------------------------------

/**
 * Format property dimensions.
 * @example formatDimensions(4.5, 21.5) → "4.5 × 21.5 m"
 */
export function formatDimensions(lebar: number, panjang: number): string {
  return `${lebar} × ${panjang} m`
}

/**
 * Calculate land area in m².
 * @example formatLuasTanah(4.5, 21.5) → "96.75 m²"
 */
export function formatLuasTanah(lebar: number, panjang: number): string {
  const area = lebar * panjang
  // Show 2 decimal places only if needed
  const formatted = area % 1 === 0 ? area.toString() : area.toFixed(2)
  return `${formatted} m²`
}

// ---------------------------------------------------------------------------
// Labels — display names for enum values
// ---------------------------------------------------------------------------

export const STATUS_LABELS: Record<string, string> = {
  in_stock: 'In Stock',
  sold_out: 'Sold Out',
}

export const SIAP_LABELS: Record<string, string> = {
  siap_huni: 'Siap Huni',
  siap_kosong: 'Siap Kosong',
  siap_huni_renovasi: 'Siap Huni Renovasi',
}

export const TIPE_LABELS: Record<string, string> = {
  Ruko: 'Ruko',
  Villa: 'Villa',
}

export const HADAP_LABELS: Record<string, string> = {
  Utara: 'Utara',
  Selatan: 'Selatan',
  Timur: 'Timur',
  Barat: 'Barat',
}
