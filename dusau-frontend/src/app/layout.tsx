import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google'
import './globals.css'
import SiteNavbar from '@/components/site-navbar'
import SiteFooter from '@/components/site-footer'
import ScrollToTopButton from '@/components/scroll-to-top-button'
import { siteConfig } from '@/data/store'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: `${siteConfig.name} | Student Community Platform`,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${grotesk.variable}`}>
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute right-[-7rem] top-16 h-80 w-80 rounded-full bg-red-500/20 blur-3xl" />
          <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="hero-grid absolute inset-0 opacity-30" />
        </div>

        <SiteNavbar />
        {children}
        <ScrollToTopButton />
        <SiteFooter />
      </body>
    </html>
  )
}