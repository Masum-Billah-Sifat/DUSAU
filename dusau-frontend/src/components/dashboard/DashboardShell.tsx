import type { ReactNode } from 'react'
import AdminSidebar from '@/components/dashboard/AdminSidebar'

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <AdminSidebar />
      <main className="min-h-screen lg:pl-[280px]">
        <div className="page-shell">
          <section className="section-shell">
            <div className="container-app">{children}</div>
          </section>
        </div>
      </main>
    </div>
  )
}