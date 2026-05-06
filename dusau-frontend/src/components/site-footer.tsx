'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocalizedContent } from '@/hooks/use-locallized-content'

export default function SiteFooter() {
  const { content } = useLocalizedContent()
  const pathname = usePathname()

  const isDashboardRoute = pathname.startsWith('/dashboard')

  if (isDashboardRoute) {
    return null
  }

  return (
    <footer className="border-t border-[hsl(var(--border-soft))] py-10 sm:py-14">
      <div className="container-app">
        <div className="overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white shadow-xl">
          <div className="grid gap-0 lg:grid-cols-[1.25fr_0.8fr_0.95fr]">
            <div className="bg-[hsl(var(--text-main))] p-6 text-white sm:p-8 lg:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-black text-[hsl(var(--brand))]">
                  DU
                </div>

                <div>
                  <p className="font-display text-2xl font-black tracking-tight text-white">
                    {content.siteConfig.name}
                  </p>
                  <p className="text-xs font-semibold text-white/60">
                    Community Platform
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/75">
                {content.footer.description}
              </p>
            </div>

            <div className="border-b border-[hsl(var(--border-soft))] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--brand))]">
                {content.footer.exploreHeading}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-1">
                {content.navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-3 py-2 text-sm font-bold text-[hsl(var(--text-muted))] transition hover:bg-[hsl(var(--brand-soft))] hover:text-[hsl(var(--brand))]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--brand))]">
                {content.footer.contactHeading}
              </p>

              <div className="mt-5 space-y-3 text-sm font-semibold leading-7 text-[hsl(var(--text-muted))]">
                <p className="rounded-2xl bg-[hsl(var(--app-bg-soft))] px-4 py-3">
                  {content.siteConfig.email}
                </p>
                <p className="rounded-2xl bg-[hsl(var(--app-bg-soft))] px-4 py-3">
                  {content.siteConfig.phone}
                </p>
                <p className="rounded-2xl bg-[hsl(var(--app-bg-soft))] px-4 py-3">
                  {content.siteConfig.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-semibold leading-6 text-[hsl(var(--text-soft))]">
          © {new Date().getFullYear()} {content.siteConfig.name}.{' '}
          {content.footer.copyrightNote}
        </p>
      </div>
    </footer>
  )
}