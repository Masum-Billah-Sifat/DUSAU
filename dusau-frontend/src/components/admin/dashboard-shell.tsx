'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { adminJson } from '@/lib/admin/api';

type AuthMeResponse = {
  ok: boolean;
  admin?: {
    email?: string;
  };
};

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/organization', label: 'Organization' },
  { href: '/dashboard/alumni', label: 'Alumni' },
  { href: '/dashboard/advisors', label: 'Advisors' },
  { href: '/dashboard/gallery', label: 'Gallery' },
  { href: '/dashboard/committees', label: 'Committees' },
  { href: '/dashboard/events', label: 'Events' },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');

  const activeLabel = useMemo(() => {
    const active = navItems
      .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0];

    return active?.label ?? 'Dashboard';
  }, [pathname]);

  useEffect(() => {
    let ignore = false;

    async function checkAuth() {
      try {
        const data = await adminJson<AuthMeResponse>('/api/admin/auth/me');

        if (!ignore) {
          setAdminEmail(data.admin?.email || '');
          setLoading(false);
        }
      } catch {
        if (!ignore) {
          router.replace('/login');
        }
      }
    }

    checkAuth();

    return () => {
      ignore = true;
    };
  }, [router]);

  async function logout() {
    try {
      await adminJson('/api/admin/auth/logout', {
        method: 'POST',
      });
    } finally {
      router.replace('/login');
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm text-slate-300">Checking admin session...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-slate-950/95 p-5 lg:block">
        <Link href="/dashboard" className="block">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-300">DUSAU</p>
          <h1 className="mt-2 text-2xl font-bold">Admin Panel</h1>
        </Link>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Logged in as</p>
          <p className="mt-1 break-all text-sm font-medium">{adminEmail || 'Admin'}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-4 w-full rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Dashboard</p>
              <h2 className="text-2xl font-bold">{activeLabel}</h2>
            </div>

            <div className="flex gap-2 overflow-x-auto lg:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium ${
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}