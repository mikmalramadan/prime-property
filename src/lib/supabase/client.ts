import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Supabase browser client.
 *
 * - Cached as a singleton per tab (handled internally by @supabase/ssr).
 * - Safe to call from Client Components and browser-only utilities.
 * - Do NOT use for server-side auth decisions — use the server client instead.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
