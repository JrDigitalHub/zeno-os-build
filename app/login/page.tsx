'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulated loading state — wire to Supabase Auth here
    await new Promise((resolve) => setTimeout(resolve, 1800))

    setIsLoading(false)
    // TODO: Replace with actual Supabase signIn call
    // const { error } = await supabase.auth.signInWithPassword({ email, password })
    // if (error) { setError(error.message); return; }
    // router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Subtle geometric background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow behind card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-sm px-4">
        {/* Card */}
        <div
          className="bg-card border rounded-xl px-8 py-10 shadow-2xl"
          style={{ borderColor: 'rgba(201,168,76,0.2)' }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 mb-5">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zeno-logo-lkiAE73bRovt0MDeLabqYwMQSuit6L.png"
                alt="Zeno OS Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <h1
              className="text-xl font-semibold tracking-widest uppercase"
              style={{ color: '#c9a84c', letterSpacing: '0.25em' }}
            >
              Zeno OS
            </h1>
            <p className="text-xs mt-1 font-mono" style={{ color: '#7a95b0', letterSpacing: '0.15em' }}>
              NEURAL BUSINESS OPERATING SYSTEM
            </p>
          </div>

          {/* Divider */}
          <div className="h-px mb-7" style={{ background: 'rgba(201,168,76,0.15)' }} />

          {/* Form */}
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
                style={{
                  background: 'rgba(201,168,76,0.06)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  color: '#f0f4f8',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(201,168,76,0.5)'
                  e.target.style.boxShadow = '0 0 0 2px rgba(201,168,76,0.08)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(201,168,76,0.2)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-mono uppercase tracking-widest"
                style={{ color: '#7a95b0' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full rounded-md px-4 py-2.5 text-sm font-sans transition-all outline-none"
                style={{
                  background: 'rgba(201,168,76,0.06)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  color: '#f0f4f8',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(201,168,76,0.5)'
                  e.target.style.boxShadow = '0 0 0 2px rgba(201,168,76,0.08)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(201,168,76,0.2)'
                  e.target.style.boxShadow = 'none'
                }}
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
                background: isLoading
                  ? 'rgba(201,168,76,0.5)'
                  : '#c9a84c',
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
          <div className="mt-7 text-center">
            <p className="text-xs font-mono" style={{ color: '#7a95b0' }}>
              Don&apos;t have access?{' '}
              <Link
                href="/onboarding"
                className="transition-colors"
                style={{ color: '#c9a84c' }}
              >
                Request Access
              </Link>
            </p>
          </div>
        </div>

        {/* System tag */}
        <p
          className="text-center mt-5 text-xs font-mono"
          style={{ color: 'rgba(122,149,176,0.4)', letterSpacing: '0.12em' }}
        >
          v2.4.1 · ENTERPRISE EDITION
        </p>
      </div>
    </main>
  )
}

function LoadingDots() {
  return (
    <span className="flex gap-0.5 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-1 h-1 rounded-full"
          style={{
            background: '#0b1929',
            animation: `blink 1.2s ${i * 0.2}s ease-in-out infinite`,
          }}
        />
      ))}
    </span>
  )
}
