'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthCard, { AUTH_INPUT_STYLE, authInputFocus, authInputBlur, LoadingDots } from '@/components/auth-card'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    // TODO: Replace with actual auth call, e.g. Supabase signInWithPassword
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    router.replace('/dashboard')
    // Hard redirect fallback — ensures navigation even if client-side router silently fails
    window.location.href = '/dashboard'
  }

  return (
    <AuthCard>
      {/* Sub-heading */}
      <div className="text-center mb-6 -mt-2">
        <p className="text-xs font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
          Sign in to your workspace
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: '#7a95b0' }}
          >
            Work Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@company.com"
            className="w-full rounded-md px-4 py-2.5 text-sm font-sans transition-all outline-none"
            style={AUTH_INPUT_STYLE}
            onFocus={authInputFocus}
            onBlur={authInputBlur}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-mono uppercase tracking-widest"
              style={{ color: '#7a95b0' }}
            >
              Password
            </label>
            {/* Forgot password link — new */}
            <Link
              href="/forgot-password"
              className="text-[11px] font-mono transition-colors"
              style={{ color: 'rgba(201,168,76,0.65)' }}
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••••••"
            className="w-full rounded-md px-4 py-2.5 text-sm font-sans transition-all outline-none"
            style={AUTH_INPUT_STYLE}
            onFocus={authInputFocus}
            onBlur={authInputBlur}
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 font-mono -mt-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 w-full rounded-md py-3 text-sm font-semibold font-mono uppercase tracking-widest transition-all relative overflow-hidden"
          style={{
            background: isLoading ? 'rgba(201,168,76,0.5)' : '#c9a84c',
            color: '#0b1929',
            letterSpacing: '0.2em',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingDots />
              <span>Initializing...</span>
            </span>
          ) : (
            'Initialize Session'
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-7 flex flex-col items-center gap-2">
        <p className="text-xs font-mono" style={{ color: '#7a95b0' }}>
          Don&apos;t have access?{' '}
          <Link href="/signup" className="transition-colors" style={{ color: '#c9a84c' }}>
            Create an account
          </Link>
        </p>
      </div>
    </AuthCard>
  )
}
