'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Notice = {
  type: 'success' | 'error';
  message: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    let active = true;

    async function checkExistingLogin() {
      try {
        const res = await fetch('/api/admin/auth/me', {
          credentials: 'include',
          cache: 'no-store',
        });

        if (active && res.ok) {
          router.replace('/dashboard');
          return;
        }
      } finally {
        if (active) setChecking(false);
      }
    }

    checkExistingLogin();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setNotice(null);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setNotice({ type: 'error', message: 'Unauthorized. Please check email and password.' });
        return;
      }

      setNotice({ type: 'success', message: 'Login successful.' });
      router.replace('/dashboard');
    } catch {
      setNotice({ type: 'error', message: 'Could not login. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <p className="text-sm text-slate-300">Checking login...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">DUSAU Admin</p>
          <h1 className="mt-2 text-3xl font-semibold">Login</h1>
          <p className="mt-2 text-sm text-slate-300">
            Use the admin email and password configured in Supabase.
          </p>
        </div>

        {notice && (
          <div
            className={`mb-4 rounded-xl px-4 py-3 text-sm ${
              notice.type === 'error'
                ? 'border border-red-400/40 bg-red-500/10 text-red-100'
                : 'border border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
            }`}
          >
            {notice.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-200">Admin email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none ring-0 transition focus:border-white/30"
              placeholder="admin@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-200">Admin password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none ring-0 transition focus:border-white/30"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
}
