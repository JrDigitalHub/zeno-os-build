'use client'

import { useState } from 'react'
import { Plug, CheckCircle2, ArrowRight, Lock } from 'lucide-react'
import Image from 'next/image'

// ── Integration definitions ──────────────────────────────────────────────────

type Category = 'Financial Sync' | 'Communication'

interface Integration {
  id: string
  name: string
  description: string
  category: Category
  agent: string
  logoUrl: string
  comingSoon?: boolean
}

const INTEGRATIONS: Integration[] = [
  // Financial
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Sync revenue, payouts, and invoice data directly into the CFO ledger.',
    category: 'Financial Sync',
    agent: 'CFO',
    logoUrl: 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/stripe/default.svg',
  },
  {
    id: 'mono',
    name: 'Mono',
    description: 'Connect African bank accounts for real-time transaction enrichment.',
    category: 'Financial Sync',
    agent: 'CFO',
    logoUrl: 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/mono/default.svg',
    comingSoon: true,
  },
  {
    id: 'plaid',
    name: 'Plaid',
    description: 'Link US and EU bank accounts to automate cash flow reconciliation.',
    category: 'Financial Sync',
    agent: 'CFO',
    logoUrl: 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/plaid/default.svg',
  },
  // Communication
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    description: 'Allow Oracle to send enriched outreach emails via Gmail and manage Calendar.',
    category: 'Communication',
    agent: 'Oracle',
    logoUrl: 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/google/default.svg',
  },
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    description: 'Connect Outlook and Teams so Oracle can dispatch and track outreach at scale.',
    category: 'Communication',
    agent: 'Oracle',
    logoUrl: 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/microsoft/default.svg',
  },
]

// ── Agent badge accent ────────────────────────────────────────────────────────

const AGENT_ACCENT: Record<string, { color: string; bg: string; border: string }> = {
  CFO: { color: '#e0a052', bg: 'rgba(224,160,82,0.1)', border: 'rgba(224,160,82,0.25)' },
  Oracle: { color: '#c9a84c', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.22)' },
  COO: { color: '#3fbfbf', bg: 'rgba(63,191,191,0.08)', border: 'rgba(63,191,191,0.22)' },
}

// ── Integration card ─────────────────────────────────────────────────────────

function IntegrationCard({ integration }: { integration: Integration }) {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const accent = AGENT_ACCENT[integration.agent]

  async function handleConnect() {
    if (connected || integration.comingSoon) return
    setConnecting(true)
    // TODO: call real OAuth / API-key flow for this integration
    await new Promise((res) => setTimeout(res, 1400))
    setConnecting(false)
    setConnected(true)
  }

  function handleDisconnect() {
    setConnected(false)
  }

  return (
    <div
      className="flex flex-col gap-5 p-6 rounded-2xl transition-all"
      style={{
        background: connected ? 'rgba(74,156,93,0.04)' : '#0f2035',
        border: `1px solid ${connected ? 'rgba(74,156,93,0.25)' : 'rgba(201,168,76,0.12)'}`,
        boxShadow: connected ? '0 0 0 1px rgba(74,156,93,0.1)' : 'none',
      }}
    >
      {/* Top row: logo + badges */}
      <div className="flex items-start justify-between gap-3">
        {/* Logo */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Image
            src={integration.logoUrl}
            alt={integration.name}
            width={28}
            height={28}
            className="object-contain"
            crossOrigin="anonymous"
            onError={(e) => {
              // Fallback to initial letter if SVG fails to load
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>

        {/* Badges */}
        <div className="flex flex-col items-end gap-1.5">
          <span
            className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: accent.bg, color: accent.color, border: `1px solid ${accent.border}` }}
          >
            {integration.agent}
          </span>
          {connected && (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4a9c5d' }} />
              <span className="text-[10px] font-mono" style={{ color: '#4a9c5d' }}>Connected</span>
            </div>
          )}
          {integration.comingSoon && !connected && (
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(122,149,176,0.1)', color: '#7a95b0', border: '1px solid rgba(122,149,176,0.15)' }}
            >
              Coming soon
            </span>
          )}
        </div>
      </div>

      {/* Name + description */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-bold" style={{ color: '#f0f4f8' }}>
          {integration.name}
        </h3>
        <p className="text-xs font-mono leading-relaxed" style={{ color: '#7a95b0' }}>
          {integration.description}
        </p>
      </div>

      {/* Action button */}
      <div className="mt-auto">
        {connected ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <CheckCircle2 size={14} style={{ color: '#4a9c5d' }} />
              <span className="text-xs font-semibold" style={{ color: '#c9a84c' }}>
                Active — data syncing
              </span>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-[11px] font-mono px-2.5 py-1.5 rounded-lg transition-all"
              style={{ color: '#7a95b0', border: '1px solid rgba(122,149,176,0.2)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#e05252')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a95b0')}
            >
              Disconnect
            </button>
          </div>
        ) : integration.comingSoon ? (
          <div
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl"
            style={{ background: 'rgba(122,149,176,0.06)', border: '1px solid rgba(122,149,176,0.12)' }}
          >
            <Lock size={13} style={{ color: '#7a95b0' }} />
            <span className="text-xs font-mono" style={{ color: '#7a95b0' }}>
              Notify me when available
            </span>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all disabled:opacity-70"
            style={{
              background: connecting ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.12)',
              border: `1px solid ${connecting ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.3)'}`,
              color: '#c9a84c',
            }}
            onMouseEnter={(e) => {
              if (!connecting) (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.2)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = connecting
                ? 'rgba(201,168,76,0.08)'
                : 'rgba(201,168,76,0.12)'
            }}
          >
            {connecting ? (
              <>
                <span
                  className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
                />
                Connecting...
              </>
            ) : (
              <>
                Connect
                <ArrowRight size={14} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({ category, count }: { category: Category; count: number }) {
  const isFinancial = category === 'Financial Sync'
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-1 h-5 rounded-full"
        style={{ background: isFinancial ? '#e0a052' : '#c9a84c' }}
      />
      <div>
        <h2 className="text-sm font-bold" style={{ color: '#f0f4f8' }}>
          {category}
        </h2>
        <p className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
          {count} integration{count !== 1 ? 's' : ''} available
        </p>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = ['Financial Sync', 'Communication']

export default function IntegrationsPage() {
  const grouped = CATEGORIES.reduce<Record<Category, Integration[]>>(
    (acc, cat) => {
      acc[cat] = INTEGRATIONS.filter((i) => i.category === cat)
      return acc
    },
    { 'Financial Sync': [], Communication: [] },
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Page header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <Plug size={16} style={{ color: '#c9a84c' }} />
          <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
            Integrations Hub
          </span>
        </div>
        <h1 className="text-xl font-semibold text-balance" style={{ color: '#f0f4f8' }}>
          Connect Your Stack
        </h1>
        <p className="text-xs font-mono mt-1 max-w-lg" style={{ color: '#7a95b0' }}>
          Authorise your financial data sources and communication channels so Zeno agents can
          operate autonomously across your entire business stack.
        </p>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-12">
        {CATEGORIES.map((cat) => (
          <section key={cat}>
            <SectionHeader category={cat} count={grouped[cat].length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped[cat].map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer note */}
      <div
        className="mt-12 flex items-start gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)' }}
      >
        <Lock size={14} style={{ color: '#c9a84c', flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs font-mono leading-relaxed" style={{ color: '#7a95b0' }}>
          All credentials are encrypted at rest using AES-256. Zeno OS never stores raw OAuth tokens
          — only scoped access grants are held and can be revoked at any time from this page.
        </p>
      </div>
    </div>
  )
}
