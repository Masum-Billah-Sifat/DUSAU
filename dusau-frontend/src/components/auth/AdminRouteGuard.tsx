'use client'

import { ReactNode, useEffect, useState } from 'react'
import { checkAdminSession, redirectToLogin } from '@/lib/frontend/admin-api'

export default function AdminRouteGuard({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'ready'>('checking')

  useEffect(() => {
    let active = true

    async function run() {
      try {
        const ok = await checkAdminSession()
        if (!active) return

        if (!ok) {
          await redirectToLogin('unauthorized')
          return
        }

        setStatus('ready')
      } catch (error) {
        console.error('Admin session check failed', error)
        if (active) {
          await redirectToLogin('session-expired')
        }
      }
    }

    void run()
    return () => {
      active = false
    }
  }, [])

  if (status === 'checking') {
    return (
      <main className="page-shell">
        <section className="section-shell">
          <div className="container-app">
            <div className="glass-strong p-8">
              <span className="pill">Admin</span>
              <h1 className="font-display mt-5 text-3xl font-semibold text-white">
                Checking session
              </h1>
              <p className="mt-4 text-slate-300">Please wait while we verify your admin access.</p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return <>{children}</>
}