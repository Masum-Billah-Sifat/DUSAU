'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { adminJson } from '@/lib/admin/api'

type AuthMeResponse = {
  ok: boolean
  admin?: {
    email?: string
  }
}

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/organization', label: 'Organization' },
  { href: '/dashboard/alumni', label: 'Alumni' },
  { href: '/dashboard/advisors', label: 'Advisors' },
  { href: '/dashboard/gallery', label: 'Gallery' },
  { href: '/dashboard/committees', label: 'Committees' },
  { href: '/dashboard/events', label: 'Events' },
]

function isActivePath(pathname: string, href: string) {
  if (href === '/dashboard') {
    return pathname === '/dashboard'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function DashboardLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[hsl(var(--app-bg))] px-4 text-[hsl(var(--text-main))]">
      <section className="w-full max-w-md rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-6 text-center shadow-xl">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-2xl bg-[hsl(var(--brand-soft))]" />

        <h1 className="font-display mt-5 text-2xl font-black tracking-tight">
          Checking admin session
        </h1>

        <p className="mt-2 text-sm leading-6 text-[hsl(var(--text-muted))]">
          Please wait while we verify your dashboard access.
        </p>
      </section>
    </main>
  )
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [adminEmail, setAdminEmail] = useState('')

  const activeLabel = useMemo(() => {
    const active = navItems
      .filter((item) => isActivePath(pathname, item.href))
      .sort((a, b) => b.href.length - a.href.length)[0]

    return active?.label ?? 'Dashboard'
  }, [pathname])

  useEffect(() => {
    let ignore = false

    async function checkAuth() {
      try {
        const data = await adminJson<AuthMeResponse>('/api/admin/auth/me')

        if (!ignore) {
          setAdminEmail(data.admin?.email || '')
          setLoading(false)
        }
      } catch {
        if (!ignore) {
          router.replace('/login')
        }
      }
    }

    checkAuth()

    return () => {
      ignore = true
    }
  }, [router])

  async function logout() {
    try {
      await adminJson('/api/admin/auth/logout', {
        method: 'POST',
      })
    } finally {
      router.replace('/login')
    }
  }

  if (loading) {
    return <DashboardLoading />
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--app-bg))] text-[hsl(var(--text-main))]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 border-r border-[hsl(var(--border-soft))] bg-white/95 shadow-xl backdrop-blur-xl lg:flex lg:flex-col">
        <div className="border-b border-[hsl(var(--border-soft))] p-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--brand))] text-sm font-black text-white shadow-sm">
              DU
            </div>

            <div>
              <p className="font-display text-xl font-black leading-6 text-[hsl(var(--text-main))]">
                Admin Panel
              </p>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[hsl(var(--brand))]">
                DUSAU
              </p>
            </div>
          </Link>
        </div>

        <nav className="dashboard-scrollbar-hide flex-1 overflow-y-auto p-4">
          <div className="grid gap-2">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl px-4 py-3 text-sm font-extrabold transition ${
                    active
                      ? 'bg-[hsl(var(--brand))] text-white shadow-sm'
                      : 'text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--brand-soft))] hover:text-[hsl(var(--brand))]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-[hsl(var(--border-soft))] p-4">
          <div className="rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--brand))]">
              Logged in as
            </p>

            <p className="mt-2 break-all text-sm font-bold leading-6 text-[hsl(var(--text-main))]">
              {adminEmail || 'Admin'}
            </p>

            <button
              type="button"
              onClick={logout}
              className="mt-4 w-full rounded-full bg-red-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-80">
        <header className="sticky top-0 z-30 border-b border-[hsl(var(--border-soft))] bg-white/92 px-4 py-4 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--brand))]">
                  Dashboard
                </p>

                <h2 className="font-display mt-1 text-2xl font-black tracking-tight text-[hsl(var(--text-main))]">
                  {activeLabel}
                </h2>
              </div>

              <button
                type="button"
                onClick={logout}
                className="inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-black text-red-700 transition hover:bg-red-100 lg:hidden"
              >
                Logout
              </button>
            </div>

            <div className="dashboard-scrollbar-hide -mx-1 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navItems.map((item) => {
                const active = isActivePath(pathname, item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-extrabold transition ${
                      active
                        ? 'bg-[hsl(var(--brand))] text-white shadow-sm'
                        : 'border border-[hsl(var(--border-soft))] bg-white text-[hsl(var(--text-muted))]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </header>

        <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}