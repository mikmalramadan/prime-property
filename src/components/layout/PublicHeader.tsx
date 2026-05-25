'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang-kami', label: 'Tentang Kami' },
  { href: '/kontak', label: 'Kontak' },
] as const

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-gray/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Prime Property Logo"
              width={32}
              height={32}
              className="rounded"
            />
            <Link href="/" className="font-bold text-xl text-brand-black tracking-tight">
              Prime<span className="text-brand-gold">Property</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-brand-black hover:text-brand-gold transition-colors font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Login button + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/agent/login"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2 border-2 border-brand-gold text-brand-gold text-sm font-semibold rounded-md hover:bg-brand-gold hover:text-white transition-all duration-200"
            >
              Login Agent
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-brand-black hover:text-brand-gold hover:bg-brand-gray transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-80 border-t border-brand-gray/50' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-4 space-y-1 bg-white">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-lg text-brand-black hover:bg-brand-gray hover:text-brand-gold transition-colors font-medium text-sm"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-brand-gray">
            <Link
              href="/agent/login"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-4 py-3 border-2 border-brand-gold text-brand-gold font-semibold rounded-lg hover:bg-brand-gold hover:text-white transition-all text-sm"
            >
              Login Agent
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
