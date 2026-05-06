'use client'

import { DUSAU_SESSION_YEARS } from '@/lib/dusau/session-years'

type TextInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  placeholder?: string
}

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
      <span className="text-sm font-bold text-[hsl(var(--text-main))]">
        {label}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] px-4 py-3 text-sm font-semibold text-[hsl(var(--text-main))] outline-none transition placeholder:text-[hsl(var(--text-soft))] focus:border-[hsl(var(--brand))] focus:bg-white"
      />
    </label>
  )
}

type TextareaInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  rows?: number
  placeholder?: string
}

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
      <span className="text-sm font-bold text-[hsl(var(--text-main))]">
        {label}
      </span>

      <textarea
        required={required}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full resize-none rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] px-4 py-3 text-sm font-semibold text-[hsl(var(--text-main))] outline-none transition placeholder:text-[hsl(var(--text-soft))] focus:border-[hsl(var(--brand))] focus:bg-white"
      />
    </label>
  )
}

type SessionSelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export function SessionSelect({ label, value, onChange, required }: SessionSelectProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-[hsl(var(--text-main))]">
        {label}
      </span>

      <select
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] px-4 py-3 text-sm font-semibold text-[hsl(var(--text-main))] outline-none transition focus:border-[hsl(var(--brand))] focus:bg-white"
      >
        <option value="">Select session</option>
        {DUSAU_SESSION_YEARS.map((session) => (
          <option key={session} value={session}>
            {session}
          </option>
        ))}
      </select>
    </label>
  )
}

type ButtonProps = {
  children: React.ReactNode
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

export function AdminButton({
  children,
  type = 'button',
  onClick,
  disabled,
  variant = 'primary',
}: ButtonProps) {
  const className =
    variant === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : variant === 'secondary'
        ? 'border border-[hsl(var(--border-soft))] bg-white text-[hsl(var(--text-main))] hover:bg-[hsl(var(--brand-soft))]'
        : 'bg-[hsl(var(--brand))] text-white hover:bg-[hsl(var(--brand-hover))]'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-black shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit ${className}`}
    >
      {children}
    </button>
  )
}