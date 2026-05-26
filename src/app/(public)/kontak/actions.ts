'use server'

import { headers } from 'next/headers'

// ---------------------------------------------------------------------------
// Rate Limiter (In-Memory for Demo)
// ---------------------------------------------------------------------------
// Tracks { count: number, resetAt: number } per IP
const contactRateLimit = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = contactRateLimit.get(ip)

  if (!record || now > record.resetAt) {
    // New IP or reset period has passed (1 hour)
    contactRateLimit.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }

  if (record.count >= 3) {
    // Exceeded 3 requests per hour
    return false
  }

  // Increment count
  record.count += 1
  return true
}

// ---------------------------------------------------------------------------
// Contact form server action
// ---------------------------------------------------------------------------

export type ContactFormState = {
  success: boolean
  errors?: {
    nama?: string
    email?: string
    phone?: string
    pesan?: string
    server?: string
  }
} | null

/**
 * Validate and process contact form submission.
 * Includes Anti-Spam (max 3/hour/IP) and mock email notification.
 */
export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const nama  = (formData.get('nama')  as string)?.trim() ?? ''
  const email = (formData.get('email') as string)?.trim() ?? ''
  const phone = (formData.get('phone') as string)?.trim() ?? ''
  const pesan = (formData.get('pesan') as string)?.trim() ?? ''

  const errors: NonNullable<ContactFormState>['errors'] = {}

  // --- Rate Limiting (Anti-Spam) ---
  // In Next.js App Router, headers() needs to be awaited in newer versions or used synchronously in 13.
  // Next 14+ requires `const headersList = await headers()` in some contexts. Let's use it safely.
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown-ip'

  if (!checkRateLimit(ip)) {
    return { 
      success: false, 
      errors: { server: 'Terlalu banyak permintaan (maksimal 3 per jam). Silakan coba lagi nanti.' } 
    }
  }

  // --- Validation ---

  if (!nama || nama.length < 2) {
    errors.nama = 'Nama minimal 2 karakter.'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Masukkan email yang valid.'
  }

  const digitsOnly = phone.replace(/\D/g, '')
  if (!phone || digitsOnly.length < 10) {
    errors.phone = 'Nomor HP minimal 10 digit.'
  }

  if (!pesan || pesan.length < 5) {
    errors.pesan = 'Pesan minimal 5 karakter.'
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  // --- Process (Mock Email Notification) ---
  console.log('=========================================')
  console.log('📧 [MOCK EMAIL NOTIFICATION SENT]')
  console.log(`To: admin@primeproperty.id`)
  console.log(`Subject: 📬 Pesan Baru dari ${nama} (${email})`)
  console.log(`Body:\nNomor HP: ${phone}\n\nPesan:\n${pesan}`)
  console.log('=========================================')

  return { success: true }
}
