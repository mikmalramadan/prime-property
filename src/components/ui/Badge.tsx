import type { PropertyStatus, PropertySiap } from '@/types/database'

// ---------------------------------------------------------------------------
// Badge variants
// ---------------------------------------------------------------------------

const STATUS_VARIANTS: Record<PropertyStatus, string> = {
  in_stock: 'bg-emerald-100 text-emerald-800',
  sold_out: 'bg-red-100 text-brand-red',
}

const SIAP_VARIANTS: Record<PropertySiap, string> = {
  siap_huni:         'bg-amber-100 text-amber-800',
  siap_kosong:       'bg-purple-100 text-purple-800',
  siap_huni_renovasi: 'bg-orange-100 text-orange-800',
}

const STATUS_LABELS: Record<PropertyStatus, string> = {
  in_stock: 'In Stock',
  sold_out: 'Sold Out',
}

const SIAP_LABELS: Record<PropertySiap, string> = {
  siap_huni: 'Siap Huni',
  siap_kosong: 'Siap Kosong',
  siap_huni_renovasi: 'Renovasi',
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

/** Generic badge shell */
export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  )
}

/** Property status badge (In Stock → green, Sold Out → red) */
export function StatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <Badge className={STATUS_VARIANTS[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}

/** Property readiness badge (Siap Huni → gold, Siap Kosong → purple, etc.) */
export function SiapBadge({ siap }: { siap: PropertySiap }) {
  return (
    <Badge className={SIAP_VARIANTS[siap]}>
      {SIAP_LABELS[siap]}
    </Badge>
  )
}

/** Tipe badge (Ruko / Villa) */
export function TipeBadge({ tipe }: { tipe: string }) {
  const variant = tipe === 'Ruko'
    ? 'bg-blue-100 text-blue-800'
    : 'bg-teal-100 text-teal-800'
  return (
    <Badge className={variant}>
      {tipe}
    </Badge>
  )
}
