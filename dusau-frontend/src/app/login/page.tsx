'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Notice = {
  type: 'success' | 'error'
  message: string
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [notice, setNotice] = useState<Notice | null>(null)

  useEffect(() => {
    let active = true

    async function checkExistingLogin() {
      try {
        const res = await fetch('/api/admin/auth/me', {
          credentials: 'include',
          cache: 'no-store',
        })

        if (active && res.ok) {
          router.replace('/dashboard')
          return
        }
      } finally {
        if (active) setChecking(false)
      }
    }

    checkExistingLogin()

    return () => {
      active = false
    }
  }, [router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setNotice(null)

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        setNotice({
          type: 'error',
          message: 'Unauthorized. Please check email and password.',
        })
        return
      }

      setNotice({ type: 'success', message: 'Login successful.' })
      router.replace('/dashboard')
    } catch {
      setNotice({ type: 'error', message: 'Could not login. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10 text-[hsl(var(--text-main))]">
        <section className="w-full max-w-md rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-6 text-center shadow-xl">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-2xl bg-[hsl(var(--brand-soft))]" />

          <h1 className="font-display mt-5 text-2xl font-black tracking-tight">
            Checking login
          </h1>

          <p className="mt-2 text-sm leading-6 text-[hsl(var(--text-muted))]">
            Please wait while we verify your admin session.
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 text-[hsl(var(--text-main))]">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-[hsl(var(--text-main))] p-6 text-white sm:p-8 lg:p-10">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-white">
            DUSAU Admin
          </span>

          <h1 className="font-display mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Welcome back
          </h1>

          <p className="mt-5 text-base leading-8 text-white/78">
            Login to manage events, committees, alumni, advisors, gallery items, and organization information.
          </p>

          <div className="mt-8 grid gap-3">
            {['Secure admin access', 'Dashboard management', 'Protected organization data'].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-semibold text-white/85"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-7">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--brand))]">
              Admin Login
            </p>

            <h2 className="font-display mt-2 text-3xl font-black tracking-tight text-[hsl(var(--text-main))]">
              Sign in to dashboard
            </h2>

            <p className="mt-3 text-sm leading-7 text-[hsl(var(--text-muted))]">
              Use the admin email and password configured in Supabase.
            </p>
          </div>

          {notice && (
            <div
              className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold leading-6 ${
                notice.type === 'error'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}
            >
              {notice.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-[hsl(var(--text-main))]">
                Admin email
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] px-4 py-3 text-[hsl(var(--text-main))] outline-none transition placeholder:text-[hsl(var(--text-soft))] focus:border-[hsl(var(--brand))] focus:bg-white"
                placeholder="admin@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-[hsl(var(--text-main))]">
                Admin password
              </span>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] px-4 py-3 text-[hsl(var(--text-main))] outline-none transition placeholder:text-[hsl(var(--text-soft))] focus:border-[hsl(var(--brand))] focus:bg-white"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}