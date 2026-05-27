import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

/** All protected agent routes live under this prefix */
const AGENT_PREFIX  = '/agent'
const AGENT_LOGIN   = '/agent/login'
const AGENT_DASHBOARD = '/agent/dashboard'

/**
 * Refresh the Supabase session and enforce /agent/* route protection.
 *
 * Rules:
 *  1. Every /agent/* route except /agent/login requires authentication.
 *     → Unauthenticated visitors are redirected to /agent/login.
 *  2. An already-authenticated user who visits /agent/login is redirected
 *     to /agent/dashboard (avoids landing on the login page while signed in).
 *
 * Session refresh pattern (per @supabase/ssr docs/design.md):
 *  - `getAll`  reads cookies from the incoming request.
 *  - `setAll`  writes new tokens BOTH to the mutated request (downstream server
 *              code sees fresh tokens) AND to the response (browser stores them).
 *
 * IMPORTANT: Always use getUser() here, never getSession().
 *  getSession() reads from cookies without calling the Auth server and must
 *  not be trusted for authorization decisions.
 */
export async function updateSession(request: NextRequest) {
  // Passthrough response — we may swap it for a redirect below
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 1. Mutate request so downstream Server Components see fresh tokens
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          // 2. Re-create the response with the updated request headers
          supabaseResponse = NextResponse.next({ request })
          // 3. Attach Set-Cookie headers so the browser persists the new tokens
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              httpOnly: true,
              secure: options.secure,
              sameSite: 'lax',
            }),
          )
        },
      },
    },
  )

  // Verify session with Auth server — safe for authorization decisions
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ── Rule 1: protect all /agent/* routes except /agent/login and /agent/update-password ──
  const isAgentRoute = pathname.startsWith(AGENT_PREFIX)
  const isLoginPage  = pathname === AGENT_LOGIN
  const isUpdatePasswordPage = pathname === '/agent/update-password'

  if (isAgentRoute && !isLoginPage && !isUpdatePasswordPage && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = AGENT_LOGIN
    // Preserve the intended destination so we can redirect back after login
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── Rule 2: redirect authenticated users away from the login page ─────────
  if (isLoginPage && user) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = AGENT_DASHBOARD
    dashboardUrl.search = ''
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}
