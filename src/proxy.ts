import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Next.js Proxy (previously Middleware) — runs on every matched request.
 *
 * In Next.js 16, the `middleware` file convention has been renamed to `proxy`.
 * The functionality remains the same.
 *
 * Responsibilities (implemented in updateSession):
 *  1. Refresh the Supabase session so Server Components always receive
 *     a valid (non-expired) access token.
 *  2. Protect /agent/* routes — redirect unauthenticated users to /agent/login.
 *  3. Redirect authenticated users away from /agent/login to /agent/dashboard.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match every path EXCEPT:
     *  - _next/static  (static assets)
     *  - _next/image   (Next.js image optimisation)
     *  - favicon.ico
     *  - Files with a static extension (.png, .svg, .woff2, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|ico)$).*)',
  ],
}
