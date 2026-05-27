import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Supabase Admin Client using the Service Role Key
// DANGER: NEVER use this on the client side!
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
