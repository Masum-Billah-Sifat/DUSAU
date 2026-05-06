'use client';

import { DUSAU_SESSION_YEARS } from '@/lib/dusau/session-years';

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

export function TextInput({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
}: TextInputProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
      />
    </label>
  );
}

type TextareaInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
  placeholder?: string;
};

export function TextareaInput({
  label,
  value,
  onChange,
  required,
  rows = 4,
  placeholder,
}: TextareaInputProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <textarea
        required={required}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
      />
    </label>
  );
}

type SessionSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export function SessionSelect({ label, value, onChange, required }: SessionSelectProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <select
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
      >
        <option value="">Select session</option>
        {DUSAU_SESSION_YEARS.map((session) => (
          <option key={session} value={session}>
            {session}
          </option>
        ))}
      </select>
    </label>
  );
}

type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
};

export function AdminButton({
  children,
  type = 'button',
  onClick,
  disabled,
  variant = 'primary',
}: ButtonProps) {
  const className =
    variant === 'danger'
      ? 'bg-red-500 text-white hover:bg-red-400'
      : variant === 'secondary'
        ? 'border border-white/10 bg-slate-900 text-white hover:bg-slate-800'
        : 'bg-blue-500 text-white hover:bg-blue-400';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}