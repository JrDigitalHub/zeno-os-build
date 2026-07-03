'use client'

import Image from 'next/image'

/**
 * AuthCard — shared layout shell for all authentication pages.
 * Provides the dark background (grid + radial glow), centred card frame,
 * logo + wordmark, divider, and system version tag.
 * Each auth page supplies its own form and footer links as children.
 */
export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">

      {/* Subtle gold grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
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
          {/* Logo + wordmark */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 mb-5">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zeno-logo-lkiAE73bRovt0MDeLabqYwMQSuit6L.png"
                alt="Zeno OS Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
                priority
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

          {/* Page-specific content (form + footer links) */}
          {children}
        </div>

        {/* System version tag */}
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

// ── Shared input style helper ──────────────────────────────────────────────

export const AUTH_INPUT_STYLE = {
  background: 'rgba(201,168,76,0.06)',
  border: '1px solid rgba(201,168,76,0.2)',
  color: '#f0f4f8',
} as const

export function authInputFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = 'rgba(201,168,76,0.5)'
  e.target.style.boxShadow = '0 0 0 2px rgba(201,168,76,0.08)'
}
export function authInputBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = 'rgba(201,168,76,0.2)'
  e.target.style.boxShadow = 'none'
}

// ── Shared loading dots ────────────────────────────────────────────────────

export function LoadingDots() {
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
