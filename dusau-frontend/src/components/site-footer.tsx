import Link from 'next/link'
import { navLinks, siteConfig } from '@/data/store'

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container-app">
        <div className="glass-strong grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="font-display text-2xl font-semibold text-white">
              {siteConfig.name}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
              {siteConfig.fullName} is a student-led platform connecting Dhaka
              University students from Uttara through service, welcome,
              community, and legacy.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Explore
            </p>
            <div className="mt-4 grid gap-2">
              {navLinks.map((link) => (
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
              Contact
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p>{siteConfig.email}</p>
              <p>{siteConfig.phone}</p>
              <p>{siteConfig.location}</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {siteConfig.name}. Frontend demo crafted
          for presentation and future backend integration.
        </p>
      </div>
    </footer>
  )
}