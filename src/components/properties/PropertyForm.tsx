'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { formatRupiah } from '@/lib/format'
import type { PropertyRow } from '@/types/database'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PropertyFormState = {
  success?: boolean
  propertyId?: string
  errors?: Record<string, string>
} | null

type PropertyFormAction = (
  prevState: PropertyFormState,
  formData: FormData,
) => Promise<PropertyFormState>

interface PropertyFormProps {
  action: PropertyFormAction
  initialData?: PropertyRow | null
  submitLabel?: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HADAP_OPTIONS = ['Utara', 'Selatan', 'Timur', 'Barat'] as const
const KAWASAN_OPTIONS = [
  'Krakatau', 'Pancing', 'Tembung', 'Helvetia',
  'Cemara Asri', 'Kuala', 'Sunggal', 'Marelan',
] as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PropertyForm({ action, initialData, submitLabel = 'Simpan' }: PropertyFormProps) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState<PropertyFormState, FormData>(action, null)

  // Multi-select state for hadap and kawasan (not natively supported by form)
  const [hadap, setHadap]     = useState<string[]>(initialData?.hadap ?? [])
  const [kawasan, setKawasan] = useState<string[]>(initialData?.kawasan ?? [])

  // Redirect on success
  useEffect(() => {
    if (state?.success) {
      const url = state.propertyId
        ? `/agent/dashboard/properties/${state.propertyId}`
        : '/agent/dashboard/properties'
      router.push(`${url}?highlight=${state.propertyId ?? ''}`)
    }
  }, [state, router])

  const toggleArray = (arr: string[], value: string, setter: (v: string[]) => void) => {
    setter(
      arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value],
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields for arrays (sent as comma-separated) */}
      <input type="hidden" name="hadap" value={hadap.join(',')} />
      <input type="hidden" name="kawasan" value={kawasan.join(',')} />

      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Nama Property */}
        <div className="sm:col-span-2">
          <FormField
            label="Nama Properti"
            name="nama_property"
            required
            defaultValue={initialData?.nama_property}
            placeholder="Contoh: Aston Villas"
            error={state?.errors?.nama_property}
          />
        </div>

        {/* Group */}
        <FormField
          label="Group"
          name="group_name"
          defaultValue={initialData?.group_name ?? ''}
          placeholder="Contoh: Mentari"
          error={state?.errors?.group_name}
        />

        {/* Unit */}
        <FormField
          label="Unit"
          name="unit"
          defaultValue={initialData?.unit ?? ''}
          placeholder="Contoh: Ready Siap huni"
          error={state?.errors?.unit}
        />

        {/* Lebar */}
        <FormField
          label="Lebar (m)"
          name="lebar"
          type="number"
          step="0.01"
          required
          defaultValue={initialData?.lebar}
          placeholder="6"
          error={state?.errors?.lebar}
        />

        {/* Panjang */}
        <FormField
          label="Panjang (m)"
          name="panjang"
          type="number"
          step="0.01"
          required
          defaultValue={initialData?.panjang}
          placeholder="15"
          error={state?.errors?.panjang}
        />

        {/* Tingkat */}
        <FormField
          label="Tingkat"
          name="tingkat"
          type="number"
          step="0.5"
          required
          defaultValue={initialData?.tingkat}
          placeholder="2"
          error={state?.errors?.tingkat}
        />

        {/* Price */}
        <FormField
          label="Harga (Rupiah)"
          name="price"
          type="number"
          required
          defaultValue={initialData?.price}
          placeholder="1350000000"
          hint={initialData?.price ? formatRupiah(initialData.price) : undefined}
          error={state?.errors?.price}
        />

        {/* Tipe */}
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">
            Tipe <span className="text-brand-red">*</span>
          </label>
          <div className="flex gap-3">
            {(['Ruko', 'Villa'] as const).map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipe"
                  value={t}
                  defaultChecked={initialData?.tipe === t || (!initialData && t === 'Ruko')}
                  className="accent-brand-gold"
                />
                <span className="text-sm text-brand-black">{t}</span>
              </label>
            ))}
          </div>
          {state?.errors?.tipe && <p className="mt-1 text-xs text-brand-red">{state.errors.tipe}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">
            Status <span className="text-brand-red">*</span>
          </label>
          <div className="flex gap-3">
            {([
              { value: 'in_stock', label: 'In Stock' },
              { value: 'sold_out', label: 'Sold Out' },
            ] as const).map((s) => (
              <label key={s.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={s.value}
                  defaultChecked={initialData?.status === s.value || (!initialData && s.value === 'in_stock')}
                  className="accent-brand-gold"
                />
                <span className="text-sm text-brand-black">{s.label}</span>
              </label>
            ))}
          </div>
          {state?.errors?.status && <p className="mt-1 text-xs text-brand-red">{state.errors.status}</p>}
        </div>

        {/* Siap */}
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">
            Siap <span className="text-brand-red">*</span>
          </label>
          <select
            name="siap"
            defaultValue={initialData?.siap ?? 'siap_huni'}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-brand-black bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
          >
            <option value="siap_huni">Siap Huni</option>
            <option value="siap_kosong">Siap Kosong</option>
            <option value="siap_huni_renovasi">Siap Huni Renovasi</option>
          </select>
          {state?.errors?.siap && <p className="mt-1 text-xs text-brand-red">{state.errors.siap}</p>}
        </div>

        {/* Carport */}
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">
            Carport
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="carport"
              value="true"
              defaultChecked={initialData?.carport ?? false}
              className="accent-brand-gold w-4 h-4"
            />
            <span className="text-sm text-brand-black">Tersedia</span>
          </label>
        </div>

        {/* Hadap */}
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">
            Hadap <span className="text-brand-red">*</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {HADAP_OPTIONS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => toggleArray(hadap, h, setHadap)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  hadap.includes(h)
                    ? 'bg-brand-gold text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          {state?.errors?.hadap && <p className="mt-1 text-xs text-brand-red">{state.errors.hadap}</p>}
        </div>

        {/* Kawasan */}
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">
            Kawasan <span className="text-brand-red">*</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {KAWASAN_OPTIONS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => toggleArray(kawasan, k, setKawasan)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  kawasan.includes(k)
                    ? 'bg-brand-gold text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          {state?.errors?.kawasan && <p className="mt-1 text-xs text-brand-red">{state.errors.kawasan}</p>}
        </div>

        {/* Maps Link */}
        <div className="sm:col-span-2">
          <FormField
            label="Link Google Maps"
            name="maps_link"
            type="url"
            defaultValue={initialData?.maps_link ?? ''}
            placeholder="https://www.google.com/maps/..."
            error={state?.errors?.maps_link}
          />
        </div>
      </div>

      {/* Server error */}
      {state?.errors?.server && (
        <div className="p-3 rounded-lg bg-red-50 text-brand-red text-sm">
          {state.errors.server}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-3 bg-brand-gold text-brand-black font-bold rounded-lg text-sm hover:bg-brand-gold/90 transition-all shadow-md shadow-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? 'Menyimpan...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Form field component
// ---------------------------------------------------------------------------

function FormField({
  label,
  name,
  type = 'text',
  required,
  defaultValue,
  placeholder,
  hint,
  error,
  step,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  defaultValue?: string | number | null
  placeholder?: string
  hint?: string
  error?: string
  step?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-brand-black mb-1.5">
        {label} {required && <span className="text-brand-red">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        step={step}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-brand-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
      />
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-brand-red">{error}</p>}
    </div>
  )
}
