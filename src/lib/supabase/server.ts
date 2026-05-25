import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

/**
 * Supabase server client.
 *
 * - Must be called inside a Server Component, Server Action, or Route Handler.
 * - Creates a new client per request (never share across requests).
 * - Uses `getAll` / `setAll` cookie methods — the modern @supabase/ssr ≥ 0.4
 *   pattern that correctly handles cookie chunking edge-cases.
 * - Can READ and WRITE cookies (unlike Server Components which are read-only).
 *   For Server Components that cannot set cookies, missing `setAll` will emit
 *   a console warning — the middleware client handles the actual refresh.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // setAll is called from Server Components where cookies cannot be
            // mutated. The middleware refreshes the session, so this is safe
            // to ignore.
          }
        },
      },
    },
  )
}
