'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { logoutAdminSession } from '@/lib/frontend/admin-api'

const links = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/org', label: 'Organization' },
  { href: '/dashboard/events', label: 'Events' },
  { href: '/dashboard/committees', label: 'Committees' },
  { href: '/dashboard/alumni', label: 'Alumni' },
  { href: '/dashboard/advisors', label: 'Advisors' },
  { href: '/dashboard/gallery', label: 'Gallery' },
  { href: '/dashboard/member-directory', label: 'Member Directory' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await logoutAdminSession()
    window.location.replace('/login')
  }

  return (
    <>
      <button
        className="btn-primary fixed left-4 top-20 z-40 lg:hidden"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        {open ? 'Close menu' : 'Open menu'}
      </button>

      <aside
        // className={`fixed left-0 top-0 z-30 h-full w-[280px] border-r border-white/10 bg-slate-950/90 px-5 py-24 backdrop-blur transition-transform duration-300 lg:translate-x-0 ${
        //   open ? 'translate-x-0' : '-translate-x-full'
        // }`}

  //       className={`fixed left-0 top-0 z-30 h-screen w-[280px] overflow-y-auto overscroll-contain border-r border-white/10 bg-slate-950/90 px-5 py-24 backdrop-blur transition-transform duration-300 lg:translate-x-0 ${
  //   open ? 'translate-x-0' : '-translate-x-full'
  // }`}

  className={`dashboard-scrollbar-hide fixed left-0 top-0 z-30 h-screen w-[280px] overflow-y-auto overscroll-contain border-r border-white/10 bg-slate-950/90 px-5 py-24 backdrop-blur transition-transform duration-300 lg:translate-x-0 ${
    open ? 'translate-x-0' : '-translate-x-full'
  }`}


      >
        <div className="mb-6">
          <span className="pill">Admin Panel</span>
          <h2 className="font-display mt-4 text-2xl font-semibold text-white">DUSAU Dashboard</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Manage organization metadata, committees, events, media, and people.
          </p>
        </div>

        <nav className="grid gap-2">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`)

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm transition ${
                  active
                    ? 'bg-green-500/15 text-green-300 ring-1 ring-green-400/30'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            )
          })}

        </nav>

        <div className="mt-8 border-t border-white/10 pt-6">
 <Link
  href="/"
  className="mb-3 block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-slate-200 transition hover:bg-white/10"
>
  Go back to home
</Link>
          <button type="button" onClick={handleLogout} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10">
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}