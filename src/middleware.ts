import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Next.js Middleware — runs on every matched request before rendering.
 *
 * Delegates session refresh to updateSession() so that:
 *  - Expired tokens are exchanged for fresh ones before the page renders.
 *  - Server Components always receive a valid (non-expired) Supabase session.
 */
export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match every path EXCEPT:
     *  - _next/static  (static assets)
     *  - _next/image   (Next.js image optimisation)
     *  - favicon.ico
     *  - Any file with an extension (e.g. .png, .svg, .woff2)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|ico)$).*)',
  ],
}
