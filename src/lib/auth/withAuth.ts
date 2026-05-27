import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, getCurrentProfile } from './getUser'
import type { UserRole } from '@/types/database'

// Define a generic type for Route Handlers in Next.js App Router
type RouteHandler = (req: NextRequest, context: any) => Promise<NextResponse> | NextResponse

/**
 * HOC / wrapper untuk API routes
 * Cek session + role sebelum eksekusi handler
 */
export function withAuth(
  handler: RouteHandler,
  requiredRole?: UserRole
): RouteHandler {
  return async (req, context) => {
    const user = await getCurrentUser()
    
    // Check session
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Harap login' }, { status: 401 })
    }

    // Check role if specified
    if (requiredRole) {
      const profile = await getCurrentProfile()
      
      if (!profile || !profile.is_active) {
        return NextResponse.json({ error: 'Forbidden: Akun dinonaktifkan' }, { status: 403 })
      }

      // 'superadmin' rule
      if (requiredRole === 'superadmin' && profile.role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden: Hak akses tidak mencukupi' }, { status: 403 })
      }
      
      // 'admin' rule (allows both admin and superadmin)
      if (requiredRole === 'admin' && profile.role !== 'admin' && profile.role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden: Hak akses tidak mencukupi' }, { status: 403 })
      }
    }

    // Eksekusi handler utama jika lolos pengecekan
    return handler(req, context)
  }
}
