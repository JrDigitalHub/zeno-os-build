'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import AuthCard, { AUTH_INPUT_STYLE, authInputFocus, authInputBlur, LoadingDots } from '@/components/auth-card'

type PageState = 'form' | 'loading' | 'sent'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [pageState, setPageState] = useState<PageState>('form')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setPageState('loading')
    // TODO: Replace with real password-reset call (Supabase resetPasswordForEmail, etc.)
    await new Promise((res) => setTimeout(res, 1400))
    setPageState('sent')
  }

  return (
    <AuthCard>

      {/* ── Success state ── */}
      {pageState === 'sent' ? (
        <div className="flex flex-col items-center gap-5 py-2">
          {/* Animated check */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(74,156,93,0.1)',
              border: '1.5px solid rgba(74,156,93,0.3)',
            }}
          >
            <CheckCircle2 size={28} style={{ color: '#4a9c5d' }} />
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold mb-1.5" style={{ color: '#f0f4f8' }}>
              Check your inbox
            </p>
            <p className="text-xs font-mono leading-relaxed" style={{ color: '#7a95b0' }}>
              A password reset link has been sent to{' '}
              <span style={{ color: '#c9a84c' }}>{email}</span>.{' '}
              Check your spam folder if it doesn't appear within a minute.
            </p>
          </div>

          <div className="w-full flex flex-col gap-2.5 mt-2">
            <button
              onClick={() => { setEmail(''); setPageState('form') }}
              className="w-full rounded-md py-2.5 text-xs font-mono uppercase tracking-widest transition-all"
              style={{
                background: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,168,76,0.25)',
                color: '#c9a84c',
              }}
            >
              Try a different email
            </button>
            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-md text-xs font-mono transition-all"
              style={{ color: '#7a95b0', border: '1px solid rgba(122,149,176,0.15)' }}
            >
              <ArrowLeft size={12} />
              Back to sign in
            </Link>
          </div>
        </div>
      ) : (
        /* ── Form state ── */
        <>
          {/* Sub-heading */}
          <div className="text-center mb-6 -mt-2">
            <p className="text-xs font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
              Password Reset
            </p>
          </div>

          <p className="text-xs font-mono text-center mb-5 leading-relaxed" style={{ color: '#7a95b0' }}>
            Enter the work email address linked to your account and we'll send you a secure reset link.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="reset-email"
                className="text-xs font-mono uppercase tracking-widest"
                style={{ color: '#7a95b0' }}
              >
                Work Email
              </label>
              <div className="relative">
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                  className="w-full rounded-md px-4 py-2.5 pl-10 text-sm font-sans transition-all outline-none"
                  style={AUTH_INPUT_STYLE}
                  onFocus={authInputFocus}
                  onBlur={authInputBlur}
                />
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: '#7a95b0' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!email.trim() || pageState === 'loading'}
              className="w-full rounded-md py-3 text-sm font-semibold font-mono uppercase tracking-widest transition-all"
              style={{
                background: !email.trim() || pageState === 'loading'
                  ? 'rgba(201,168,76,0.5)'
                  : '#c9a84c',
                color: '#0b1929',
                letterSpacing: '0.2em',
                cursor: !email.trim() || pageState === 'loading' ? 'not-allowed' : 'pointer',
              }}
            >
              {pageState === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingDots />
                  <span>Sending link…</span>
                </span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 text-xs font-mono transition-colors"
              style={{ color: '#7a95b0' }}
            >
              <ArrowLeft size={12} />
              Back to sign in
            </Link>
          </div>
        </>
      )}
    </AuthCard>
  )
}
