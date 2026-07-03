'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import AuthCard, { AUTH_INPUT_STYLE, authInputFocus, authInputBlur, LoadingDots } from '@/components/auth-card'

export default function SignUpPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const passwordMismatch =
    form.confirm.length > 0 && form.password !== form.confirm

  const isValid =
    form.name.trim() &&
    form.email.trim() &&
    form.password.length >= 8 &&
    form.password === form.confirm

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    setError('')
    setIsLoading(true)
    // TODO: Replace with real auth call (Supabase signUp, Firebase createUser, etc.)
    await new Promise((res) => setTimeout(res, 1500))
    setIsLoading(false)
    router.replace('/dashboard')
  }

  const inputClass =
    'w-full rounded-md px-4 py-2.5 text-sm font-sans transition-all outline-none'

  return (
    <AuthCard>
      {/* Sub-heading */}
      <div className="text-center mb-6 -mt-2">
        <p className="text-xs font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
          Create your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Full name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-name" className="text-xs font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={set('name')}
            required
            placeholder="e.g. James Reeves"
            className={inputClass}
            style={AUTH_INPUT_STYLE}
            onFocus={authInputFocus}
            onBlur={authInputBlur}
          />
        </div>

        {/* Work email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-email" className="text-xs font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
            Work Email
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
            required
            placeholder="you@company.com"
            className={inputClass}
            style={AUTH_INPUT_STYLE}
            onFocus={authInputFocus}
            onBlur={authInputBlur}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-password" className="text-xs font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.password}
              onChange={set('password')}
              required
              minLength={8}
              placeholder="Min. 8 characters"
              className={`${inputClass} pr-10`}
              style={AUTH_INPUT_STYLE}
              onFocus={authInputFocus}
              onBlur={authInputBlur}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: '#7a95b0' }}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {/* Strength hint */}
          {form.password.length > 0 && (
            <div className="flex items-center gap-2">
              {[8, 12, 16].map((len) => (
                <div
                  key={len}
                  className="h-0.5 flex-1 rounded-full transition-all duration-300"
                  style={{
                    background:
                      form.password.length >= len
                        ? form.password.length >= 16
                          ? '#4a9c5d'
                          : form.password.length >= 12
                          ? '#c9a84c'
                          : '#e0a052'
                        : 'rgba(122,149,176,0.15)',
                  }}
                />
              ))}
              <span className="text-[10px] font-mono flex-shrink-0" style={{ color: '#7a95b0' }}>
                {form.password.length < 8 ? 'Too short' : form.password.length < 12 ? 'Fair' : form.password.length < 16 ? 'Good' : 'Strong'}
              </span>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-confirm" className="text-xs font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="signup-confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.confirm}
              onChange={set('confirm')}
              required
              placeholder="Re-enter password"
              className={`${inputClass} pr-10`}
              style={{
                ...AUTH_INPUT_STYLE,
                borderColor: passwordMismatch ? 'rgba(224,82,82,0.5)' : AUTH_INPUT_STYLE.border,
              }}
              onFocus={authInputFocus}
              onBlur={authInputBlur}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: '#7a95b0' }}
              tabIndex={-1}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {passwordMismatch && (
            <p className="text-[11px] font-mono" style={{ color: '#e05252' }}>
              Passwords do not match
            </p>
          )}
          {!passwordMismatch && form.confirm && form.password === form.confirm && (
            <p className="flex items-center gap-1 text-[11px] font-mono" style={{ color: '#4a9c5d' }}>
              <CheckCircle2 size={11} /> Passwords match
            </p>
          )}
        </div>

        {error && (
          <p className="text-xs font-mono" style={{ color: '#e05252' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="mt-1 w-full rounded-md py-3 text-sm font-semibold font-mono uppercase tracking-widest transition-all"
          style={{
            background: !isValid || isLoading ? 'rgba(201,168,76,0.5)' : '#c9a84c',
            color: '#0b1929',
            letterSpacing: '0.2em',
            cursor: !isValid || isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingDots />
              <span>Creating Account…</span>
            </span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Footer links */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-xs font-mono" style={{ color: '#7a95b0' }}>
          Already have an account?{' '}
          <Link href="/login" className="transition-colors" style={{ color: '#c9a84c' }}>
            Sign in
          </Link>
        </p>
        <p className="text-xs font-mono" style={{ color: '#7a95b0' }}>
          Need enterprise access?{' '}
          <a
            href="mailto:info@jrdigitalhubltd.com?subject=Zeno%20OS%20Enterprise%20Enquiry"
            style={{ color: '#c9a84c' }}
          >
            Contact us
          </a>
        </p>
      </div>
    </AuthCard>
  )
}
