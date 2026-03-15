'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { navLinks, siteConfig } from '@/data/store'

export default function SiteNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY <= 24) {
        setVisible(true)
        lastScrollY.current = currentScrollY
        return
      }

      const scrollingDown = currentScrollY > lastScrollY.current

      if (scrollingDown && currentScrollY > 180) {
        setVisible(false)
        setOpen(false)
      } else {
        setVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="border-b border-white/10 bg-black shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
        <div className="container-app">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-sm font-bold text-slate-950 shadow-lg shadow-green-500/20">
                DU
              </div>
              <div>
                <p className="font-display text-base font-semibold text-white">
                  {siteConfig.name}
                </p>
                <p className="text-xs text-slate-400">{siteConfig.tagline}</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const active = pathname === link.href

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      active
                        ? 'bg-white/10 text-white'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}

              <Link href="/admin-demo" className="btn-primary ml-3">
                Admin Demo
              </Link>
            </nav>

            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black text-white transition hover:bg-white/10 lg:hidden"
              aria-label="Toggle menu"
            >
              <div className="space-y-1.5">
                <span className="block h-0.5 w-5 bg-white" />
                <span className="block h-0.5 w-5 bg-white" />
                <span className="block h-0.5 w-5 bg-white" />
              </div>
            </button>
          </div>

          {open && (
            <div className="border-t border-white/10 bg-black py-3 lg:hidden">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const active = pathname === link.href

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`rounded-2xl px-4 py-3 text-sm transition ${
                        active
                          ? 'bg-white/10 text-white'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                })}

                <Link
                  href="/admin-demo"
                  onClick={() => setOpen(false)}
                  className="btn-primary mt-2 text-center"
                >
                  Admin Demo
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}