import { getCurrentProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MobileSidebar } from '@/components/layout/MobileSidebar'

/**
 * Agent Dashboard Layout — wraps all /agent/dashboard/* pages.
 *
 * Responsibilities:
 *  - Fetch current profile (defense-in-depth; middleware already guards auth)
 *  - Render sidebar navigation and top header
 *  - Pass children (the active page)
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfile()

  // Defense-in-depth: middleware should catch this, but just in case
  if (!profile || !profile.is_active) {
    redirect('/agent/login')
  }

  const isSuperadmin = profile.role === 'superadmin'

  return (
    <div className="min-h-dvh flex bg-brand-gray">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-brand-black border-r border-white/5">
        {/* Sidebar header */}
        <div className="p-6 border-b border-white/5">
          <Link href="/agent/dashboard" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded" />
            <span className="text-lg font-bold text-white tracking-tight">
              Prime<span className="text-brand-gold">Property</span>
            </span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <SidebarLink href="/agent/dashboard" icon={DashboardIcon}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/agent/dashboard/properties" icon={PropertiesIcon}>
            Properti
          </SidebarLink>
          {isSuperadmin && (
            <>
              <SidebarLink href="/agent/dashboard/admin" icon={AdminIcon}>
                Kelola Admin
              </SidebarLink>
              <SidebarLink href="/agent/dashboard/audit" icon={AuditIcon}>
                Audit Log
              </SidebarLink>
            </>
          )}
        </nav>

        {/* Sidebar footer — user info */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-sm font-bold">
              {profile.email[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-white truncate">{profile.email}</p>
              <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 h-16 flex items-center px-4 sm:px-6 lg:px-8 justify-between">
          {/* Mobile: hamburger + logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <MobileSidebar
              email={profile.email}
              role={profile.role}
              isSuperadmin={isSuperadmin}
            />
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="rounded" />
            <span className="text-base font-bold text-brand-black tracking-tight">
              Prime<span className="text-brand-gold">Property</span>
            </span>
          </div>

          {/* Spacer for desktop */}
          <div className="hidden lg:block" />

          {/* Right side: user menu + logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold text-xs font-bold">
                {profile.email[0].toUpperCase()}
              </div>
              <span className="text-sm text-gray-600">{profile.email}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold font-medium capitalize">
                {profile.role}
              </span>
            </div>

            {/* Logout */}
            <form action="/agent/logout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </form>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sidebar link component
// ---------------------------------------------------------------------------

function SidebarLink({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: React.FC<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span>{children}</span>
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  )
}

function PropertiesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
    </svg>
  )
}

function AdminIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

function AuditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}
