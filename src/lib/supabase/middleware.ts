import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

/**
 * Refresh the Supabase session inside Next.js Middleware.
 *
 * This is the only place where session refresh MUST happen so that:
 *  1. The refreshed session cookie is written to the response before the page renders.
 *  2. Server Components downstream can read the valid (non-expired) session.
 *
 * Pattern per @supabase/ssr docs design.md:
 *  - `getAll`  reads from the incoming request cookies.
 *  - `setAll`  writes BOTH to the mutated request (so downstream server code
 *              sees the new token) AND to the response (so the browser stores it).
 *
 * Usage — create a `src/middleware.ts` file that calls this:
 * ```ts
 * import { updateSession } from '@/lib/supabase/middleware'
 * export async function middleware(request: NextRequest) {
 *   return updateSession(request)
 * }
 * export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
 * ```
 */
export async function updateSession(request: NextRequest) {
  // Start with a passthrough response that we can attach Set-Cookie headers to
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
          // 1. Mutate the request so downstream server code sees fresh tokens
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          // 2. Re-create the response with the mutated request headers
          supabaseResponse = NextResponse.next({ request })
          // 3. Attach Set-Cookie headers so the browser stores the new tokens
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT: Do NOT call supabase.auth.getSession() here.
  // getSession() reads from cookies without verifying with the Auth server.
  // getUser() calls the Auth server and is safe for authorization decisions.
  const { data: { user } } = await supabase.auth.getUser()

  // Example: redirect unauthenticated users away from the admin area
  // Uncomment and adapt once admin routes are created.
  //
  // if (!user && request.nextUrl.pathname.startsWith('/admin')) {
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/login'
  //   return NextResponse.redirect(url)
  // }

  void user // suppress unused-variable lint until the redirect is enabled

  return supabaseResponse
}
