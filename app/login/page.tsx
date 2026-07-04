'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useToast } from '@/hooks/use-toast'
import AuthCard, { AUTH_INPUT_STYLE, authInputFocus, authInputBlur, LoadingDots } from '@/components/auth-card'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
    )

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (signUpError) throw signUpError

        if (data.session) {
          toast({
            title: 'Account Created',
            description: 'Initializing your Zeno OS session...',
            variant: 'success',
          })
          router.push('/dashboard')
          router.refresh()
        } else {
          toast({
            title: 'Verification Sent',
            description: 'Check your inbox to confirm your account.',
            variant: 'success',
          })
          setError('Confirmation email sent! Please check your inbox.')
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError

        toast({
          title: 'Session Initialized',
          description: 'Welcome back to Zeno OS.',
          variant: 'success',
        })
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Authentication failed. Please try again.'
      setError(errMsg)
      toast({
        title: 'Authentication Error',
        description: errMsg,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard>
      {/* Sub-heading */}
      <div className="text-center mb-6 -mt-2">
        <p className="text-xs font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
          {isSignUp ? 'Create a new workspace session' : 'Sign in to your workspace'}
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
            {!isSignUp && (
              <Link
                href="/forgot-password"
                className="text-[11px] font-mono transition-colors"
                style={{ color: 'rgba(201,168,76,0.65)' }}
              >
                Forgot password?
              </Link>
            )}
          </div>
          <input
            id="password"
            type="password"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
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
              <span>{isSignUp ? 'Creating...' : 'Initializing...'}</span>
            </span>
          ) : (
            isSignUp ? 'Create Account' : 'Initialize Session'
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-7 flex flex-col items-center gap-2">
        <p className="text-xs font-mono" style={{ color: '#7a95b0' }}>
          {isSignUp ? 'Already have an account?' : "Don't have access?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            className="transition-colors underline cursor-pointer font-bold"
            style={{ color: '#c9a84c' }}
          >
            {isSignUp ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </div>
    </AuthCard>
  )
}
