'use client'

import type { ButtonHTMLAttributes, FormEvent, ReactNode } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { adminJson } from '@/lib/admin/api'

const dashboardCards = [
  {
    href: '/dashboard/organization',
    title: 'Organization',
    description: 'Update public contact info, cover title, description, and cover image.',
  },
  {
    href: '/dashboard/alumni',
    title: 'Alumni',
    description: 'Create, edit, pin, archive, and organize alumni profiles.',
  },
  {
    href: '/dashboard/advisors',
    title: 'Advisors',
    description: 'Manage advisor profiles and highlight selected advisors publicly.',
  },
  {
    href: '/dashboard/gallery',
    title: 'Gallery',
    description: 'Upload gallery items and control which memories appear on the public site.',
  },
  {
    href: '/dashboard/committees',
    title: 'Committees',
    description: 'Create yearly committees, manage members, and pin the active leadership.',
  },
  {
    href: '/dashboard/events',
    title: 'Events',
    description: 'Publish events with cover images, gallery photos, videos, and dates.',
  },
]

function NoticeBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700">
      {children}
    </div>
  )
}

function AdminCard({
  title,
  description,
  href,
  index,
}: {
  title: string
  description: string
  href: string
  index: number
}) {
  return (
    <Link
      href={href}
      className="group rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[hsl(var(--brand)_/_0.35)] hover:shadow-xl"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[hsl(var(--brand-soft))] text-sm font-black text-[hsl(var(--brand))] transition group-hover:bg-[hsl(var(--brand))] group-hover:text-white">
        {String(index + 1).padStart(2, '0')}
      </div>

      <h2 className="font-display mt-5 text-xl font-black tracking-tight text-[hsl(var(--text-main))]">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-7 text-[hsl(var(--text-muted))]">
        {description}
      </p>

      <p className="mt-5 text-sm font-black text-[hsl(var(--brand))]">
        Manage →
      </p>
    </Link>
  )
}

function Field({
  label,
  type,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string
  type: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-[hsl(var(--text-main))]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] px-4 py-3 text-sm font-semibold text-[hsl(var(--text-main))] outline-none transition placeholder:text-[hsl(var(--text-soft))] focus:border-[hsl(var(--brand))] focus:bg-white"
      />
    </label>
  )
}

function ActionButton({
  children,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'danger'
}) {
  const className =
    variant === 'danger'
      ? 'inline-flex w-full items-center justify-center rounded-full bg-red-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit'
      : 'inline-flex w-full items-center justify-center rounded-full bg-[hsl(var(--brand))] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[hsl(var(--brand-hover))] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit'

  return (
    <button {...props} className={className}>
      {children}
    </button>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [notice, setNotice] = useState<string | null>(null)
  const [currentPasswordForPassword, setCurrentPasswordForPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')

  async function logoutAll() {
    try {
      await adminJson('/api/admin/auth/logout-all', {
        method: 'POST',
      })

      router.replace('/login')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Logout all failed.')
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice(null)

    try {
      await adminJson('/api/admin/auth/change-password', {
        method: 'PATCH',
        body: JSON.stringify({
          current_password: currentPasswordForPassword,
          new_password: newPassword,
        }),
      })

      router.replace('/login')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Password change failed.')
    }
  }

  async function changeEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice(null)

    try {
      await adminJson('/api/admin/auth/change-email', {
        method: 'PATCH',
        body: JSON.stringify({
          current_password: currentPasswordForEmail,
          new_admin_email: newAdminEmail,
        }),
      })

      router.replace('/login')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Email change failed.')
    }
  }

  return (
    <div className="space-y-6">
      {notice && <NoticeBox>{notice}</NoticeBox>}

      <section className="overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white shadow-xl">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-[hsl(var(--text-main))] p-6 text-white sm:p-8 lg:p-10">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-white">
              Admin Overview
            </span>

            <h1 className="font-display mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Manage the public DUSAU platform from one place
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
              Use this dashboard to keep the website updated with real organization information, events, committee members, alumni, advisors, and gallery content.
            </p>
          </div>

          <div className="grid gap-4 bg-[hsl(var(--brand-soft))] p-6 sm:grid-cols-2 sm:p-8 lg:p-10">
            <div className="rounded-[1.5rem] border border-[hsl(var(--brand)_/_0.16)] bg-white p-5 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--brand))]">
                Content
              </p>
              <p className="mt-2 text-2xl font-black text-[hsl(var(--text-main))]">
                Public Site
              </p>
              <p className="mt-2 text-sm leading-6 text-[hsl(var(--text-muted))]">
                Control what visitors see.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[hsl(var(--brand)_/_0.16)] bg-white p-5 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--brand))]">
                Access
              </p>
              <p className="mt-2 text-2xl font-black text-[hsl(var(--text-main))]">
                Admin Only
              </p>
              <p className="mt-2 text-sm leading-6 text-[hsl(var(--text-muted))]">
                Protected by login session.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="font-display text-2xl font-black tracking-tight text-[hsl(var(--text-main))]">
            Manage sections
          </h2>
          <p className="mt-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
            Choose a module below to update the corresponding part of the public website.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {dashboardCards.map((card, index) => (
            <AdminCard
              key={card.href}
              href={card.href}
              title={card.title}
              description={card.description}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <form
          onSubmit={changePassword}
          className="rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="font-display text-2xl font-black tracking-tight text-[hsl(var(--text-main))]">
            Change password
          </h2>

          <p className="mt-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
            Updating the password will revoke all sessions and require a fresh login.
          </p>

          <div className="mt-5 space-y-4">
            <Field
              label="Current password"
              type="password"
              value={currentPasswordForPassword}
              onChange={setCurrentPasswordForPassword}
              required
            />

            <Field
              label="New password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              required
            />

            <ActionButton type="submit">Change password</ActionButton>
          </div>
        </form>

        <form
          onSubmit={changeEmail}
          className="rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="font-display text-2xl font-black tracking-tight text-[hsl(var(--text-main))]">
            Change admin email
          </h2>

          <p className="mt-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
            Updating the email will revoke all sessions and require login again.
          </p>

          <div className="mt-5 space-y-4">
            <Field
              label="Current password"
              type="password"
              value={currentPasswordForEmail}
              onChange={setCurrentPasswordForEmail}
              required
            />

            <Field
              label="New admin email"
              type="email"
              value={newAdminEmail}
              onChange={setNewAdminEmail}
              required
            />

            <ActionButton type="submit">Change email</ActionButton>
          </div>
        </form>
      </section>

      <section className="rounded-[1.7rem] border border-red-200 bg-red-50 p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-2xl font-black tracking-tight text-red-800">
          Security
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-7 text-red-700">
          Logout from all sessions if you think the admin account is open on another device.
        </p>

        <div className="mt-5">
          <ActionButton variant="danger" type="button" onClick={logoutAll}>
            Logout from all sessions
          </ActionButton>
        </div>
      </section>
    </div>
  )
}