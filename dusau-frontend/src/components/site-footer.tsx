'use client'

import Link from 'next/link'
import { useLocalizedContent } from '@/hooks/use-locallized-content'

export default function SiteFooter() {
  const { content } = useLocalizedContent()

  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container-app">
        <div className="glass-strong grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="font-display text-2xl font-semibold text-white">
              {content.siteConfig.name}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
              {content.footer.description}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              {content.footer.exploreHeading}
            </p>
            <div className="mt-4 grid gap-2">
              {content.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              {content.footer.contactHeading}
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p>{content.siteConfig.email}</p>
              <p>{content.siteConfig.phone}</p>
              <p>{content.siteConfig.location}</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {content.siteConfig.name}.{' '}
          {content.footer.copyrightNote}
        </p>
      </div>
    </footer>
  )
}