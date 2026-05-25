'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NAV_LINKS = [
  { label: 'Beranda',     href: '/'         },
  { label: 'Tentang Kami', href: '/tentang' },
  { label: 'Kontak',      href: '/kontak'   },
]

export default function PublicHeader() {
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [scrolled,   setScrolled]   = useState(false)

  // Shadow appears once user scrolls past 8 px
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 8)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Close mobile menu on resize ≥ 768 px
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const close = (e: MediaQueryListEvent) => { if (e.matches) setMenuOpen(false) }
    mq.addEventListener('change', close)
    return () => mq.removeEventListener('change', close)
  }, [])

  return (
    <header
      id="public-header"
      style={{
        position:        'sticky',
        top:             0,
        zIndex:          50,
        backgroundColor: '#1A1A1A',
        borderBottom:    scrolled ? '1px solid rgba(201,169,97,0.25)' : '1px solid transparent',
        boxShadow:       scrolled ? '0 4px 24px rgba(0,0,0,0.45)' : 'none',
        transition:      'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth:      '1280px',
          margin:        '0 auto',
          padding:       '0 24px',
          height:        '72px',
          display:       'flex',
          alignItems:    'center',
          justifyContent:'space-between',
          gap:           '16px',
        }}
      >
        {/* ── Logo ─────────────────────────────────────────────────── */}
        <Link
          href="/"
          id="header-logo-link"
          aria-label="Prime Property — kembali ke beranda"
          style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
        >
          <Image
            src="/logo.png"
            alt="Prime Property"
            width={140}
            height={40}
            priority
            style={{ objectFit: 'contain', height: '40px', width: 'auto' }}
          />
        </Link>

        {/* ── Desktop navigation ───────────────────────────────────── */}
        <nav
          id="desktop-nav"
          aria-label="Navigasi utama"
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '32px',
            // Hide on mobile (handled via JS class / inline below)
          }}
          className="pp-desktop-nav"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              id={`nav-link-${label.toLowerCase().replace(/\s+/g, '-')}`}
              className="pp-nav-link"
              style={{
                color:          '#F5F5F5',
                fontSize:       '14px',
                fontWeight:     500,
                letterSpacing:  '0.04em',
                transition:     'color 0.2s ease',
                whiteSpace:     'nowrap',
              }}
            >
              {label}
            </Link>
          ))}

          {/* Login Agent button */}
          <Link
            href="/agent/login"
            id="header-login-btn"
            className="pp-login-btn"
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           '6px',
              padding:       '8px 20px',
              border:        '1.5px solid #C9A961',
              borderRadius:  '6px',
              color:         '#C9A961',
              fontSize:      '13px',
              fontWeight:    600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              whiteSpace:    'nowrap',
              transition:    'background-color 0.2s ease, color 0.2s ease',
            }}
          >
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Login Agent
          </Link>
        </nav>

        {/* ── Hamburger (mobile only) ──────────────────────────────── */}
        <button
          id="hamburger-btn"
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="pp-hamburger"
          style={{
            display:        'flex',
            flexDirection:  'column',
            justifyContent: 'center',
            alignItems:     'center',
            gap:            '5px',
            width:          '40px',
            height:         '40px',
            background:     'transparent',
            border:         'none',
            cursor:         'pointer',
            padding:        '4px',
            borderRadius:   '6px',
          }}
        >
          {/* Three bars that animate into an X */}
          {([0, 1, 2] as const).map((i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                display:         'block',
                width:           '22px',
                height:          '2px',
                backgroundColor: '#C9A961',
                borderRadius:    '2px',
                transformOrigin: 'center',
                transition:      'transform 0.25s ease, opacity 0.25s ease',
                transform:
                  menuOpen
                    ? i === 0
                      ? 'translateY(7px) rotate(45deg)'
                      : i === 2
                      ? 'translateY(-7px) rotate(-45deg)'
                      : 'scaleX(0)'
                    : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* ── Mobile menu drawer ──────────────────────────────────────── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Menu navigasi"
        aria-modal="false"
        style={{
          overflow:        'hidden',
          maxHeight:       menuOpen ? '400px' : '0',
          transition:      'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: '#1A1A1A',
          borderTop:       menuOpen ? '1px solid rgba(201,169,97,0.2)' : '1px solid transparent',
        }}
      >
        <nav
          aria-label="Navigasi mobile"
          style={{ padding: '16px 24px 24px' }}
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  id={`mobile-nav-link-${label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display:       'block',
                    padding:       '14px 0',
                    color:         '#F5F5F5',
                    fontSize:      '16px',
                    fontWeight:    500,
                    borderBottom:  '1px solid rgba(255,255,255,0.06)',
                    letterSpacing: '0.02em',
                    transition:    'color 0.2s ease',
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Mobile login button */}
            <li style={{ paddingTop: '20px' }}>
              <Link
                href="/agent/login"
                id="mobile-login-btn"
                onClick={() => setMenuOpen(false)}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  gap:            '8px',
                  padding:        '12px 20px',
                  border:         '1.5px solid #C9A961',
                  borderRadius:   '6px',
                  color:          '#C9A961',
                  fontSize:       '14px',
                  fontWeight:     600,
                  letterSpacing:  '0.06em',
                  textTransform:  'uppercase',
                  transition:     'background-color 0.2s ease, color 0.2s ease',
                }}
              >
                Login Agent
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* ── Scoped CSS ──────────────────────────────────────────────── */}
      <style>{`
        /* Desktop nav: visible ≥ 768 px */
        .pp-desktop-nav { display: none; }
        .pp-hamburger   { display: flex; }

        @media (min-width: 768px) {
          .pp-desktop-nav { display: flex; }
          .pp-hamburger   { display: none; }
        }

        /* Hover states */
        .pp-nav-link:hover { color: #C9A961 !important; }
        .pp-login-btn:hover {
          background-color: #C9A961 !important;
          color: #1A1A1A !important;
        }
      `}</style>
    </header>
  )
}
