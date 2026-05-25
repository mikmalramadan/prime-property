import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /agent/logout
 *
 * Signs the user out of Supabase Auth (clears session cookies)
 * and redirects to /agent/login.
 *
 * We use a Route Handler (POST) instead of a Server Action because:
 *  - Logout is a navigation-level side effect, not a form mutation.
 *  - A POST route is CSRF-safe (browsers don't send POST on link clicks).
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const loginUrl = new URL('/agent/login', request.nextUrl.origin)
  return NextResponse.redirect(loginUrl, { status: 303 })
}
