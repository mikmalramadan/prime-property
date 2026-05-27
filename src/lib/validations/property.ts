import { z } from 'zod'
export const propertySchema = z.object({
  nama_property: z.string().min(3, 'Nama properti minimal 3 karakter').max(100, 'Nama properti maksimal 100 karakter'),
  group_name: z.string().max(100).optional().nullable(),
  unit: z.string().max(50).optional().nullable(),
  
  lebar: z.number({ message: 'Lebar harus berupa angka' })
    .positive('Lebar harus lebih dari 0')
    .multipleOf(0.01, 'Lebar maksimal 2 angka di belakang koma'),
  
  panjang: z.number({ message: 'Panjang harus berupa angka' })
    .positive('Panjang harus lebih dari 0')
    .multipleOf(0.01, 'Panjang maksimal 2 angka di belakang koma'),
  
  price: z.number({ message: 'Harga harus berupa angka' })
    .int('Harga harus bilangan bulat')
    .positive('Harga harus lebih dari 0'),
  
  tingkat: z.number({ message: 'Tingkat harus berupa angka' })
    .min(1, 'Minimal 1 lantai')
    .max(10, 'Maksimal 10 lantai')
    .multipleOf(0.1, 'Maksimal 1 desimal'),
  
  carport: z.boolean(),
  
  tipe: z.enum(['Ruko', 'Villa'] as const, { message: 'Tipe harus dipilih' }),
  status: z.enum(['in_stock', 'sold_out'] as const, { message: 'Status harus dipilih' }),
  siap: z.enum(['siap_huni', 'siap_kosong', 'siap_huni_renovasi'] as const, { message: 'Siap huni/kosong harus dipilih' }),
  
  hadap: z.array(z.string()).min(1, 'Minimal pilih 1 arah hadap'),
  kawasan: z.array(z.string()).min(1, 'Minimal pilih 1 kawasan'),
  
  maps_link: z.string()
    .url('Format URL tidak valid')
    .includes('google.com/maps', { message: 'URL harus dari Google Maps (google.com/maps)' })
    .optional()
    .nullable()
    // Transform empty string to null for DB consistency
    .transform(val => val === '' ? null : val),
})

export type PropertyFormValues = z.input<typeof propertySchema>
