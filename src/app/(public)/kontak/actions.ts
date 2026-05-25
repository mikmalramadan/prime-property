'use server'

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
 *
 * For now this stores nothing (no DB table yet) — it validates and returns
 * success. Phase 2 can add a `contact_messages` table or email delivery.
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

  // --- Process ---
  // TODO: Store in `contact_messages` table or send email via Resend/SendGrid.
  // For now, log and return success.
  console.log('[Contact Form]', { nama, email, phone, pesan })

  return { success: true }
}
