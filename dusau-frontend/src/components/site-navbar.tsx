'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useLocalizedContent } from '@/hooks/use-locallized-content'
import { useLanguageStore } from '@/store/use-language-store'

export default function SiteNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const lastScrollY = useRef(0)

  const { language, content } = useLocalizedContent()
  const toggleLanguage = useLanguageStore((state) => state.toggleLanguage)

  const isDashboardRoute = pathname.startsWith('/dashboard')

  const publicNavLinks = content.navLinks.filter(
    (link) => link.href !== '/login' && link.href !== '/dashboard',
  )

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    let active = true

    async function checkAuth() {
      try {
        const response = await fetch('/api/admin/auth/me', {
          credentials: 'include',
          cache: 'no-store',
        })

        if (active) setIsLoggedIn(response.ok)
      } catch {
        if (active) setIsLoggedIn(false)
      }
    }

    checkAuth()

    return () => {
      active = false
    }
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

  if (isDashboardRoute) {
    return (
      <header className="sticky top-0 z-50 border-b border-[hsl(var(--border-soft))] bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="container-app">
          <div className="flex items-center justify-end py-3">
            <Link href="/" className="btn-secondary">
              ← Get back to home
            </Link>
          </div>
        </div>
      </header>
    )
  }

  const authHref = isLoggedIn ? '/dashboard' : '/login'
  const authLabel = isLoggedIn ? 'Dashboard' : 'Login'

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="border-b border-[hsl(var(--border-soft))] bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="container-app">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="group flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--brand))] text-sm font-black text-white shadow-sm transition group-hover:bg-[hsl(var(--brand-hover))]">
                DU
              </div>

              <div className="hidden min-w-0 sm:block">
                <p className="font-display truncate text-base font-black leading-5 text-[hsl(var(--text-main))]">
                  {content.siteConfig.name}
                </p>
                <p className="text-xs font-semibold text-[hsl(var(--text-muted))]">
                  Community Platform
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {publicNavLinks.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(`${link.href}/`))

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                      active
                        ? 'bg-[hsl(var(--brand-soft))] text-[hsl(var(--brand))]'
                        : 'text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--app-bg-soft))] hover:text-[hsl(var(--text-main))]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}

              <button
                type="button"
                onClick={toggleLanguage}
                className="ml-2 rounded-full border border-[hsl(var(--border-soft))] bg-white px-4 py-2 text-sm font-bold text-[hsl(var(--text-main))] shadow-sm transition hover:border-[hsl(var(--brand)_/_0.35)] hover:bg-[hsl(var(--brand-soft))]"
              >
                {language === 'en' ? 'বাংলা' : 'English'}
              </button>

              {isLoggedIn === null ? (
                <span className="ml-3 h-10 w-24 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
              ) : (
                <Link href={authHref} className="btn-primary ml-3">
                  {authLabel}
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={toggleLanguage}
                className="rounded-full border border-[hsl(var(--border-soft))] bg-white px-3 py-2 text-xs font-bold text-[hsl(var(--text-main))] shadow-sm transition hover:bg-[hsl(var(--brand-soft))]"
              >
                {language === 'en' ? 'বাংলা' : 'English'}
              </button>

              {isLoggedIn === null ? (
                <span className="h-10 w-16 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
              ) : (
                <Link href={authHref} className="btn-primary px-3 py-2 text-xs">
                  {authLabel}
                </Link>
              )}

              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--border-soft))] bg-white text-[hsl(var(--text-main))] shadow-sm transition hover:bg-[hsl(var(--brand-soft))]"
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                <div className="space-y-1.5">
                  <span className="block h-0.5 w-5 rounded-full bg-[hsl(var(--text-main))]" />
                  <span className="block h-0.5 w-5 rounded-full bg-[hsl(var(--text-main))]" />
                  <span className="block h-0.5 w-5 rounded-full bg-[hsl(var(--text-main))]" />
                </div>
              </button>
            </div>
          </div>

          {open && (
            <div className="border-t border-[hsl(var(--border-soft))] bg-white py-3 lg:hidden">
              <div className="grid gap-1">
                {publicNavLinks.map((link) => {
                  const active =
                    pathname === link.href ||
                    (link.href !== '/' && pathname.startsWith(`${link.href}/`))

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                        active
                          ? 'bg-[hsl(var(--brand-soft))] text-[hsl(var(--brand))]'
                          : 'text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--app-bg-soft))] hover:text-[hsl(var(--text-main))]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                })}

                {isLoggedIn !== null && (
                  <Link
                    href={authHref}
                    onClick={() => setOpen(false)}
                    className="btn-primary mt-2 text-center"
                  >
                    {authLabel}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}