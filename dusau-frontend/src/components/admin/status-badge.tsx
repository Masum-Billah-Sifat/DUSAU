'use client';

export function StatusBadge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'green' | 'yellow' | 'red' | 'blue';
}) {
  const className =
    tone === 'green'
      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
      : tone === 'yellow'
        ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-200'
        : tone === 'red'
          ? 'border-red-400/30 bg-red-400/10 text-red-200'
          : tone === 'blue'
            ? 'border-blue-400/30 bg-blue-400/10 text-blue-200'
            : 'border-white/10 bg-white/5 text-slate-300';

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}