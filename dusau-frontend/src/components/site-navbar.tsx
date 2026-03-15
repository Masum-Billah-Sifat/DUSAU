'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { navLinks, siteConfig } from '@/data/store'

export default function SiteNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50">
      <div className="container-app pt-4">
        <div className="glass flex items-center justify-between px-4 py-3 sm:px-5">
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
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white lg:hidden"
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
          <div className="glass mt-3 p-3 lg:hidden">
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
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
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
    </header>
  )
}