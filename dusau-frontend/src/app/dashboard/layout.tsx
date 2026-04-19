import type { ReactNode } from 'react'
import AdminRouteGuard from '@/components/auth/AdminRouteGuard'
import DashboardShell from '@/components/dashboard/DashboardShell'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminRouteGuard>
      <DashboardShell>{children}</DashboardShell>
    </AdminRouteGuard>
  )
}