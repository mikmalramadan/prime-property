'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { propertySchema, type PropertyFormValues } from '@/lib/validations/property'
import { formatRupiah } from '@/lib/format'
import type { PropertyRow } from '@/types/database'
import { toast } from '@/components/ui/Toast'

interface PropertyFormProps {
  action: (prevState: any, formData: FormData) => Promise<any>
  initialData?: PropertyRow | null
  submitLabel?: string
}

const HADAP_OPTIONS = ['Utara', 'Selatan', 'Timur', 'Barat'] as const
const KAWASAN_OPTIONS = [
  'Krakatau', 'Pancing', 'Tembung', 'Helvetia',
  'Cemara Asri', 'Kuala', 'Sunggal', 'Marelan',
] as const

export function PropertyForm({ action, initialData, submitLabel = 'Simpan' }: PropertyFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      nama_property: initialData?.nama_property ?? '',
      group_name: initialData?.group_name ?? '',
      unit: initialData?.unit ?? '',
      lebar: initialData?.lebar ?? undefined,
      panjang: initialData?.panjang ?? undefined,
      tingkat: initialData?.tingkat ?? undefined,
      price: initialData?.price ?? undefined,
      tipe: initialData?.tipe ?? 'Ruko',
      status: initialData?.status ?? 'in_stock',
      siap: initialData?.siap ?? 'siap_huni',
      carport: initialData?.carport ?? false,
      hadap: initialData?.hadap ?? [],
      kawasan: initialData?.kawasan ?? [],
      maps_link: initialData?.maps_link ?? '',
    },
  })

  const priceValue = watch('price')
  const kawasanValue = watch('kawasan')
  const hadapValue = watch('hadap')

  const onSubmit = (data: PropertyFormValues, keepOpen: boolean) => {
    setServerError(null)
    startTransition(async () => {
      // Build FormData to send to server action
      const formData = new FormData()
      Object.entries(data).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          formData.append(key, val.join(','))
        } else if (val !== null && val !== undefined) {
          formData.append(key, String(val))
        }
      })

      const result = await action(null, formData)
      
      if (result?.errors) {
        setServerError(result.errors.server || 'Terjadi kesalahan pada validasi server.')
      } else if (result?.success) {
        toast('Properti berhasil disimpan!', 'success')
        if (keepOpen) {
          reset() // Reset form untuk tambah lagi
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          const url = result.propertyId
            ? `/agent/dashboard/properties/${result.propertyId}`
            : '/agent/dashboard/properties'
          router.push(`${url}?highlight=${result.propertyId ?? ''}`)
        }
      }
    })
  }

  const toggleArray = (arr: string[], value: string, fieldName: 'hadap' | 'kawasan') => {
    const newArr = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value]
    setValue(fieldName, newArr, { shouldValidate: true, shouldDirty: true })
  }

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Nama Property */}
        <div className="sm:col-span-2">
          <FormField
            label="Nama Properti"
            required
            placeholder="Contoh: Aston Villas"
            {...register('nama_property')}
            error={errors.nama_property?.message}
            isDirty={!!dirtyFields.nama_property}
          />
        </div>

        {/* Group */}
        <FormField
          label="Group"
          placeholder="Contoh: Mentari"
          {...register('group_name')}
          error={errors.group_name?.message}
          isDirty={!!dirtyFields.group_name}
        />

        {/* Unit */}
        <FormField
          label="Unit"
          placeholder="Contoh: Ready Siap huni"
          {...register('unit')}
          error={errors.unit?.message}
          isDirty={!!dirtyFields.unit}
        />

        {/* Lebar */}
        <FormField
          label="Lebar (m)"
          type="number"
          step="0.01"
          required
          placeholder="6"
          {...register('lebar', { valueAsNumber: true })}
          error={errors.lebar?.message}
          isDirty={!!dirtyFields.lebar}
        />

        {/* Panjang */}
        <FormField
          label="Panjang (m)"
          type="number"
          step="0.01"
          required
          placeholder="15"
          {...register('panjang', { valueAsNumber: true })}
          error={errors.panjang?.message}
          isDirty={!!dirtyFields.panjang}
        />

        {/* Tingkat */}
        <FormField
          label="Tingkat"
          type="number"
          step="0.5"
          required
          placeholder="2"
          {...register('tingkat', { valueAsNumber: true })}
          error={errors.tingkat?.message}
          isDirty={!!dirtyFields.tingkat}
        />

        {/* Price */}
        <FormField
          label="Harga (Rupiah)"
          type="number"
          required
          placeholder="1350000000"
          {...register('price', { valueAsNumber: true })}
          hint={priceValue && !isNaN(priceValue) ? formatRupiah(priceValue) : undefined}
          error={errors.price?.message}
          isDirty={!!dirtyFields.price}
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
                  value={t}
                  {...register('tipe')}
                  className="accent-brand-gold"
                />
                <span className="text-sm text-brand-black">{t}</span>
              </label>
            ))}
          </div>
          {errors.tipe && <p className="mt-1 text-xs text-[#B33A3A]">{errors.tipe.message}</p>}
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
                  value={s.value}
                  {...register('status')}
                  className="accent-brand-gold"
                />
                <span className="text-sm text-brand-black">{s.label}</span>
              </label>
            ))}
          </div>
          {errors.status && <p className="mt-1 text-xs text-[#B33A3A]">{errors.status.message}</p>}
        </div>

        {/* Siap */}
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">
            Siap <span className="text-brand-red">*</span>
          </label>
          <select
            {...register('siap')}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-brand-black bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
          >
            <option value="siap_huni">Siap Huni</option>
            <option value="siap_kosong">Siap Kosong</option>
            <option value="siap_huni_renovasi">Siap Huni Renovasi</option>
          </select>
          {errors.siap && <p className="mt-1 text-xs text-[#B33A3A]">{errors.siap.message}</p>}
        </div>

        {/* Carport */}
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">
            Carport
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('carport')}
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
                onClick={() => toggleArray(hadapValue, h, 'hadap')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  hadapValue.includes(h)
                    ? 'bg-brand-gold text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          {errors.hadap && <p className="mt-1 text-xs text-[#B33A3A]">{errors.hadap.message}</p>}
        </div>

        {/* Kawasan */}
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">
            Kawasan <span className="text-brand-red">*</span>
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1.5 p-1.5 border border-gray-200 rounded-lg bg-white focus-within:border-brand-gold focus-within:ring-1 focus-within:ring-brand-gold transition-all">
              {kawasanValue.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggleArray(kawasanValue, k, 'kawasan')}
                  className="px-2.5 py-1 rounded-full text-xs font-medium transition-all bg-brand-gold text-white hover:bg-brand-red flex items-center gap-1 group"
                  title="Hapus"
                >
                  {k}
                  <svg className="w-3 h-3 text-white/70 group-hover:text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
              <input
                type="text"
                placeholder={kawasanValue.length === 0 ? "Ketik kawasan..." : "Ketik lagi..."}
                className="flex-1 min-w-[150px] px-2 py-1 text-sm border-none bg-transparent focus:outline-none focus:ring-0 text-brand-black placeholder:text-gray-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val && !kawasanValue.includes(val)) {
                      setValue('kawasan', [...kawasanValue, val], { shouldValidate: true, shouldDirty: true });
                    }
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
            {KAWASAN_OPTIONS.filter(k => !kawasanValue.includes(k)).length > 0 && (
              <div className="flex flex-wrap gap-1.5 items-center mt-1">
                <span className="text-xs text-gray-400">Saran:</span>
                {KAWASAN_OPTIONS.filter(k => !kawasanValue.includes(k)).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => toggleArray(kawasanValue, k, 'kawasan')}
                    className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-500 hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                  >
                    + {k}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.kawasan && <p className="mt-1 text-xs text-[#B33A3A]">{errors.kawasan.message}</p>}
        </div>

        {/* Maps Link */}
        <div className="sm:col-span-2">
          <FormField
            label="Link Google Maps"
            type="url"
            placeholder="https://maps.app.goo.gl/..."
            {...register('maps_link')}
            error={errors.maps_link?.message}
            isDirty={!!dirtyFields.maps_link}
          />
        </div>
      </div>

      {serverError && (
        <div className="p-3 rounded-lg bg-red-50 text-[#B33A3A] text-sm">
          {serverError}
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleSubmit((data) => onSubmit(data, false))}
          disabled={isPending}
          className="px-6 py-3 bg-brand-gold text-brand-black font-bold rounded-lg text-sm hover:bg-brand-gold/90 transition-all shadow-md shadow-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Menyimpan...' : submitLabel}
        </button>
        {/* Tombol Simpan & Tambah Lagi */}
        {!initialData && (
          <button
            type="button"
            onClick={handleSubmit((data) => onSubmit(data, true))}
            disabled={isPending}
            className="px-6 py-3 bg-white border border-brand-gold text-brand-gold font-bold rounded-lg text-sm hover:bg-brand-gold/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Simpan & Tambah Lagi
          </button>
        )}
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Batal
        </button>
      </div>
    </form>
  )
}

function FormField({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  hint,
  error,
  step,
  isDirty,
  onChange,
  onBlur,
  ref,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  hint?: string
  error?: string
  step?: string
  isDirty?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  ref?: React.Ref<HTMLInputElement>
}) {
  return (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-medium text-brand-black mb-1.5 flex justify-between items-center">
        <span>{label} {required && <span className="text-brand-red">*</span>}</span>
        {isDirty && <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full uppercase tracking-wider animate-scale-in">Telah Diubah</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        step={step}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm text-brand-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all ${
          isDirty 
            ? 'border-brand-gold bg-brand-gold/5 focus:border-brand-gold shadow-[0_0_10px_rgba(201,169,97,0.1)]' 
            : 'border-gray-200 bg-white focus:border-brand-gold'
        } ${error ? 'border-brand-red focus:border-brand-red focus:ring-brand-red/50' : ''}`}
      />
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-[#B33A3A]">{error}</p>}
    </div>
  )
}
