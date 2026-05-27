import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

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

// Global rate limiter: 100 requests per minute
const globalRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit/global',
})

// Auth rate limiter: 10 requests per minute for /agent/login
const authRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit/auth',
})

export async function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'

  // Apply Auth rate limit for login endpoint
  if (request.method === 'POST' && request.nextUrl.pathname === '/agent/login') {
    try {
      const { success } = await authRateLimit.limit(`auth_${ip}`)
      if (!success) {
        return new NextResponse('Too Many Requests. Auth Limit Exceeded.', { status: 429 })
      }
    } catch (error) {
      console.error('Redis Auth Rate Limit Error:', error)
    }
  }

  // Apply Global rate limit for all requests
  try {
    const { success } = await globalRateLimit.limit(`global_${ip}`)
    if (!success) {
      return new NextResponse('Too Many Requests. Global Limit Exceeded.', { status: 429 })
    }
  } catch (error) {
    console.error('Redis Global Rate Limit Error:', error)
  }

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
