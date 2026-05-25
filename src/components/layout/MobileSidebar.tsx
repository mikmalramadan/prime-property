'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/agent/dashboard/properties', label: 'Properti', icon: PropertiesIcon },
] as const

const SUPERADMIN_LINKS = [
  { href: '/agent/dashboard/admin', label: 'Kelola Admin', icon: AdminIcon },
  { href: '/agent/dashboard/audit', label: 'Audit Log', icon: AuditIcon },
] as const

interface MobileSidebarProps {
  email: string
  role: string
  isSuperadmin: boolean
}

export function MobileSidebar({ email, role, isSuperadmin }: MobileSidebarProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-brand-gold hover:bg-brand-gray transition-colors"
        aria-label="Buka menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Overlay + Drawer */}
      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-brand-black shadow-2xl flex flex-col animate-slide-in-left">
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <Link href="/agent/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded" />
                <span className="text-lg font-bold text-white tracking-tight">
                  Prime<span className="text-brand-gold">Property</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                >
                  <link.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{link.label}</span>
                </Link>
              ))}
              {isSuperadmin &&
                SUPERADMIN_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    <link.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                ))}
            </nav>

            {/* User info */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-sm font-bold">
                  {email[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{email}</p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

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
