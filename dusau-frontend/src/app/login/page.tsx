'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FadeIn, SectionHeading } from '@/components/ui'
import { checkAdminSession, HttpError, loginAdmin } from '@/lib/frontend/admin-api'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const reason = searchParams.get('reason')

  const reasonMessage = useMemo(() => {
    if (reason === 'session-expired') return 'Your admin session expired. Please log in again.'
    if (reason === 'unauthorized') return 'Please log in to access the dashboard.'
    return ''
  }, [reason])

  // useEffect(() => {
  //   let active = true

  //   async function run() {
  //     try {
  //       const hasSession = await checkAdminSession()
  //       if (!active) return
  //       if (hasSession) router.replace('/dashboard')
  //     } catch (error) {
  //       console.error('Login session check failed', error)
  //     }
  //   }

  //   void run()
  //   return () => {
  //     active = false
  //   }
  // }, [router])


  useEffect(() => {
  let active = true

  async function run() {
    try {
      const hasSession = await checkAdminSession()
      if (!active) return

      if (hasSession) {
        router.replace('/dashboard')
      }
    } catch (error) {
      console.error('Login session check failed', error)
    }
  }

  void run()

  return () => {
    active = false
  }
}, [router])


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const data = await loginAdmin(email, password)
      console.log('[auth] login success', data)
      router.replace('/dashboard')
    } catch (error) {
      console.error('[auth] login failed', error)
      if (error instanceof HttpError) {
        setMessage(error.message)
      } else {
        setMessage('Something went wrong while logging in.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <FadeIn className="glass-strong p-8 lg:p-10">
              <SectionHeading
                eyebrow="Admin access"
                title="Secure access to the DUSAU control panel"
                description="Use the admin credentials configured in your backend environment to manage the platform."
              />

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="glass p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Protected routes</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">Cookie-based admin session</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Login creates a one-hour admin session cookie. Unauthorized requests are redirected back here.
                  </p>
                </div>
                <div className="glass p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">What you can manage</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">Content, people, media, events</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Organization data, committees, alumni, advisors, gallery, member directory, and event media.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.08} className="glass p-8 lg:p-10">
              <span className="pill">Admin login</span>
              <h1 className="font-display mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Welcome back
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Sign in to open the dashboard and manage the live backend-connected content.
              </p>

              {reasonMessage ? (
                <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  {reasonMessage}
                </div>
              ) : null}

              {message ? (
                <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {message}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Admin email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-400/50"
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-fit">
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  )
}